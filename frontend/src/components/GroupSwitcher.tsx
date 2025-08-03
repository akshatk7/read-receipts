import { useState } from 'react';
import { Check, ChevronsUpDown, Building, Home } from 'lucide-react';
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
import { mockGroups, type Group } from '@/mock/decisions';

interface GroupSwitcherProps {
  selectedGroup: Group;
  onGroupChange: (group: Group) => void;
}

const GroupSwitcher = ({ selectedGroup, onGroupChange }: GroupSwitcherProps) => {
  const [open, setOpen] = useState(false);

  const getGroupIcon = (groupId: string) => {
    return groupId === 'personal' ? Home : Building;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          <div className="flex items-center space-x-2">
            {(() => {
              const Icon = getGroupIcon(selectedGroup.id);
              return <Icon className="h-4 w-4" />;
            })()}
            <span>{selectedGroup.name}</span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command shouldFilter={false}>
          <CommandList>
            <CommandEmpty>No groups found.</CommandEmpty>
            <CommandGroup>
              {mockGroups.map((group) => {
                const Icon = getGroupIcon(group.id);
                const isSelected = selectedGroup.id === group.id;
                
                return (
                  <CommandItem
                    key={group.id}
                    value={group.id}
                    onSelect={() => {
                      onGroupChange(group);
                      setOpen(false);
                    }}
                    className={cn(
                      isSelected ? "cursor-default opacity-50" : "cursor-pointer"
                    )}
                  >
                    <Icon className={cn(
                      "mr-2 h-4 w-4",
                      isSelected ? "text-muted-foreground" : "text-foreground"
                    )} />
                    <span className={cn(
                      isSelected ? "font-medium text-muted-foreground" : "text-foreground"
                    )}>
                      {group.name}
                    </span>
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        isSelected ? "opacity-100 text-muted-foreground" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default GroupSwitcher;