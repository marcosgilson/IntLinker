import '../css/app.css';
import './bootstrap';
import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import ErrorBoundary from './Components/ErrorBoundary';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// 419 — CSRF token expired: show a brief toast and reload to get a fresh token
router.on('invalid', (event) => {
    if (event.detail.response.status === 419) {
        event.preventDefault();
        const toast = document.createElement('div');
        toast.textContent = 'Sesión renovada. Por favor, inténtalo de nuevo.';
        toast.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#1e293b;color:#fff;padding:10px 20px;border-radius:8px;font-size:14px;z-index:9999;box-shadow:0 4px 12px rgba(0,0,0,.3)';
        document.body.appendChild(toast);
        setTimeout(() => window.location.reload(), 1500);
        return;
    }
    // 500 / 503 — server error on an Inertia request: go to home instead of showing raw HTML
    if (event.detail.response.status >= 500) {
        event.preventDefault();
        router.visit('/inicio');
    }
});

// Network error (connection lost, timeout, etc.)
router.on('exception', (event) => {
    event.preventDefault();
    // Retry once after 2s; if it fails again the user will see the browser error
    setTimeout(() => window.location.reload(), 2000);
});

// Catch unhandled JS errors and promise rejections outside React render
function reportError(message, stack = '') {
    fetch('/api/client-error', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content ?? '',
        },
        body: JSON.stringify({ message, stack, url: window.location.href }),
    }).catch(() => {});
}

window.onerror = (_msg, _src, _line, _col, error) => {
    reportError(error?.message ?? String(_msg), error?.stack ?? '');
};

window.onunhandledrejection = (event) => {
    const reason = event.reason;
    reportError(reason?.message ?? String(reason), reason?.stack ?? '');
};

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(
            <ErrorBoundary>
                <App {...props} />
            </ErrorBoundary>
        );
    },
    progress: {
        color: '#4B5563',
    },
});
