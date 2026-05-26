import { useState } from 'react';
import { router } from '@inertiajs/react';

const SECTORS = [
    'Tecnología', 'Salud', 'Educación', 'Finanzas', 'Retail', 'Logística',
    'Hostelería', 'Construcción', 'Consultoría', 'Marketing', 'Industria', 'Otro',
];

const BENEFIT_SUGGESTIONS = [
    'Teletrabajo', 'Horario flexible', 'Formación continua', 'Seguro médico',
    'Tickets restaurante', 'Bonos de transporte', 'Ambiente joven', 'Proyectos internacionales',
    'Plan de carrera', 'Comedor en oficina',
];

function EditField({ label, children }) {
    return (
        <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{label}</label>
            {children}
        </div>
    );
}

function TagList({ tags, onRemove }) {
    if (!tags?.length) return null;
    return (
        <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((t, i) => (
                <span key={i} className="flex items-center gap-1 px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full">
                    {t}
                    {onRemove && (
                        <button onClick={() => onRemove(i)} className="ml-1 text-indigo-400 hover:text-red-500 transition-colors">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>
                    )}
                </span>
            ))}
        </div>
    );
}

function InfoRow({ icon, children }) {
    return (
        <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="text-gray-400">{icon}</span>
            {children}
        </div>
    );
}

export default function CompanyPortfolioSection({ company, canManage }) {
    const [portfolio, setPortfolio] = useState(() => ({
        about: '',
        sector: '',
        size: '',
        benefits: [],
        why_us: '',
        website: '',
        linkedin: '',
        ...(company.portfolio ?? {}),
    }));
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState(portfolio);
    const [benefitInput, setBenefitInput] = useState('');
    const [saving, setSaving] = useState(false);

    const hasContent = portfolio.about || portfolio.sector || portfolio.benefits?.length ||
        portfolio.why_us || portfolio.website || portfolio.linkedin;

    const openEdit = () => { setDraft({ ...portfolio }); setEditing(true); };
    const cancel = () => setEditing(false);

    const addBenefit = (val) => {
        const v = val.trim();
        if (v && !draft.benefits.includes(v)) {
            setDraft(d => ({ ...d, benefits: [...(d.benefits ?? []), v] }));
        }
        setBenefitInput('');
    };

    const save = () => {
        setSaving(true);
        router.patch(route('companies.portfolio.update', company.id), { portfolio: draft }, {
            preserveScroll: true,
            onSuccess: () => { setPortfolio(draft); setEditing(false); },
            onFinish: () => setSaving(false),
        });
    };

    if (!hasContent && !canManage) return null;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 flex items-center justify-between border-b border-gray-100">
                <h2 className="text-base font-bold text-gray-900">Sobre la empresa</h2>
                {canManage && !editing && (
                    <button onClick={openEdit}
                        className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-indigo-600 bg-gray-100 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 11l6-6 3 3-6 6H9v-3z"/>
                        </svg>
                        Editar
                    </button>
                )}
            </div>

            {editing ? (
                <div className="px-6 py-5 space-y-4">
                    <EditField label="Descripción">
                        <textarea value={draft.about} onChange={e => setDraft(d => ({ ...d, about: e.target.value }))}
                            rows={4} maxLength={1500} placeholder="Cuéntanos quiénes sois..."
                            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none" />
                    </EditField>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <EditField label="Sector">
                            <select value={draft.sector} onChange={e => setDraft(d => ({ ...d, sector: e.target.value }))}
                                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300">
                                <option value="">Seleccionar sector</option>
                                {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </EditField>
                        <EditField label="Tamaño de empresa">
                            <select value={draft.size} onChange={e => setDraft(d => ({ ...d, size: e.target.value }))}
                                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300">
                                <option value="">Seleccionar tamaño</option>
                                {['1-10', '11-50', '51-200', '201-500', '500+'].map(s => <option key={s} value={s}>{s} empleados</option>)}
                            </select>
                        </EditField>
                    </div>

                    <EditField label="Beneficios">
                        <div className="flex gap-2">
                            <input value={benefitInput} onChange={e => setBenefitInput(e.target.value)}
                                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addBenefit(benefitInput); }}}
                                placeholder="Añadir beneficio..." maxLength={60}
                                className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
                            <button onClick={() => addBenefit(benefitInput)}
                                className="px-3 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-xl text-sm font-medium transition-colors">
                                Añadir
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                            {BENEFIT_SUGGESTIONS.filter(b => !(draft.benefits ?? []).includes(b)).map(b => (
                                <button key={b} onClick={() => addBenefit(b)}
                                    className="px-2.5 py-1 bg-gray-100 hover:bg-indigo-50 text-gray-600 hover:text-indigo-600 text-xs rounded-full transition-colors">
                                    + {b}
                                </button>
                            ))}
                        </div>
                        <TagList tags={draft.benefits} onRemove={i => setDraft(d => ({ ...d, benefits: d.benefits.filter((_, idx) => idx !== i) }))} />
                    </EditField>

                    <EditField label="¿Por qué trabajar con nosotros?">
                        <textarea value={draft.why_us} onChange={e => setDraft(d => ({ ...d, why_us: e.target.value }))}
                            rows={3} maxLength={800} placeholder="Describe qué os hace especiales..."
                            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none" />
                    </EditField>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <EditField label="Sitio web">
                            <input value={draft.website} onChange={e => setDraft(d => ({ ...d, website: e.target.value }))}
                                placeholder="https://vuestra-web.com" type="url" maxLength={200}
                                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
                        </EditField>
                        <EditField label="LinkedIn empresa">
                            <input value={draft.linkedin} onChange={e => setDraft(d => ({ ...d, linkedin: e.target.value }))}
                                placeholder="https://linkedin.com/company/..." type="url" maxLength={200}
                                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
                        </EditField>
                    </div>

                    <div className="flex gap-2 justify-end pt-2">
                        <button onClick={cancel} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                            Cancelar
                        </button>
                        <button onClick={save} disabled={saving}
                            className="px-5 py-2 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg disabled:opacity-50 transition-colors">
                            {saving ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                </div>
            ) : !hasContent ? (
                <div className="px-6 py-8 text-center">
                    <p className="text-sm text-gray-400 mb-3">Aún no habéis rellenado el portfolio de la empresa.</p>
                    <button onClick={openEdit}
                        className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 hover:underline">
                        + Añadir información
                    </button>
                </div>
            ) : (
                <div className="px-6 py-5 space-y-5">
                    {(portfolio.sector || portfolio.size) && (
                        <div className="flex flex-wrap gap-3">
                            {portfolio.sector && <InfoRow icon="🏢">{portfolio.sector}</InfoRow>}
                            {portfolio.size && <InfoRow icon="👥">{portfolio.size} empleados</InfoRow>}
                        </div>
                    )}
                    {portfolio.about && (
                        <div>
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Quiénes somos</h3>
                            <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">{portfolio.about}</p>
                        </div>
                    )}
                    {portfolio.benefits?.length > 0 && (
                        <div>
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Beneficios</h3>
                            <TagList tags={portfolio.benefits} />
                        </div>
                    )}
                    {portfolio.why_us && (
                        <div>
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">¿Por qué trabajar con nosotros?</h3>
                            <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">{portfolio.why_us}</p>
                        </div>
                    )}
                    {(portfolio.website || portfolio.linkedin) && (
                        <div className="flex flex-wrap gap-3 pt-1">
                            {portfolio.website && (
                                <a href={portfolio.website} target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 text-sm text-indigo-600 hover:underline">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9"/>
                                    </svg>
                                    Sitio web
                                </a>
                            )}
                            {portfolio.linkedin && (
                                <a href={portfolio.linkedin} target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 text-sm text-indigo-600 hover:underline">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z"/>
                                    </svg>
                                    LinkedIn
                                </a>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
