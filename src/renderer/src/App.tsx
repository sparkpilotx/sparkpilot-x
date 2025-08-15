import React from 'react';
import WindowTitlebar from './components/layout/window-titlebar';
import { useTheme } from '@/hooks/use-theme';

const App = (): React.JSX.Element => {
  /* const { theme, resolvedTheme, isDark, isLight } = useTheme(); */

  return (
    <div className='min-h-screen bg-background text-foreground'>
      {/* 
        Title area - inherits draggable behavior from body.
        Height matches titleBarOverlay (40px) to provide consistent spacing
        where traffic lights appear on the left side.
      */}
      <WindowTitlebar />

      {/* Main content area to demonstrate theme switching */}
      {/* <main className='p-8 space-y-6'>
        <div className='max-w-2xl mx-auto space-y-4'>
          <h1 className='text-3xl font-bold text-foreground'>
            SparkPilot-X
          </h1>
          
          <div className='p-6 bg-card border border-border rounded-lg shadow-sm'>
            <h2 className='text-xl font-semibold text-card-foreground mb-4'>
              Theme Status
            </h2>
            
            <div className='space-y-2 text-sm'>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Theme Preference:</span>
                <span className='font-medium text-foreground'>{theme}</span>
              </div>
              
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Resolved Theme:</span>
                <span className='font-medium text-foreground'>{resolvedTheme}</span>
              </div>
              
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Is Dark Mode:</span>
                <span className='font-medium text-foreground'>{isDark ? 'Yes' : 'No'}</span>
              </div>
              
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Is Light Mode:</span>
                <span className='font-medium text-foreground'>{isLight ? 'Yes' : 'No'}</span>
              </div>
            </div>
          </div>

          <div className='p-6 bg-secondary border border-border rounded-lg'>
            <h3 className='text-lg font-medium text-secondary-foreground mb-3'>
              Theme Demo
            </h3>
            <p className='text-secondary-foreground mb-4'>
              This content demonstrates the theme system in action. Click the theme toggle 
              in the title bar to see both the renderer and native themes change.
            </p>
            
            <div className='flex gap-2'>
              <div className='px-3 py-2 bg-primary text-primary-foreground rounded text-sm font-medium'>
                Primary
              </div>
              <div className='px-3 py-2 bg-accent text-accent-foreground rounded text-sm font-medium'>
                Accent
              </div>
              <div className='px-3 py-2 bg-muted text-muted-foreground rounded text-sm font-medium'>
                Muted
              </div>
            </div>
          </div>
        </div>
      </main> */}
    </div>
  );
};

export default App;
