<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Module;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class ModuleController extends Controller
{
    public function index()
    {
        $modules = Module::orderBy('order')->get();
        
        return Inertia::render('Admin/Modules/Index', [
            'modules' => $modules
        ]);
    }

    public function show(Module $module)
    {
        $module->load('topics');
        return Inertia::render('Admin/Modules/Show', [
            'module' => $module
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'hashtag' => 'nullable|string|max:255',
            'introduction' => 'nullable|string',
            'cover_image' => 'nullable|image|max:2048', // max 2MB
            'is_active' => 'boolean',
        ]);

        if ($request->hasFile('cover_image')) {
            $path = $request->file('cover_image')->store('modules', 'public');
            $validated['cover_image'] = '/storage/' . $path;
        }

        if (isset($validated['hashtag'])) {
            $validated['hashtag'] = ltrim($validated['hashtag'], '#');
        }

        $validated['order'] = Module::max('order') + 1;

        Module::create($validated);

        return redirect()->back()->with('success', 'Modul berhasil ditambahkan.');
    }

    public function update(Request $request, Module $module)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'hashtag' => 'nullable|string|max:255',
            'introduction' => 'nullable|string',
            'cover_image' => 'nullable', // bisa file atau string existing
            'is_active' => 'boolean',
        ]);

        if ($request->hasFile('cover_image')) {
            // Delete old image if exists
            if ($module->cover_image && str_starts_with($module->cover_image, '/storage/')) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $module->cover_image));
            }
            $path = $request->file('cover_image')->store('modules', 'public');
            $validated['cover_image'] = '/storage/' . $path;
        } else if ($request->cover_image === null) {
            // If explicitly removed
            if ($module->cover_image && str_starts_with($module->cover_image, '/storage/')) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $module->cover_image));
            }
            $validated['cover_image'] = null;
        } else {
            // Keep existing
            unset($validated['cover_image']);
        }

        if (isset($validated['hashtag'])) {
            $validated['hashtag'] = ltrim($validated['hashtag'], '#');
        }

        $module->update($validated);

        return redirect()->back()->with('success', 'Modul berhasil diperbarui.');
    }

    public function destroy(Module $module)
    {
        if ($module->cover_image && str_starts_with($module->cover_image, '/storage/')) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $module->cover_image));
        }
        
        $module->delete();
        return redirect()->back()->with('success', 'Modul berhasil dihapus.');
    }

    public function reorder(Request $request)
    {
        $validated = $request->validate([
            'modules' => 'required|array',
            'modules.*.id' => 'required|exists:modules,id',
            'modules.*.order' => 'required|integer',
        ]);

        foreach ($validated['modules'] as $moduleData) {
            Module::where('id', $moduleData['id'])->update(['order' => $moduleData['order']]);
        }

        return redirect()->back()->with('success', 'Urutan modul berhasil diperbarui.');
    }

    public function bulkAction(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:modules,id',
            'action' => 'required|in:delete'
        ]);

        if ($validated['action'] === 'delete') {
            $modules = Module::whereIn('id', $validated['ids'])->get();
            foreach ($modules as $module) {
                if ($module->cover_image && str_starts_with($module->cover_image, '/storage/')) {
                    Storage::disk('public')->delete(str_replace('/storage/', '', $module->cover_image));
                }
                $module->delete();
            }
            return redirect()->back()->with('success', 'Modul yang dipilih berhasil dihapus.');
        }

        return redirect()->back();
    }
}
