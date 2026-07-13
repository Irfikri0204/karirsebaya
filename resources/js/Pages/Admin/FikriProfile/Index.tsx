import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { FormEventHandler, useRef } from 'react';

interface Props {
    photo: string | null;
    description: string;
}

export default function FikriProfileIndex({ photo, description }: Props) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const { data, setData, post, processing, errors } = useForm({
        description: description || '',
        photo: null as File | null,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('admin.fikri-profile.update'));
    };

    return (
        <AdminLayout header="Profil Fikri">
            <Head title="Profil Fikri - Admin Karir Sebaya" />

            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Pengaturan Profil Fikri</h2>
                    <p className="text-sm text-gray-500">Kelola foto dan deskripsi untuk halaman profil khusus Fikri.</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden max-w-4xl">
                <form onSubmit={submit} className="p-6 md:p-8 space-y-8">
                    
                    {/* Photo Upload Section */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Foto Profil</h3>
                        <div className="flex flex-col sm:flex-row items-start gap-6">
                            <div className="w-40 h-40 rounded-2xl border-2 border-dashed border-gray-300 overflow-hidden flex-shrink-0 bg-gray-50 flex items-center justify-center relative group">
                                {data.photo ? (
                                    <img src={URL.createObjectURL(data.photo)} alt="Preview" className="w-full h-full object-cover" />
                                ) : photo ? (
                                    <img src={photo} alt="Current Photo" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-center text-gray-400">
                                        <i className="ph ph-user text-4xl mb-2"></i>
                                        <p className="text-xs">Belum ada foto</p>
                                    </div>
                                )}
                                
                                <button 
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute inset-0 bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <i className="ph ph-camera text-2xl"></i>
                                </button>
                            </div>
                            
                            <div className="flex-1">
                                <input 
                                    type="file" 
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={e => setData('photo', e.target.files?.[0] || null)}
                                />
                                <button 
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium text-sm transition-colors mb-2"
                                >
                                    Pilih Foto Baru
                                </button>
                                <p className="text-xs text-gray-500">Format yang didukung: JPG, PNG, WEBP. Ukuran maksimal 2MB. Rasio terbaik 1:1 (Persegi).</p>
                                {errors.photo && <p className="text-red-500 text-xs mt-1">{errors.photo}</p>}
                            </div>
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Description Section */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Deskripsi Profil</h3>
                        <p className="text-sm text-gray-500 mb-3">Tuliskan cerita, pengalaman, atau pengantar singkat tentang Fikri.</p>
                        <textarea 
                            rows={8}
                            value={data.description} 
                            onChange={e => setData('description', e.target.value)}
                            className="w-full rounded-xl border-gray-300 focus:border-brand-primary focus:ring-brand-primary resize-y"
                            placeholder="Halo, perkenalkan nama saya Fikri..."
                            required
                        />
                        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button 
                            type="submit" 
                            disabled={processing}
                            className="bg-brand-primary hover:bg-brand-purple text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-brand-primary/30 transition-all disabled:opacity-50 flex items-center gap-2"
                        >
                            {processing ? (
                                <>
                                    <i className="ph ph-spinner animate-spin text-xl"></i>
                                    Menyimpan...
                                </>
                            ) : (
                                <>
                                    <i className="ph ph-floppy-disk text-xl"></i>
                                    Simpan Perubahan
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
