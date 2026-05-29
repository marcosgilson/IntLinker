import { useState, useRef } from 'react';
import { router } from '@inertiajs/react';
import Modal from '@/Components/Modal';

const uid = () => Math.random().toString(36).slice(2, 9);
const LIMITS = { education: 10, projects: 8, gallery: 12 };

const LINK_ICONS = {
    github:   { label: 'GitHub',   icon: 'M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z' },
    linkedin: { label: 'LinkedIn', icon: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z' },
    website:  { label: 'Web',      icon: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9' },
    twitter:  { label: 'Twitter',  icon: 'M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z' },
};

function SectionHeader({ title, onAdd, isOwner, count, max }) {
    const atMax = max != null && count >= max;
    return (
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-gray-800">{title}</h3>
                {isOwner && max != null && (
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${atMax ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-500'}`}>
                        {count}/{max}
                    </span>
                )}
            </div>
            {isOwner && (
                <button onClick={onAdd} disabled={atMax}
                    title={atMax ? Limite de  alcanzado : undefined}
                    className={w-8 h-8 flex items-center justify-center rounded-full transition-colors }>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
                    </svg>
                </button>
            )}
        </div>
    );
}

function EditButtons({ onEdit, onDelete }) {
    return (
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={onEdit} className="p-1 text-gray-400 hover:text-indigo-600 rounded">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 11l6-6 3 3-6 6H9v-3z"/>
                </svg>
            </button>
            <button onClick={onDelete} className="p-1 text-gray-400 hover:text-red-500 rounded">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
            </button>
        </div>
    );
}

export default function PortfolioSection({ portfolio: initialPortfolio, isOwner }) {
    const [portfolio, setPortfolio] = useState(() => ({
        bio: '', education: [], projects: [], gallery: [],
        links: { github: '', linkedin: '', website: '', twitter: '' },
        ...(initialPortfolio ?? {}),
    }));
    const [modal, setModal]   = useState(null); // { type, data?, index? }
    const [saving, setSaving] = useState(false);
    const galleryRef = useRef(null);

    const save = (updated) => {
        setSaving(true);
        setPortfolio(updated);
        router.patch(route('profile.portfolio.update'), { portfolio: updated }, {
            preserveScroll: true,
            onFinish: () => setSaving(false),
        });
    };

    // ── Bio ──────────────────────────────────────────────────────────────────
    const BioSection = () => {
        const [editing, setEditing] = useState(false);
        const [text, setText]       = useState(portfolio.bio ?? '');

        if (!editing) {
            if (!portfolio.bio && !isOwner) return null;
            return (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-base font-semibold text-gray-800">Sobre mi</h3>
                        {isOwner && (
                            <button onClick={() => setEditing(true)} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 11l6-6 3 3-6 6H9v-3z"/>
                                </svg>
                            </button>
                        )}
                    </div>
                    {portfolio.bio
                        ? <p className="text-sm text-gray-600 whitespace-pre-line">{portfolio.bio}</p>
                        : <button onClick={() => setEditing(true)} className="text-sm text-indigo-500 hover:text-indigo-700">+ Añadir descripción sobre ti</button>
                    }
                </div>
            );
        }

        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <h3 className="text-base font-semibold text-gray-800 mb-3">Sobre mi</h3>
                <textarea value={text} onChange={e => setText(e.target.value)} rows={4}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
                    placeholder="Cuentanos sobre ti..." maxLength={1000} />
                <div className="flex gap-2 justify-end mt-3">
                    <button onClick={() => setEditing(false)} className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100">Cancelar</button>
                    <button onClick={() => { save({ ...portfolio, bio: text }); setEditing(false); }}
                        className="px-4 py-1.5 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg">
                        Guardar
                    </button>
                </div>
            </div>
        );
    };

    // ── Education ────────────────────────────────────────────────────────────
    const EducationSection = () => {
        const items = portfolio.education ?? [];
        const empty = <div className="p-5 bg-white rounded-2xl shadow-sm border border-gray-100">
            <SectionHeader title="Estudios" onAdd={() => setModal({ type: 'education', data: null })} isOwner={isOwner} count={items.length} max={LIMITS.education} />
            {isOwner && items.length < LIMITS.education && <button onClick={() => setModal({ type: 'education', data: null })} className="text-sm text-indigo-500 hover:text-indigo-700">+ Añadir estudios</button>}
        </div>;

        if (!items.length && !isOwner) return null;
        if (!items.length) return empty;

        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <SectionHeader title="Estudios" onAdd={() => setModal({ type: 'education', data: null })} isOwner={isOwner} count={items.length} max={LIMITS.education} />
                <div className="space-y-4">
                    {items.map((edu, i) => (
                        <div key={edu.id} className="group flex gap-3">
                            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
                                </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">{edu.institution}</p>
                                        <p className="text-sm text-gray-600">{edu.degree}{edu.field ? ` · ${edu.field}` : ''}</p>
                                        <p className="text-xs text-gray-400 mt-0.5">{edu.start_year}{edu.end_year || edu.current ? ` – ${edu.current ? 'Actualidad' : edu.end_year}` : ''}</p>
                                        {edu.description && <p className="text-xs text-gray-500 mt-1">{edu.description}</p>}
                                    </div>
                                    {isOwner && <EditButtons onEdit={() => setModal({ type: 'education', data: edu, index: i })} onDelete={() => { const e = [...items]; e.splice(i,1); save({ ...portfolio, education: e }); }} />}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // ── Projects ─────────────────────────────────────────────────────────────
    const ProjectsSection = () => {
        const items = portfolio.projects ?? [];
        if (!items.length && !isOwner) return null;
        if (!items.length) return (
            <div className="p-5 bg-white rounded-2xl shadow-sm border border-gray-100">
                <SectionHeader title="Proyectos" onAdd={() => setModal({ type: 'project', data: null })} isOwner={isOwner} count={items.length} max={LIMITS.projects} />
                {isOwner && items.length < LIMITS.projects && <button onClick={() => setModal({ type: 'project', data: null })} className="text-sm text-indigo-500 hover:text-indigo-700">+ Añadir proyecto</button>}
            </div>
        );

        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <SectionHeader title="Proyectos" onAdd={() => setModal({ type: 'project', data: null })} isOwner={isOwner} count={items.length} max={LIMITS.projects} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {items.map((proj, i) => (
                        <div key={proj.id} className="group relative rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                            {proj.image_url && <img src={proj.image_url} alt={proj.title} className="w-full h-32 object-cover"/>}
                            <div className="p-3">
                                <div className="flex items-start justify-between gap-1">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-gray-900 truncate">{proj.title}</p>
                                        {proj.description && <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{proj.description}</p>}
                                        {proj.url && <a href={proj.url} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-500 hover:underline mt-1 inline-block truncate max-w-full">{proj.url}</a>}
                                    </div>
                                    {isOwner && <EditButtons onEdit={() => setModal({ type: 'project', data: proj, index: i })} onDelete={() => { const p = [...items]; p.splice(i,1); save({ ...portfolio, projects: p }); }} />}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // ── Gallery ──────────────────────────────────────────────────────────────
    const GallerySection = () => {
        const imgs = portfolio.gallery ?? [];
        const [uploading, setUploading] = useState(false);

        const handleUpload = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            if (imgs.length >= LIMITS.gallery) return;
            setUploading(true);
            const reader = new FileReader();
            reader.onload = () => {
                const updated = { ...portfolio, gallery: [...imgs, reader.result] };
                save(updated);
                setUploading(false);
            };
            reader.readAsDataURL(file);
        };

        const removeImage = (i) => {
            const g = [...imgs]; g.splice(i, 1);
            save({ ...portfolio, gallery: g });
        };

        if (!imgs.length && !isOwner) return null;

        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <SectionHeader title="Galeria" onAdd={() => galleryRef.current?.click()} isOwner={isOwner} count={imgs.length} max={LIMITS.gallery} />
                {!imgs.length
                    ? isOwner && <button onClick={() => galleryRef.current?.click()} className="text-sm text-indigo-500 hover:text-indigo-700">+ Subir imagenes</button>
                    : (
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                            {imgs.map((src, i) => (
                                <div key={i} className="group relative aspect-square rounded-xl overflow-hidden">
                                    <img src={src} className="w-full h-full object-cover"/>
                                    {isOwner && (
                                        <button onClick={() => removeImage(i)}
                                            className="absolute top-1 right-1 w-5 h-5 bg-black/60 hover:bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )
                }
                {isOwner && <input ref={galleryRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleUpload} />}
                {uploading && <p className="text-xs text-gray-400 mt-2">Subiendo...</p>}
            </div>
        );
    };

    // ── Links ────────────────────────────────────────────────────────────────
    const LinksSection = () => {
        const [editing, setEditing] = useState(false);
        const links = portfolio.links ?? {};
        const [form, setForm] = useState({ github: '', linkedin: '', website: '', twitter: '', ...links });
        const hasLinks = Object.values(links).some(v => v);

        if (!hasLinks && !isOwner) return null;

        if (!editing) return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base font-semibold text-gray-800">Links</h3>
                    {isOwner && (
                        <button onClick={() => setEditing(true)} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 11l6-6 3 3-6 6H9v-3z"/>
                            </svg>
                        </button>
                    )}
                </div>
                {hasLinks ? (
                    <div className="flex flex-wrap gap-3">
                        {Object.entries(LINK_ICONS).map(([key, { label, icon }]) => links[key] ? (
                            <a key={key} href={links[key]} target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-indigo-600 bg-gray-50 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors">
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d={icon}/></svg>
                                {label}
                            </a>
                        ) : null)}
                    </div>
                ) : isOwner && (
                    <button onClick={() => setEditing(true)} className="text-sm text-indigo-500 hover:text-indigo-700">+ Añadir links</button>
                )}
            </div>
        );

        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <h3 className="text-base font-semibold text-gray-800 mb-4">Links</h3>
                <div className="space-y-3">
                    {Object.entries(LINK_ICONS).map(([key, { label }]) => (
                        <div key={key} className="flex items-center gap-3">
                            <span className="text-xs text-gray-500 w-16 flex-shrink-0">{label}</span>
                            <input value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                                placeholder={`https://`}
                                className="flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"/>
                        </div>
                    ))}
                </div>
                <div className="flex gap-2 justify-end mt-4">
                    <button onClick={() => setEditing(false)} className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100">Cancelar</button>
                    <button onClick={() => { save({ ...portfolio, links: form }); setEditing(false); }}
                        className="px-4 py-1.5 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg">Guardar</button>
                </div>
            </div>
        );
    };

    // ── Education modal ──────────────────────────────────────────────────────
    const defaultEdu = { id: uid(), institution: '', degree: '', field: '', start_year: '', end_year: '', current: false, description: '' };
    const [eduForm, setEduForm] = useState(defaultEdu);
    const openEduModal = (data) => { setEduForm(data ? { ...data } : { ...defaultEdu, id: uid() }); setModal({ type: 'education', data }); };

    const saveEdu = () => {
        const items = [...(portfolio.education ?? [])];
        const idx   = modal?.index ?? -1;
        if (idx >= 0) items[idx] = eduForm; else items.push(eduForm);
        save({ ...portfolio, education: items });
        setModal(null);
    };

    // ── Project modal ────────────────────────────────────────────────────────
    const defaultProj = { id: uid(), title: '', description: '', url: '', image_url: '' };
    const [projForm, setProjForm]   = useState(defaultProj);
    const projImageRef              = useRef(null);
    const openProjModal = (data) => { setProjForm(data ? { ...data } : { ...defaultProj, id: uid() }); setModal({ type: 'project', data }); };

    const handleProjImage = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => setProjForm(f => ({ ...f, image_url: reader.result }));
        reader.readAsDataURL(file);
    };

    const saveProj = () => {
        const items = [...(portfolio.projects ?? [])];
        const idx   = modal?.index ?? -1;
        if (idx >= 0) items[idx] = projForm; else items.push(projForm);
        save({ ...portfolio, projects: items });
        setModal(null);
    };

    return (
        <div className="space-y-4">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-1">Portfolio</h2>

            <BioSection />
            <LinksSection />
            <EducationSection />
            <ProjectsSection />
            <GallerySection />

            {/* Education modal */}
            <Modal show={modal?.type === 'education'} onClose={() => setModal(null)} maxWidth="md">
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{modal?.data ? 'Editar estudios' : 'Añadir estudios'}</h3>
                    <div className="space-y-3">
                        <input value={eduForm.institution} onChange={e => setEduForm(f => ({ ...f, institution: e.target.value }))} placeholder="Institucion *" className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"/>
                        <input value={eduForm.degree} onChange={e => setEduForm(f => ({ ...f, degree: e.target.value }))} placeholder="Titulo / Grado" className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"/>
                        <input value={eduForm.field} onChange={e => setEduForm(f => ({ ...f, field: e.target.value }))} placeholder="Campo de estudio" className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"/>
                        <div className="flex gap-3">
                            <input type="number" min="1900" max="2100" value={eduForm.start_year} onChange={e => setEduForm(f => ({ ...f, start_year: e.target.value.replace(/[^0-9]/g, '') }))}
                            onKeyDown={e => { if (!/[0-9]/.test(e.key) && !['Backspace','Delete','ArrowLeft','ArrowRight','Tab'].includes(e.key)) e.preventDefault(); }}
                            placeholder="Año inicio" className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"/>
                            <input type="number" min="1900" max="2100" value={eduForm.end_year} onChange={e => setEduForm(f => ({ ...f, end_year: e.target.value.replace(/[^0-9]/g, '') }))}
                            onKeyDown={e => { if (!/[0-9]/.test(e.key) && !['Backspace','Delete','ArrowLeft','ArrowRight','Tab'].includes(e.key)) e.preventDefault(); }}
                            placeholder="Año fin" disabled={eduForm.current} className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 disabled:bg-gray-50 disabled:text-gray-400"/>
                        </div>
                        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                            <input type="checkbox" checked={eduForm.current} onChange={e => setEduForm(f => ({ ...f, current: e.target.checked, end_year: '' }))} className="rounded"/>
                            En curso actualmente
                        </label>
                        <textarea value={eduForm.description} onChange={e => setEduForm(f => ({ ...f, description: e.target.value }))} placeholder="Descripción (opcional)" rows={2} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"/>
                    </div>
                    <div className="flex gap-2 justify-end mt-5">
                        <button onClick={() => setModal(null)} className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100">Cancelar</button>
                        <button onClick={saveEdu} disabled={!eduForm.institution} className="px-4 py-1.5 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg disabled:opacity-50">Guardar</button>
                    </div>
                </div>
            </Modal>

            {/* Project modal */}
            <Modal show={modal?.type === 'project'} onClose={() => setModal(null)} maxWidth="md">
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{modal?.data ? 'Editar proyecto' : 'Añadir proyecto'}</h3>
                    <div className="space-y-3">
                        {projForm.image_url ? (
                            <div className="relative">
                                <img src={projForm.image_url} className="w-full h-32 object-cover rounded-xl"/>
                                <button onClick={() => setProjForm(f => ({ ...f, image_url: '' }))}
                                    className="absolute top-2 right-2 w-6 h-6 bg-black/60 hover:bg-red-500 text-white rounded-full flex items-center justify-center">
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                                </button>
                            </div>
                        ) : (
                            <button onClick={() => projImageRef.current?.click()} className="w-full h-20 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center text-sm text-gray-400 hover:border-indigo-300 hover:text-indigo-500 transition-colors">
                                + Añadir imagen del proyecto
                            </button>
                        )}
                        <input ref={projImageRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleProjImage}/>
                        <input value={projForm.title} onChange={e => setProjForm(f => ({ ...f, title: e.target.value }))} placeholder="Nombre del proyecto *" className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"/>
                        <textarea value={projForm.description} onChange={e => setProjForm(f => ({ ...f, description: e.target.value }))} placeholder="Descripción" rows={2} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"/>
                        <input value={projForm.url} onChange={e => setProjForm(f => ({ ...f, url: e.target.value }))} placeholder="URL del proyecto (opcional)" className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"/>
                    </div>
                    <div className="flex gap-2 justify-end mt-5">
                        <button onClick={() => setModal(null)} className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100">Cancelar</button>
                        <button onClick={saveProj} disabled={!projForm.title} className="px-4 py-1.5 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg disabled:opacity-50">Guardar</button>
                    </div>
                </div>
            </Modal>

            {saving && (
                <div className="fixed bottom-4 right-4 bg-gray-800 text-white text-xs px-3 py-1.5 rounded-lg shadow-lg animate-pulse z-50">
                    Guardando...
                </div>
            )}
        </div>
    );
}
