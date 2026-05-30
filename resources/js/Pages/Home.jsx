import IntLinkerLogo from '@/Components/IntLinkerLogo';
import { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AuthModal from '@/Components/AuthModal';
import UserAvatar from '@/Components/UserAvatar';
import Footer from '@/Components/Footer';

// Generate a consistent colour from a string (company name)
function stringToColor(str) {
    const palette = [
        'bg-indigo-600', 'bg-violet-600', 'bg-teal-600',
        'bg-blue-700',   'bg-rose-600',   'bg-amber-600',
        'bg-emerald-600','bg-sky-600',     'bg-fuchsia-600',
    ];
    let hash = 0;
    for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
    return palette[Math.abs(hash) % palette.length];
}

// Get initials from a company name (up to 2 chars)
function initials(name) {
    return name
        .split(' ')
        .slice(0, 2)
        .map((w) => w[0])
        .join('')
        .toUpperCase();
}

const steps = [
    {
        number: '01',
        title: 'Crea tu perfil',
        desc: 'Regístrate y verifica tu identidad con tu carnet de estudiante mediante OCR.',
        icon: (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
        ),
    },
    {
        number: '02',
        title: 'Explora empresas',
        desc: 'Descubre las empresas colaboradoras y encuentra la que mejor encaja con tu perfil.',
        icon: (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
        ),
    },
    {
        number: '03',
        title: 'Conecta y crece',
        desc: 'Postula directamente (max. 5 activas) y empieza tu carrera profesional.',
        icon: (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
        ),
    },
];

export default function Home({ companies = [], stats = {}, canResetPassword = true }) {
    const { auth } = usePage().props;
    const user  = auth?.user;
    const roles = auth?.roles ?? {};

    // null | 'login' | 'register'
    const [authModal, setAuthModal] = useState(null);
    const [navOpen, setNavOpen] = useState(false);

    const openLogin    = () => setAuthModal('login');
    const openRegister = () => setAuthModal('register');
    const closeModal   = () => setAuthModal(null);

    const studentCount  = stats.students  ?? 0;
    const companyCount  = stats.companies ?? 0;

    return (
        <>
            <Head title="IntLinker — Encuentra tus practicas" />

            <AuthModal
                show={authModal !== null}
                onClose={closeModal}
                defaultTab={authModal ?? 'login'}
                canResetPassword={canResetPassword}
            />

            <div className="flex flex-col min-h-screen w-full overflow-x-hidden bg-white font-sans">

                {/* Navbar */}
                <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <IntLinkerLogo className="h-20 sm:h-20 w-auto" />
                        </div>

                        <div className="hidden md:flex items-center gap-4 lg:gap-8 text-sm font-medium text-gray-600">
                            <a href="#como-funciona" className="hover:text-indigo-600 transition-colors">Como funciona</a>
                            <Link href="/empresas" className="hover:text-indigo-600 transition-colors">Empresas</Link>
                        </div>

                        <button className="md:hidden flex h-10 w-10 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 transition" onClick={() => setNavOpen(o => !o)} aria-label="Menu">
                            {navOpen ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/></svg>
                            )}
                        </button>
                        <div className="hidden md:flex items-center gap-3">
                            {user ? (
                                <>
                                    <Link href="/perfil" className="flex items-center hover:opacity-80 transition px-2 sm:px-3 py-1.5 rounded-lg">
                                        <UserAvatar user={user} />
                                    </Link>
                                    {roles.is_student && (
                                        <Link
                                            href="/postulaciónes"
                                            className="inline-flex min-h-10 items-center justify-center text-sm sm:text-base font-semibold bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
                                        >
                                            Mis postulaciónes
                                        </Link>
                                    )}
                                    {roles.is_worker && (
                                        <Link
                                            href="/mi-empresa"
                                            className="inline-flex min-h-10 items-center justify-center text-sm sm:text-base font-semibold bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg transition-colors"
                                        >
                                            Mi empresa
                                        </Link>
                                    )}
                                    {roles.is_admin && (
                                        <Link
                                            href="/admin"
                                            className="inline-flex min-h-10 items-center justify-center text-sm sm:text-base font-semibold bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition-colors"
                                        >
                                            Panel Admin
                                        </Link>
                                    )}
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={openLogin}
                                        className="inline-flex min-h-10 items-center justify-center text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors px-4 py-2 rounded-lg"
                                    >
                                        Iniciar sesión
                                    </button>
                                    <button
                                        onClick={openRegister}
                                        className="text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
                                    >
                                        Registrarse
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                {navOpen && (
                    <div className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-md px-4 py-4 space-y-2">
                        <a href="#como-funciona" onClick={() => setNavOpen(false)} className="block text-sm font-medium text-gray-700 hover:text-indigo-600 py-2 transition">Como funciona</a>
                        <Link href="/empresas" className="block text-sm font-medium text-gray-700 hover:text-indigo-600 py-2 transition">Empresas</Link>
                        <div className="border-t border-gray-100 pt-3 mt-2 space-y-1">
                            {user ? (
                                <>
                                    <Link href="/perfil" className="block rounded-lg text-sm font-semibold text-gray-900 py-2 hover:text-indigo-600 transition"><UserAvatar user={user} /></Link>
                                    {roles.is_student && <Link href="/postulaciónes" className="block text-sm font-medium text-indigo-600 py-2 transition">Mis postulaciónes</Link>}
                                    {roles.is_worker && <Link href="/mi-empresa" className="block text-sm font-medium text-violet-600 py-2 transition">Mi empresa</Link>}
                                    {roles.is_admin && <Link href="/admin" className="block text-sm font-medium text-gray-700 py-2 transition">Panel Admin</Link>}
                                </>
                            ) : (
                                <div className="flex gap-3 pt-1">
                                    <button onClick={() => { setNavOpen(false); openLogin(); }} className="flex-1 min-h-10 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg px-4 py-2 transition hover:border-indigo-400 hover:text-indigo-600">Iniciar sesión</button>
                                    <button onClick={() => { setNavOpen(false); openRegister(); }} className="flex-1 min-h-10 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-4 py-2 transition">Registrarse</button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
                </nav>

                {/* Hero */}
                <section className="pt-20 sm:pt-24 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-900" />
                    <div className="absolute inset-0 opacity-20"
                        style={{ backgroundImage: 'radial-gradient(circle at 25% 50%, #6366f1 0%, transparent 50%), radial-gradient(circle at 75% 20%, #8b5cf6 0%, transparent 50%)' }}
                    />

                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
                        {companyCount > 0 && (
                            <span className="inline-flex items-center gap-2 bg-white/10 text-indigo-200 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 border border-white/20">
                                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                                {companyCount} empresa{companyCount !== 1 ? 's' : ''} colaboradora{companyCount !== 1 ? 's' : ''}
                            </span>
                        )}

                        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6">
                            Tu primer paso<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-violet-300">
                                en el mundo laboral
                            </span>
                        </h1>

                        <p className="text-base sm:text-lg md:text-xl text-indigo-200 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed px-2 sm:px-0">
                            IntLinker conecta estudiantes con empresas lideres para encontrar las practicas que impulsen tu carrera profesional.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                            {user ? (
                                <Link href="/empresas" className="inline-flex w-full sm:w-auto items-center justify-center gap-2 bg-white text-indigo-700 font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-xl hover:bg-indigo-50 transition-all shadow-lg shadow-indigo-900/30 text-sm sm:text-base">
                                    Explorar empresas
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </Link>
                            ) : (
                                <button onClick={openRegister} className="inline-flex items-center justify-center gap-2 bg-white text-indigo-700 font-bold px-8 py-4 rounded-xl hover:bg-indigo-50 transition-all shadow-lg shadow-indigo-900/30 text-base">
                                    Buscar practicas
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </button>
                            )}
                            <a href="#como-funciona" className="inline-flex w-full sm:w-auto items-center justify-center gap-2 border border-white/30 text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-xl hover:bg-white/10 transition-all text-sm sm:text-base">
                                Como funciona
                            </a>
                        </div>

                        {/* Stats */}
                        <div className="mt-16 sm:mt-20 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-md mx-auto border-t border-white/10 pt-8 sm:pt-10">
                            <div>
                                <div className="text-3xl font-extrabold text-white">
                                    {studentCount > 0 ? studentCount.toLocaleString() : '—'}
                                </div>
                                <div className="text-sm text-indigo-300 mt-1">Estudiantes activos</div>
                            </div>
                            <div>
                                <div className="text-3xl font-extrabold text-white">
                                    {companyCount > 0 ? companyCount.toLocaleString() : '—'}
                                </div>
                                <div className="text-sm text-indigo-300 mt-1">Empresas colaboradoras</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Como funciona */}
                <section id="como-funciona" className="py-16 sm:py-24 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6">
                        <div className="text-center mb-12 sm:mb-16">
                            <span className="text-indigo-600 font-semibold text-sm uppercase tracking-widest">Proceso</span>
                            <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mt-2">Asi de facil funciona</h2>
                            <p className="text-gray-500 mt-3 max-w-xl mx-auto">Tres pasos para conectar tu talento con la empresa ideal.</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                            {steps.map((step) => (
                                <div key={step.number} className="relative bg-white rounded-2xl p-5 sm:p-8 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                                    <span className="absolute top-6 right-6 text-5xl font-black text-gray-100 select-none">{step.number}</span>
                                    <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-5">
                                        {step.icon}
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                                    <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Empresas colaboradoras */}
                <section id="empresas" className="py-16 sm:py-24 bg-white">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="flex flex-wrap items-end justify-between gap-4 mb-8 sm:mb-12">
                            <div>
                                <span className="text-indigo-600 font-semibold text-sm uppercase tracking-widest">Empresas</span>
                                <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mt-2">Empresas colaboradoras</h2>
                            </div>
                            <Link href="/empresas" className="hidden md:flex items-center gap-1 text-indigo-600 font-semibold text-sm hover:underline">
                                Ver todas
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                        </div>

                        {companies.length === 0 ? (
                            <div className="text-center py-20 text-gray-400">
                                <svg className="w-12 h-12 mx-auto mb-4 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                <p className="text-lg font-medium">Todavia no hay empresas registradas.</p>
                                <p className="text-sm mt-1">Pronto apareceran aquí las primeras colaboraciones.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                                {companies.map((company) => (
                                    <Link
                                        key={company.id}
                                        href={route('companies.show', company.id)}
                                        className="group border border-gray-200 rounded-2xl p-4 sm:p-6 hover:border-indigo-300 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                                    >
                                        <div className="flex items-start gap-3 mb-4">
                                            {company.logo_url ? (
                                                <img
                                                    src={company.logo_url}
                                                    alt={company.name}
                                                    className="w-10 h-10 rounded-xl object-cover"
                                                />
                                            ) : (
                                                <div className={`w-10 h-10 rounded-xl ${stringToColor(company.name)} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                                                    {initials(company.name)}
                                                </div>
                                            )}
                                            <h3 className="text-sm font-bold text-gray-800 group-hover:text-indigo-600 transition-colors leading-tight break-words">
                                                {company.name}
                                            </h3>
                                            {company.open_spots > 0 && (
                                                <span className="ml-auto text-xs bg-emerald-50 text-emerald-600 font-semibold px-2.5 py-1 rounded-full border border-emerald-100 flex-shrink-0">
                                                    {company.open_spots} activa{company.open_spots !== 1 ? 's' : ''}
                                                </span>
                                            )}
                                        </div>

                                        {company.description && (
                                            <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 break-words">
                                                {company.description}
                                            </p>
                                        )}

                                        <div className="mt-4 flex items-center gap-1 text-xs text-indigo-500 font-medium">
                                            Ver empresa
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                            </svg>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* CTA Banner */}
                <section className="py-16 sm:py-20 bg-gradient-to-r from-indigo-600 to-violet-600">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
                        <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-4">
                            {user ? '¡Bienvenido de nuevo!' : '¿Listo para dar el salto?'}
                        </h2>
                        <p className="text-indigo-200 text-base sm:text-lg mb-8">
                            {user
                                ? 'Explora las empresas disponibles y gestióna tus postulaciónes.'
                                : 'Unete a la plataforma que conecta estudiantes con las mejores empresas.'}
                        </p>
                        {user ? (
                            <Link
                                href="/empresas"
                                className="inline-flex items-center justify-center gap-2 bg-white text-indigo-700 font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-xl hover:bg-indigo-50 transition-all shadow-xl text-sm sm:text-base"
                            >
                                Explorar empresas
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                        ) : (
                            <button
                                onClick={openRegister}
                                className="inline-flex items-center gap-2 bg-white text-indigo-700 font-bold px-8 py-4 rounded-xl hover:bg-indigo-50 transition-all shadow-xl text-base"
                            >
                                Crear cuenta gratis
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </button>
                        )}
                    </div>
                </section>

                <Footer />

            </div>
        </>
    );
}





