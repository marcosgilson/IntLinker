import { useState, useRef } from 'react';
import { useForm, usePage, Link } from '@inertiajs/react';

export default function BecomeWorkerForm({ companies, status }) {
    const { auth } = usePage().props;
    const isWorker = auth.roles?.is_worker;
    const [open, setOpen] = useState(false);
    const [preview, setPreview] = useState(null);
    const fileRef = useRef(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: auth.user.name,
        company_name: '',
        position: '',
        work_card_image: null,
    });

    const handleFile = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setData('work_card_image', file);
        setPreview(URL.createObjectURL(file));
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('worker.store'), {
            forceFormData: true,
            onSuccess: () => {
                setOpen(false);
                reset('company_name', 'position', 'work_card_image');
                setPreview(null);
            },
        });
    };

    if (isWorker && companies && companies.length > 0) {
        return (
            <div className="bg-violet-50 border border-violet-200 rounded-2xl p-5">
                <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-violet-500 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-violet-900 text-sm">Trabajador activo</h3>
                        <div className="flex flex-wrap gap-1 mt-1">
                            {companies.map(c => (
                                <span key={c.id} className="px-2 py-0.5 bg-violet-100 text-violet-700 text-xs rounded-full">{c.name}</span>
                            ))}
                        </div>
                    </div>
                    <Link href="/my-company" className="text-xs font-semibold text-violet-600 hover:underline whitespace-nowrap">
                        Mi empresa →
                    </Link>
                </div>
                <button
                    type="button"
                    onClick={() => setOpen(!open)}
                    className="text-xs font-semibold text-violet-700 hover:text-violet-800 underline"
                >
                    {open ? 'Cancelar' : '+ Unirse a otra empresa'}
                </button>
                {open && (
                    <form onSubmit={submit} className="mt-4 space-y-3">
                        <WorkerFormFields data={data} setData={setData} errors={errors} preview={preview} handleFile={handleFile} fileRef={fileRef} />
                        <button type="submit" disabled={processing}
                            className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white text-sm font-semibold py-2 rounded-lg transition">
                            {processing ? 'Enviando…' : 'Solicitar unión a empresa'}
                        </button>
                    </form>
                )}
            </div>
        );
    }

    return (
        <div className={`bg-white border rounded-2xl overflow-hidden transition-all ${open ? 'border-violet-300 shadow-md' : 'border-gray-200 shadow-sm hover:border-violet-200 hover:shadow-md'}`}>
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="w-full flex items-center gap-3 p-5 text-left"
            >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition ${open ? 'bg-violet-500' : 'bg-gray-100'}`}>
                    <svg className={`w-5 h-5 ${open ? 'text-white' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                </div>
                <div>
                    <p className="font-bold text-gray-900 text-sm">Alta como Trabajador</p>
                    <p className="text-xs text-gray-500 mt-0.5">Representa a tu empresa en la plataforma</p>
                </div>
                <svg className={`w-4 h-4 text-gray-400 ml-auto transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            {open && (
                <form onSubmit={submit} className="px-5 pb-5 space-y-3 border-t border-gray-100 pt-4">
                    <WorkerFormFields data={data} setData={setData} errors={errors} preview={preview} handleFile={handleFile} fileRef={fileRef} />
                    <button type="submit" disabled={processing}
                        className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white text-sm font-semibold py-2.5 rounded-lg transition">
                        {processing ? 'Enviando…' : 'Solicitar alta como trabajador'}
                    </button>
                </form>
            )}
        </div>
    );
}

function WorkerFormFields({ data, setData, errors, preview, handleFile, fileRef }) {
    return (
        <>
            <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Nombre completo</label>
                <input type="text" value={data.name} onChange={e => setData('name', e.target.value)}
                    placeholder="Tu nombre completo"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 focus:outline-none" required />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
            </div>
            <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Nombre de empresa</label>
                <input type="text" value={data.company_name} onChange={e => setData('company_name', e.target.value)}
                    placeholder="Ej: Siemens Mobility"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 focus:outline-none" required />
                {errors.company_name && <p className="mt-1 text-xs text-red-500">{errors.company_name}</p>}
            </div>
            <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Puesto / Cargo</label>
                <input type="text" value={data.position} onChange={e => setData('position', e.target.value)}
                    placeholder="Ej: Ingeniero de Software"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 focus:outline-none" required />
                {errors.position && <p className="mt-1 text-xs text-red-500">{errors.position}</p>}
            </div>
            <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Carnet empresa (imagen)</label>
                <div onClick={() => fileRef.current?.click()}
                    className="border-2 border-dashed border-gray-200 rounded-lg p-3 text-center cursor-pointer hover:border-violet-300 transition">
                    {preview ? (
                        <img src={preview} alt="preview" className="h-20 object-contain mx-auto rounded" />
                    ) : (
                        <p className="text-xs text-gray-400">Haz clic para subir imagen</p>
                    )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
                {errors.work_card_image && <p className="mt-1 text-xs text-red-500">{errors.work_card_image}</p>}
            </div>
        </>
    );
}