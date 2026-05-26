import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Show({ profile_photo_url, banner_color }) {
    const { auth } = usePage().props;
    const user  = auth.user;
    const roles = auth.roles ?? {};

    const initials = (user.name || 'U')
        .split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

    return (
        <AuthenticatedLayout>
            <Head title={`${user.name} — IntLinker`} />

            <div className="py-6 sm:py-8">
                <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

                        {/* Banner */}
                        <div className="h-28 sm:h-36" style={{ backgroundColor: banner_color ?? '#9ca3af' }} />

                        <div className="px-4 sm:px-6 pb-6">
                            <div className="flex items-start justify-between -mt-10 mb-4">

                                {/* Avatar */}
                                <div className="w-20 h-20 flex-shrink-0">
                                    {profile_photo_url ? (
                                        <img src={profile_photo_url} alt={user.name}
                                            className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white shadow-lg" />
                                    ) : (
                                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600
                                            flex items-center justify-center ring-4 ring-white shadow-lg">
                                            <span className="text-white font-bold text-2xl">{initials}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Options button */}
                                <Link
                                    href={route('profile.edit')}
                                    className="mt-12 flex items-center gap-1.5 text-sm font-medium text-gray-500
                                        hover:text-indigo-600 bg-gray-100 hover:bg-indigo-50 px-3 py-1.5
                                        rounded-lg transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0
                                               002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0
                                               001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0
                                               00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0
                                               00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0
                                               00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0
                                               00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0
                                               001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                    </svg>
                                    Editar perfil
                                </Link>
                            </div>

                            {/* Name + email */}
                            <div className="mb-4">
                                <h1 className="text-xl font-bold text-gray-900">{user.name}</h1>
                                <p className="text-sm text-gray-500">{user.email}</p>
                            </div>

                            {/* Role badges */}
                            <div className="flex gap-2 flex-wrap">
                                {roles.is_admin && (
                                    <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full">Admin</span>
                                )}
                                {roles.is_student && (
                                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">✓ Alumno</span>
                                )}
                                {roles.is_pending_student && (
                                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full">⏳ Verificación alumno pendiente</span>
                                )}
                                {roles.is_worker && (
                                    <span className="px-3 py-1 bg-violet-100 text-violet-700 text-xs font-semibold rounded-full">✓ Trabajador</span>
                                )}
                                {roles.is_pending_worker && (
                                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full">⏳ Verificación trabajador pendiente</span>
                                )}
                                {!roles.is_admin && !roles.is_student && !roles.is_worker &&
                                 !roles.is_pending_student && !roles.is_pending_worker && (
                                    <span className="px-3 py-1 bg-gray-100 text-gray-500 text-xs font-semibold rounded-full">Usuario</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}