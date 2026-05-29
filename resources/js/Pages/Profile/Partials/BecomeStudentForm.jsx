import { useState, useRef, useEffect } from 'react';
import { useForm, usePage, Link, router } from '@inertiajs/react';

export default function BecomeStudentForm({ student, status }) {
    const { auth } = usePage().props;
    const [open, setOpen] = useState(false);
    const [preview, setPreview] = useState(null);
    const fileRef = useRef(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: auth.user.name,
        school_name: '',
        school_email: '',
        student_card_image: null,
    });

    const isActive = student && student.verified && (student.expires_at === null || new Date(student.expires_at) > new Date());
    const isPending = student && !student.verified && student.docupipe_status !== 'failed';
    const isFailed  = student && student.docupipe_status === 'failed';

    // Poll every 30s when verification is pending
    useEffect(() => {
        if (!isPending) return;

        const poll = async () => {
            try {
                const res = await fetch(route('student.status'));
                const data = await res.json();
                if (data.status !== 'pending') {
                    router.reload({ only: ['student'] });
                }
            } catch (_) {}
        };

        poll(); // poll immediately on mount
        const id = setInterval(poll, 30 * 1000);
        return () => clearInterval(id);
    }, [isPending]);


    const handleFile = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setData('student_card_image', file);
        setPreview(URL.createObjectURL(file));
    };

    const submit = (e) => {
        e.preventDefault();
        post(route(isActive ? 'student.renew' : 'student.store'), {
            forceFormData: true,
            onSuccess: () => {
                setOpen(false);
                reset('school_name', 'school_email', 'student_card_image');
                setPreview(null);
            },
        });
    };

    if (isFailed) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 sm:p-5">
                <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-red-500 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-red-900 text-sm">Verificación rechazada</h3>
                        {student.docupipe_failure_reason && (
                            <p className="text-xs text-red-700 mt-0.5">{student.docupipe_failure_reason}</p>
                        )}
                    </div>
                </div>
                <button
                    onClick={() => router.delete('/alumno/fallido', {}, { preserveScroll: true })}
                    className="w-full min-h-10 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition"
                >
                    Intentar de nuevo
                </button>
            </div>
        );
    }

    if (isPending && !isActive) {
        return (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5">
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-400 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="font-bold text-amber-900 text-sm">Verificación pendiente</h3>
                        <p className="text-xs text-amber-700 mt-0.5">Tu carnet esta siendo revisado. Te avisaremos por correo cuando se complete.</p>
                    </div>
                </div>
            </div>
        );
    }

    if (isActive) {
        return (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 sm:p-5">
                <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="font-bold text-emerald-900 text-sm">Alumno activo</h3>
                        <p className="text-xs text-emerald-600 mt-0.5">
                            Caduca: {new Date(student.expires_at).toLocaleDateString('es-ES')}
                            {student.verified ? '' : ' · Pendiente de verificación'}
                        </p>
                    </div>
                    <Link href="/postulaciónes" className="text-sm font-semibold text-emerald-600 hover:underline w-full sm:w-auto sm:ml-auto sm:whitespace-nowrap">
                        Ver postulaciónes →
                    </Link>
                </div>
                <button
                    type="button"
                    onClick={() => setOpen(!open)}
                    className="text-sm font-semibold text-emerald-700 hover:text-emerald-800 underline"
                >
                    {open ? 'Cancelar renovacion' : 'Renovar carnet'}
                </button>
                {open && (
                    <form onSubmit={submit} className="mt-4 space-y-3">
                        <FormFields data={data} setData={setData} errors={errors} preview={preview} handleFile={handleFile} fileRef={fileRef} isRenew />
                        <button type="submit" disabled={processing}
                            className="w-full min-h-10 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-sm font-semibold py-2 rounded-lg transition">
                            {processing ? 'Renovando…' : 'Renovar carnet'}
                        </button>
                    </form>
                )}
            </div>
        );
    }

    return (
        <div className={`bg-white border rounded-2xl overflow-hidden transition-all ${open ? 'border-emerald-300 shadow-md' : 'border-gray-200 shadow-sm hover:border-emerald-200 hover:shadow-md'}`}>
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="w-full flex items-start gap-3 p-4 sm:p-5 text-left"
            >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition ${open ? 'bg-emerald-500' : 'bg-gray-100'}`}>
                    <svg className={`w-5 h-5 ${open ? 'text-white' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    </svg>
                </div>
                <div className="min-w-0">
                    <p className="font-bold text-gray-900 text-sm break-words">Alta como Alumno</p>
                    <p className="text-xs text-gray-500 mt-0.5 break-words">Accede a oportunidades laborales</p>
                </div>
                <svg className={`w-4 h-4 text-gray-400 ml-auto transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {open && (
                <form onSubmit={submit} className="px-4 sm:px-5 pb-4 sm:pb-5 space-y-3 border-t border-gray-100 pt-4">
                    <FormFields data={data} setData={setData} errors={errors} preview={preview} handleFile={handleFile} fileRef={fileRef} />
                    <button type="submit" disabled={processing}
                        className="w-full min-h-10 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-sm font-semibold py-2.5 rounded-lg transition">
                        {processing ? 'Enviando…' : 'Solicitar alta como alumno'}
                    </button>
                </form>
            )}
        </div>
    );
}

function FormFields({ data, setData, errors, preview, handleFile, fileRef, isRenew }) {
    return (
        <>
            <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Nombre completo</label>
                <input
                    type="text"
                    value={data.name}
                    onChange={e => setData('name', e.target.value)}
                    placeholder="Tu nombre completo"
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none"
                    required
                />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
            </div>
            {!isRenew && (
                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Nombre de escuela</label>
                    <input
                        type="text"
                        value={data.school_name}
                        onChange={e => setData('school_name', e.target.value)}
                        placeholder="Ej: IES La Encina"
                        className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none"
                        required
                    />
                    {errors.school_name && <p className="mt-1 text-xs text-red-500">{errors.school_name}</p>}
                </div>
            )}
            {!isRenew && (
                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Correo escolar</label>
                    <input
                        type="email"
                        value={data.school_email}
                        onChange={e => setData('school_email', e.target.value)}
                        placeholder="alumno@escuela.edu"
                        className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none"
                        required
                    />
                    {errors.school_email && <p className="mt-1 text-xs text-red-500">{errors.school_email}</p>}
                </div>
            )}
            <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Carnet escolar (imagen)</label>
                <div
                    onClick={() => fileRef.current?.click()}
                    className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center cursor-pointer hover:border-emerald-300 transition"
                >
                    {preview ? (
                        <img src={preview} alt="vista previa" className="h-20 object-contain mx-auto rounded" />
                    ) : (
                        <p className="text-xs text-gray-400">Haz clic para subir imagen</p>
                    )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
                {errors.student_card_image && <p className="mt-1 text-xs text-red-500">{errors.student_card_image}</p>}
            </div>
        </>
    );
}
