import { Head, useForm, router, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { FormEventHandler, useState } from 'react';
import Modal from '@/Components/Modal';

interface Module {
    id: number;
    title: string;
    hashtag: string | null;
    introduction: string | null;
    cover_image: string | null;
    is_active: boolean;
    order: number;
}

interface Props {
    modules: Module[];
}

export default function ModulesIndex({ modules }: Props) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingModule, setEditingModule] = useState<Module | null>(null);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        title: '',
        hashtag: '',
        introduction: '',
        is_active: true,
        cover_image: null as File | null,
    });

    const openCreateModal = () => {
        setEditingModule(null);
        reset();
        clearErrors();
        setIsCreateModalOpen(true);
    };

    const openEditModal = (mod: Module) => {
        setEditingModule(mod);
        setData({
            title: mod.title,
            hashtag: mod.hashtag || '',
            introduction: mod.introduction || '',
            is_active: mod.is_active,
            cover_image: null,
        });
        clearErrors();
        setIsCreateModalOpen(true);
    };

    const closeCreateModal = () => {
        setIsCreateModalOpen(false);
        setTimeout(() => reset(), 200);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (editingModule) {
            router.post(route('admin.modules.update', editingModule.id), {
                _method: 'put',
                title: data.title,
                hashtag: data.hashtag,
                introduction: data.introduction,
                is_active: data.is_active,
                ...(data.cover_image && { cover_image: data.cover_image })
            }, {
                onSuccess: () => closeCreateModal(),
            });
        } else {
            post(route('admin.modules.store'), {
                onSuccess: () => closeCreateModal(),
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus modul ini?')) {
            router.delete(route('admin.modules.destroy', id));
        }
    };

    const moveItem = (index: number, direction: 'up' | 'down') => {
        const newModules = [...modules];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        
        if (targetIndex >= 0 && targetIndex < newModules.length) {
            const temp = newModules[index];
            newModules[index] = newModules[targetIndex];
            newModules[targetIndex] = temp;
            
            const updatedModules = newModules.map((item, i) => ({
                id: item.id,
                order: i
            }));

            router.post(route('admin.modules.reorder'), { modules: updatedModules });
        }
    };

    return (
        <AdminLayout header="Manajemen Modul Edukasi">
            <Head title="Manajemen Modul - Admin Karir Sebaya" />

            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Modul Edukasi</h2>
                    <p className="text-sm text-gray-500">Kelola modul PDF atau tautan referensi karir untuk pengguna.</p>
                </div>
                <button 
                    onClick={openCreateModal}
                    className="bg-brand-primary hover:bg-brand-purple text-white px-5 py-2.5 rounded-full font-bold shadow-lg shadow-purple-900/20 transition-all flex items-center gap-2"
                >
                    <i className="ph ph-plus-circle text-lg"></i>
                    Tambah Modul
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 text-gray-700 font-medium border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 w-16">Urutan</th>
                            <th className="px-6 py-4">Informasi Modul</th>
                            <th className="px-6 py-4">Hashtag</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {modules.length > 0 ? (
                            modules.map((mod, index) => (
                                <tr key={mod.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col items-center gap-1">
                                            <button 
                                                onClick={() => moveItem(index, 'up')}
                                                disabled={index === 0}
                                                className="text-gray-400 hover:text-brand-primary disabled:opacity-30"
                                            >
                                                <i className="ph-fill ph-caret-up"></i>
                                            </button>
                                            <button 
                                                onClick={() => moveItem(index, 'down')}
                                                disabled={index === modules.length - 1}
                                                className="text-gray-400 hover:text-brand-primary disabled:opacity-30"
                                            >
                                                <i className="ph-fill ph-caret-down"></i>
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 shrink-0 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center text-gray-400">
                                                {mod.cover_image ? (
                                                    <img src={mod.cover_image} alt={mod.title} className="w-full h-full object-cover" />
                                                ) : (
                                                    <i className="ph ph-image text-2xl"></i>
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900 text-base mb-1">{mod.title}</h3>
                                                <p className="text-sm text-gray-500 line-clamp-2 max-w-sm">{mod.introduction || 'Tidak ada pengantar'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {mod.hashtag ? (
                                            <span className="text-brand-primary font-medium">{mod.hashtag}</span>
                                        ) : '-'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${mod.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                            {mod.is_active ? 'Aktif' : 'Nonaktif'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link href={route('admin.modules.show', mod.id)} className="w-8 h-8 rounded-full bg-brand-primary/10 text-brand-primary hover:bg-brand-primary hover:text-white flex items-center justify-center transition-colors" title="Kelola Topik">
                                                <i className="ph ph-list-dashes"></i>
                                            </Link>
                                            <button onClick={() => openEditModal(mod)} className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition-colors" title="Edit Modul">
                                                <i className="ph ph-pencil-simple"></i>
                                            </button>
                                            <button onClick={() => handleDelete(mod.id)} className="w-8 h-8 rounded-full bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center transition-colors">
                                                <i className="ph ph-trash"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                    Belum ada modul edukasi.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Modal show={isCreateModalOpen} onClose={closeCreateModal} maxWidth="md">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
                        <h2 className="text-xl font-bold text-gray-900 font-serif">
                            {editingModule ? 'Edit Modul' : 'Tambah Modul Baru'}
                        </h2>
                        <button onClick={closeCreateModal} className="text-gray-400 hover:text-gray-600">
                            <i className="ph ph-x text-xl"></i>
                        </button>
                    </div>

                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Judul Modul</label>
                            <input 
                                type="text" 
                                value={data.title}
                                onChange={e => setData('title', e.target.value)}
                                className="w-full rounded-xl border-gray-300 focus:border-brand-primary focus:ring-brand-primary"
                                placeholder="Contoh: Modul Wawancara Sukses"
                                required
                            />
                            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Hashtag Singkat</label>
                            <input 
                                type="text" 
                                value={data.hashtag}
                                onChange={e => setData('hashtag', e.target.value)}
                                className="w-full rounded-xl border-gray-300 focus:border-brand-primary focus:ring-brand-primary"
                                placeholder="Contoh: karir, tips, loker"
                            />
                            {errors.hashtag && <p className="text-red-500 text-xs mt-1">{errors.hashtag}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Pengantar Modul</label>
                            <textarea 
                                rows={3}
                                value={data.introduction}
                                onChange={e => setData('introduction', e.target.value)}
                                className="w-full rounded-xl border-gray-300 focus:border-brand-primary focus:ring-brand-primary"
                                placeholder="Pengantar singkat modul ini..."
                            />
                            {errors.introduction && <p className="text-red-500 text-xs mt-1">{errors.introduction}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Gambar Cover (Opsional)</label>
                            {editingModule?.cover_image && (
                                <div className="mb-2 w-32 h-32 rounded-lg overflow-hidden border">
                                    <img src={editingModule.cover_image} className="w-full h-full object-cover" />
                                </div>
                            )}
                            <input 
                                type="file" 
                                accept="image/*"
                                onChange={e => setData('cover_image', e.target.files?.[0] || null)}
                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-light file:text-brand-primary hover:file:bg-brand-primary hover:file:text-white transition-all cursor-pointer"
                            />
                            {errors.cover_image && <p className="text-red-500 text-xs mt-1">{errors.cover_image}</p>}
                        </div>

                        <div className="pt-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    checked={data.is_active} 
                                    onChange={e => setData('is_active', e.target.checked)}
                                    className="rounded text-brand-primary focus:ring-brand-primary w-5 h-5"
                                />
                                <span className="text-sm font-medium text-gray-700">Aktif (Ditampilkan di Publik)</span>
                            </label>
                        </div>

                        <div className="pt-4 flex gap-3">
                            <button 
                                type="button" 
                                onClick={closeCreateModal}
                                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl transition-colors"
                            >
                                Batal
                            </button>
                            <button 
                                type="submit" 
                                disabled={processing}
                                className="flex-1 bg-brand-primary hover:bg-brand-purple text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50"
                            >
                                {processing ? 'Menyimpan...' : 'Simpan'}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </AdminLayout>
    );
}
