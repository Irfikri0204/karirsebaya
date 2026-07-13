import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { FormEventHandler, useState } from 'react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    nim: string | null;
    no_telp: string | null;
    asal_instansi: string | null;
    prodi: string | null;
    semester: string | null;
    created_at: string;
}

interface PaginationProps {
    current_page: number;
    data: User[];
    first_page_url: string;
    last_page: number;
    last_page_url: string;
    links: { url: string | null; label: string; active: boolean }[];
    next_page_url: string | null;
    prev_page_url: string | null;
    total: number;
}

interface Props {
    users: PaginationProps;
    filters: {
        search?: string;
        role?: string;
    };
}

export default function UsersIndex({ users, filters }: Props) {
    const { auth } = usePage().props as any;
    const isSuperadmin = auth.user.role === 'superadmin';
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    
    const [searchQuery, setSearchQuery] = useState(filters?.search || '');
    const [roleFilter, setRoleFilter] = useState(filters?.role || '');

    const applyFilters = (search: string, role: string) => {
        router.get(
            route('admin.users.index'),
            { search, role },
            { preserveState: true, replace: true, preserveScroll: true }
        );
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            applyFilters(searchQuery, roleFilter);
        }
    };

    const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        setRoleFilter(val);
        applyFilters(searchQuery, val);
    };

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        name: '',
        email: '',
        password: '',
        role: 'user',
    });

    const handleDelete = (id: number, name: string) => {
        if (confirm(`Apakah Anda yakin ingin menghapus akun ${name}? Tindakan ini tidak dapat dibatalkan.`)) {
            router.delete(route('admin.users.destroy', id), {
                preserveScroll: true,
            });
        }
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
        clearErrors();
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('admin.users.store'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
        });
    };

    // Bulk Actions
    const isSelectable = (user: User) => {
        if (auth.user.id === user.id) return false;
        if (!isSuperadmin && user.role === 'superadmin') return false;
        return true;
    };

    const selectableUsers = users.data.filter(isSelectable);

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedIds(selectableUsers.map(u => u.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectOne = (id: number) => {
        setSelectedIds(prev => 
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const handleBulkDelete = () => {
        if (selectedIds.length === 0) return;
        if (confirm(`Apakah Anda yakin ingin menghapus ${selectedIds.length} akun terpilih? Tindakan ini tidak dapat dibatalkan.`)) {
            router.post(route('admin.users.bulk'), {
                ids: selectedIds,
                action: 'delete'
            }, {
                onSuccess: () => setSelectedIds([]),
                preserveScroll: true
            });
        }
    };

    return (
        <AdminLayout header="Kelola Akun Pengguna">
            <Head title="Kelola Akun - Admin Karir Sebaya" />

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative">
                {selectedIds.length > 0 && (
                    <div className="absolute top-0 left-0 right-0 h-[88px] sm:h-[84px] bg-white border-b border-gray-200 flex items-center justify-between px-6 z-20 animate-fade-in">
                        <span className="font-bold text-brand-primary">
                            {selectedIds.length} akun dipilih
                        </span>
                        <button onClick={handleBulkDelete} className="px-4 py-2 text-sm font-bold bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2">
                            <i className="ph ph-trash"></i> Hapus Terpilih
                        </button>
                    </div>
                )}

                <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800">Daftar Akun {isSuperadmin ? '(Semua)' : '(Non-Superadmin)'}</h2>
                        <div className="text-sm text-gray-500 mt-1">Total: {users.total} Pengguna</div>
                    </div>
                    <button onClick={openModal} className="px-4 py-2 bg-brand-primary text-white rounded-lg font-medium hover:bg-brand-purple transition-colors flex items-center gap-2">
                        <i className="ph ph-plus-circle text-lg"></i>
                        Tambah Akun
                    </button>
                </div>

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
                            value={roleFilter}
                            onChange={handleRoleChange}
                            className="w-full md:w-48 py-2 px-4 rounded-xl border-gray-200 focus:border-brand-primary focus:ring-brand-primary text-sm shadow-sm bg-white"
                        >
                            <option value="">Semua Peran</option>
                            <option value="user">Pengguna (User)</option>
                            <option value="admin">Admin</option>
                            {isSuperadmin && <option value="superadmin">Superadmin</option>}
                        </select>
                        {(searchQuery || roleFilter) && (
                            <button 
                                onClick={() => {
                                    setSearchQuery('');
                                    setRoleFilter('');
                                    applyFilters('', '');
                                }}
                                className="px-4 py-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors"
                            >
                                Reset
                            </button>
                        )}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-gray-50 border-b border-gray-200 text-gray-600">
                            <tr>
                                <th className="px-6 py-4 w-10">
                                    <input 
                                        type="checkbox" 
                                        className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary disabled:opacity-50"
                                        checked={selectableUsers.length > 0 && selectedIds.length === selectableUsers.length}
                                        onChange={handleSelectAll}
                                        disabled={selectableUsers.length === 0}
                                    />
                                </th>
                                <th className="px-6 py-4 font-semibold">Nama Pengguna</th>
                                <th className="px-6 py-4 font-semibold">Peran</th>
                                <th className="px-6 py-4 font-semibold">Kontak</th>
                                <th className="px-6 py-4 font-semibold">Institusi / Akademik</th>
                                <th className="px-6 py-4 font-semibold">Tanggal Daftar</th>
                                <th className="px-6 py-4 font-semibold text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {users.data.length > 0 ? (
                                users.data.map((user) => {
                                    const selectable = isSelectable(user);
                                    return (
                                        <tr key={user.id} className={`hover:bg-gray-50/50 transition-colors ${selectedIds.includes(user.id) ? 'bg-brand-primary/5' : ''}`}>
                                            <td className="px-6 py-4">
                                                <input 
                                                    type="checkbox" 
                                                    className="rounded border-gray-300 text-brand-primary focus:ring-brand-primary disabled:opacity-50"
                                                    checked={selectedIds.includes(user.id)}
                                                    onChange={() => handleSelectOne(user.id)}
                                                    disabled={!selectable}
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-gray-900">{user.name}</div>
                                                <div className="text-gray-500 text-xs mt-0.5">{user.email}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-md ${
                                                    user.role === 'superadmin' ? 'bg-purple-100 text-purple-700' :
                                                    user.role === 'admin' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-gray-100 text-gray-700'
                                                }`}>
                                                    {user.role === 'user' ? 'Pengguna' : 
                                                    user.role === 'admin' ? 'Admin' : 'Superadmin'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">
                                                {user.no_telp || '-'}
                                            </td>
                                            <td className="px-6 py-4">
                                                {user.role === 'user' ? (
                                                    <>
                                                        <div className="text-gray-900 font-medium">{user.asal_instansi || '-'}</div>
                                                        <div className="text-gray-500 text-xs mt-0.5">
                                                            {user.prodi ? `${user.prodi} ` : ''} 
                                                            {user.semester ? `(Smst. ${user.semester})` : ''}
                                                            {user.nim ? ` - NIM: ${user.nim}` : ''}
                                                        </div>
                                                    </>
                                                ) : (
                                                    <span className="text-gray-400 italic">Pengelola Sistem</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">
                                                {new Date(user.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button 
                                                    onClick={() => handleDelete(user.id, user.name)}
                                                    className="w-8 h-8 rounded-lg text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors inline-flex disabled:opacity-50 disabled:cursor-not-allowed"
                                                    title="Hapus Akun"
                                                    disabled={!selectable}
                                                >
                                                    <i className="ph ph-trash text-lg"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                        Belum ada akun pengguna yang terdaftar.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {users.links.length > 3 && (
                    <div className="p-4 border-t border-gray-200 flex items-center justify-center gap-1">
                        {users.links.map((link, index) => (
                            <Link
                                key={index}
                                href={link.url || '#'}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                    link.active
                                        ? 'bg-brand-primary text-white'
                                        : link.url
                                        ? 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                        : 'bg-gray-50 text-gray-400 border border-gray-200 cursor-not-allowed'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                preserveScroll
                            />
                        ))}
                    </div>
                )}
            </div>

            <Modal show={isModalOpen} onClose={closeModal} maxWidth="md">
                <form onSubmit={submit} className="p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-6">
                        Tambah Akun Baru
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <InputLabel htmlFor="name" value="Nama Lengkap" />
                            <TextInput
                                id="name"
                                type="text"
                                className="mt-1 block w-full"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="email" value="Email" />
                            <TextInput
                                id="email"
                                type="email"
                                className="mt-1 block w-full"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="password" value="Password Sementara" />
                            <TextInput
                                id="password"
                                type="password"
                                className="mt-1 block w-full"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                required
                            />
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="role" value="Peran" />
                            <select
                                id="role"
                                className="mt-1 block w-full border-gray-300 focus:border-brand-primary focus:ring-brand-primary rounded-md shadow-sm"
                                value={data.role}
                                onChange={(e) => setData('role', e.target.value)}
                                required
                            >
                                <option value="user">Pengguna (User Biasa)</option>
                                <option value="admin">Admin</option>
                                {isSuperadmin && <option value="superadmin">Superadmin</option>}
                            </select>
                            <InputError message={errors.role} className="mt-2" />
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton onClick={closeModal} disabled={processing}>
                            Batal
                        </SecondaryButton>
                        <PrimaryButton className="bg-brand-primary" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Simpan Akun'}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AdminLayout>
    );
}


