import { Head, Link, router } from '@inertiajs/react';
import { useState, useCallback } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';

interface RiasecTestResult {
    id: number;
    uuid: string;
    primary_category_code: string;
    created_at: string;
    user: {
        name: string;
        email: string;
    };
    primary_category: {
        name: string;
    };
}

interface PaginationData {
    data: RiasecTestResult[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number;
    last_page: number;
    total: number;
}

interface Props {
    results: PaginationData;
    filters: {
        search?: string;
        category?: string;
    };
}

export default function ResultsIndex({ results, filters }: Props) {
    const [searchQuery, setSearchQuery] = useState(filters?.search || '');
    const [categoryFilter, setCategoryFilter] = useState(filters?.category || '');
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const applyFilters = (search: string, category: string) => {
        router.get(
            route('admin.riasec.results.index'),
            { search, category },
            { preserveState: true, replace: true, preserveScroll: true }
        );
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            applyFilters(searchQuery, categoryFilter);
        }
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        setCategoryFilter(val);
        applyFilters(searchQuery, val);
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedIds(results.data.map(r => r.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelect = (id: number) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const handleBulkDelete = () => {
        if (selectedIds.length === 0) return;
        if (confirm(`Apakah Anda yakin ingin menghapus ${selectedIds.length} data hasil tes yang dipilih?`)) {
            router.post(route('admin.riasec.results.bulk'), {
                ids: selectedIds,
                action: 'delete'
            }, {
                onSuccess: () => setSelectedIds([])
            });
        }
    };
    return (
        <AdminLayout header="Data Hasil Tes Minat Karir">
            <Head title="Hasil Tes - Admin Karir Sebaya" />

            <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Hasil Tes Pengguna</h2>
                    <p className="text-sm text-gray-500">Melihat daftar hasil tes pengguna yang telah diselesaikan.</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    {selectedIds.length > 0 && (
                        <button 
                            onClick={handleBulkDelete}
                            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 rounded-full font-bold shadow-lg shadow-red-500/30 transition-all flex items-center gap-2"
                        >
                            <i className="ph ph-trash text-lg"></i>
                            Hapus Terpilih ({selectedIds.length})
                        </button>
                    )}
                    <a 
                        href={route('admin.riasec.results.export')}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-full font-bold shadow-lg shadow-green-900/20 transition-all flex items-center gap-2"
                    >
                        <i className="ph ph-file-csv text-lg"></i>
                        Export Data (CSV)
                    </a>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/50">
                    <div className="flex flex-col md:flex-row items-center gap-3 w-full">
                        <div className="relative w-full md:w-96">
                            <i className="ph ph-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                            <input 
                                type="text" 
                                placeholder="Cari nama, email, atau NIM (Tekan Enter)..." 
                                value={searchQuery}
                                onChange={handleSearchChange}
                                onKeyDown={handleSearchKeyDown}
                                className="pl-9 pr-4 py-2 w-full rounded-xl border-gray-200 focus:border-brand-primary focus:ring-brand-primary text-sm shadow-sm"
                            />
                        </div>
                        <select 
                            value={categoryFilter}
                            onChange={handleCategoryChange}
                            className="w-full md:w-48 py-2 px-4 rounded-xl border-gray-200 focus:border-brand-primary focus:ring-brand-primary text-sm shadow-sm bg-white"
                        >
                            <option value="">Semua Kategori</option>
                            <option value="R">Realistic (R)</option>
                            <option value="I">Investigative (I)</option>
                            <option value="A">Artistic (A)</option>
                            <option value="S">Social (S)</option>
                            <option value="E">Enterprising (E)</option>
                            <option value="C">Conventional (C)</option>
                        </select>
                        {(searchQuery || categoryFilter) && (
                            <button 
                                onClick={() => {
                                    setSearchQuery('');
                                    setCategoryFilter('');
                                    applyFilters('', '');
                                }}
                                className="px-4 py-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors"
                            >
                                Reset
                            </button>
                        )}
                    </div>
                </div>

                <div className="overflow-x-auto w-full overflow-y-hidden border-t border-gray-100">
                    <table className="w-full text-left text-sm text-gray-600 min-w-[800px]">
                    <thead className="bg-gray-50 text-gray-700 font-medium border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 w-12 text-center">
                                <input 
                                    type="checkbox" 
                                    className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary cursor-pointer"
                                    checked={results.data.length > 0 && selectedIds.length === results.data.length}
                                    onChange={handleSelectAll}
                                />
                            </th>
                            <th className="px-6 py-4">Nama Pengguna</th>
                            <th className="px-6 py-4">Email</th>
                            <th className="px-6 py-4">Hasil Dominan</th>
                            <th className="px-6 py-4">Tanggal Tes</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {results.data.length > 0 ? (
                            results.data.map((result) => (
                                <tr key={result.uuid} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 text-center">
                                        <input 
                                            type="checkbox" 
                                            className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary cursor-pointer"
                                            checked={selectedIds.includes(result.id)}
                                            onChange={() => handleSelect(result.id)}
                                        />
                                    </td>
                                    <td className="px-6 py-4 font-bold text-gray-900">
                                        {result.user ? result.user.name : <span className="text-gray-400 italic">User Terhapus</span>}
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">
                                        {result.user ? result.user.email : '-'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="inline-flex items-center gap-2">
                                            <span className="w-8 h-8 rounded-full bg-brand-light text-brand-primary flex items-center justify-center font-bold text-xs">
                                                {result.primary_category_code}
                                            </span>
                                            <span className="font-medium text-gray-700">{result.primary_category?.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {new Date(result.created_at).toLocaleDateString('id-ID', {
                                            day: 'numeric', month: 'long', year: 'numeric',
                                            hour: '2-digit', minute: '2-digit'
                                        })}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                    Belum ada data hasil tes.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                
                {/* Pagination */}
                {results.links && results.links.length > 3 && (
                    <div className="px-6 py-4 border-t border-gray-200 flex justify-center">
                        <div className="flex flex-wrap gap-1">
                            {results.links.map((link, k) => (
                                <Link
                                    key={k}
                                    href={link.url || '#'}
                                    className={`px-3 py-1 rounded-md text-sm border ${
                                        link.active 
                                            ? 'bg-brand-primary text-white border-brand-primary font-bold' 
                                            : link.url 
                                                ? 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300' 
                                                : 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
                </div>
            </div>
        </AdminLayout>
    );
}


