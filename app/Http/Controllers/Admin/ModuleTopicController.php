<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Module;
use App\Models\ModuleTopic;
use Illuminate\Http\Request;

class ModuleTopicController extends Controller
{
    public function store(Request $request, Module $module)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
        ]);

        $validated['order'] = $module->topics()->max('order') + 1;
        $module->topics()->create($validated);

        return redirect()->back()->with('success', 'Topik berhasil ditambahkan.');
    }

    public function update(Request $request, ModuleTopic $topic)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
        ]);

        $topic->update($validated);

        return redirect()->back()->with('success', 'Topik berhasil diperbarui.');
    }

    public function destroy(ModuleTopic $topic)
    {
        $topic->delete();
        return redirect()->back()->with('success', 'Topik berhasil dihapus.');
    }

    public function reorder(Request $request, Module $module)
    {
        $validated = $request->validate([
            'topics' => 'required|array',
            'topics.*.id' => 'required|exists:module_topics,id',
            'topics.*.order' => 'required|integer',
        ]);

        foreach ($validated['topics'] as $topicData) {
            ModuleTopic::where('id', $topicData['id'])->where('module_id', $module->id)->update(['order' => $topicData['order']]);
        }

        return redirect()->back()->with('success', 'Urutan topik berhasil diperbarui.');
    }
}
