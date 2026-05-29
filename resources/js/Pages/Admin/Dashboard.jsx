import IntLinkerLogo from '@/Components/IntLinkerLogo';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import Footer from '@/Components/Footer';
import { useState, useRef, useEffect } from 'react';

const SPANISH_CITIES = [
    // Madrid y area metropolitana
    'Madrid','Alcobendas','Tres Cantos','Majadahonda','Boadilla del Monte',
    'Las Rozas de Madrid','Alcala de Henares','Leganes','Getafe','Mostoles',
    'Fuenlabrada','Alcorcon','Pozuelo de Alarcon','Torrejon de Ardoz',
    // Cataluna
    'Barcelona','Martorell','El Prat de Llobregat','Sant Cugat del Valles',
    'Palau-solita i Plegamans','Sabadell','Terrassa','Badalona','Lleida',
    'Tarragona','Girona','Mataro','Hospitalet de Llobregat',
    // Comunitat Valenciana
    'Valencia','Tavernes Blanques','Almussafes','Alicante','Castellon de la Plana',
    'Vila-real','Elche','Torrent','Sagunto',
    // Andalucia
    'Sevilla','Malaga','Granada','Cordoba','Almeria','Cantoria','Huelva',
    'Jerez de la Frontera','Cadiz','Los Barrios','San Fernando','Algeciras',
    'Dos Hermanas','Marbella',
    // Pais Vasco y Navarra
    'Bilbao','San Sebastian','Vitoria-Gasteiz','Beasain','Hernani',
    'Arrasate-Mondragon','Donostia','Pamplona','Cizur Menor',
    // Aragon y La Rioja
    'Zaragoza','Figueruelas','Haro','Logrono',
    // Galicia
    'A Coruna','Arteixo','Vigo','Santiago de Compostela','Lugo','Ourense',
    // Asturias y Cantabria
    'Oviedo','Gijon','Aviles','Santander','Torrelavega',
    // Castilla y Leon
    'Valladolid','Burgos','Salamanca','Leon','Palencia','Segovia',
    // Otras capitales y ciudades
    'Palma','Las Palmas de Gran Canaria','Santa Cruz de Tenerife',
    'San Cristobal de La Laguna','Murcia','Cartagena','Badajoz','Toledo',
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
                        <span onClick={clear} className="text-gray-400 hover:text-gray-600 px-1 text-base leading-none">-</span>
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


// â”€ Create company form â”€
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
        <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-1">Crear empresa</h2>
            <p className="text-sm sm:text-base text-gray-500 mb-5 sm:mb-6">Las empresas creadas aqui estan disponibles de inmediato.</p>

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
                    <div className="flex flex-col sm:flex-row items-stretch gap-2 sm:gap-0">
                        <input
                            type="text"
                            placeholder="info"
                            value={data.email_local}
                            onChange={e => updateEmail(e.target.value, data.email_domain)}
                            className="flex-1 min-w-0 px-3.5 py-2.5 rounded-lg sm:rounded-l-lg sm:rounded-r-none border border-gray-300 sm:border-r-0 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        />
                        <span className="hidden sm:flex px-2 py-2.5 bg-gray-50 border-t border-b border-gray-300 text-gray-500 text-sm font-medium select-none">@</span>
                        <input
                            type="text"
                            placeholder="educa.madrid.org"
                            value={data.email_domain}
                            onChange={e => updateEmail(data.email_local, e.target.value)}
                            className="flex-1 min-w-0 px-3.5 py-2.5 rounded-lg sm:rounded-r-lg sm:rounded-l-none border border-gray-300 sm:border-l-0 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        />
                    </div>
                    {data.applications_email && (
                        <p className="mt-1 text-xs text-gray-400">Resultado: <span className="font-medium text-gray-600">{data.applications_email}</span></p>
                    )}
                </Field>
                <div className="pt-2">
                    <button type="submit" disabled={processing}
                        className="inline-flex min-h-10 w-full sm:w-auto items-center justify-center bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold px-6 py-2.5 rounded-lg transition text-sm">
                        {processing ? 'Creando...' : 'Crear empresa'}
                    </button>
                </div>
            </form>
        </div>
    );
}

// â”€ Pending student row â”€
function useCountdown(expiresAt) {
    const calc = () => {
        const diff = Math.max(0, Math.floor((new Date(expiresAt) - Date.now()) / 1000));
        const h = Math.floor(diff / 3600);
        const m = Math.floor((diff % 3600) / 60);
        const s = diff % 60;
        return { total: diff, h, m, s };
    };
    const [time, setTime] = useState(calc);
    useEffect(() => {
        if (time.total <= 0) return;
        const id = setInterval(() => setTime(calc()), 1000);
        return () => clearInterval(id);
    }, [expiresAt]);
    return time;
}

function UnverifiedUserRow({ user }) {
    const del = useForm({});
    const verify = useForm({});
    const { total, h, m, s } = useCountdown(user.expires_at);
    const urgent = total < 3600;
    const pad = n => String(n).padStart(2, '0');
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <p className="font-semibold text-gray-900 text-sm">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
                <p className="text-xs text-gray-400 mt-0.5">Registrado: {new Date(user.created_at).toLocaleDateString('es-ES')}</p>
                {total > 0 ? (
                    <p className={`text-xs font-medium mt-1 ${urgent ? 'text-red-500' : 'text-amber-500'}`}>
                        {urgent ? '⚠️' : '⏳'} Expira en: {pad(h)}:{pad(m)}:{pad(s)}
                    </p>
                ) : (
                    <p className="text-xs font-medium mt-1 text-red-600">⛔ Expirado — se eliminara pronto</p>
                )}
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
                <button
                    onClick={() => { if (window.confirm('Verificar la cuenta de ' + user.name + '? El usuario podra acceder a la plataforma.')) { verify.patch(route('admin.unverified-users.verify', user.id)); } }}
                    disabled={verify.processing}
                    className="inline-flex min-h-10 flex-1 sm:flex-none items-center justify-center px-4 py-2 text-sm font-semibold rounded-lg bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 transition disabled:opacity-50"
                >
                    {verify.processing ? 'Verificando...' : 'Verificar'}
                </button>
                <button
                    onClick={() => { if (window.confirm('Eliminar la cuenta de ' + user.name + '?')) { del.delete(route('admin.unverified-users.delete', user.id)); } }}
                    disabled={del.processing}
                    className="inline-flex min-h-10 flex-1 sm:flex-none items-center justify-center px-4 py-2 text-sm font-semibold rounded-lg bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition disabled:opacity-50"
                >
                    Eliminar
                </button>
            </div>
        </div>
    );
}

function StudentRow({ student }) {
    const verify = useForm({});
    const reject = useForm({});

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-3">
                <div>
                    <p className="font-bold text-gray-900">{student.user?.name}</p>
                    <p className="text-xs text-gray-400">{student.user?.email}</p>
                    <p className="text-xs text-gray-500 mt-1">
                        Escuela: <span className="font-medium">{student.school_name || '–'}</span>
                        {student.school_email && <> Â· {student.school_email}</>}
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

            <div className="flex flex-col sm:flex-row gap-2">
                <button onClick={() => verify.patch(route('admin.students.verify', student.id))}
                    disabled={verify.processing || reject.processing}
                    className="inline-flex min-h-10 w-full sm:w-auto items-center justify-center text-sm font-semibold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-lg transition disabled:opacity-50">
                    {verify.processing ? 'Verificando...' : 'Verificar alumno'}
                </button>
                <button onClick={() => reject.delete(route('admin.students.reject', student.id))}
                    disabled={verify.processing || reject.processing}
                    className="inline-flex min-h-10 w-full sm:w-auto items-center justify-center text-sm font-semibold text-red-500 hover:text-red-700 hover:bg-red-50 border border-red-200 px-4 py-2 rounded-lg transition disabled:opacity-50">
                    {reject.processing ? 'Rechazando...' : 'Rechazar'}
                </button>
            </div>
        </div>
    );
}

// â”€ Pending worker row â”€
function WorkerRow({ worker }) {
    const verify = useForm({ user_id: worker.user_id, company_id: worker.company_id });
    const reject = useForm({ user_id: worker.user_id, company_id: worker.company_id });

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-3">
                <div>
                    <p className="font-bold text-gray-900">{worker.user_name}</p>
                    <p className="text-xs text-gray-400">{worker.user_email}</p>
                    <p className="text-xs text-gray-500 mt-1">
                        Empresa: <span className="font-medium">{worker.company_name}</span>
                        {worker.position && <> Â· {worker.position}</>}
                    </p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full border bg-amber-50 text-amber-700 border-amber-200 flex-shrink-0">
                    Pendiente
                </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
                <button onClick={() => verify.patch(route('admin.workers.verify'))}
                    disabled={verify.processing || reject.processing}
                    className="inline-flex min-h-10 w-full sm:w-auto items-center justify-center text-sm font-semibold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-lg transition disabled:opacity-50">
                    {verify.processing ? 'Verificando...' : 'Verificar trabajador'}
                </button>
                <button onClick={() => reject.delete(route('admin.workers.reject'))}
                    disabled={verify.processing || reject.processing}
                    className="inline-flex min-h-10 w-full sm:w-auto items-center justify-center text-sm font-semibold text-red-500 hover:text-red-700 hover:bg-red-50 border border-red-200 px-4 py-2 rounded-lg transition disabled:opacity-50">
                    {reject.processing ? 'Rechazando...' : 'Rechazar'}
                </button>
            </div>
        </div>
    );
}

// â”€ Company application row â”€
function ApplicationRow({ app }) {
    const approve = useForm({ admin_notes: '' });
    const reject  = useForm({ admin_notes: '' });

    const statusCfg = {
        pending:  { label: 'Pendiente', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
        approved: { label: 'Aprobada',  cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
        rejected: { label: 'Rechazada', cls: 'bg-red-50 text-red-600 border-red-200' },
    }[app.status] ?? { label: app.status, cls: 'bg-gray-100 text-gray-500 border-gray-200' };

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-3">
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
                <div className="flex flex-col sm:flex-row gap-2">
                    <button onClick={() => approve.patch(route('admin.company-applications.approve', app.id))}
                        disabled={approve.processing || reject.processing}
                        className="inline-flex min-h-10 w-full sm:w-auto items-center justify-center text-sm font-semibold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-lg transition disabled:opacity-50">
                        {approve.processing ? 'Aprobando...' : 'Aprobar empresa'}
                    </button>
                    <button onClick={() => reject.patch(route('admin.company-applications.reject', app.id))}
                        disabled={approve.processing || reject.processing}
                        className="inline-flex min-h-10 w-full sm:w-auto items-center justify-center text-sm font-semibold text-red-500 hover:text-red-700 hover:bg-red-50 border border-red-200 px-4 py-2 rounded-lg transition disabled:opacity-50">
                        {reject.processing ? 'Rechazando...' : 'Rechazar'}
                    </button>
                </div>
            )}
        </div>
    );
}

// â”€ Section wrapper â”€
function Section({ title, count, children, emptyText }) {
    return (
        <div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4">
                <h2 className="text-lg font-bold text-white">{title}</h2>
                {count > 0 && (
                    <span className="text-xs font-bold bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full">
                        {count} pendiente{count !== 1 ? 's' : ''}
                    </span>
                )}
            </div>
            {count === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-8 text-center text-gray-400">
                    <p className="font-medium text-sm">{emptyText}</p>
                </div>
            ) : (
                <div className="space-y-3">{children}</div>
            )}
        </div>
    );
}


// â”€ Company email row â”€
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
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div>
                    <p className="font-semibold text-gray-900 text-sm">{company.name}</p>
                    {company.city && <p className="text-xs text-gray-400">{company.city}</p>}
                </div>
                {recentlySuccessful && (
                    <span className="text-xs text-emerald-600 font-semibold">âœ“ Guardado</span>
                )}
            </div>
            <form onSubmit={submit} className="flex flex-col sm:flex-row items-stretch gap-2 sm:gap-0">
                <input
                    type="text"
                    placeholder="empleo"
                    value={data.email_local}
                    onChange={e => updateEmail(e.target.value, data.email_domain)}
                    className="w-full sm:w-28 px-3 py-2 rounded-lg sm:rounded-l-lg sm:rounded-r-none border border-gray-300 sm:border-r-0 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
                <span className="hidden sm:flex px-2 py-2 bg-gray-50 border-t border-b border-gray-300 text-gray-500 text-sm font-medium select-none">@</span>
                <input
                    type="text"
                    placeholder="dominio.com"
                    value={data.email_domain}
                    onChange={e => updateEmail(data.email_local, e.target.value)}
                    className="flex-1 min-w-0 px-3 py-2 rounded-lg sm:rounded-r-lg sm:rounded-l-none border border-gray-300 sm:border-l-0 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
                <button
                    type="submit"
                    disabled={processing || !data.applications_email}
                    className="sm:ml-2 inline-flex min-h-10 w-full sm:w-auto items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition"
                >
                    {processing ? '...' : 'Guardar'}
                </button>
            </form>
            {data.applications_email && (
                <p className="mt-1.5 text-xs text-gray-400">â†’ <span className="font-medium text-gray-600">{data.applications_email}</span></p>
            )}
        </div>
    );
}
// â”€ Main page â”€
export default function AdminDashboard({ applications = {}, pendingEmailUsers = [], pendingStudents = [], pendingWorkers = [], companies = [], allStudents = [] }) {
    const { auth } = usePage().props;
    const appList = applications.data ?? [];
    const pending = appList.filter(a => a.status === 'pending');
    const processed = appList.filter(a => a.status !== 'pending');

    const totalPending = pendingStudents.length + pendingWorkers.length + pending.length;

    return (
        <>
            <Head title="Panel Admin – IntLinker" />

            <div className="flex flex-col min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-900 font-sans">
                <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-3">
                        <Link href="/inicio" className="flex items-center gap-2">
                            <IntLinkerLogo className="h-12 sm:h-12 w-auto" />
                        </Link>
                        <div className="flex items-center gap-3 min-w-0">
                            <span className="text-xs font-semibold bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full">Admin</span>
                            {totalPending > 0 && (
                                <span className="text-xs font-bold bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full">
                                    {totalPending} pendiente{totalPending !== 1 ? 's' : ''}
                                </span>
                            )}
                            <Link href="/perfil" className="flex items-center hover:opacity-80 transition">
                                {auth.user?.photo_url ? (
                                    <img src={auth.user.photo_url} alt={auth.user.name} className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-200" />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                                        <span className="text-indigo-700 font-bold text-xs">{auth.user?.name?.charAt(0).toUpperCase()}</span>
                                    </div>
                                )}
                            </Link>
                            <Link href="/" className="text-sm text-gray-500 hover:text-indigo-600 transition px-3 py-2">
                                Inicio
                            </Link>
                        </div>
                    </div>
                </nav>

                <div className="pt-20 sm:pt-24 pb-12 max-w-5xl mx-auto px-4 sm:px-6">
                    <div className="mb-8">
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Panel de administracion</h1>
                        <p className="text-gray-300 mt-1">Verifica identidades y gestiona empresas.</p>
                    </div>

                    <div className="space-y-10">
                        <Section title="Cuentas sin verificar email" count={pendingEmailUsers.length}
                            emptyText="No hay cuentas pendientes de verificacion de email.">
                            {pendingEmailUsers.map(u => <UnverifiedUserRow key={u.id} user={u} />)}
                        </Section>

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
                                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4">
                                    <h2 className="text-lg font-bold text-white">Correos de postulaciones</h2>
                                    <span className="text-xs text-gray-300 break-all">{companies.length} empresa{companies.length !== 1 ? 's' : ''}</span>
                                </div>
                                <div className="space-y-3">
                                    {companies.map(c => <CompanyEmailRow key={c.id} company={c} />)}
                                </div>
                            </div>
                        )}

                        <Section title="Todos los alumnos verificados" count={allStudents.length}
                            emptyText="No hay alumnos verificados aun.">
                            {allStudents.map(s => (
                                <div key={s.id} className="bg-white/10 rounded-xl px-4 py-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex items-center gap-3 min-w-0">
                                        {s.user?.photo_url ? (
                                            <img src={s.user.photo_url} alt={s.user?.name}
                                                className="w-8 h-8 rounded-full object-cover ring-2 ring-white/20" />
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-indigo-400/30 flex items-center justify-center">
                                                <span className="text-white text-xs font-bold">
                                                    {(s.user?.name || 'U').charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-sm font-semibold text-white break-words">{s.user?.name}</p>
                                            <p className="text-xs text-gray-300 break-all">{s.user?.email}</p>
                                        </div>
                                    </div>
                                    <Link href={route('students.profile', s.id)}
                                        className="inline-flex min-h-10 w-full sm:w-auto items-center justify-center text-sm font-semibold text-indigo-200 hover:text-white bg-indigo-500/30
                                            hover:bg-indigo-500/50 px-4 py-2 rounded-lg transition-colors">
                                        Ver perfil
                                    </Link>
                                </div>
                            ))}
                        </Section>

                        <CreateCompanyForm />
                    </div>
                </div>
                <Footer />
            </div>
        </>
    );
}











