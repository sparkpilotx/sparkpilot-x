import React from 'react';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export interface SettingsButtonProps {
  /** Optional click handler for the settings button */
  onClick?: () => void;
  /** Optional custom className for styling */
  className?: string;
}

export const SettingsButton = ({ 
  onClick, 
  className 
}: SettingsButtonProps): React.JSX.Element => {
  const handleClick = () => {
    // TODO: Implement settings functionality
    console.log('Settings clicked');
    onClick?.();
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={className}
          onClick={handleClick}
        >
          <Settings className="h-4 w-4" />
          <span className="sr-only">Settings</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Settings</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default SettingsButton;
