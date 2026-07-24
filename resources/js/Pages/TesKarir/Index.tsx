import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';

export default function TesKarir({ auth, global_settings }: PageProps) {
    const isLoggedIn = auth.user !== null;
    const testIsOpen = global_settings?.test_is_open === '1';

    return (
        <PublicLayout>
            <Head title="Tes Minat Karir - Karir Sebaya" />
            
            <div className="min-h-[80vh] bg-brand-light font-sans text-gray-800 flex items-center justify-center pt-24 pb-16 px-6 lg:px-20">
                <main className="max-w-7xl mx-auto w-full">
                    <div className="text-center mb-12">
                        <p className="text-brand-primary font-semibold text-sm tracking-wider uppercase mb-2">Asesmen Minat Bakat</p>
                        <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6">Tes Minat Karir</h1>
                        <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
                            Kenali lebih dalam kepribadian dan minat profesimu. Temukan jalur karir yang paling cocok dengan potensimu!
                        </p>
                    </div>

                    {!isLoggedIn ? (
                        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-10 md:p-14 text-center custom-shadow border border-gray-100 relative overflow-hidden">
                            {/* Decorative background elements */}
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-primary/5 rounded-full blur-2xl"></div>
                            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-brand-accent/10 rounded-full blur-2xl"></div>
                            
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                                <i className="ph ph-lock-key text-4xl text-gray-400"></i>
                            </div>
                            
                            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4 relative z-10">
                                Login untuk Memulai Tes
                            </h2>
                            <p className="text-gray-600 mb-8 relative z-10">
                                Untuk menyimpan hasil asesmen dan mendapatkan rekomendasi karir yang dipersonalisasi, silakan masuk atau daftar terlebih dahulu.
                            </p>
                            
                            <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
                                <Link href={route('login')} className="px-8 py-3 rounded-full bg-brand-primary text-white font-semibold hover:bg-brand-purple transition-colors shadow-lg shadow-purple-900/20">
                                    Masuk ke Akun
                                </Link>
                                <Link href={route('register')} className="px-8 py-3 rounded-full bg-white text-brand-primary font-semibold border border-brand-primary/30 hover:bg-gray-50 transition-colors">
                                    Daftar Gratis
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="max-w-4xl mx-auto">
                            {/* Test Introduction / Starting Point */}
                            <div className="bg-white rounded-3xl p-8 md:p-12 custom-shadow border border-gray-100 flex flex-col md:flex-row gap-10 items-center">
                                <div className="md:w-1/2">
                                    <div className="w-full aspect-square max-w-sm mx-auto bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl flex items-center justify-center border border-indigo-100 relative">
                                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                                        <i className="ph-fill ph-brain text-8xl text-brand-primary relative z-10 drop-shadow-lg animate-[floating_3s_ease-in-out_infinite]"></i>
                                    </div>
                                </div>
                                
                                <div className="md:w-1/2">
                                    <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">Instruksi Pengerjaan</h2>
                                    <ul className="space-y-4 mb-8 text-gray-600">
                                        {(() => {
                                            let instructions = [
                                                'Pilih jawaban yang paling mencerminkan dirimu yang sebenarnya, bukan yang menurutmu "baik" atau "ideal".',
                                                'Tidak ada jawaban benar atau salah dalam tes ini.',
                                                'Tes ini terdiri dari 42 pertanyaan singkat dan biasanya membutuhkan waktu 10-15 menit.'
                                            ];
                                            if (global_settings?.riasec_instruction) {
                                                try {
                                                    const parsed = JSON.parse(global_settings.riasec_instruction);
                                                    if (Array.isArray(parsed)) instructions = parsed;
                                                    else instructions = [global_settings.riasec_instruction];
                                                } catch {
                                                    instructions = [global_settings.riasec_instruction];
                                                }
                                            }
                                            return instructions.map((inst: string, idx: number) => (
                                                <li key={idx} className="flex gap-3">
                                                    <i className="ph-fill ph-check-circle text-green-500 text-xl shrink-0 mt-0.5"></i>
                                                    <span>{inst}</span>
                                                </li>
                                            ));
                                        })()}
                                    </ul>
                                    
                                    {testIsOpen ? (
                                        <div className="flex flex-col sm:flex-row gap-3 w-full">
                                            <Link href={route('tes-karir.create')} className="flex-1 py-4 rounded-xl bg-gradient-to-r from-brand-primary to-brand-accent text-white font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                                                Mulai Tes Sekarang <i className="ph ph-arrow-right"></i>
                                            </Link>
                                            <Link href={route('tes-karir.history')} className="sm:w-auto py-4 px-6 rounded-xl bg-gray-100 text-brand-primary font-bold text-lg border border-gray-200 hover:bg-gray-200 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 whitespace-nowrap">
                                                <i className="ph ph-clock-counter-clockwise"></i> Riwayat Tes
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="w-full py-4 rounded-xl bg-gray-100 text-gray-500 font-bold text-lg text-center flex items-center justify-center gap-2 border border-gray-200">
                                            <i className="ph ph-lock-key"></i> Tes Sedang Ditutup
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </PublicLayout>
    );
}
