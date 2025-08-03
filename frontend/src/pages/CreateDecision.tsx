import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Send, Sparkles } from 'lucide-react';
import ChipInput from '../components/ChipInput';
import { Button } from '../components/ui/button';
import { useToast } from '../hooks/use-toast';

const projectOptions = [
  'Frontend Platform',
  'Backend Services', 
  'DevOps',
  'Product Experience',
  'Developer Experience',
  'Platform Infrastructure'
];

const CreateDecision = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    title: '',
    detail: '',
    project: '',
    dueDate: '',
    emails: [] as string[]
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
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
    
    if (!formData.project) {
      toast({
        title: "Error",
        description: "Please select a project.",
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
    
    if (formData.emails.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one approver.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Call the backend API
      const response = await fetch('http://localhost:3001/api/decisions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          detail: formData.detail,
          project: formData.project,
          dueAt: new Date(formData.dueDate).toISOString(),
          teamMemberEmails: formData.emails
        })
      });

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

      setIsSubmitting(false);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating decision:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create decision",
        variant: "destructive"
      });
      setIsSubmitting(false);
    }
  };

  const autoGrowTextarea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
    setFormData({ ...formData, detail: textarea.value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-border shadow-lg overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[hsl(var(--brand-primary))] to-[hsl(var(--brand-primary))] px-8 py-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Create New Decision</h1>
                <p className="text-blue-100">Get your team aligned on important decisions</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Title */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">
                Decision Summary *
              </label>
              <input
                type="text"
                id="title"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Migrate to TypeScript for Frontend Components"
                className="w-full px-4 py-3 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200"
              />
            </motion.div>

            {/* Detail */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label htmlFor="detail" className="block text-sm font-medium text-foreground mb-2">
                Detailed Description *
              </label>
              <textarea
                id="detail"
                required
                value={formData.detail}
                onChange={autoGrowTextarea}
                placeholder="## Context

Explain the background and why this decision is needed...

## Proposal

Describe what you're proposing...

## Benefits

- Benefit 1
- Benefit 2

## Considerations

Any potential concerns or trade-offs..."
                className="w-full px-4 py-3 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200 min-h-[200px] resize-none"
                style={{ overflow: 'hidden' }}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Supports Markdown formatting
              </p>
            </motion.div>

            {/* Project */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label htmlFor="project" className="block text-sm font-medium text-foreground mb-2">
                Project *
              </label>
              <select
                id="project"
                required
                value={formData.project}
                onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                className="w-full px-4 py-3 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200"
              >
                <option value="">Select a project</option>
                {projectOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </motion.div>

            {/* Due Date */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label htmlFor="dueDate" className="block text-sm font-medium text-foreground mb-2">
                Due Date *
              </label>
              <div className="relative">
                <input
                  type="datetime-local"
                  id="dueDate"
                  required
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full px-4 py-3 border border-input rounded-lg bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200"
                />
                <Calendar className="absolute right-3 top-3 h-5 w-5 text-muted-foreground pointer-events-none" />
              </div>
            </motion.div>

            {/* Approvers */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label className="block text-sm font-medium text-foreground mb-2">
                Approvers *
              </label>
              <ChipInput
                value={formData.emails}
                onChange={(emails) => setFormData({ ...formData, emails })}
                placeholder="Enter team member emails..."
              />
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="pt-4"
            >
              <Button
                type="submit"
                disabled={isSubmitting || formData.emails.length === 0}
                className="w-full btn-primary h-12 text-base font-medium"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Creating Decision...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Send className="h-5 w-5" />
                    <span>Create Decision</span>
                  </div>
                )}
              </Button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateDecision;