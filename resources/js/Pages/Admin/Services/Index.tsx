import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { FormEventHandler, useState, useEffect } from 'react';

interface Service {
    id: number;
    title: string;
    description: string;
    icon: string;
    badge: string | null;
    color_class: string | null;
    order: number;
}

interface Props {
    services: Service[];
}

export default function ServicesIndex({ services }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);
    const [localServices, setLocalServices] = useState<Service[]>([]);
    const [isOrderChanged, setIsOrderChanged] = useState(false);

    useEffect(() => {
        setLocalServices([...services].sort((a, b) => a.order - b.order));
        setIsOrderChanged(false);
    }, [services]);

    const { data, setData, post, put, processing, reset, errors } = useForm({
        title: '',
        description: '',
        icon: 'ph-check-circle',
        badge: '',
        color_class: 'brand-primary',
        order: 0,
    });

    const openCreateModal = () => {
        setEditingService(null);
        reset();
        setIsModalOpen(true);
    };

    const openEditModal = (service: Service) => {
        setEditingService(service);
        setData({
            title: service.title,
            description: service.description,
            icon: service.icon,
            badge: service.badge || '',
            color_class: service.color_class || '',
            order: service.order,
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        
        if (editingService) {
            put(route('admin.services.update', editingService.id), {
                onSuccess: () => closeModal(),
            });
        } else {
            post(route('admin.services.store'), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const deleteService = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus layanan ini?')) {
            router.delete(route('admin.services.destroy', id));
        }
    };

    const moveRow = (index: number, direction: 'up' | 'down') => {
        const newServices = [...localServices];
        if (direction === 'up' && index > 0) {
            const temp = newServices[index];
            newServices[index] = newServices[index - 1];
            newServices[index - 1] = temp;
        } else if (direction === 'down' && index < newServices.length - 1) {
            const temp = newServices[index];
            newServices[index] = newServices[index + 1];
            newServices[index + 1] = temp;
        } else {
            return;
        }
        
        // Update order values
        const updatedServices = newServices.map((s, idx) => ({
            ...s,
            order: idx + 1
        }));
        
        setLocalServices(updatedServices);
        setIsOrderChanged(true);
    };

    const saveOrder = () => {
        router.post(route('admin.services.reorder'), {
            items: localServices.map(s => ({ id: s.id, order: s.order }))
        }, {
            preserveScroll: true,
            onSuccess: () => setIsOrderChanged(false)
        });
    };

    return (
        <AdminLayout header="Kelola Layanan Kami">
            <Head title="Layanan Kami - Admin Karir Sebaya" />

            <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Daftar Layanan</h2>
                    <p className="text-sm text-gray-500">Atur "Layanan Kami" di halaman Beranda.</p>
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
                        Tambah Layanan
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
                            <th className="px-6 py-4">LabelPromo</th>
                            <th className="px-6 py-4 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {localServices.length > 0 ? (
                            localServices.map((service, index) => (
                                <tr key={service.id} className="hover:bg-gray-50/50 transition-colors">
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
                                                    disabled={index === localServices.length - 1}
                                                    className="text-gray-400 hover:text-brand-primary disabled:opacity-30 disabled:hover:text-gray-400 transition-colors"
                                                >
                                                    <i className="ph-fill ph-caret-down text-lg"></i>
                                                </button>
                                            </div>
                                            <span className="font-bold text-gray-900 bg-gray-100 w-8 h-8 rounded-lg flex items-center justify-center">{service.order}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-2xl" style={{color: service.color_class?.includes('-') ? service.color_class.replace('-600', '').replace('-500', '') : 'var(--brand-primary)'}}>
                                        <i className={`ph ${service.icon}`}></i>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-gray-900">{service.title}</td>
                                    <td className="px-6 py-4">{service.description}</td>
                                    <td className="px-6 py-4">
                                        {service.badge && (
                                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-light text-brand-primary border border-brand-primary/20">
                                                {service.badge}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-3">
                                        <button onClick={() => openEditModal(service)} className="text-brand-primary hover:text-brand-purple">
                                            Edit
                                        </button>
                                        <button onClick={() => deleteService(service.id)} className="text-red-500 hover:text-red-700">
                                            Hapus
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                    Belum ada data layanan.
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
                                {editingService ? 'Edit Layanan' : 'Tambah Layanan Baru'}
                            </h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                                <i className="ph ph-x text-xl"></i>
                            </button>
                        </div>
                        
                        <form onSubmit={submit} className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Judul Layanan</label>
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
                                        placeholder="Contoh: ph-laptop"
                                        required
                                    />
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
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Label Promo (Badge)</label>
                                    <input 
                                        type="text" 
                                        value={data.badge} 
                                        onChange={e => setData('badge', e.target.value)}
                                        className="w-full rounded-xl border-gray-300 focus:border-brand-primary focus:ring-brand-primary"
                                        placeholder="Contoh: Populer (Opsional)"
                                    />
                                    {errors.badge && <p className="text-red-500 text-xs mt-1">{errors.badge}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Warna Tema</label>
                                    <select 
                                        value={data.color_class} 
                                        onChange={e => setData('color_class', e.target.value)}
                                        className="w-full rounded-xl border-gray-300 focus:border-brand-primary focus:ring-brand-primary"
                                    >
                                        <option value="brand-primary">Ungu Karir Sebaya</option>
                                        <option value="indigo-600">Indigo</option>
                                        <option value="pink-500">Pink</option>
                                        <option value="teal-500">Teal</option>
                                        <option value="blue-500">Blue</option>
                                    </select>
                                    {errors.color_class && <p className="text-red-500 text-xs mt-1">{errors.color_class}</p>}
                                </div>
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

