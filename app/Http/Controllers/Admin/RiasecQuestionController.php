<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\RiasecQuestion;
use App\Models\RiasecCategory;
use Inertia\Inertia;

class RiasecQuestionController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Riasec/Questions/Index', [
            'questions' => RiasecQuestion::with('category')->get(),
            'categories' => RiasecCategory::all(['code', 'name'])
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_code' => 'required|exists:riasec_categories,code',
            'question_text' => 'required|string',
            'options' => 'required|array|min:2',
            'options.*.text' => 'required|string',
            'options.*.score' => 'required|numeric',
        ]);

        RiasecQuestion::create($validated);
        return redirect()->back()->with('success', 'Pertanyaan berhasil ditambahkan.');
    }

    public function update(Request $request, RiasecQuestion $question)
    {
        $validated = $request->validate([
            'category_code' => 'required|exists:riasec_categories,code',
            'question_text' => 'required|string',
            'options' => 'required|array|min:2',
            'options.*.text' => 'required|string',
            'options.*.score' => 'required|numeric',
        ]);

        $question->update($validated);
        return redirect()->back()->with('success', 'Pertanyaan berhasil diperbarui.');
    }

    public function destroy(RiasecQuestion $question)
    {
        $question->delete();
        return redirect()->back()->with('success', 'Pertanyaan dihapus.');
    }
}
