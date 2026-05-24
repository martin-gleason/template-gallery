import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// Self-host DM Sans per ecosystem rule: "No external font URLs.
// Self-contained and base64 embedded." (OCS-Ecosystem/CLAUDE.md, Global Rules)
// Previously loaded from fonts.googleapis.com in index.html.
import '@fontsource/dm-sans/400.css';
import '@fontsource/dm-sans/500.css';
import '@fontsource/dm-sans/600.css';
import '@fontsource/dm-sans/700.css';
import './styles/globals.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
