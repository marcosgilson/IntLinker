import IntLinkerLogo from '@/Components/IntLinkerLogo';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import Footer from '@/Components/Footer';

// ── Status config ─────────────────────────────────────────────────────────────
const STATUS = {
    waiting: {
        label: 'En espera',
        dot: 'bg-gray-800',
        badge: 'bg-gray-100 text-gray-800 border-gray-200',
        ring: 'border-gray-300',
    },
    accepted: {
        label: 'Candidato',
        dot: 'bg-emerald-500',
        badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        ring: 'border-emerald-300',
    },
    cancelled: {
        label: 'Cancelada',
        dot: 'bg-red-400',
        badge: 'bg-red-50 text-red-600 border-red-200',
        ring: 'border-red-200',
    },
};

function stringToColor(str) {
    const palette = ['bg-indigo-600','bg-violet-600','bg-teal-600','bg-blue-700','bg-rose-600','bg-amber-600','bg-emerald-600','bg-sky-600','bg-fuchsia-600'];
    let hash = 0;
    for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
    return palette[Math.abs(hash) % palette.length];
}

function initials(name) {
    return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

// ── Single enrollment card ────────────────────────────────────────────────────
function EnrollmentCard({ enrollment }) {
    const { delete: destroy, processing } = useForm();
    const cfg = STATUS[enrollment.status] ?? STATUS.waiting;
    const company = enrollment.company;
    const canCancel = enrollment.status !== 'cancelled';

    const cancel = () => {
        if (!confirm('¿Cancelar esta postulación? No podrás volver a postularte a esta empresa.')) return;
        destroy(route('enrollments.destroy', enrollment.id));
    };

    return (
        <div className={`bg-white rounded-2xl border-2 ${cfg.ring} p-5 flex flex-col gap-4 transition-shadow hover:shadow-md`}>
            {/* Company header */}
            <div className="flex items-center gap-3">
                {company.logo_url ? (
                    <img src={company.logo_url} alt={company.name}
                        className="w-10 h-10 rounded-xl object-cover flex-shrink-0" />
                ) : (
                    <div className={`w-10 h-10 rounded-xl ${stringToColor(company.name)} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                        {initials(company.name)}
                    </div>
                )}
                <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 truncate">{company.name}</p>
                    <p className="text-xs text-gray-400">
                        {new Date(enrollment.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                </div>
                {/* Status badge */}
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold flex-shrink-0 ${cfg.badge}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                    {cfg.label}
                </span>
            </div>

            {/* Status explanation */}
            {enrollment.status === 'waiting' && (
                <p className="text-sm text-gray-500">Tu postulación está siendo revisada por la empresa.</p>
            )}
            {enrollment.status === 'accepted' && (
                <p className="text-sm text-emerald-700 bg-emerald-50 rounded-lg px-3 py-2">
                    🎉 La empresa ha mostrado interés en tu perfil. Espera su contacto.
                </p>
            )}
            {enrollment.status === 'cancelled' && (
                <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
                    {enrollment.cancelled_by === 'company'
                        ? 'La empresa ha cerrado tu candidatura.'
                        : 'Cancelaste esta postulación voluntariamente.'}
                    {' '}No puedes volver a postularte.
                </p>
            )}

            {/* Actions */}
            {canCancel && (
                <button
                    onClick={cancel}
                    disabled={processing}
                    className="mt-auto text-sm text-red-500 hover:text-red-700 hover:bg-red-50 border border-red-200 hover:border-red-300 rounded-lg px-4 py-2 transition disabled:opacity-50"
                >
                    {processing ? 'Cancelando…' : 'Cancelar postulación'}
                </button>
            )}
        </div>
    );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function EnrollmentsIndex({ enrollments = [], activeSlots = 0, maxSlots = 5 }) {
    const { auth } = usePage().props;
    const active = enrollments.filter(e => e.status !== 'cancelled');
    const cancelled = enrollments.filter(e => e.status === 'cancelled');

    return (
        <>
            <Head title="Mis postulaciones — IntLinker" />

            <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-900 font-sans">
                {/* Navbar */}
                <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
                    <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                        <Link href="/inicio" className="flex items-center gap-2">
                            <IntLinkerLogo className="h-20 w-auto" />
                        </Link>
                        <div className="flex items-center gap-3">
                            <Link href="/perfil" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition px-3 py-2">
                                {auth.user?.name}
                            </Link>
                            <Link
                                href="/inicio"
                                className="text-sm text-gray-500 hover:text-indigo-600 transition px-3 py-2"
                            >
                                ← Inicio
                            </Link>
                        </div>
                    </div>
                </nav>

                <div className="pt-24 pb-12 max-w-4xl mx-auto px-6">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-extrabold text-white">Mis postulaciones</h1>
                        <p className="text-gray-300 mt-1">Solo tú puedes ver este apartado.</p>
                    </div>

                    {/* Slots counter */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-8 flex items-center gap-4">
                        <div className="flex gap-1.5">
                            {Array.from({ length: maxSlots }).map((_, i) => (
                                <div key={i} className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                                    i < activeSlots
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-gray-100 text-gray-400'
                                }`}>
                                    {i + 1}
                                </div>
                            ))}
                        </div>
                        <div>
                            <p className="font-semibold text-white">{activeSlots} de {maxSlots} cupos usados</p>
                            <p className="text-sm text-gray-500">
                                {maxSlots - activeSlots} cupo{maxSlots - activeSlots !== 1 ? 's' : ''} disponible{maxSlots - activeSlots !== 1 ? 's' : ''}
                            </p>
                        </div>
                        <Link
                            href="/empresas"
                            className="ml-auto text-sm font-semibold text-indigo-600 hover:underline"
                        >
                            + Explorar empresas
                        </Link>
                    </div>

                    {/* Active enrollments */}
                    {active.length > 0 ? (
                        <>
                            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-4">
                                Activas ({active.length})
                            </h2>
                            <div className="grid sm:grid-cols-2 gap-4 mb-10">
                                {active.map(e => <EnrollmentCard key={e.id} enrollment={e} />)}
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-16 text-gray-300">
                            <svg className="w-12 h-12 mx-auto mb-4 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <p className="text-lg font-medium">Sin postulaciones activas</p>
                            <p className="text-sm mt-1">Explora las empresas y postúlate a las que te interesen.</p>
                            <Link href="/empresas" className="mt-4 inline-block text-sm font-semibold text-indigo-600 hover:underline">
                                Ver empresas →
                            </Link>
                        </div>
                    )}

                    {/* Cancelled enrollments */}
                    {cancelled.length > 0 && (
                        <>
                            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">
                                Canceladas ({cancelled.length})
                            </h2>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {cancelled.map(e => <EnrollmentCard key={e.id} enrollment={e} />)}
                            </div>
                        </>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
}





