import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { FormEventHandler, useState, useCallback, useMemo } from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImg from '@/utils/cropImage';

interface TeamMember {
    id: number;
    name: string;
    role: string;
    category: string;
    bio: string;
    image: string | null;
    is_active: boolean;
}

interface Props {
    teamMembers: TeamMember[];
}

export default function TeamMembersIndex({ teamMembers }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    // Cropper states
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
    const [isCropping, setIsCropping] = useState(false);

    const { data, setData, post, processing, reset, errors } = useForm({
        name: '',
        role: '',
        category: 'developer',
        bio: '',
        image: null as File | null,
        _method: 'post', // We use post for both create and update to handle file upload
    });

    const openCreateModal = () => {
        setEditingMember(null);
        reset();
        setData('_method', 'post');
        setIsModalOpen(true);
    };

    const openEditModal = (member: TeamMember) => {
        setEditingMember(member);
        setData({
            name: member.name,
            role: member.role,
            category: member.category,
            bio: member.bio || '',
            image: null,
            _method: 'put', // Spoof put for updating
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
    };

    const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                setImageSrc(reader.result as string);
                setIsCropping(true);
            };
        }
    };

    const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const showCroppedImage = useCallback(async () => {
        try {
            if (!imageSrc || !croppedAreaPixels) return;
            const croppedImageFile = await getCroppedImg(
                imageSrc,
                croppedAreaPixels
            );
            
            if (croppedImageFile) {
                setData('image', croppedImageFile);
            }
            setIsCropping(false);
            setImageSrc(null);
        } catch (e) {
            console.error(e);
            alert("Gagal memotong gambar.");
        }
    }, [imageSrc, croppedAreaPixels]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        
        if (editingMember) {
            post(route('admin.team-members.update', editingMember.id), {
                onSuccess: () => closeModal(),
            });
        } else {
            post(route('admin.team-members.store'), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const deleteMember = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
            router.delete(route('admin.team-members.destroy', id), {
                onSuccess: () => setSelectedIds(selectedIds.filter(selectedId => selectedId !== id))
            });
        }
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedIds(filteredMembers.map(m => m.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectOne = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
        if (e.target.checked) {
            setSelectedIds([...selectedIds, id]);
        } else {
            setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
        }
    };

    const handleBulkDelete = () => {
        if (selectedIds.length === 0) return;
        if (confirm(`Apakah Anda yakin ingin menghapus ${selectedIds.length} data terpilih?`)) {
            router.post(route('admin.team-members.bulk'), {
                ids: selectedIds,
                action: 'delete'
            }, {
                onSuccess: () => setSelectedIds([])
            });
        }
    };

    const filteredMembers = useMemo(() => {
        return teamMembers.filter(member => {
            if (!searchQuery) return true;
            return member.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                   member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                   member.category.toLowerCase().includes(searchQuery.toLowerCase());
        });
    }, [teamMembers, searchQuery]);

    return (
        <AdminLayout header="Kelola Tim & Konselor">
            <Head title="Kelola Tim - Admin Karir Sebaya" />

            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Daftar Anggota</h2>
                    <p className="text-sm text-gray-500">Kelola profil pengembang, pakar, dan konselor sebaya.</p>
                </div>
                <button 
                    onClick={openCreateModal}
                    className="bg-brand-primary hover:bg-brand-purple text-white px-6 py-2.5 rounded-full font-bold shadow-lg shadow-brand-primary/30 transition-all flex items-center gap-2"
                >
                    <i className="ph ph-plus-circle text-lg"></i>
                    Tambah Anggota
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/50">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <i className="ph ph-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                            <input 
                                type="text" 
                                placeholder="Cari anggota tim..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 pr-4 py-2 w-full md:w-64 rounded-xl border-gray-200 focus:border-brand-primary focus:ring-brand-primary text-sm shadow-sm"
                            />
                        </div>
                    </div>
                    {selectedIds.length > 0 && (
                        <div className="flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2">
                            <span className="text-sm font-medium text-gray-600">
                                {selectedIds.length} baris terpilih
                            </span>
                            <button 
                                onClick={handleBulkDelete}
                                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-bold transition-colors border border-red-100"
                            >
                                <i className="ph ph-trash"></i>
                                Hapus Terpilih
                            </button>
                        </div>
                    )}
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600 min-w-[600px]">
                        <thead className="bg-gray-50 text-gray-700 font-medium border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 w-12">
                                    <input 
                                        type="checkbox" 
                                        checked={filteredMembers.length > 0 && selectedIds.length === filteredMembers.length}
                                        onChange={handleSelectAll}
                                        className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary w-4 h-4 cursor-pointer"
                                    />
                                </th>
                                <th className="px-6 py-4 w-20">Foto</th>
                                <th className="px-6 py-4">Nama</th>
                                <th className="px-6 py-4">Peran / Jabatan</th>
                                <th className="px-6 py-4">Kategori</th>
                                <th className="px-6 py-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredMembers.length > 0 ? (
                            filteredMembers.map((member) => (
                                <tr key={member.id} className={`hover:bg-gray-50/50 transition-colors ${selectedIds.includes(member.id) ? 'bg-brand-50/30' : ''}`}>
                                    <td className="px-6 py-4">
                                        <input 
                                            type="checkbox" 
                                            checked={selectedIds.includes(member.id)}
                                            onChange={(e) => handleSelectOne(e, member.id)}
                                            className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary w-4 h-4 cursor-pointer"
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-200">
                                            {member.image ? (
                                                <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random`} alt={member.name} className="w-full h-full object-cover" />
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-gray-900">{member.name}</td>
                                    <td className="px-6 py-4">{member.role}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                            member.category === 'developer' ? 'bg-blue-100 text-blue-700' :
                                            member.category === 'expert' ? 'bg-purple-100 text-purple-700' :
                                            'bg-green-100 text-green-700'
                                        }`}>
                                            {member.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-3">
                                        <button onClick={() => openEditModal(member)} className="text-brand-primary hover:text-brand-purple font-medium">
                                            Edit
                                        </button>
                                        <button onClick={() => deleteMember(member.id)} className="text-red-500 hover:text-red-700 font-medium">
                                            Hapus
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <i className="ph ph-users text-4xl text-gray-300"></i>
                                        <p>Tidak ada data anggota tim yang ditemukan.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            </div>

            {/* Modal Form */}
            {isModalOpen && !isCropping && (
                <div className="fixed inset-0 bg-gray-900/50 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
                            <h3 className="font-bold text-gray-900 text-lg">
                                {editingMember ? 'Edit Anggota Tim' : 'Tambah Anggota Baru'}
                            </h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                                <i className="ph ph-x text-xl"></i>
                            </button>
                        </div>
                        
                        <div className="overflow-y-auto p-6">
                            <form onSubmit={submit} className="space-y-5">
                                <div className="flex flex-col items-center mb-6">
                                    <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-100 mb-3 border border-gray-200 relative group">
                                        {data.image ? (
                                            <img src={URL.createObjectURL(data.image)} alt="Preview" className="w-full h-full object-cover" />
                                        ) : editingMember?.image ? (
                                            <img src={editingMember.image} alt="Current" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                <i className="ph ph-user text-3xl"></i>
                                            </div>
                                        )}
                                        <label className="absolute inset-0 bg-black/50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                                            <i className="ph ph-camera text-xl"></i>
                                            <input type="file" className="hidden" accept="image/*" onChange={onFileChange} />
                                        </label>
                                    </div>
                                    <p className="text-xs text-gray-500 text-center">
                                        Klik gambar untuk mengunggah foto profil.<br/>
                                        Foto akan otomatis dipotong menjadi rasio kotak (1:1).
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
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
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Peran / Jabatan</label>
                                    <input 
                                        type="text" 
                                        value={data.role} 
                                        onChange={e => setData('role', e.target.value)}
                                        className="w-full rounded-xl border-gray-300 focus:border-brand-primary focus:ring-brand-primary"
                                        placeholder="Contoh: Product Designer, Praktisi HR"
                                        required
                                    />
                                    {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Kategori Tim</label>
                                    <select 
                                        value={data.category} 
                                        onChange={e => setData('category', e.target.value)}
                                        className="w-full rounded-xl border-gray-300 focus:border-brand-primary focus:ring-brand-primary"
                                    >
                                        <option value="developer">Tim Pengembang (Developer)</option>
                                        <option value="expert">Konselor Ahli (Expert)</option>
                                        <option value="peer">Konselor Sebaya (Peer)</option>
                                    </select>
                                    {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Singkat (Opsional)</label>
                                    <textarea 
                                        rows={3}
                                        value={data.bio} 
                                        onChange={e => setData('bio', e.target.value)}
                                        className="w-full rounded-xl border-gray-300 focus:border-brand-primary focus:ring-brand-primary resize-none"
                                    />
                                    {errors.bio && <p className="text-red-500 text-xs mt-1">{errors.bio}</p>}
                                </div>

                                <div className="pt-4 flex gap-3 justify-end shrink-0">
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
                </div>
            )}

            {/* Modal Cropper */}
            {isCropping && imageSrc && (
                <div className="fixed inset-0 bg-gray-900/90 z-[70] flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden flex flex-col shadow-2xl">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="font-bold text-gray-900 text-lg">Potong Gambar Profil</h3>
                            <button onClick={() => { setIsCropping(false); setImageSrc(null); }} className="text-gray-400 hover:text-gray-600">
                                <i className="ph ph-x text-xl"></i>
                            </button>
                        </div>
                        <div className="relative w-full h-[400px] bg-gray-900">
                            <Cropper
                                image={imageSrc}
                                crop={crop}
                                zoom={zoom}
                                aspect={1 / 1}
                                onCropChange={setCrop}
                                onCropComplete={onCropComplete}
                                onZoomChange={setZoom}
                                cropShape="rect"
                                showGrid={false}
                            />
                        </div>
                        <div className="p-6 bg-gray-50 flex flex-col gap-4">
                            <div className="flex items-center gap-4">
                                <i className="ph ph-minus text-gray-400"></i>
                                <input
                                    type="range"
                                    value={zoom}
                                    min={1}
                                    max={3}
                                    step={0.1}
                                    aria-labelledby="Zoom"
                                    onChange={(e) => setZoom(Number(e.target.value))}
                                    className="flex-1 accent-brand-primary"
                                />
                                <i className="ph ph-plus text-gray-400"></i>
                            </div>
                            <div className="flex justify-end gap-3 mt-2">
                                <button
                                    onClick={() => { setIsCropping(false); setImageSrc(null); }}
                                    className="px-6 py-2 rounded-full font-medium text-gray-600 hover:bg-gray-200 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={showCroppedImage}
                                    className="bg-brand-primary hover:bg-brand-purple text-white px-6 py-2 rounded-full font-bold shadow-lg shadow-brand-primary/30 transition-all"
                                >
                                    Terapkan Potongan
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
