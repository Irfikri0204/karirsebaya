import { Head, useForm, router, usePage } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { FormEventHandler, useState, useEffect } from 'react';

interface QuestionOption {
    text: string;
    score: number;
}

interface RiasecQuestion {
    id: number;
    question_text: string;
    options: QuestionOption[];
}

interface Props {
    questions: RiasecQuestion[];
}

export default function TesKarirTest({ questions }: Props) {
    const { global_settings } = usePage().props as any;
    const [currentStep, setCurrentStep] = useState(0);
    const questionsPerStep = 5;
    
    // Hitung total halaman (step)
    const totalSteps = Math.ceil(questions.length / questionsPerStep);

    // Initial form state
    const { data, setData, post, processing, errors } = useForm({
        answers: questions.map(q => ({
            question_id: q.id,
            score: null as number | null
        }))
    });

    const handleOptionSelect = (questionId: number, score: number) => {
        const newAnswers = [...data.answers];
        const index = newAnswers.findIndex(a => a.question_id === questionId);
        if (index !== -1) {
            newAnswers[index].score = score;
            setData('answers', newAnswers);
        }
    };

    const isCurrentStepComplete = () => {
        const start = currentStep * questionsPerStep;
        const end = Math.min(start + questionsPerStep, questions.length);
        const currentAnswers = data.answers.slice(start, end);
        return currentAnswers.every(a => a.score !== null);
    };

    const nextStep = () => {
        if (isCurrentStepComplete() && currentStep < totalSteps - 1) {
            setCurrentStep(currentStep + 1);
            setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
            setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        
        if (!isCurrentStepComplete()) {
            alert('Mohon lengkapi semua jawaban pada halaman ini.');
            return;
        }

        post(route('tes-karir.store'));
    };

    // Ambil pertanyaan untuk halaman saat ini
    const startIdx = currentStep * questionsPerStep;
    const currentQuestions = questions.slice(startIdx, startIdx + questionsPerStep);

    // Progress bar
    const progress = Math.round((data.answers.filter(a => a.score !== null).length / questions.length) * 100);

    return (
        <PublicLayout>
            <Head title="Kerjakan Tes Minat Karir - Karir Sebaya" />
            
            <div className="min-h-screen bg-gray-50 font-sans text-gray-800 pt-24 pb-20 px-4 sm:px-6">
                <div className="max-w-3xl mx-auto">
                    
                    {/* Progress Header */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8 sticky top-20 z-40">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-bold text-gray-700">Progres Pengerjaan</span>
                            <span className="text-sm font-bold text-brand-primary">{progress}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2.5">
                            <div className="bg-brand-primary h-2.5 rounded-full transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
                        </div>
                        <div className="text-xs text-gray-500 mt-2 text-center">
                            Halaman {currentStep + 1} dari {totalSteps}
                        </div>
                    </div>

                    {/* Instruction Box (Only on page 1) */}
                    {currentStep === 0 && (
                        <div className="bg-brand-primary/10 rounded-2xl p-6 mb-8 border border-brand-primary/20 flex gap-4">
                            <i className="ph-fill ph-info text-2xl text-brand-primary shrink-0"></i>
                            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                                {global_settings?.riasec_instruction || 'Berikut adalah tes inventori minat karir RIASEC. Silakan pilih seberapa tertarik Anda terhadap aktivitas-aktivitas berikut ini. Pilih angka 1 jika sangat tidak suka, hingga angka 5 jika sangat suka.'}
                            </p>
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-8">
                        {currentQuestions.map((q, idx) => {
                            const globalIndex = startIdx + idx;
                            const currentAnswer = data.answers.find(a => a.question_id === q.id)?.score;

                            return (
                                <div key={q.id} className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 hover:border-brand-primary/30 transition-colors">
                                    <div className="flex gap-4 mb-6">
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-light text-brand-primary flex items-center justify-center font-bold text-sm">
                                            {globalIndex + 1}
                                        </div>
                                        <h3 className="text-lg md:text-xl font-medium text-gray-900 leading-relaxed pt-1">
                                            {q.question_text}
                                        </h3>
                                    </div>
                                    
                                    <div className="grid gap-3 pl-12">
                                        {q.options.map((opt, optIdx) => (
                                            <label 
                                                key={optIdx} 
                                                className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer border-2 transition-all ${
                                                    currentAnswer === opt.score 
                                                    ? 'border-brand-primary bg-brand-light/30' 
                                                    : 'border-gray-100 bg-gray-50/50 hover:bg-gray-100 hover:border-gray-200'
                                                }`}
                                            >
                                                <input 
                                                    type="radio" 
                                                    name={`question_${q.id}`} 
                                                    value={opt.score}
                                                    checked={currentAnswer === opt.score}
                                                    onChange={() => handleOptionSelect(q.id, opt.score)}
                                                    className="w-5 h-5 text-brand-primary focus:ring-brand-primary border-gray-300"
                                                />
                                                <span className={`font-medium ${currentAnswer === opt.score ? 'text-brand-primary' : 'text-gray-700'}`}>
                                                    {opt.text}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}

                        <div className="flex justify-between items-center pt-4">
                            <button
                                type="button"
                                onClick={prevStep}
                                disabled={currentStep === 0}
                                className={`px-6 py-3 rounded-full font-bold transition-all ${
                                    currentStep === 0 
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                                }`}
                            >
                                <i className="ph ph-arrow-left mr-2"></i> Sebelumnya
                            </button>

                            {currentStep < totalSteps - 1 ? (
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    disabled={!isCurrentStepComplete()}
                                    className={`px-8 py-3 rounded-full font-bold transition-all flex items-center gap-2 ${
                                        !isCurrentStepComplete()
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-brand-primary text-white shadow-lg hover:bg-brand-purple'
                                    }`}
                                >
                                    Selanjutnya <i className="ph ph-arrow-right"></i>
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={!isCurrentStepComplete() || processing}
                                    className={`px-8 py-3 rounded-full font-bold transition-all flex items-center gap-2 ${
                                        (!isCurrentStepComplete() || processing)
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg hover:shadow-xl hover:scale-105'
                                    }`}
                                >
                                    {processing ? (
                                        <><i className="ph ph-spinner animate-spin"></i> Memproses...</>
                                    ) : (
                                        <><i className="ph ph-check-circle text-lg"></i> Selesai & Lihat Hasil</>
                                    )}
                                </button>
                            )}
                        </div>
                    </form>

                </div>
            </div>
        </PublicLayout>
    );
}
