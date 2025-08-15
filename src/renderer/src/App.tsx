import React from 'react';
import WindowTitlebar from './components/layout/window-titlebar';
import SamplesContainer from '@/components/samples';

const App = (): React.JSX.Element => {
  return (
    <div className='min-h-screen bg-background text-foreground'>
      {/* 
        Title area - inherits draggable behavior from body.
        Height matches titleBarOverlay (40px) to provide consistent spacing
        where traffic lights appear on the left side.
      */}
      <WindowTitlebar />

      {/* Main content area - tRPC Samples Demo */}
      <main className='overflow-auto'>
        <SamplesContainer />
      </main>
    </div>
  );
};

export default App;
