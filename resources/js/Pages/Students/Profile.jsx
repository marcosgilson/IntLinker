import IntLinkerLogo from '@/Components/IntLinkerLogo';
import { Head, Link, usePage } from '@inertiajs/react';
import Footer from '@/Components/Footer';
import PortfolioSection from '@/Pages/Profile/Partials/PortfolioSection';

const STATUS = {
    waiting:   { label: 'En espera',  cls: 'bg-amber-50 text-amber-700 border-amber-200' },
    accepted:  { label: 'Candidato',  cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    cancelled: { label: 'Cancelada',  cls: 'bg-red-50 text-red-600 border-red-200' },
};

function initials(name) {
    return (name || 'A').split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

export default function StudentProfile({ student, enrollments = [], portfolio = null }) {
    const { auth } = usePage().props;

    const activeEnrollments = enrollments.filter(e => e.status !== 'cancelled');

    return (
        <>
            <Head title={`Perfil de ${student.name} — IntLinker`} />

            <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-900 font-sans">
                <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
                    <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                        <Link href="/inicio" className="flex items-center gap-2">
                            <IntLinkerLogo className="h-20 w-auto" />
                        </Link>
                        <div className="flex items-center gap-3">
                            <Link href="/perfil" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition px-3 py-2">
                                {auth.user?.name}
                            </Link>
                            <button onClick={() => history.back()} className="text-sm text-gray-500 hover:text-indigo-600 transition px-3 py-2">
                                ← Volver
                            </button>
                        </div>
                    </div>
                </nav>

                <div className="pt-24 pb-12 max-w-2xl mx-auto px-4 sm:px-6 space-y-6">

                    {/* Student card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl flex-shrink-0 overflow-hidden ring-2 ring-white shadow-md">
                                {student.photo_url ? (
                                    <img src={student.photo_url} alt={student.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-2xl">
                                        {initials(student.name)}
                                    </div>
                                )}
                            </div>
                            <div>
                                <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">{student.name}</h1>
                                <p className="text-sm text-gray-400 mt-0.5">{student.email}</p>
                                <span className="inline-flex items-center gap-1 mt-2 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                                    Alumno verificado
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 grid sm:grid-cols-2 gap-4">
                            <div className="bg-gray-50 rounded-xl px-4 py-3">
                                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">Centro educativo</p>
                                <p className="text-sm font-semibold text-gray-800">{student.school_name || '—'}</p>
                            </div>
                            <div className="bg-gray-50 rounded-xl px-4 py-3">
                                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">Correo escolar</p>
                                <p className="text-sm font-semibold text-gray-800 break-all">{student.school_email || '—'}</p>
                            </div>
                            <div className="bg-gray-50 rounded-xl px-4 py-3 sm:col-span-2">
                                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">Matricula valida hasta</p>
                                <p className="text-sm font-semibold text-gray-800">
                                    {student.expires_at
                                        ? new Date(student.expires_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })
                                        : '—'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Portfolio */}
                    {portfolio && (
                        <PortfolioSection portfolio={portfolio} isOwner={false} />
                    )}

                    {/* Enrollments in this company */}
                    {activeEnrollments.length > 0 && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-base font-bold text-gray-900 mb-4">
                                Postulaciones a tu empresa
                            </h2>
                            <div className="space-y-3">
                                {activeEnrollments.map(e => {
                                    const cfg = STATUS[e.status] ?? STATUS.waiting;
                                    return (
                                        <div key={e.id} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                {e.company?.logo_url ? (
                                                    <img src={e.company.logo_url} alt={e.company.name}
                                                        className="w-9 h-9 rounded-lg object-cover flex-shrink-0"/>
                                                ) : (
                                                    <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                                                        <span className="text-indigo-700 font-bold text-xs">{e.company?.name?.charAt(0).toUpperCase()}</span>
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-800">{e.company?.name}</p>
                                                    {e.company?.city && (
                                                        <p className="text-xs text-gray-400"> {e.company.city}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <span className={`text-xs font-semibold border px-2.5 py-1 rounded-full ${cfg.cls}`}>
                                                {cfg.label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
                <Footer />

            </div>
        </>
    );
}




