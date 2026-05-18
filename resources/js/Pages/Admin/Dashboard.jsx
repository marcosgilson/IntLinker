import { Head, Link, useForm, usePage } from '@inertiajs/react';
import Footer from '@/Components/Footer';

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
        city: '',
        description: '',
        email_local: '',
        email_domain: '',
        applications_email: '',
    });

    const updateEmail = (local, domain) => {
        const full = local && domain ? `${local}@${domain}` : '';
        setData(d => ({ ...d, email_local: local, email_domain: domain, applications_email: full }));
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.companies.store'), { onSuccess: () => reset() });
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-1">Crear empresa</h2>
            <p className="text-sm text-gray-500 mb-6">Las empresas creadas aqui estan disponibles de inmediato.</p>

            {recentlySuccessful && (
                <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium rounded-lg px-4 py-2.5">
                    Empresa creada correctamente.
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                <Field label="Nombre de la empresa *" error={errors.name}>
                    <Input placeholder="Ej. Siemens Mobility" value={data.name}
                        onChange={e => setData('name', e.target.value)} required autoFocus />
                </Field>
                <Field label="Localidad" error={errors.city}>
                    <Input placeholder="Ej. Madrid" value={data.city}
                        onChange={e => setData('city', e.target.value)} />
                </Field>
                <Field label="Descripcion" error={errors.description}>
                    <textarea rows={3} placeholder="Breve descripcion..."
                        value={data.description} onChange={e => setData('description', e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-900 placeholder-gray-400
                            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition resize-none" />
                </Field>
                <Field label="Correo de postulaciones" error={errors.applications_email}>
                    <div className="flex items-center gap-0">
                        <input
                            type="text"
                            placeholder="info"
                            value={data.email_local}
                            onChange={e => updateEmail(e.target.value, data.email_domain)}
                            className="flex-1 min-w-0 px-3.5 py-2.5 rounded-l-lg border border-r-0 border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        />
                        <span className="px-2 py-2.5 bg-gray-50 border-t border-b border-gray-300 text-gray-500 text-sm font-medium select-none">@</span>
                        <input
                            type="text"
                            placeholder="educa.madrid.org"
                            value={data.email_domain}
                            onChange={e => updateEmail(data.email_local, e.target.value)}
                            className="flex-1 min-w-0 px-3.5 py-2.5 rounded-r-lg border border-l-0 border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        />
                    </div>
                    {data.applications_email && (
                        <p className="mt-1 text-xs text-gray-400">Resultado: <span className="font-medium text-gray-600">{data.applications_email}</span></p>
                    )}
                </Field>
                <div className="pt-2">
                    <button type="submit" disabled={processing}
                        className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold px-6 py-2.5 rounded-lg transition text-sm">
                        {processing ? 'Creando...' : 'Crear empresa'}
                    </button>
                </div>
            </form>
        </div>
    );
}

// ── Pending student row ───────────────────────────────────────────────────────
function StudentRow({ student }) {
    const verify = useForm({});
    const reject = useForm({});

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                    <p className="font-bold text-gray-900">{student.user?.name}</p>
                    <p className="text-xs text-gray-400">{student.user?.email}</p>
                    <p className="text-xs text-gray-500 mt-1">
                        Escuela: <span className="font-medium">{student.school_name || '—'}</span>
                        {student.school_email && <> · {student.school_email}</>}
                    </p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full border bg-amber-50 text-amber-700 border-amber-200 flex-shrink-0">
                    Pendiente
                </span>
            </div>

            {student.id_alumno && (
                <details className="mb-3">
                    <summary className="text-xs text-indigo-600 cursor-pointer font-medium">Ver texto OCR extraido del carnet</summary>
                    <pre className="mt-2 text-xs bg-gray-50 border border-gray-200 rounded p-2 whitespace-pre-wrap max-h-32 overflow-auto">
                        {student.id_alumno}
                    </pre>
                </details>
            )}

            <div className="flex gap-2">
                <button onClick={() => verify.patch(route('admin.students.verify', student.id))}
                    disabled={verify.processing || reject.processing}
                    className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg transition disabled:opacity-50">
                    {verify.processing ? 'Verificando...' : 'Verificar alumno'}
                </button>
                <button onClick={() => reject.delete(route('admin.students.reject', student.id))}
                    disabled={verify.processing || reject.processing}
                    className="text-xs font-semibold text-red-500 hover:text-red-700 hover:bg-red-50 border border-red-200 px-3 py-1.5 rounded-lg transition disabled:opacity-50">
                    {reject.processing ? 'Rechazando...' : 'Rechazar'}
                </button>
            </div>
        </div>
    );
}

// ── Pending worker row ────────────────────────────────────────────────────────
function WorkerRow({ worker }) {
    const verify = useForm({ user_id: worker.user_id, company_id: worker.company_id });
    const reject = useForm({ user_id: worker.user_id, company_id: worker.company_id });

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                    <p className="font-bold text-gray-900">{worker.user_name}</p>
                    <p className="text-xs text-gray-400">{worker.user_email}</p>
                    <p className="text-xs text-gray-500 mt-1">
                        Empresa: <span className="font-medium">{worker.company_name}</span>
                        {worker.position && <> · {worker.position}</>}
                    </p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full border bg-amber-50 text-amber-700 border-amber-200 flex-shrink-0">
                    Pendiente
                </span>
            </div>

            <div className="flex gap-2">
                <button onClick={() => verify.patch(route('admin.workers.verify'))}
                    disabled={verify.processing || reject.processing}
                    className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg transition disabled:opacity-50">
                    {verify.processing ? 'Verificando...' : 'Verificar trabajador'}
                </button>
                <button onClick={() => reject.delete(route('admin.workers.reject'))}
                    disabled={verify.processing || reject.processing}
                    className="text-xs font-semibold text-red-500 hover:text-red-700 hover:bg-red-50 border border-red-200 px-3 py-1.5 rounded-lg transition disabled:opacity-50">
                    {reject.processing ? 'Rechazando...' : 'Rechazar'}
                </button>
            </div>
        </div>
    );
}

// ── Company application row ───────────────────────────────────────────────────
function ApplicationRow({ app }) {
    const approve = useForm({ admin_notes: '' });
    const reject  = useForm({ admin_notes: '' });

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
                    <button onClick={() => approve.patch(route('admin.company-applications.approve', app.id))}
                        disabled={approve.processing || reject.processing}
                        className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg transition disabled:opacity-50">
                        {approve.processing ? 'Aprobando...' : 'Aprobar empresa'}
                    </button>
                    <button onClick={() => reject.patch(route('admin.company-applications.reject', app.id))}
                        disabled={approve.processing || reject.processing}
                        className="text-xs font-semibold text-red-500 hover:text-red-700 hover:bg-red-50 border border-red-200 px-3 py-1.5 rounded-lg transition disabled:opacity-50">
                        {reject.processing ? 'Rechazando...' : 'Rechazar'}
                    </button>
                </div>
            )}
        </div>
    );
}

// ── Section wrapper ───────────────────────────────────────────────────────────
function Section({ title, count, children, emptyText }) {
    return (
        <div>
            <div className="flex items-center gap-3 mb-4">
                <h2 className="text-lg font-bold text-white">{title}</h2>
                {count > 0 && (
                    <span className="text-xs font-bold bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full">
                        {count} pendiente{count !== 1 ? 's' : ''}
                    </span>
                )}
            </div>
            {count === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-200 py-8 text-center text-gray-400">
                    <p className="font-medium text-sm">{emptyText}</p>
                </div>
            ) : (
                <div className="space-y-3">{children}</div>
            )}
        </div>
    );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function AdminDashboard({ applications = {}, pendingStudents = [], pendingWorkers = [] }) {
    const { auth } = usePage().props;
    const appList = applications.data ?? [];
    const pending = appList.filter(a => a.status === 'pending');
    const processed = appList.filter(a => a.status !== 'pending');

    const totalPending = pendingStudents.length + pendingWorkers.length + pending.length;

    return (
        <>
            <Head title="Panel Admin — IntLinker" />

            <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-900 font-sans">
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
                            {totalPending > 0 && (
                                <span className="text-xs font-bold bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full">
                                    {totalPending} pendiente{totalPending !== 1 ? 's' : ''}
                                </span>
                            )}
                            <Link href="/profile" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition px-3 py-2">
                                {auth.user?.name}
                            </Link>
                            <Link href="/IntLinker" className="text-sm text-gray-500 hover:text-indigo-600 transition px-3 py-2">
                                Inicio
                            </Link>
                        </div>
                    </div>
                </nav>

                <div className="pt-24 pb-12 max-w-4xl mx-auto px-6">
                    <div className="mb-8">
                        <h1 className="text-3xl font-extrabold text-white">Panel de administracion</h1>
                        <p className="text-gray-300 mt-1">Verifica identidades y gestiona empresas.</p>
                    </div>

                    <div className="space-y-10">
                        {/* Pending students */}
                        <Section title="Alumnos pendientes de verificacion" count={pendingStudents.length}
                            emptyText="No hay alumnos pendientes de verificacion.">
                            {pendingStudents.map(s => <StudentRow key={s.id} student={s} />)}
                        </Section>

                        {/* Pending workers */}
                        <Section title="Trabajadores pendientes de verificacion" count={pendingWorkers.length}
                            emptyText="No hay trabajadores pendientes de verificacion.">
                            {pendingWorkers.map(w => <WorkerRow key={`${w.user_id}-${w.company_id}`} worker={w} />)}
                        </Section>

                        {/* Company applications */}
                        <Section title="Solicitudes de nueva empresa" count={pending.length}
                            emptyText="Sin solicitudes de empresa pendientes.">
                            {pending.map(app => <ApplicationRow key={app.id} app={app} />)}
                            {processed.length > 0 && (
                                <>
                                    <p className="text-xs font-semibold text-indigo-300 uppercase tracking-widest mt-4">Procesadas</p>
                                    {processed.map(app => <ApplicationRow key={app.id} app={app} />)}
                                </>
                            )}
                        </Section>

                        {/* Create company */}
                        <CreateCompanyForm />
                    </div>
                </div>
                <Footer />

            </div>
        </>
    );
}