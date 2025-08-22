import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'
import { createWeb3Modal } from '@web3modal/wagmi/react'
import { mainnet, sepolia, polygon, arbitrum } from 'wagmi/chains'

// Get projectId from environment or use placeholder
export const projectId = 'YOUR_WALLETCONNECT_PROJECT_ID' // This will be replaced with actual project ID

const metadata = {
  name: 'BriqFi',
  description: 'Modular DeFi platform built with Lego-inspired blocks',
  url: 'https://briqfi.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

// Define chains for the application
const chains = [mainnet, sepolia, polygon, arbitrum] as const

// Create wagmi config
export const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  enableWalletConnect: true,
  enableInjected: true,
  enableCoinbase: true,
})

// Create Web3Modal
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: true,
  enableOnramp: true
})

// Contract addresses (these would be the deployed contract addresses)
export const CONTRACT_ADDRESSES = {
  BRIQFI_LENDING: '0x0000000000000000000000000000000000000000', // Placeholder
  BRIQFI_TOKEN: '0x0000000000000000000000000000000000000000',   // Placeholder
  // Add other contract addresses here
} as const

// Token addresses for common tokens on different chains
export const TOKEN_ADDRESSES = {
  [mainnet.id]: {
    USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    USDC: '0xA0b86a33E6441e2d4e86e7C1B7e5C9e8E3F2b4C5',
    WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    WBTC: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
  },
  [sepolia.id]: {
    USDT: '0x0000000000000000000000000000000000000000', // Placeholder for testnet
    USDC: '0x0000000000000000000000000000000000000000', // Placeholder for testnet
    WETH: '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14',
    WBTC: '0x0000000000000000000000000000000000000000', // Placeholder for testnet
  }
} as const

// ABIs for smart contracts
export const LENDING_CONTRACT_ABI = [
  "function deposit(uint256 _poolId, uint256 _amount) external",
  "function withdraw(uint256 _poolId, uint256 _amount) external", 
  "function borrow(uint256 _lendingPoolId, uint256 _borrowAmount, address _collateralToken, uint256 _collateralAmount) external",
  "function repayLoan(uint256 _loanId, uint256 _amount) external",
  "function claimRewards(uint256 _poolId) external",
  "function getUserPosition(uint256 _poolId, address _user) external view returns (tuple(uint256 depositedAmount, uint256 lastRewardTimestamp, uint256 accumulatedRewards))",
  "function getLendingPool(uint256 _poolId) external view returns (tuple(address token, uint256 totalDeposited, uint256 availableLiquidity, uint256 apy, bool isActive, uint256 lastUpdateTimestamp))",
  "function getLoan(uint256 _loanId) external view returns (tuple(address borrower, address borrowedAsset, uint256 borrowedAmount, address collateralAsset, uint256 collateralAmount, uint256 interestRate, uint256 startTimestamp, uint256 lastPaymentTimestamp, bool isActive, uint256 totalRepaid))",
  "function calculatePendingRewards(uint256 _poolId, address _user) external view returns (uint256)",
  "function poolCount() external view returns (uint256)",
  "function loanCount() external view returns (uint256)",
  "event Deposited(uint256 indexed poolId, address indexed user, uint256 amount)",
  "event Withdrawn(uint256 indexed poolId, address indexed user, uint256 amount)",
  "event LoanCreated(uint256 indexed loanId, address indexed borrower, uint256 amount)",
  "event LoanRepaid(uint256 indexed loanId, uint256 amount)"
] as const

export const ERC20_ABI = [
  "function balanceOf(address owner) external view returns (uint256)",
  "function transfer(address to, uint256 amount) external returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) external returns (bool)",
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function decimals() external view returns (uint8)",
  "function symbol() external view returns (string)",
  "function name() external view returns (string)"
] as const

// Chain-specific configuration
export const SUPPORTED_CHAINS = {
  [mainnet.id]: {
    name: 'Ethereum',
    currency: 'ETH',
    rpcUrl: `https://eth-mainnet.g.alchemy.com/v2/YOUR_ALCHEMY_KEY`,
    blockExplorer: 'https://etherscan.io'
  },
  [sepolia.id]: {
    name: 'Sepolia Testnet',
    currency: 'ETH',
    rpcUrl: `https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_KEY`,
    blockExplorer: 'https://sepolia.etherscan.io'
  },
  [polygon.id]: {
    name: 'Polygon',
    currency: 'MATIC',
    rpcUrl: `https://polygon-mainnet.g.alchemy.com/v2/YOUR_ALCHEMY_KEY`,
    blockExplorer: 'https://polygonscan.com'
  }
} as const