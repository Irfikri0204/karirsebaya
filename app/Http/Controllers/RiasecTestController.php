<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\RiasecQuestion;
use App\Models\RiasecCategory;
use App\Models\RiasecTestResult;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class RiasecTestController extends Controller
{
    public function index()
    {
        return Inertia::render('TesKarir/Index');
    }

    public function create()
    {
        $settings = \App\Models\Setting::pluck('value', 'key')->toArray();
        if (($settings['test_is_open'] ?? '0') === '0') {
            return redirect()->route('tes-karir.index')->with('error', 'Tes karir saat ini ditutup.');
        }

        $questions = RiasecQuestion::inRandomOrder()->get();
        return Inertia::render('TesKarir/Test', [
            'questions' => $questions
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'answers' => 'required|array',
            'answers.*.question_id' => 'required|exists:riasec_questions,id',
            'answers.*.score' => 'required|numeric'
        ]);

        $scores = [
            'R' => 0, 'I' => 0, 'A' => 0, 'S' => 0, 'E' => 0, 'C' => 0
        ];

        foreach ($validated['answers'] as $answer) {
            $question = RiasecQuestion::find($answer['question_id']);
            if (isset($scores[$question->category_code])) {
                $scores[$question->category_code] += $answer['score'];
            }
        }

        // Determine primary category (highest score)
        $primary_category = array_keys($scores, max($scores))[0];

        $result = RiasecTestResult::create([
            'user_id' => Auth::id(),
            'scores' => $scores,
            'primary_category_code' => $primary_category
        ]);

        return redirect()->route('tes-karir.result', $result->uuid);
    }

    public function show(RiasecTestResult $result)
    {
        if ($result->user_id !== Auth::id() && Auth::user()->role !== 'admin') {
            abort(403);
        }

        return Inertia::render('TesKarir/Result', [
            'result' => $result->load('primaryCategory'),
            'allCategories' => RiasecCategory::with(['professions', 'figures'])->get()
        ]);
    }
}
