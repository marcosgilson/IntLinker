import IntLinkerLogo from '@/Components/IntLinkerLogo';
import { useEffect, useRef, useState } from 'react';
import { useForm, Link } from '@inertiajs/react';

// ── Shared field component ────────────────────────────────────────────────────
function Field({ label, id, error, children }) {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            {children}
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
}

function Input({ className = '', ...props }) {
    return (
        <input
            className={`w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-900 placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                disabled:opacity-50 transition ${className}`}
            {...props}
        />
    );
}

// ── Login form ────────────────────────────────────────────────────────────────
function LoginForm({ onSwitch, onClose, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('iniciar-sesión'), { onSuccess: () => onClose(), onFinish: () => reset('password') });
    };

    return (
        <form onSubmit={submit} className="space-y-4">
            <Field label="Correo electrónico" id="login-email" error={errors.email}>
                <Input
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    autoFocus
                    placeholder="tu@email.com"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    required
                />
            </Field>

            <Field label="Contraseña" id="login-password" error={errors.password}>
                <Input
                    id="login-password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    required
                />
            </Field>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        checked={data.remember}
                        onChange={(e) => setData('remember', e.target.checked)}
                    />
                    <span className="text-gray-600">Recuerdame</span>
                </label>
                {canResetPassword && (
                    <Link
                        href={route('password.request')}
                        className="text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                        ¿Olvidaste tu contraseña?
                    </Link>
                )}
            </div>

            <button
                type="submit"
                disabled={processing}
                className="w-full min-h-10 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition text-sm"
            >
                {processing ? 'Entrando…' : 'Iniciar sesión'}
            </button>

            <p className="text-center text-sm text-gray-500">
                ¿No tienes cuenta?{' '}
                <button type="button" onClick={onSwitch} className="text-indigo-600 hover:underline font-medium">
                    Regístrate gratis
                </button>
            </p>
        </form>
    );
}

// ── Register form ─────────────────────────────────────────────────────────────
function RegisterForm({ onSwitch, onClose }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('registro'), {
            onSuccess: () => onClose(), onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <form onSubmit={submit} className="space-y-4">
            <Field label="Nombre completo" id="reg-name" error={errors.name}>
                <Input
                    id="reg-name"
                    type="text"
                    autoComplete="name"
                    autoFocus
                    placeholder="Tu nombre"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    required
                />
            </Field>

            <Field label="Correo electrónico" id="reg-email" error={errors.email}>
                <Input
                    id="reg-email"
                    type="email"
                    autoComplete="email"
                    placeholder="tu@email.com"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    required
                />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Contraseña" id="reg-password" error={errors.password}>
                    <Input
                        id="reg-password"
                        type="password"
                        autoComplete="new-password"
                        placeholder="••••••••"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />
                </Field>
                <Field label="Confirmar contraseña" id="reg-confirm" error={errors.password_confirmation}>
                    <Input
                        id="reg-confirm"
                        type="password"
                        autoComplete="new-password"
                        placeholder="••••••••"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        required
                    />
                </Field>
            </div>

            <button
                type="submit"
                disabled={processing}
                className="w-full min-h-10 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition text-sm"
            >
                {processing ? 'Creando cuenta…' : 'Crear cuenta'}
            </button>

            <p className="text-center text-sm text-gray-500">
                ¿Ya tienes cuenta?{' '}
                <button type="button" onClick={onSwitch} className="text-indigo-600 hover:underline font-medium">
                    Inicia sesión
                </button>
            </p>
        </form>
    );
}

// ── Modal ─────────────────────────────────────────────────────────────────────
export default function AuthModal({ show, onClose, defaultTab = 'login', canResetPassword = true }) {
    const [tab, setTab] = useState(defaultTab);
    const overlayRef = useRef(null);

    // Sync tab when modal reopens with a different defaultTab
    useEffect(() => {
        if (show) setTab(defaultTab);
    }, [show, defaultTab]);

    // Close on Escape
    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape') onClose(); };
        if (show) document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [show, onClose]);

    // Prevent body scroll when open
    useEffect(() => {
        document.body.style.overflow = show ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [show]);

    if (!show) return null;

    return (
        <div
            ref={overlayRef}
            onClick={(e) => e.target === overlayRef.current && onClose()}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm"
            style={{ animation: 'fadeIn .15s ease' }}
        >
            <div
                className="relative w-full max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[95vh]"
                style={{ animation: 'slideUp .2s ease' }}
            >
                {/* Header */}
                <div className="px-4 sm:px-6 pt-5 sm:pt-6 pb-4 border-b border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <IntLinkerLogo className="h-20 sm:h-20 w-auto" />
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
                            aria-label="Cerrar"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                        {[
                            { key: 'login',    label: 'Iniciar sesión' },
                            { key: 'register', label: 'Registrarse' },
                        ].map(({ key, label }) => (
                            <button
                                key={key}
                                onClick={() => setTab(key)}
                                className={`flex-1 min-h-10 px-2 py-2 text-xs sm:text-sm font-semibold rounded-md transition ${
                                    tab === key
                                        ? 'bg-white text-indigo-600 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Body */}
                <div className="px-4 sm:px-6 py-5 overflow-y-auto">
                    {tab === 'login' ? (
                        <LoginForm
                            onSwitch={() => setTab('register')}
                            onClose={onClose}
                            canResetPassword={canResetPassword}
                        />
                    ) : (
                        <RegisterForm onSwitch={() => setTab('login')} onClose={onClose} />
                    )}
                </div>
            </div>

            <style>{`
                @keyframes fadeIn  { from { opacity: 0 }        to { opacity: 1 } }
                @keyframes slideUp { from { transform: translateY(16px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
            `}</style>
        </div>
    );
}





