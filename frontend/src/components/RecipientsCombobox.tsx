import { useState } from 'react';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { User } from '@/types';
import { mockUsers } from '@/mock/users';

interface RecipientsComboboxProps {
  value: User[];
  onChange: (users: User[]) => void;
  placeholder?: string;
}

const RecipientsCombobox = ({ 
  value, 
  onChange, 
  placeholder = "Add team members..." 
}: RecipientsComboboxProps) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const availableUsers = mockUsers;
  
  // Filter out already selected users and filter by search
  const filteredUsers = availableUsers.filter(user => {
    const isSelected = value.some(selected => selected.id === user.id);
    const matchesSearch = user.name.toLowerCase().includes(searchValue.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchValue.toLowerCase());
    return !isSelected && matchesSearch;
  });

  const handleSelect = (selectedUser: User) => {
    const newValue = [...value, selectedUser];
    onChange(newValue);
    setSearchValue('');
  };

  const handleRemove = (userId: string) => {
    const newValue = value.filter(user => user.id !== userId);
    onChange(newValue);
  };

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            <div className="flex flex-wrap gap-1 max-w-[calc(100%-20px)]">
              {value.length === 0 ? (
                <span className="text-muted-foreground">{placeholder}</span>
              ) : (
                value.map((user) => (
                  <Badge
                    key={user.id}
                    variant="secondary"
                    className="text-xs"
                  >
                    {user.name}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(user.id);
                      }}
                      className="ml-1 hover:bg-muted-foreground/20 rounded-full"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))
              )}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput
              placeholder="Search people..."
              value={searchValue}
              onValueChange={setSearchValue}
            />
            <CommandList>
              <CommandEmpty>No people found.</CommandEmpty>
              <CommandGroup>
                {filteredUsers.map((user) => (
                  <CommandItem
                    key={user.id}
                    value={user.id}
                    onSelect={() => handleSelect(user)}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center space-x-2">
                      <img
                        src={user.avatarUrl}
                        alt={user.name}
                        className="h-6 w-6 rounded-full"
                      />
                      <div>
                        <div className="text-sm font-medium">{user.name}</div>
                        <div className="text-xs text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default RecipientsCombobox; 