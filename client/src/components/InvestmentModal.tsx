
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Investment } from "@/hooks/useInvestmentData";

interface InvestmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (investment: Omit<Investment, 'id'>) => void;
  member: string;
  editingInvestment?: Investment | null;
}

export const InvestmentModal: React.FC<InvestmentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  member,
  editingInvestment
}) => {
  const [formData, setFormData] = useState({
    member: '',
    type: 'Equity' as 'Equity' | 'Mutual Fund',
    symbol: '',
    name: '',
    units: '',
    buyPrice: '',
    currentPrice: '',
    buyDate: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingInvestment) {
      setFormData({
        member: editingInvestment.member,
        type: editingInvestment.type,
        symbol: editingInvestment.symbol,
        name: editingInvestment.name,
        units: editingInvestment.units.toString(),
        buyPrice: editingInvestment.buyPrice.toString(),
        currentPrice: editingInvestment.currentPrice.toString(),
        buyDate: editingInvestment.buyDate
      });
    } else {
      setFormData({
        member: member,
        type: 'Equity',
        symbol: '',
        name: '',
        units: '',
        buyPrice: '',
        currentPrice: '',
        buyDate: new Date().toISOString().split('T')[0]
      });
    }
    setErrors({});
  }, [editingInvestment, member, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.symbol.trim()) newErrors.symbol = 'Symbol is required';
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.units || parseFloat(formData.units) <= 0) newErrors.units = 'Valid units required';
    if (!formData.buyPrice || parseFloat(formData.buyPrice) <= 0) newErrors.buyPrice = 'Valid buy price required';
    if (!formData.currentPrice || parseFloat(formData.currentPrice) <= 0) newErrors.currentPrice = 'Valid current price required';
    if (!formData.buyDate) newErrors.buyDate = 'Buy date is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const investmentData = {
      member: formData.member,
      type: formData.type,
      symbol: formData.symbol.toUpperCase(),
      name: formData.name,
      units: parseFloat(formData.units),
      buyPrice: parseFloat(formData.buyPrice),
      currentPrice: parseFloat(formData.currentPrice),
      buyDate: formData.buyDate
    };

    onSave(investmentData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {editingInvestment ? 'Edit Investment' : 'Add New Investment'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="member">Member</Label>
              <Input
                id="member"
                value={formData.member}
                disabled
                className="bg-gray-50"
              />
            </div>
            <div>
              <Label htmlFor="type">Asset Type</Label>
              <Select value={formData.type} onValueChange={(value: 'Equity' | 'Mutual Fund') => handleInputChange('type', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Equity">Equity</SelectItem>
                  <SelectItem value="Mutual Fund">Mutual Fund</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="symbol">
              {formData.type === 'Equity' ? 'Ticker Symbol' : 'Fund Code/AMFI Code'}
            </Label>
            <Input
              id="symbol"
              placeholder={formData.type === 'Equity' ? 'e.g., INFY' : 'e.g., 120737'}
              value={formData.symbol}
              onChange={(e) => handleInputChange('symbol', e.target.value)}
              className={errors.symbol ? 'border-red-500' : ''}
            />
            {errors.symbol && <p className="text-red-500 text-sm mt-1">{errors.symbol}</p>}
          </div>

          <div>
            <Label htmlFor="name">
              {formData.type === 'Equity' ? 'Company Name' : 'Fund Name'}
            </Label>
            <Input
              id="name"
              placeholder={formData.type === 'Equity' ? 'e.g., Infosys Ltd' : 'e.g., SBI Bluechip Fund'}
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="units">
                {formData.type === 'Equity' ? 'Quantity' : 'Units'}
              </Label>
              <Input
                id="units"
                type="number"
                step="0.001"
                placeholder="0"
                value={formData.units}
                onChange={(e) => handleInputChange('units', e.target.value)}
                className={errors.units ? 'border-red-500' : ''}
              />
              {errors.units && <p className="text-red-500 text-sm mt-1">{errors.units}</p>}
            </div>
            <div>
              <Label htmlFor="buyPrice">
                {formData.type === 'Equity' ? 'Buy Price (₹)' : 'Buy NAV (₹)'}
              </Label>
              <Input
                id="buyPrice"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.buyPrice}
                onChange={(e) => handleInputChange('buyPrice', e.target.value)}
                className={errors.buyPrice ? 'border-red-500' : ''}
              />
              {errors.buyPrice && <p className="text-red-500 text-sm mt-1">{errors.buyPrice}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="currentPrice">
                {formData.type === 'Equity' ? 'Current Price (₹)' : 'Current NAV (₹)'}
              </Label>
              <Input
                id="currentPrice"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.currentPrice}
                onChange={(e) => handleInputChange('currentPrice', e.target.value)}
                className={errors.currentPrice ? 'border-red-500' : ''}
              />
              {errors.currentPrice && <p className="text-red-500 text-sm mt-1">{errors.currentPrice}</p>}
            </div>
            <div>
              <Label htmlFor="buyDate">Buy Date</Label>
              <Input
                id="buyDate"
                type="date"
                value={formData.buyDate}
                onChange={(e) => handleInputChange('buyDate', e.target.value)}
                className={errors.buyDate ? 'border-red-500' : ''}
              />
              {errors.buyDate && <p className="text-red-500 text-sm mt-1">{errors.buyDate}</p>}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              {editingInvestment ? 'Update' : 'Save'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
