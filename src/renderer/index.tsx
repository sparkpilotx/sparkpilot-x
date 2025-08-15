
import React from 'react';
import ReactDOM from 'react-dom/client';

import { TooltipProvider } from '@/components/ui/tooltip';

import './src/styles/main.css';
import App from './src/App';

/**
 * Initialize the React application in the renderer process.
 *
 * Creates a React root and renders the main App component wrapped in
 * StrictMode for development-time checks and warnings.
 */
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
      <TooltipProvider>
        <App />
      </TooltipProvider>
  </React.StrictMode>
);
