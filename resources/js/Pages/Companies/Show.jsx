import IntLinkerLogo from '@/Components/IntLinkerLogo';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import CompanyPortfolioSection from './Partials/CompanyPortfolioSection';
import { useRef, useState } from 'react';
import Footer from '@/Components/Footer';

function stringToColor(str) {
    const palette = ['bg-indigo-600','bg-violet-600','bg-teal-600','bg-blue-700','bg-rose-600','bg-amber-600','bg-emerald-600','bg-sky-600','bg-fuchsia-600'];
    let hash = 0;
    for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
    return palette[Math.abs(hash) % palette.length];
}

function initials(name) {
    return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

function NavAvatar({ user }) {
    if (!user) return null;
    const ini = initials(user.name);
    return (
        <Link href="/perfil" className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-indigo-600 transition px-2 sm:px-3 py-1.5 rounded-lg hover:bg-gray-50">
            {user.photo_url ? (
                <img src={user.photo_url} alt={user.name} className="w-8 h-8 rounded-xl object-cover ring-2 ring-gray-200" />
            ) : (
                <div className={`w-8 h-8 rounded-xl ${stringToColor(user.name)} flex items-center justify-center text-white text-xs font-bold ring-2 ring-gray-200`}>
                    {ini}
                </div>
            )}
        </Link>
    );
}

function LogoUpload({ company, canManage }) {
    const fileRef = useRef(null);
    const [preview, setPreview] = useState(company.logo_url ?? null);
    const [uploading, setUploading] = useState(false);

    const handleFile = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setPreview(URL.createObjectURL(file));
        setUploading(true);
        router.post(route('companies.logo.update', company.id), { logo: file }, {
            forceFormData: true,
            preserveScroll: true,
            onFinish: () => setUploading(false),
        });
    };

    return (
        <div
            className={`relative w-20 h-20 rounded-2xl flex-shrink-0 ${canManage ? 'group cursor-pointer' : ''}`}
            onClick={() => canManage && fileRef.current?.click()}
        >
            {preview ? (
                <img src={preview} alt={company.name} className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white shadow-md" />
            ) : (
                <div className={`w-20 h-20 rounded-2xl ${stringToColor(company.name)} flex items-center justify-center text-white font-bold text-2xl ring-4 ring-white shadow-md`}>
                    {initials(company.name)}
                </div>
            )}
            {canManage && (
                <div className="absolute inset-0 rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    {uploading ? (
                        <svg className="w-5 h-5 text-white animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                        </svg>
                    ) : (
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                    )}
                </div>
            )}
            {canManage && (
                <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFile}/>
            )}
        </div>
    );
}

export default function CompaniesShow({ company, canManageLogo = false, canManagePortfolio = false }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const roles = auth?.roles ?? {};
    const employees = company.employees ?? [];

    const enrollForm = useForm({ company_id: company.id });
    const isEmployee = user && employees.some(e => e.id === user.id);

    const doEnroll = () => { enrollForm.post(route('enrollments.store')); };

    return (
        <>
            <Head title={`${company.name} — IntLinker`} />

            <div className="flex flex-col min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-900 font-sans">
                <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-3">
                        <Link href="/inicio" className="flex items-center gap-2">
                            <IntLinkerLogo className="h-12 sm:h-12 w-auto" />
                        </Link>
                        <div className="flex items-center gap-3">
                            <Link href="/empresas" className="text-sm text-gray-500 hover:text-indigo-600 transition px-3 py-2">
                                Empresas
                            </Link>
                            <NavAvatar user={user} />
                        </div>
                    </div>
                </nav>

                <div className="pt-20 sm:pt-24 pb-12 max-w-4xl mx-auto px-4 sm:px-6 space-y-4 sm:space-y-5">
                    {/* Header card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="h-24 bg-gradient-to-r from-indigo-500 to-violet-600" />
                        <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                            <div className="flex items-end justify-between -mt-10 mb-4">
                                <LogoUpload company={company} canManage={canManageLogo} />
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 break-words">{company.name}</h1>
                            {company.city && (
                                <p className="text-sm sm:text-base text-gray-500 mt-1 flex items-center gap-1 break-words">
                                    {company.city}
                                </p>
                            )}
                            {company.applications_email && (
                                <a href={`mailto:${company.applications_email}`} className="text-sm text-indigo-600 hover:underline mt-1 block break-all">
                                    {company.applications_email}
                                </a>
                            )}
                            {company.description && (
                                <p className="mt-4 text-sm sm:text-base text-gray-600 leading-relaxed break-words">{company.description}</p>
                            )}

                            {user && roles.is_student && !isEmployee && (
                                <div className="mt-5">
                                    <button onClick={doEnroll} disabled={enrollForm.processing}
                                        className="inline-flex min-h-10 w-full sm:w-auto items-center justify-center text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 px-4 py-2.5 rounded-lg transition">
                                        {enrollForm.processing ? 'Enviando...' : 'Postularse a esta empresa'}
                                    </button>
                                </div>
                            )}
                            {isEmployee && (
                                <div className="mt-5">
                                    <Link href={route('companies.enrollments.index', company.id)}
                                        className="inline-flex min-h-10 w-full sm:w-auto items-center justify-center text-sm font-semibold text-violet-600 hover:text-violet-800 border border-violet-200 hover:border-violet-400 px-4 py-2.5 rounded-lg transition">
                                        Ver candidatos
                                    </Link>
                                </div>
                            )}
                            {user && !roles.is_student && !roles.is_worker && !roles.is_pending_worker && !isEmployee && (
                                <div className="mt-5 bg-amber-50 border border-amber-200 rounded-xl px-4 sm:px-5 py-4 text-sm text-amber-800 break-words">
                                    Para unirte a esta empresa como trabajador, completa el proceso de verificación en tu{' '}
                                    <Link href="/perfil" className="font-semibold underline hover:text-amber-900">perfil</Link>.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Portfolio — above employees */}
                    <CompanyPortfolioSection company={company} canManage={canManagePortfolio} />

                    {/* Employees */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">
                            Equipo
                            <span className="ml-2 text-sm font-normal text-gray-400">({employees.length})</span>
                        </h2>
                        {employees.length === 0 ? (
                            <p className="text-sm text-gray-400">Esta empresa todavia no tiene empleados registrados.</p>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {employees.map(emp => (
                                    <div key={emp.id} className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 min-w-0">
                                        <div className={`w-8 h-8 rounded-lg ${stringToColor(emp.name)} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                                            {initials(emp.name)}
                                        </div>
                                        <span className="text-sm font-medium text-gray-800 truncate">{emp.name}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <Footer />
            </div>
        </>
    );
}
