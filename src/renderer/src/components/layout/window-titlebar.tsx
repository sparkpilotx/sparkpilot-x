import React from 'react';
import { cn } from '@/lib/utils';
import { SettingsButton } from '@/components/ui/settings-button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import type { Theme } from '@shared/theme';
import { DEFAULT_THEME } from '@shared/theme';

export interface WindowTitlebarProps {
  /** Optional title text; defaults to VITE_APP_NAME for consistency across windows */
  title?: string;
}

export const WindowTitlebar = ({ title }: WindowTitlebarProps): React.JSX.Element => {
  const text = title ?? import.meta.env.VITE_APP_NAME;
  
  // TODO: Replace with actual theme state management (e.g., Zustand store)
  const [currentTheme, setCurrentTheme] = React.useState<Theme>(DEFAULT_THEME);
  
  const handleThemeChange = (theme: Theme) => {
    console.log('Theme changed to:', theme);
    setCurrentTheme(theme);
    // TODO: Implement actual theme switching logic
  };

  return (
    <header
      data-component="window-titlebar"
      className={cn(
        'titlebar-h win-drag w-full select-none sticky top-0 z-50',
        'bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60',
        'border-b border-border'
      )}
    >
      <div className={cn('h-full w-full flex items-center gap-2 px-2')}
        /* Left spacer for macOS traffic lights; adjust to 72px typical inset */
      >
        <div className={cn('w-[72px] shrink-0')} />

        {/* Title text sits in draggable area but is non-interactive */}
        <div className={cn('text-sm text-foreground/80 truncate')}>{text}</div>

        {/* Right-side actions must be no-drag to allow interaction */}
        <div className={cn('ml-auto flex items-center gap-1 win-no-drag')}>
          {/* Theme Toggle
           * Cycles through light, dark, and system theme preferences
           * Shows current theme icon and provides helpful tooltip
           * TODO: Integrate with actual theme management system
           */}
          <ThemeToggle
            theme={currentTheme}
            onThemeChange={handleThemeChange}
            className="h-8 w-8"
          />
          
          {/* Settings Button
           * Provides quick access to application settings and preferences
           * Styled as ghost variant for subtle appearance in title bar
           * Uses icon size (h-8 w-8) to maintain compact title bar height
           * Includes screen reader text for accessibility compliance
           * Currently logs to console - TODO: implement actual settings modal/page
           */}
          <SettingsButton className="h-8 w-8" />
        </div>
      </div>
    </header>
  );
};

export default WindowTitlebar;
