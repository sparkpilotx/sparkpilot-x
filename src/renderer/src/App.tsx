import React from 'react';
import WindowTitlebar from './components/layout/window-titlebar';

const App = (): React.JSX.Element => {
  return (
    <div className='min-h-screen bg-background'>
    {/* 
      Title area - inherits draggable behavior from body.
      Height matches titleBarOverlay (40px) to provide consistent spacing
      where traffic lights appear on the left side.
    */}
    <WindowTitlebar />

  </div>
  );
};

export default App;
