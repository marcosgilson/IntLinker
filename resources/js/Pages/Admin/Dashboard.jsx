import { Head, Link, useForm, usePage } from '@inertiajs/react';

function Field({ label, error, children }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            {children}
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
}

function Input({ className = '', ...props }) {
    return (
        <input
            className={`w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-900 placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition ${className}`}
            {...props}
        />
    );
}

// ── Create company form ───────────────────────────────────────────────────────
function CreateCompanyForm() {
    const { data, setData, post, processing, errors, reset, recentlySuccessful } = useForm({
        name: '',
        description: '',
        applications_email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.companies.store'), { onSuccess: () => reset() });
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-1">Crear empresa</h2>
            <p className="text-sm text-gray-500 mb-6">Las empresas creadas aquí están disponibles de inmediato para que los trabajadores se unan.</p>

            {recentlySuccessful && (
                <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium rounded-lg px-4 py-2.5">
                    ✓ Empresa creada correctamente.
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                <Field label="Nombre de la empresa *" error={errors.name}>
                    <Input
                        placeholder="Ej. Siemens Mobility"
                        value={data.name}
                        onChange={e => setData('name', e.target.value)}
                        required
                        autoFocus
                    />
                </Field>

                <Field label="Descripción" error={errors.description}>
                    <textarea
                        rows={3}
                        placeholder="Breve descripción de la empresa y las oportunidades que ofrece…"
                        value={data.description}
                        onChange={e => setData('description', e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-900 placeholder-gray-400
                            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition resize-none"
                    />
                </Field>

                <Field label="Correo de postulaciones" error={errors.applications_email}>
                    <Input
                        type="email"
                        placeholder="hr@empresa.com"
                        value={data.applications_email}
                        onChange={e => setData('applications_email', e.target.value)}
                    />
                </Field>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold px-6 py-2.5 rounded-lg transition text-sm"
                    >
                        {processing ? 'Creando…' : 'Crear empresa'}
                    </button>
                </div>
            </form>
        </div>
    );
}

// ── Application row ───────────────────────────────────────────────────────────
function ApplicationRow({ app }) {
    const approve = useForm({ admin_notes: '' });
    const reject  = useForm({ admin_notes: '' });

    const doApprove = () => {
        approve.patch(route('admin.company-applications.approve', app.id));
    };
    const doReject = () => {
        reject.patch(route('admin.company-applications.reject', app.id));
    };

    const statusCfg = {
        pending:  { label: 'Pendiente', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
        approved: { label: 'Aprobada',  cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
        rejected: { label: 'Rechazada', cls: 'bg-red-50 text-red-600 border-red-200' },
    }[app.status] ?? { label: app.status, cls: 'bg-gray-100 text-gray-500 border-gray-200' };

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                    <p className="font-bold text-gray-900">{app.company_name}</p>
                    <p className="text-xs text-gray-400">
                        Solicitado por <span className="font-medium text-gray-600">{app.user?.name}</span>
                        {' '}({app.user?.email})
                    </p>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border flex-shrink-0 ${statusCfg.cls}`}>
                    {statusCfg.label}
                </span>
            </div>

            {app.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{app.description}</p>
            )}

            {app.status === 'pending' && (
                <div className="flex gap-2">
                    <button
                        onClick={doApprove}
                        disabled={approve.processing || reject.processing}
                        className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg transition disabled:opacity-50"
                    >
                        {approve.processing ? 'Aprobando…' : '✓ Aprobar'}
                    </button>
                    <button
                        onClick={doReject}
                        disabled={approve.processing || reject.processing}
                        className="text-xs font-semibold text-red-500 hover:text-red-700 hover:bg-red-50 border border-red-200 px-3 py-1.5 rounded-lg transition disabled:opacity-50"
                    >
                        {reject.processing ? 'Rechazando…' : '✗ Rechazar'}
                    </button>
                </div>
            )}
        </div>
    );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function AdminDashboard({ applications = {} }) {
    const { auth } = usePage().props;
    const appList = applications.data ?? [];
    const pending = appList.filter(a => a.status === 'pending');
    const processed = appList.filter(a => a.status !== 'pending');

    return (
        <>
            <Head title="Panel Admin — IntLinker" />

            <div className="min-h-screen bg-gray-50 font-sans">
                {/* Navbar */}
                <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
                    <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                        <Link href="/IntLinker" className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                                <span className="text-white font-bold text-sm">IL</span>
                            </div>
                            <span className="text-xl font-bold text-gray-900">IntLinker</span>
                        </Link>
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-semibold bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full">Admin</span>
                            <Link href="/profile" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition px-3 py-2">
                                {auth.user?.name}
                            </Link>
                            <Link href="/IntLinker" className="text-sm text-gray-500 hover:text-indigo-600 transition px-3 py-2">
                                ← Inicio
                            </Link>
                        </div>
                    </div>
                </nav>

                <div className="pt-24 pb-12 max-w-4xl mx-auto px-6">
                    <div className="mb-8">
                        <h1 className="text-3xl font-extrabold text-gray-900">Panel de administración</h1>
                        <p className="text-gray-500 mt-1">Gestión de empresas y solicitudes.</p>
                    </div>

                    <div className="space-y-8">
                        {/* Create company */}
                        <CreateCompanyForm />

                        {/* Pending applications */}
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <h2 className="text-lg font-bold text-gray-900">Solicitudes de empresa</h2>
                                {pending.length > 0 && (
                                    <span className="text-xs font-bold bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full">
                                        {pending.length} pendiente{pending.length !== 1 ? 's' : ''}
                                    </span>
                                )}
                            </div>

                            {appList.length === 0 ? (
                                <div className="bg-white rounded-2xl border border-gray-200 py-12 text-center text-gray-400">
                                    <p className="font-medium">Sin solicitudes todavía.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {pending.length > 0 && (
                                        <>
                                            <p className="text-xs font-semibold text-amber-600 uppercase tracking-widest">Pendientes</p>
                                            {pending.map(app => <ApplicationRow key={app.id} app={app} />)}
                                        </>
                                    )}
                                    {processed.length > 0 && (
                                        <>
                                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mt-6">Procesadas</p>
                                            {processed.map(app => <ApplicationRow key={app.id} app={app} />)}
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
