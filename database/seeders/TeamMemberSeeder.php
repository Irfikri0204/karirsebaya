<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\TeamMember;

class TeamMemberSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $members = [
            ['name' => 'John Doe', 'role' => 'Project Manager', 'category' => 'developer'],
            ['name' => 'Jane Smith', 'role' => 'Lead Engineer', 'category' => 'developer'],
            ['name' => 'Alex Johnson', 'role' => 'UI/UX Designer', 'category' => 'developer'],
            ['name' => 'Dr. Sarah Lee', 'role' => 'Psikolog Karir', 'category' => 'expert'],
            ['name' => 'Budi Santoso, M.Psi', 'role' => 'HR Consultant', 'category' => 'expert'],
            ['name' => 'Rizky Ramadhan', 'role' => 'Alumni ITB (Tech)', 'category' => 'peer'],
            ['name' => 'Nadia Putri', 'role' => 'Alumni UI (Creative)', 'category' => 'peer'],
        ];

        foreach ($members as $member) {
            TeamMember::create($member);
        }
    }
}
