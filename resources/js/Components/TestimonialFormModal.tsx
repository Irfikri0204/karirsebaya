import { useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import Modal from '@/Components/Modal';

interface Props {
    show: boolean;
    onClose: () => void;
}

export default function TestimonialFormModal({ show, onClose }: Props) {
    const { auth, my_testimonial } = usePage().props as any;

    const { data, setData, post, processing, errors, reset, recentlySuccessful } = useForm({
        message: my_testimonial?.message || '',
        rating: my_testimonial?.rating || 5,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        
        post(route('testimoni.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setTimeout(() => {
                    onClose();
                }, 2000);
            },
        });
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="lg">
            <div className="p-8 relative">
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <i className="ph ph-x text-2xl"></i>
                </button>

                <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-brand-primary/10 text-brand-primary rounded-2xl flex items-center justify-center text-3xl">
                        <i className="ph-fill ph-chat-centered-text"></i>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 font-serif">
                            {my_testimonial ? 'Edit Testimoni Anda' : 'Berikan Testimoni'}
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            {my_testimonial ? 'Perbarui pengalaman Anda menggunakan Karir Sebaya!' : 'Bagikan pengalaman Anda menggunakan Karir Sebaya!'}
                        </p>
                    </div>
                </div>

                {recentlySuccessful ? (
                    <div className="bg-green-50 border border-green-100 rounded-2xl p-6 text-center">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                            <i className="ph-fill ph-check-circle"></i>
                        </div>
                        <h3 className="text-xl font-bold text-green-800 mb-2">Terima Kasih!</h3>
                        <p className="text-green-700 text-sm">Testimoni Anda berhasil dikirim dan akan segera dipublikasikan.</p>
                    </div>
                ) : (
                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nama Lengkap
                            </label>
                            <input 
                                type="text" 
                                value={auth.user?.name || ''} 
                                disabled
                                className="w-full rounded-xl border-gray-300 bg-gray-50 text-gray-500 cursor-not-allowed"
                            />
                            <p className="text-xs text-gray-500 mt-2">
                                Nama akan ditampilkan sesuai dengan profil Anda.
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Rating Bintang
                            </label>
                            <div className="flex items-center gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setData('rating', star)}
                                        className={`text-3xl transition-transform hover:scale-110 focus:outline-none ${
                                            data.rating >= star ? 'text-yellow-400' : 'text-gray-200'
                                        }`}
                                    >
                                        <i className="ph-fill ph-star"></i>
                                    </button>
                                ))}
                            </div>
                            {errors.rating && <p className="text-red-500 text-xs mt-1">{errors.rating}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Kesan & Pesan
                            </label>
                            <textarea 
                                rows={4}
                                value={data.message}
                                onChange={e => setData('message', e.target.value)}
                                placeholder="Ceritakan bagaimana Karir Sebaya membantu Anda..."
                                className="w-full rounded-xl border-gray-300 focus:border-brand-primary focus:ring-brand-primary resize-none shadow-sm"
                                required
                            />
                            {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button 
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-3 rounded-xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                            >
                                Batal
                            </button>
                            <button 
                                type="submit"
                                disabled={processing}
                                className="flex-1 px-4 py-3 rounded-xl font-bold text-white bg-brand-primary hover:bg-brand-purple shadow-lg shadow-purple-900/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {processing ? <i className="ph ph-spinner animate-spin"></i> : <i className="ph ph-paper-plane-right"></i>}
                                {my_testimonial ? 'Simpan Perubahan' : 'Kirim Testimoni'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </Modal>
    );
}
