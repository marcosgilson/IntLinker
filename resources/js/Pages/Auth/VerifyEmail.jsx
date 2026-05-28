import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <GuestLayout hideLogo>
            <Head title="Verificar correo — IntLinker" />
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Verifica tu correo</h1>
            <p className="text-sm text-gray-500 mb-5">
                ¡Gracias por registrarte! Antes de empezar, verifica tu dirección de correo haciendo clic en el enlace que acabamos de enviarte.
                Si no lo recibiste, podemos enviarte otro.
            </p>

            {status === 'verification-link-sent' && (
                <div className="mb-4 text-sm font-medium text-green-600 bg-green-50 rounded-lg px-4 py-2">
                    Se ha enviado un nuevo enlace de verificación a tu correo.
                </div>
            )}

            <form onSubmit={submit}>
                <button
                    type="submit"
                    disabled={processing}
                    className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-sm transition"
                >
                    {processing ? 'Enviando...' : 'Reenviar correo de verificación'}
                </button>
            </form>

            <div className="mt-4 text-center">
                <Link
                    href={route('cerrar-sesion')}
                    method="post"
                    as="button"
                    className="text-sm text-gray-500 hover:text-gray-700 underline transition"
                >
                    Cerrar sesión
                </Link>
            </div>
        </GuestLayout>
    );
}
