import { Head } from '@inertiajs/react';

export default function Home() {
    return (
        <>
            <Head title="Intlinker" />

            <div className="min-h-screen bg-slate-50 text-slate-900">
                <div className="mx-auto max-w-6xl px-6 py-16">
                    <div className="rounded-[2rem] border border-slate-200 bg-white/90 p-10 shadow-xl shadow-slate-200/50 backdrop-blur">
                        <div className="mb-10 space-y-4">
                            <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Bienvenido a</p>
                            <h1 className="text-5xl font-semibold tracking-tight text-slate-900 sm:text-6xl">Intlinker</h1>
                            <p className="max-w-3xl text-lg leading-8 text-slate-600">
                                Una página inicial limpia para tu proyecto Laravel + React con Inertia. Aquí tienes un menú simple con varias secciones de ejemplo.
                            </p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <a
                                href="#"
                                className="rounded-3xl border border-slate-200 bg-slate-900 px-5 py-6 text-white transition hover:bg-slate-800"
                            >
                                <h2 className="text-lg font-semibold">Inicio</h2>
                                <p className="mt-2 text-sm text-slate-300">Vista principal de Intlinker.</p>
                            </a>
                            <a
                                href="#"
                                className="rounded-3xl border border-slate-200 bg-white px-5 py-6 text-slate-900 transition hover:bg-slate-50"
                            >
                                <h2 className="text-lg font-semibold">Características</h2>
                                <p className="mt-2 text-sm text-slate-500">Un resumen simple de lo que ofrece tu proyecto.</p>
                            </a>
                            <a
                                href="#"
                                className="rounded-3xl border border-slate-200 bg-white px-5 py-6 text-slate-900 transition hover:bg-slate-50"
                            >
                                <h2 className="text-lg font-semibold">Precios</h2>
                                <p className="mt-2 text-sm text-slate-500">Página de ejemplo para planes o servicios.</p>
                            </a>
                            <a
                                href="#"
                                className="rounded-3xl border border-slate-200 bg-white px-5 py-6 text-slate-900 transition hover:bg-slate-50"
                            >
                                <h2 className="text-lg font-semibold">Contacto</h2>
                                <p className="mt-2 text-sm text-slate-500">Enlace de ejemplo para información de contacto.</p>
                            </a>
                        </div>
                    </div>

                    <div className="mt-10 grid gap-6 lg:grid-cols-2">
                        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
                            <h2 className="text-2xl font-semibold text-slate-900">Navegación</h2>
                            <p className="mt-4 text-slate-600">
                                Este menú es una maqueta simple. Puedes enlazar estas secciones más adelante con páginas reales cuando quieras.
                            </p>
                            <ul className="mt-6 space-y-3 text-slate-700">
                                <li className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">Dashboard</li>
                                <li className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">Usuarios</li>
                                <li className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">Configuración</li>
                                <li className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">Ayuda</li>
                            </ul>
                        </section>

                        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
                            <h2 className="text-2xl font-semibold text-slate-900">Intlinker</h2>
                            <p className="mt-4 text-slate-600">
                                La idea es mantener el inicio limpio y sencillo, sin el contenido extra que trae la plantilla por defecto. Esta página ya está lista para crecer con tu proyecto.
                            </p>
                            <div className="mt-6 grid gap-3">
                                <div className="rounded-2xl bg-slate-50 p-4">Una base ligera para tu app Laravel + React.</div>
                                <div className="rounded-2xl bg-slate-50 p-4">Inertia mantiene la experiencia de página única.</div>
                                <div className="rounded-2xl bg-slate-50 p-4">Puedes reemplazar estas tarjetas por componentes reales después.</div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </>
    );
}
