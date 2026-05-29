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

function UnifiedSearch({ allCities, allCompanyNames, selectedCities, selectedCompanies, onChangeCities, onChangeCompanies, onClearAll }) {
    const [query, setQuery] = useState('');
    const [open, setOpen] = useState(false);
    const inputRef = useRef(null);
    const dropdownRef = useRef(null);

    const q = query.trim().toLowerCase();

    const citySuggestions = q.length > 0
        ? allCities.filter(c => c.toLowerCase().includes(q) && !selectedCities.includes(c)).slice(0, 5)
        : [];

    const companySuggestions = q.length > 0
        ? allCompanyNames.filter(c => c.name.toLowerCase().includes(q) && !selectedCompanies.includes(c.name)).slice(0, 5)
        : [];

    const hasResults = citySuggestions.length > 0 || companySuggestions.length > 0;

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
        <div className="w-full max-w-xl">
            {/* Input */}
            <div className="relative">
                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-400 focus-within:border-indigo-400 transition">
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
                                if (citySuggestions.length > 0) addCity(citySuggestions[0]);
                                else if (companySuggestions.length > 0) addCompany(companySuggestions[0].name);
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
                    <div ref={dropdownRef} className="absolute z-20 mt-1 w-full bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden">
                        {citySuggestions.length > 0 && (
                            <>
                                <div className="px-4 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wide bg-gray-50">
                                    Localidades
                                </div>
                                {citySuggestions.map(city => (
                                    <button key={city} onMouseDown={() => addCity(city)}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 flex items-center gap-2 transition">
                                        {city}
                                    </button>
                                ))}
                            </>
                        )}
                        {companySuggestions.length > 0 && (
                            <>
                                <div className="px-4 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wide bg-gray-50">
                                    Empresas
                                </div>
                                {companySuggestions.map(c => (
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
                        className="text-xs text-gray-400 hover:text-gray-600 px-2 py-1 rounded-full border border-gray-200 hover:border-gray-300 transition">
                        Limpiar todo
                    </button>
                </div>
            )}
        </div>
    );
}

function CompanyCard({ company, highlightedCity }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const roles = auth?.roles ?? {};
    const enrollForm = useForm({ company_id: company.id });
    const doEnroll = () => enrollForm.post(route('enrollments.store'));

    return (
        <div className={`bg-white rounded-2xl shadow-sm border p-6 flex flex-col gap-4 hover:shadow-md transition ${highlightedCity ? 'border-indigo-200 ring-1 ring-indigo-100' : 'border-gray-100'}`}>
            <div className="flex items-center gap-3">
                {company.logo_url ? (
                    <img src={company.logo_url} alt={company.name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0"/>
                ) : (
                    <div className={`w-12 h-12 rounded-xl ${stringToColor(company.name)} flex items-center justify-center text-white font-bold flex-shrink-0`}>
                        {initials(company.name)}
                    </div>
                )}
                <div className="flex-1 min-w-0">
                    <h2 className="font-bold text-gray-900 truncate">{company.name}</h2>
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
            {company.description && <p className="text-sm text-gray-600 line-clamp-2">{company.description}</p>}
            <div className="mt-auto flex flex-wrap gap-2">
                <Link href={route('companies.show', company.id)}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-800 border border-indigo-200 hover:border-indigo-400 px-4 py-2 rounded-lg transition">
                    Ver empresa
                </Link>
                {user && roles.is_student && (
                    <button onClick={doEnroll} disabled={enrollForm.processing}
                        className="text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 px-4 py-2 rounded-lg transition">
                        {enrollForm.processing ? 'Enviando...' : 'Postularse'}
                    </button>
                )}
            </div>
        </div>
    );
}

export default function CompaniesIndex({
    companies = {}, allCities = [], allCompanyNames = [],
    selectedCities: initCities = [], selectedCompanies: initCompanies = []
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
            <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-900 font-sans">
                <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
                    <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                        <Link href="/inicio" className="flex items-center gap-2">
                            <IntLinkerLogo className="h-20 w-auto" />
                        </Link>
                        <div className="flex items-center gap-3">
                            {user ? (
                                <>
                                    <Link href="/perfil" className="flex items-center hover:opacity-80 transition px-2 py-1"><UserAvatar user={user} /></Link>
                                    <Link href="/inicio" className="text-sm text-gray-500 hover:text-indigo-600 transition px-3 py-2">← Inicio</Link>
                                </>
                            ) : (
                                <Link href="/inicio" className="text-sm text-gray-500 hover:text-indigo-600 transition px-3 py-2">← Inicio</Link>
                            )}
                        </div>
                    </div>
                </nav>

                <div className="pt-24 pb-12 max-w-6xl mx-auto px-4 sm:px-6">
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
                        <p className="text-sm text-gray-300 mb-4">
                            {selectedCities.length > 0 && <>Priorizando <span className="font-medium text-indigo-600">{selectedCities.join(', ')}</span>. </>}
                            {selectedCompanies.length > 0 && <>Filtrando por <span className="font-medium text-violet-600">{selectedCompanies.join(', ')}</span>.</>}
                        </p>
                    )}

                    {list.length === 0 ? (
                        <div className="text-center py-20 text-gray-300">
                            <p className="text-lg font-medium">No se encontraron empresas.</p>
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {list.map(company => (
                                <CompanyCard key={company.id} company={company}
                                    highlightedCity={selectedCities.includes(company.city)}/>
                            ))}
                        </div>
                    )}

                    {companies.links && companies.links.length > 3 && (
                        <div className="mt-10 flex justify-center gap-2 flex-wrap">
                            {companies.links.map((link, i) => (
                                link.url ? (
                                    <Link key={i} href={link.url}
                                        className={`px-4 py-2 text-sm rounded-lg border transition ${link.active ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-400'}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}/>
                                ) : (
                                    <span key={i} className="px-4 py-2 text-sm rounded-lg border bg-gray-50 text-gray-300 border-gray-100"
                                        dangerouslySetInnerHTML={{ __html: link.label }}/>
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




