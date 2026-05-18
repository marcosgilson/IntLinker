export default function Footer() {
    return (
        <footer className="bg-gray-950 text-gray-400 py-12 mt-auto">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                            <span className="text-white font-bold text-xs">IL</span>
                        </div>
                        <span className="text-white font-bold">IntLinker</span>
                    </div>
                    <p className="text-sm">&copy; 2026 IntLinker. Todos los derechos reservados.</p>
                    <div className="flex gap-6 text-sm">
                        <a href="#" className="hover:text-white transition-colors">Privacidad</a>
                        <a href="#" className="hover:text-white transition-colors">Términos</a>
                        <a href="#" className="hover:text-white transition-colors">Contacto</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
