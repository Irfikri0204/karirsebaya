import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';

export default function Welcome({
    auth,
    global_settings,
    usersCount,
    features,
    services,
    partners,
    testimonials
}: PageProps<{
    global_settings: Record<string, string>;
    usersCount: number;
    features: any[];
    services: any[];
    partners: any[];
    testimonials: any[];
}>) {
    return (
        <PublicLayout transparentNavbar={true}>
            <Head title="Welcome" />

            {/* Hero Section */}
            <section className="relative min-h-screen gradient-hero pt-32 pb-20 px-6 lg:px-20 flex items-center overflow-hidden">
                {/* Decorative Blobs */}
                <div className="absolute top-20 -left-20 w-96 h-96 bg-brand-accent/20 rounded-full blur-[100px] pulse-soft"></div>
                <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pulse-soft" style={{animationDelay: '1s'}}></div>
                <div className="absolute top-40 right-1/4 w-64 h-64 bg-pink-500/10 rounded-full blur-[80px]"></div>

                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10 w-full">
                    <div className="text-white pr-0 lg:pr-10">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/10 text-xs font-medium mb-6 backdrop-blur-md" data-aos="fade-up">
                            <span className="w-2 h-2 rounded-full bg-green-400"></span>
                            <span>Platform Konseling Karir #1</span>
                        </div>
                        
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold leading-tight mb-6" data-aos="fade-up" data-aos-delay="100">
                            {(global_settings?.['home_hero_title'] || 'Rencanakan Masa Depan Karirmu Bersama Kami').split(' ').slice(0, -2).join(' ')} <br />
                            <span className="text-gradient italic font-normal">
                                {(global_settings?.['home_hero_title'] || 'Rencanakan Masa Depan Karirmu Bersama Kami').split(' ').slice(-2).join(' ')}
                            </span>
                        </h1>
                        
                        <p className="text-white/80 text-lg mb-10 leading-relaxed max-w-lg" data-aos="fade-up" data-aos-delay="200">
                            {global_settings?.['home_hero_subtitle'] || 'Platform konseling karir teman sebaya yang menghubungkan mahasiswa dan lulusan baru dengan mentor berpengalaman untuk merancang jenjang karir yang mantap.'}
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-4 mb-16" data-aos="fade-up" data-aos-delay="300">
                            <a href="#" className="px-8 py-3.5 rounded-full bg-white text-brand-purple font-semibold hover:bg-gray-100 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                                Mulai Sekarang <i className="ph ph-arrow-right ml-1"></i>
                            </a>
                            <a href="#" className="px-8 py-3.5 rounded-full bg-transparent border border-white/30 text-white font-medium hover:bg-white/10 transition-all duration-300">
                                Pelajari Lebih Lanjut
                            </a>
                        </div>
                        
                        <div className="flex items-center gap-8 border-t border-white/10 pt-8" data-aos="fade-up" data-aos-delay="400">
                            <div>
                                <h4 className="text-3xl font-serif font-bold mb-1">
                                    {global_settings?.['stat_users_auto'] === '1' ? usersCount : global_settings?.['stat_users_manual']}
                                </h4>
                                <p className="text-xs text-white/60 uppercase tracking-wider">Pengguna Aktif</p>
                            </div>
                            <div className="w-px h-10 bg-white/10"></div>
                            <div>
                                <h4 className="text-3xl font-serif font-bold mb-1">{global_settings?.['stat_counselors']}</h4>
                                <p className="text-xs text-white/60 uppercase tracking-wider">Konselor Karir</p>
                            </div>
                            <div className="w-px h-10 bg-white/10"></div>
                            <div>
                                <h4 className="text-3xl font-serif font-bold mb-1">{global_settings?.['stat_careers']}</h4>
                                <p className="text-xs text-white/60 uppercase tracking-wider">Pilihan Karir</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="relative hidden lg:block" data-aos="fade-left" data-aos-duration="1000">
                        {/* Abstract Hero Illustration built with HTML/CSS */}
                        <div className="relative w-full aspect-square max-w-md mx-auto floating-anim">
                            <div className="absolute inset-0 bg-gradient-to-tr from-brand-accent/40 to-white/10 rounded-3xl rotate-3 backdrop-blur-sm border border-white/10"></div>
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-brand-purple/40 rounded-3xl -rotate-2 backdrop-blur-md border border-white/20 flex flex-col justify-between p-8 overflow-hidden">
                                
                                {/* Top elements */}
                                <div className="flex justify-between items-start">
                                    <div className="w-12 h-12 rounded-2xl bg-brand-accent flex items-center justify-center shadow-lg">
                                        <i className="ph ph-chats-circle text-2xl text-white"></i>
                                    </div>
                                    <div className="px-3 py-1 rounded-full bg-green-400/20 text-green-300 text-xs font-medium border border-green-400/30">
                                        Online
                                    </div>
                                </div>

                                {/* Center mock profile */}
                                <div className="text-center z-10 relative">
                                    <div className="w-24 h-24 mx-auto bg-gradient-to-br from-brand-light to-gray-300 rounded-full mb-4 border-4 border-white/20 shadow-xl overflow-hidden relative">
                                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-16 bg-brand-primary rounded-t-full"></div>
                                        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-10 h-10 bg-[#fcd5ce] rounded-full"></div>
                                    </div>
                                    <h3 className="text-white font-serif text-xl font-semibold mb-1">Konsultasi Live</h3>
                                    <p className="text-white/60 text-sm">Sedang berlangsung...</p>
                                </div>

                                {/* Bottom floating elements */}
                                <div className="relative h-20 w-full">
                                    <div className="absolute left-0 bottom-4 px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/10 text-white text-xs shadow-lg animate-[floating_4s_ease-in-out_infinite]">
                                        <i className="ph ph-sparkle text-yellow-400 mr-1"></i> Tips Interview
                                    </div>
                                    <div className="absolute right-0 top-0 px-4 py-2 bg-brand-primary/60 backdrop-blur-md rounded-lg border border-brand-accent/30 text-white text-xs shadow-lg animate-[floating_3.5s_ease-in-out_infinite_0.5s]">
                                        <i className="ph ph-file-text text-brand-light mr-1"></i> Review CV
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="tentang" className="py-24 px-6 lg:px-20 bg-brand-light">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                    
                    {/* Left Card */}
                    <div className="relative" data-aos="fade-right">
                        <div className="absolute inset-0 bg-brand-primary rounded-3xl rotate-3 opacity-20 blur-sm"></div>
                        <div className="relative bg-gradient-to-br from-[#4c1d95] to-[#7e22ce] p-10 rounded-3xl text-white shadow-2xl overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[40px]"></div>
                            
                            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20 mb-8">
                                <i className="ph ph-users-three text-3xl text-brand-light"></i>
                            </div>
                            
                            <h3 className="text-3xl font-serif font-bold mb-4">Konsultasi Sama Ahlinya</h3>
                            <p className="text-white/80 mb-8 leading-relaxed">
                                Dapatkan insight seputar dunia kerja, persiapan karir, dan arahan langsung dari mentor berpengalaman.
                            </p>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10 text-center">
                                    <h4 className="text-2xl font-bold font-serif mb-1">1 On 1</h4>
                                    <p className="text-xs text-white/70">Sesi Privat</p>
                                </div>
                                <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10 text-center">
                                    <h4 className="text-2xl font-bold font-serif mb-1">45 Min</h4>
                                    <p className="text-xs text-white/70">Durasi Ideal</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Content */}
                    <div data-aos="fade-left">
                        <p className="text-brand-primary font-semibold text-sm tracking-wider uppercase mb-3">{global_settings?.['about_subtitle']}</p>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6 leading-tight">
                            {(global_settings?.['about_title'] || '').split(' ').slice(0, -2).join(' ')} <span className="text-brand-primary italic">{(global_settings?.['about_title'] || '').split(' ').slice(-2).join(' ')}</span>
                        </h2>
                        
                        <p className="text-gray-600 mb-8 leading-relaxed text-lg">
                            {global_settings?.['about_desc1']}
                        </p>
                        
                        <p className="text-gray-600 mb-8 leading-relaxed">
                            {global_settings?.['about_desc2']}
                        </p>

                        <ul className="space-y-4 mb-10">
                            {global_settings?.['about_bullets'] ? JSON.parse(global_settings['about_bullets']).map((bullet: string, i: number) => (
                                <li key={i} className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <i className="ph ph-check text-green-600 text-sm font-bold"></i>
                                    </div>
                                    <span className="text-gray-700">{bullet}</span>
                                </li>
                            )) : null}
                        </ul>
                        
                        <a href="#" className="inline-flex items-center gap-2 text-brand-primary font-semibold hover:text-brand-purple transition-colors">
                            Kenali Kami Lebih Dekat <i className="ph ph-arrow-right"></i>
                        </a>
                    </div>
                    
                </div>
            </section>

            {/* Features / Beda dari platform lain */}
            <section id="fitur" className="py-24 px-6 lg:px-20 bg-brand-dark relative overflow-hidden">
                {/* Background Elements */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-primary/10 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-accent/10 rounded-full blur-[120px]"></div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center mb-16" data-aos="fade-up">
                        <p className="text-brand-accent font-medium text-sm tracking-widest uppercase mb-3 border border-brand-accent/30 inline-block px-4 py-1 rounded-full">Keunggulan Utama</p>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">Beda dari Platform Lain</h2>
                        <p className="text-white/70 max-w-2xl mx-auto text-lg">
                            Kenapa kamu harus memilih Karir Sebaya? Kami menawarkan pendekatan yang personal, terjangkau, dan sangat relevan dengan dinamika anak muda.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, idx) => (
                            <div key={feature.id} className="glass-card rounded-2xl p-8 glass-card-hover transition-all duration-300" data-aos="fade-up" data-aos-delay={(idx % 3) * 100 + 100}>
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-6 ${
                                    idx % 3 === 0 ? 'bg-pink-500/20 text-pink-400' : 
                                    idx % 3 === 1 ? 'bg-blue-500/20 text-blue-400' : 
                                    'bg-orange-500/20 text-orange-400'
                                }`}>
                                    <i className={`ph ${feature.icon}`}></i>
                                </div>
                                <h3 className="text-xl font-serif font-bold text-white mb-3">{feature.title}</h3>
                                <p className="text-white/60 text-sm leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Services */}
            <section className="py-24 px-6 lg:px-20 bg-brand-light">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16" data-aos="fade-up">
                        <p className="text-brand-primary font-semibold text-sm tracking-wider uppercase mb-3">Layanan Kami</p>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6">Semua yang Kamu Butuhkan</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                            Ada berbagai macam cara dan jalur bimbingan karir yang dirancang khusus untuk mahasiswa dan lulusan baru.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {services.map((service, idx) => (
                            <div key={service.id} className="bg-white rounded-3xl p-10 custom-shadow hover:-translate-y-2 transition-transform duration-300 border border-gray-100 relative overflow-hidden group" data-aos="fade-up" data-aos-delay={(idx % 2) * 100 + 100}>
                                {service.badge && (
                                    <div className="absolute top-0 right-0 bg-brand-light px-4 py-2 rounded-bl-2xl font-medium text-xs text-brand-primary">{service.badge}</div>
                                )}
                                <div className={`w-16 h-16 rounded-2xl text-white flex items-center justify-center text-3xl mb-6 shadow-lg shadow-purple-900/20`} style={{ backgroundColor: service.color_class?.includes('-') ? `var(--${service.color_class.replace('-600', '').replace('-500', '')}-500, ${service.color_class.replace('-600', '').replace('-500', '')})` : (service.color_class === 'brand-primary' ? 'var(--brand-primary)' : service.color_class) }}>
                                    <i className={`ph ${service.icon}`}></i>
                                </div>
                                <h3 className="text-2xl font-serif font-bold text-gray-900 mb-3">{service.title}</h3>
                                <p className="text-gray-600 mb-6 leading-relaxed">
                                    {service.description}
                                </p>
                                <a href="#" className="text-brand-primary font-semibold group-hover:text-brand-accent transition-colors flex items-center gap-1">
                                    Lihat Detail <i className="ph ph-arrow-right"></i>
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Partners */}
            <section className="py-20 px-6 lg:px-20 gradient-section border-y border-brand-purple/50">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-3xl font-serif font-bold text-white mb-10" data-aos="fade-up">Dipercaya oleh Institusi Terkemuka</h2>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6" data-aos="fade-up" data-aos-delay="100">
                        {partners.map(partner => (
                            <div key={partner.id} className="bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-md border border-white/10 rounded-xl h-24 flex flex-col items-center justify-center group cursor-pointer p-2">
                                {partner.logo_path ? (
                                    <img src={`/storage/${partner.logo_path}`} alt={partner.name} className="h-10 w-10 object-cover rounded-xl mb-2 group-hover:scale-110 transition-transform" />
                                ) : (
                                    <div className="w-10 h-10 bg-brand-primary rounded-full mb-2 flex items-center justify-center font-bold text-white text-xs group-hover:scale-110 transition-transform">{partner.name.substring(0, 2).toUpperCase()}</div>
                                )}
                                <span className="text-white/80 text-xs font-medium text-center line-clamp-1 w-full px-2">{partner.name}</span>
                            </div>
                        ))}
                    </div>
                    
                    <p className="text-white/50 text-sm mt-8" data-aos="fade-up" data-aos-delay="200">Dan puluhan universitas serta institusi lainnya di seluruh Indonesia.</p>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-24 px-6 lg:px-20 bg-brand-light">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16" data-aos="fade-up">
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6">Mahasiswa Sudah Merasakan <br /> Manfaatnya</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                            Lebih dari 1,000 mahasiswa dan fresh graduate telah menemukan arah karir yang tepat. Ini cerita mereka.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {testimonials.map((testimoni, idx) => (
                            <div key={testimoni.id} className="bg-white p-8 rounded-2xl custom-shadow border border-gray-100" data-aos="fade-up" data-aos-delay={(idx % 3) * 100 + 100}>
                                <div className="flex text-yellow-400 mb-4">
                                    {[...Array(testimoni.rating)].map((_, i) => <i key={i} className="ph-fill ph-star"></i>)}
                                </div>
                                <p className="text-gray-600 mb-8 italic line-clamp-4">"{testimoni.message}"</p>
                                <div className="flex items-center gap-3">
                                    <div className={`w-12 h-12 bg-${testimoni.avatar_color}-100 rounded-full flex items-center justify-center font-bold text-${testimoni.avatar_color}-600 text-lg`}>
                                        {testimoni.avatar_initials || testimoni.name.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 line-clamp-1">{testimoni.name}</h4>
                                        <p className="text-xs text-gray-500 line-clamp-1">{testimoni.institution}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 text-center" data-aos="fade-up">
                        <Link href={route('testimoni')} className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border-2 border-brand-primary text-brand-primary font-bold hover:bg-brand-primary hover:text-white transition-all duration-300">
                            Lihat Semua Testimoni <i className="ph ph-arrow-right"></i>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Call To Action */}
            <section className="py-20 px-6 lg:px-20 bg-brand-light pb-32">
                <div className="max-w-5xl mx-auto">
                    <div className="bg-brand-primary rounded-[3rem] p-12 md:p-16 text-center relative overflow-hidden custom-shadow" data-aos="zoom-in">
                        {/* decorative rings */}
                        <div className="absolute top-0 right-0 w-64 h-64 border-[30px] border-white/5 rounded-full translate-x-1/3 -translate-y-1/3"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 border-[20px] border-white/5 rounded-full -translate-x-1/3 translate-y-1/3"></div>
                        
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6 relative z-10">Siap Memulai Perjalanan Karirmu?</h2>
                        <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto relative z-10">
                            Jangan tunda lagi. Temukan mentor terbaikmu hari ini dan ambil langkah pertama menuju karir impian bersama Karir Sebaya.
                        </p>
                        <a href="#" className="inline-block px-10 py-4 rounded-full bg-white text-brand-primary font-bold hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-xl relative z-10">
                            Daftar Sekarang Secara Gratis
                        </a>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
