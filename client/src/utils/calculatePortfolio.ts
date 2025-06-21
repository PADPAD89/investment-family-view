import { Investment } from '../hooks/useInvestmentData';

export function getTotalInvested(investments: Investment[]): number {
  return investments.reduce((total, inv) => total + (inv.units * inv.buyPrice), 0);
}

export function getCurrentValue(investments: Investment[]): number {
  return investments.reduce((total, inv) => total + (inv.units * inv.currentPrice), 0);
}

export function getGainLoss(investments: Investment[]): { absolute: number; percent: number } {
  const totalInvested = getTotalInvested(investments);
  const currentValue = getCurrentValue(investments);
  const absolute = currentValue - totalInvested;
  const percent = totalInvested > 0 ? (absolute / totalInvested) * 100 : 0;
  
  return { absolute, percent };
}

export function getInvestmentGainLoss(investment: Investment): { absolute: number; percent: number } {
  const invested = investment.units * investment.buyPrice;
  const current = investment.units * investment.currentPrice;
  const absolute = current - invested;
  const percent = invested > 0 ? (absolute / invested) * 100 : 0;
  
  return { absolute, percent };
}

export function getMemberPortfolioData(investments: Investment[], member: string) {
  const memberInvestments = investments.filter(inv => inv.member === member);
  return {
    totalInvested: getTotalInvested(memberInvestments),
    currentValue: getCurrentValue(memberInvestments),
    gainLoss: getGainLoss(memberInvestments),
    investments: memberInvestments
  };
}

export function getAssetTypeBreakdown(investments: Investment[]) {
  const breakdown = investments.reduce((acc, inv) => {
    const value = inv.units * inv.currentPrice;
    const type = inv.type; // Already 'Equity' or 'Mutual Fund'
    acc[type] = (acc[type] || 0) + value;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(breakdown).map(([name, value]) => ({ name, value }));
}

export function getMemberBreakdown(investments: Investment[]) {
  const breakdown = investments.reduce((acc, inv) => {
    const value = inv.units * inv.currentPrice;
    acc[inv.member] = (acc[inv.member] || 0) + value;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(breakdown).map(([name, value]) => ({ name, value }));
}