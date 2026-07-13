import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { FormEventHandler } from 'react';

interface SettingsProps {
    settings: Record<string, string>;
}

export default function CounselingSettings({ settings }: SettingsProps) {
    const { data, setData, post, processing, recentlySuccessful } = useForm({
        contact_whatsapp: settings.contact_whatsapp || '',
        panduan_file: null as File | null,
        remove_panduan_file: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('admin.counseling-settings.update'));
    };

    return (
        <AdminLayout header="Kontak & Panduan">
            <Head title="Kontak & Panduan - Admin Karir Sebaya" />

            <div className="max-w-4xl">
                {recentlySuccessful && (
                    <div className="mb-6 bg-green-50 text-green-700 p-4 rounded-xl border border-green-200 flex items-center gap-3">
                        <i className="ph-fill ph-check-circle text-xl"></i>
                        <span className="font-medium">Pengaturan berhasil diperbarui.</span>
                    </div>
                )}

                <form onSubmit={submit} className="space-y-8">
                    
                    {/* Section Kontak */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
                            <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                                <i className="ph-fill ph-whatsapp-logo text-brand-primary"></i> Nomor Kontak Konseling
                            </h3>
                        </div>
                        <div className="p-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Nomor WhatsApp Admin Konseling (Gunakan awalan 62)</label>
                            <input 
                                type="text" 
                                value={data.contact_whatsapp} 
                                onChange={e => setData('contact_whatsapp', e.target.value)}
                                className="w-full rounded-xl border-gray-300 focus:border-brand-primary focus:ring-brand-primary shadow-sm"
                                placeholder="Contoh: 6281122334455"
                            />
                            <p className="text-xs text-gray-500 mt-2">Nomor ini akan dihubungkan ke tombol "Hubungi Kami via WhatsApp" di Halaman Pengajuan Konseling.</p>
                        </div>
                    </div>

                    {/* Section Panduan */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
                            <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                                <i className="ph-fill ph-book-open text-brand-primary"></i> Kelola File Panduan
                            </h3>
                            <p className="text-gray-500 text-sm mt-1">Unggah atau hapus file PDF buku panduan penggunaan platform.</p>
                        </div>
                        <div className="p-6">
                            {settings.panduan_file && !data.remove_panduan_file && (
                                <div className="mb-6 border border-gray-200 rounded-xl bg-gray-50 overflow-hidden">
                                    <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <i className="ph-fill ph-file-pdf text-red-500 text-2xl"></i>
                                            <span className="text-sm font-bold text-gray-800">File panduan saat ini aktif</span>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-3">
                                            <a href={settings.panduan_file} target="_blank" className="text-brand-primary text-sm font-bold hover:underline flex items-center gap-1">
                                                Buka Penuh <i className="ph ph-arrow-square-out"></i>
                                            </a>
                                            <button 
                                                type="button" 
                                                onClick={() => setData('remove_panduan_file', true)}
                                                className="text-red-500 hover:text-red-600 hover:bg-red-50 text-sm font-bold px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-red-100"
                                            >
                                                Hapus File
                                            </button>
                                        </div>
                                    </div>
                                    <div className="bg-gray-100 p-2 h-[500px] w-full">
                                        <iframe src={settings.panduan_file} className="w-full h-full rounded-lg border border-gray-300 shadow-inner"></iframe>
                                    </div>
                                </div>
                            )}
                            
                            <label className="block text-sm font-medium text-gray-700 mb-2">Unggah PDF Panduan Baru</label>
                            <input 
                                type="file" 
                                accept="application/pdf"
                                onChange={e => {
                                    setData('panduan_file', e.target.files?.[0] || null);
                                    if (e.target.files?.[0]) setData('remove_panduan_file', false);
                                }}
                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-light file:text-brand-primary hover:file:bg-brand-primary hover:file:text-white transition-all cursor-pointer"
                            />
                            <p className="text-xs text-gray-500 mt-2">Format yang didukung: PDF. Jika Anda mengunggah file baru, file lama akan otomatis tergantikan.</p>
                        </div>
                    </div>

                    <div className="flex justify-end sticky bottom-6 z-10">
                        <button 
                            type="submit" 
                            disabled={processing}
                            className="bg-brand-primary hover:bg-brand-purple text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-brand-primary/30 transition-all disabled:opacity-50 flex items-center gap-2"
                        >
                            {processing ? <i className="ph ph-spinner animate-spin"></i> : <i className="ph ph-floppy-disk"></i>}
                            Simpan Perubahan
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}

