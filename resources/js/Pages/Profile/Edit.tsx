import PublicLayout from '@/Layouts/PublicLayout';
import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({
    mustVerifyEmail,
    status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
    return (
        <PublicLayout>
            <Head title="Profil Saya" />

            <div className="min-h-screen bg-brand-light font-sans pt-32 pb-24 relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-primary/5 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-accent/5 rounded-full blur-[100px]"></div>

                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 relative z-10">
                    
                    <div className="mb-10 text-center" data-aos="fade-up">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-brand-primary text-3xl shadow-lg border border-gray-100 mx-auto mb-4">
                            <i className="ph ph-user-circle-gear"></i>
                        </div>
                        <h2 className="text-3xl font-serif font-bold text-gray-900">
                            Pengaturan Profil
                        </h2>
                        <p className="text-gray-500 mt-2 max-w-lg mx-auto">
                            Kelola informasi personal, keamanan akun, dan preferensi Anda di Karir Sebaya.
                        </p>
                    </div>

                    <div className="space-y-8">
                        <div className="bg-white p-8 shadow-xl shadow-gray-200/50 sm:rounded-3xl border border-gray-100 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-900/5" data-aos="fade-up" data-aos-delay="100">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-xl">
                                    <i className="ph-fill ph-identification-card"></i>
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg">Informasi Personal</h3>
                                    <p className="text-xs text-gray-500">Perbarui nama dan alamat email Anda.</p>
                                </div>
                            </div>
                            <UpdateProfileInformationForm
                                mustVerifyEmail={mustVerifyEmail}
                                status={status}
                                className="max-w-xl"
                            />
                        </div>

                        <div className="bg-white p-8 shadow-xl shadow-gray-200/50 sm:rounded-3xl border border-gray-100 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-900/5" data-aos="fade-up" data-aos-delay="200">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                                <div className="w-10 h-10 bg-brand-primary/10 text-brand-primary rounded-xl flex items-center justify-center text-xl">
                                    <i className="ph-fill ph-lock-key"></i>
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg">Keamanan Akun</h3>
                                    <p className="text-xs text-gray-500">Pastikan akun Anda menggunakan kata sandi panjang dan acak agar tetap aman.</p>
                                </div>
                            </div>
                            <UpdatePasswordForm className="max-w-xl" />
                        </div>

                        <div className="bg-white p-8 shadow-xl shadow-red-200/20 sm:rounded-3xl border border-red-100 transition-all duration-300 hover:shadow-2xl hover:shadow-red-900/5" data-aos="fade-up" data-aos-delay="300">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-red-50">
                                <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center text-xl">
                                    <i className="ph-fill ph-warning-circle"></i>
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg">Hapus Akun</h3>
                                    <p className="text-xs text-gray-500">Tindakan ini bersifat permanen dan tidak dapat dibatalkan.</p>
                                </div>
                            </div>
                            <DeleteUserForm className="max-w-xl" />
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
