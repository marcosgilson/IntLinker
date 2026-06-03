import IntLinkerLogo from '@/Components/IntLinkerLogo';
import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import Footer from '@/Components/Footer';
import { useState, useRef, useEffect } from 'react';
import UserAvatar from '@/Components/UserAvatar';

function stringToColor(str) {
    const palette = ['bg-indigo-600','bg-violet-600','bg-teal-600','bg-blue-700','bg-rose-600','bg-amber-600','bg-emerald-600','bg-sky-600','bg-fuchsia-600'];
    let hash = 0;
    for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
    return palette[Math.abs(hash) % palette.length];
}
function initials(name) {
    return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

function translatePaginationLabel(label) {
    const trimmed = String(label).trim();
    const cleaned = trimmed
        .replace(/&laquo;|«/g, '')
        .replace(/&raquo;|»/g, '')
        .trim();

    if (/^Previous$/i.test(cleaned)) return 'Anterior';
    if (/^Next$/i.test(cleaned)) return 'Siguiente';
    return cleaned;
}

function UnifiedSearch({ allCities, allCompanyNames, selectedCities, selectedCompanies, onChangeCities, onChangeCompanies, onClearAll }) {
    const [query, setQuery] = useState('');
    const [open, setOpen] = useState(false);
    const inputRef = useRef(null);
    const dropdownRef = useRef(null);

    const q = query.trim().toLowerCase();

    const citySuggestións = q.length > 0
        ? allCities.filter(c => c.toLowerCase().includes(q) && !selectedCities.includes(c)).slice(0, 5)
        : [];

    const companySuggestións = q.length > 0
        ? allCompanyNames.filter(c => c.name.toLowerCase().includes(q) && !selectedCompanies.includes(c.name)).slice(0, 5)
        : [];

    const hasResults = citySuggestións.length > 0 || companySuggestións.length > 0;

    const addCity = (city) => {
        if (!selectedCities.includes(city)) onChangeCities([...selectedCities, city]);
        setQuery(''); setOpen(false); inputRef.current?.focus();
    };

    const addCompany = (name) => {
        if (!selectedCompanies.includes(name)) onChangeCompanies([...selectedCompanies, name]);
        setQuery(''); setOpen(false); inputRef.current?.focus();
    };

    const removeCity = (city) => onChangeCities(selectedCities.filter(c => c !== city));
    const removeCompany = (name) => onChangeCompanies(selectedCompanies.filter(c => c !== name));

    useEffect(() => {
        const handler = (e) => {
            if (!dropdownRef.current?.contains(e.target) && !inputRef.current?.contains(e.target))
                setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const hasFilters = selectedCities.length > 0 || selectedCompanies.length > 0;

    return (
        <div className="w-full max-w-2xl">
            {/* Input */}
            <div className="relative">
                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 sm:px-4 py-2.5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-400 focus-within:border-indigo-400 transition">
                    <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                    </svg>
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        placeholder="Buscar empresa o localidad..."
                        onChange={e => { setQuery(e.target.value); setOpen(true); }}
                        onFocus={() => setOpen(true)}
                        onKeyDown={e => {
                            if (e.key === 'Escape') setOpen(false);
                            if (e.key === 'Enter') {
                                if (citySuggestións.length > 0) addCity(citySuggestións[0]);
                                else if (companySuggestións.length > 0) addCompany(companySuggestións[0].name);
                            }
                        }}
                        className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none"
                    />
                    {query && (
                        <button onClick={() => { setQuery(''); setOpen(false); }} className="text-gray-300 hover:text-gray-500">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>
                    )}
                </div>

                {/* Dropdown */}
                {open && hasResults && (
                    <div ref={dropdownRef} className="absolute z-20 mt-1 left-0 right-0 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden">
                        {citySuggestións.length > 0 && (
                            <>
                                <div className="px-4 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wide bg-gray-50">
                                    Localidades
                                </div>
                                {citySuggestións.map(city => (
                                    <button key={city} onMouseDown={() => addCity(city)}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 flex items-center gap-2 transition">
                                        {city}
                                    </button>
                                ))}
                            </>
                        )}
                        {companySuggestións.length > 0 && (
                            <>
                                <div className="px-4 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wide bg-gray-50">
                                    Empresas
                                </div>
                                {companySuggestións.map(c => (
                                    <button key={c.id} onMouseDown={() => addCompany(c.name)}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-violet-50 hover:text-violet-700 flex items-center gap-2 transition">
                                        <span className="text-violet-400">🏢</span> {c.name}
                                    </button>
                                ))}
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* Tags */}
            {hasFilters && (
                <div className="flex flex-wrap gap-2 mt-3">
                    {selectedCities.map(city => (
                        <span key={city} className="inline-flex items-center gap-1.5 bg-indigo-100 text-indigo-700 text-sm font-medium px-3 py-1 rounded-full">
                            {city}
                            <button onClick={() => removeCity(city)} className="hover:text-indigo-900">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12"/>
                                </svg>
                            </button>
                        </span>
                    ))}
                    {selectedCompanies.map(name => (
                        <span key={name} className="inline-flex items-center gap-1.5 bg-violet-100 text-violet-700 text-sm font-medium px-3 py-1 rounded-full">
                            🏢 {name}
                            <button onClick={() => removeCompany(name)} className="hover:text-violet-900">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12"/>
                                </svg>
                            </button>
                        </span>
                    ))}
                    <button onClick={onClearAll}
                        className="text-xs text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-full border border-gray-200 hover:border-gray-300 transition">
                        Limpiar todo
                    </button>
                </div>
            )}
        </div>
    );
}

const STATUS_CONFIG = {
    waiting:   { label: 'En espera',  bg: 'bg-amber-50',  border: 'border-amber-200',  text: 'text-amber-700',  icon: '',   modalBg: 'bg-amber-500'  },
    accepted:  { label: 'Aceptado',   bg: 'bg-green-50',  border: 'border-green-200',  text: 'text-green-700',  icon: '',   modalBg: 'bg-green-500'  },
    rejected:  { label: 'Rechazado',  bg: 'bg-red-50',    border: 'border-red-200',    text: 'text-red-600',    icon: '',   modalBg: 'bg-red-500'    },
    cancelled: { label: 'Cancelado',  bg: 'bg-gray-50',   border: 'border-gray-200',   text: 'text-gray-500',   icon: '',   modalBg: 'bg-gray-400'   },
};

function EnrollmentModal({ company, status, onClose }) {
    const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.waiting;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <div className="relative bg-white rounded-2xl shadow-xl max-w-sm w-full p-6" onClick={e => e.stopPropagation()}>
                <div className="flex items-center gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-xl ${cfg.modalBg} flex items-center justify-center text-white text-xl font-bold flex-shrink-0`}>
                        {cfg.icon}
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Tu postulacion en</p>
                        <h3 className="font-bold text-gray-900 text-lg leading-tight">{company.name}</h3>
                    </div>
                </div>
                <div className={`rounded-xl border ${cfg.bg} ${cfg.border} px-4 py-3 mb-5`}>
                    <p className={`text-sm font-semibold ${cfg.text}`}>Estado: {cfg.label}</p>
                    <p className="text-xs text-gray-500 mt-1">
                        {status === 'waiting'   && 'Tu solicitud ha sido enviada y esta siendo revisada por la empresa.'}
                        {status === 'accepted'  && 'Enhorabuena, la empresa ha aceptado tu postulacion.'}
                        {status === 'rejected'  && 'La empresa no ha seleccionado tu perfil en este momento.'}
                        {status === 'cancelled' && 'Esta postulacion fue cancelada.'}
                    </p>
                </div>
                <div className="flex gap-3">
                    <Link href={route('companies.show', company.id)}
                        className="flex-1 inline-flex min-h-10 items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-800 border border-indigo-200 hover:border-indigo-400 px-4 py-2 rounded-lg transition">
                        Ver empresa
                    </Link>
                    <button onClick={onClose}
                        className="flex-1 inline-flex min-h-10 items-center justify-center text-sm font-semibold text-gray-600 hover:text-gray-800 border border-gray-200 hover:border-gray-300 px-4 py-2 rounded-lg transition">
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
}

function CompanyCard({ company, highlightedCity, enrollmentStatus }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const roles = auth?.roles ?? {};
    const enrollForm = useForm({ company_id: company.id });
    const [showModal, setShowModal] = useState(false);
    const doEnroll = () => enrollForm.post(route('enrollments.store'), { preserveScroll: true });
    const cfg = enrollmentStatus ? STATUS_CONFIG[enrollmentStatus] : null;

    return (
        <>
            {showModal && enrollmentStatus && (
                <EnrollmentModal company={company} status={enrollmentStatus} onClose={() => setShowModal(false)} />
            )}
            <div className={`bg-white rounded-2xl shadow-sm border p-4 sm:p-6 flex flex-col gap-4 hover:shadow-md transition ${highlightedCity ? 'border-indigo-200 ring-1 ring-indigo-100' : 'border-gray-100'}`}>
                <div className="flex items-start gap-3">
                    {company.logo_url ? (
                        <img src={company.logo_url} alt={company.name} className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl object-cover flex-shrink-0"/>
                    ) : (
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${stringToColor(company.name)} flex items-center justify-center text-white font-bold flex-shrink-0`}>
                            {initials(company.name)}
                        </div>
                    )}
                    <div className="flex-1 min-w-0">
                        <h2 className="font-bold text-gray-900 break-words">{company.name}</h2>
                        {company.city && (
                            <p className={`text-xs mt-0.5 flex items-center gap-1 ${highlightedCity ? 'text-indigo-500 font-medium' : 'text-gray-400'}`}>
                                {company.city}
                            </p>
                        )}
                        {company.pending_count > 0 && (
                            <span className="text-xs text-indigo-600 font-medium">
                                {company.pending_count} candidato{company.pending_count !== 1 ? 's' : ''} en proceso
                            </span>
                        )}
                    </div>
                </div>
                {company.description && <p className="text-sm text-gray-600 line-clamp-3 break-words">{company.description}</p>}
                <div className="mt-auto flex flex-col sm:flex-row gap-2">
                    <Link href={route('companies.show', company.id)}
                        className="inline-flex min-h-10 w-full sm:w-auto items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-800 border border-indigo-200 hover:border-indigo-400 px-4 py-2 rounded-lg transition">
                        Ver empresa
                    </Link>
                    {user && roles.is_student && !auth?.user?.is_admin && (
                        enrollmentStatus ? (
                            <button onClick={() => setShowModal(true)}
                                className={`inline-flex min-h-10 w-full sm:w-auto items-center justify-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-lg border transition ${cfg.bg} ${cfg.border} ${cfg.text}`}>
                                {cfg.label}
                            </button>
                        ) : (
                            <button onClick={doEnroll} disabled={enrollForm.processing}
                                className="inline-flex min-h-10 w-full sm:w-auto items-center justify-center text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 px-4 py-2 rounded-lg transition">
                                {enrollForm.processing ? 'Enviando...' : 'Postularse'}
                            </button>
                        )
                    )}
                </div>
            </div>
        </>
    );
}

export default function CompaniesIndex({
    companies = {}, allCities = [], allCompanyNames = [],
    selectedCities: initCities = [], selectedCompanies: initCompanies = [], enrollmentStatuses = {}
}) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const list = companies.data ?? [];

    const [selectedCities, setSelectedCities] = useState(initCities);
    const [selectedCompanies, setSelectedCompanies] = useState(initCompanies);

    useEffect(() => { setSelectedCities(initCities); }, [JSON.stringify(initCities)]);
    useEffect(() => { setSelectedCompanies(initCompanies); }, [JSON.stringify(initCompanies)]);

    const applyFilters = (cities, comps) => {
        const params = {};
        if (cities.length) params.cities = cities;
        if (comps.length) params.companies = comps;
        router.get(route('companies.index'), params, { preserveScroll: true, replace: true });
    };

    const handleCitiesChange = (cities) => { setSelectedCities(cities); applyFilters(cities, selectedCompanies); };
    const handleCompaniesChange = (comps) => { setSelectedCompanies(comps); applyFilters(selectedCities, comps); };
    const handleClearAll = () => { setSelectedCities([]); setSelectedCompanies([]); applyFilters([], []); };

    return (
        <>
            <Head title="Empresas — IntLinker"/>
            <div className="flex flex-col min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-900 font-sans">
                <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-18 flex items-center justify-between">
                        <Link href="/inicio" className="flex items-center gap-2">
                            <IntLinkerLogo className="h-20 sm:h-20 w-auto" />
                        </Link>
                        <div className="flex items-start gap-3">
                            {user ? (
                                <>
                                    <Link href="/perfil" className="flex items-center hover:opacity-80 transition px-2 py-1"><UserAvatar user={user} /></Link>
                                    <Link href="/inicio" className="flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-600 transition px-2 sm:px-3 py-2"><span>←</span><span className="hidden sm:inline">Inicio</span></Link>
                                </>
                            ) : (
                                <Link href="/inicio" className="flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-600 transition px-2 sm:px-3 py-2"><span>←</span><span className="hidden sm:inline">Inicio</span></Link>
                            )}
                        </div>
                    </div>
                </nav>

                <div className="pt-20 sm:pt-24 pb-12 max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="mb-6">
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Empresas colaboradoras</h1>
                        <p className="text-gray-300 mt-1">Busca por empresa o localidad.</p>
                    </div>

                    <div className="mb-8">
                        <UnifiedSearch
                            allCities={allCities}
                            allCompanyNames={allCompanyNames}
                            selectedCities={selectedCities}
                            selectedCompanies={selectedCompanies}
                            onChangeCities={handleCitiesChange}
                            onChangeCompanies={handleCompaniesChange}
                            onClearAll={handleClearAll}
                        />
                    </div>

                    {(selectedCities.length > 0 || selectedCompanies.length > 0) && (
                        <p className="text-sm text-gray-300 mb-4 break-words">
                            {selectedCities.length > 0 && <>Priorizando <span className="font-medium text-indigo-600">{selectedCities.join(', ')}</span>. </>}
                            {selectedCompanies.length > 0 && <>Filtrando por <span className="font-medium text-violet-600">{selectedCompanies.join(', ')}</span>.</>}
                        </p>
                    )}

                    {list.length === 0 ? (
                        <div className="text-center py-20 text-gray-300">
                            <p className="text-lg font-medium">No se encontraron empresas.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                            {list.map(company => (
                                <CompanyCard key={company.id} company={company}
                                    highlightedCity={selectedCities.includes(company.city)}
                                    enrollmentStatus={enrollmentStatuses[company.id] ?? null}/>
                            ))}
                        </div>
                    )}

                    {companies.links && companies.links.length > 1 && (
                        <div className="mt-10 flex justify-center gap-2 flex-wrap">
                            {companies.links.map((link, i) => (
                                link.url ? (
                                    <Link key={i} href={link.url}
                                        className={`px-4 py-2 text-sm rounded-lg border transition ${link.active ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-400'}`}>
                                        {translatePaginationLabel(link.label)}
                                    </Link>
                                ) : (
                                    <span key={i} className="px-4 py-2 text-sm rounded-lg border bg-gray-50 text-gray-300 border-gray-100">
                                        {translatePaginationLabel(link.label)}
                                    </span>
                                )
                            ))}
                        </div>
                    )}
                </div>
                <Footer />

            </div>
        </>
    );
}




