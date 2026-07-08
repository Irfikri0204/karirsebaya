import { Link, usePage } from '@inertiajs/react';
import { ReactNode, useState } from 'react';

interface AdminLayoutProps {
    children: ReactNode;
    header?: string;
}

export default function AdminLayout({ children, header }: AdminLayoutProps) {
    const { auth, global_settings } = usePage().props as any;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans text-gray-800">
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-brand-dark text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {/* Sidebar Header */}
                <div className="h-16 flex items-center px-6 border-b border-white/10 shrink-0">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-brand-accent flex items-center justify-center shadow-lg overflow-hidden">
                            {global_settings?.navbar_icon ? (
                                <img src={global_settings.navbar_icon} alt="Logo" className="w-full h-full object-cover" />
                            ) : (
                                <i className="ph ph-briefcase text-white"></i>
                            )}
                        </div>
                        <span className="text-xl font-serif font-bold tracking-wide">Admin Panel</span>
                    </Link>
                </div>

                {/* Sidebar Links */}
                <div className="flex-grow overflow-y-auto py-6 px-4 space-y-2 custom-scrollbar">
                    <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Utama</p>
                    <Link href={route('admin.dashboard')} className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${route().current('admin.dashboard') ? 'bg-brand-primary text-white' : 'text-gray-300 hover:bg-white/10 hover:text-white'}`}>
                        <i className="ph ph-squares-four text-xl"></i>
                        Dashboard
                    </Link>
                    
                    <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mt-6 mb-2">Manajemen Konten</p>
                    {auth.user.role === 'superadmin' && (
                        <>
                            <Link href={route('admin.settings.index')} className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${route().current('admin.settings.*') ? 'bg-brand-primary text-white' : 'text-gray-300 hover:bg-white/10 hover:text-white'}`}>
                                <i className="ph ph-browser text-xl"></i>
                                Halaman Publik
                            </Link>
                            <Link href={route('admin.features.index')} className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${route().current('admin.features.*') ? 'bg-brand-primary text-white' : 'text-gray-300 hover:bg-white/10 hover:text-white'}`}>
                                <i className="ph ph-star text-xl"></i>
                                Keunggulan Utama
                            </Link>
                            <Link href={route('admin.services.index')} className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${route().current('admin.services.*') ? 'bg-brand-primary text-white' : 'text-gray-300 hover:bg-white/10 hover:text-white'}`}>
                                <i className="ph ph-briefcase text-xl"></i>
                                Layanan Kami
                            </Link>
                        </>
                    )}
                    <Link href={route('admin.partners.index')} className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${route().current('admin.partners.*') ? 'bg-brand-primary text-white' : 'text-gray-300 hover:bg-white/10 hover:text-white'}`}>
                        <i className="ph ph-buildings text-xl"></i>
                        Institusi Mitra
                    </Link>
                    <Link href={route('admin.testimonials.index')} className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${route().current('admin.testimonials.*') ? 'bg-brand-primary text-white' : 'text-gray-300 hover:bg-white/10 hover:text-white'}`}>
                        <i className="ph ph-chat-centered-text text-xl"></i>
                        Testimoni
                    </Link>
                    <Link href={route('admin.modules.index')} className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${route().current('admin.modules.*') ? 'bg-brand-primary text-white' : 'text-gray-300 hover:bg-white/10 hover:text-white'}`}>
                        <i className="ph ph-books text-xl"></i>
                        Modul Edukasi
                    </Link>
                    <Link href={route('admin.counseling-settings.index')} className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${route().current('admin.counseling-settings.*') ? 'bg-brand-primary text-white' : 'text-gray-300 hover:bg-white/10 hover:text-white'}`}>
                        <i className="ph ph-phone text-xl"></i>
                        Kontak & Panduan
                    </Link>
                    <Link href={route('admin.team-members.index')} className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${route().current('admin.team-members.*') ? 'bg-brand-primary text-white' : 'text-gray-300 hover:bg-white/10 hover:text-white'}`}>
                        <i className="ph ph-users-three text-xl"></i>
                        Tim & Konselor
                    </Link>

                    <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mt-6 mb-2">Instrumen Tes Minat</p>
                    <Link href={route('admin.riasec.results.index')} className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${route().current('admin.riasec.results.*') ? 'bg-brand-primary text-white' : 'text-gray-300 hover:bg-white/10 hover:text-white'}`}>
                        <i className="ph ph-chart-line-up text-xl"></i>
                        Data Hasil Tes
                    </Link>
                    {auth.user.role === 'superadmin' && (
                        <>
                            <Link href={route('admin.riasec.categories.index')} className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${route().current('admin.riasec.categories.*') ? 'bg-brand-primary text-white' : 'text-gray-300 hover:bg-white/10 hover:text-white'}`}>
                                <i className="ph ph-brain text-xl"></i>
                                Kategori & Hasil
                            </Link>
                            <Link href={route('admin.riasec.questions.index')} className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${route().current('admin.riasec.questions.*') ? 'bg-brand-primary text-white' : 'text-gray-300 hover:bg-white/10 hover:text-white'}`}>
                                <i className="ph ph-list-numbers text-xl"></i>
                                Bank Soal
                            </Link>
                        </>
                    )}


                    <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mt-6 mb-2">Pengguna</p>
                    <Link href={route('admin.users.index')} className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${route().current('admin.users.*') ? 'bg-brand-primary text-white' : 'text-gray-300 hover:bg-white/10 hover:text-white'}`}>
                        <i className="ph ph-users text-xl"></i>
                        Kelola Akun
                    </Link>
                </div>
                
                {/* Sidebar Footer */}
                <div className="p-4 border-t border-white/10 shrink-0">
                    <div className="flex items-center gap-3 px-3 py-2">
                        <div className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center font-bold">
                            {auth.user.name.charAt(0)}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold truncate">{auth.user.name}</p>
                            <p className="text-xs text-gray-400 truncate capitalize">{auth.user.role}</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 bg-gray-900/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)}></div>
            )}

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 h-screen lg:ml-64">
                {/* Topbar */}
                <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 sm:px-6 shrink-0 z-30">
                    <div className="flex items-center">
                        <button onClick={() => setSidebarOpen(true)} className="text-gray-500 hover:text-gray-700 lg:hidden mr-4">
                            <i className="ph ph-list text-2xl"></i>
                        </button>
                        <h1 className="text-xl font-bold text-gray-800">{header || 'Dashboard'}</h1>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <Link href="/" className="text-sm text-brand-primary font-medium hover:underline hidden sm:block">
                            Lihat Website <i className="ph ph-arrow-square-out ml-1"></i>
                        </Link>
                        <div className="w-px h-6 bg-gray-200 hidden sm:block"></div>
                        <Link href={route('logout')} method="post" as="button" className="text-sm text-gray-500 hover:text-red-500 font-medium transition-colors">
                            Logout
                        </Link>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
