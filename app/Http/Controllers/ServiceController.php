<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ServiceController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Services/Index', [
            'services' => Service::orderBy('order')->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'icon' => 'required|string|max:255',
            'badge' => 'nullable|string|max:255',
            'color_class' => 'nullable|string|max:255',
            'order' => 'integer'
        ]);

        Service::create($validated);
        return back()->with('success', 'Service created successfully.');
    }

    public function update(Request $request, Service $service)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'icon' => 'required|string|max:255',
            'badge' => 'nullable|string|max:255',
            'color_class' => 'nullable|string|max:255',
            'order' => 'integer'
        ]);

        $service->update($validated);
        return back()->with('success', 'Service updated successfully.');
    }

    public function destroy(Service $service)
    {
        $service->delete();
        return back()->with('success', 'Service deleted successfully.');
    }

    public function reorder(Request $request)
    {
        $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|integer|exists:services,id',
            'items.*.order' => 'required|integer',
        ]);

        foreach ($request->items as $item) {
            Service::where('id', $item['id'])->update(['order' => $item['order']]);
        }

        return back()->with('success', 'Urutan berhasil diperbarui.');
    }
}
