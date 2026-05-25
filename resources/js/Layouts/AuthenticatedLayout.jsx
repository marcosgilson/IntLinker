import IntLinkerLogo from '@/Components/IntLinkerLogo';
import { Link, router, usePage } from '@inertiajs/react';
import Footer from '@/Components/Footer';
import { useState } from 'react';

export default function AuthenticatedLayout({ children }) {
    const { auth } = usePage().props;
    const user  = auth?.user;
    const roles = auth?.roles ?? {};
    const [open, setOpen] = useState(false);

    const logout = () => router.post(route('logout'));

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-900 font-sans">
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <IntLinkerLogo className="h-20 w-auto" />
                    </Link>

                    <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
                        <Link href="/companies" className="hover:text-indigo-600 transition-colors">Empresas</Link>
                        {roles.is_student && (
                            <Link href="/enrollments" className="hover:text-indigo-600 transition-colors">Mis postulaciones</Link>
                        )}
                        {roles.is_worker && (
                            <Link href="/my-company" className="hover:text-indigo-600 transition-colors">Mi empresa</Link>
                        )}
                        {roles.is_admin && (
                            <Link href="/admin" className="hover:text-indigo-600 transition-colors">Panel Admin</Link>
                        )}
                    </div>

                    <div className="hidden md:flex items-center gap-3">
                        <Link href="/profile" className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors px-3 py-2">
                            {user?.photo_url ? (
                                <img src={user.photo_url} alt={user.name} className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-200"/>
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                                    <span className="text-indigo-700 font-bold text-xs">{user?.name?.charAt(0).toUpperCase()}</span>
                                </div>
                            )}
                            {user?.name}
                        </Link>
                        <button
                            onClick={logout}
                            className="text-sm font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                        >
                            Salir
                        </button>
                    </div>

                    <button
                        className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition"
                        onClick={() => setOpen(o => !o)}
                    >
                        {open ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
                            </svg>
                        )}
                    </button>
                </div>

                {open && (
                    <div className="md:hidden border-t border-gray-100 bg-white px-6 py-4 space-y-1">
                        <Link href="/companies" className="block text-sm font-medium text-gray-600 hover:text-indigo-600 py-2 transition">Empresas</Link>
                        {roles.is_student && <Link href="/enrollments" className="block text-sm font-medium text-gray-600 hover:text-indigo-600 py-2 transition">Mis postulaciones</Link>}
                        {roles.is_worker  && <Link href="/my-company"  className="block text-sm font-medium text-gray-600 hover:text-indigo-600 py-2 transition">Mi empresa</Link>}
                        {roles.is_admin   && <Link href="/admin"        className="block text-sm font-medium text-gray-600 hover:text-indigo-600 py-2 transition">Panel Admin</Link>}
                        <div className="border-t border-gray-100 pt-3 mt-2 flex flex-col gap-1">
                            <Link href="/profile" className="text-sm font-semibold text-gray-900 py-1">{user?.name}</Link>
                            <button onClick={logout} className="text-left text-sm text-red-500 hover:text-red-600 py-1 transition">Cerrar sesión</button>
                        </div>
                    </div>
                )}
            </nav>

            <main className="pt-16 flex flex-col min-h-screen">{children}<Footer /></main>
        </div>
    );
}





