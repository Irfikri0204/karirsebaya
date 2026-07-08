<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CmsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Features (Keunggulan Utama)
        $features = [
            ['title' => 'Tarif Relatif Rendah', 'description' => 'Dirancang khusus untuk kantong mahasiswa. Kualitas konsultasi premium tanpa harus merogoh kocek dalam-dalam.', 'icon' => 'ph-wallet', 'order' => 1],
            ['title' => 'Pengalaman yang Relevan', 'description' => 'Mentor kami baru saja melewati fase yang kamu alami saat ini, sehingga saran yang diberikan sangat "relate".', 'icon' => 'ph-user-focus', 'order' => 2],
            ['title' => 'Jadwal Lebih Fleksibel', 'description' => 'Pilih waktu konsultasi yang paling pas untukmu. Malam hari sepulang kuliah? Bisa diatur!', 'icon' => 'ph-clock', 'order' => 3],
            ['title' => 'Pilihan Sesuai Minat', 'description' => 'Dari Tech, Creative, Business, hingga Corporate. Temukan mentor dari berbagai bidang industri pilihanmu.', 'icon' => 'ph-target', 'order' => 4],
            ['title' => 'Interaksi Interaktif', 'description' => 'Diskusi dua arah yang santai layaknya ngobrol dengan teman. Tidak kaku dan tidak menggurui.', 'icon' => 'ph-handshake', 'order' => 5],
            ['title' => 'Forum dan Komunitas', 'description' => 'Bergabunglah dengan grup eksklusif untuk berbagi loker, tips, dan saling dukung antar sesama jobseeker.', 'icon' => 'ph-users', 'order' => 6],
        ];

        foreach ($features as $f) {
            \App\Models\Feature::create($f);
        }

        // Services (Layanan Kami)
        $services = [
            ['title' => 'Teman Sebaya (Peer)', 'description' => 'Konsultasi 1-on-1 dengan mentor yang usianya tidak jauh beda. Suasana obrolan lebih asik, nyambung, dan dapat insight praktis soal dunia kerja dari sudut pandang gen-z.', 'icon' => 'ph-users-three', 'badge' => 'Populer', 'color_class' => 'brand-primary', 'order' => 1],
            ['title' => 'Website & Aplikasi', 'description' => 'Akses modul pembelajaran, template CV, dan latihan interview langsung dari platform kami. Belajar fleksibel kapan saja, di mana saja untuk persiapan berkarir.', 'icon' => 'ph-laptop', 'badge' => null, 'color_class' => 'indigo-600', 'order' => 2],
            ['title' => 'Tes Potensi Bakat', 'description' => 'Masih bingung karir apa yang cocok? Ikuti asesmen psikologi dan minat bakat kami untuk memetakan kekuatan dan kelemahanmu secara objektif.', 'icon' => 'ph-clipboard-text', 'badge' => null, 'color_class' => 'pink-500', 'order' => 3],
            ['title' => 'Konsultasi Pakar', 'description' => 'Bagi yang butuh arahan lebih strategis, jadwalkan sesi dengan praktisi HR atau manajer senior untuk review performa dan simulasi wawancara teknikal.', 'icon' => 'ph-chalkboard-teacher', 'badge' => null, 'color_class' => 'teal-500', 'order' => 4],
        ];

        foreach ($services as $s) {
            \App\Models\Service::create($s);
        }

        // Partners (Institusi Mitra)
        $partners = [
            ['name' => 'Universitas Indonesia', 'order' => 1],
            ['name' => 'Universitas Gadjah Mada', 'order' => 2],
            ['name' => 'Institut Teknologi Bandung', 'order' => 3],
            ['name' => 'Universitas Padjadjaran', 'order' => 4],
            ['name' => 'Telkom University', 'order' => 5],
            ['name' => 'Universitas Brawijaya', 'order' => 6],
            ['name' => 'Institut Teknologi Sepuluh Nopember', 'order' => 7],
            ['name' => 'Bina Nusantara', 'order' => 8],
        ];

        foreach ($partners as $p) {
            \App\Models\Partner::create($p);
        }

        // Testimonials
        $testimonials = [
            ['name' => 'Ahmad Fauzi', 'institution' => 'Mahasiswa Sistem Informasi, UI', 'message' => '"Berkat mentor dari Karir Sebaya, aku yang awalnya sangat blank soal karir jadi tau step-by-step persiapan masuk industri tech. Review CV nya sangat detail!"', 'rating' => 5, 'avatar_initials' => 'AF', 'avatar_color' => 'blue', 'is_featured' => true],
            ['name' => 'Siti Nurhaliza', 'institution' => 'Fresh Graduate Manajemen, UGM', 'message' => '"Sesi Mockup Interview nya luar biasa! Pertanyaannya bener-bener mirip sama pas aku interview HR. Alhamdulillah sekarang udah dapet offering."', 'rating' => 5, 'avatar_initials' => 'SN', 'avatar_color' => 'pink', 'is_featured' => true],
            ['name' => 'Dimas Kurniawan', 'institution' => 'Mahasiswa Ilmu Komunikasi, UNPAD', 'message' => '"Ngobrol sama mentor di sini enak banget, ga kaku sama sekali. Beneran kayak curhat sama kating tapi dikasih solusi yang super actionable. Highly recommended."', 'rating' => 5, 'avatar_initials' => 'DK', 'avatar_color' => 'purple', 'is_featured' => true],
            ['name' => 'Nabila Ayu', 'institution' => 'Jobseeker, Jakarta', 'message' => '"Awalnya ragu karena harganya murah, eh pas konsul ternyata insightnya daging semua. Mentornya bener-bener expert di bidang digital marketing."', 'rating' => 5, 'avatar_initials' => 'NA', 'avatar_color' => 'purple', 'is_featured' => true],
            ['name' => 'Reza Pratama', 'institution' => 'Karyawan Swasta, Bandung', 'message' => '"Tes potensi bakatnya sangat membantu saya meyakinkan diri untuk switch career. Hasil reportnya gampang dibaca dan penjelasannya clear."', 'rating' => 5, 'avatar_initials' => 'RP', 'avatar_color' => 'teal', 'is_featured' => true],
            ['name' => 'Cindy Salsabila', 'institution' => 'Mahasiswa Psikologi, UNDIP', 'message' => '"Platform andalan waktu nyusun rencana skripsi sampe cari tempat magang. Terima kasih Karir Sebaya udah nemenin masa-masa quarter life crisis ku!"', 'rating' => 5, 'avatar_initials' => 'CS', 'avatar_color' => 'orange', 'is_featured' => true],
        ];

        foreach ($testimonials as $t) {
            \App\Models\Testimonial::create($t);
        }
    }
}
