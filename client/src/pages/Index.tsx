
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusCircle, TrendingUp, TrendingDown, DollarSign, Wallet } from "lucide-react";
import { MainDashboard } from "@/components/MainDashboard";
import { MemberDashboard } from "@/components/MemberDashboard";
import { InvestmentModal } from "@/components/InvestmentModal";
import { useInvestmentData } from "@/hooks/useInvestmentData";

const Index = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInvestment, setEditingInvestment] = useState(null);
  const [selectedMember, setSelectedMember] = useState("");
  const { investments, addInvestment, updateInvestment, deleteInvestment, members } = useInvestmentData();

  const handleAddInvestment = (member) => {
    setSelectedMember(member);
    setEditingInvestment(null);
    setIsModalOpen(true);
  };

  const handleEditInvestment = (investment) => {
    setEditingInvestment(investment);
    setSelectedMember(investment.member);
    setIsModalOpen(true);
  };

  const handleSaveInvestment = (investmentData) => {
    if (editingInvestment) {
      updateInvestment({ ...investmentData, id: editingInvestment.id });
    } else {
      addInvestment(investmentData);
    }
    setIsModalOpen(false);
    setEditingInvestment(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Local Investment Dashboard</h1>
          <p className="text-gray-600">Track and manage your family's investment portfolio</p>
        </header>

        <Tabs defaultValue="main" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="main" className="text-sm font-medium">
              Main Dashboard
            </TabsTrigger>
            <TabsTrigger value="manas" className="text-sm font-medium">
              Manas
            </TabsTrigger>
            <TabsTrigger value="father" className="text-sm font-medium">
              Father
            </TabsTrigger>
            <TabsTrigger value="mother" className="text-sm font-medium">
              Mother
            </TabsTrigger>
            <TabsTrigger value="add" disabled className="text-sm font-medium opacity-50">
              + Add Member
            </TabsTrigger>
          </TabsList>

          <TabsContent value="main">
            <MainDashboard 
              investments={investments} 
              onEditInvestment={handleEditInvestment}
              onDeleteInvestment={deleteInvestment}
            />
          </TabsContent>

          <TabsContent value="manas">
            <MemberDashboard 
              member="Manas"
              investments={investments.filter(inv => inv.member === "Manas")}
              onAddInvestment={() => handleAddInvestment("Manas")}
              onEditInvestment={handleEditInvestment}
              onDeleteInvestment={deleteInvestment}
            />
          </TabsContent>

          <TabsContent value="father">
            <MemberDashboard 
              member="Father"
              investments={investments.filter(inv => inv.member === "Father")}
              onAddInvestment={() => handleAddInvestment("Father")}
              onEditInvestment={handleEditInvestment}
              onDeleteInvestment={deleteInvestment}
            />
          </TabsContent>

          <TabsContent value="mother">
            <MemberDashboard 
              member="Mother"
              investments={investments.filter(inv => inv.member === "Mother")}
              onAddInvestment={() => handleAddInvestment("Mother")}
              onEditInvestment={handleEditInvestment}
              onDeleteInvestment={deleteInvestment}
            />
          </TabsContent>
        </Tabs>

        <InvestmentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveInvestment}
          member={selectedMember}
          editingInvestment={editingInvestment}
        />
      </div>
    </div>
  );
};

export default Index;
