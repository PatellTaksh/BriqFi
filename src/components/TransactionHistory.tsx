import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Activity, ArrowUpRight, ArrowDownRight, Plus, Minus } from 'lucide-react';
import { EmptyState } from '@/components/EmptyState';

interface Transaction {
  id: string;
  transaction_type: string;
  asset: string;
  amount: number;
  status: string;
  created_at: string;
  transaction_hash?: string;
}

export function TransactionHistory() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user]);

  const fetchTransactions = async () => {
    if (!user) return;

    setLoading(true);
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20);

    if (!error && data) {
      setTransactions(data);
    }
    setLoading(false);
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'lend':
      case 'add_collateral':
        return <ArrowUpRight className="h-4 w-4 text-primary" />;
      case 'withdraw':
      case 'repay':
        return <ArrowDownRight className="h-4 w-4 text-secondary" />;
      case 'borrow':
        return <Plus className="h-4 w-4 text-accent" />;
      default:
        return <Activity className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'lend':
      case 'add_collateral':
        return 'text-primary';
      case 'withdraw':
      case 'repay':
        return 'text-secondary';
      case 'borrow':
        return 'text-accent';
      default:
        return 'text-muted-foreground';
    }
  };

  const formatTransactionType = (type: string) => {
    switch (type) {
      case 'lend':
        return 'Lend';
      case 'withdraw':
        return 'Withdraw';
      case 'borrow':
        return 'Borrow';
      case 'repay':
        return 'Repay';
      case 'add_collateral':
        return 'Add Collateral';
      default:
        return type;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Transaction History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Activity className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Loading transactions...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (transactions.length === 0) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Transaction History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={Activity}
            title="No Transactions Yet"
            description="Your transaction history will appear here once you start lending, borrowing, or staking."
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Transaction History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-3 bg-muted/20 rounded-lg border border-border/50"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center border border-border">
                  {getTransactionIcon(transaction.transaction_type)}
                </div>
                <div>
                  <p className="font-medium">
                    {formatTransactionType(transaction.transaction_type)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(transaction.created_at)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold ${getTransactionColor(transaction.transaction_type)}`}>
                  {transaction.amount} {transaction.asset}
                </p>
                <Badge 
                  variant={transaction.status === 'completed' ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {transaction.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}