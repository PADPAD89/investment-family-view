
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusCircle, TrendingUp, TrendingDown, DollarSign, Wallet, Settings } from "lucide-react";
import { MainDashboard } from "@/components/MainDashboard";
import { MemberDashboard } from "@/components/MemberDashboard";
import { InvestmentModal } from "@/components/InvestmentModal";
import { MemberModal } from "@/components/MemberModal";
import { usePortfolio, type Investment } from "@/context/PortfolioContext";

const Index = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [editingInvestment, setEditingInvestment] = useState<Investment | null>(null);
  const [selectedMember, setSelectedMember] = useState("");
  const { state, addInvestment, editInvestment, deleteInvestment } = usePortfolio();

  const handleAddInvestment = (member: string) => {
    setSelectedMember(member);
    setEditingInvestment(null);
    setIsModalOpen(true);
  };

  const handleEditInvestment = (investment: Investment) => {
    setEditingInvestment(investment);
    setSelectedMember(investment.member);
    setIsModalOpen(true);
  };

  const handleSaveInvestment = (investmentData: Omit<Investment, 'id'>) => {
    if (editingInvestment) {
      editInvestment({ ...investmentData, id: editingInvestment.id });
    } else {
      addInvestment(investmentData);
    }
    setIsModalOpen(false);
    setEditingInvestment(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        <header className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Local Investment Dashboard</h1>
            <p className="text-gray-600">Track and manage your family's investment portfolio</p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setIsMemberModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            Manage Members
          </Button>
        </header>

        <Tabs defaultValue="main" className="w-full">
          <TabsList className={`grid w-full mb-8`} style={{ gridTemplateColumns: `repeat(${state.members.length + 1}, minmax(0, 1fr))` }}>
            <TabsTrigger value="main" className="text-sm font-medium">
              Main Dashboard
            </TabsTrigger>
            {state.members.map((member) => (
              <TabsTrigger key={member} value={member.toLowerCase()} className="text-sm font-medium">
                {member}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="main">
            <MainDashboard 
              investments={state.investments} 
              onEditInvestment={handleEditInvestment}
              onDeleteInvestment={deleteInvestment}
            />
          </TabsContent>

          {state.members.map((member) => (
            <TabsContent key={member} value={member.toLowerCase()}>
              <MemberDashboard 
                member={member}
                investments={state.investments.filter(inv => inv.member === member)}
                onAddInvestment={() => handleAddInvestment(member)}
                onEditInvestment={handleEditInvestment}
                onDeleteInvestment={deleteInvestment}
              />
            </TabsContent>
          ))}


        </Tabs>

        <InvestmentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveInvestment}
          member={selectedMember}
          editingInvestment={editingInvestment}
        />
        
        <MemberModal
          isOpen={isMemberModalOpen}
          onClose={() => setIsMemberModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default Index;
