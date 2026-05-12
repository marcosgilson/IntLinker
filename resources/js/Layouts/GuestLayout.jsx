import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="flex justify-center mb-6">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <span className="text-white font-bold text-sm">IL</span>
                        </div>
                        <span className="text-white font-bold text-xl">IntLinker</span>
                    </Link>
                </div>
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden px-8 py-7">
                    {children}
                </div>
            </div>
        </div>
    );
}
