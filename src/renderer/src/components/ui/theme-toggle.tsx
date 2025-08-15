import React from 'react';
import { Button } from '@/components/ui/button';
import { Sun, Moon, Monitor } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import type { Theme } from '@shared/theme';
import { THEME_OPTIONS } from '@shared/theme';

export interface ThemeToggleProps {
  /** Current theme state */
  theme: Theme;
  /** Callback when theme changes */
  onThemeChange: (theme: Theme) => void;
  /** Optional custom className for styling */
  className?: string;
}

export const ThemeToggle = ({ 
  theme, 
  onThemeChange, 
  className 
}: ThemeToggleProps): React.JSX.Element => {
  const handleClick = () => {
    const currentIndex = THEME_OPTIONS.indexOf(theme);
    const nextIndex = (currentIndex + 1) % THEME_OPTIONS.length;
    onThemeChange(THEME_OPTIONS[nextIndex]);
  };

  const getThemeIcon = (currentTheme: Theme) => {
    switch (currentTheme) {
      case 'light':
        return <Sun className="h-4 w-4" />;
      case 'dark':
        return <Moon className="h-4 w-4" />;
      case 'system':
        return <Monitor className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  const getThemeLabel = (currentTheme: Theme) => {
    switch (currentTheme) {
      case 'light':
        return 'Light theme';
      case 'dark':
        return 'Dark theme';
      case 'system':
        return 'System theme';
      default:
        return 'System theme';
    }
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
          {getThemeIcon(theme)}
          <span className="sr-only">{getThemeLabel(theme)}</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{getThemeLabel(theme)} - Click to cycle</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default ThemeToggle;
