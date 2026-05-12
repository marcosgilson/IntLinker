import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import BecomeStudentForm from './Partials/BecomeStudentForm';
import BecomeWorkerForm from './Partials/BecomeWorkerForm';

export default function Edit({ mustVerifyEmail, status, student, companies }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const roles = auth.roles ?? {};

    const initials = (user.name || 'U')
        .split(' ')
        .map(w => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Mi Perfil</h2>}>
            <Head title="Perfil — IntLinker" />

            <div className="py-8">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">

                    {/* Profile header card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="h-24 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-600" />
                        <div className="px-6 pb-6">
                            <div className="flex items-end gap-4 -mt-10 mb-4">
                                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600
                                    flex items-center justify-center ring-4 ring-white shadow-lg flex-shrink-0">
                                    <span className="text-white font-bold text-2xl">{initials}</span>
                                </div>
                                <div className="pb-1">
                                    <h1 className="text-xl font-bold text-gray-900">{user.name}</h1>
                                    <p className="text-sm text-gray-500">{user.email}</p>
                                </div>
                                <div className="ml-auto pb-1 flex gap-2 flex-wrap justify-end">
                                    {roles.is_admin && (
                                        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full">Admin</span>
                                    )}
                                    {roles.is_student && (
                                        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">✓ Alumno</span>
                                    )}
                                    {roles.is_pending_student && (
                                        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full">⏳ Alumno pendiente</span>
                                    )}
                                    {roles.is_worker && (
                                        <span className="px-3 py-1 bg-violet-100 text-violet-700 text-xs font-semibold rounded-full">✓ Trabajador</span>
                                    )}
                                    {roles.is_pending_worker && (
                                        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full">⏳ Trabajador pendiente</span>
                                    )}
                                    {!roles.is_admin && !roles.is_student && !roles.is_worker && !roles.is_pending_student && !roles.is_pending_worker && (
                                        <span className="px-3 py-1 bg-gray-100 text-gray-500 text-xs font-semibold rounded-full">Usuario</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Role registration options */}
                    <div>
                        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">
                            Activar roles
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <BecomeStudentForm student={student} status={status} />
                            <BecomeWorkerForm companies={companies} status={status} />
                        </div>
                    </div>

                    {/* Account settings */}
                    <div>
                        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">
                            Configuración de cuenta
                        </h2>
                        <div className="space-y-4">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <UpdateProfileInformationForm mustVerifyEmail={mustVerifyEmail} status={status} className="max-w-xl" />
                            </div>
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <UpdatePasswordForm className="max-w-xl" />
                            </div>
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <DeleteUserForm className="max-w-xl" />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}