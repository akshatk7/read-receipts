import { useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Button } from './ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from './ui/command';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { cn } from '../lib/utils';

const teams = [
  'Promotions',
  'Backend Services',
  'Frontend Platform',
  'Mobile Apps',
  'Data Analytics',
  'DevOps',
  'Design System',
  'Marketing',
  'Sales',
  'Customer Success',
  'Product Management',
  'Engineering Leadership',
  'Security',
  'Infrastructure'
];

interface TeamComboboxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const TeamCombobox = ({ value, onChange, placeholder = "Select or type team name..." }: TeamComboboxProps) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const filteredTeams = teams.filter(team =>
    team.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue);
    setOpen(false);
    setSearchValue('');
  };

  const handleInputChange = (inputValue: string) => {
    setSearchValue(inputValue);
    if (inputValue && !teams.some(team => team.toLowerCase() === inputValue.toLowerCase())) {
      onChange(inputValue);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
        >
          {value || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search teams..."
            value={searchValue}
            onValueChange={handleInputChange}
          />
          <CommandEmpty>
            {searchValue ? (
              <div className="p-2">
                <button
                  className="w-full text-left p-2 hover:bg-accent rounded-sm"
                  onClick={() => handleSelect(searchValue)}
                >
                  Use "{searchValue}"
                </button>
              </div>
            ) : (
              "No teams found."
            )}
          </CommandEmpty>
          <CommandGroup>
            {filteredTeams.map((team) => (
              <CommandItem
                key={team}
                value={team}
                onSelect={() => handleSelect(team)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === team ? "opacity-100" : "opacity-0"
                  )}
                />
                {team}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default TeamCombobox;