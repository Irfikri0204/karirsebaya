import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';

export default function DeleteUserForm({
    className = '',
}: {
    className?: string;
}) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef<HTMLInputElement>(null);

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser: FormEventHandler = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);

        clearErrors();
        reset();
    };

    return (
        <section className={`space-y-6 ${className}`}>
            <header>
                <p className="mt-1 text-sm text-red-600 font-medium">
                    Peringatan: Setelah akun Anda dihapus, semua sumber daya dan datanya akan dihapus secara permanen.
                </p>
            </header>

            <button 
                onClick={confirmUserDeletion}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-red-900/20 transition-all flex items-center gap-2"
            >
                <i className="ph ph-trash"></i> Hapus Akun Secara Permanen
            </button>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-8">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-2xl">
                            <i className="ph-fill ph-warning"></i>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">
                            Konfirmasi Hapus Akun
                        </h2>
                    </div>

                    <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                        Apakah Anda benar-benar yakin? Tindakan ini tidak dapat dibatalkan. Silakan masukkan password Anda untuk mengonfirmasi bahwa Anda ingin menghapus akun Karir Sebaya ini secara permanen.
                    </p>

                    <div className="mt-6">
                        <InputLabel
                            htmlFor="password"
                            value="Password Anda"
                            className="text-gray-700 font-medium mb-1"
                        />

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                            className="mt-1 block w-full rounded-xl border-gray-300 focus:border-red-500 focus:ring-red-500 shadow-sm"
                            isFocused
                            placeholder="Masukkan password Anda..."
                        />

                        <InputError
                            message={errors.password}
                            className="mt-2 text-red-600"
                        />
                    </div>

                    <div className="mt-8 flex justify-end gap-3">
                        <button 
                            type="button" 
                            onClick={closeModal}
                            className="px-6 py-2.5 rounded-xl text-gray-600 font-medium hover:bg-gray-100 transition-colors"
                        >
                            Batal
                        </button>

                        <button 
                            type="submit" 
                            disabled={processing}
                            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-red-900/20 transition-all disabled:opacity-50 flex items-center gap-2"
                        >
                            {processing ? <i className="ph ph-spinner animate-spin"></i> : <i className="ph ph-trash"></i>}
                            Hapus Permanen
                        </button>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
