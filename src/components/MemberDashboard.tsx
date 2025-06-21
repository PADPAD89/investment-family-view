
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, DollarSign, Wallet, Plus } from "lucide-react";
import { Investment } from "@/hooks/useInvestmentData";
import { InvestmentCharts } from "./InvestmentCharts";
import { InvestmentTable } from "./InvestmentTable";

interface MemberDashboardProps {
  member: string;
  investments: Investment[];
  onAddInvestment: () => void;
  onEditInvestment: (investment: Investment) => void;
  onDeleteInvestment: (id: string) => void;
}

export const MemberDashboard: React.FC<MemberDashboardProps> = ({
  member,
  investments,
  onAddInvestment,
  onEditInvestment,
  onDeleteInvestment
}) => {
  const totalInvested = investments.reduce((sum, inv) => sum + (inv.units * inv.buyPrice), 0);
  const currentValue = investments.reduce((sum, inv) => sum + (inv.units * inv.currentPrice), 0);
  const totalGainLoss = currentValue - totalInvested;
  const totalGainLossPercent = totalInvested > 0 ? (totalGainLoss / totalInvested) * 100 : 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-8">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{member}'s Portfolio</h2>
          <p className="text-gray-600">Personal investment tracking</p>
        </div>
        <Button onClick={onAddInvestment} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Investment
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Invested</CardTitle>
            <Wallet className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{formatCurrency(totalInvested)}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Current Value</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{formatCurrency(currentValue)}</div>
          </CardContent>
        </Card>

        <Card className={`border-l-4 ${totalGainLoss >= 0 ? 'border-l-green-500' : 'border-l-red-500'}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Gain/Loss</CardTitle>
            {totalGainLoss >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(totalGainLoss)}
            </div>
            <p className={`text-xs ${totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {totalGainLoss >= 0 ? '+' : ''}{totalGainLossPercent.toFixed(2)}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      {investments.length > 0 && <InvestmentCharts investments={investments} />}

      {/* Holdings Table */}
      <Card>
        <CardHeader>
          <CardTitle>{member}'s Holdings</CardTitle>
        </CardHeader>
        <CardContent>
          {investments.length > 0 ? (
            <InvestmentTable 
              investments={investments}
              onEditInvestment={onEditInvestment}
              onDeleteInvestment={onDeleteInvestment}
              showMember={false}
            />
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No investments found</p>
              <Button onClick={onAddInvestment} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add First Investment
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
