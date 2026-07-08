import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}: {
    mustVerifyEmail: boolean;
    status?: string;
    className?: string;
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            prodi: user.prodi || '',
            semester: user.semester || '',
            email: user.email,
        });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <form onSubmit={submit} className="space-y-6">
                <div>
                    <InputLabel htmlFor="name" value="Nama Lengkap" className="text-gray-700 font-medium mb-1" />

                    <TextInput
                        id="name"
                        className="mt-1 block w-full rounded-xl border-gray-300 focus:border-brand-primary focus:ring-brand-primary shadow-sm"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                    />

                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div>
                    <InputLabel htmlFor="prodi" value="Program Studi" className="text-gray-700 font-medium mb-1" />

                    <TextInput
                        id="prodi"
                        className="mt-1 block w-full rounded-xl border-gray-300 focus:border-brand-primary focus:ring-brand-primary shadow-sm"
                        value={data.prodi}
                        onChange={(e) => setData('prodi', e.target.value)}
                        required
                    />

                    <InputError className="mt-2" message={errors.prodi} />
                </div>

                <div>
                    <InputLabel htmlFor="semester" value="Semester" className="text-gray-700 font-medium mb-1" />

                    <TextInput
                        id="semester"
                        className="mt-1 block w-full rounded-xl border-gray-300 focus:border-brand-primary focus:ring-brand-primary shadow-sm"
                        value={data.semester}
                        onChange={(e) => setData('semester', e.target.value)}
                        required
                    />

                    <InputError className="mt-2" message={errors.semester} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Alamat Email" className="text-gray-700 font-medium mb-1" />

                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full rounded-xl border-gray-300 focus:border-brand-primary focus:ring-brand-primary shadow-sm bg-gray-50 text-gray-500"
                        value={data.email}
                        disabled
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />
                    <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                        <i className="ph-fill ph-info"></i> Alamat email tidak dapat diubah untuk menjaga keamanan akun.
                    </p>

                    <InputError className="mt-2" message={errors.email} />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                        <p className="text-sm text-yellow-800">
                            Alamat email Anda belum diverifikasi.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="ml-1 font-bold underline hover:text-yellow-900 focus:outline-none"
                            >
                                Klik di sini untuk mengirim ulang email verifikasi.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-medium text-green-600">
                                Tautan verifikasi baru telah dikirim ke alamat email Anda.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                    <button 
                        type="submit"
                        disabled={processing} 
                        className="bg-brand-primary hover:bg-brand-purple text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-purple-900/20 transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                        {processing ? <i className="ph ph-spinner animate-spin"></i> : <i className="ph ph-floppy-disk"></i>}
                        Simpan Perubahan
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
                            <i className="ph-fill ph-check-circle"></i> Berhasil disimpan.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
