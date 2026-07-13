<?php

namespace App\Http\Controllers;

use App\Models\Testimonial;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TestimonialController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Testimonials/Index', [
            'testimonials' => Testimonial::latest()->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'institution' => 'required|string|max:255',
            'message' => 'required|string',
            'rating' => 'required|integer|min:1|max:5',
            'is_hidden' => 'boolean',
            'is_featured' => 'boolean',
            'avatar_initials' => 'nullable|string|max:2',
            'avatar_color' => 'required|string|max:50',
        ]);

        if (isset($validated['is_featured']) && $validated['is_featured']) {
            $validated['is_hidden'] = false;
        } elseif (isset($validated['is_hidden']) && $validated['is_hidden']) {
            $validated['is_featured'] = false;
        }

        Testimonial::create($validated);
        return back()->with('success', 'Testimonial created successfully.');
    }

    public function update(Request $request, Testimonial $testimonial)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'institution' => 'required|string|max:255',
            'message' => 'required|string',
            'rating' => 'required|integer|min:1|max:5',
            'is_hidden' => 'boolean',
            'is_featured' => 'boolean',
            'avatar_initials' => 'nullable|string|max:2',
            'avatar_color' => 'required|string|max:50',
        ]);

        if (isset($validated['is_featured']) && $validated['is_featured']) {
            $validated['is_hidden'] = false;
        } elseif (isset($validated['is_hidden']) && $validated['is_hidden']) {
            $validated['is_featured'] = false;
        }

        $testimonial->update($validated);
        return back()->with('success', 'Testimonial updated successfully.');
    }

    public function storePublic(Request $request)
    {
        $validated = $request->validate([
            'message' => 'required|string|max:500',
            'rating' => 'required|integer|min:1|max:5',
        ]);

        // Auto-fill other fields based on authenticated user
        $user = auth()->user();
        
        // Pick a random color for avatar
        $colors = ['red', 'orange', 'amber', 'green', 'emerald', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose'];
        $randomColor = $colors[array_rand($colors)];

        Testimonial::updateOrCreate(
            ['user_id' => $user->id],
            [
                'name' => $user->name,
                'institution' => $user->asal_instansi ?? 'User Karir Sebaya',
                'message' => $validated['message'],
                'rating' => $validated['rating'],
                'is_hidden' => false,
                'is_featured' => false,
                'avatar_initials' => strtoupper(substr($user->name, 0, 2)),
                'avatar_color' => $randomColor,
            ]
        );

        return back()->with('success', 'Testimoni Anda berhasil dikirim. Terima kasih!');
    }

    public function destroy(Testimonial $testimonial)
    {
        $testimonial->delete();
        return back()->with('success', 'Testimonial deleted successfully.');
    }

    public function bulkAction(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:testimonials,id',
            'action' => 'required|in:delete,show,hide'
        ]);

        $ids = $validated['ids'];

        switch ($validated['action']) {
            case 'delete':
                Testimonial::whereIn('id', $ids)->delete();
                $message = 'Testimoni yang dipilih berhasil dihapus.';
                break;
            case 'show':
                Testimonial::whereIn('id', $ids)->update(['is_hidden' => false]);
                $message = 'Testimoni yang dipilih berhasil ditampilkan.';
                break;
            case 'hide':
                Testimonial::whereIn('id', $ids)->update(['is_hidden' => true, 'is_featured' => false]);
                $message = 'Testimoni yang dipilih berhasil disembunyikan.';
                break;
        }

        return back()->with('success', $message ?? 'Aksi berhasil dilakukan.');
    }

    public function export()
    {
        return \Maatwebsite\Excel\Facades\Excel::download(new \App\Exports\TestimonialExport, 'testimoni-karir-sebaya-' . date('Y-m-d') . '.xlsx');
    }
}
