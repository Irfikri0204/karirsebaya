<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ModuleTopic;
use App\Models\TopicContent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class TopicContentController extends Controller
{
    public function index(ModuleTopic $topic)
    {
        $topic->load('module');
        $contents = $topic->contents()->get();

        return Inertia::render('Admin/TopicContents/Index', [
            'topic' => $topic,
            'contents' => $contents
        ]);
    }

    public function store(Request $request, ModuleTopic $topic)
    {
        $validated = $request->validate([
            'type' => 'required|in:text,image',
            'content' => 'required',
        ]);

        if ($validated['type'] === 'image') {
            $request->validate([
                'content' => 'image|max:5120' // max 5MB
            ]);
            $path = $request->file('content')->store('topics', 'public');
            $validated['content'] = '/storage/' . $path;
        }

        $validated['order'] = $topic->contents()->max('order') + 1;
        $topic->contents()->create($validated);

        return redirect()->back()->with('success', 'Konten berhasil ditambahkan.');
    }

    public function update(Request $request, TopicContent $content)
    {
        $validated = $request->validate([
            'content' => 'required',
        ]);

        if ($content->type === 'image') {
            if ($request->hasFile('content')) {
                $request->validate([
                    'content' => 'image|max:5120'
                ]);
                
                // Delete old image
                if (str_starts_with($content->content, '/storage/')) {
                    Storage::disk('public')->delete(str_replace('/storage/', '', $content->content));
                }
                
                $path = $request->file('content')->store('topics', 'public');
                $validated['content'] = '/storage/' . $path;
            } else {
                // If no new image, keep the old one (remove content from validated)
                unset($validated['content']);
            }
        }

        $content->update($validated);

        return redirect()->back()->with('success', 'Konten berhasil diperbarui.');
    }

    public function destroy(TopicContent $content)
    {
        if ($content->type === 'image' && str_starts_with($content->content, '/storage/')) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $content->content));
        }
        
        $content->delete();
        return redirect()->back()->with('success', 'Konten berhasil dihapus.');
    }

    public function reorder(Request $request, ModuleTopic $topic)
    {
        $validated = $request->validate([
            'contents' => 'required|array',
            'contents.*.id' => 'required|exists:topic_contents,id',
            'contents.*.order' => 'required|integer',
        ]);

        foreach ($validated['contents'] as $contentData) {
            TopicContent::where('id', $contentData['id'])->where('module_topic_id', $topic->id)->update(['order' => $contentData['order']]);
        }

        return redirect()->back()->with('success', 'Urutan konten berhasil diperbarui.');
    }

    public function bulkAction(Request $request, ModuleTopic $topic)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:topic_contents,id',
            'action' => 'required|in:delete'
        ]);

        if ($validated['action'] === 'delete') {
            $contents = TopicContent::whereIn('id', $validated['ids'])->where('module_topic_id', $topic->id)->get();
            foreach ($contents as $content) {
                if ($content->type === 'image' && str_starts_with($content->content, '/storage/')) {
                    Storage::disk('public')->delete(str_replace('/storage/', '', $content->content));
                }
                $content->delete();
            }
            return redirect()->back()->with('success', 'Konten yang dipilih berhasil dihapus.');
        }

        return redirect()->back();
    }
}
