import React from 'react';
import ReactDOM from 'react-dom/client';
import { ExamProvider } from './context/ExamContext';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ExamProvider>
      <App />
    </ExamProvider>
  </React.StrictMode>
);