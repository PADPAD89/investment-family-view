import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Investment } from '../hooks/useInvestmentData';

interface PortfolioState {
  members: string[];
  investments: Investment[];
}

type PortfolioAction =
  | { type: 'ADD_INVESTMENT'; payload: Omit<Investment, 'id'> }
  | { type: 'EDIT_INVESTMENT'; payload: Investment }
  | { type: 'DELETE_INVESTMENT'; payload: string }
  | { type: 'UPDATE_PRICES'; payload: { id: string; currentPrice: number }[] };

interface PortfolioContextType {
  state: PortfolioState;
  addInvestment: (investment: Omit<Investment, 'id'>) => void;
  editInvestment: (investment: Investment) => void;
  deleteInvestment: (id: string) => void;
  updatePrices: () => void;
}

const initialState: PortfolioState = {
  members: ['Manas', 'Father', 'Mother'],
  investments: [
    {
      id: '1',
      member: 'Manas',
      type: 'Equity',
      symbol: 'INFY',
      name: 'Infosys Ltd',
      units: 10,
      buyPrice: 1500,
      buyDate: '2024-01-01',
      currentPrice: 1700
    },
    {
      id: '2',
      member: 'Manas',
      type: 'Mutual Fund',
      symbol: 'HDFC_TOP100',
      name: 'HDFC Top 100 Fund',
      units: 50,
      buyPrice: 250,
      buyDate: '2024-02-15',
      currentPrice: 280
    },
    {
      id: '3',
      member: 'Father',
      type: 'Equity',
      symbol: 'TCS',
      name: 'Tata Consultancy Services',
      units: 5,
      buyPrice: 3200,
      buyDate: '2024-01-20',
      currentPrice: 3450
    },
    {
      id: '4',
      member: 'Mother',
      type: 'Mutual Fund',
      symbol: 'SBI_BLUECHIP',
      name: 'SBI Blue Chip Fund',
      units: 100,
      buyPrice: 45,
      buyDate: '2024-03-01',
      currentPrice: 48
    },
    {
      id: '5',
      member: 'Father',
      type: 'Equity',
      symbol: 'RELIANCE',
      name: 'Reliance Industries',
      units: 8,
      buyPrice: 2400,
      buyDate: '2024-02-10',
      currentPrice: 2650
    }
  ]
};

function portfolioReducer(state: PortfolioState, action: PortfolioAction): PortfolioState {
  switch (action.type) {
    case 'ADD_INVESTMENT':
      return {
        ...state,
        investments: [
          ...state.investments,
          { ...action.payload, id: Date.now().toString() }
        ]
      };
    case 'EDIT_INVESTMENT':
      return {
        ...state,
        investments: state.investments.map(inv =>
          inv.id === action.payload.id ? action.payload : inv
        )
      };
    case 'DELETE_INVESTMENT':
      return {
        ...state,
        investments: state.investments.filter(inv => inv.id !== action.payload)
      };
    case 'UPDATE_PRICES':
      return {
        ...state,
        investments: state.investments.map(inv => {
          const priceUpdate = action.payload.find(p => p.id === inv.id);
          return priceUpdate ? { ...inv, currentPrice: priceUpdate.currentPrice } : inv;
        })
      };
    default:
      return state;
  }
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(portfolioReducer, initialState);

  const addInvestment = (investment: Omit<Investment, 'id'>) => {
    dispatch({ type: 'ADD_INVESTMENT', payload: investment });
  };

  const editInvestment = (investment: Investment) => {
    dispatch({ type: 'EDIT_INVESTMENT', payload: investment });
  };

  const deleteInvestment = (id: string) => {
    dispatch({ type: 'DELETE_INVESTMENT', payload: id });
  };

  const updatePrices = () => {
    const priceUpdates = state.investments.map(inv => ({
      id: inv.id,
      currentPrice: inv.currentPrice * (0.95 + Math.random() * 0.1) // ±5% price variation
    }));
    dispatch({ type: 'UPDATE_PRICES', payload: priceUpdates });
  };

  return (
    <PortfolioContext.Provider value={{
      state,
      addInvestment,
      editInvestment,
      deleteInvestment,
      updatePrices
    }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
}