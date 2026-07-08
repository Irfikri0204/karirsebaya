import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';

interface Module {
    id: number;
    title: string;
    hashtag: string | null;
    introduction: string | null;
    cover_image: string | null;
}

interface Props {
    modules: Module[];
}

export default function ModulIndex({ modules }: Props) {
    return (
        <PublicLayout>
            <Head title="Modul Karir - Karir Sebaya" />
            
            <div className="pt-32 pb-24 px-6 lg:px-20 bg-brand-light font-sans min-h-screen">
                <div className="max-w-7xl mx-auto">
                    
                    <div className="text-center mb-16" data-aos="fade-up">
                        <p className="text-brand-primary font-semibold text-sm tracking-wider uppercase mb-3">Materi Belajar</p>
                        <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6">Modul & Referensi Karir</h1>
                        <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
                            Kumpulan modul esensial yang dirancang khusus untuk membekali Anda dengan pengetahuan praktis seputar persiapan dunia kerja.
                        </p>
                    </div>

                    {modules.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {modules.map((mod, idx) => (
                                <div key={mod.id} className="bg-white rounded-3xl overflow-hidden custom-shadow hover:-translate-y-2 transition-transform duration-300 border border-gray-100 flex flex-col h-full group" data-aos="fade-up" data-aos-delay={(idx % 3) * 100}>
                                    <div className="h-48 w-full bg-gray-100 relative overflow-hidden">
                                        {mod.cover_image ? (
                                            <img src={mod.cover_image} alt={mod.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-brand-primary/5 text-brand-primary/20">
                                                <i className="ph-fill ph-book-open text-6xl"></i>
                                            </div>
                                        )}
                                        <Link href={route('modul.show', mod.id)} className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-brand-primary shadow-sm border border-white/50 hover:bg-brand-primary hover:text-white transition-colors">
                                            {mod.hashtag ? mod.hashtag : 'Modul'}
                                        </Link>
                                    </div>
                                    <div className="p-6 flex flex-col flex-grow">
                                        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">{mod.title}</h3>
                                        <p className="text-gray-600 text-sm mb-6 line-clamp-3 leading-relaxed flex-grow">
                                            {mod.introduction || 'Tidak ada pengantar singkat untuk modul ini.'}
                                        </p>
                                        
                                        <Link 
                                            href={route('modul.show', mod.id)} 
                                            className="w-full py-3 px-4 rounded-xl bg-brand-primary/10 text-brand-primary hover:bg-brand-primary hover:text-white font-bold text-sm transition-colors text-center flex items-center justify-center gap-2 mt-auto"
                                        >
                                            <i className="ph ph-book-open text-lg"></i>
                                            Mulai Belajar
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-3xl custom-shadow border border-gray-100">
                            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300 text-4xl">
                                <i className="ph ph-books"></i>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Modul Belum Tersedia</h3>
                            <p className="text-gray-500 max-w-md mx-auto">Kami sedang mempersiapkan materi pembelajaran terbaik untuk Anda. Silakan kembali lagi nanti.</p>
                        </div>
                    )}
                </div>
            </div>
        </PublicLayout>
    );
}
