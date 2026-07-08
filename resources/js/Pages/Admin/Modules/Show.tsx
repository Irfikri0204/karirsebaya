import { Head, useForm, router, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { FormEventHandler, useState } from 'react';
import Modal from '@/Components/Modal';

interface ModuleTopic {
    id: number;
    title: string;
    order: number;
}

interface Module {
    id: number;
    title: string;
    hashtag: string | null;
    introduction: string | null;
    cover_image: string | null;
    is_active: boolean;
    topics?: ModuleTopic[];
}

interface Props {
    module: Module;
}

export default function ModuleShow({ module }: Props) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingTopic, setEditingTopic] = useState<ModuleTopic | null>(null);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        title: '',
    });

    const openCreateModal = () => {
        setEditingTopic(null);
        reset();
        clearErrors();
        setIsCreateModalOpen(true);
    };

    const openEditModal = (topic: ModuleTopic) => {
        setEditingTopic(topic);
        setData({
            title: topic.title,
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

        if (editingTopic) {
            router.post(route('admin.topics.update', editingTopic.id), {
                _method: 'put',
                title: data.title,
            }, {
                onSuccess: () => closeCreateModal(),
            });
        } else {
            post(route('admin.topics.store', module.id), {
                onSuccess: () => closeCreateModal(),
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus topik ini? Seluruh konten di dalamnya juga akan terhapus.')) {
            router.delete(route('admin.topics.destroy', id));
        }
    };

    const moveItem = (index: number, direction: 'up' | 'down') => {
        if (!module.topics) return;
        const newTopics = [...module.topics];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        
        if (targetIndex >= 0 && targetIndex < newTopics.length) {
            const temp = newTopics[index];
            newTopics[index] = newTopics[targetIndex];
            newTopics[targetIndex] = temp;
            
            const updatedTopics = newTopics.map((item, i) => ({
                id: item.id,
                order: i
            }));

            router.post(route('admin.topics.reorder', module.id), { topics: updatedTopics });
        }
    };

    return (
        <AdminLayout header="Detail Modul">
            <Head title={`Modul: ${module.title} - Admin Karir Sebaya`} />

            <div className="mb-6 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <Link href={route('admin.modules.index')} className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-brand-primary hover:border-brand-primary transition-colors">
                        <i className="ph ph-arrow-left text-xl"></i>
                    </Link>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">{module.title}</h2>
                        <p className="text-sm text-gray-500">Kelola topik-topik di dalam modul ini.</p>
                    </div>
                </div>
                <button 
                    onClick={openCreateModal}
                    className="bg-brand-primary hover:bg-brand-purple text-white px-5 py-2.5 rounded-full font-bold shadow-lg shadow-purple-900/20 transition-all flex items-center gap-2"
                >
                    <i className="ph ph-plus-circle text-lg"></i>
                    Tambah Topik
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8 p-6 flex gap-6 items-start">
                <div className="w-32 h-32 shrink-0 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center text-gray-400">
                    {module.cover_image ? (
                        <img src={module.cover_image} alt={module.title} className="w-full h-full object-cover" />
                    ) : (
                        <i className="ph ph-image text-4xl"></i>
                    )}
                </div>
                <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{module.title}</h3>
                    {module.hashtag && (
                        <span className="inline-block px-3 py-1 bg-brand-primary/10 text-brand-primary text-xs font-bold rounded-full mb-3">
                            #{module.hashtag.replace('#', '')}
                        </span>
                    )}
                    <p className="text-gray-600 text-sm leading-relaxed">{module.introduction || 'Tidak ada pengantar'}</p>
                </div>
            </div>

            <h3 className="text-lg font-bold text-gray-800 mb-4">Daftar Topik</h3>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 text-gray-700 font-medium border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 w-16">Urutan</th>
                            <th className="px-6 py-4">Judul Topik</th>
                            <th className="px-6 py-4 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {module.topics && module.topics.length > 0 ? (
                            module.topics.map((topic, index) => (
                                <tr key={topic.id} className="hover:bg-gray-50/50 transition-colors">
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
                                                disabled={index === module.topics!.length - 1}
                                                className="text-gray-400 hover:text-brand-primary disabled:opacity-30"
                                            >
                                                <i className="ph-fill ph-caret-down"></i>
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        {topic.title}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link href={route('admin.topic-contents.index', topic.id)} className="px-4 py-2 rounded-full bg-brand-primary/10 text-brand-primary hover:bg-brand-primary hover:text-white font-bold transition-colors text-xs flex items-center gap-2">
                                                <i className="ph ph-pen-nib"></i>
                                                Kelola Konten
                                            </Link>
                                            <button onClick={() => openEditModal(topic)} className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition-colors" title="Edit Topik">
                                                <i className="ph ph-pencil-simple"></i>
                                            </button>
                                            <button onClick={() => handleDelete(topic.id)} className="w-8 h-8 rounded-full bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center transition-colors" title="Hapus Topik">
                                                <i className="ph ph-trash"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                                    Belum ada topik dalam modul ini.
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
                            {editingTopic ? 'Edit Topik' : 'Tambah Topik Baru'}
                        </h2>
                        <button onClick={closeCreateModal} className="text-gray-400 hover:text-gray-600">
                            <i className="ph ph-x text-xl"></i>
                        </button>
                    </div>

                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Judul Topik</label>
                            <input 
                                type="text" 
                                value={data.title}
                                onChange={e => setData('title', e.target.value)}
                                className="w-full rounded-xl border-gray-300 focus:border-brand-primary focus:ring-brand-primary"
                                placeholder="Contoh: Pengenalan Wawancara"
                                required
                            />
                            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
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
