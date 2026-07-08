<?php

namespace App\Http\Controllers;

use App\Models\Partner;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class PartnerController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Partners/Index', [
            'partners' => Partner::orderBy('order')->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'order' => 'integer',
            'logo' => 'nullable|image|max:2048'
        ]);

        $path = null;
        if ($request->hasFile('logo')) {
            $path = $request->file('logo')->store('partners', 'public');
        }

        Partner::create([
            'name' => $validated['name'],
            'order' => $validated['order'] ?? 0,
            'logo_path' => $path
        ]);

        return back()->with('success', 'Partner created successfully.');
    }

    public function update(Request $request, Partner $partner)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'order' => 'integer',
            'logo' => 'nullable|image|max:2048'
        ]);

        if ($request->hasFile('logo')) {
            if ($partner->logo_path) {
                Storage::disk('public')->delete($partner->logo_path);
            }
            $partner->logo_path = $request->file('logo')->store('partners', 'public');
        }

        $partner->name = $validated['name'];
        $partner->order = $validated['order'] ?? 0;
        $partner->save();

        return back()->with('success', 'Partner updated successfully.');
    }

    public function destroy(Partner $partner)
    {
        if ($partner->logo_path) {
            Storage::disk('public')->delete($partner->logo_path);
        }
        $partner->delete();
        return back()->with('success', 'Partner deleted successfully.');
    }

    public function reorder(Request $request)
    {
        $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|integer|exists:partners,id',
            'items.*.order' => 'required|integer',
        ]);

        foreach ($request->items as $item) {
            Partner::where('id', $item['id'])->update(['order' => $item['order']]);
        }

        return back()->with('success', 'Urutan berhasil diperbarui.');
    }

    public function bulkAction(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:partners,id',
            'action' => 'required|in:delete'
        ]);

        if ($validated['action'] === 'delete') {
            $partners = Partner::whereIn('id', $validated['ids'])->get();
            foreach ($partners as $partner) {
                if ($partner->logo_path) {
                    Storage::disk('public')->delete($partner->logo_path);
                }
                $partner->delete();
            }
            return back()->with('success', 'Partner yang dipilih berhasil dihapus.');
        }

        return back();
    }
}
