import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function VerifyEmail({ status }) {
    return (
        <GuestLayout hideLogo>
            <Head title="Cuenta pendiente — IntLinker" />
            <div className="flex flex-col items-center mb-5">
                <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                    <svg className="w-7 h-7 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1 text-center">Cuenta pendiente de verificación</h1>
                <p className="text-sm text-gray-500 text-center">
                    Tu cuenta ha sido creada correctamente. Un administrador la revisara y la activara en breve.
                    Una vez verificada podrás iniciar sesión con normalidad.
                </p>
            </div>

            <div className="mt-4 text-center">
                <Link
                    href={route('cerrar-sesión')}
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