import { Head, useForm, router, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { FormEventHandler, useState, useEffect } from 'react';
import Modal from '@/Components/Modal';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface TopicContent {
    id: number;
    type: 'text' | 'image';
    content: string;
    order: number;
}

interface Module {
    id: number;
    title: string;
}

interface ModuleTopic {
    id: number;
    title: string;
    module?: Module;
}

interface Props {
    topic: ModuleTopic;
    contents: TopicContent[];
}

export default function TopicContentsIndex({ topic, contents }: Props) {
    const [isCreateTextModalOpen, setIsCreateTextModalOpen] = useState(false);
    const [isCreateImageModalOpen, setIsCreateImageModalOpen] = useState(false);
    const [editingContent, setEditingContent] = useState<TopicContent | null>(null);

    const { data: textData, setData: setTextData, post: postText, processing: processingText, errors: errorsText, reset: resetText, clearErrors: clearErrorsText } = useForm({
        type: 'text',
        content: '',
    });

    const { data: imageData, setData: setImageData, post: postImage, processing: processingImage, errors: errorsImage, reset: resetImage, clearErrors: clearErrorsImage } = useForm({
        type: 'image',
        content: null as File | null,
    });

    const openCreateTextModal = () => {
        setEditingContent(null);
        resetText();
        clearErrorsText();
        setIsCreateTextModalOpen(true);
    };

    const openCreateImageModal = () => {
        setEditingContent(null);
        resetImage();
        clearErrorsImage();
        setIsCreateImageModalOpen(true);
    };

    const openEditTextModal = (content: TopicContent) => {
        setEditingContent(content);
        setTextData({
            type: 'text',
            content: content.content,
        });
        clearErrorsText();
        setIsCreateTextModalOpen(true);
    };

    const openEditImageModal = (content: TopicContent) => {
        setEditingContent(content);
        setImageData({
            type: 'image',
            content: null, // File input can't be pre-filled
        });
        clearErrorsImage();
        setIsCreateImageModalOpen(true);
    };

    const closeModals = () => {
        setIsCreateTextModalOpen(false);
        setIsCreateImageModalOpen(false);
        setTimeout(() => {
            resetText();
            resetImage();
        }, 200);
    };

    const submitText: FormEventHandler = (e) => {
        e.preventDefault();

        if (editingContent) {
            router.post(route('admin.topic-contents.update', editingContent.id), {
                ...textData
            }, {
                onSuccess: () => closeModals(),
            });
        } else {
            postText(route('admin.topic-contents.store', topic.id), {
                onSuccess: () => closeModals(),
            });
        }
    };

    const submitImage: FormEventHandler = (e) => {
        e.preventDefault();

        if (editingContent) {
            router.post(route('admin.topic-contents.update', editingContent.id), {
                type: 'image',
                ...(imageData.content && { content: imageData.content })
            }, {
                onSuccess: () => closeModals(),
            });
        } else {
            postImage(route('admin.topic-contents.store', topic.id), {
                onSuccess: () => closeModals(),
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus konten ini?')) {
            router.delete(route('admin.topic-contents.destroy', id));
        }
    };

    const moveItem = (index: number, direction: 'up' | 'down') => {
        const newContents = [...contents];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        
        if (targetIndex >= 0 && targetIndex < newContents.length) {
            const temp = newContents[index];
            newContents[index] = newContents[targetIndex];
            newContents[targetIndex] = temp;
            
            const updatedContents = newContents.map((item, i) => ({
                id: item.id,
                order: i
            }));

            router.post(route('admin.topic-contents.reorder', topic.id), { contents: updatedContents });
        }
    };

    // Quill Toolbar Configuration
    const quillModules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{'list': 'ordered'}, {'list': 'bullet'}],
            ['link'],
            ['clean']
        ],
    };

    return (
        <AdminLayout header="Kelola Konten Topik">
            <Head title={`Konten Topik: ${topic.title} - Admin Karir Sebaya`} />

            <div className="mb-6 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <Link href={route('admin.modules.show', topic.module?.id)} className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-brand-primary hover:border-brand-primary transition-colors">
                        <i className="ph ph-arrow-left text-xl"></i>
                    </Link>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">{topic.title}</h2>
                        <p className="text-sm text-gray-500">Kelola susunan teks dan gambar pada topik ini.</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={openCreateTextModal}
                        className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-bold transition-all flex items-center gap-2"
                    >
                        <i className="ph ph-text-T text-lg"></i>
                        Tambah Teks
                    </button>
                    <button 
                        onClick={openCreateImageModal}
                        className="bg-brand-primary hover:bg-brand-purple text-white px-4 py-2 rounded-lg font-bold shadow-lg shadow-purple-900/20 transition-all flex items-center gap-2"
                    >
                        <i className="ph ph-image text-lg"></i>
                        Tambah Gambar
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="space-y-4">
                    {contents.length > 0 ? (
                        contents.map((content, index) => (
                            <div key={content.id} className="flex gap-4 p-4 border border-gray-100 bg-gray-50/50 rounded-xl hover:shadow-sm transition-all group">
                                <div className="flex flex-col items-center gap-1 mt-2">
                                    <button 
                                        onClick={() => moveItem(index, 'up')}
                                        disabled={index === 0}
                                        className="text-gray-400 hover:text-brand-primary disabled:opacity-30 p-1"
                                    >
                                        <i className="ph-fill ph-caret-up text-lg"></i>
                                    </button>
                                    <span className="text-xs font-bold text-gray-400">{index + 1}</span>
                                    <button 
                                        onClick={() => moveItem(index, 'down')}
                                        disabled={index === contents.length - 1}
                                        className="text-gray-400 hover:text-brand-primary disabled:opacity-30 p-1"
                                    >
                                        <i className="ph-fill ph-caret-down text-lg"></i>
                                    </button>
                                </div>

                                <div className="flex-1 min-w-0 bg-white rounded-lg border border-gray-200 p-4 relative">
                                    {content.type === 'text' ? (
                                        <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: content.content }}></div>
                                    ) : (
                                        <div className="max-w-md">
                                            <img src={content.content} alt="Content" className="rounded-lg w-full h-auto object-contain bg-gray-50 border border-gray-100 p-2" />
                                        </div>
                                    )}
                                    
                                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button 
                                            onClick={() => content.type === 'text' ? openEditTextModal(content) : openEditImageModal(content)}
                                            className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition-colors shadow-sm"
                                            title="Edit Konten"
                                        >
                                            <i className="ph ph-pencil-simple"></i>
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(content.id)}
                                            className="w-8 h-8 rounded-full bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center transition-colors shadow-sm"
                                            title="Hapus Konten"
                                        >
                                            <i className="ph ph-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12 text-gray-500">
                            <i className="ph ph-article text-4xl text-gray-300 mb-3 block"></i>
                            Belum ada konten di topik ini. Silakan tambah Teks atau Gambar.
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Teks */}
            <Modal show={isCreateTextModalOpen} onClose={closeModals} maxWidth="2xl">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
                        <h2 className="text-xl font-bold text-gray-900 font-serif">
                            {editingContent ? 'Edit Blok Teks' : 'Tambah Blok Teks'}
                        </h2>
                        <button onClick={closeModals} className="text-gray-400 hover:text-gray-600">
                            <i className="ph ph-x text-xl"></i>
                        </button>
                    </div>

                    <form onSubmit={submitText} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Konten Teks</label>
                            <div className="bg-white">
                                <ReactQuill 
                                    theme="snow" 
                                    value={textData.content} 
                                    onChange={(value) => setTextData('content', value)}
                                    modules={quillModules}
                                    className="h-64 mb-12"
                                />
                            </div>
                            {errorsText.content && <p className="text-red-500 text-xs mt-1">{errorsText.content}</p>}
                        </div>

                        <div className="pt-4 flex gap-3">
                            <button 
                                type="button" 
                                onClick={closeModals}
                                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl transition-colors"
                            >
                                Batal
                            </button>
                            <button 
                                type="submit" 
                                disabled={processingText}
                                className="flex-1 bg-brand-primary hover:bg-brand-purple text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50"
                            >
                                {processingText ? 'Menyimpan...' : 'Simpan Teks'}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* Modal Gambar */}
            <Modal show={isCreateImageModalOpen} onClose={closeModals} maxWidth="md">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
                        <h2 className="text-xl font-bold text-gray-900 font-serif">
                            {editingContent ? 'Edit Blok Gambar' : 'Tambah Blok Gambar'}
                        </h2>
                        <button onClick={closeModals} className="text-gray-400 hover:text-gray-600">
                            <i className="ph ph-x text-xl"></i>
                        </button>
                    </div>

                    <form onSubmit={submitImage} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Upload Gambar</label>
                            {editingContent && editingContent.type === 'image' && (
                                <div className="mb-3 w-full h-48 rounded-lg overflow-hidden border border-gray-200">
                                    <img src={editingContent.content} className="w-full h-full object-contain bg-gray-50" />
                                </div>
                            )}
                            <input 
                                type="file" 
                                accept="image/*"
                                onChange={e => setImageData('content', e.target.files?.[0] || null)}
                                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-light file:text-brand-primary hover:file:bg-brand-primary hover:file:text-white transition-all cursor-pointer"
                            />
                            {errorsImage.content && <p className="text-red-500 text-xs mt-1">{errorsImage.content}</p>}
                        </div>

                        <div className="pt-4 flex gap-3">
                            <button 
                                type="button" 
                                onClick={closeModals}
                                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl transition-colors"
                            >
                                Batal
                            </button>
                            <button 
                                type="submit" 
                                disabled={processingImage}
                                className="flex-1 bg-brand-primary hover:bg-brand-purple text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50"
                            >
                                {processingImage ? 'Menyimpan...' : 'Simpan Gambar'}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </AdminLayout>
    );
}
