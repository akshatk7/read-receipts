import { useState, KeyboardEvent } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChipInputProps {
  value: string[];
  onChange: (emails: string[]) => void;
  placeholder?: string;
  className?: string;
}

const ChipInput = ({ value, onChange, placeholder = "Enter email and press Enter", className = "" }: ChipInputProps) => {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addEmail();
    } else if (e.key === 'Backspace' && inputValue === '' && value.length > 0) {
      // Remove last chip when backspace is pressed on empty input
      onChange(value.slice(0, -1));
    }
  };

  const addEmail = () => {
    const email = inputValue.trim();
    if (!email) return;

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (value.includes(email)) {
      setError('Email already added');
      return;
    }

    onChange([...value, email]);
    setInputValue('');
    setError('');
  };

  const removeEmail = (emailToRemove: string) => {
    onChange(value.filter(email => email !== emailToRemove));
  };

  return (
    <div className={className}>
      <div className="flex flex-wrap gap-2 p-3 border border-input rounded-lg bg-background min-h-[44px] focus-within:ring-2 focus-within:ring-ring focus-within:border-transparent">
        <AnimatePresence>
          {value.map((email, index) => (
            <motion.div
              key={email}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="chip"
            >
              <span>{email}</span>
              <button
                type="button"
                onClick={() => removeEmail(email)}
                className="text-[hsl(var(--brand-primary)/0.7)] hover:text-[hsl(var(--brand-primary))] transition-colors duration-150"
              >
                <X className="h-3 w-3" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        
        <input
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setError('');
          }}
          onKeyDown={handleKeyDown}
          onBlur={addEmail}
          placeholder={value.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[200px] bg-transparent outline-none text-sm placeholder:text-muted-foreground"
        />
      </div>
      
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-sm text-destructive mt-1"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
      
      <p className="text-xs text-muted-foreground mt-1">
        Type an email and press Enter or comma to add
      </p>
    </div>
  );
};

export default ChipInput;