import { useForm, usePage } from '@inertiajs/react';

export default function TestDocuPipe() {
    const { errors, flash } = usePage().props;
    const result = flash?.docupipe_result;

    const { data, setData, post, processing } = useForm({ image: null });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.test-docupipe.post'), { forceFormData: true });
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg">
                <h1 className="text-xl font-bold text-gray-900 mb-6">Test DocuPipe</h1>
                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Imagen del carnet</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={e => setData('image', e.target.files[0])}
                            className="w-full text-sm border border-gray-300 rounded-lg p-2"
                            required
                        />
                        {errors.image && <p className="mt-1 text-xs text-red-500">{errors.image}</p>}
                    </div>
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition"
                    >
                        {processing ? 'Procesando...' : 'Enviar a DocuPipe'}
                    </button>
                </form>

                {result && (
                    <div className="mt-6">
                        <h2 className="text-sm font-bold text-gray-700 mb-2">Respuesta de DocuPipe:</h2>
                        <pre className="bg-gray-100 rounded-lg p-4 text-xs overflow-auto max-h-96 text-gray-800">
                            {result}
                        </pre>
                    </div>
                )}
            </div>
        </div>
    );
}