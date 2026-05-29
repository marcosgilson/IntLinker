import IntLinkerLogo from '@/Components/IntLinkerLogo';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import Footer from '@/Components/Footer';
import { useState } from 'react';

const STATUS_CFG = {
    pending:  { label: 'Pendiente',  cls: 'bg-amber-50 text-amber-700 border-amber-200' },
    approved: { label: 'Aprobada',   cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    rejected: { label: 'Rechazada',  cls: 'bg-red-50 text-red-600 border-red-200' },
};

function ApplicationCard({ app }) {
    const [notesOpen, setNotesOpen] = useState(false);
    const approveForm = useForm({ admin_notes: '' });
    const rejectForm  = useForm({ admin_notes: '' });

    const doApprove = () => {
        approveForm.patch(route('admin.company-applications.approve', app.id));
    };

    const doReject = () => {
        rejectForm.patch(route('admin.company-applications.reject', app.id));
    };

    const cfg = STATUS_CFG[app.status] ?? { label: app.status, cls: 'bg-gray-100 text-gray-500 border-gray-200' };

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                    <p className="font-bold text-gray-900">{app.company_name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                        Solicitado por{' '}
                        <span className="font-medium text-gray-600">{app.user?.name}</span>
                        {' '}({app.user?.email})
                    </p>
                    <p className="text-xs text-gray-300 mt-0.5">
                        {new Date(app.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border flex-shrink-0 ${cfg.cls}`}>
                    {cfg.label}
                </span>
            </div>

            {app.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-3">{app.description}</p>
            )}

            {app.admin_notes && (
                <p className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2 mb-3 italic">
                    Nota admin: {app.admin_notes}
                </p>
            )}

            {app.status === 'pending' && (
                <div className="space-y-3">
                    <button
                        onClick={() => setNotesOpen(v => !v)}
                        className="text-xs text-gray-400 hover:text-gray-600 transition"
                    >
                        {notesOpen ? '▲ Ocultar notas' : '▼ Añadir notas de admin (opcional)'}
                    </button>

                    {notesOpen && (
                        <div className="space-y-2">
                            <textarea
                                rows={2}
                                placeholder="Notas internas (visibles tras procesar)…"
                                value={approveForm.data.admin_notes}
                                onChange={e => {
                                    approveForm.setData('admin_notes', e.target.value);
                                    rejectForm.setData('admin_notes', e.target.value);
                                }}
                                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                            />
                        </div>
                    )}

                    <div className="flex gap-2">
                        <button
                            onClick={doApprove}
                            disabled={approveForm.processing || rejectForm.processing}
                            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg transition disabled:opacity-50"
                        >
                            {approveForm.processing ? 'Aprobando…' : '✓ Aprobar solicitud'}
                        </button>
                        <button
                            onClick={doReject}
                            disabled={approveForm.processing || rejectForm.processing}
                            className="text-xs font-semibold text-red-500 hover:text-red-700 hover:bg-red-50 border border-red-200 px-3 py-1.5 rounded-lg transition disabled:opacity-50"
                        >
                            {rejectForm.processing ? 'Rechazando…' : '✗ Rechazar solicitud'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function AdminCompanyApplications({ applications = {} }) {
    const { auth } = usePage().props;
    const list      = applications.data ?? [];
    const pending   = list.filter(a => a.status === 'pending');
    const processed = list.filter(a => a.status !== 'pending');

    return (
        <>
            <Head title="Solicitudes de empresa — Admin — IntLinker" />

            <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-900 font-sans">
                {/* Navbar */}
                <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
                    <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                        <Link href="/inicio" className="flex items-center gap-2">
                            <IntLinkerLogo className="h-20 w-auto" />
                        </Link>
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-semibold bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full">Admin</span>
                            <Link href="/perfil" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition px-3 py-2">
                                {auth.user?.name}
                            </Link>
                            <Link href="/admin" className="text-sm text-gray-500 hover:text-indigo-600 transition px-3 py-2">
                                ← Panel admin
                            </Link>
                        </div>
                    </div>
                </nav>

                <div className="pt-24 pb-12 max-w-4xl mx-auto px-6">
                    <div className="mb-8 flex items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-extrabold text-white">Solicitudes de empresa</h1>
                            <p className="text-gray-300 mt-1">Revisa y procesa las solicitudes de creación de empresa.</p>
                        </div>
                        {pending.length > 0 && (
                            <span className="ml-auto text-xs font-bold bg-amber-100 text-amber-700 px-3 py-1.5 rounded-full">
                                {pending.length} pendiente{pending.length !== 1 ? 's' : ''}
                            </span>
                        )}
                    </div>

                    {list.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-gray-200 py-16 text-center text-gray-400">
                            <p className="text-lg font-medium">Sin solicitudes todavía.</p>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {pending.length > 0 && (
                                <div>
                                    <p className="text-xs font-semibold text-amber-600 uppercase tracking-widest mb-3">
                                        Pendientes ({pending.length})
                                    </p>
                                    <div className="space-y-3">
                                        {pending.map(app => <ApplicationCard key={app.id} app={app} />)}
                                    </div>
                                </div>
                            )}

                            {processed.length > 0 && (
                                <div>
                                    <p className="text-xs font-semibold text-indigo-300 uppercase tracking-widest mb-3">
                                        Procesadas ({processed.length})
                                    </p>
                                    <div className="space-y-3">
                                        {processed.map(app => <ApplicationCard key={app.id} app={app} />)}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Pagination */}
                    {applications.links && applications.links.length > 3 && (
                        <div className="mt-10 flex justify-center gap-2 flex-wrap">
                            {applications.links.map((link, i) => (
                                link.url ? (
                                    <Link
                                        key={i}
                                        href={link.url}
                                        className={`px-4 py-2 text-sm rounded-lg border transition ${
                                            link.active
                                                ? 'bg-indigo-600 text-white border-indigo-600'
                                                : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-400'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ) : (
                                    <span
                                        key={i}
                                        className="px-4 py-2 text-sm rounded-lg border bg-gray-50 text-gray-300 border-gray-100"
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                )
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}





