import { Head, usePage } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { useState } from 'react';
import TestimonialFormModal from '@/Components/TestimonialFormModal';

interface Testimonial {
    id: number;
    name: string;
    institution: string;
    message: string;
    rating: number;
    avatar_initials: string | null;
    avatar_color: string;
    created_at: string;
}

interface Props {
    testimonials: Testimonial[];
}

export default function TestimoniIndex({ testimonials }: Props) {
    const { auth, my_testimonial } = usePage().props as any;
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
        if (!auth.user) {
            window.location.href = route('login');
            return;
        }
        setIsModalOpen(true);
    };

    return (
        <PublicLayout>
            <Head title="Testimoni" />

            {/* Header */}
            <section className="pt-32 pb-16 px-6 lg:px-20 bg-brand-light relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/5 rounded-full blur-[80px]"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-accent/5 rounded-full blur-[80px]"></div>
                
                <div className="max-w-4xl mx-auto text-center relative z-10" data-aos="fade-up">
                    <p className="text-brand-primary font-semibold text-sm tracking-wider uppercase mb-3">Apa Kata Mereka?</p>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-gray-900 mb-6">
                        Kisah Sukses Bersama <span className="text-brand-primary italic">Karir Sebaya</span>
                    </h1>
                    <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto mb-8">
                        Ribuan mahasiswa dan fresh graduate telah menemukan arah karir yang tepat bersama mentor kami. Temukan inspirasi dari perjalanan mereka.
                    </p>
                    <button 
                        onClick={handleOpenModal}
                        className="bg-brand-primary hover:bg-brand-purple text-white px-8 py-3.5 rounded-full font-bold shadow-lg shadow-brand-primary/30 transition-all flex items-center gap-2 mx-auto"
                    >
                        <i className="ph ph-chat-teardrop-text text-xl"></i>
                        {my_testimonial ? "Edit Testimoni Anda" : "Berikan Testimoni Anda"}
                    </button>
                </div>
            </section>

            {/* Testimonials Grid */}
            <section className="py-20 px-6 lg:px-20 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {testimonials.map((testimoni, idx) => (
                            <div key={testimoni.id} className="bg-brand-light/30 p-8 rounded-2xl custom-shadow border border-gray-100 hover:-translate-y-2 transition-transform duration-300" data-aos="fade-up" data-aos-delay={(idx % 3) * 100}>
                                <div className="flex text-yellow-400 mb-4">
                                    {[...Array(testimoni.rating)].map((_, i) => <i key={i} className="ph-fill ph-star"></i>)}
                                </div>
                                <p className="text-gray-700 mb-8 italic leading-relaxed text-lg relative">
                                    <span className="absolute -top-4 -left-2 text-4xl text-gray-200 font-serif">"</span>
                                    {testimoni.message}
                                    <span className="absolute -bottom-6 -right-2 text-4xl text-gray-200 font-serif">"</span>
                                </p>
                                <div className="flex items-center gap-4 mt-auto">
                                    <div className={`w-14 h-14 bg-${testimoni.avatar_color}-100 rounded-full flex items-center justify-center font-bold text-${testimoni.avatar_color}-600 text-xl shadow-sm border border-${testimoni.avatar_color}-200`}>
                                        {testimoni.avatar_initials || testimoni.name.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-lg">{testimoni.name}</h4>
                                        <p className="text-sm text-gray-500">{testimoni.institution}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {testimonials.length === 0 && (
                        <div className="text-center py-20">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400 text-4xl">
                                <i className="ph ph-chat-teardrop-slash"></i>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Belum Ada Testimoni</h3>
                            <p className="text-gray-500">Testimoni akan muncul di sini setelah ditambahkan oleh admin.</p>
                        </div>
                    )}
                </div>
            </section>

            <TestimonialFormModal 
                show={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
            />
        </PublicLayout>
    );
}
