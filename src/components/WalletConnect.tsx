import { useAccount, useDisconnect } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wallet, ExternalLink, Copy, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function WalletConnect() {
  const { address, isConnected, connector, chain } = useAccount();
  const { disconnect } = useDisconnect();
  const { toast } = useToast();

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
      });
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const openExplorer = () => {
    if (address && chain?.blockExplorers?.default) {
      window.open(`${chain.blockExplorers.default.url}/address/${address}`, '_blank');
    }
  };

  if (!isConnected) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            Wallet Connection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Connect your wallet to access DeFi features and manage your assets on-chain.
          </p>
          <w3m-button />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            Connected Wallet
          </div>
          <Badge variant="outline" className="text-green-500 border-green-500">
            Connected
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Wallet Info */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg border border-border/50">
            <div>
              <p className="text-sm text-muted-foreground">Wallet Address</p>
              <p className="font-mono text-sm">{formatAddress(address!)}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={copyAddress}>
                <Copy className="h-4 w-4" />
              </Button>
              {chain?.blockExplorers && (
                <Button variant="ghost" size="sm" onClick={openExplorer}>
                  <ExternalLink className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Chain Info */}
          {chain && (
            <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg border border-border/50">
              <div>
                <p className="text-sm text-muted-foreground">Network</p>
                <p className="font-medium">{chain.name}</p>
              </div>
              <Badge variant="secondary">
                {chain.nativeCurrency.symbol}
              </Badge>
            </div>
          )}

          {/* Connector Info */}
          {connector && (
            <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg border border-border/50">
              <div>
                <p className="text-sm text-muted-foreground">Connected via</p>
                <p className="font-medium">{connector.name}</p>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <w3m-button />
          <Button 
            variant="outline" 
            onClick={() => disconnect()}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Disconnect
          </Button>
        </div>

        {/* Security Notice */}
        <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
          <p className="text-sm text-amber-700 dark:text-amber-300">
            <strong>Security:</strong> Your wallet is connected directly to the blockchain. 
            Always verify transaction details before signing.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}