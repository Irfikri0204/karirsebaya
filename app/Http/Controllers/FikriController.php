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
            $path = $request->file('photo')->store('public/fikri');
            $url = Storage::url($path);
            
            // Delete old photo if exists
            $oldSetting = Setting::where('key', 'fikri_photo')->first();
            if ($oldSetting && $oldSetting->value) {
                $oldPath = str_replace('/storage/', 'public/', $oldSetting->value);
                if (Storage::exists($oldPath)) {
                    Storage::delete($oldPath);
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
