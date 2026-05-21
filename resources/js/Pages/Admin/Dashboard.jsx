import IntLinkerLogo from '@/Components/IntLinkerLogo';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import Footer from '@/Components/Footer';
import { useState, useRef, useEffect } from 'react';

const SPANISH_CITIES = [
    // Madrid y área metropolitana
    'Madrid','Alcobendas','Tres Cantos','Majadahonda','Boadilla del Monte',
    'Las Rozas de Madrid','Alcalá de Henares','Leganés','Getafe','Móstoles',
    'Fuenlabrada','Alcorcón','Pozuelo de Alarcón','Torrejón de Ardoz',
    // Cataluña
    'Barcelona','Martorell','El Prat de Llobregat','Sant Cugat del Vallès',
    'Palau-solità i Plegamans','Sabadell','Terrassa','Badalona','Lleida',
    'Tarragona','Girona','Mataró','Hospitalet de Llobregat',
    // Comunitat Valenciana
    'Valencia','Tavernes Blanques','Almussafes','Alicante','Castellón de la Plana',
    'Vila-real','Elche','Torrent','Sagunto',
    // Andalucía
    'Sevilla','Málaga','Granada','Córdoba','Almería','Cantoria','Huelva',
    'Jerez de la Frontera','Cádiz','Los Barrios','San Fernando','Algeciras',
    'Dos Hermanas','Marbella',
    // País Vasco y Navarra
    'Bilbao','San Sebastián','Vitoria-Gasteiz','Beasain','Hernani',
    'Arrasate-Mondragón','Donostia','Pamplona','Cizur Menor',
    // Aragón y La Rioja
    'Zaragoza','Figueruelas','Haro','Logroño',
    // Galicia
    'A Coruña','Arteixo','Vigo','Santiago de Compostela','Lugo','Ourense',
    // Asturias y Cantabria
    'Oviedo','Gijón','Avilés','Santander','Torrelavega',
    // Castilla y León
    'Valladolid','Burgos','Salamanca','León','Palencia','Segovia',
    // Otras capitales y ciudades
    'Palma','Las Palmas de Gran Canaria','Santa Cruz de Tenerife',
    'San Cristóbal de La Laguna','Murcia','Cartagena','Badajoz','Toledo',
    'Guadalajara','Ciudad Real',
];


const EMAIL_DOMAINS = [
    'indra.es','telefonica.com','iberdrola.es','santander.com','repsol.com',
    'gmv.com','mapfre.com','acciona.com','amadeus.com','ferrovial.com',
    'bbva.com','prosegur.com','endesa.es','ohl.es','seat.es','naturgy.com',
    'caixabank.com','vueling.com','grifols.com','cellnex.com','abertis.com',
    'mango.com','almirall.com','mercadona.es','ford.com','porcelanosa.com',
    'consum.es','aguasdevalencia.es','airbus.com','abengoa.com','acerinox.com',
    'navantia.es','heineken.es','cosentino.com','caf.net','idom.com',
    'laboralkutxa.com','ik4.es','orona.com','viscofan.com','bsh-group.es',
    'stellantis.com','bodegasmuga.com','inditex.com','r.es','arcelormittal.com',
    'solvay.com','renault.com','grupoantolin.com','cajamar.es','melia.com',
    'bintercanarias.com','disa.es','estrellalevante.es','talgo.com',
];
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

function CitySelect({ value, onChange, error }) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const ref = useRef(null);

    const filtered = SPANISH_CITIES.filter(c =>
        c.toLowerCase().includes(search.toLowerCase())
    );

    useEffect(() => {
        const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const select = (city) => { onChange(city); setOpen(false); setSearch(''); };
    const clear   = (e)    => { e.stopPropagation(); onChange(''); setSearch(''); };

    return (
        <div className="relative" ref={ref}>
            <button
                type="button"
                onClick={() => setOpen(o => !o)}
                className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-left flex items-center justify-between transition
                    ${error ? 'border-red-400 focus:ring-red-400' : 'border-gray-300 focus:ring-indigo-500'}
                    ${value ? 'text-gray-900' : 'text-gray-400'}
                    focus:outline-none focus:ring-2 bg-white`}
            >
                <span>{value || 'Selecciona una ciudad...'}</span>
                <div className="flex items-center gap-1">
                    {value && (
                        <span onClick={clear} className="text-gray-400 hover:text-gray-600 px-1 text-base leading-none">×</span>
                    )}
                    <svg className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </button>

            {open && (
                <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                    <div className="p-2 border-b border-gray-100">
                        <input
                            autoFocus
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Buscar ciudad..."
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder-gray-400
                                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <ul className="max-h-52 overflow-y-auto">
                        {filtered.length === 0 ? (
                            <li className="px-4 py-3 text-sm text-gray-400 text-center">Sin resultados</li>
                        ) : (
                            filtered.map(city => (
                                <li key={city}>
                                    <button
                                        type="button"
                                        onClick={() => select(city)}
                                        className={`w-full text-left px-4 py-2.5 text-sm transition
                                            ${value === city
                                                ? 'bg-indigo-50 text-indigo-700 font-semibold'
                                                : 'text-gray-700 hover:bg-gray-50'}`}
                                    >
                                        {city}
                                    </button>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            )}
        </div>
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
                    <Input placeholder="Ej. Indra Sistemas" value={data.name}
                        onChange={e => setData('name', e.target.value)} required autoFocus />
                </Field>
                <Field label="Localidad" error={errors.city}>
                    <CitySelect
                        value={data.city}
                        onChange={city => setData('city', city)}
                        error={errors.city}
                    />
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


// ── Company email row ─────────────────────────────────────────────────────────
function CompanyEmailRow({ company }) {
    const [local, domain0] = (company.applications_email ?? '@').split('@');
    const { data, setData, patch, processing, recentlySuccessful } = useForm({
        applications_email: company.applications_email ?? '',
        email_local:  local  ?? '',
        email_domain: domain0 ?? '',
    });

    const updateEmail = (l, d) => {
        const full = l && d ? `${l}@${d}` : '';
        setData(prev => ({ ...prev, email_local: l, email_domain: d, applications_email: full }));
    };

    const submit = (e) => {
        e.preventDefault();
        patch(route('admin.companies.email.update', company.id), { preserveScroll: true });
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between gap-4 mb-3 flex-wrap">
                <div>
                    <p className="font-semibold text-gray-900 text-sm">{company.name}</p>
                    {company.city && <p className="text-xs text-gray-400">{company.city}</p>}
                </div>
                {recentlySuccessful && (
                    <span className="text-xs text-emerald-600 font-semibold">✓ Guardado</span>
                )}
            </div>
            <form onSubmit={submit} className="flex items-center gap-0">
                <input
                    type="text"
                    placeholder="empleo"
                    value={data.email_local}
                    onChange={e => updateEmail(e.target.value, data.email_domain)}
                    className="w-28 px-3 py-2 rounded-l-lg border border-r-0 border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
                <span className="px-2 py-2 bg-gray-50 border-t border-b border-gray-300 text-gray-500 text-sm font-medium select-none">@</span>
                <input
                    type="text"
                    placeholder="dominio.com"
                    value={data.email_domain}
                    onChange={e => updateEmail(data.email_local, e.target.value)}
                    className="flex-1 min-w-0 px-3 py-2 rounded-r-lg border border-l-0 border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
                <button
                    type="submit"
                    disabled={processing || !data.applications_email}
                    className="ml-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition"
                >
                    {processing ? '...' : 'Guardar'}
                </button>
            </form>
            {data.applications_email && (
                <p className="mt-1.5 text-xs text-gray-400">→ <span className="font-medium text-gray-600">{data.applications_email}</span></p>
            )}
        </div>
    );
}
// ── Main page ─────────────────────────────────────────────────────────────────
export default function AdminDashboard({ applications = {}, pendingStudents = [], pendingWorkers = [], companies = [] }) {
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
                            <IntLinkerLogo className="h-10 w-auto" />
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
                        <Section title="Alumnos pendientes de verificacion" count={pendingStudents.length}
                            emptyText="No hay alumnos pendientes de verificacion.">
                            {pendingStudents.map(s => <StudentRow key={s.id} student={s} />)}
                        </Section>

                        <Section title="Trabajadores pendientes de verificacion" count={pendingWorkers.length}
                            emptyText="No hay trabajadores pendientes de verificacion.">
                            {pendingWorkers.map(w => <WorkerRow key={`${w.user_id}-${w.company_id}`} worker={w} />)}
                        </Section>

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

                        {companies.length > 0 && (
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <h2 className="text-lg font-bold text-white">Correos de postulaciones</h2>
                                    <span className="text-xs text-gray-300">{companies.length} empresa{companies.length !== 1 ? 's' : ''}</span>
                                </div>
                                <div className="space-y-3">
                                    {companies.map(c => <CompanyEmailRow key={c.id} company={c} />)}
                                </div>
                            </div>
                        )}

                        <CreateCompanyForm />
                    </div>
                </div>
                <Footer />
            </div>
        </>
    );
}











