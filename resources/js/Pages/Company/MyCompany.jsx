import IntLinkerLogo from '@/Components/IntLinkerLogo';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import Footer from '@/Components/Footer';
import { useState, useRef } from 'react';

function stringToColor(str) {
    const palette = ['bg-indigo-600','bg-violet-600','bg-teal-600','bg-blue-700','bg-rose-600','bg-amber-600','bg-emerald-600'];
    let hash = 0;
    for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
    return palette[Math.abs(hash) % palette.length];
}

function initials(name) {
    return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

// ── Logo upload ──────────────────────────────────────────────────────────────
function LogoUpload({ company }) {
    const inputRef = useRef(null);
    const { post, processing } = useForm();
    const [preview, setPreview] = useState(
        company.logo_url ? `/storage/${company.logo}` : null
    );

    const handleChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setPreview(URL.createObjectURL(file));
        const form = new FormData();
        form.append('logo', file);
        form.append('_method', 'POST');
        post(route('companies.logo.update', company.id), {
            data: form,
            forceFormData: true,
            preserveScroll: true,
        });
    };

    return (
        <div className="relative group flex-shrink-0 cursor-pointer" onClick={() => !processing && inputRef.current?.click()}>
            <div className="w-14 h-14 rounded-xl overflow-hidden ring-2 ring-transparent group-hover:ring-indigo-400 transition">
                {preview ? (
                    <img src={preview} alt={company.name} className="w-full h-full object-cover" />
                ) : (
                    <div className={`w-full h-full ${stringToColor(company.name)} flex items-center justify-center text-white font-bold text-lg`}>
                        {initials(company.name)}
                    </div>
                )}
            </div>
            <div className="absolute inset-0 rounded-xl bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                {processing ? (
                    <svg className="w-5 h-5 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                ) : (
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                )}
            </div>
            <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleChange} />
        </div>
    );
}

// ── Enrollment row ────────────────────────────────────────────────────────────
function EnrollmentRow({ enrollment, companyId }) {
    const accept = useForm();
    const remove = useForm();

    const doAccept = () => {
        accept.patch(route('companies.enrollments.accept', { company: companyId, enrollment: enrollment.id }));
    };
    const doRemove = () => {
        if (!confirm('¿Eliminar a este candidato del proceso?')) return;
        remove.delete(route('companies.enrollments.remove', { company: companyId, enrollment: enrollment.id }));
    };

    const studentName = enrollment.student?.user?.name ?? '—';
    const studentEmail = enrollment.student?.user?.email ?? '';

    const statusCfg = {
        waiting:  { label: 'En espera',  cls: 'bg-gray-100 text-gray-700' },
        accepted: { label: 'Candidato',  cls: 'bg-emerald-50 text-emerald-700' },
    }[enrollment.status] ?? { label: enrollment.status, cls: 'bg-gray-100 text-gray-500' };

    return (
        <tr className="border-t border-gray-100 hover:bg-gray-50 transition">
            <td className="px-4 py-3">
                <Link
                    href={enrollment.student?.id ? route('students.profile', enrollment.student.id) : '#'}
                    className="flex items-center gap-3 group"
                >
                    <div className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0 ring-1 ring-gray-200 group-hover:ring-indigo-400 transition">
                        {enrollment.student?.user?.photo_url ? (
                            <img src={enrollment.student.user.photo_url} alt={studentName} className="w-full h-full object-cover" />
                        ) : (
                            <div className={`w-full h-full ${stringToColor(studentName)} flex items-center justify-center text-white font-bold text-xs`}>
                                {studentName.split(' ').slice(0,2).map(w=>w[0]).join('').toUpperCase()}
                            </div>
                        )}
                    </div>
                    <div>
                        <p className="font-medium text-gray-900 text-sm group-hover:text-indigo-600 transition">{studentName}</p>
                        <p className="text-xs text-gray-400">{studentEmail}</p>
                    </div>
                </Link>
            </td>
            <td className="px-4 py-3">
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusCfg.cls}`}>
                    {statusCfg.label}
                </span>
            </td>
            <td className="px-4 py-3 text-xs text-gray-400">
                {new Date(enrollment.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
            </td>
            <td className="px-4 py-3 text-right">
                <div className="flex gap-2 justify-end">
                    {enrollment.status === 'waiting' && (
                        <button
                            onClick={doAccept}
                            disabled={accept.processing}
                            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg transition disabled:opacity-50"
                        >
                            Aceptar
                        </button>
                    )}
                    <button
                        onClick={doRemove}
                        disabled={remove.processing}
                        className="text-xs font-semibold text-red-500 hover:text-red-700 hover:bg-red-50 border border-red-200 px-3 py-1.5 rounded-lg transition disabled:opacity-50"
                    >
                        Eliminar
                    </button>
                </div>
            </td>
        </tr>
    );
}

// ── Company card ──────────────────────────────────────────────────────────────
function CompanyCard({ company }) {
    const [open, setOpen] = useState(true);
    const leave = useForm();
    const enrollments = company.enrollments ?? [];

    const doLeave = () => {
        if (!confirm(`¿Salir de ${company.name}?`)) return;
        leave.delete(route('companies.leave', company.id));
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            {/* Header */}
            <div className="p-6 flex items-center gap-4">
                <LogoUpload company={company} />
                <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-bold text-gray-900">{company.name}</h2>
                    {company.description && (
                        <p className="text-sm text-gray-500 truncate">{company.description}</p>
                    )}
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="text-right">
                        <p className="text-2xl font-extrabold text-indigo-600">{company.waiting_count ?? 0}</p>
                        <p className="text-xs text-gray-400">en espera</p>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-extrabold text-emerald-600">{company.accepted_count ?? 0}</p>
                        <p className="text-xs text-gray-400">aceptados</p>
                    </div>
                    <button
                        onClick={() => setOpen(o => !o)}
                        className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
                    >
                        <svg className={`w-5 h-5 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Enrollments table */}
            {open && (
                <div className="border-t border-gray-100">
                    {enrollments.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center py-8">Sin postulaciones activas.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                                        <th className="px-4 py-2.5 text-left font-semibold">Alumno</th>
                                        <th className="px-4 py-2.5 text-left font-semibold">Estado</th>
                                        <th className="px-4 py-2.5 text-left font-semibold">Fecha</th>
                                        <th className="px-4 py-2.5 text-right font-semibold">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {enrollments.map(e => (
                                        <EnrollmentRow key={e.id} enrollment={e} companyId={company.id} />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="px-6 py-4 flex items-center justify-between border-t border-gray-100">
                        {company.applications_email && (
                            <p className="text-xs text-gray-400">
                                📧 {company.applications_email}
                            </p>
                        )}
                        <button
                            onClick={doLeave}
                            disabled={leave.processing}
                            className="ml-auto text-xs text-red-500 hover:underline disabled:opacity-50"
                        >
                            Salir de la empresa
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function MyCompany({ companies = [] }) {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="Mi empresa — IntLinker" />

            <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-900 font-sans">
                {/* Navbar */}
                <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
                    <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                        <Link href="/IntLinker" className="flex items-center gap-2">
                            <IntLinkerLogo className="h-10 w-auto" />
                        </Link>
                        <div className="flex items-center gap-3">
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
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-extrabold text-white">Mi empresa</h1>
                            <p className="text-gray-300 mt-1">Gestiona las postulaciones de tus candidatos.</p>
                        </div>
                        <Link
                            href="/companies"
                            className="text-sm font-semibold text-indigo-600 hover:underline"
                        >
                            + Unirse a otra empresa
                        </Link>
                    </div>

                    <div className="space-y-6">
                        {companies.map(company => (
                            <CompanyCard key={company.id} company={company} />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}





