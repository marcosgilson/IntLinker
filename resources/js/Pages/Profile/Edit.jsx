import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import BecomeStudentForm from './Partials/BecomeStudentForm';
import BecomeWorkerForm from './Partials/BecomeWorkerForm';

const BANNER_COLORS = [
    '#9ca3af','#6366f1','#8b5cf6','#ec4899','#ef4444',
    '#f97316','#eab308','#22c55e','#06b6d4','#3b82f6',
    '#1e293b','#111827',
];

function BannerUpload({ bannerColor, userName }) {
    const [color, setColor] = useState(bannerColor ?? '#9ca3af');
    useEffect(() => { setColor(bannerColor ?? '#9ca3af'); }, [bannerColor]);
    const [showPicker, setShowPicker] = useState(false);

    const handleColorSelect = (c) => {
        setColor(c);
        setShowPicker(false);
        router.post(route('profile.banner.update'), { banner_color: c }, { preserveScroll: true });
    };

    return (
        <div className="relative h-28 sm:h-32 group" style={{ backgroundColor: color }}>
<button
                type="button"
                onClick={() => setShowPicker(v => !v)}
                className="absolute top-3 right-3 bg-black/30 hover:bg-black/50 text-white rounded-lg px-3 py-2
                    text-xs flex min-h-10 items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
            >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 11l6-6 3 3-6 6H9v-3z"/>
                </svg>
                Color
            </button>
            {showPicker && (
                <div className="absolute top-12 left-3 right-3 sm:left-auto sm:right-3 bg-white rounded-xl shadow-xl p-3 z-20 flex flex-wrap gap-2 sm:w-52">
                    {BANNER_COLORS.map(c => (
                        <button key={c} type="button" onClick={() => handleColorSelect(c)}
                            className="w-8 h-8 rounded-lg border-2 transition-transform hover:scale-110"
                            style={{ backgroundColor: c, borderColor: c === color ? '#fff' : 'transparent', outline: c === color ? '2px solid #6366f1' : 'none' }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

function AvatarUpload({ photoUrl, initials }) {
    const fileRef = useRef(null);
    const [preview, setPreview] = useState(photoUrl);
    const [uploading, setUploading] = useState(false);
    useEffect(() => { setPreview(photoUrl); }, [photoUrl]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setPreview(URL.createObjectURL(file));
        setUploading(true);
        router.post(route('profile.photo.update'), { photo: file }, {
            forceFormData: true, preserveScroll: true,
            onFinish: () => setUploading(false),
        });
    };

    const handleDelete = () => {
        if (!confirm('Eliminar foto de perfil?')) return;
        setPreview(null);
        router.delete(route('profile.photo.destroy'), { preserveScroll: true });
    };

    return (
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 group">
            {preview ? (
                <img src={preview} alt="Foto de perfil"
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-white shadow-lg" />
            ) : (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600
                    flex items-center justify-center ring-4 ring-white shadow-lg">
                    <span className="text-white font-bold text-xl sm:text-2xl">{initials}</span>
                </div>
            )}
            <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
                title="Cambiar foto"
                className="absolute inset-0 rounded-2xl bg-black/40 opacity-100 sm:opacity-0 sm:group-hover:opacity-100
                    transition-opacity flex items-center justify-center cursor-pointer">
                {uploading ? (
                    <svg className="animate-spin w-6 h-6 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                ) : (
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round"
                            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                )}
            </button>
            {preview && (
                <button type="button" onClick={handleDelete} title="Eliminar foto"
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white
                        rounded-full flex items-center justify-center shadow opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
            )}
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp"
                className="hidden" onChange={handleFileChange} />
        </div>
    );
}

export default function Edit({ status, student, companies, profile_photo_url, banner_color }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const roles = auth.roles ?? {};

    const initials = (user.name || 'U')
        .split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

    return (
        <AuthenticatedLayout>
            <Head title="Perfil — IntLinker" />

            <div className="py-4 sm:py-8">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-4 sm:space-y-5">

                    {/* Back link */}
                    <div className="flex items-center gap-2 mb-1">
                        <Link href={route('profile.show')}
                            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-600 transition-colors">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
                            </svg>
                            Mi perfil
                        </Link>
                    </div>

                    {/* Profile header card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        {/* Banner */}
                        <BannerUpload bannerColor={banner_color} userName={user.name} />

                        {/* Avatar + info row — avatar floats up with negative margin, but name is BELOW avatar */}
                        <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                            {/* Avatar overlapping banner */}
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between -mt-8 sm:-mt-10 mb-3">
                                <AvatarUpload photoUrl={profile_photo_url} initials={initials} />
                                {/* Roles badges top-right */}
                                <div className="flex gap-2 flex-wrap justify-start sm:justify-end mt-0 sm:mt-12">
                                    {roles.is_admin && (
                                        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full">Admin</span>
                                    )}
                                    {roles.is_student && (
                                        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">Alumno</span>
                                    )}
                                    {roles.is_pending_student && (
                                        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full">⏳ Alumno pendiente</span>
                                    )}
                                    {roles.is_worker && (
                                        <span className="px-3 py-1 bg-violet-100 text-violet-700 text-xs font-semibold rounded-full">Trabajador</span>
                                    )}
                                    {roles.is_pending_worker && (
                                        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full">⏳ Trabajador pendiente</span>
                                    )}
                                    {!roles.is_admin && !roles.is_student && !roles.is_worker && !roles.is_pending_student && !roles.is_pending_worker && (
                                        <span className="px-3 py-1 bg-gray-100 text-gray-500 text-xs font-semibold rounded-full">Usuario</span>
                                    )}
                                </div>
                            </div>
                            {/* Name + email below avatar */}
                            <div>
                                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 break-words">{user.name}</h1>
                                <p className="text-sm text-gray-500 break-all">{user.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Role registration options */}
                    <div>
                        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-1">Activar roles</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                            <BecomeStudentForm student={student} status={status} />
                            <BecomeWorkerForm companies={companies} status={status} />
                        </div>
                    </div>

                    {/* Account settings */}
                    <div>
                        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-1">Configuración de cuenta</h2>
                        <div className="space-y-4">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
                                <UpdateProfileInformationForm status={status} className="max-w-xl" />
                            </div>
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
                                <UpdatePasswordForm className="max-w-xl" />
                            </div>
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
                                <DeleteUserForm className="max-w-xl" />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}



