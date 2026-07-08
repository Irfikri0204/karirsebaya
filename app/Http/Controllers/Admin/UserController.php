<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = User::query();
        
        // Admin biasa tidak bisa melihat/mengelola superadmin
        if (auth()->user()->role === 'admin') {
            $query->where('role', '!=', 'superadmin');
        }

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%')
                  ->orWhere('nim', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->role) {
            $query->where('role', $request->role);
        }

        $users = $query->latest()->paginate(15)->withQueryString();
        
        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => $request->only(['search', 'role'])
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|in:user,admin,superadmin'
        ]);

        if (auth()->user()->role === 'admin' && $validated['role'] === 'superadmin') {
            return back()->with('error', 'Admin tidak dapat membuat akun superadmin.');
        }

        $validated['password'] = bcrypt($validated['password']);
        User::create($validated);

        return back()->with('success', 'Akun berhasil ditambahkan.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        if (auth()->user()->role === 'admin' && $user->role === 'superadmin') {
            return back()->with('error', 'Admin tidak dapat menghapus akun superadmin.');
        }

        if (auth()->id() === $user->id) {
            return back()->with('error', 'Tidak dapat menghapus akun sendiri.');
        }

        $user->delete();

        return back()->with('success', 'Akun berhasil dihapus.');
    }

    public function bulkAction(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:users,id',
            'action' => 'required|in:delete'
        ]);

        $ids = $validated['ids'];
        $query = \App\Models\User::whereIn('id', $ids);

        // Proteksi: Admin tidak boleh hapus superadmin, jangan hapus diri sendiri
        if (auth()->user()->role === 'admin') {
            $query->where('role', '!=', 'superadmin');
        }
        $query->where('id', '!=', auth()->id());

        $query->delete();

        return back()->with('success', 'Akun yang dipilih berhasil dihapus.');
    }
}
