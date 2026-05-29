import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({ email: '' });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Recuperar contrasena — IntLinker" />
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Recuperar contrasena</h1>
            <p className="text-sm text-gray-500 mb-5">
                Escribe tu correo y te enviaremos un enlace para restablecer tu contrasena.
            </p>

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600 bg-green-50 rounded-lg px-4 py-2">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Correo electronico
                    </label>
                    <input
                        id="email"
                        type="email"
                        autoFocus
                        placeholder="tu@email.com"
                        value={data.email}
                        onChange={e => setData('email', e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    />
                    {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-sm transition"
                >
                    {processing ? 'Enviando...' : 'Enviar enlace'}
                </button>
            </form>

            <p className="mt-5 text-center text-sm text-gray-500">
                <Link href="/iniciar-sesion" className="text-indigo-600 hover:underline font-medium">Volver al inicio de sesion</Link>
            </p>
        </GuestLayout>
    );
}
