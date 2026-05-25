import IntLinkerLogo from '@/Components/IntLinkerLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children, hideLogo = false }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className={`flex justify-center mb-6${hideLogo ? " hidden" : ""}`}>
                    <Link href="/" className="flex items-center gap-2">
                        <IntLinkerLogo className="h-20 w-auto" />
                    </Link>
                </div>
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden px-8 py-7">
                    {children}
                </div>
            </div>
        </div>
    );
}





