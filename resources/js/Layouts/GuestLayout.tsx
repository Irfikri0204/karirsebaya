import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="min-h-screen flex font-sans selection:bg-brand-accent selection:text-white">
            {/* Left Side: Branding / Visual */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-brand-dark overflow-hidden items-center justify-center">
                {/* Background Blobs */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-primary/20 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-accent/20 rounded-full blur-[80px] -translate-x-1/3 translate-y-1/3"></div>
                
                <div className="relative z-10 max-w-lg p-12">
                    <Link href="/" className="inline-flex items-center gap-3 mb-16">
                        <div className="w-12 h-12 rounded-full bg-brand-accent flex items-center justify-center shadow-lg">
                            <i className="ph ph-briefcase text-3xl text-white"></i>
                        </div>
                        <span className="text-3xl font-serif font-bold text-white tracking-wide">Karir Sebaya</span>
                    </Link>
                    
                    <h1 className="text-4xl font-serif font-bold text-white leading-tight mb-6">
                        Rencanakan <span className="text-brand-accent italic">Masa Depan</span> Karirmu Bersama Kami
                    </h1>
                    <p className="text-white/70 text-lg leading-relaxed mb-12">
                        Platform konseling karir nomor satu yang menghubungkan mahasiswa dan lulusan baru dengan mentor profesional.
                    </p>
                    
                    {/* Floating features */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10">
                            <div className="w-10 h-10 rounded-lg bg-green-500/20 text-green-400 flex items-center justify-center">
                                <i className="ph-fill ph-users-three text-xl"></i>
                            </div>
                            <div>
                                <h4 className="text-white font-bold text-sm">Konseling 1 on 1</h4>
                                <p className="text-white/50 text-xs">Diskusi mendalam secara privat</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10 translate-x-8">
                            <div className="w-10 h-10 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center">
                                <i className="ph-fill ph-compass text-xl"></i>
                            </div>
                            <div>
                                <h4 className="text-white font-bold text-sm">Asesmen Minat Bakat</h4>
                                <p className="text-white/50 text-xs">Pahami potensi terbaikmu</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side: Auth Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center bg-brand-light p-6 sm:p-12 relative">
                {/* Mobile Header (Only visible on small screens) */}
                <div className="lg:hidden absolute top-8 left-8">
                    <Link href="/" className="inline-flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center shadow-lg">
                            <i className="ph ph-briefcase text-xl text-white"></i>
                        </div>
                        <span className="text-xl font-serif font-bold text-gray-900 tracking-wide">Karir Sebaya</span>
                    </Link>
                </div>

                <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-gray-100">
                    {children}
                </div>
            </div>
        </div>
    );
}
