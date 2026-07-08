<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Setting;
use Inertia\Inertia;

class SettingController extends Controller
{
    public function index()
    {
        $settings = Setting::pluck('value', 'key')->toArray();
        return Inertia::render('Admin/Settings/Index', [
            'settings' => $settings
        ]);
    }

    public function counseling()
    {
        $settings = Setting::pluck('value', 'key')->toArray();
        return Inertia::render('Admin/Settings/Counseling', [
            'settings' => $settings
        ]);
    }

    public function update(Request $request)
    {
        $data = $request->except(['_token', '_method']);
        
        $fileKeys = ['panduan_file', 'navbar_icon', 'favicon'];

        // Cek jika ada permintaan untuk menghapus file
        foreach ($fileKeys as $fileKey) {
            $removeKey = 'remove_' . $fileKey;
            if ($request->boolean($removeKey)) {
                \App\Models\Setting::where('key', $fileKey)->delete();
                unset($data[$fileKey]); // Pastikan tidak ditulis ulang sebagai null
            }
            unset($data[$removeKey]); // Hapus field remove_ dari data agar tidak tersimpan ke settings
        }

        // Remove file keys if they are explicitly sent as null (meaning no new file was uploaded)
        // so we don't overwrite the existing file path in the database.
        foreach ($fileKeys as $fileKey) {
            if (array_key_exists($fileKey, $data) && is_null($data[$fileKey])) {
                unset($data[$fileKey]);
            }
        }

        foreach ($request->allFiles() as $key => $file) {
            $path = $file->store('settings', 'public');
            $data[$key] = '/storage/' . $path;
        }

        foreach ($data as $key => $value) {
            Setting::updateOrCreate(
                ['key' => $key],
                ['value' => is_array($value) ? json_encode($value) : $value]
            );
        }

        return redirect()->back()->with('success', 'Pengaturan berhasil diperbarui.');
    }
}
