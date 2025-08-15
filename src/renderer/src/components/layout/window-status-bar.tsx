import React from 'react';
import { cn } from '@/lib/utils';

export interface WindowStatusBarProps {
  /** Optional status text; defaults to app name for consistency */
  status?: string;
  /** Optional left-side content like breadcrumbs or current location */
  leftContent?: React.ReactNode;
  /** Optional right-side content like connection status or app info */
  rightContent?: React.ReactNode;
}

/**
 * Status bar component fixed at the bottom of the application window.
 * 
 * @remarks
 * Provides consistent status information display similar to VSCode or other desktop apps.
 * Fixed positioning ensures it's always visible regardless of content scroll.
 * Compact design with reduced height for minimal visual footprint.
 * 
 * @example
 * ```tsx
 * <StatusBar 
 *   status="Ready" 
 *   leftContent={<span>Current: /samples</span>}
 *   rightContent={<span>Connected</span>}
 * />
 * ```
 */
export const WindowStatusBar = ({ 
  status, 
  leftContent, 
  rightContent 
}: WindowStatusBarProps): React.JSX.Element => {
  const statusText = status ?? import.meta.env.VITE_APP_NAME;
  
  return (
    <footer
      data-component="status-bar"
      className={cn(
        'h-6 w-full select-none fixed bottom-0 left-0 right-0 z-[100]',
        'bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60',
        'border-t border-border',
        'isolate' // Creates isolated stacking context to prevent content overlap
      )}
              /* 
          z-[100] with isolation creates independent stacking context above content.
          isolate ensures statusbar z-index is respected regardless of child contexts.
          Fixed positioning keeps it visible at bottom during content scroll.
          Compact h-6 height provides minimal visual footprint while maintaining readability.
          Backdrop blur provides modern glassmorphism effect on supported browsers.
        */
    >
      <div className={cn('h-full w-full flex items-center gap-1 px-2')}>
        {/* Left content area - breadcrumbs, current location, etc. */}
        <div className={cn('flex items-center gap-1 text-xs text-muted-foreground')}>
          {leftContent}
        </div>

        {/* Center status text */}
        <div className={cn('flex-1 text-center text-xs text-foreground/80 truncate')}>
          {statusText}
        </div>

        {/* Right content area - connection status, app info, etc. */}
        <div className={cn('flex items-center gap-1 text-xs text-muted-foreground')}>
          {rightContent}
        </div>
      </div>
    </footer>
  );
};

export default WindowStatusBar;
