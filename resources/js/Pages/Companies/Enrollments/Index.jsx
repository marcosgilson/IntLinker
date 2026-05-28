import IntLinkerLogo from '@/Components/IntLinkerLogo';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import Footer from '@/Components/Footer';

const STATUS = {
    waiting: {
        label: 'En espera',
        badge: 'bg-gray-100 text-gray-700 border-gray-200',
    },
    accepted: {
        label: 'Candidato',
        badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    cancelled: {
        label: 'Cancelada',
        badge: 'bg-red-50 text-red-600 border-red-200',
    },
};

function EnrollmentRow({ enrollment, companyId }) {
    const acceptForm = useForm();
    const removeForm = useForm();

    const doAccept = () => {
        acceptForm.patch(route('companies.enrollments.accept', { company: companyId, enrollment: enrollment.id }));
    };

    const doRemove = () => {
        if (!confirm('¿Eliminar a este candidato del proceso? No podrá volver a postularse.')) return;
        removeForm.delete(route('companies.enrollments.remove', { company: companyId, enrollment: enrollment.id }));
    };

    const studentName  = enrollment.student?.user?.name  ?? '—';
    const studentEmail = enrollment.student?.user?.email ?? '';
    const cfg = STATUS[enrollment.status] ?? STATUS.waiting;

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col sm:flex-row sm:items-center gap-4">
            {/* Student avatar */}
            {enrollment.student?.user?.photo_url ? (
                <img src={enrollment.student.user.photo_url} alt={studentName}
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0 ring-2 ring-indigo-200"/>
            ) : (
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-indigo-700 font-bold text-sm">{studentName.charAt(0).toUpperCase()}</span>
                </div>
            )}

            {/* Name / email / date */}
            <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm">{studentName}</p>
                <p className="text-xs text-gray-400">{studentEmail}</p>
                <Link
                    href={route('students.profile', enrollment.student?.id)}
                    className="text-xs font-medium text-indigo-600 hover:underline mt-1 inline-block"
                >
                    Ver perfil →
                </Link>
                <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(enrollment.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                </p>
            </div>

            {/* Status badge */}
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-semibold flex-shrink-0 ${cfg.badge}`}>
                {cfg.label}
            </span>

            {/* Action buttons */}
            {enrollment.status !== 'cancelled' && (
                <div className="flex gap-2 flex-shrink-0">
                    {enrollment.status === 'waiting' && (
                        <button
                            onClick={doAccept}
                            disabled={acceptForm.processing || removeForm.processing}
                            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg transition disabled:opacity-50"
                        >
                            {acceptForm.processing ? 'Aceptando…' : '✓ Aceptar candidato'}
                        </button>
                    )}
                    <button
                        onClick={doRemove}
                        disabled={acceptForm.processing || removeForm.processing}
                        className="text-xs font-semibold text-red-500 hover:text-red-700 hover:bg-red-50 border border-red-200 px-3 py-1.5 rounded-lg transition disabled:opacity-50"
                    >
                        {removeForm.processing ? 'Eliminando…' : '✗ Eliminar del proceso'}
                    </button>
                </div>
            )}
        </div>
    )
}

export default function CompanyEnrollmentsIndex({ company, enrollments = [] }) {
    const { auth } = usePage().props;
    const waiting   = enrollments.filter(e => e.status === 'waiting');
    const accepted  = enrollments.filter(e => e.status === 'accepted');
    const cancelled = enrollments.filter(e => e.status === 'cancelled');

    return (
        <>
            <Head title={`Candidatos — ${company.name} — IntLinker`} />

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
                                href={route('companies.show', company.id)}
                                className="text-sm text-gray-500 hover:text-indigo-600 transition px-3 py-2"
                            >
                                ← {company.name}
                            </Link>
                        </div>
                    </div>
                </nav>

                <div className="pt-24 pb-12 max-w-4xl mx-auto px-6">
                    <div className="mb-8">
                        <h1 className="text-3xl font-extrabold text-white">Candidatos</h1>
                        <p className="text-gray-300 mt-1">{company.name} · {enrollments.length} postulación{enrollments.length !== 1 ? 'es' : ''} en total</p>
                    </div>

                    {enrollments.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-gray-200 py-16 text-center text-gray-400">
                            <p className="text-lg font-medium">Sin postulaciones todavía.</p>
                            <p className="text-sm mt-1">Las postulaciones de estudiantes aparecerán aquí.</p>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {/* Waiting */}
                            {waiting.length > 0 && (
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">
                                        En espera ({waiting.length})
                                    </p>
                                    <div className="space-y-3">
                                        {waiting.map(e => <EnrollmentRow key={e.id} enrollment={e} companyId={company.id} />)}
                                    </div>
                                </div>
                            )}

                            {/* Accepted */}
                            {accepted.length > 0 && (
                                <div>
                                    <p className="text-xs font-semibold text-emerald-600 uppercase tracking-widest mb-3">
                                        Candidatos aceptados ({accepted.length})
                                    </p>
                                    <div className="space-y-3">
                                        {accepted.map(e => <EnrollmentRow key={e.id} enrollment={e} companyId={company.id} />)}
                                    </div>
                                </div>
                            )}

                            {/* Cancelled */}
                            {cancelled.length > 0 && (
                                <div>
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                                        Canceladas ({cancelled.length})
                                    </p>
                                    <div className="space-y-3">
                                        {cancelled.map(e => <EnrollmentRow key={e.id} enrollment={e} companyId={company.id} />)}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}





