import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { FormEventHandler } from 'react';

interface SettingsProps {
    settings: Record<string, string>;
}

export default function SettingsIndex({ settings }: SettingsProps) {
    const initialFlow = settings.counseling_flow 
        ? JSON.parse(settings.counseling_flow)
        : [
            { title: "Hubungi Admin", desc: "Klik tombol WhatsApp yang tersedia di halaman ini untuk memulai percakapan dengan admin Karir Sebaya." },
            { title: "Pilih Mentor & Jadwal", desc: "Admin akan memberikan daftar konselor dan jadwal yang tersedia. Silakan pilih sesuai kebutuhan Anda." },
            { title: "Konfirmasi & Pembayaran", desc: "Setelah jadwal disepakati, selesaikan pembayaran untuk mengkonfirmasi sesi konseling Anda." },
            { title: "Sesi Konseling Berlangsung", desc: "Persiapkan CV atau dokumen terkait, lalu mulai sesi diskusi via online meeting di waktu yang telah ditentukan." }
        ];
        
    const initialTopics = settings.counseling_topics
        ? JSON.parse(settings.counseling_topics)
        : [
            "Review Curriculum Vitae (CV)",
            "Persiapan & Simulasi Wawancara",
            "Perencanaan Transisi Karir (Switch Career)",
            "Eksplorasi Minat & Potensi Diri",
            "Strategi Negosiasi Gaji"
        ];

    const initialRiasecInstructions = settings.riasec_instruction
        ? (() => {
            try {
                const parsed = JSON.parse(settings.riasec_instruction);
                return Array.isArray(parsed) ? parsed : [settings.riasec_instruction];
            } catch {
                return [settings.riasec_instruction];
            }
        })()
        : [
            'Pilih jawaban yang paling mencerminkan dirimu yang sebenarnya, bukan yang menurutmu "baik" atau "ideal".',
            'Tidak ada jawaban benar atau salah dalam tes ini.',
            'Tes ini terdiri dari 42 pertanyaan singkat dan biasanya membutuhkan waktu 10-15 menit.'
        ];

    const { data, setData, post, processing, recentlySuccessful } = useForm({
        contact_whatsapp: settings.contact_whatsapp || '',
        contact_email: settings.contact_email || '',
        home_hero_title: settings.home_hero_title || '',
        home_hero_subtitle: settings.home_hero_subtitle || '',
        counseling_title: settings.counseling_title || '',
        counseling_subtitle: settings.counseling_subtitle || '',
        counseling_flow: initialFlow as {title: string, desc: string}[],
        counseling_topics: initialTopics as string[],
        test_is_open: settings.test_is_open || '0',
        stat_users_auto: settings.stat_users_auto === '1',
        stat_users_manual: settings.stat_users_manual || '',
        stat_counselors_auto: settings.stat_counselors_auto === '1',
        stat_counselors: settings.stat_counselors || '',
        visitor_count_auto: settings.visitor_count_auto === '1',
        visitor_count_start: settings.visitor_count_start || '0',
        stat_careers: settings.stat_careers || '',
        about_title: settings.about_title || '',
        about_subtitle: settings.about_subtitle || '',
        about_desc1: settings.about_desc1 || '',
        about_desc2: settings.about_desc2 || '',
        testimonial_mode: settings.testimonial_mode || 'auto',
        navbar_icon: null as File | null,
        favicon: null as File | null,
        footer_image: null as File | null,
        remove_navbar_icon: false,
        remove_favicon: false,
        remove_footer_image: false,
        riasec_instruction: initialRiasecInstructions as string[],
        riasec_show_figures: settings.riasec_show_figures === '1',
        footer_about: settings.footer_about || 'Platform konseling karir teman sebaya yang menghubungkan mahasiswa dan lulusan baru dengan mentor berpengalaman.',
        footer_address: settings.footer_address || 'Jl. Pendidikan No. 123, Jakarta Selatan, 12345, Indonesia',
        social_ig: settings.social_ig || '',
        social_linkedin: settings.social_linkedin || '',
        social_twitter: settings.social_twitter || '',
        social_youtube: settings.social_youtube || '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('admin.settings.update'));
    };

    // Handlers for counseling_flow array
    const addFlow = () => {
        setData('counseling_flow', [...data.counseling_flow, { title: '', desc: '' }]);
    };
    const removeFlow = (index: number) => {
        const newFlow = [...data.counseling_flow];
        newFlow.splice(index, 1);
        setData('counseling_flow', newFlow);
    };
    const updateFlow = (index: number, key: 'title'|'desc', value: string) => {
        const newFlow = [...data.counseling_flow];
        newFlow[index][key] = value;
        setData('counseling_flow', newFlow);
    };

    // Handlers for counseling_topics array
    const addTopic = () => {
        setData('counseling_topics', [...data.counseling_topics, '']);
    };
    const removeTopic = (index: number) => {
        const newTopics = [...data.counseling_topics];
        newTopics.splice(index, 1);
        setData('counseling_topics', newTopics);
    };
    const updateTopic = (index: number, value: string) => {
        const newTopics = [...data.counseling_topics];
        newTopics[index] = value;
        setData('counseling_topics', newTopics);
    };

    // Handlers for riasec_instruction array
    const addInstruction = () => {
        setData('riasec_instruction', [...data.riasec_instruction, '']);
    };
    const removeInstruction = (index: number) => {
        const newInstructions = [...data.riasec_instruction];
        newInstructions.splice(index, 1);
        setData('riasec_instruction', newInstructions);
    };
    const updateInstruction = (index: number, value: string) => {
        const newInstructions = [...data.riasec_instruction];
        newInstructions[index] = value;
        setData('riasec_instruction', newInstructions);
    };

    return (
        <AdminLayout header="Pengaturan Konten Publik">
            <Head title="Pengaturan - Admin Karir Sebaya" />

            <div className="max-w-4xl">
                {recentlySuccessful && (
                    <div className="mb-6 bg-green-50 text-green-700 p-4 rounded-xl border border-green-200 flex items-center gap-3">
                        <i className="ph-fill ph-check-circle text-xl"></i>
                        <span className="font-medium">Pengaturan berhasil diperbarui.</span>
                    </div>
                )}

                <form onSubmit={submit} className="space-y-8">
                    
                    {/* Section Kontak */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
                            <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                                <i className="ph-fill ph-address-book text-brand-primary"></i> Kontak & Informasi
                            </h3>
                            <p className="text-gray-500 text-sm mt-1">Informasi yang ditampilkan di bagian footer dan halaman lain.</p>
                        </div>
                        <div className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Nomor WhatsApp Utama & Konseling (Gunakan awalan 62)</label>
                                <input 
                                    type="text" 
                                    value={data.contact_whatsapp} 
                                    onChange={e => setData('contact_whatsapp', e.target.value)}
                                    className="w-full rounded-xl border-gray-300 focus:border-brand-primary focus:ring-brand-primary shadow-sm"
                                    placeholder="Contoh: 6281122334455"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email Publik</label>
                                <input 
                                    type="email" 
                                    value={data.contact_email} 
                                    onChange={e => setData('contact_email', e.target.value)}
                                    className="w-full rounded-xl border-gray-300 focus:border-brand-primary focus:ring-brand-primary shadow-sm"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section Beranda */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
                            <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                                <i className="ph-fill ph-house text-brand-primary"></i> Halaman Beranda
                            </h3>
                            <p className="text-gray-500 text-sm mt-1">Sesuaikan teks yang pertama kali dilihat oleh pengunjung.</p>
                        </div>
                        <div className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Judul Utama (Hero Section)</label>
                                <input 
                                    type="text" 
                                    value={data.home_hero_title} 
                                    onChange={e => setData('home_hero_title', e.target.value)}
                                    className="w-full rounded-xl border-gray-300 focus:border-brand-primary focus:ring-brand-primary shadow-sm"
                                />
                                <p className="text-xs text-gray-500 mt-1">Dua kata terakhir akan dicetak miring dan menggunakan warna gradien.</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Sub-judul / Deskripsi Singkat</label>
                                <textarea 
                                    rows={3}
                                    value={data.home_hero_subtitle} 
                                    onChange={e => setData('home_hero_subtitle', e.target.value)}
                                    className="w-full rounded-xl border-gray-300 focus:border-brand-primary focus:ring-brand-primary shadow-sm resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section Konseling */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
                            <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                                <i className="ph-fill ph-chats text-brand-primary"></i> Halaman Pengajuan Konseling
                            </h3>
                        </div>
                        <div className="p-6 space-y-8">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Judul Halaman</label>
                                    <input 
                                        type="text" 
                                        value={data.counseling_title} 
                                        onChange={e => setData('counseling_title', e.target.value)}
                                        className="w-full rounded-xl border-gray-300 focus:border-brand-primary focus:ring-brand-primary shadow-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi Halaman</label>
                                    <textarea 
                                        rows={3}
                                        value={data.counseling_subtitle} 
                                        onChange={e => setData('counseling_subtitle', e.target.value)}
                                        className="w-full rounded-xl border-gray-300 focus:border-brand-primary focus:ring-brand-primary shadow-sm resize-none"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-100">
                                <div className="flex justify-between items-center mb-4">
                                    <label className="block text-sm font-bold text-gray-800">Alur Pengajuan Konseling (Langkah-langkah)</label>
                                    <button type="button" onClick={addFlow} className="text-xs font-bold text-brand-primary bg-brand-light px-3 py-1.5 rounded-lg hover:bg-brand-primary hover:text-white transition-colors">
                                        + Tambah Langkah
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    {data.counseling_flow.map((flow, index) => (
                                        <div key={index} className="flex gap-4 items-start bg-gray-50 p-4 rounded-xl border border-gray-200 relative group">
                                            <div className="w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold shrink-0">
                                                {index + 1}
                                            </div>
                                            <div className="flex-1 space-y-3">
                                                <input 
                                                    type="text" 
                                                    value={flow.title} 
                                                    onChange={e => updateFlow(index, 'title', e.target.value)}
                                                    className="w-full text-sm rounded-lg border-gray-300 focus:border-brand-primary focus:ring-brand-primary"
                                                    placeholder="Judul Langkah (contoh: Hubungi Admin)"
                                                />
                                                <textarea 
                                                    rows={2}
                                                    value={flow.desc} 
                                                    onChange={e => updateFlow(index, 'desc', e.target.value)}
                                                    className="w-full text-sm rounded-lg border-gray-300 focus:border-brand-primary focus:ring-brand-primary resize-none"
                                                    placeholder="Deskripsi langkah..."
                                                />
                                            </div>
                                            <button 
                                                type="button"
                                                onClick={() => removeFlow(index)}
                                                className="text-gray-400 hover:text-red-500 absolute top-4 right-4"
                                            >
                                                <i className="ph ph-trash text-lg"></i>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-100">
                                <div className="flex justify-between items-center mb-4">
                                    <label className="block text-sm font-bold text-gray-800">Pilihan Topik Konseling</label>
                                    <button type="button" onClick={addTopic} className="text-xs font-bold text-brand-primary bg-brand-light px-3 py-1.5 rounded-lg hover:bg-brand-primary hover:text-white transition-colors">
                                        + Tambah Topik
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {data.counseling_topics.map((topic, index) => (
                                        <div key={index} className="flex gap-3 items-center">
                                            <i className="ph-fill ph-check-circle text-brand-primary text-lg"></i>
                                            <input 
                                                type="text" 
                                                value={topic} 
                                                onChange={e => updateTopic(index, e.target.value)}
                                                className="flex-1 text-sm rounded-lg border-gray-300 focus:border-brand-primary focus:ring-brand-primary"
                                                placeholder="Topik Konseling (contoh: Review CV)"
                                            />
                                            <button 
                                                type="button"
                                                onClick={() => removeTopic(index)}
                                                className="text-gray-400 hover:text-red-500 p-2"
                                            >
                                                <i className="ph ph-trash text-lg"></i>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section Statistik Beranda */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
                            <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                                <i className="ph-fill ph-chart-bar text-brand-primary"></i> Statistik Beranda
                            </h3>
                            <p className="text-gray-500 text-sm mt-1">Atur angka statistik yang tampil di halaman utama.</p>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="flex flex-col gap-3 p-4 border rounded-xl bg-gray-50">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        checked={data.stat_users_auto} 
                                        onChange={e => setData('stat_users_auto', e.target.checked)}
                                        className="rounded text-brand-primary focus:ring-brand-primary w-5 h-5"
                                    />
                                    <span className="font-bold text-gray-900">Hitung Jumlah Pengguna Aktif Secara Otomatis</span>
                                </label>
                                <p className="text-sm text-gray-500 ml-8">Jika dicentang, angka yang tampil adalah jumlah riil akun *User* yang terdaftar.</p>
                            </div>

                            {!data.stat_users_auto && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Jumlah Pengguna Aktif (Manual)</label>
                                    <input 
                                        type="text" 
                                        value={data.stat_users_manual} 
                                        onChange={e => setData('stat_users_manual', e.target.value)}
                                        className="w-full rounded-xl border-gray-300 focus:border-brand-primary focus:ring-brand-primary shadow-sm"
                                        placeholder="Contoh: 1,000+"
                                    />
                                </div>
                            )}

                            <div className="flex flex-col gap-3 p-4 border rounded-xl bg-gray-50 mt-4">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        checked={data.stat_counselors_auto} 
                                        onChange={e => setData('stat_counselors_auto', e.target.checked)}
                                        className="rounded text-brand-primary focus:ring-brand-primary w-5 h-5"
                                    />
                                    <span className="font-bold text-gray-900">Hitung Jumlah Konselor Secara Otomatis</span>
                                </label>
                                <p className="text-sm text-gray-500 ml-8">Jika dicentang, akan menghitung total anggota tim dengan kategori Konselor Ahli dan Konselor Sebaya.</p>
                            </div>

                            <div className="grid grid-cols-2 gap-6 mt-4">
                                {!data.stat_counselors_auto && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Jumlah Konselor Karir (Manual)</label>
                                        <input 
                                            type="text" 
                                            value={data.stat_counselors} 
                                            onChange={e => setData('stat_counselors', e.target.value)}
                                            className="w-full rounded-xl border-gray-300 focus:border-brand-primary focus:ring-brand-primary shadow-sm"
                                            placeholder="Contoh: 50+"
                                        />
                                    </div>
                                )}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Pilihan Karir</label>
                                    <input 
                                        type="text" 
                                        value={data.stat_careers} 
                                        onChange={e => setData('stat_careers', e.target.value)}
                                        className="w-full rounded-xl border-gray-300 focus:border-brand-primary focus:ring-brand-primary shadow-sm"
                                        placeholder="Contoh: 15+"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section Pengunjung */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
                            <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                                <i className="ph-fill ph-users text-brand-primary"></i> Statistik Pengunjung
                            </h3>
                            <p className="text-gray-500 text-sm mt-1">Atur nilai awal counter pengunjung website.</p>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="flex flex-col gap-3 p-4 border rounded-xl bg-gray-50">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        checked={data.visitor_count_auto} 
                                        onChange={e => setData('visitor_count_auto', e.target.checked)}
                                        className="rounded text-brand-primary focus:ring-brand-primary w-5 h-5"
                                    />
                                    <span className="font-bold text-gray-900">Hitung Secara Otomatis (Tanpa Rekayasa)</span>
                                </label>
                                <p className="text-sm text-gray-500 ml-8">Jika dicentang, angka yang tampil adalah jumlah kunjungan riil yang tercatat sistem.</p>
                            </div>
                            
                            {!data.visitor_count_auto && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Nilai Awal (Start Value) Counter Pengunjung</label>
                                    <input 
                                        type="number" 
                                        value={data.visitor_count_start} 
                                        onChange={e => setData('visitor_count_start', e.target.value)}
                                        className="w-full md:w-1/2 rounded-xl border-gray-300 focus:border-brand-primary focus:ring-brand-primary shadow-sm"
                                        placeholder="Contoh: 1000"
                                    />
                                    <p className="text-xs text-gray-500 mt-2">Total pengunjung yang tampil = Nilai Awal ini + Jumlah kunjungan riil.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Section Tentang Platform */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
                            <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                                <i className="ph-fill ph-info text-brand-primary"></i> Tentang Platform
                            </h3>
                            <p className="text-gray-500 text-sm mt-1">Ubah teks di bagian Tentang Platform Kami.</p>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Label Kecil (Sub-judul)</label>
                                    <input 
                                        type="text" 
                                        value={data.about_subtitle} 
                                        onChange={e => setData('about_subtitle', e.target.value)}
                                        className="w-full rounded-xl border-gray-300 focus:border-brand-primary focus:ring-brand-primary shadow-sm uppercase"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Judul Utama</label>
                                    <input 
                                        type="text" 
                                        value={data.about_title} 
                                        onChange={e => setData('about_title', e.target.value)}
                                        className="w-full rounded-xl border-gray-300 focus:border-brand-primary focus:ring-brand-primary shadow-sm"
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Paragraf 1</label>
                                <textarea 
                                    rows={4}
                                    value={data.about_desc1} 
                                    onChange={e => setData('about_desc1', e.target.value)}
                                    className="w-full rounded-xl border-gray-300 focus:border-brand-primary focus:ring-brand-primary shadow-sm resize-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Paragraf 2</label>
                                <textarea 
                                    rows={4}
                                    value={data.about_desc2} 
                                    onChange={e => setData('about_desc2', e.target.value)}
                                    className="w-full rounded-xl border-gray-300 focus:border-brand-primary focus:ring-brand-primary shadow-sm resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section Mode Testimoni */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
                            <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                                <i className="ph-fill ph-chat-centered-text text-brand-primary"></i> Mode Testimoni Beranda
                            </h3>
                            <p className="text-gray-500 text-sm mt-1">Tentukan bagaimana testimoni dipilih untuk tampil di Beranda.</p>
                        </div>
                        <div className="p-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Sistem Pilihan Testimoni</label>
                            <select 
                                value={data.testimonial_mode} 
                                onChange={e => setData('testimonial_mode', e.target.value)}
                                className="w-full rounded-xl border-gray-300 focus:border-brand-primary focus:ring-brand-primary shadow-sm"
                            >
                                <option value="auto">Otomatis (Tampilkan 8 Testimoni Terbaru)</option>
                                <option value="manual">Manual (Tampilkan hanya Testimoni yang ditandai 'Pilihan')</option>
                            </select>
                            <p className="text-xs text-gray-500 mt-2">Mode manual memungkinkan Anda mengkurasi secara spesifik testimoni mana yang tampil di Beranda via menu Kelola Testimoni.</p>
                        </div>
                    </div>

                    {/* Section Tes Karir RIASEC */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
                            <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                                <i className="ph-fill ph-brain text-brand-primary"></i> Pengaturan Tes Minat Karir
                            </h3>
                        </div>
                        <div className="p-6 space-y-6">
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <label className="block text-sm font-bold text-gray-800">Instruksi Pengisian Tes</label>
                                    <button type="button" onClick={addInstruction} className="text-xs font-bold text-brand-primary bg-brand-light px-3 py-1.5 rounded-lg hover:bg-brand-primary hover:text-white transition-colors">
                                        + Tambah Instruksi
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {data.riasec_instruction.map((inst, index) => (
                                        <div key={index} className="flex gap-3 items-start">
                                            <div className="w-6 h-6 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold shrink-0 mt-1 text-xs">
                                                {index + 1}
                                            </div>
                                            <textarea 
                                                rows={2}
                                                value={inst} 
                                                onChange={e => updateInstruction(index, e.target.value)}
                                                className="flex-1 text-sm rounded-lg border-gray-300 focus:border-brand-primary focus:ring-brand-primary resize-none"
                                                placeholder="Tulis instruksi..."
                                            />
                                            <button 
                                                type="button"
                                                onClick={() => removeInstruction(index)}
                                                className="text-gray-400 hover:text-red-500 p-2 mt-1"
                                            >
                                                <i className="ph ph-trash text-lg"></i>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex flex-col gap-3 p-4 border rounded-xl bg-gray-50">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        checked={data.riasec_show_figures} 
                                        onChange={e => setData('riasec_show_figures', e.target.checked)}
                                        className="rounded text-brand-primary focus:ring-brand-primary w-5 h-5"
                                    />
                                    <span className="font-bold text-gray-900">Tampilkan Tokoh Terkenal (Inspiring Figures) di Hasil Tes</span>
                                </label>
                                <p className="text-sm text-gray-500 ml-8">Jika dicentang, hasil tes tiap aspek akan menampilkan contoh tokoh terkenal terkait.</p>
                            </div>
                        </div>
                    </div>

                    {/* Section Ikon dan Favicon */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
                            <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                                <i className="ph-fill ph-image text-brand-primary"></i> Pengaturan Ikon (Branding)
                            </h3>
                            <p className="text-gray-500 text-sm mt-1">Ubah ikon navbar dan favicon website.</p>
                        </div>
                        <div className="p-6 space-y-6">
                            {/* Navbar Icon */}
                            <div>
                                {settings.navbar_icon && !data.remove_navbar_icon && (
                                    <div className="mb-4 p-4 border border-gray-200 rounded-xl bg-gray-50 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full border border-gray-200 bg-white flex items-center justify-center overflow-hidden shadow-sm">
                                                <img src={settings.navbar_icon} alt="Navbar Icon" className="w-full h-full object-contain" />
                                            </div>
                                            <div>
                                                <span className="block text-sm font-bold text-gray-800">Ikon Navbar Kustom Aktif</span>
                                                <span className="block text-xs text-gray-500 mt-0.5">Ikon koper bawaan telah diganti.</span>
                                            </div>
                                        </div>
                                        <button 
                                            type="button" 
                                            onClick={() => setData('remove_navbar_icon', true)}
                                            className="text-red-500 hover:text-red-600 hover:bg-red-50 text-sm font-bold px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-red-100"
                                        >
                                            Hapus Ikon (Kembali ke Default)
                                        </button>
                                    </div>
                                )}
                                <label className="block text-sm font-medium text-gray-700 mb-2">Unggah Ikon Navbar Baru (Disarankan kotak, max 1MB)</label>
                                <input 
                                    type="file" 
                                    accept="image/png, image/jpeg, image/svg+xml"
                                    onChange={e => {
                                        setData('navbar_icon', e.target.files?.[0] || null);
                                        if (e.target.files?.[0]) setData('remove_navbar_icon', false);
                                    }}
                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-light file:text-brand-primary hover:file:bg-brand-primary hover:file:text-white transition-all cursor-pointer"
                                />
                            </div>

                            {/* Favicon */}
                            <div className="pt-4 border-t border-gray-100">
                                {settings.favicon && !data.remove_favicon && (
                                    <div className="mb-4 p-4 border border-gray-200 rounded-xl bg-gray-50 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-8 h-8 rounded border border-gray-200 bg-white flex items-center justify-center overflow-hidden shadow-sm">
                                                <img src={settings.favicon} alt="Favicon" className="w-full h-full object-contain" />
                                            </div>
                                            <div>
                                                <span className="block text-sm font-bold text-gray-800">Favicon Kustom Aktif</span>
                                                <span className="block text-xs text-gray-500 mt-0.5">Favicon web bawaan telah diganti.</span>
                                            </div>
                                        </div>
                                        <button 
                                            type="button" 
                                            onClick={() => setData('remove_favicon', true)}
                                            className="text-red-500 hover:text-red-600 hover:bg-red-50 text-sm font-bold px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-red-100"
                                        >
                                            Hapus Favicon (Kembali ke Default)
                                        </button>
                                    </div>
                                )}
                                <label className="block text-sm font-medium text-gray-700 mb-2">Unggah Favicon Baru (Format .ico atau .png kecil)</label>
                                <input 
                                    type="file" 
                                    accept="image/png, image/x-icon, image/vnd.microsoft.icon"
                                    onChange={e => {
                                        setData('favicon', e.target.files?.[0] || null);
                                        if (e.target.files?.[0]) setData('remove_favicon', false);
                                    }}
                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-light file:text-brand-primary hover:file:bg-brand-primary hover:file:text-white transition-all cursor-pointer"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section Footer */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
                            <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                                <i className="ph-fill ph-layout text-brand-primary"></i> Pengaturan Footer
                            </h3>
                            <p className="text-gray-500 text-sm mt-1">Ubah informasi teks, alamat, dan link sosial media yang ada di paling bawah website.</p>
                        </div>
                        <div className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Tentang Kami (Singkat di Footer)</label>
                                <textarea 
                                    rows={3}
                                    value={data.footer_about} 
                                    onChange={e => setData('footer_about', e.target.value)}
                                    className="w-full rounded-xl border-gray-300 focus:border-brand-primary focus:ring-brand-primary shadow-sm resize-none"
                                />
                            </div>

                            <div className="pt-4 border-t border-gray-100">
                                {settings.footer_image && !data.remove_footer_image && (
                                    <div className="mb-4 p-4 border border-gray-200 rounded-xl bg-gray-50 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 rounded border border-gray-200 bg-white flex items-center justify-center overflow-hidden shadow-sm px-2">
                                                <img src={settings.footer_image} alt="Footer Image" className="h-full w-auto object-contain" />
                                            </div>
                                            <div>
                                                <span className="block text-sm font-bold text-gray-800">Logo Bawah Kustom Aktif</span>
                                                <span className="block text-xs text-gray-500 mt-0.5">Logo footer telah diganti.</span>
                                            </div>
                                        </div>
                                        <button 
                                            type="button" 
                                            onClick={() => setData('remove_footer_image', true)}
                                            className="text-red-500 hover:text-red-600 hover:bg-red-50 text-sm font-bold px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-red-100"
                                        >
                                            Hapus Logo (Kembali ke Bawaan)
                                        </button>
                                    </div>
                                )}
                                <label className="block text-sm font-medium text-gray-700 mb-2">Unggah Logo di Bawah Tentang Kami</label>
                                <input 
                                    type="file" 
                                    accept="image/png, image/jpeg, image/webp"
                                    onChange={e => {
                                        setData('footer_image', e.target.files?.[0] || null);
                                        if (e.target.files?.[0]) setData('remove_footer_image', false);
                                    }}
                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-light file:text-brand-primary hover:file:bg-brand-primary hover:file:text-white transition-all cursor-pointer"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Alamat Kantor / Domisili</label>
                                <textarea 
                                    rows={2}
                                    value={data.footer_address} 
                                    onChange={e => setData('footer_address', e.target.value)}
                                    className="w-full rounded-xl border-gray-300 focus:border-brand-primary focus:ring-brand-primary shadow-sm resize-none"
                                />
                            </div>
                            
                            <div className="pt-4 border-t border-gray-100">
                                <h4 className="font-bold text-gray-800 mb-4">Sosial Media (Kosongkan jika tidak ada)</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Link Instagram</label>
                                        <input 
                                            type="url" 
                                            value={data.social_ig} 
                                            onChange={e => setData('social_ig', e.target.value)}
                                            placeholder="https://instagram.com/..."
                                            className="w-full rounded-xl border-gray-300 focus:border-brand-primary focus:ring-brand-primary shadow-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Link LinkedIn</label>
                                        <input 
                                            type="url" 
                                            value={data.social_linkedin} 
                                            onChange={e => setData('social_linkedin', e.target.value)}
                                            placeholder="https://linkedin.com/..."
                                            className="w-full rounded-xl border-gray-300 focus:border-brand-primary focus:ring-brand-primary shadow-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Link Twitter/X</label>
                                        <input 
                                            type="url" 
                                            value={data.social_twitter} 
                                            onChange={e => setData('social_twitter', e.target.value)}
                                            placeholder="https://twitter.com/..."
                                            className="w-full rounded-xl border-gray-300 focus:border-brand-primary focus:ring-brand-primary shadow-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Link YouTube</label>
                                        <input 
                                            type="url" 
                                            value={data.social_youtube} 
                                            onChange={e => setData('social_youtube', e.target.value)}
                                            placeholder="https://youtube.com/..."
                                            className="w-full rounded-xl border-gray-300 focus:border-brand-primary focus:ring-brand-primary shadow-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end sticky bottom-6 z-10">
                        <button 
                            type="submit" 
                            disabled={processing}
                            className="bg-brand-primary hover:bg-brand-purple text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-brand-primary/30 transition-all disabled:opacity-50 flex items-center gap-2"
                        >
                            {processing ? <i className="ph ph-spinner animate-spin"></i> : <i className="ph ph-floppy-disk"></i>}
                            Simpan Perubahan
                        </button>
                    </div>

                </form>
            </div>
        </AdminLayout>
    );
}
