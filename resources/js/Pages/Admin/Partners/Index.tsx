import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { FormEventHandler, useState, useRef, useEffect } from 'react';
import FreeformCropModal from '@/Components/FreeformCropModal';

interface Partner {
    id: number;
    name: string;
    logo_path: string | null;
    order: number;
}

interface Props {
    partners: Partner[];
}

export default function PartnersIndex({ partners }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
    const [localPartners, setLocalPartners] = useState<Partner[]>([]);
    const [isOrderChanged, setIsOrderChanged] = useState(false);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
    const [isCropModalOpen, setIsCropModalOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setLocalPartners([...partners].sort((a, b) => a.order - b.order));
        setIsOrderChanged(false);
        setSelectedIds([]);
    }, [partners]);

    const { data, setData, post, processing, reset, errors } = useForm({
        name: '',
        order: 0,
        logo: null as File | null,
        _method: 'POST', // For spoofing PUT since file uploads require POST
    });

    const openCreateModal = () => {
        setEditingPartner(null);
        reset();
        setData('_method', 'POST');
        if (fileInputRef.current) fileInputRef.current.value = '';
        setIsModalOpen(true);
    };

    const openEditModal = (partner: Partner) => {
        setEditingPartner(partner);
        setData({
            name: partner.name,
            order: partner.order,
            logo: null,
            _method: 'PUT',
        });
        if (fileInputRef.current) fileInputRef.current.value = '';
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        
        if (editingPartner) {
            post(route('admin.partners.update', editingPartner.id), {
                onSuccess: () => closeModal(),
            });
        } else {
            post(route('admin.partners.store'), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const deletePartner = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus institusi mitra ini?')) {
            router.delete(route('admin.partners.destroy', id));
        }
    };

    const moveRow = (index: number, direction: 'up' | 'down') => {
        const newPartners = [...localPartners];
        if (direction === 'up' && index > 0) {
            const temp = newPartners[index];
            newPartners[index] = newPartners[index - 1];
            newPartners[index - 1] = temp;
        } else if (direction === 'down' && index < newPartners.length - 1) {
            const temp = newPartners[index];
            newPartners[index] = newPartners[index + 1];
            newPartners[index + 1] = temp;
        } else {
            return;
        }
        
        // Update order values
        const updatedPartners = newPartners.map((p, idx) => ({
            ...p,
            order: idx + 1
        }));
        
        setLocalPartners(updatedPartners);
        setIsOrderChanged(true);
    };

    const saveOrder = () => {
        router.post(route('admin.partners.reorder'), {
            items: localPartners.map(p => ({ id: p.id, order: p.order }))
        }, {
            preserveScroll: true,
            onSuccess: () => setIsOrderChanged(false)
        });
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedIds(localPartners.map(p => p.id));
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
        if (confirm(`Apakah Anda yakin ingin menghapus ${selectedIds.length} institusi mitra yang dipilih?`)) {
            router.post(route('admin.partners.bulk'), {
                ids: selectedIds,
                action: 'delete'
            }, {
                onSuccess: () => setSelectedIds([])
            });
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener('load', () => setCropImageSrc(reader.result?.toString() || ''));
            reader.readAsDataURL(e.target.files[0]);
            setIsCropModalOpen(true);
        }
    };

    const handleCropComplete = (croppedFile: File) => {
        setData('logo', croppedFile);
    };

    return (
        <AdminLayout header="Kelola Institusi Mitra">
            <Head title="Mitra - Admin Karir Sebaya" />

            <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Daftar Institusi Mitra</h2>
                    <p className="text-sm text-gray-500">Atur "Dipercaya oleh Institusi Terkemuka" di halaman Beranda.</p>
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
                        Tambah Mitra
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto w-full overflow-y-hidden border-t border-gray-100">
                    <table className="w-full text-left text-sm text-gray-600 min-w-[800px]">
                        <thead className="bg-gray-50 text-gray-700 font-medium border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 w-12 text-center">
                                <input 
                                    type="checkbox" 
                                    className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary cursor-pointer"
                                    checked={localPartners.length > 0 && selectedIds.length === localPartners.length}
                                    onChange={handleSelectAll}
                                />
                            </th>
                            <th className="px-6 py-4">Urutan</th>
                            <th className="px-6 py-4">Logo</th>
                            <th className="px-6 py-4">Nama Institusi</th>
                            <th className="px-6 py-4 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {localPartners.length > 0 ? (
                            localPartners.map((partner, index) => (
                                <tr key={partner.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 text-center">
                                        <input 
                                            type="checkbox" 
                                            className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary cursor-pointer"
                                            checked={selectedIds.includes(partner.id)}
                                            onChange={() => handleSelect(partner.id)}
                                        />
                                    </td>
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
                                                    disabled={index === localPartners.length - 1}
                                                    className="text-gray-400 hover:text-brand-primary disabled:opacity-30 disabled:hover:text-gray-400 transition-colors"
                                                >
                                                    <i className="ph-fill ph-caret-down text-lg"></i>
                                                </button>
                                            </div>
                                            <span className="font-bold text-gray-900 bg-gray-100 w-8 h-8 rounded-lg flex items-center justify-center">{partner.order}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {partner.logo_path ? (
                                            <img src={`/storage/${partner.logo_path}`} alt={partner.name} className="h-10 w-10 object-contain rounded-xl" />
                                        ) : (
                                            <div className="h-10 w-10 bg-gray-200 rounded-xl flex items-center justify-center text-gray-500 font-bold uppercase">
                                                {partner.name.substring(0, 2)}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 font-bold text-gray-900">{partner.name}</td>
                                    <td className="px-6 py-4 text-right space-x-3">
                                        <button onClick={() => openEditModal(partner)} className="text-brand-primary hover:text-brand-purple">
                                            Edit
                                        </button>
                                        <button onClick={() => deletePartner(partner.id)} className="text-red-500 hover:text-red-700">
                                            Hapus
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                    Belum ada data mitra.
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
                                {editingPartner ? 'Edit Mitra' : 'Tambah Mitra Baru'}
                            </h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                                <i className="ph ph-x text-xl"></i>
                            </button>
                        </div>
                        
                        <form onSubmit={submit} className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Institusi</label>
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">Upload Logo (Opsional)</label>
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    className="w-full rounded-xl border border-gray-300 file:bg-brand-primary file:text-white file:border-0 file:py-2 file:px-4 file:rounded-l-xl file:mr-4 file:hover:bg-brand-purple cursor-pointer focus:outline-none"
                                />
                                {data.logo && (
                                    <p className="text-sm text-green-600 mt-2 font-medium">✓ Logo siap diunggah</p>
                                )}
                                <p className="text-xs text-gray-500 mt-2">Biarkan kosong jika tidak ingin mengubah/menambahkan logo. Gambar dapat dipotong secara bebas (freeform).</p>
                                {errors.logo && <p className="text-red-500 text-xs mt-1">{errors.logo}</p>}
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
            
            <FreeformCropModal
                show={isCropModalOpen}
                imageSrc={cropImageSrc}
                onClose={() => setIsCropModalOpen(false)}
                onCropComplete={handleCropComplete}
            />
        </AdminLayout>
    );
}


