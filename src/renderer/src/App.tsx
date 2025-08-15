import React from 'react';
import WindowTitleBar from './components/layout/window-title-bar';
import SamplesContainer from '@/components/samples';
import { ScrollArea } from '@/components/ui/scroll-area';
import WindowStatusBar from './components/layout/window-status-bar';

/**
 * Main application component for SparkPilot-X desktop app.
 * 
 * @remarks
 * Uses flexbox layout to ensure proper height distribution between titlebar, content, and statusbar.
 * The ScrollArea wrapper provides consistent cross-platform scrolling behavior and
 * custom scrollbar styling that integrates with the app's design system.
 * Optimized for macOS with proper traffic light spacing and native-like scrolling.
 * Three-panel layout: titlebar (top), content (middle), statusbar (bottom).
 * 
 * @example
 * ```tsx
 * // App is the root component, typically rendered in index.tsx
 * <App />
 * ```
 */
const App = (): React.JSX.Element => {
  return (
    <div className='min-h-screen bg-background text-foreground flex flex-col'>
      {/* 
        Window titlebar with draggable behavior for macOS window management.
        Height matches titleBarOverlay (36px) to provide consistent spacing
        where traffic lights appear on the left side.
        Uses sticky positioning to remain visible during content scroll.
      */}
      <WindowTitleBar />

      {/* 
        Main content area wrapped in ScrollArea for consistent desktop UX.
        flex-1 ensures content takes remaining height between titlebar and statusbar.
        min-h-0 allows flex child to shrink below content size for proper scrolling.
        ScrollArea provides custom scrollbars and cross-platform scroll behavior.
        Custom scrollbars integrate with app's design system and prevent overlap issues.
        pb-6 provides space for the fixed statusbar at the bottom.
      */}
      <main className='flex-1 min-h-0 pb-6'>
        <ScrollArea className='h-full w-full'>
          <SamplesContainer />
        </ScrollArea>
      </main>

      {/* 
        Status bar fixed at the bottom of the application window.
        Provides consistent status information display similar to VSCode.
        Fixed positioning ensures it's always visible during content scroll.
        Uses same height as titlebar for visual consistency.
      */}
      <WindowStatusBar 
        status="Ready" 
        leftContent={<span>Current: /samples</span>}
        rightContent={<span>Connected</span>}
      />
    </div>
  );
};

export default App;
