<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\RiasecCategory;
use Inertia\Inertia;

class RiasecCategoryController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Riasec/Categories/Index', [
            'categories' => RiasecCategory::with(['professions', 'figures'])->get()
        ]);
    }

    public function update(Request $request, $code)
    {
        $validated = $request->validate([
            'description' => 'required|string',
            'recommendations' => 'nullable|string',
            'professions' => 'nullable|array',
            'figures' => 'nullable|array',
        ]);

        $category = RiasecCategory::findOrFail($code);
        $category->update([
            'description' => $validated['description'],
            'recommendations' => $validated['recommendations'] ?? '',
        ]);

        // Sync Professions
        $category->professions()->delete();
        if (!empty($validated['professions'])) {
            foreach ($validated['professions'] as $profession) {
                if (!empty($profession['title'])) {
                    $category->professions()->create([
                        'title' => $profession['title'],
                        'description' => $profession['description'] ?? '',
                    ]);
                }
            }
        }

        // Sync Figures
        // We do not delete all figures, because we need to preserve existing images if not changed
        // Instead, we will iterate. If a figure has an ID, we update. If not, we create.
        // We will also delete figures that are not in the submitted array.
        
        $submittedFigureIds = collect($request->input('figures', []))->pluck('id')->filter()->toArray();
        $category->figures()->whereNotIn('id', $submittedFigureIds)->delete();

        if ($request->has('figures')) {
            foreach ($request->input('figures') as $index => $figureData) {
                if (empty($figureData['name'])) continue;

                $figure = null;
                if (!empty($figureData['id'])) {
                    $figure = $category->figures()->find($figureData['id']);
                }

                if (!$figure) {
                    $figure = $category->figures()->create([
                        'name' => $figureData['name'],
                        'description' => $figureData['description'] ?? '',
                    ]);
                } else {
                    $figure->update([
                        'name' => $figureData['name'],
                        'description' => $figureData['description'] ?? '',
                    ]);
                }

                // Handle Image Upload
                if ($request->hasFile("figures.{$index}.image_file")) {
                    $path = $request->file("figures.{$index}.image_file")->store('figures', 'public');
                    $figure->update(['image_path' => '/storage/' . $path]);
                }
            }
        }

        return redirect()->back()->with('success', 'Kategori berhasil diperbarui.');
    }
}
