import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { FormEventHandler, useState, useRef } from 'react';
import ImageCropModal from '@/Components/ImageCropModal';

interface InspiringFigure {
    id?: number;
    name: string;
    image_path?: string;
    description: string;
    image_file?: File | null;
    preview_url?: string;
}

interface Profession {
    id?: number;
    title: string;
    description: string;
}

interface RiasecCategory {
    code: string;
    name: string;
    description: string;
    recommendations: string;
    figures: InspiringFigure[];
    professions: Profession[];
}

interface Props {
    categories: RiasecCategory[];
}

export default function RiasecCategoriesIndex({ categories }: Props) {
    const [activeTab, setActiveTab] = useState<string>(categories[0]?.code || 'R');
    const [cropModalOpen, setCropModalOpen] = useState(false);
    const [cropTargetIndex, setCropTargetIndex] = useState<number | null>(null);
    const [tempImageSrc, setTempImageSrc] = useState<string | null>(null);
    
    const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const activeCategory = categories.find(c => c.code === activeTab);

    const { data, setData, post, processing, recentlySuccessful } = useForm({
        _method: 'put',
        description: activeCategory?.description || '',
        figures: activeCategory?.figures || [],
        professions: activeCategory?.professions || [],
    });

    const changeTab = (code: string) => {
        setActiveTab(code);
        const cat = categories.find(c => c.code === code);
        if (cat) {
            setData({
                _method: 'put',
                description: cat.description || '',
                figures: cat.figures || [],
                professions: cat.professions || [],
            });
        }
    };

    // Professions Handlers
    const addProfession = () => {
        setData('professions', [
            ...data.professions,
            { title: '', description: '' }
        ]);
    };

    const updateProfession = (index: number, field: keyof Profession, value: string) => {
        const newProfs = [...data.professions];
        newProfs[index][field] = value as never;
        setData('professions', newProfs);
    };

    const removeProfession = (index: number) => {
        const newProfs = [...data.professions];
        newProfs.splice(index, 1);
        setData('professions', newProfs);
    };

    // Figures Handlers
    const addFigure = () => {
        setData('figures', [
            ...data.figures, 
            { name: '', description: '', preview_url: '' }
        ]);
    };

    const updateFigure = (index: number, field: keyof InspiringFigure, value: any) => {
        const newFigures = [...data.figures];
        newFigures[index][field] = value as never;
        setData('figures', newFigures);
    };

    const removeFigure = (index: number) => {
        const newFigures = [...data.figures];
        newFigures.splice(index, 1);
        setData('figures', newFigures);
    };

    const handleFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const url = URL.createObjectURL(file);
            setTempImageSrc(url);
            setCropTargetIndex(index);
            setCropModalOpen(true);
        }
        // Reset input so the same file can be selected again if cancelled
        e.target.value = '';
    };

    const handleCropComplete = (croppedFile: File) => {
        if (cropTargetIndex !== null) {
            const newFigures = [...data.figures];
            newFigures[cropTargetIndex].image_file = croppedFile;
            newFigures[cropTargetIndex].preview_url = URL.createObjectURL(croppedFile);
            setData('figures', newFigures);
        }
        setCropModalOpen(false);
        setTempImageSrc(null);
        setCropTargetIndex(null);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        // Inertia uses POST when submitting forms with files and fake method with _method=put
        post(route('admin.riasec.categories.update', activeTab), {
            preserveScroll: true
        });
    };

    return (
        <AdminLayout header="Kategori & Interpretasi RIASEC">
            <Head title="Kategori RIASEC - Admin Karir Sebaya" />

            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Manajemen Hasil Tes (RIASEC)</h2>
                    <p className="text-sm text-gray-500">Kelola penjelasan, rekomendasi karir, pekerjaan, dan tokoh inspiratif untuk setiap kategori.</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex overflow-x-auto gap-2 mb-6 pb-2">
                {categories.map((cat) => (
                    <button
                        key={cat.code}
                        onClick={() => changeTab(cat.code)}
                        className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                            activeTab === cat.code 
                            ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/30' 
                            : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                        }`}
                    >
                        {cat.code} - {cat.name}
                    </button>
                ))}
            </div>

            {/* Form */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
                <form onSubmit={submit}>
                    <div className="p-8 space-y-8">
                        {recentlySuccessful && (
                            <div className="bg-green-50 text-green-700 p-4 rounded-xl border border-green-200 flex items-center gap-3">
                                <i className="ph-fill ph-check-circle text-xl"></i>
                                <span className="font-medium">Data kategori {activeCategory?.name} berhasil diperbarui.</span>
                            </div>
                        )}

                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">{activeCategory?.name} ({activeCategory?.code})</h3>
                            <p className="text-gray-500 text-sm mb-6">Ubah deskripsi dan rekomendasi yang akan ditampilkan di halaman hasil tes user.</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi Kepribadian</label>
                            <textarea 
                                rows={3}
                                value={data.description} 
                                onChange={e => setData('description', e.target.value)}
                                className="w-full rounded-xl border-gray-300 focus:border-brand-primary focus:ring-brand-primary shadow-sm resize-none"
                                required
                            />
                        </div>

                        <hr className="border-gray-100" />

                        {/* Professions Section */}
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-900">Pekerjaan & Profesi (Detail)</label>
                                    <p className="text-xs text-gray-500">Tambahkan daftar pekerjaan berserta penjelasan detailnya.</p>
                                </div>
                                <button type="button" onClick={addProfession} className="text-brand-primary text-sm font-bold flex items-center gap-1 hover:text-brand-purple bg-brand-primary/10 px-4 py-2 rounded-lg">
                                    <i className="ph ph-plus"></i> Tambah Pekerjaan
                                </button>
                            </div>
                            
                            <div className="space-y-4">
                                {data.professions.length === 0 && (
                                    <div className="text-center py-6 bg-gray-50 rounded-xl border border-gray-100 border-dashed text-gray-500 text-sm">
                                        Belum ada data pekerjaan.
                                    </div>
                                )}
                                
                                {data.professions.map((prof, index) => (
                                    <div key={index} className="flex gap-4 items-start p-4 bg-gray-50 rounded-xl border border-gray-200 relative group">
                                        <button 
                                            type="button" 
                                            onClick={() => removeProfession(index)}
                                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <i className="ph ph-x text-xs"></i>
                                        </button>
                                        <div className="flex-1 space-y-3">
                                            <input 
                                                type="text" 
                                                value={prof.title} 
                                                onChange={e => updateProfession(index, 'title', e.target.value)}
                                                className="w-full rounded-lg border-gray-300 text-sm py-2 focus:border-brand-primary focus:ring-brand-primary font-bold"
                                                placeholder="Nama Profesi/Pekerjaan"
                                                required
                                            />
                                            <textarea 
                                                value={prof.description} 
                                                onChange={e => updateProfession(index, 'description', e.target.value)}
                                                className="w-full rounded-lg border-gray-300 text-sm py-2 focus:border-brand-primary focus:ring-brand-primary h-20 resize-none"
                                                placeholder="Penjelasan profesi ini..."
                                                required
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <hr className="border-gray-100" />

                        {/* Figures Section */}
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <label className="block text-sm font-bold text-gray-900">Tokoh Inspiratif (Role Models)</label>
                                <button type="button" onClick={addFigure} className="text-brand-primary text-sm font-bold flex items-center gap-1 hover:text-brand-purple bg-brand-primary/10 px-4 py-2 rounded-lg">
                                    <i className="ph ph-plus"></i> Tambah Tokoh
                                </button>
                            </div>
                            
                            <div className="space-y-4">
                                {data.figures.length === 0 && (
                                    <div className="text-center py-6 bg-gray-50 rounded-xl border border-gray-100 border-dashed text-gray-500 text-sm">
                                        Belum ada data tokoh inspiratif.
                                    </div>
                                )}
                                
                                {data.figures.map((figure, index) => (
                                    <div key={index} className="flex gap-4 items-start p-4 bg-gray-50 rounded-xl border border-gray-200 relative group">
                                        
                                        <button 
                                            type="button" 
                                            onClick={() => removeFigure(index)}
                                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                        >
                                            <i className="ph ph-x text-xs"></i>
                                        </button>

                                        <div className="w-24 shrink-0 flex flex-col gap-2">
                                            {figure.preview_url || figure.image_path ? (
                                                <img src={figure.preview_url || figure.image_path} alt={figure.name} className="w-24 h-24 rounded-xl object-cover bg-white border border-gray-200" />
                                            ) : (
                                                <div className="w-24 h-24 rounded-xl bg-gray-200 flex items-center justify-center text-gray-400 font-bold text-xl uppercase">
                                                    {figure.name ? figure.name.substring(0, 2) : <i className="ph ph-image text-2xl"></i>}
                                                </div>
                                            )}
                                            
                                            <input 
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                ref={el => fileInputRefs.current[index] = el}
                                                onChange={(e) => handleFileChange(index, e)}
                                            />
                                            <button 
                                                type="button"
                                                onClick={() => fileInputRefs.current[index]?.click()}
                                                className="text-xs bg-white border border-gray-300 text-gray-700 py-1.5 rounded-lg hover:bg-gray-50 w-full font-medium"
                                            >
                                                Pilih Foto
                                            </button>
                                        </div>
                                        <div className="flex-1 space-y-3">
                                            <input 
                                                type="text" 
                                                value={figure.name} 
                                                onChange={e => updateFigure(index, 'name', e.target.value)}
                                                className="w-full rounded-lg border-gray-300 text-sm py-2 focus:border-brand-primary focus:ring-brand-primary font-bold"
                                                placeholder="Nama Tokoh"
                                                required
                                            />
                                            <textarea 
                                                value={figure.description} 
                                                onChange={e => updateFigure(index, 'description', e.target.value)}
                                                className="w-full rounded-lg border-gray-300 text-sm py-2 focus:border-brand-primary focus:ring-brand-primary h-20 resize-none"
                                                placeholder="Deskripsi singkat (contoh: CEO Apple & Innovator)"
                                                required
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                    <div className="px-8 py-5 bg-gray-50 border-t border-gray-200 flex justify-end">
                        <button 
                            type="submit" 
                            disabled={processing}
                            className="bg-brand-primary hover:bg-brand-purple text-white px-8 py-2.5 rounded-full font-bold shadow-lg shadow-brand-primary/30 transition-all disabled:opacity-50 flex items-center gap-2"
                        >
                            {processing ? <i className="ph ph-spinner animate-spin"></i> : <i className="ph ph-floppy-disk"></i>}
                            Simpan Kategori {activeCategory?.code}
                        </button>
                    </div>
                </form>
            </div>
            
            <ImageCropModal 
                show={cropModalOpen}
                imageSrc={tempImageSrc}
                aspect={1}
                onClose={() => {
                    setCropModalOpen(false);
                    setTempImageSrc(null);
                    setCropTargetIndex(null);
                }}
                onCropComplete={handleCropComplete}
            />
            
        </AdminLayout>
    );
}
