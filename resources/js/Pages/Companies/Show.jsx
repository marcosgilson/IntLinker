import { Head, Link, useForm, usePage } from '@inertiajs/react';

function stringToColor(str) {
    const palette = ['bg-indigo-600','bg-violet-600','bg-teal-600','bg-blue-700','bg-rose-600','bg-amber-600','bg-emerald-600','bg-sky-600','bg-fuchsia-600'];
    let hash = 0;
    for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
    return palette[Math.abs(hash) % palette.length];
}

function initials(name) {
    return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

export default function CompaniesShow({ company }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const roles = auth?.roles ?? {};
    const employees = company.employees ?? [];

    const enrollForm = useForm({ company_id: company.id });

    const isEmployee = user && employees.some(e => e.id === user.id);

    const doEnroll = () => {
        enrollForm.post(route('enrollments.store'));
    };

    return (
        <>
            <Head title={`${company.name} — IntLinker`} />

            <div className="min-h-screen bg-gray-50 font-sans">
                <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
                    <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                        <Link href="/IntLinker" className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                                <span className="text-white font-bold text-sm">IL</span>
                            </div>
                            <span className="text-xl font-bold text-gray-900">IntLinker</span>
                        </Link>
                        <div className="flex items-center gap-3">
                            {user && (
                                <Link href="/profile" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition px-3 py-2">
                                    {user.name}
                                </Link>
                            )}
                            <Link href="/companies" className="text-sm text-gray-500 hover:text-indigo-600 transition px-3 py-2">
                                Empresas
                            </Link>
                        </div>
                    </div>
                </nav>

                <div className="pt-24 pb-12 max-w-4xl mx-auto px-6">
                    {/* Company header card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
                        <div className="flex items-start gap-5">
                            {company.logo ? (
                                <img src={`/storage/${company.logo}`} alt={company.name}
                                    className="w-16 h-16 rounded-2xl object-cover flex-shrink-0" />
                            ) : (
                                <div className={`w-16 h-16 rounded-2xl ${stringToColor(company.name)} flex items-center justify-center text-white font-bold text-xl flex-shrink-0`}>
                                    {initials(company.name)}
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <h1 className="text-2xl font-extrabold text-gray-900">{company.name}</h1>
                                {company.city && (
                                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                                        <span>📍</span> {company.city}
                                    </p>
                                )}
                                {company.applications_email && (
                                    <a href={`mailto:${company.applications_email}`}
                                        className="text-sm text-indigo-600 hover:underline mt-1 block">
                                        {company.applications_email}
                                    </a>
                                )}
                            </div>
                        </div>

                        {company.description && (
                            <p className="mt-5 text-gray-600 leading-relaxed">{company.description}</p>
                        )}

                        {/* Only students can apply via enrollment */}
                        {user && roles.is_student && !isEmployee && (
                            <div className="mt-6">
                                <button
                                    onClick={doEnroll}
                                    disabled={enrollForm.processing}
                                    className="text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 px-5 py-2.5 rounded-lg transition"
                                >
                                    {enrollForm.processing ? 'Enviando...' : 'Postularse a esta empresa'}
                                </button>
                            </div>
                        )}

                        {/* Verified employees see candidate list */}
                        {isEmployee && (
                            <div className="mt-6">
                                <Link
                                    href={route('companies.enrollments.index', company.id)}
                                    className="text-sm font-semibold text-violet-600 hover:text-violet-800 border border-violet-200 hover:border-violet-400 px-5 py-2.5 rounded-lg transition"
                                >
                                    Ver candidatos
                                </Link>
                            </div>
                        )}

                        {/* Info box for non-student, non-employee users */}
                        {user && !roles.is_student && !isEmployee && (
                            <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 text-sm text-amber-800">
                                Para unirte a esta empresa como trabajador, completa el proceso de verificacion en tu{' '}
                                <Link href="/profile" className="font-semibold underline hover:text-amber-900">perfil</Link>.
                            </div>
                        )}
                    </div>

                    {/* Employees */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">
                            Equipo
                            <span className="ml-2 text-sm font-normal text-gray-400">({employees.length})</span>
                        </h2>

                        {employees.length === 0 ? (
                            <p className="text-sm text-gray-400">Esta empresa todavia no tiene empleados registrados.</p>
                        ) : (
                            <div className="grid sm:grid-cols-2 gap-3">
                                {employees.map(emp => (
                                    <div key={emp.id} className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
                                        <div className={`w-8 h-8 rounded-lg ${stringToColor(emp.name)} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                                            {initials(emp.name)}
                                        </div>
                                        <span className="text-sm font-medium text-gray-800 truncate">{emp.name}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}