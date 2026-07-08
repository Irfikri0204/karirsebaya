<?php

namespace App\Http\Controllers;

use App\Models\Feature;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FeatureController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Features/Index', [
            'features' => Feature::orderBy('order')->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'icon' => 'required|string|max:255',
            'order' => 'integer'
        ]);

        Feature::create($validated);
        return back()->with('success', 'Feature created successfully.');
    }

    public function update(Request $request, Feature $feature)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'icon' => 'required|string|max:255',
            'order' => 'integer'
        ]);

        $feature->update($validated);
        return back()->with('success', 'Feature updated successfully.');
    }

    public function destroy(Feature $feature)
    {
        $feature->delete();
        return back()->with('success', 'Feature deleted successfully.');
    }

    public function reorder(Request $request)
    {
        $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|integer|exists:features,id',
            'items.*.order' => 'required|integer',
        ]);

        foreach ($request->items as $item) {
            Feature::where('id', $item['id'])->update(['order' => $item['order']]);
        }

        return back()->with('success', 'Urutan berhasil diperbarui.');
    }
}
