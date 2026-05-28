import IntLinkerLogo from '@/Components/IntLinkerLogo';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), { onFinish: () => reset('password') });
    };

    return (
        <>
            <Head title="Iniciar sesión — IntLinker" />

            <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-900 flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">

                    <div className="px-8 pt-8 pb-6 border-b border-gray-100">
                        <Link href="/" className="flex items-center gap-2 mb-6">
                            <IntLinkerLogo className="h-20 w-auto" />
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-900">Iniciar sesión</h1>
                        <p className="text-gray-500 text-sm mt-1">
                            ¿No tienes cuenta?{' '}
                            <Link href="/register" className="text-indigo-600 hover:underline font-medium">
                                Regístrate gratis
                            </Link>
                        </p>
                    </div>

                    <div className="px-8 py-7 space-y-4">
                        {status && <div className="text-sm font-medium text-green-600 bg-green-50 rounded-lg px-4 py-2">{status}</div>}

                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
                                <input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    autoFocus
                                    placeholder="tu@email.com"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                />
                                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                                <input
                                    id="password"
                                    type="password"
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                />
                                {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center gap-2 cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                    />
                                    <span className="text-gray-600">Recuérdame</span>
                                </label>
                                {canResetPassword && (
                                    <Link href={route('password.request')} className="text-indigo-600 hover:text-indigo-700 font-medium">
                                        ¿Olvidaste tu contraseña?
                                    </Link>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition text-sm"
                            >
                                {processing ? 'Entrando…' : 'Iniciar sesión'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}






