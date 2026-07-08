import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Forgot Password" />

            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Lupa Password?</h2>
                <p className="text-sm text-gray-500 leading-relaxed">
                    Tidak masalah. Cukup beri tahu kami alamat email Anda dan kami akan mengirimkan tautan reset password yang memungkinkan Anda memilih password baru.
                </p>
            </div>

            {status && (
                <div className="mb-6 text-sm font-medium text-green-600 bg-green-50 p-3 rounded-xl border border-green-200">
                    {status}
                </div>
            )}

            <form onSubmit={submit}>
                <TextInput
                    id="email"
                    type="email"
                    name="email"
                    value={data.email}
                    className="mt-1 block w-full"
                    isFocused={true}
                    onChange={(e) => setData('email', e.target.value)}
                />

                <InputError message={errors.email} className="mt-2" />

                <div className="mt-4 flex items-center justify-end">
                    <PrimaryButton className="w-full justify-center bg-brand-primary hover:bg-brand-purple py-3 rounded-xl text-md" disabled={processing}>
                        Kirim Tautan Reset Password
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
