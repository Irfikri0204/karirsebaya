import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef } from 'react';

export default function UpdatePasswordForm({
    className = '',
}: {
    className?: string;
}) {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        password: '',
        password_confirmation: '',
    });

    const updatePassword: FormEventHandler = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }
            },
        });
    };

    return (
        <section className={className}>
            <form onSubmit={updatePassword} className="space-y-6">
                <div>
                    <InputLabel htmlFor="password" value="Password Baru" className="text-gray-700 font-medium mb-1" />

                    <TextInput
                        id="password"
                        name="password"
                        ref={passwordInput}
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        type="password"
                        className="mt-1 block w-full rounded-xl border-gray-300 focus:border-brand-primary focus:ring-brand-primary shadow-sm"
                        autoComplete="new-password"
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div>
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Konfirmasi Password Baru"
                        className="text-gray-700 font-medium mb-1"
                    />

                    <TextInput
                        id="password_confirmation"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        type="password"
                        className="mt-1 block w-full rounded-xl border-gray-300 focus:border-brand-primary focus:ring-brand-primary shadow-sm"
                        autoComplete="new-password"
                    />

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>

                <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                    <button 
                        type="submit"
                        disabled={processing} 
                        className="bg-brand-primary hover:bg-brand-purple text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-purple-900/20 transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                        {processing ? <i className="ph ph-spinner animate-spin"></i> : <i className="ph ph-lock-key"></i>}
                        Perbarui Password
                    </button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out duration-300"
                        enterFrom="opacity-0 -translate-x-2"
                        enterTo="opacity-100 translate-x-0"
                        leave="transition ease-in-out duration-300"
                        leaveFrom="opacity-100 translate-x-0"
                        leaveTo="opacity-0 -translate-x-2"
                    >
                        <p className="text-sm text-green-600 font-medium flex items-center gap-1 bg-green-50 px-3 py-1.5 rounded-lg border border-green-100">
                            <i className="ph-fill ph-check-circle"></i> Berhasil diperbarui.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
