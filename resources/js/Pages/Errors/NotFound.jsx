import React from 'react';
import { Head, Link } from '@inertiajs/react';
import IntLinkerLogo from '@/Components/IntLinkerLogo';

export default function NotFound() {
    return (
        <>
            <Head title="Página no encontrada — IntLinker" />
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-900 px-4">
                <div className="max-w-2xl w-full bg-white rounded-2xl shadow-lg p-8 text-center">
                    <div className="flex justify-center mb-4">
                        <IntLinkerLogo className="h-14 w-auto" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Página no encontrada</h1>
                    <p className="text-gray-600 mb-6">Lo sentimos, la página que buscas no existe o ha sido movida.</p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <Link href={route('home')} className="inline-flex items-center justify-center px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold">
                            Volver al inicio
                        </Link>
                        <Link href="/" className="text-sm text-gray-500 hover:underline">Ir a la página raíz</Link>
                    </div>
                </div>
            </div>
        </>
    );
}
