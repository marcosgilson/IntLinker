import { useState, useRef } from 'react';
import { useForm, usePage, Link } from '@inertiajs/react';

export default function BecomeWorkerForm({ companies, status }) {
    const { auth } = usePage().props;
    const roles = auth.roles ?? {};
    const isVerifiedWorker = roles.is_worker;
    const isPendingWorker  = roles.is_pending_worker;
    const hasAnyWorkerStatus = isVerifiedWorker || isPendingWorker;

    const [open, setOpen] = useState(false);
    const [preview, setPreview] = useState(null);
    const fileRef = useRef(null);

    const { data, setData, post, processing, errors, reset } = useForm('become-worker', {
        name: auth.user.name,
        company_name: '',
        position: '',
        work_card_image: null,
    });

    const leaveForm = useForm();

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
            onSuccess: () => { setOpen(false); reset('company_name', 'position', 'work_card_image'); setPreview(null); },
        });
    };

    const doLeave = () => {
        if (!confirm('¿Seguro que quieres abandonar tu empresa? Tendras que volver a verificarte para unirte a otra.')) return;
        leaveForm.delete(route('worker.leave'));
    };

    // Already a verified or pending worker — show current status + leave option
    if (hasAnyWorkerStatus) {
        const currentCompany = companies?.[0];
        return (
            <div className="bg-violet-50 border border-violet-200 rounded-2xl p-4 sm:p-5 space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                    <div className="w-10 h-10 rounded-xl bg-violet-500 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-violet-900 text-sm">
                            {isVerifiedWorker ? 'Trabajador verificado' : 'Verificación pendiente'}
                        </h3>
                        {currentCompany ? (
                            <p className="text-xs text-violet-700 mt-1">
                                {isVerifiedWorker ? '✓' : '⏳'} {currentCompany.name}
                                {currentCompany.city ? ` · ${currentCompany.city}` : ''}
                            </p>
                        ) : (
                            <p className="text-xs text-violet-500 mt-1">Solicitud en revision</p>
                        )}
                    </div>
                    {isVerifiedWorker && (
                        <Link href="/mi-empresa" className="text-sm font-semibold text-violet-600 hover:underline w-full sm:w-auto sm:whitespace-nowrap">
                            Mi empresa →
                        </Link>
                    )}
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-800">
                    Solo puedes pertenecer a <strong>una empresa</strong> a la vez. Para cambiar de empresa, primero debes abandonar la actual.
                </div>

                <button
                    type="button"
                    onClick={doLeave}
                    disabled={leaveForm.processing}
                    className="inline-flex min-h-10 w-full sm:w-auto items-center justify-center text-sm font-semibold text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 hover:bg-red-50 px-4 py-2 rounded-lg transition disabled:opacity-50"
                >
                    {leaveForm.processing ? 'Procesando...' : 'Abandonar empresa'}
                </button>
            </div>
        );
    }

    // Not a worker yet — show registration form
    return (
        <div className={`bg-white border rounded-2xl overflow-hidden transition-all ${open ? 'border-violet-300 shadow-md' : 'border-gray-200 shadow-sm hover:border-violet-200 hover:shadow-md'}`}>
            <button type="button" onClick={() => setOpen(!open)} className="w-full flex items-start gap-3 p-4 sm:p-5 text-left">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition ${open ? 'bg-violet-500' : 'bg-gray-100'}`}>
                    <svg className={`w-5 h-5 ${open ? 'text-white' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                </div>
                <div className="min-w-0">
                    <p className="font-bold text-gray-900 text-sm break-words">Alta como Trabajador</p>
                    <p className="text-xs text-gray-500 mt-0.5 break-words">Representa a tu empresa en la plataforma</p>
                </div>
                <svg className={`w-4 h-4 text-gray-400 ml-auto transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            {open && (
                <form onSubmit={submit} className="px-4 sm:px-5 pb-4 sm:pb-5 space-y-3 border-t border-gray-100 pt-4">
                    <WorkerFormFields data={data} setData={setData} errors={errors} preview={preview} handleFile={handleFile} fileRef={fileRef} />
                    <button type="submit" disabled={processing}
                        className="w-full min-h-10 bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white text-sm font-semibold py-2.5 rounded-lg transition">
                        {processing ? 'Enviando...' : 'Solicitar alta como trabajador'}
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
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 focus:outline-none" required />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
            </div>
            <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Nombre de empresa</label>
                <input type="text" value={data.company_name} onChange={e => setData('company_name', e.target.value)}
                    placeholder="Ej. Mercadona"
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 focus:outline-none" required />
                {errors.company_name && <p className="mt-1 text-xs text-red-500">{errors.company_name}</p>}
            </div>
            <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Puesto / Cargo</label>
                <input type="text" value={data.position} onChange={e => setData('position', e.target.value)}
                    placeholder="Ej: Ingeniero de Software"
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 focus:outline-none" required />
                {errors.position && <p className="mt-1 text-xs text-red-500">{errors.position}</p>}
            </div>
            <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Carnet empresa (imagen)</label>
                <div onClick={() => fileRef.current?.click()}
                    className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center cursor-pointer hover:border-violet-300 transition">
                    {preview ? (
                        <img src={preview} alt="vista previa" className="h-20 object-contain mx-auto rounded" />
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
