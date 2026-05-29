import { Link, usePage } from '@inertiajs/react';

export default function RolesSection() {
    const { auth } = usePage().props;
    const roles = auth?.roles ?? {};
    const user  = auth?.user;

    return (
        <section>
            <header className="mb-4">
                <h2 className="text-lg font-bold text-gray-900">Roles y accesos</h2>
                <p className="text-sm text-gray-600 mt-1">
                    Tus roles activos en la plataforma.
                </p>
            </header>

            <div className="space-y-3">
                {/* Admin */}
                {roles.is_admin && (
                    <div className="flex items-center justify-between p-4 bg-indigo-50 border border-indigo-200 rounded-xl">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-semibold text-indigo-900 text-sm">Administrador</p>
                                <p className="text-xs text-indigo-600">Acceso total al sistema</p>
                            </div>
                        </div>
                        <Link
                            href="/admin"
                            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
                        >
                            Panel admin →
                        </Link>
                    </div>
                )}

                {/* Student */}
                {roles.is_student ? (
                    <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-semibold text-emerald-900 text-sm">Alumno activo</p>
                                <p className="text-xs text-emerald-600">Puedes postularte a empresas</p>
                            </div>
                        </div>
                        <Link
                            href="/postulaciones"
                            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
                        >
                            Mis postulaciones →
                        </Link>
                    </div>
                ) : (
                    <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-gray-300 flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-600 text-sm">Alumno</p>
                                <p className="text-xs text-gray-400">No activo — activalo para postularte</p>
                            </div>
                        </div>
                        <span className="text-xs text-gray-400 italic">Proximamente</span>
                    </div>
                )}

                {/* Worker */}
                {roles.is_worker ? (
                    <div className="flex items-center justify-between p-4 bg-violet-50 border border-violet-200 rounded-xl">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-violet-600 flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-semibold text-violet-900 text-sm">Trabajador</p>
                                <p className="text-xs text-violet-600">Perteneces a una o mas empresas</p>
                            </div>
                        </div>
                        <Link
                            href="/mi-empresa"
                            className="text-xs font-semibold text-violet-600 hover:text-violet-700 hover:underline"
                        >
                            Mi empresa →
                        </Link>
                    </div>
                ) : (
                    <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-gray-300 flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-600 text-sm">Trabajador</p>
                                <p className="text-xs text-gray-400">No perteneces a ninguna empresa</p>
                            </div>
                        </div>
                        <Link
                            href="/empresas"
                            className="text-xs font-semibold text-gray-500 hover:text-indigo-600 hover:underline"
                        >
                            Ver empresas →
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
}
