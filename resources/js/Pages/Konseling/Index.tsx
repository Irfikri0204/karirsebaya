import { Head, usePage } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';

export default function Konseling() {
    const { global_settings } = usePage().props as any;
    
    // Mengambil Nomor WhatsApp dari settings atau menggunakan default
    const waNumber = global_settings?.contact_whatsapp || "6281122334455";
    const waMessage = encodeURIComponent("Halo Admin Karir Sebaya, saya ingin mengajukan sesi konseling.");
    const waLink = `https://wa.me/${waNumber}?text=${waMessage}`;

    // Parsing dynamic content
    const flows = global_settings?.counseling_flow 
        ? JSON.parse(global_settings.counseling_flow)
        : [
            { title: "Hubungi Admin", desc: "Klik tombol WhatsApp di halaman ini untuk terhubung langsung dengan tim admin kami. Sampaikan kebutuhan konseling Anda secara singkat." },
            { title: "Pilih Mentor & Jadwal", desc: "Admin akan memberikan katalog profil konselor beserta ketersediaan waktu mereka. Anda bebas memilih yang paling relevan dengan bidang Anda." },
            { title: "Konfirmasi & Pembayaran", desc: "Setelah jadwal disepakati, lakukan pembayaran sesuai paket yang dipilih. Link sesi (Google Meet/Zoom) akan dikirimkan H-1." },
            { title: "Sesi Konseling Berlangsung", desc: "Persiapkan CV, Portofolio, atau pertanyaan spesifik yang ingin didiskusikan agar waktu 45 menit Anda termanfaatkan dengan optimal." }
        ];

    const topics = global_settings?.counseling_topics
        ? JSON.parse(global_settings.counseling_topics)
        : [
            "Review Curriculum Vitae (CV)",
            "Persiapan & Simulasi Wawancara",
            "Perencanaan Transisi Karir (Switch Career)",
            "Eksplorasi Minat & Potensi Diri"
        ];

    return (
        <PublicLayout>
            <Head title="Pengajuan Konseling - Karir Sebaya" />
            
            <div className="pt-32 pb-24 px-6 lg:px-20 bg-brand-light font-sans min-h-screen">
                <div className="max-w-5xl mx-auto">
                    
                    <div className="text-center mb-16" data-aos="fade-up">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-brand-accent/20 rounded-full mb-6">
                            <i className="ph-fill ph-chats-circle text-4xl text-brand-primary"></i>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6">
                            {global_settings?.counseling_title || 'Pengajuan Konseling'}
                        </h1>
                        <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
                            {global_settings?.counseling_subtitle || 'Bicarakan kebuntuan karirmu langsung dengan para praktisi ahli dan konselor sebaya kami. Kami siap mendengarkan dan merancang peta jalan kesuksesanmu.'}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
                        {/* Tata Cara */}
                        <div data-aos="fade-right">
                            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">Alur Pengajuan</h2>
                            
                            <div className="space-y-8">
                                {flows.map((flow: any, index: number) => (
                                    <div key={index} className="flex gap-4">
                                        <div className="flex-shrink-0 w-12 h-12 bg-white rounded-xl flex items-center justify-center font-bold text-brand-primary text-xl custom-shadow">{index + 1}</div>
                                        <div>
                                            <h4 className="text-lg font-bold text-gray-900 mb-2">{flow.title}</h4>
                                            <p className="text-gray-600 text-sm leading-relaxed">{flow.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            {/* Pro Card */}
                            <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 relative group" data-aos="fade-up" data-aos-delay="100">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-bl-full"></div>
                                
                                <div className="p-8">
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">Siap untuk Memulai?</h3>
                                    <p className="text-gray-600 mb-8 text-sm leading-relaxed">
                                        Layanan pelanggan kami aktif pada hari <strong>Senin - Jumat (09:00 - 17:00 WIB)</strong>. Pesan yang masuk di luar jam kerja akan dibalas pada hari kerja berikutnya.
                                    </p>

                                    {topics.length > 0 && (
                                        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 mb-8">
                                            <h4 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wider">Pilihan Topik Konsultasi</h4>
                                            <ul className="space-y-3">
                                                {topics.map((topic: string, index: number) => (
                                                    <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                                                        <i className="ph-fill ph-check-circle text-brand-primary"></i> {topic}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    <a 
                                        href={waLink} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="w-full flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 py-3 sm:py-4 px-4 rounded-full bg-green-500 hover:bg-green-600 text-white font-bold transition-all shadow-lg shadow-green-500/20 text-sm sm:text-base text-center"
                                    >
                                        <i className="ph-fill ph-whatsapp-logo text-xl sm:text-2xl"></i>
                                        <span>Hubungi Kami via WhatsApp</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </PublicLayout>
    );
}
