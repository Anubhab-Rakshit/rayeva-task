import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
        <Toaster
            position="bottom-right"
            toastOptions={{
                style: {
                    background: 'var(--bg-card)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-mid)',
                    fontFamily: 'Geist Mono, monospace',
                    fontSize: '12px',
                },
            }}
        />
    </StrictMode>,
)
