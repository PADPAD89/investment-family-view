import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";

interface MemberModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MemberModal: React.FC<MemberModalProps> = ({ isOpen, onClose }) => {
  const { state, addMember, editMember, deleteMember } = usePortfolio();
  const [newMemberName, setNewMemberName] = useState('');
  const [editingMember, setEditingMember] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const handleAddMember = () => {
    if (newMemberName.trim() && !state.members.includes(newMemberName.trim())) {
      addMember(newMemberName.trim());
      setNewMemberName('');
    }
  };

  const handleEditMember = (oldName: string) => {
    if (editingName.trim() && editingName.trim() !== oldName && !state.members.includes(editingName.trim())) {
      editMember(oldName, editingName.trim());
      setEditingMember(null);
      setEditingName('');
    }
  };

  const handleDeleteMember = (memberName: string) => {
    if (confirm(`Are you sure you want to delete ${memberName}? This will also delete all their investments.`)) {
      deleteMember(memberName);
    }
  };

  const startEditingMember = (memberName: string) => {
    setEditingMember(memberName);
    setEditingName(memberName);
  };

  const cancelEditing = () => {
    setEditingMember(null);
    setEditingName('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Family Members</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Add New Member */}
          <div className="space-y-2">
            <Label htmlFor="newMember">Add New Member</Label>
            <div className="flex space-x-2">
              <Input
                id="newMember"
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                placeholder="Enter member name"
                onKeyPress={(e) => e.key === 'Enter' && handleAddMember()}
              />
              <Button onClick={handleAddMember} disabled={!newMemberName.trim()}>
                Add
              </Button>
            </div>
          </div>

          {/* Existing Members */}
          <div className="space-y-2">
            <Label>Current Members</Label>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {state.members.map((member) => (
                <div key={member} className="flex items-center justify-between p-2 border rounded">
                  {editingMember === member ? (
                    <div className="flex items-center space-x-2 flex-1">
                      <Input
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') handleEditMember(member);
                          if (e.key === 'Escape') cancelEditing();
                        }}
                        className="flex-1"
                      />
                      <Button size="sm" onClick={() => handleEditMember(member)}>
                        Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={cancelEditing}>
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <>
                      <span className="font-medium">{member}</span>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => startEditingMember(member)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteMember(member)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={onClose}>Done</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};