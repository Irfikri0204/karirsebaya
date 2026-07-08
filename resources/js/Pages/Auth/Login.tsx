import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false as boolean,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Selamat Datang Kembali!</h2>
                <p className="text-gray-600 text-sm">Silakan masukkan email dan password untuk masuk ke akun Anda.</p>
            </div>

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600 bg-green-50 p-3 rounded-lg">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4 block">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData(
                                    'remember',
                                    (e.target.checked || false) as false,
                                )
                            }
                        />
                        <span className="ms-2 text-sm text-gray-600 dark:text-gray-400">
                            Remember me
                        </span>
                    </label>
                </div>

                <div className="mt-8 flex flex-col items-center justify-center space-y-4">
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full py-3 rounded-full bg-brand-primary text-white font-bold hover:bg-brand-purple transition-all duration-300 shadow-lg shadow-purple-900/20 disabled:opacity-50"
                    >
                        Masuk ke Akun
                    </button>

                    <div className="text-sm text-gray-600 flex flex-col items-center gap-2 w-full mt-4 border-t border-gray-100 pt-4">
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-brand-primary font-medium hover:underline focus:outline-none"
                            >
                                Lupa password?
                            </Link>
                        )}
                        <p>
                            Belum punya akun?{' '}
                            <Link
                                href={route('register')}
                                className="text-brand-accent font-bold hover:underline"
                            >
                                Daftar Sekarang
                            </Link>
                        </p>
                    </div>
                </div>
            </form>
        </GuestLayout>
    );
}
