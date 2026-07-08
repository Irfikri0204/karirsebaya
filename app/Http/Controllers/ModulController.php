<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Module;

class ModulController extends Controller
{
    public function index()
    {
        $modules = Module::where('is_active', true)->orderBy('order')->get();
        return Inertia::render('Modul/Index', [
            'modules' => $modules
        ]);
    }

    public function show($id)
    {
        $module = Module::with(['topics' => function($query) {
            $query->orderBy('order')->with(['contents' => function($q) {
                $q->orderBy('order');
            }]);
        }])->where('is_active', true)->findOrFail($id);

        return Inertia::render('Modul/Show', [
            'module' => $module
        ]);
    }
}
