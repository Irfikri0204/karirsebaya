import { Head } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';

interface Props {
    photo: string | null;
    description: string;
}

export default function FikriProfile({ photo, description }: Props) {
    return (
        <PublicLayout>
            <Head title="Profil Fikri - Karir Sebaya" />
            
            <div className="pt-32 pb-24 px-6 lg:px-20 bg-brand-light min-h-screen">
                <div className="max-w-4xl mx-auto">
                    
                    <div className="bg-white rounded-3xl shadow-xl shadow-brand-primary/5 border border-gray-100 overflow-hidden" data-aos="fade-up">
                        <div className="h-32 md:h-48 bg-gradient-to-r from-brand-primary to-brand-purple relative">
                            {/* Decorative background elements */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                            <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
                        </div>
                        
                        <div className="px-6 md:px-12 pb-12">
                            <div className="relative -mt-16 md:-mt-24 mb-8 flex flex-col md:flex-row md:items-end gap-6">
                                <div className="w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-white shadow-xl bg-white overflow-hidden shrink-0 mx-auto md:mx-0">
                                    {photo ? (
                                        <img src={photo} alt="Profil Fikri" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                            <i className="ph ph-user text-6xl text-gray-300"></i>
                                        </div>
                                    )}
                                </div>
                                <div className="text-center md:text-left mb-2 md:mb-4">
                                    <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-2">Fikri</h1>
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary font-medium text-sm">
                                        <i className="ph-fill ph-check-circle"></i>
                                        Tim Pengembang Karir Sebaya
                                    </span>
                                </div>
                            </div>
                            
                            <div className="prose prose-lg max-w-none text-gray-600">
                                {description.split('\n').map((paragraph, index) => (
                                    paragraph.trim() ? <p key={index} className="leading-relaxed mb-4">{paragraph}</p> : <br key={index} />
                                ))}
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
        </PublicLayout>
    );
}
