<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\TeamMember;
use Inertia\Inertia;

class TeamMemberController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/TeamMembers/Index', [
            'teamMembers' => TeamMember::all()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'role' => 'required|string|max:255',
            'category' => 'required|string|in:developer,expert,peer',
            'bio' => 'nullable|string',
            'image' => 'nullable|image|max:5120', // 5MB max
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('team_members', 'public');
            $validated['image'] = '/storage/' . $path;
        }

        TeamMember::create($validated);
        return redirect()->back()->with('success', 'Anggota tim ditambahkan.');
    }

    public function update(Request $request, TeamMember $teamMember)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'role' => 'required|string|max:255',
            'category' => 'required|string|in:developer,expert,peer',
            'bio' => 'nullable|string',
            'image' => 'nullable|image|max:5120',
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('team_members', 'public');
            $validated['image'] = '/storage/' . $path;
        }

        $teamMember->update($validated);
        return redirect()->back()->with('success', 'Anggota tim diperbarui.');
    }

    public function destroy(TeamMember $teamMember)
    {
        $teamMember->delete();
        return redirect()->back()->with('success', 'Anggota tim dihapus.');
    }

    public function bulkAction(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:team_members,id',
            'action' => 'required|in:delete'
        ]);

        $ids = $validated['ids'];

        if ($validated['action'] === 'delete') {
            TeamMember::whereIn('id', $ids)->delete();
            return back()->with('success', 'Anggota tim yang dipilih berhasil dihapus.');
        }

        return back();
    }
}
