<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\RiasecTestResult;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RiasecTestResultsController extends Controller
{
    public function index(Request $request)
    {
        $query = RiasecTestResult::with(['user', 'primaryCategory']);

        if ($request->search) {
            $query->whereHas('user', function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%')
                  ->orWhere('nim', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->category) {
            $query->where('primary_category_code', $request->category);
        }

        $results = $query->latest()->paginate(15)->withQueryString();
            
        return Inertia::render('Admin/Riasec/Results/Index', [
            'results' => $results,
            'filters' => $request->only(['search', 'category'])
        ]);
    }

    public function export()
    {
        $results = RiasecTestResult::with(['user', 'primaryCategory'])->latest()->get();

        $filename = "hasil-tes-minat-karir-" . date('Y-m-d') . ".csv";
        $headers = array(
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename=$filename",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        );

        $columns = ['Nama Pengguna', 'NIM', 'Asal Universitas', 'Program Studi', 'Semester', 'Email', 'Hasil Dominan', 'Kode Hasil', 'Skor R', 'Skor I', 'Skor A', 'Skor S', 'Skor E', 'Skor C', 'Tanggal Tes'];

        $callback = function() use($results, $columns) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $columns, ';'); // Use semicolon for better excel support in some regions

            foreach ($results as $result) {
                $row['Nama Pengguna']  = $result->user->name ?? 'User Terhapus';
                $row['NIM']    = $result->user->nim ?? '-';
                $row['Asal Universitas']    = $result->user->asal_instansi ?? '-';
                $row['Program Studi']    = $result->user->prodi ?? '-';
                $row['Semester']    = $result->user->semester ?? '-';
                $row['Email']    = $result->user->email ?? '-';
                $row['Hasil Dominan']  = $result->primaryCategory->name ?? '-';
                $row['Kode Hasil']  = $result->primary_category_code;
                $row['Skor R'] = $result->scores['R'] ?? 0;
                $row['Skor I'] = $result->scores['I'] ?? 0;
                $row['Skor A'] = $result->scores['A'] ?? 0;
                $row['Skor S'] = $result->scores['S'] ?? 0;
                $row['Skor E'] = $result->scores['E'] ?? 0;
                $row['Skor C'] = $result->scores['C'] ?? 0;
                $row['Tanggal Tes']  = $result->created_at->translatedFormat('j F Y');

                fputcsv($file, array(
                    $row['Nama Pengguna'], 
                    $row['NIM'], 
                    $row['Asal Universitas'], 
                    $row['Program Studi'], 
                    $row['Semester'], 
                    $row['Email'], 
                    $row['Hasil Dominan'], 
                    $row['Kode Hasil'], 
                    $row['Skor R'],
                    $row['Skor I'],
                    $row['Skor A'],
                    $row['Skor S'],
                    $row['Skor E'],
                    $row['Skor C'],
                    $row['Tanggal Tes']
                ), ';');
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    public function bulkAction(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:riasec_test_results,id',
            'action' => 'required|in:delete'
        ]);

        if ($validated['action'] === 'delete') {
            RiasecTestResult::whereIn('id', $validated['ids'])->delete();
            return redirect()->back()->with('success', 'Data hasil tes yang dipilih berhasil dihapus.');
        }

        return redirect()->back();
    }
}
