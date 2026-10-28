import React from 'react';
import ReactDOM from 'react-dom/client';
import '@fontsource/permanent-marker/400.css';
import '@fontsource/kalam/400.css';
import '@fontsource/kalam/700.css';
import '@fontsource/bricolage-grotesque/500.css';
import '@fontsource/bricolage-grotesque/600.css';
import './styles/tokens.css';
import './styles/global.css';
import './styles/sketch.css';
import App from './App';

// Very weak machines get a calmer background. Add ?lite=1 or ?lite=0 to the address to force it either way.
const forced = new URLSearchParams(window.location.search).get('lite');
const weak = (navigator.hardwareConcurrency || 8) <= 2 || (navigator.deviceMemory || 8) <= 2;
if (forced === '1' || (forced === null && weak)) {
  document.documentElement.dataset.lite = '';
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
