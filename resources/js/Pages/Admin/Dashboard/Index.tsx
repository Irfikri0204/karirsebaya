import { Head, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function AdminDashboard({ stats, new_users = [], recent_activities = [] }: { stats: any, new_users?: any[], recent_activities?: any[] }) {
    const { auth } = usePage().props as any;

    return (
        <AdminLayout header="Dashboard Utama">
            <Head title="Admin Dashboard - Karir Sebaya" />

            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800">Selamat datang, {auth.user.name}!</h2>
                <p className="text-gray-500 mt-1">Berikut adalah ringkasan aktivitas dan metrik platform Karir Sebaya hari ini.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Stat Card 1 */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center text-2xl shrink-0">
                        <i className="ph-fill ph-users"></i>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Total Pengguna</p>
                        <h3 className="text-2xl font-bold text-gray-800 mt-1">{stats?.users_count || 0}</h3>
                    </div>
                </div>

                {/* Stat Card 2 */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-green-50 text-green-500 flex items-center justify-center text-2xl shrink-0">
                        <i className="ph-fill ph-check-circle"></i>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Tes Selesai</p>
                        <h3 className="text-2xl font-bold text-gray-800 mt-1">{stats?.riasec_tests_count || 0}</h3>
                    </div>
                </div>

                {/* Stat Card 3 */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center text-2xl shrink-0">
                        <i className="ph-fill ph-chats"></i>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Total Admin</p>
                        <h3 className="text-2xl font-bold text-gray-800 mt-1">{stats?.admins_count || 0}</h3>
                    </div>
                </div>

                {/* Stat Card 4 */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center text-2xl shrink-0">
                        <i className="ph-fill ph-users-three"></i>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Modul Edukasi</p>
                        <h3 className="text-2xl font-bold text-gray-800 mt-1">{stats?.modules_count || 0}</h3>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Aktivitas Terbaru Pengguna */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                        <h3 className="font-bold text-gray-800">Aktivitas Terbaru</h3>
                    </div>
                    <div className="p-0">
                        <div className="divide-y divide-gray-100">
                            {recent_activities.length > 0 ? recent_activities.map((activity, index) => (
                                <div key={index} className="p-6 flex items-start gap-4 hover:bg-gray-50 transition-colors">
                                    <div className={`mt-1 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                                        activity.type === 'user' ? 'bg-blue-100 text-blue-500' :
                                        activity.type === 'test' ? 'bg-green-100 text-green-500' :
                                        'bg-purple-100 text-purple-500'
                                    }`}>
                                        <i className={`ph-fill ${
                                            activity.type === 'user' ? 'ph-user-plus' :
                                            activity.type === 'test' ? 'ph-brain' :
                                            'ph-chat-centered-text'
                                        }`}></i>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">{activity.title}</p>
                                        <p className="text-xs text-gray-500 mt-1">{activity.description}</p>
                                        <span className="text-xs text-gray-400 mt-2 block">{activity.time}</span>
                                    </div>
                                </div>
                            )) : (
                                <div className="p-6 text-center text-gray-500 text-sm">Belum ada aktivitas.</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Recent Registrations */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-max">
                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                        <h3 className="font-bold text-gray-800">Pengguna Baru</h3>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {new_users.length > 0 ? new_users.map((user) => (
                            <div key={user.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                                        {user.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-800 text-sm">{user.name}</p>
                                        <p className="text-gray-500 text-xs">{user.email}</p>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="p-6 text-center text-gray-500 text-sm">Belum ada pengguna baru.</div>
                        )}
                    </div>
                </div>
            </div>
            
        </AdminLayout>
    );
}
