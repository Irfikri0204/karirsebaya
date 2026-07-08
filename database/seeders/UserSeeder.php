<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\User::create([
            'name' => 'Super Admin',
            'email' => 'admin@karirsebaya.com',
            'password' => bcrypt('password'),
            'role' => 'admin',
        ]);

        \App\Models\User::create([
            'name' => 'User Biasa',
            'email' => 'user@karirsebaya.com',
            'password' => bcrypt('password'),
            'role' => 'user',
        ]);
    }
}
