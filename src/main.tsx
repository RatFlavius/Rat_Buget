import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Error handling pentru deployment
try {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Root element not found');
  }
  
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
} catch (error) {
  console.error('Failed to render app:', error);
  
  // Fallback UI în caz de eroare
  const fallbackHTML = `
    <div style="
      display: flex; 
      justify-content: center; 
      align-items: center; 
      height: 100vh; 
      font-family: Arial, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      text-align: center;
      padding: 20px;
    ">
      <div>
        <h1 style="margin-bottom: 20px;">R.A.T Budget</h1>
        <div style="
          width: 50px; 
          height: 50px; 
          border: 4px solid rgba(255,255,255,0.3); 
          border-top: 4px solid white; 
          border-radius: 50%; 
          animation: spin 1s linear infinite;
          margin: 20px auto;
        "></div>
        <p>Se încarcă aplicația...</p>
        <button onclick="window.location.reload()" style="
          margin-top: 20px;
          padding: 10px 20px;
          background: rgba(255,255,255,0.2);
          border: 1px solid rgba(255,255,255,0.3);
          color: white;
          border-radius: 5px;
          cursor: pointer;
        ">
          Reîncarcă
        </button>
        <style>
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        </style>
      </div>
    </div>
  `;
  
  document.body.innerHTML = fallbackHTML;
}