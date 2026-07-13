import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { useState, useEffect } from 'react';

interface TopicContent {
    id: number;
    type: 'text' | 'image';
    content: string;
    order: number;
}

interface ModuleTopic {
    id: number;
    title: string;
    order: number;
    contents: TopicContent[];
}

interface Module {
    id: number;
    title: string;
    hashtag: string | null;
    introduction: string | null;
    cover_image: string | null;
    topics: ModuleTopic[];
}

interface Props {
    module: Module;
}

export default function ModulShow({ module }: Props) {
    const [activeTopicId, setActiveTopicId] = useState<number | null>(null);

    const activeTopic = module.topics.find(t => t.id === activeTopicId);
    const activeIndex = activeTopic ? module.topics.findIndex(t => t.id === activeTopic.id) : -1;
    const prevTopic = activeIndex > 0 ? module.topics[activeIndex - 1] : null;
    const nextTopic = activeIndex < module.topics.length - 1 ? module.topics[activeIndex + 1] : null;

    // Scroll to top when topic changes
    useEffect(() => {
        if (activeTopicId !== null) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [activeTopicId]);

    // ─── VIEW: Topic Content ──────────────────────
    if (activeTopic) {
        return (
            <PublicLayout>
                <Head title={`${activeTopic.title} - ${module.title}`} />

                <div className="pt-24 pb-12 bg-brand-light font-sans min-h-screen">
                    {/* Top Navigation Bar */}
                    <div className="bg-white border-b border-gray-200 sticky top-16 z-20">
                        <div className="max-w-4xl mx-auto px-6 lg:px-20 py-3 flex items-center justify-between">
                            <button
                                onClick={() => setActiveTopicId(null)}
                                className="inline-flex items-center gap-2 text-gray-500 hover:text-brand-primary font-medium text-sm transition-colors"
                            >
                                <i className="ph ph-arrow-left text-lg"></i>
                                Daftar Topik
                            </button>
                            <div className="text-sm text-gray-400 font-medium">
                                {activeIndex + 1} / {module.topics.length}
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-20 py-10">
                        <div className="bg-white rounded-3xl p-6 sm:p-10 md:p-14 shadow-xl shadow-brand-primary/5 border border-gray-100/50 relative overflow-hidden">
                            {/* Decorative blur elements for modern look */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-full blur-[80px] -z-10 pointer-events-none"></div>
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-accent/5 rounded-full blur-[80px] -z-10 pointer-events-none"></div>
                            {/* Topic Title */}
                            <div className="mb-12 pb-8 border-b border-gray-100 flex flex-col items-center text-center">
                                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-primary/10 text-brand-primary text-sm font-bold mb-4">
                                    <i className="ph-fill ph-book-open"></i> Topik {activeIndex + 1}
                                </span>
                                <h1 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 leading-tight">
                                    {activeTopic.title}
                                </h1>
                            </div>

                            {/* Topic Contents */}
                            {activeTopic.contents && activeTopic.contents.length > 0 ? (
                                <div className="space-y-12">
                                    {activeTopic.contents.map((content) => (
                                        <div key={content.id} className="content-block">
                                            {content.type === 'text' ? (
                                                <div
                                                    className="prose prose-brand max-w-none text-gray-700 leading-relaxed text-base md:text-lg font-medium"
                                                    dangerouslySetInnerHTML={{ __html: content.content }}
                                                />
                                            ) : (
                                                <div className="my-10 rounded-3xl overflow-hidden bg-gray-50 border border-gray-100 shadow-sm">
                                                    <img
                                                        src={content.content}
                                                        alt="Ilustrasi Topik"
                                                        className="w-full h-auto object-cover"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-24 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                                        <i className="ph ph-article text-4xl text-brand-primary/40"></i>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Materi Belum Tersedia</h3>
                                    <p className="text-gray-500">Materi untuk topik ini sedang dipersiapkan oleh tim kami.</p>
                                </div>
                            )}

                            {/* Prev / Next Navigation */}
                            <div className="mt-20 flex flex-col sm:flex-row gap-6 justify-between items-center">
                                {prevTopic ? (
                                    <button
                                        onClick={() => setActiveTopicId(prevTopic.id)}
                                        className="w-full sm:w-auto flex items-center gap-4 text-gray-600 bg-white border border-gray-200 hover:border-brand-primary hover:text-brand-primary hover:shadow-md px-6 py-4 rounded-2xl transition-all group"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-gray-100 group-hover:bg-brand-primary/10 flex items-center justify-center shrink-0 transition-colors">
                                            <i className="ph ph-arrow-left text-xl"></i>
                                        </div>
                                        <div className="text-left">
                                            <span className="block text-xs font-bold text-gray-400 group-hover:text-brand-primary uppercase tracking-wider mb-1">Sebelumnya</span>
                                            <span className="block text-sm font-bold text-gray-800 line-clamp-1 group-hover:text-brand-primary transition-colors">
                                                {prevTopic.title}
                                            </span>
                                        </div>
                                    </button>
                                ) : <div className="hidden sm:block"></div>}

                                {nextTopic ? (
                                    <button
                                        onClick={() => setActiveTopicId(nextTopic.id)}
                                        className="w-full sm:w-auto flex items-center gap-4 text-white bg-brand-primary hover:bg-brand-purple px-6 py-4 rounded-2xl shadow-lg shadow-purple-900/20 transition-all group ml-auto"
                                    >
                                        <div className="text-right">
                                            <span className="block text-xs font-bold text-white/70 uppercase tracking-wider mb-1">Selanjutnya</span>
                                            <span className="block text-sm font-bold text-white line-clamp-1">
                                                {nextTopic.title}
                                            </span>
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0 group-hover:translate-x-1 transition-transform">
                                            <i className="ph ph-arrow-right text-xl"></i>
                                        </div>
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => setActiveTopicId(null)}
                                        className="w-full sm:w-auto flex items-center justify-center gap-3 text-white bg-green-600 hover:bg-green-700 px-8 py-4 rounded-2xl shadow-lg shadow-green-900/20 transition-all ml-auto font-bold"
                                    >
                                        <i className="ph-fill ph-check-circle text-xl"></i>
                                        Selesai & Kembali
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </PublicLayout>
        );
    }

    // ─── VIEW: Module Overview (Topic List) ──────────────────────
    return (
        <PublicLayout>
            <Head title={`${module.title} - Karir Sebaya`} />

            <div className="pt-24 pb-12 bg-brand-light font-sans min-h-screen">
                {/* Hero Section */}
                <div className="bg-white border-b border-gray-200">
                    <div className="max-w-5xl mx-auto px-6 lg:px-20 py-8 lg:py-12">
                        <Link href={route('modul')} className="inline-flex items-center gap-2 text-gray-500 hover:text-brand-primary font-medium text-sm mb-6 transition-colors">
                            <i className="ph ph-arrow-left text-lg"></i>
                            Kembali ke Daftar Modul
                        </Link>

                        <div className="flex flex-col items-center text-center">
                            <h1 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 mb-4">{module.title}</h1>

                            {module.hashtag && (
                                <div className="inline-block px-3 py-1 bg-brand-primary/10 text-brand-primary text-sm font-bold rounded-full mb-6">
                                    {module.hashtag.replace(/^#+/, '')}
                                </div>
                            )}

                            <p className="text-gray-600 text-lg leading-relaxed max-w-3xl mb-8">
                                {module.introduction || 'Tidak ada pengantar untuk modul ini.'}
                            </p>

                            {module.cover_image && (
                                <div className="w-full max-w-2xl rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
                                    <img src={module.cover_image} alt={module.title} className="w-full h-auto object-contain" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Topic List - Full Width, Stacked */}
                <div className="max-w-4xl mx-auto px-6 lg:px-20 py-12">
                    <div className="bg-white rounded-2xl p-6 md:p-8 custom-shadow border border-gray-100">
                        <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2 text-lg">
                            <i className="ph-fill ph-list-bullets text-brand-primary"></i>
                            Daftar Topik ({module.topics.length} topik)
                        </h3>

                        {module.topics.length > 0 ? (
                            <div className="space-y-3">
                                {module.topics.map((topic, index) => (
                                    <button
                                        key={topic.id}
                                        onClick={() => setActiveTopicId(topic.id)}
                                        className="w-full flex items-center gap-4 p-4 md:p-5 rounded-xl border border-gray-200 bg-white hover:border-brand-primary/50 hover:bg-brand-primary/5 hover:shadow-sm transition-all group text-left"
                                    >
                                        <div className="shrink-0 w-10 h-10 rounded-full bg-gray-100 group-hover:bg-brand-primary group-hover:text-white flex items-center justify-center text-sm font-bold text-gray-500 transition-colors">
                                            {index + 1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <span className="font-bold text-gray-800 group-hover:text-brand-primary text-sm md:text-base transition-colors block truncate">
                                                {topic.title}
                                            </span>
                                            <span className="text-xs text-gray-400 mt-0.5 block">
                                                {topic.contents?.length || 0} konten
                                            </span>
                                        </div>
                                        <i className="ph ph-arrow-right text-xl text-gray-300 group-hover:text-brand-primary group-hover:translate-x-1 transition-all shrink-0"></i>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-gray-500">
                                <i className="ph ph-folder-open text-4xl text-gray-300 mb-3 block"></i>
                                Belum ada topik untuk modul ini.
                            </div>
                        )}

                        {module.topics.length > 0 && (
                            <div className="mt-8 text-center">
                                <button
                                    onClick={() => setActiveTopicId(module.topics[0].id)}
                                    className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-brand-primary text-white font-bold hover:bg-brand-purple shadow-lg shadow-brand-primary/30 transition-all"
                                >
                                    Mulai Belajar dari Topik Pertama
                                    <i className="ph ph-arrow-right"></i>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
