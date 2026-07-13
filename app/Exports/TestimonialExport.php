<?php

namespace App\Exports;

use App\Models\Testimonial;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class TestimonialExport implements FromCollection, WithHeadings, WithMapping, WithStyles, ShouldAutoSize
{
    public function collection()
    {
        return Testimonial::latest()->get();
    }

    public function map($testimonial): array
    {
        return [
            $testimonial->name,
            $testimonial->institution,
            $testimonial->message,
            $testimonial->rating . ' Bintang',
            $testimonial->is_hidden ? 'Ya' : 'Tidak',
            $testimonial->is_featured ? 'Ya' : 'Tidak',
            $testimonial->created_at->format('d/m/Y H:i'),
        ];
    }

    public function headings(): array
    {
        return [
            'Nama Lengkap',
            'Institusi / Universitas',
            'Pesan Testimoni',
            'Rating',
            'Disembunyikan',
            'Diunggulkan',
            'Tanggal Dibuat',
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1    => ['font' => ['bold' => true]],
        ];
    }
}
