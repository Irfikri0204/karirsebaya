<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class FikriController extends Controller
{
    public function index()
    {
        $settings = Setting::whereIn('key', ['fikri_photo', 'fikri_description'])->pluck('value', 'key');
        
        return Inertia::render('Fikri/Index', [
            'photo' => $settings['fikri_photo'] ?? null,
            'description' => $settings['fikri_description'] ?? 'Halo, saya Fikri.'
        ]);
    }

    public function edit()
    {
        $settings = Setting::whereIn('key', ['fikri_photo', 'fikri_description'])->pluck('value', 'key');
        
        return Inertia::render('Admin/FikriProfile/Index', [
            'photo' => $settings['fikri_photo'] ?? null,
            'description' => $settings['fikri_description'] ?? 'Halo, saya Fikri.'
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'description' => 'required|string',
            'photo' => 'nullable|image|max:2048'
        ]);

        Setting::updateOrCreate(
            ['key' => 'fikri_description'],
            ['value' => $request->description, 'type' => 'text']
        );

        if ($request->hasFile('photo')) {
            $file = $request->file('photo');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('uploads/fikri'), $filename);
            $url = '/uploads/fikri/' . $filename;
            
            // Delete old photo if exists
            $oldSetting = Setting::where('key', 'fikri_photo')->first();
            if ($oldSetting && $oldSetting->value) {
                $oldPath = public_path($oldSetting->value);
                if (file_exists($oldPath) && is_file($oldPath)) {
                    unlink($oldPath);
                }
            }

            Setting::updateOrCreate(
                ['key' => 'fikri_photo'],
                ['value' => $url, 'type' => 'image']
            );
        }

        return back()->with('success', 'Profil Fikri berhasil diperbarui.');
    }
}
