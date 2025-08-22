// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

// BriqFi Token for governance and rewards
contract BriqFiToken is ERC20, Ownable {
    constructor() ERC20("BriqFi", "BRIQ") {
        _mint(msg.sender, 1000000 * 10**decimals()); // 1M total supply
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}

// Main lending protocol contract
contract BriqFiLending is ReentrancyGuard, Ownable, Pausable {
    struct LendingPool {
        IERC20 token;
        uint256 totalDeposited;
        uint256 availableLiquidity;
        uint256 apy; // Annual Percentage Yield in basis points (10000 = 100%)
        bool isActive;
        uint256 lastUpdateTimestamp;
    }

    struct UserPosition {
        uint256 depositedAmount;
        uint256 lastRewardTimestamp;
        uint256 accumulatedRewards;
    }

    struct Loan {
        address borrower;
        IERC20 borrowedAsset;
        uint256 borrowedAmount;
        IERC20 collateralAsset;
        uint256 collateralAmount;
        uint256 interestRate;
        uint256 startTimestamp;
        uint256 lastPaymentTimestamp;
        bool isActive;
        uint256 totalRepaid;
    }

    mapping(uint256 => LendingPool) public lendingPools;
    mapping(uint256 => mapping(address => UserPosition)) public userPositions;
    mapping(uint256 => Loan) public loans;
    
    uint256 public poolCount;
    uint256 public loanCount;
    BriqFiToken public briqfiToken;

    uint256 public constant COLLATERAL_RATIO = 150; // 150% collateralization
    uint256 public constant LIQUIDATION_THRESHOLD = 110; // 110% liquidation threshold

    event PoolCreated(uint256 indexed poolId, address token, uint256 apy);
    event Deposited(uint256 indexed poolId, address indexed user, uint256 amount);
    event Withdrawn(uint256 indexed poolId, address indexed user, uint256 amount);
    event LoanCreated(uint256 indexed loanId, address indexed borrower, uint256 amount);
    event LoanRepaid(uint256 indexed loanId, uint256 amount);
    event LoanLiquidated(uint256 indexed loanId);

    constructor(address _briqfiToken) {
        briqfiToken = BriqFiToken(_briqfiToken);
    }

    // Admin functions
    function createLendingPool(
        address _token,
        uint256 _apy
    ) external onlyOwner {
        lendingPools[poolCount] = LendingPool({
            token: IERC20(_token),
            totalDeposited: 0,
            availableLiquidity: 0,
            apy: _apy,
            isActive: true,
            lastUpdateTimestamp: block.timestamp
        });
        
        emit PoolCreated(poolCount, _token, _apy);
        poolCount++;
    }

    function updatePoolAPY(uint256 _poolId, uint256 _newApy) external onlyOwner {
        require(_poolId < poolCount, "Invalid pool ID");
        lendingPools[_poolId].apy = _newApy;
    }

    // Lending functions
    function deposit(uint256 _poolId, uint256 _amount) external nonReentrant whenNotPaused {
        require(_poolId < poolCount, "Invalid pool ID");
        require(_amount > 0, "Amount must be greater than 0");
        
        LendingPool storage pool = lendingPools[_poolId];
        require(pool.isActive, "Pool is not active");

        // Update rewards before changing position
        _updateRewards(_poolId, msg.sender);

        // Transfer tokens from user
        pool.token.transferFrom(msg.sender, address(this), _amount);

        // Update pool and user data
        pool.totalDeposited += _amount;
        pool.availableLiquidity += _amount;
        
        UserPosition storage position = userPositions[_poolId][msg.sender];
        position.depositedAmount += _amount;
        position.lastRewardTimestamp = block.timestamp;

        emit Deposited(_poolId, msg.sender, _amount);
    }

    function withdraw(uint256 _poolId, uint256 _amount) external nonReentrant {
        require(_poolId < poolCount, "Invalid pool ID");
        require(_amount > 0, "Amount must be greater than 0");

        UserPosition storage position = userPositions[_poolId][msg.sender];
        require(position.depositedAmount >= _amount, "Insufficient deposited amount");

        LendingPool storage pool = lendingPools[_poolId];
        require(pool.availableLiquidity >= _amount, "Insufficient liquidity");

        // Update rewards before changing position
        _updateRewards(_poolId, msg.sender);

        // Update pool and user data
        pool.totalDeposited -= _amount;
        pool.availableLiquidity -= _amount;
        position.depositedAmount -= _amount;

        // Transfer tokens back to user
        pool.token.transfer(msg.sender, _amount);

        emit Withdrawn(_poolId, msg.sender, _amount);
    }

    function claimRewards(uint256 _poolId) external nonReentrant {
        _updateRewards(_poolId, msg.sender);
        
        UserPosition storage position = userPositions[_poolId][msg.sender];
        uint256 rewards = position.accumulatedRewards;
        require(rewards > 0, "No rewards to claim");

        position.accumulatedRewards = 0;
        
        // Mint BriqFi tokens as rewards
        briqfiToken.mint(msg.sender, rewards);
    }

    // Borrowing functions
    function borrow(
        uint256 _lendingPoolId,
        uint256 _borrowAmount,
        address _collateralToken,
        uint256 _collateralAmount
    ) external nonReentrant whenNotPaused {
        require(_lendingPoolId < poolCount, "Invalid pool ID");
        require(_borrowAmount > 0, "Borrow amount must be greater than 0");
        require(_collateralAmount > 0, "Collateral amount must be greater than 0");

        LendingPool storage pool = lendingPools[_lendingPoolId];
        require(pool.isActive, "Pool is not active");
        require(pool.availableLiquidity >= _borrowAmount, "Insufficient liquidity");

        // Check collateral ratio (simplified - in practice would use oracle prices)
        uint256 requiredCollateral = (_borrowAmount * COLLATERAL_RATIO) / 100;
        require(_collateralAmount >= requiredCollateral, "Insufficient collateral");

        // Transfer collateral from user
        IERC20(_collateralToken).transferFrom(msg.sender, address(this), _collateralAmount);

        // Create loan
        loans[loanCount] = Loan({
            borrower: msg.sender,
            borrowedAsset: pool.token,
            borrowedAmount: _borrowAmount,
            collateralAsset: IERC20(_collateralToken),
            collateralAmount: _collateralAmount,
            interestRate: pool.apy + 200, // Base rate + 2% spread
            startTimestamp: block.timestamp,
            lastPaymentTimestamp: block.timestamp,
            isActive: true,
            totalRepaid: 0
        });

        // Update pool liquidity
        pool.availableLiquidity -= _borrowAmount;

        // Transfer borrowed tokens to user
        pool.token.transfer(msg.sender, _borrowAmount);

        emit LoanCreated(loanCount, msg.sender, _borrowAmount);
        loanCount++;
    }

    function repayLoan(uint256 _loanId, uint256 _amount) external nonReentrant {
        require(_loanId < loanCount, "Invalid loan ID");
        Loan storage loan = loans[_loanId];
        require(loan.isActive, "Loan is not active");
        require(loan.borrower == msg.sender, "Not loan owner");

        // Calculate total owed including interest
        uint256 timeElapsed = block.timestamp - loan.startTimestamp;
        uint256 interest = (loan.borrowedAmount * loan.interestRate * timeElapsed) / (365 days * 10000);
        uint256 totalOwed = loan.borrowedAmount + interest - loan.totalRepaid;

        require(_amount <= totalOwed, "Repayment exceeds owed amount");

        // Transfer repayment from user
        loan.borrowedAsset.transferFrom(msg.sender, address(this), _amount);

        loan.totalRepaid += _amount;
        loan.lastPaymentTimestamp = block.timestamp;

        // If fully repaid, return collateral and close loan
        if (loan.totalRepaid >= loan.borrowedAmount + interest) {
            loan.collateralAsset.transfer(msg.sender, loan.collateralAmount);
            loan.isActive = false;
        }

        emit LoanRepaid(_loanId, _amount);
    }

    // Internal functions
    function _updateRewards(uint256 _poolId, address _user) internal {
        UserPosition storage position = userPositions[_poolId][_user];
        LendingPool storage pool = lendingPools[_poolId];

        if (position.depositedAmount == 0) return;

        uint256 timeElapsed = block.timestamp - position.lastRewardTimestamp;
        uint256 rewards = (position.depositedAmount * pool.apy * timeElapsed) / (365 days * 10000);
        
        position.accumulatedRewards += rewards;
        position.lastRewardTimestamp = block.timestamp;
    }

    // View functions
    function getUserPosition(uint256 _poolId, address _user) external view returns (UserPosition memory) {
        return userPositions[_poolId][_user];
    }

    function getLendingPool(uint256 _poolId) external view returns (LendingPool memory) {
        return lendingPools[_poolId];
    }

    function getLoan(uint256 _loanId) external view returns (Loan memory) {
        return loans[_loanId];
    }

    function calculatePendingRewards(uint256 _poolId, address _user) external view returns (uint256) {
        UserPosition memory position = userPositions[_poolId][_user];
        LendingPool memory pool = lendingPools[_poolId];

        if (position.depositedAmount == 0) return position.accumulatedRewards;

        uint256 timeElapsed = block.timestamp - position.lastRewardTimestamp;
        uint256 newRewards = (position.depositedAmount * pool.apy * timeElapsed) / (365 days * 10000);
        
        return position.accumulatedRewards + newRewards;
    }

    // Emergency functions
    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }
}