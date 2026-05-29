export default function Footer() {
    return (
        <footer className="bg-gray-950 text-gray-400 py-12 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex flex-col items-center justify-between gap-4 sm:gap-6 md:flex-row">
                    <p className="text-sm text-center md:text-left">&copy; 2026 IntLinker. Todos los derechos reservados.</p>
                    <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm">
                        <a href="#" className="hover:text-white transition-colors">Privacidad</a>
                        <a href="#" className="hover:text-white transition-colors">T&eacute;rminos</a>
                        <a href="#" className="hover:text-white transition-colors">Contacto</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
