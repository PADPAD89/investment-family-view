
import { useState } from 'react';

export interface Investment {
  id: string;
  member: string;
  type: 'Equity' | 'Mutual Fund';
  symbol: string;
  name: string;
  units: number;
  buyPrice: number;
  currentPrice: number;
  buyDate: string;
}

const sampleData: Investment[] = [
  {
    id: '1',
    member: 'Manas',
    type: 'Equity',
    symbol: 'INFY',
    name: 'Infosys Ltd',
    units: 10,
    buyPrice: 1500,
    currentPrice: 1700,
    buyDate: '2024-01-15'
  },
  {
    id: '2',
    member: 'Father',
    type: 'Mutual Fund',
    symbol: '120737',
    name: 'SBI Bluechip Fund',
    units: 20,
    buyPrice: 50,
    currentPrice: 80,
    buyDate: '2024-02-10'
  },
  {
    id: '3',
    member: 'Mother',
    type: 'Equity',
    symbol: 'TCS',
    name: 'Tata Consultancy Services',
    units: 5,
    buyPrice: 3000,
    currentPrice: 3100,
    buyDate: '2024-03-05'
  },
  {
    id: '4',
    member: 'Manas',
    type: 'Mutual Fund',
    symbol: '100016',
    name: 'HDFC Top 100 Fund',
    units: 15,
    buyPrice: 600,
    currentPrice: 750,
    buyDate: '2024-01-20'
  }
];

export const useInvestmentData = () => {
  const [investments, setInvestments] = useState<Investment[]>(sampleData);

  const addInvestment = (investment: Omit<Investment, 'id'>) => {
    const newInvestment = {
      ...investment,
      id: Date.now().toString()
    };
    setInvestments([...investments, newInvestment]);
  };

  const updateInvestment = (updatedInvestment: Investment) => {
    setInvestments(investments.map(inv => 
      inv.id === updatedInvestment.id ? updatedInvestment : inv
    ));
  };

  const deleteInvestment = (id: string) => {
    setInvestments(investments.filter(inv => inv.id !== id));
  };

  const members = ['Manas', 'Father', 'Mother'];

  return {
    investments,
    addInvestment,
    updateInvestment,
    deleteInvestment,
    members
  };
};
