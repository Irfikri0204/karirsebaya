<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Setting;

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            // Kontak
            ['key' => 'contact_whatsapp', 'value' => '6281122334455', 'type' => 'text'],
            ['key' => 'contact_email', 'value' => 'halo@karirsebaya.id', 'type' => 'text'],
            
            // Halaman Beranda
            ['key' => 'home_hero_title', 'value' => 'Rencanakan Masa Depan Karirmu Bersama Kami', 'type' => 'text'],
            ['key' => 'home_hero_subtitle', 'value' => 'Platform konseling karir nomor satu yang menghubungkan mahasiswa dan lulusan baru dengan mentor profesional dan konselor sebaya.', 'type' => 'text'],
            
            // Halaman Konseling
            ['key' => 'counseling_title', 'value' => 'Pengajuan Konseling', 'type' => 'text'],
            ['key' => 'counseling_subtitle', 'value' => 'Bicarakan kebuntuan karirmu langsung dengan para praktisi ahli dan konselor sebaya kami.', 'type' => 'text'],

            // Statistik Beranda
            ['key' => 'stat_users_auto', 'value' => '1', 'type' => 'boolean'],
            ['key' => 'stat_users_manual', 'value' => '1,000+', 'type' => 'text'],
            ['key' => 'stat_counselors', 'value' => '50+', 'type' => 'text'],
            ['key' => 'stat_careers', 'value' => '15+', 'type' => 'text'],

            // Tentang Platform
            ['key' => 'about_title', 'value' => 'Platform Konseling Karir Berbasis Teman Sebaya', 'type' => 'text'],
            ['key' => 'about_subtitle', 'value' => 'Tentang Platform Kami', 'type' => 'text'],
            ['key' => 'about_desc1', 'value' => 'Kami hadir sebagai ruang aman bagi mahasiswa dan fresh graduate untuk mengeksplorasi potensi diri, menemukan passion, dan merencanakan karir dengan bimbingan mentor (teman sebaya) yang telah terjun lebih dulu.', 'type' => 'text'],
            ['key' => 'about_desc2', 'value' => 'Bukan sekadar memberikan teori, tapi berbagi pengalaman nyata dari mereka yang pernah berada di posisimu. Kami percaya, obrolan dari hati ke hati dengan sesama anak muda akan menghasilkan solusi yang lebih relevan.', 'type' => 'text'],
            ['key' => 'about_bullets', 'value' => json_encode([
                'Meningkatkan kepercayaan diri dalam meraih karir impian.',
                'Memperluas networking dengan para profesional muda.',
                'Mendapatkan feedback langsung seputar CV dan wawancara.'
            ]), 'type' => 'text'],

            // Testimoni Mode
            ['key' => 'testimonial_mode', 'value' => 'auto', 'type' => 'text'], // auto or manual
            ['key' => 'testimonial_manual_ids', 'value' => '[]', 'type' => 'text'],
            
            // Global Settings
            ['key' => 'test_is_open', 'value' => '1', 'type' => 'boolean'],
        ];

        foreach ($settings as $setting) {
            Setting::updateOrCreate(['key' => $setting['key']], $setting);
        }
    }
}
