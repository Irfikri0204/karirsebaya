import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';

interface RiasecCategory {
    code: string;
    name: string;
    color_class: string;
}

interface TestResult {
    id: number;
    uuid: string;
    scores: any;
    primary_category_code: string;
    created_at: string;
    primary_category: RiasecCategory;
}

export default function TesKarirHistory({ auth, results }: PageProps<{ results: TestResult[] }>) {
    return (
        <PublicLayout>
            <Head title="Riwayat Tes Minat Karir - Karir Sebaya" />
            
            <div className="min-h-[80vh] bg-brand-light font-sans text-gray-800 pt-24 pb-16 px-6 lg:px-20">
                <main className="max-w-4xl mx-auto w-full">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                        <div>
                            <Link href={route('tes-karir.index')} className="text-sm font-medium text-brand-primary hover:text-brand-purple flex items-center gap-1 mb-2">
                                <i className="ph ph-arrow-left"></i> Kembali ke Tes Karir
                            </Link>
                            <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">Riwayat Tes Minat Karir</h1>
                            <p className="text-gray-600 mt-2">Daftar hasil tes yang pernah kamu kerjakan sebelumnya.</p>
                        </div>
                        <Link href={route('tes-karir.create')} className="px-6 py-2.5 rounded-full bg-brand-primary text-white font-semibold hover:bg-brand-purple transition-colors shadow-lg shadow-purple-900/20 text-center w-full md:w-auto">
                            Kerjakan Tes Baru
                        </Link>
                    </div>

                    {results.length > 0 ? (
                        <div className="space-y-4">
                            {results.map((result) => (
                                <div key={result.id} className="bg-white rounded-2xl p-6 border border-gray-200 custom-shadow hover:shadow-md transition-shadow flex flex-col md:flex-row gap-6 items-center justify-between">
                                    <div className="flex items-center gap-6 w-full md:w-auto">
                                        <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-bold flex-shrink-0 text-white`} style={{ backgroundColor: `var(--${result.primary_category?.color_class || 'brand-primary'})` }}>
                                            {result.primary_category_code}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-1">
                                                Tipe {result.primary_category?.name || result.primary_category_code}
                                            </h3>
                                            <p className="text-sm text-gray-500 flex items-center gap-2">
                                                <i className="ph ph-calendar"></i> 
                                                {new Date(result.created_at).toLocaleDateString('id-ID', {
                                                    day: 'numeric', month: 'long', year: 'numeric',
                                                    hour: '2-digit', minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <Link href={route('tes-karir.result', result.uuid)} className="w-full md:w-auto px-6 py-2.5 rounded-full bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors border border-gray-200 flex items-center justify-center gap-2">
                                        Lihat Detail Hasil <i className="ph ph-arrow-right"></i>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 custom-shadow">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <i className="ph ph-clock-counter-clockwise text-4xl text-gray-400"></i>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Belum Ada Riwayat Tes</h3>
                            <p className="text-gray-500 mb-8 max-w-md mx-auto">
                                Kamu belum pernah mengerjakan Tes Minat Karir. Mulai tes pertamamu untuk mengetahui minat dan potensi karir yang paling cocok untukmu!
                            </p>
                            <Link href={route('tes-karir.create')} className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-brand-primary text-white font-semibold hover:bg-brand-purple transition-colors shadow-lg shadow-purple-900/20">
                                Mulai Tes Sekarang <i className="ph ph-arrow-right"></i>
                            </Link>
                        </div>
                    )}
                </main>
            </div>
        </PublicLayout>
    );
}
