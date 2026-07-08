import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { FormEventHandler, useState } from 'react';

interface QuestionOption {
    text: string;
    score: number;
}

interface RiasecCategory {
    code: string;
    name: string;
}

interface RiasecQuestion {
    id: number;
    category_code: string;
    question_text: string;
    options: QuestionOption[];
    category?: RiasecCategory;
}

interface Props {
    questions: RiasecQuestion[];
    categories: RiasecCategory[];
}

export default function RiasecQuestionsIndex({ questions, categories }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState<RiasecQuestion | null>(null);

    const { data, setData, post, put, processing, reset, errors } = useForm({
        category_code: 'R',
        question_text: '',
        options: [
            { text: 'Sangat Tidak Setuju', score: 1 },
            { text: 'Tidak Setuju', score: 2 },
            { text: 'Netral', score: 3 },
            { text: 'Setuju', score: 4 },
            { text: 'Sangat Setuju', score: 5 },
        ],
    });

    const openCreateModal = () => {
        setEditingQuestion(null);
        reset();
        setIsModalOpen(true);
    };

    const openEditModal = (q: RiasecQuestion) => {
        setEditingQuestion(q);
        setData({
            category_code: q.category_code,
            question_text: q.question_text,
            options: [...q.options],
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
    };

    const updateOption = (index: number, field: keyof QuestionOption, value: string | number) => {
        const newOptions = [...data.options];
        newOptions[index] = { ...newOptions[index], [field]: value };
        setData('options', newOptions);
    };

    const addOption = () => {
        setData('options', [...data.options, { text: '', score: 0 }]);
    };

    const removeOption = (index: number) => {
        const newOptions = [...data.options];
        newOptions.splice(index, 1);
        setData('options', newOptions);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        
        if (editingQuestion) {
            put(route('admin.riasec.questions.update', editingQuestion.id), {
                onSuccess: () => closeModal(),
            });
        } else {
            post(route('admin.riasec.questions.store'), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const deleteQuestion = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus pertanyaan ini?')) {
            router.delete(route('admin.riasec.questions.destroy', id));
        }
    };

    return (
        <AdminLayout header="Bank Soal RIASEC">
            <Head title="Bank Soal RIASEC - Admin Karir Sebaya" />

            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Daftar Pertanyaan</h2>
                    <p className="text-sm text-gray-500">Kelola instrumen tes untuk pemetaan minat dan bakat.</p>
                </div>
                <button 
                    onClick={openCreateModal}
                    className="bg-brand-primary hover:bg-brand-purple text-white px-6 py-2.5 rounded-full font-bold shadow-lg shadow-brand-primary/30 transition-all flex items-center gap-2"
                >
                    <i className="ph ph-plus-circle text-lg"></i>
                    Tambah Soal
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 text-gray-700 font-medium border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 w-16">ID</th>
                            <th className="px-6 py-4 w-24">Tipe</th>
                            <th className="px-6 py-4">Pertanyaan</th>
                            <th className="px-6 py-4 w-32">Opsi Jawaban</th>
                            <th className="px-6 py-4 text-right w-40">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {questions.length > 0 ? (
                            questions.map((q) => (
                                <tr key={q.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 text-gray-400">#{q.id}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-2.5 py-1 rounded-md bg-purple-50 border border-purple-100 text-purple-700 font-bold text-xs" title={q.category?.name}>
                                            {q.category_code}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-800">{q.question_text}</td>
                                    <td className="px-6 py-4 text-gray-400 text-xs">{q.options.length} opsi</td>
                                    <td className="px-6 py-4 text-right space-x-3">
                                        <button onClick={() => openEditModal(q)} className="text-brand-primary hover:text-brand-purple font-medium">
                                            Edit
                                        </button>
                                        <button onClick={() => deleteQuestion(q.id)} className="text-red-500 hover:text-red-700 font-medium">
                                            Hapus
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                    Belum ada pertanyaan. Silakan tambah data baru.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-900/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden my-8">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 sticky top-0 z-10">
                            <h3 className="font-bold text-gray-900 text-lg">
                                {editingQuestion ? 'Edit Soal' : 'Tambah Soal Baru'}
                            </h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                                <i className="ph ph-x text-xl"></i>
                            </button>
                        </div>
                        
                        <form onSubmit={submit} className="p-6 space-y-6">
                            
                            <div className="grid grid-cols-4 gap-6">
                                <div className="col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Kategori (Tipe)</label>
                                    <select 
                                        value={data.category_code} 
                                        onChange={e => setData('category_code', e.target.value)}
                                        className="w-full rounded-xl border-gray-300 focus:border-brand-primary focus:ring-brand-primary font-bold"
                                    >
                                        {categories.map(c => (
                                            <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-span-3">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Bunyi Pertanyaan</label>
                                    <textarea 
                                        rows={2}
                                        value={data.question_text} 
                                        onChange={e => setData('question_text', e.target.value)}
                                        className="w-full rounded-xl border-gray-300 focus:border-brand-primary focus:ring-brand-primary resize-none"
                                        required
                                    />
                                </div>
                            </div>

                            <hr className="border-gray-100" />

                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <label className="block text-sm font-bold text-gray-900">Konfigurasi Opsi Jawaban & Skor</label>
                                    <button type="button" onClick={addOption} className="text-brand-primary text-sm font-bold flex items-center gap-1 hover:text-brand-purple">
                                        <i className="ph ph-plus"></i> Tambah Opsi
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500 mb-4">Urutan opsi akan tampil sesuai dengan yang dikonfigurasi di bawah ini.</p>
                                
                                <div className="space-y-3">
                                    {data.options.map((opt, idx) => (
                                        <div key={idx} className="flex gap-3 items-center group">
                                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                                                {idx + 1}
                                            </div>
                                            <div className="flex-1">
                                                <input 
                                                    type="text" 
                                                    value={opt.text} 
                                                    onChange={e => updateOption(idx, 'text', e.target.value)}
                                                    className="w-full rounded-lg border-gray-300 text-sm py-2 focus:border-brand-primary focus:ring-brand-primary"
                                                    placeholder="Teks Jawaban (contoh: Sangat Setuju)"
                                                    required
                                                />
                                            </div>
                                            <div className="w-24">
                                                <input 
                                                    type="number" 
                                                    value={opt.score} 
                                                    onChange={e => updateOption(idx, 'score', Number(e.target.value))}
                                                    className="w-full rounded-lg border-gray-300 text-sm py-2 focus:border-brand-primary focus:ring-brand-primary"
                                                    placeholder="Poin"
                                                    required
                                                />
                                            </div>
                                            <button 
                                                type="button" 
                                                onClick={() => removeOption(idx)}
                                                className="w-8 h-8 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                            >
                                                <i className="ph ph-trash"></i>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                {errors.options && <p className="text-red-500 text-xs mt-2">Pastikan semua opsi terisi dengan benar.</p>}
                            </div>

                            <div className="pt-6 mt-6 border-t border-gray-100 flex gap-3 justify-end sticky bottom-0 bg-white">
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
                                    className="bg-brand-primary hover:bg-brand-purple text-white px-8 py-2.5 rounded-full font-bold shadow-lg shadow-brand-primary/30 transition-all disabled:opacity-50"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan Soal'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </AdminLayout>
    );
}
