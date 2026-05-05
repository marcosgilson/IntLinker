import { Head, Link } from '@inertiajs/react';

const offers = [
    {
        id: 1,
        company: 'Siemens Mobility',
        logo: 'SM',
        color: 'bg-teal-600',
        title: 'Desarrollador Frontend React',
        location: 'Madrid',
        type: 'Presencial',
        duration: '6 meses',
        tags: ['React', 'TypeScript', 'Tailwind'],
    },
    {
        id: 2,
        company: 'Indra',
        logo: 'IN',
        color: 'bg-blue-700',
        title: 'Analista de Datos / Machine Learning',
        location: 'Barcelona',
        type: 'Híbrido',
        duration: '4 meses',
        tags: ['Python', 'SQL', 'TensorFlow'],
    },
    {
        id: 3,
        company: 'Accenture',
        logo: 'AC',
        color: 'bg-violet-600',
        title: 'Backend Developer Java',
        location: 'Sevilla',
        type: 'Remoto',
        duration: '6 meses',
        tags: ['Java', 'Spring Boot', 'AWS'],
    },
];

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
        title: 'Explora ofertas',
        desc: 'Filtra por sector, ubicación o modalidad y descubre las prácticas que encajan contigo.',
        icon: (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
        ),
    },
    {
        number: '03',
        title: 'Conecta y crece',
        desc: 'Postula directamente y empieza tu carrera profesional con las mejores empresas.',
        icon: (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
        ),
    },
];

export default function Home() {
    return (
        <>
            <Head title="IntLinker — Encuentra tus prácticas" />

            <div className="min-h-screen bg-white font-sans">

                {/* Navbar */}
                <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
                    <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                                <span className="text-white font-bold text-sm">IL</span>
                            </div>
                            <span className="text-xl font-bold text-gray-900">IntLinker</span>
                        </div>

                        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
                            <a href="#como-funciona" className="hover:text-indigo-600 transition-colors">Cómo funciona</a>
                            <a href="#ofertas" className="hover:text-indigo-600 transition-colors">Ofertas</a>
                            <a href="#empresas" className="hover:text-indigo-600 transition-colors">Empresas</a>
                        </div>

                        <div className="flex items-center gap-3">
                            <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors px-3 py-2">
                                Iniciar sesión
                            </Link>
                            <Link href="/register" className="text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors">
                                Registrarse
                            </Link>
                        </div>
                    </div>
                </nav>

                {/* Hero */}
                <section className="pt-16 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-900" />
                    <div className="absolute inset-0 opacity-20"
                        style={{ backgroundImage: 'radial-gradient(circle at 25% 50%, #6366f1 0%, transparent 50%), radial-gradient(circle at 75% 20%, #8b5cf6 0%, transparent 50%)' }}
                    />

                    <div className="relative max-w-7xl mx-auto px-6 py-28 text-center">
                        <span className="inline-flex items-center gap-2 bg-white/10 text-indigo-200 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 border border-white/20">
                            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                            +200 nuevas ofertas esta semana
                        </span>

                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6">
                            Tu primer paso<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-violet-300">
                                en el mundo laboral
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl text-indigo-200 max-w-2xl mx-auto mb-10 leading-relaxed">
                            IntLinker conecta estudiantes con empresas líderes para encontrar las prácticas que impulsen tu carrera profesional.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/register" className="inline-flex items-center justify-center gap-2 bg-white text-indigo-700 font-bold px-8 py-4 rounded-xl hover:bg-indigo-50 transition-all shadow-lg shadow-indigo-900/30 text-base">
                                Buscar prácticas
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                            <a href="#como-funciona" className="inline-flex items-center justify-center gap-2 border border-white/30 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition-all text-base">
                                Cómo funciona
                            </a>
                        </div>

                        {/* Stats */}
                        <div className="mt-20 grid grid-cols-3 gap-6 max-w-2xl mx-auto border-t border-white/10 pt-10">
                            {[
                                { value: '1.200+', label: 'Estudiantes activos' },
                                { value: '340+', label: 'Empresas colaboradoras' },
                                { value: '95%', label: 'Tasa de satisfacción' },
                            ].map((stat) => (
                                <div key={stat.label}>
                                    <div className="text-3xl font-extrabold text-white">{stat.value}</div>
                                    <div className="text-sm text-indigo-300 mt-1">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Cómo funciona */}
                <section id="como-funciona" className="py-24 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <span className="text-indigo-600 font-semibold text-sm uppercase tracking-widest">Proceso</span>
                            <h2 className="text-4xl font-bold text-gray-900 mt-2">Así de fácil funciona</h2>
                            <p className="text-gray-500 mt-3 max-w-xl mx-auto">Tres pasos para conectar tu talento con la empresa ideal.</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {steps.map((step) => (
                                <div key={step.number} className="relative bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
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

                {/* Ofertas destacadas */}
                <section id="ofertas" className="py-24 bg-white">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="flex items-end justify-between mb-12">
                            <div>
                                <span className="text-indigo-600 font-semibold text-sm uppercase tracking-widest">Ofertas</span>
                                <h2 className="text-4xl font-bold text-gray-900 mt-2">Prácticas destacadas</h2>
                            </div>
                            <a href="#" className="hidden md:flex items-center gap-1 text-indigo-600 font-semibold text-sm hover:underline">
                                Ver todas
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </a>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            {offers.map((offer) => (
                                <div key={offer.id} className="group border border-gray-200 rounded-2xl p-6 hover:border-indigo-300 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className={`w-10 h-10 rounded-xl ${offer.color} flex items-center justify-center text-white font-bold text-sm`}>
                                            {offer.logo}
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-400">{offer.company}</div>
                                            <div className="text-sm font-semibold text-gray-700">{offer.location}</div>
                                        </div>
                                        <span className="ml-auto text-xs bg-emerald-50 text-emerald-600 font-semibold px-2.5 py-1 rounded-full border border-emerald-100">
                                            {offer.type}
                                        </span>
                                    </div>

                                    <h3 className="text-base font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">
                                        {offer.title}
                                    </h3>

                                    <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {offer.duration}
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        {offer.tags.map((tag) => (
                                            <span key={tag} className="text-xs bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-full font-medium">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Banner */}
                <section className="py-20 bg-gradient-to-r from-indigo-600 to-violet-600">
                    <div className="max-w-4xl mx-auto px-6 text-center">
                        <h2 className="text-4xl font-extrabold text-white mb-4">¿Listo para dar el salto?</h2>
                        <p className="text-indigo-200 text-lg mb-8">Únete a miles de estudiantes que ya encontraron sus prácticas con IntLinker.</p>
                        <Link href="/register" className="inline-flex items-center gap-2 bg-white text-indigo-700 font-bold px-8 py-4 rounded-xl hover:bg-indigo-50 transition-all shadow-xl text-base">
                            Crear cuenta gratis
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-gray-950 text-gray-400 py-12">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                                    <span className="text-white font-bold text-xs">IL</span>
                                </div>
                                <span className="text-white font-bold">IntLinker</span>
                            </div>
                            <p className="text-sm">© 2026 IntLinker. Todos los derechos reservados.</p>
                            <div className="flex gap-6 text-sm">
                                <a href="#" className="hover:text-white transition-colors">Privacidad</a>
                                <a href="#" className="hover:text-white transition-colors">Términos</a>
                                <a href="#" className="hover:text-white transition-colors">Contacto</a>
                            </div>
                        </div>
                    </div>
                </footer>

            </div>
        </>
    );
}
