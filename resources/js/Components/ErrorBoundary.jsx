import { Component } from 'react';
import { router } from '@inertiajs/react';

export default class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, info) {
        // Report JS error to backend
        try {
            fetch('/api/client-error', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content ?? '',
                },
                body: JSON.stringify({
                    message: error.message,
                    stack: error.stack?.substring(0, 3000) ?? '',
                    componentStack: info.componentStack?.substring(0, 2000) ?? '',
                    url: window.location.href,
                }),
            }).catch(() => {});
        } catch (_) {}
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                    <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
                        <div className="text-5xl mb-4">&#9888;</div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">
                            Algo ha salido mal
                        </h2>
                        <p className="text-gray-500 text-sm mb-6">
                            Se ha producido un error inesperado. Nuestro equipo ha sido notificado.
                        </p>
                        <button
                            onClick={() => {
                                this.setState({ hasError: false, error: null });
                                router.visit(window.location.href);
                            }}
                            className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                            Reintentar
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
