import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { FormEventHandler, useState, useEffect } from 'react';

interface Feature {
    id: number;
    title: string;
    description: string;
    icon: string;
    order: number;
}

interface Props {
    features: Feature[];
}

export default function FeaturesIndex({ features }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingFeature, setEditingFeature] = useState<Feature | null>(null);
    const [localFeatures, setLocalFeatures] = useState<Feature[]>([]);
    const [isOrderChanged, setIsOrderChanged] = useState(false);

    useEffect(() => {
        setLocalFeatures([...features].sort((a, b) => a.order - b.order));
        setIsOrderChanged(false);
    }, [features]);

    const { data, setData, post, put, processing, reset, errors } = useForm({
        title: '',
        description: '',
        icon: 'ph-check-circle',
        order: 0,
    });

    const openCreateModal = () => {
        setEditingFeature(null);
        reset();
        setIsModalOpen(true);
    };

    const openEditModal = (feature: Feature) => {
        setEditingFeature(feature);
        setData({
            title: feature.title,
            description: feature.description,
            icon: feature.icon,
            order: feature.order,
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        
        if (editingFeature) {
            put(route('admin.features.update', editingFeature.id), {
                onSuccess: () => closeModal(),
            });
        } else {
            post(route('admin.features.store'), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const deleteFeature = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus keunggulan ini?')) {
            router.delete(route('admin.features.destroy', id));
        }
    };

    const moveRow = (index: number, direction: 'up' | 'down') => {
        const newFeatures = [...localFeatures];
        if (direction === 'up' && index > 0) {
            const temp = newFeatures[index];
            newFeatures[index] = newFeatures[index - 1];
            newFeatures[index - 1] = temp;
        } else if (direction === 'down' && index < newFeatures.length - 1) {
            const temp = newFeatures[index];
            newFeatures[index] = newFeatures[index + 1];
            newFeatures[index + 1] = temp;
        } else {
            return;
        }
        
        // Update order values
        const updatedFeatures = newFeatures.map((f, idx) => ({
            ...f,
            order: idx + 1
        }));
        
        setLocalFeatures(updatedFeatures);
        setIsOrderChanged(true);
    };

    const saveOrder = () => {
        router.post(route('admin.features.reorder'), {
            items: localFeatures.map(f => ({ id: f.id, order: f.order }))
        }, {
            preserveScroll: true,
            onSuccess: () => setIsOrderChanged(false)
        });
    };

    return (
        <AdminLayout header="Kelola Keunggulan Utama">
            <Head title="Keunggulan Utama - Admin Karir Sebaya" />

            <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Daftar Keunggulan</h2>
                    <p className="text-sm text-gray-500">Atur "Beda dari Platform Lain" di halaman Beranda.</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    {isOrderChanged && (
                        <button 
                            onClick={saveOrder}
                            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2.5 rounded-full font-bold shadow-lg shadow-green-500/30 transition-all flex items-center gap-2 animate-pulse"
                        >
                            <i className="ph ph-floppy-disk text-lg"></i>
                            Simpan Urutan
                        </button>
                    )}
                    <button 
                        onClick={openCreateModal}
                        className="bg-brand-primary hover:bg-brand-purple text-white px-6 py-2.5 rounded-full font-bold shadow-lg shadow-brand-primary/30 transition-all flex items-center gap-2"
                    >
                        <i className="ph ph-plus-circle text-lg"></i>
                        Tambah Keunggulan
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto w-full overflow-y-hidden border-t border-gray-100">
                    <table className="w-full text-left text-sm text-gray-600 min-w-[800px]">
                        <thead className="bg-gray-50 text-gray-700 font-medium border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4">Urutan</th>
                            <th className="px-6 py-4">Icon</th>
                            <th className="px-6 py-4">Judul</th>
                            <th className="px-6 py-4">Deskripsi</th>
                            <th className="px-6 py-4 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {localFeatures.length > 0 ? (
                            localFeatures.map((feature, index) => (
                                <tr key={feature.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <div className="flex flex-col gap-1">
                                                <button 
                                                    onClick={() => moveRow(index, 'up')}
                                                    disabled={index === 0}
                                                    className="text-gray-400 hover:text-brand-primary disabled:opacity-30 disabled:hover:text-gray-400 transition-colors"
                                                >
                                                    <i className="ph-fill ph-caret-up text-lg"></i>
                                                </button>
                                                <button 
                                                    onClick={() => moveRow(index, 'down')}
                                                    disabled={index === localFeatures.length - 1}
                                                    className="text-gray-400 hover:text-brand-primary disabled:opacity-30 disabled:hover:text-gray-400 transition-colors"
                                                >
                                                    <i className="ph-fill ph-caret-down text-lg"></i>
                                                </button>
                                            </div>
                                            <span className="font-bold text-gray-900 bg-gray-100 w-8 h-8 rounded-lg flex items-center justify-center">{feature.order}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-2xl text-brand-primary"><i className={`ph ${feature.icon}`}></i></td>
                                    <td className="px-6 py-4 font-bold text-gray-900">{feature.title}</td>
                                    <td className="px-6 py-4">{feature.description}</td>
                                    <td className="px-6 py-4 text-right space-x-3">
                                        <button onClick={() => openEditModal(feature)} className="text-brand-primary hover:text-brand-purple font-medium">
                                            Edit
                                        </button>
                                        <button onClick={() => deleteFeature(feature.id)} className="text-red-500 hover:text-red-700 font-medium">
                                            Hapus
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                    Belum ada data keunggulan.
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
                    <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="font-bold text-gray-900 text-lg">
                                {editingFeature ? 'Edit Keunggulan' : 'Tambah Keunggulan Baru'}
                            </h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                                <i className="ph ph-x text-xl"></i>
                            </button>
                        </div>
                        
                        <form onSubmit={submit} className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Judul Keunggulan</label>
                                <input 
                                    type="text" 
                                    value={data.title} 
                                    onChange={e => setData('title', e.target.value)}
                                    className="w-full rounded-xl border-gray-300 focus:border-brand-primary focus:ring-brand-primary"
                                    required
                                />
                                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Singkat</label>
                                <textarea 
                                    rows={3}
                                    value={data.description} 
                                    onChange={e => setData('description', e.target.value)}
                                    className="w-full rounded-xl border-gray-300 focus:border-brand-primary focus:ring-brand-primary resize-none"
                                    required
                                />
                                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Class Ikon (Phosphor)</label>
                                    <input 
                                        type="text" 
                                        value={data.icon} 
                                        onChange={e => setData('icon', e.target.value)}
                                        className="w-full rounded-xl border-gray-300 focus:border-brand-primary focus:ring-brand-primary"
                                        placeholder="Contoh: ph-wallet"
                                        required
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Gunakan format <code>ph-namabebas</code></p>
                                    {errors.icon && <p className="text-red-500 text-xs mt-1">{errors.icon}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Urutan Tampil</label>
                                    <input 
                                        type="number" 
                                        value={data.order} 
                                        onChange={e => setData('order', parseInt(e.target.value))}
                                        className="w-full rounded-xl border-gray-300 focus:border-brand-primary focus:ring-brand-primary"
                                        required
                                    />
                                    {errors.order && <p className="text-red-500 text-xs mt-1">{errors.order}</p>}
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3 justify-end">
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

