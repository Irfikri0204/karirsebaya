import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { FormEventHandler, useState, useMemo } from 'react';

interface Testimonial {
    id: number;
    name: string;
    institution: string;
    message: string;
    rating: number;
    is_hidden: boolean;
    is_featured: boolean;
    avatar_initials: string | null;
    avatar_color: string;
    created_at: string;
}

interface Props {
    testimonials: Testimonial[];
}

export default function TestimonialsIndex({ testimonials }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const { data, setData, post, put, processing, reset, errors } = useForm({
        name: '',
        institution: '',
        message: '',
        rating: 5,
        is_hidden: false,
        is_featured: false,
        avatar_initials: '',
        avatar_color: 'blue',
    });

    const openCreateModal = () => {
        setEditingTestimonial(null);
        reset();
        setIsModalOpen(true);
    };

    const openEditModal = (testimonial: Testimonial) => {
        setEditingTestimonial(testimonial);
        setData({
            name: testimonial.name,
            institution: testimonial.institution,
            message: testimonial.message,
            rating: testimonial.rating,
            is_hidden: Boolean(testimonial.is_hidden),
            is_featured: Boolean(testimonial.is_featured),
            avatar_initials: testimonial.avatar_initials || '',
            avatar_color: testimonial.avatar_color,
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        
        if (editingTestimonial) {
            put(route('admin.testimonials.update', editingTestimonial.id), {
                onSuccess: () => closeModal(),
            });
        } else {
            post(route('admin.testimonials.store'), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const deleteTestimonial = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus testimoni ini?')) {
            router.delete(route('admin.testimonials.destroy', id));
        }
    };

    // Bulk Actions
    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedIds(testimonials.map(t => t.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectOne = (id: number) => {
        setSelectedIds(prev => 
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const handleBulkAction = (action: 'delete' | 'show' | 'hide') => {
        if (selectedIds.length === 0) return;
        
        let confirmMessage = '';
        if (action === 'delete') confirmMessage = `Hapus ${selectedIds.length} testimoni terpilih? Tindakan ini tidak dapat dibatalkan.`;
        if (action === 'show') confirmMessage = `Tampilkan ${selectedIds.length} testimoni terpilih?`;
        if (action === 'hide') confirmMessage = `Sembunyikan ${selectedIds.length} testimoni terpilih?`;

        if (confirm(confirmMessage)) {
            router.post(route('admin.testimonials.bulk'), {
                ids: selectedIds,
                action: action
            }, {
                onSuccess: () => setSelectedIds([])
            });
        }
    };

    const filteredTestimonials = useMemo(() => {
        return testimonials.filter(t => {
            // Text search
            const matchesSearch = !searchQuery || 
                t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                t.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
                t.message.toLowerCase().includes(searchQuery.toLowerCase());
            
            // Status filter
            let matchesStatus = true;
            if (statusFilter === 'featured') matchesStatus = Boolean(t.is_featured) && !Boolean(t.is_hidden);
            else if (statusFilter === 'hidden') matchesStatus = Boolean(t.is_hidden);
            else if (statusFilter === 'visible') matchesStatus = !Boolean(t.is_hidden);
            
            return matchesSearch && matchesStatus;
        });
    }, [testimonials, searchQuery, statusFilter]);

    return (
        <AdminLayout header="Kelola Testimoni">
            <Head title="Testimoni - Admin Karir Sebaya" />

            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Daftar Testimoni</h2>
                    <p className="text-sm text-gray-500">Kelola cerita sukses dari pengguna platform.</p>
                </div>
                <button 
                    onClick={openCreateModal}
                    className="bg-brand-primary hover:bg-brand-purple text-white px-6 py-2.5 rounded-full font-bold shadow-lg shadow-brand-primary/30 transition-all flex items-center gap-2"
                >
                    <i className="ph ph-plus-circle text-lg"></i>
                    Tambah Testimoni
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden relative">
                {selectedIds.length > 0 && (
                    <div className="absolute top-0 left-0 right-0 h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-20 animate-fade-in">
                        <span className="font-bold text-brand-primary">
                            {selectedIds.length} item dipilih
                        </span>
                        <div className="flex gap-2">
                            <button onClick={() => handleBulkAction('show')} className="px-3 py-1.5 text-sm font-bold bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                                Tampilkan
                            </button>
                            <button onClick={() => handleBulkAction('hide')} className="px-3 py-1.5 text-sm font-bold bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors">
                                Sembunyikan
                            </button>
                            <button onClick={() => handleBulkAction('delete')} className="px-3 py-1.5 text-sm font-bold bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                                Hapus
                            </button>
                        </div>
                    </div>
                )}

                <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/50">
                    <div className="flex flex-col md:flex-row items-center gap-3">
                        <div className="relative w-full md:w-64">
                            <i className="ph ph-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                            <input 
                                type="text" 
                                placeholder="Cari nama, instansi, atau pesan..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 pr-4 py-2 w-full rounded-xl border-gray-200 focus:border-brand-primary focus:ring-brand-primary text-sm shadow-sm"
                            />
                        </div>
                        <select 
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full md:w-auto py-2 px-4 rounded-xl border-gray-200 focus:border-brand-primary focus:ring-brand-primary text-sm shadow-sm bg-white"
                        >
                            <option value="all">Semua Status</option>
                            <option value="visible">Ditampilkan</option>
                            <option value="hidden">Disembunyikan</option>
                            <option value="featured">Pilihan (Featured)</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600 min-w-[800px]">
                        <thead className="bg-gray-50 text-gray-700 font-medium border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 w-10">
                                    <input 
                                        type="checkbox" 
                                        className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
                                        checked={filteredTestimonials.length > 0 && selectedIds.length === filteredTestimonials.length}
                                        onChange={(e) => {
                                            if (e.target.checked) setSelectedIds(filteredTestimonials.map(t => t.id));
                                            else setSelectedIds([]);
                                        }}
                                    />
                                </th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Pesan</th>
                                <th className="px-6 py-4">Penulis</th>
                                <th className="px-6 py-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredTestimonials.length > 0 ? (
                            filteredTestimonials.map((testimonial) => (
                                <tr key={testimonial.id} className={`hover:bg-gray-50/50 transition-colors ${selectedIds.includes(testimonial.id) ? 'bg-brand-primary/5' : ''}`}>
                                    <td className="px-6 py-4">
                                        <input 
                                            type="checkbox" 
                                            className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
                                            checked={selectedIds.includes(testimonial.id)}
                                            onChange={() => handleSelectOne(testimonial.id)}
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            {Boolean(testimonial.is_hidden) ? (
                                                <span className="px-2 py-1 rounded bg-red-100 text-red-700 text-[10px] font-bold uppercase w-max">Sembunyikan</span>
                                            ) : (
                                                <span className="px-2 py-1 rounded bg-green-100 text-green-700 text-[10px] font-bold uppercase w-max">Tampil</span>
                                            )}
                                            {Boolean(testimonial.is_featured) && !Boolean(testimonial.is_hidden) && (
                                                <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-700 text-[10px] font-bold uppercase w-max"><i className="ph-fill ph-star mr-1"></i>Pilihan</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 w-1/3">
                                        <div className="flex text-yellow-400 text-xs mb-1">
                                            {[...Array(testimonial.rating)].map((_, i) => <i key={i} className="ph-fill ph-star"></i>)}
                                        </div>
                                        <p className="text-gray-600 italic text-xs line-clamp-3">"{testimonial.message}"</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs bg-${testimonial.avatar_color}-100 text-${testimonial.avatar_color}-600`}>
                                                {testimonial.avatar_initials || testimonial.name.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900">{testimonial.name}</p>
                                                <p className="text-xs text-gray-500">{testimonial.institution}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-3">
                                        <button onClick={() => openEditModal(testimonial)} className="text-brand-primary hover:text-brand-purple">
                                            Edit
                                        </button>
                                        <button onClick={() => deleteTestimonial(testimonial.id)} className="text-red-500 hover:text-red-700">
                                            Hapus
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <i className="ph ph-chat-centered-text text-4xl text-gray-300"></i>
                                        <p>Tidak ada data testimoni yang ditemukan.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-900/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 sticky top-0 z-10">
                            <h3 className="font-bold text-gray-900 text-lg">
                                {editingTestimonial ? 'Edit Testimoni' : 'Tambah Testimoni Baru'}
                            </h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                                <i className="ph ph-x text-xl"></i>
                            </button>
                        </div>
                        
                        <form onSubmit={submit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Penulis</label>
                                    <input 
                                        type="text" 
                                        value={data.name} 
                                        onChange={e => setData('name', e.target.value)}
                                        className="w-full rounded-xl border-gray-300 focus:border-brand-primary focus:ring-brand-primary"
                                        required
                                    />
                                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Inisial Avatar (Max 2)</label>
                                    <input 
                                        type="text" 
                                        value={data.avatar_initials} 
                                        onChange={e => setData('avatar_initials', e.target.value.substring(0, 2).toUpperCase())}
                                        className="w-full rounded-xl border-gray-300 focus:border-brand-primary focus:ring-brand-primary uppercase"
                                        placeholder="AF"
                                    />
                                    {errors.avatar_initials && <p className="text-red-500 text-xs mt-1">{errors.avatar_initials}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Asal Instansi / Pekerjaan</label>
                                <input 
                                    type="text" 
                                    value={data.institution} 
                                    onChange={e => setData('institution', e.target.value)}
                                    className="w-full rounded-xl border-gray-300 focus:border-brand-primary focus:ring-brand-primary"
                                    placeholder="Mahasiswa Sistem Informasi, UI"
                                    required
                                />
                                {errors.institution && <p className="text-red-500 text-xs mt-1">{errors.institution}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Kesan / Pesan (Quote)</label>
                                <textarea 
                                    rows={4}
                                    value={data.message} 
                                    onChange={e => setData('message', e.target.value)}
                                    className="w-full rounded-xl border-gray-300 focus:border-brand-primary focus:ring-brand-primary resize-none"
                                    required
                                />
                                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Warna Avatar</label>
                                    <select 
                                        value={data.avatar_color} 
                                        onChange={e => setData('avatar_color', e.target.value)}
                                        className="w-full rounded-xl border-gray-300 focus:border-brand-primary focus:ring-brand-primary"
                                    >
                                        <option value="blue">Biru</option>
                                        <option value="pink">Pink</option>
                                        <option value="purple">Ungu</option>
                                        <option value="teal">Teal</option>
                                        <option value="orange">Orange</option>
                                        <option value="green">Hijau</option>
                                    </select>
                                    {errors.avatar_color && <p className="text-red-500 text-xs mt-1">{errors.avatar_color}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Rating Bintang (1-5)</label>
                                    <input 
                                        type="number"
                                        min={1}
                                        max={5}
                                        value={data.rating} 
                                        onChange={e => setData('rating', parseInt(e.target.value))}
                                        className="w-full rounded-xl border-gray-300 focus:border-brand-primary focus:ring-brand-primary"
                                        required
                                    />
                                    {errors.rating && <p className="text-red-500 text-xs mt-1">{errors.rating}</p>}
                                </div>
                            </div>
                            
                            <div className="pt-2">
                                <label className="flex items-center gap-2 cursor-pointer p-3 border rounded-xl bg-gray-50 hover:bg-gray-100 mb-2">
                                    <input 
                                        type="checkbox" 
                                        checked={data.is_featured} 
                                        onChange={e => {
                                            setData('is_featured', e.target.checked);
                                            if (e.target.checked) setData('is_hidden', false);
                                        }}
                                        className="rounded text-brand-primary focus:ring-brand-primary w-5 h-5"
                                    />
                                    <div>
                                        <span className="text-sm font-bold text-gray-900 block">Jadikan Pilihan (Featured)</span>
                                        <span className="text-xs text-gray-500">Akan diprioritaskan tampil di Beranda jika mode Testimoni Beranda diatur ke Manual.</span>
                                    </div>
                                </label>

                                <label className="flex items-center gap-2 cursor-pointer p-3 border rounded-xl bg-gray-50 hover:bg-gray-100">
                                    <input 
                                        type="checkbox" 
                                        checked={data.is_hidden} 
                                        onChange={e => {
                                            setData('is_hidden', e.target.checked);
                                            if (e.target.checked) setData('is_featured', false);
                                        }}
                                        className="rounded text-brand-primary focus:ring-brand-primary w-5 h-5"
                                    />
                                    <div>
                                        <span className="text-sm font-bold text-gray-900 block">Sembunyikan (Hide)</span>
                                        <span className="text-xs text-gray-500">Testimoni ini tidak akan tampil di mana pun.</span>
                                    </div>
                                </label>
                            </div>

                            <div className="pt-4 flex gap-3 justify-end sticky bottom-0 bg-white">
                                <button 
                                    type="button" 
                                    onClick={closeModal}
                                    className="px-6 py-2.5 rounded-full font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                                >
                                    Batal
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={processing}
                                    className="bg-brand-primary hover:bg-brand-purple text-white px-6 py-2.5 rounded-full font-bold shadow-lg shadow-brand-primary/30 transition-all disabled:opacity-50"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan Data'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
