import { Head } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';

interface TeamMember {
    id: number;
    name: string;
    role: string;
    category: string;
    image: string | null;
}

export default function TimKami({ teamMembers }: { teamMembers: TeamMember[] }) {
    const developers = teamMembers.filter(m => m.category === 'developer');
    const experts = teamMembers.filter(m => m.category === 'expert');
    const peers = teamMembers.filter(m => m.category === 'peer');
    
    // Helper untuk dummy image jika gambar kosong
    const getAvatar = (member: TeamMember) => {
        if (member.image) return member.image;
        const bg = member.category === 'developer' ? '6b21a8' : member.category === 'expert' ? '10b981' : '3b82f6';
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=${bg}&color=fff&size=200`;
    };

    return (
        <PublicLayout>
            <Head title="Tim Kami - Karir Sebaya" />
            
            <div className="pt-32 pb-24 px-6 lg:px-20 bg-brand-light font-sans">
                <div className="max-w-7xl mx-auto">
                    
                    <div className="text-center mb-20" data-aos="fade-up">
                        <p className="text-brand-primary font-semibold text-sm tracking-wider uppercase mb-3">Orang-orang di Balik Layar</p>
                        <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6">Kenalan Sama Tim Kami</h1>
                        <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
                            Misi kami didukung oleh para profesional yang berdedikasi tinggi. Mulai dari tim teknis hingga barisan konselor yang siap membantu perjalanan karirmu.
                        </p>
                    </div>

                    {/* Tim Pengembang */}
                    <div className="mb-24">
                        <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2 border-b-2 border-brand-primary/20 pb-4 inline-block">Tim Pengembang</h2>
                        <div className="grid md:grid-cols-3 gap-8 mt-10">
                            {developers.map((member, idx) => (
                                <div key={idx} className="bg-white rounded-3xl p-8 custom-shadow hover:-translate-y-2 transition-transform duration-300 text-center border border-gray-100 group" data-aos="fade-up" data-aos-delay={idx * 100}>
                                    <div className="w-32 h-32 mx-auto rounded-2xl overflow-hidden mb-6 ring-4 ring-brand-light group-hover:ring-brand-accent/30 transition-all">
                                        <img src={getAvatar(member)} alt={member.name} className="w-full h-full object-cover" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                                    <p className="text-brand-primary text-sm font-medium">{member.role}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Konselor Ahli */}
                    <div className="mb-24">
                        <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2 border-b-2 border-brand-primary/20 pb-4 inline-block">Konselor Ahli</h2>
                        <p className="text-gray-600 mb-10 max-w-2xl mt-4">Pakar psikologi dan praktisi HR yang memiliki jam terbang tinggi dalam membantu individu merancang masa depan karir yang cerah.</p>
                        <div className="grid md:grid-cols-3 gap-8">
                            {experts.map((member, idx) => (
                                <div key={idx} className="bg-white rounded-3xl p-8 custom-shadow hover:-translate-y-2 transition-transform duration-300 text-center border border-gray-100 group" data-aos="fade-up" data-aos-delay={idx * 100}>
                                    <div className="w-32 h-32 mx-auto rounded-2xl overflow-hidden mb-6 ring-4 ring-brand-light group-hover:ring-brand-accent/30 transition-all">
                                        <img src={getAvatar(member)} alt={member.name} className="w-full h-full object-cover" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                                    <p className="text-brand-primary text-sm font-medium">{member.role}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Konselor Sebaya */}
                    <div>
                        <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2 border-b-2 border-brand-primary/20 pb-4 inline-block">Konselor Sebaya (Peer)</h2>
                        <p className="text-gray-600 mb-10 max-w-2xl mt-4">Teman diskusi yang asik, nyambung, dan baru saja melewati fase yang kamu alami saat ini. Siap berbagi tips praktis seputar dunia kerja.</p>
                        <div className="grid md:grid-cols-3 gap-8 mt-10">
                            {peers.map((member, idx) => (
                                <div key={idx} className="bg-white rounded-3xl p-8 custom-shadow hover:-translate-y-2 transition-transform duration-300 text-center border border-gray-100 group" data-aos="fade-up" data-aos-delay={idx * 100}>
                                    <div className="w-32 h-32 mx-auto rounded-2xl overflow-hidden mb-6 ring-4 ring-brand-light group-hover:ring-brand-accent/30 transition-all">
                                        <img src={getAvatar(member)} alt={member.name} className="w-full h-full object-cover" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                                    <p className="text-brand-primary text-sm font-medium">{member.role}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </PublicLayout>
    );
}
