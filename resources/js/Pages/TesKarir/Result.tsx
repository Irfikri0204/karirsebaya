import { Head, Link, usePage } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { useState, useCallback } from 'react';
import TestimonialFormModal from '@/Components/TestimonialFormModal';

interface InspiringFigure {
    name: string;
    image_path: string | null;
    description: string;
}

interface Profession {
    title: string;
    description: string;
}

interface RiasecCategory {
    code: string;
    name: string;
    description: string;
    recommendations: string;
    figures: InspiringFigure[];
    professions: Profession[];
}

interface RiasecTestResult {
    id: number;
    scores: { [key: string]: number };
    primary_category_code: string;
    primary_category: RiasecCategory;
    created_at: string;
}

interface Props {
    result: RiasecTestResult;
    allCategories: RiasecCategory[];
}

export default function TesKarirResult({ result, allCategories }: Props) {
    const { global_settings, my_testimonial } = usePage().props as any;

    const primaryCat = result.primary_category;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [expandedProf, setExpandedProf] = useState<Record<string, number | null>>({});

    const toggleProf = useCallback((catCode: string, profIdx: number) => {
        setExpandedProf(prev => ({
            ...prev,
            [catCode]: prev[catCode] === profIdx ? null : profIdx
        }));
    }, []);
    
    // Urutkan skor dari tertinggi ke terendah untuk menampilkan diagram/bar
    const sortedScores = Object.entries(result.scores).sort((a, b) => b[1] - a[1]);
    const maxScore = Math.max(...Object.values(result.scores));

    // Ambil 3 Teratas
    const top3Codes = sortedScores.slice(0, 3).map(s => s[0]);
    const top3Categories = top3Codes.map(code => allCategories.find(c => c.code === code)).filter(Boolean) as RiasecCategory[];

    return (
        <PublicLayout>
            <Head title="Hasil Tes Minat Karir - Karir Sebaya" />
            
            <div className="min-h-screen bg-brand-light font-sans text-gray-800 pt-24 pb-20 px-4 sm:px-6">
                <div className="max-w-5xl mx-auto">
                    
                    {/* Header Congratulation */}
                    <div className="text-center mb-12" data-aos="fade-up">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 text-green-600 rounded-full mb-6">
                            <i className="ph-fill ph-confetti text-4xl"></i>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
                            Selamat! Anda Didominasi Tipe <span className="text-brand-primary">"{primaryCat.name}"</span>
                        </h1>
                        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                            Berdasarkan hasil asesmen, tipe kepribadian dan minat karir Anda didominasi oleh karakteristik {primaryCat.name} ({primaryCat.code}), diikuti oleh dua aspek lainnya.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Kolom Kiri: Skor & Chart */}
                        <div className="lg:col-span-1 space-y-6" data-aos="fade-right">
                            <div className="bg-white rounded-3xl p-6 md:p-8 custom-shadow border border-gray-100">
                                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <i className="ph-fill ph-chart-bar text-brand-primary"></i> 
                                    Rincian Skor Minat
                                </h3>
                                
                                <div className="space-y-5">
                                    {sortedScores.map(([code, score]) => {
                                        const cat = allCategories.find(c => c.code === code);
                                        const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;
                                        const isPrimary = code === primaryCat.code;

                                        return (
                                            <div key={code} className="relative">
                                                <div className="flex justify-between items-end mb-1">
                                                    <span className={`font-bold text-sm ${isPrimary ? 'text-brand-primary' : 'text-gray-700'}`}>
                                                        {cat?.name} ({code})
                                                    </span>
                                                    <span className="text-xs font-medium text-gray-500">{score} poin</span>
                                                </div>
                                                <div className="w-full bg-gray-100 rounded-full h-2.5">
                                                    <div 
                                                        className={`h-2.5 rounded-full transition-all duration-1000 ease-out ${isPrimary ? 'bg-brand-primary shadow-md shadow-brand-primary/30' : 'bg-gray-300'}`} 
                                                        style={{ width: `${percentage}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-brand-dark to-brand-primary rounded-3xl p-6 md:p-8 custom-shadow text-white">
                                <h3 className="text-lg font-bold mb-4">Butuh Bantuan?</h3>
                                <p className="text-sm text-gray-200 mb-6 leading-relaxed">
                                    Masih bingung dengan hasil tes ini? Konselor ahli dan konselor sebaya kami siap membantu Anda mendiskusikan rencana karir selanjutnya.
                                </p>
                                <Link href={route('konseling')} className="w-full py-3 rounded-full bg-white text-brand-primary font-bold text-center block hover:bg-gray-50 transition-colors">
                                    Ajukan Konseling
                                </Link>
                            </div>

                            <div className="bg-brand-light/50 border border-brand-primary/20 rounded-3xl p-6 md:p-8 text-center mt-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-2">Bantu Kami Berkembang</h3>
                                <p className="text-sm text-gray-600 mb-6">
                                    Bagaimana pengalaman Anda menggunakan aplikasi ini?
                                </p>
                                <button 
                                    onClick={() => setIsModalOpen(true)}
                                    className="w-full py-3 rounded-full bg-brand-primary text-white font-bold hover:bg-brand-purple shadow-lg shadow-brand-primary/30 transition-all flex items-center justify-center gap-2"
                                >
                                    <i className="ph ph-chat-teardrop-text text-xl"></i>
                                    {my_testimonial ? "Edit Testimoni" : "Berikan Testimoni"}
                                </button>
                            </div>
                        </div>

                        {/* Kolom Kanan: Detail Interpretasi 3 Teratas */}
                        <div className="lg:col-span-2 space-y-8" data-aos="fade-left">
                            {top3Categories.map((cat, index) => (
                                <div key={cat.code} className="bg-white rounded-3xl overflow-hidden custom-shadow border border-gray-100">
                                    <div className="bg-brand-primary/5 px-6 py-4 md:px-8 md:py-5 border-b border-gray-100 flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-brand-primary text-white flex items-center justify-center font-serif font-bold text-xl shrink-0">
                                            #{index + 1}
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-serif font-bold text-gray-900">{cat.name} ({cat.code})</h2>
                                            <p className="text-brand-primary font-medium text-sm">Aspek Dominan ke-{index + 1}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="p-6 md:p-8 space-y-8">
                                        {/* Deskripsi */}
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                                                <i className="ph-fill ph-info text-brand-primary"></i> Interpretasi Kepribadian
                                            </h3>
                                            <div className="text-gray-600 leading-relaxed text-sm md:text-base space-y-3">
                                                {cat.description.split('\n').map((paragraph, idx) => (
                                                    <p key={idx}>{paragraph}</p>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Rekomendasi Pekerjaan & Profesi (Accordion) */}
                                        {cat.professions && cat.professions.length > 0 && (
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                                    <i className="ph-fill ph-briefcase text-brand-primary"></i> Rekomendasi Pekerjaan & Profesi
                                                </h3>
                                                <div className="space-y-2">
                                                    {cat.professions.map((prof, idx) => {
                                                        const isOpen = expandedProf[cat.code] === idx;
                                                        return (
                                                            <div key={idx} className={`border rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? 'border-brand-primary/30 bg-brand-primary/5 shadow-sm' : 'border-gray-200 bg-white hover:border-brand-primary/20'}`}>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => toggleProf(cat.code, idx)}
                                                                    className="w-full flex items-center justify-between px-5 py-4 text-left"
                                                                >
                                                                    <div className="flex items-center gap-3">
                                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-colors ${isOpen ? 'bg-brand-primary text-white' : 'bg-gray-100 text-gray-500'}`}>
                                                                            {idx + 1}
                                                                        </div>
                                                                        <span className={`font-bold text-sm md:text-base transition-colors ${isOpen ? 'text-brand-primary' : 'text-gray-800'}`}>
                                                                            {prof.title}
                                                                        </span>
                                                                    </div>
                                                                    <i className={`ph ph-caret-down text-lg transition-transform duration-300 ${isOpen ? 'rotate-180 text-brand-primary' : 'text-gray-400'}`}></i>
                                                                </button>
                                                                <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                                                    <div className="px-5 pb-5 pt-0 pl-16">
                                                                        <p className="text-gray-600 text-sm leading-relaxed border-l-2 border-brand-primary/30 pl-4">
                                                                            {prof.description}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}

                                        {global_settings?.riasec_show_figures === '1' && cat.figures && cat.figures.length > 0 && (
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                                    <i className="ph-fill ph-star text-brand-primary"></i> Tokoh Inspiratif (Role Models)
                                                </h3>
                                                <div className="grid sm:grid-cols-2 gap-4">
                                                    {cat.figures.map((figure, idx) => (
                                                        <div key={idx} className="flex gap-4 items-start p-4 bg-brand-light/30 rounded-2xl border border-brand-primary/10">
                                                            <div className="w-16 h-16 shrink-0 rounded-full overflow-hidden border-2 border-white shadow-sm flex items-center justify-center bg-gray-200">
                                                                {figure.image_path ? (
                                                                    <img src={figure.image_path} alt={figure.name} className="w-full h-full object-cover" />
                                                                ) : (
                                                                    <span className="text-gray-400 font-bold text-lg">{figure.name.substring(0,2).toUpperCase()}</span>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <h4 className="font-bold text-gray-900 text-sm mb-1">{figure.name}</h4>
                                                                <p className="text-gray-500 text-xs leading-relaxed line-clamp-3">{figure.description}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <TestimonialFormModal 
                show={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
            />
        </PublicLayout>
    );
}
