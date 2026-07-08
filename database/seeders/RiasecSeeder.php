<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\RiasecCategory;
use App\Models\RiasecQuestion;

class RiasecSeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'code' => 'R',
                'name' => 'Realistic',
                'description' => 'Tipe orang yang praktis, menyukai kegiatan di luar ruangan, dan senang bekerja dengan alat atau mesin.',
                'recommendations' => 'Teknik Mesin, Pertanian, Kehutanan, Arsitektur, Peternakan, Olahraga.',
                'inspiring_figures' => [
                    ['name' => 'B.J. Habibie', 'image' => 'https://ui-avatars.com/api/?name=BJ+Habibie&background=475569&color=fff', 'description' => 'Insinyur & Presiden RI ke-3 yang sangat praktis dan ahli dalam teknik penerbangan.']
                ]
            ],
            [
                'code' => 'I',
                'name' => 'Investigative',
                'description' => 'Tipe orang yang analitis, suka mengamati, belajar, menganalisis, dan memecahkan masalah.',
                'recommendations' => 'Ilmu Komputer, Kedokteran, Biologi, Kimia, Matematika, Psikologi (Riset).',
                'inspiring_figures' => [
                    ['name' => 'Albert Einstein', 'image' => 'https://ui-avatars.com/api/?name=Albert+Einstein&background=3b82f6&color=fff', 'description' => 'Fisikawan teoritis yang sangat analitis dalam memecahkan misteri alam semesta.']
                ]
            ],
            [
                'code' => 'A',
                'name' => 'Artistic',
                'description' => 'Tipe orang yang kreatif, inovatif, intuitif, dan suka bekerja dalam situasi yang tidak terstruktur.',
                'recommendations' => 'Desain Komunikasi Visual, Seni Musik, Sastra, Arsitektur, Fotografi, Periklanan.',
                'inspiring_figures' => [
                    ['name' => 'Raditya Dika', 'image' => 'https://ui-avatars.com/api/?name=Raditya+Dika&background=ec4899&color=fff', 'description' => 'Kreator konten, penulis, dan sutradara dengan kebebasan berkreasi yang tinggi.']
                ]
            ],
            [
                'code' => 'S',
                'name' => 'Social',
                'description' => 'Tipe orang yang suka menolong, mendidik, mengobati, atau melayani orang lain.',
                'recommendations' => 'Pendidikan, Keperawatan, Psikologi (Klinis/Konseling), Hubungan Masyarakat, Sosiologi.',
                'inspiring_figures' => [
                    ['name' => 'Najwa Shihab', 'image' => 'https://ui-avatars.com/api/?name=Najwa+Shihab&background=10b981&color=fff', 'description' => 'Jurnalis yang berdedikasi untuk mencerdaskan dan melayani masyarakat.']
                ]
            ],
            [
                'code' => 'E',
                'name' => 'Enterprising',
                'description' => 'Tipe orang yang ambisius, suka memimpin, memengaruhi orang lain, dan berorientasi pada pencapaian.',
                'recommendations' => 'Manajemen Bisnis, Hukum, Ilmu Politik, Pemasaran, Kewirausahaan.',
                'inspiring_figures' => [
                    ['name' => 'Nadiem Makarim', 'image' => 'https://ui-avatars.com/api/?name=Nadiem+Makarim&background=f59e0b&color=fff', 'description' => 'Pengusaha sukses yang memimpin perusahaan rintisan menjadi decacorn.']
                ]
            ],
            [
                'code' => 'C',
                'name' => 'Conventional',
                'description' => 'Tipe orang yang suka bekerja dengan data, terorganisir, teliti, dan mengikuti prosedur.',
                'recommendations' => 'Akuntansi, Administrasi Bisnis, Keuangan, Statistika, Manajemen Informatika.',
                'inspiring_figures' => [
                    ['name' => 'Sri Mulyani', 'image' => 'https://ui-avatars.com/api/?name=Sri+Mulyani&background=8b5cf6&color=fff', 'description' => 'Menteri Keuangan yang sangat teliti dalam mengatur anggaran dan data negara.']
                ]
            ],
        ];

        foreach ($categories as $cat) {
            RiasecCategory::create($cat);
        }

        $standard_options = [
            ['text' => 'Sangat Tidak Setuju', 'score' => 1],
            ['text' => 'Tidak Setuju', 'score' => 2],
            ['text' => 'Netral', 'score' => 3],
            ['text' => 'Setuju', 'score' => 4],
            ['text' => 'Sangat Setuju', 'score' => 5],
        ];

        $questions = [
            ['category_code' => 'R', 'question_text' => 'Saya suka merakit atau memperbaiki barang (seperti elektronik, kendaraan, atau perabotan).', 'options' => $standard_options],
            ['category_code' => 'R', 'question_text' => 'Saya lebih suka bekerja di luar ruangan daripada duduk di depan komputer sepanjang hari.', 'options' => $standard_options],
            
            ['category_code' => 'I', 'question_text' => 'Saya senang membaca artikel sains, teknologi, atau penemuan terbaru.', 'options' => $standard_options],
            ['category_code' => 'I', 'question_text' => 'Saya suka menganalisis suatu masalah yang rumit hingga menemukan solusinya.', 'options' => $standard_options],
            
            ['category_code' => 'A', 'question_text' => 'Saya sangat menikmati aktivitas menggambar, melukis, atau mendesain sesuatu.', 'options' => $standard_options],
            ['category_code' => 'A', 'question_text' => 'Saya lebih suka bekerja dengan cara saya sendiri tanpa aturan yang terlalu mengikat.', 'options' => $standard_options],
            
            ['category_code' => 'S', 'question_text' => 'Saya senang mendengarkan curhat orang lain dan memberikan mereka nasihat.', 'options' => $standard_options],
            ['category_code' => 'S', 'question_text' => 'Saya lebih suka bekerja dalam tim dan membantu rekan kerja yang kesulitan.', 'options' => $standard_options],
            
            ['category_code' => 'E', 'question_text' => 'Saya memiliki cita-cita untuk memulai dan memimpin bisnis saya sendiri.', 'options' => $standard_options],
            ['category_code' => 'E', 'question_text' => 'Saya mudah meyakinkan orang lain untuk menyetujui ide atau pendapat saya.', 'options' => $standard_options],
            
            ['category_code' => 'C', 'question_text' => 'Saya suka merapikan file atau data agar mudah dicari saat dibutuhkan.', 'options' => $standard_options],
            ['category_code' => 'C', 'question_text' => 'Saya merasa nyaman bekerja dengan jadwal dan instruksi yang jelas dan terstruktur.', 'options' => $standard_options],
        ];

        foreach ($questions as $q) {
            RiasecQuestion::create($q);
        }
    }
}
