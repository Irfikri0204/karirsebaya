import { Link, usePage } from '@inertiajs/react';
import { useEffect, useState, ReactNode } from 'react';
import Dropdown from '@/Components/Dropdown';
import AOS from 'aos';
import 'aos/dist/aos.css';

interface PublicLayoutProps {
    children: ReactNode;
    transparentNavbar?: boolean;
}

export default function PublicLayout({ children, transparentNavbar = false }: PublicLayoutProps) {
    const { auth, global_settings } = usePage().props as any;
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        // Initialize AOS
        AOS.init({
            once: true,
            offset: 50,
            duration: 800,
            easing: 'ease-out-cubic',
        });

        // Scroll listener for Navbar
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Refresh AOS when navigating via Inertia
    const { url } = usePage();
    useEffect(() => {
        AOS.refresh();
        setIsMobileMenuOpen(false); // Close mobile menu on navigation
    }, [url]);

    return (
        <div className="text-gray-800 antialiased overflow-x-hidden selection:bg-brand-accent selection:text-white flex flex-col min-h-screen">
            {/* Navbar */}
            <nav className={`w-full z-50 py-4 px-6 lg:px-20 text-white border-b transition-all duration-300 ${
                (isScrolled || !transparentNavbar) 
                    ? 'fixed top-0 bg-brand-dark/95 backdrop-blur-md shadow-lg py-3 border-white/10' 
                    : 'absolute bg-transparent border-transparent'
            }`}>
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <Link href={route('home')} className="flex items-center gap-2" data-aos="fade-down" data-aos-duration="800">
                        <div className="w-8 h-8 rounded-full bg-brand-accent flex items-center justify-center shadow-lg overflow-hidden border border-white/20">
                            {global_settings?.navbar_icon ? (
                                <img src={global_settings.navbar_icon} alt="Logo" className="w-full h-full object-cover" />
                            ) : (
                                <i className="ph ph-briefcase text-xl text-white"></i>
                            )}
                        </div>
                        <span className="text-xl font-semibold tracking-wide">Karir Sebaya</span>
                    </Link>
                    
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/80" data-aos="fade-down" data-aos-duration="800" data-aos-delay="100">
                        <Link href={route('home')} className="hover:text-brand-accent transition-colors">Home</Link>
                        <Link href={route('modul')} className="hover:text-white transition-colors">Modul</Link>
                        <Link href={route('tes-karir.index')} className="hover:text-white transition-colors">Tes Karir</Link>
                        <Link href={route('konseling')} className="hover:text-white transition-colors">Konseling</Link>
                        <Link href={route('testimoni')} className="hover:text-white transition-colors">Testimoni</Link>
                        <Link href={route('tim-kami')} className="hover:text-white transition-colors">Tim Kami</Link>
                        <Link href={route('panduan')} className="hover:text-white transition-colors">Panduan</Link>
                    </div>

                    <div className="hidden md:block" data-aos="fade-down" data-aos-duration="800" data-aos-delay="200">
                        {auth?.user ? (
                            <div className="relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 transition-all duration-300 text-sm font-medium backdrop-blur-md">
                                            <div className="w-6 h-6 bg-brand-primary rounded-full text-xs flex items-center justify-center font-bold">
                                                {auth.user.name ? auth.user.name.charAt(0) : 'U'}
                                            </div>
                                            {auth.user.name}
                                            <i className="ph ph-caret-down ml-1 text-xs"></i>
                                        </button>
                                    </Dropdown.Trigger>
                                    <Dropdown.Content contentClasses="bg-white rounded-xl shadow-lg mt-2 overflow-hidden w-48 text-gray-800">
                                        {(auth.user.role === 'admin' || auth.user.role === 'superadmin') && (
                                            <Dropdown.Link href={route('admin.dashboard')} className="hover:bg-gray-50 flex items-center gap-2 py-3 border-b border-gray-100">
                                                <i className="ph ph-squares-four text-lg text-brand-primary"></i> Dashboard Admin
                                            </Dropdown.Link>
                                        )}
                                        <Dropdown.Link href={route('profile.edit')} className="hover:bg-gray-50 flex items-center gap-2 py-3">
                                            <i className="ph ph-user text-lg text-brand-primary"></i> Profil Saya
                                        </Dropdown.Link>
                                        <Dropdown.Link href={route('logout')} method="post" as="button" className="hover:bg-gray-50 flex items-center gap-2 py-3 text-red-500 hover:text-red-600">
                                            <i className="ph ph-sign-out text-lg"></i> Logout
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        ) : (
                            <Link href={route('login')} className="px-6 py-2.5 rounded-full bg-brand-accent hover:bg-brand-primary transition-all text-sm font-medium shadow-lg shadow-purple-900/20">
                                Masuk / Daftar
                            </Link>
                        )}
                    </div>
                    
                    {/* Mobile Menu Toggle */}
                    <button 
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden text-2xl text-white hover:text-brand-accent transition-colors"
                    >
                        <i className={`ph ${isMobileMenuOpen ? 'ph-x' : 'ph-list'}`}></i>
                    </button>
                </div>

                {/* Mobile Menu Content */}
                <div className={`md:hidden absolute top-full left-0 right-0 bg-brand-dark/95 backdrop-blur-xl border-b border-white/10 shadow-2xl transition-all duration-300 ${
                    isMobileMenuOpen ? 'max-h-[85vh] overflow-y-auto py-4' : 'max-h-0 overflow-hidden py-0 border-transparent'
                }`}>
                    <div className="flex flex-col px-6 space-y-4 text-center">
                        <Link href={route('home')} className="text-white hover:text-brand-accent transition-colors py-2 border-b border-white/5">Home</Link>
                        <Link href={route('modul')} className="text-white hover:text-brand-accent transition-colors py-2 border-b border-white/5">Modul</Link>
                        <Link href={route('tes-karir.index')} className="text-white hover:text-brand-accent transition-colors py-2 border-b border-white/5">Tes Karir</Link>
                        <Link href={route('konseling')} className="text-white hover:text-brand-accent transition-colors py-2 border-b border-white/5">Konseling</Link>
                        <Link href={route('testimoni')} className="text-white hover:text-brand-accent transition-colors py-2 border-b border-white/5">Testimoni</Link>
                        <Link href={route('tim-kami')} className="text-white hover:text-brand-accent transition-colors py-2 border-b border-white/5">Tim Kami</Link>
                        <Link href={route('panduan')} className="text-white hover:text-brand-accent transition-colors py-2 border-b border-white/5">Panduan</Link>
                        
                        <div className="pt-4 pb-2 flex justify-center">
                            {auth?.user ? (
                                <div className="flex flex-col gap-3 w-full max-w-xs">
                                    {(auth.user.role === 'admin' || auth.user.role === 'superadmin') && (
                                        <Link href={route('admin.dashboard')} className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors">
                                            <i className="ph ph-squares-four text-lg"></i> Dashboard Admin
                                        </Link>
                                    )}
                                    <Link href={route('profile.edit')} className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors">
                                        <i className="ph ph-user text-lg"></i> Profil Saya
                                    </Link>
                                    <Link href={route('logout')} method="post" as="button" className="flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors">
                                        <i className="ph ph-sign-out text-lg"></i> Logout
                                    </Link>
                                </div>
                            ) : (
                                <Link href={route('login')} className="w-full max-w-xs py-3 rounded-xl bg-brand-accent hover:bg-brand-primary text-white font-bold transition-colors">
                                    Masuk / Daftar
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-grow">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-brand-dark pt-20 pb-10 px-6 lg:px-20 border-t border-white/5 relative z-10">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">
                    
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 rounded-full bg-brand-accent flex items-center justify-center overflow-hidden">
                                {global_settings?.navbar_icon ? (
                                    <img src={global_settings.navbar_icon} alt="Logo" className="w-full h-full object-cover" />
                                ) : (
                                    <i className="ph ph-briefcase text-xl text-white"></i>
                                )}
                            </div>
                            <span className="text-2xl font-serif font-bold text-white">Karir Sebaya</span>
                        </div>
                        <p className="text-white/60 mb-8 max-w-sm leading-relaxed">
                            {global_settings?.footer_about || 'Platform konseling karir teman sebaya yang menghubungkan mahasiswa dan lulusan baru dengan mentor berpengalaman.'}
                        </p>
                        <div className="flex gap-4">
                            {global_settings?.social_ig && (
                                <a href={global_settings.social_ig} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 hover:bg-brand-primary flex items-center justify-center text-white/60 hover:text-white transition-colors border border-white/10">
                                    <i className="ph ph-instagram-logo text-xl"></i>
                                </a>
                            )}
                            {global_settings?.social_linkedin && (
                                <a href={global_settings.social_linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 hover:bg-brand-primary flex items-center justify-center text-white/60 hover:text-white transition-colors border border-white/10">
                                    <i className="ph ph-linkedin-logo text-xl"></i>
                                </a>
                            )}
                            {global_settings?.social_twitter && (
                                <a href={global_settings.social_twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 hover:bg-brand-primary flex items-center justify-center text-white/60 hover:text-white transition-colors border border-white/10">
                                    <i className="ph ph-twitter-logo text-xl"></i>
                                </a>
                            )}
                            {global_settings?.social_youtube && (
                                <a href={global_settings.social_youtube} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 hover:bg-brand-primary flex items-center justify-center text-white/60 hover:text-white transition-colors border border-white/10">
                                    <i className="ph ph-youtube-logo text-xl"></i>
                                </a>
                            )}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Platform</h4>
                        <ul className="space-y-4">
                            <li><Link href={route('modul')} className="text-white/60 hover:text-white transition-colors text-sm">Modul Karir</Link></li>
                            <li><Link href={route('konseling')} className="text-white/60 hover:text-white transition-colors text-sm">Konseling</Link></li>
                            <li><Link href={route('tes-karir.index')} className="text-white/60 hover:text-white transition-colors text-sm">Tes Potensi</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Informasi</h4>
                        <ul className="space-y-4">
                            <li><Link href={route('panduan')} className="text-white/60 hover:text-white transition-colors text-sm">Panduan Pengguna</Link></li>
                            <li><Link href={route('tim-kami')} className="text-white/60 hover:text-white transition-colors text-sm">Tim Kami</Link></li>
                            <li><Link href={route('testimoni')} className="text-white/60 hover:text-white transition-colors text-sm">Testimoni</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Kontak</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <i className="ph ph-envelope-simple text-brand-accent mt-1"></i>
                                <span className="text-white/60 text-sm">{global_settings?.contact_email || 'halo@karirsebaya.id'}</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <i className="ph ph-whatsapp-logo text-brand-accent mt-1"></i>
                                <span className="text-white/60 text-sm">+{global_settings?.contact_whatsapp || '6281122334455'}</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <i className="ph ph-map-pin text-brand-accent mt-1"></i>
                                <span className="text-white/60 text-sm whitespace-pre-wrap">{global_settings?.footer_address || 'Jl. Pendidikan No. 123, Jakarta Selatan, 12345, Indonesia'}</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-white/40 text-sm">© 2026 Karir Sebaya. All rights reserved.</p>
                    <p className="text-white/40 text-sm flex items-center gap-1">Dibuat dengan <i className="ph-fill ph-heart text-red-500"></i> di Indonesia</p>
                </div>
            </footer>
        </div>
    );
}
