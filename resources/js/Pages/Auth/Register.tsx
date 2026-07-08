import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        nim: '',
        no_telp: '',
        asal_instansi: '',
        prodi: '',
        semester: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Register" />
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Mulai Perjalanan Karirmu</h2>
                <p className="text-gray-600 text-sm">Daftar sekarang dan temukan mentor terbaik untuk merencanakan masa depanmu.</p>
            </div>

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <InputLabel htmlFor="name" value="Name" />

                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />

                    <InputError message={errors.name as string} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="nim" value="NIM (Opsional)" />

                    <TextInput
                        id="nim"
                        name="nim"
                        value={data.nim}
                        className="mt-1 block w-full"
                        onChange={(e) => setData('nim', e.target.value)}
                    />

                    <InputError message={errors.nim as string} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="no_telp" value="Nomor WhatsApp" />

                    <TextInput
                        id="no_telp"
                        name="no_telp"
                        type="text"
                        value={data.no_telp}
                        className="mt-1 block w-full"
                        placeholder="Contoh: 62812345678"
                        onChange={(e) => setData('no_telp', e.target.value)}
                        required
                    />

                    <InputError message={errors.no_telp as string} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="asal_instansi" value="Asal Instansi" />

                    <TextInput
                        id="asal_instansi"
                        name="asal_instansi"
                        value={data.asal_instansi}
                        className="mt-1 block w-full"
                        placeholder="Contoh: Universitas Negeri Makassar"
                        onChange={(e) => setData('asal_instansi', e.target.value)}
                        required
                    />

                    <InputError message={errors.asal_instansi as string} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="prodi" value="Program Studi" />

                    <TextInput
                        id="prodi"
                        name="prodi"
                        value={data.prodi}
                        className="mt-1 block w-full"
                        placeholder="Contoh: Psikologi"
                        onChange={(e) => setData('prodi', e.target.value)}
                        required
                    />

                    <InputError message={errors.prodi as string} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="semester" value="Semester" />

                    <TextInput
                        id="semester"
                        name="semester"
                        value={data.semester}
                        className="mt-1 block w-full"
                        placeholder="Contoh: 6"
                        onChange={(e) => setData('semester', e.target.value)}
                        required
                    />

                    <InputError message={errors.semester as string} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        required
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
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirm Password"
                    />

                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        required
                    />

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>

                <div className="mt-8 flex flex-col items-center justify-center space-y-4">
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full py-3 rounded-full bg-brand-primary text-white font-bold hover:bg-brand-purple transition-all duration-300 shadow-lg shadow-purple-900/20 disabled:opacity-50"
                    >
                        Buat Akun Baru
                    </button>

                    <div className="text-sm text-gray-600 flex flex-col items-center gap-2 w-full mt-4 border-t border-gray-100 pt-4">
                        <p>
                            Sudah punya akun?{' '}
                            <Link
                                href={route('login')}
                                className="text-brand-accent font-bold hover:underline"
                            >
                                Masuk di sini
                            </Link>
                        </p>
                    </div>
                </div>
            </form>
        </GuestLayout>
    );
}
