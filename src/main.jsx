import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { config, loadConfig } from './config';
import client from './api/client';
import './styles/index.css';
import App from './App.jsx';

/**
 * Fetches /.config.json, wires the resolved apiBaseUrl into the shared
 * axios instance, conditionally loads the AdSense script, then renders the
 * app. Everything that reads `config` (API calls, AdSlot, poll intervals)
 * only runs after this resolves.
 */
async function bootstrap() {
    await loadConfig();
    client.defaults.baseURL = config.apiBaseUrl;

    // Only load the real AdSense script once a client ID is configured, so
    // local development never makes a request to Google.
    if (config.adsenseClientId) {
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${config.adsenseClientId}`;
        script.crossOrigin = 'anonymous';
        document.head.appendChild(script);
    }

    createRoot(document.getElementById('root')).render(
        <StrictMode>
            <BrowserRouter>
                <AuthProvider>
                    <App />
                </AuthProvider>
            </BrowserRouter>
        </StrictMode>
    );
}

bootstrap();
