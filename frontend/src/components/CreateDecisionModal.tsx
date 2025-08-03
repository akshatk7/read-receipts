import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Calendar as CalendarComponent } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { useToast } from '../hooks/use-toast';
import { format } from 'date-fns';
import { cn } from '../lib/utils';
import RecipientsCombobox from './RecipientsCombobox';
import { User } from '@/types';

interface CreateDecisionModalProps {
  open: boolean;
  onClose: () => void;
}

const CreateDecisionModal = ({ open, onClose }: CreateDecisionModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    detail: '',
    dueDate: undefined as Date | undefined,
    recipients: [] as User[]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a decision title.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.detail.trim()) {
      toast({
        title: "Error", 
        description: "Please enter decision details.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.dueDate) {
      toast({
        title: "Error",
        description: "Please select a due date.",
        variant: "destructive"
      });
      return;
    }

    if (formData.recipients.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one approver.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Convert User objects to email strings
      const teamMemberEmails = formData.recipients.map(user => user.email);

      console.log('Modal: Attempting to create decision with data:', {
        title: formData.title,
        detail: formData.detail,
        project: 'General',
        dueAt: new Date(formData.dueDate).toISOString(),
        teamMemberEmails: teamMemberEmails
      });

      // Call the backend API
      const response = await fetch('http://localhost:3001/api/decisions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          detail: formData.detail,
          project: 'General', // Default project
          dueAt: new Date(formData.dueDate).toISOString(),
          teamMemberEmails: teamMemberEmails
        })
      });

      console.log('Modal: Response status:', response.status);
      console.log('Modal: Response ok:', response.ok);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create decision');
      }

      const result = await response.json();
      console.log('Decision created successfully:', result);

      const successEmojis = ['🎉', '✨', '🚀', '💫', '🎊'];
      const randomEmoji = successEmojis[Math.floor(Math.random() * successEmojis.length)];

      toast({
        title: `Decision created successfully! ${randomEmoji}`,
        description: "Approvers will be notified to provide their stance.",
      });
      
      // Reset form and close modal
      setFormData({
        title: '',
        detail: '',
        dueDate: undefined,
        recipients: []
      });
      onClose();
    } catch (error) {
      console.error('Modal: Error creating decision:', error);
      console.error('Modal: Error type:', typeof error);
      console.error('Modal: Error message:', error instanceof Error ? error.message : 'Unknown error');
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create decision",
        variant: "destructive"
      });
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      detail: '',
      dueDate: undefined,
      recipients: []
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            New Decision
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Decision Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="What decision needs to be made?"
              className="text-base"
            />
          </div>



          {/* Details */}
          <div className="space-y-2">
            <Label htmlFor="detail">Decision Details *</Label>
            <Textarea
              id="detail"
              value={formData.detail}
              onChange={(e) => setFormData(prev => ({ ...prev, detail: e.target.value }))}
              placeholder="Describe the decision context, options considered, and your recommendation..."
              className="min-h-32 resize-none"
            />
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <Label className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Due Date *
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.dueDate && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {formData.dueDate ? format(formData.dueDate, "PPP") : "Select due date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={formData.dueDate}
                  onSelect={(date) => setFormData(prev => ({ ...prev, dueDate: date }))}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Approvers */}
          <div className="space-y-2">
            <Label className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              Approvers *
            </Label>
            <RecipientsCombobox
              value={formData.recipients}
              onChange={(recipients) => setFormData(prev => ({ ...prev, recipients }))}
              placeholder="Add team members..."
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-[hsl(var(--brand-primary))] to-[hsl(var(--brand-primary))]">
              Create Decision
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDecisionModal;