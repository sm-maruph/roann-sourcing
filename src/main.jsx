import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/index.css';
import { initializeDocumentLanguage } from './i18n/language';
initializeDocumentLanguage();
createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
