import { Head, usePage } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import { useState, useRef } from 'react';

export default function Panduan() {
    const [pageNumber, setPageNumber] = useState(1);
    const [zoom, setZoom] = useState(100);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const viewerRef = useRef<HTMLDivElement>(null);
    const totalPages = 5; // Dummy total pages

    const { global_settings } = usePage().props as any;
    
    // PDF URL from settings
    const pdfUrl = global_settings?.panduan_file || "";

    const zoomIn = () => {
        if (zoom < 200) setZoom(prev => prev + 25);
    };

    const zoomOut = () => {
        if (zoom > 50) setZoom(prev => prev - 25);
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            viewerRef.current?.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    };

    // Listen to fullscreen changes
    if (typeof window !== 'undefined') {
        window.addEventListener('fullscreenchange', () => {
            setIsFullscreen(!!document.fullscreenElement);
        });
    }

    return (
        <PublicLayout>
            <Head title="Panduan - Karir Sebaya" />
            
            <div className="pt-32 pb-24 px-6 lg:px-20 bg-brand-light font-sans min-h-screen">
                <div className="max-w-5xl mx-auto">
                    
                    <div className="text-center mb-12" data-aos="fade-up">
                        <p className="text-brand-primary font-semibold text-sm tracking-wider uppercase mb-3">Dokumentasi</p>
                        <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6">Panduan Penggunaan</h1>
                        <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
                            Pelajari cara memaksimalkan fitur-fitur di Karir Sebaya. Baca atau unduh modul panduan di bawah ini.
                        </p>
                    </div>

                    {/* PDF Viewer Container */}
                    <div 
                        ref={viewerRef}
                        className={`bg-white rounded-3xl overflow-hidden custom-shadow border border-gray-200 transition-all ${isFullscreen ? 'h-screen flex flex-col rounded-none border-none' : 'h-[700px] flex flex-col'}`}
                        data-aos="fade-up" 
                        data-aos-delay="100"
                    >
                        {/* Toolbar */}
                        <div className="bg-gray-900 text-white p-4 flex flex-wrap items-center justify-between gap-4 shrink-0">
                            
                            <div className="font-medium text-sm px-2">
                                <i className="ph ph-file-pdf mr-2"></i> Dokumen Panduan
                            </div>

                            {/* Zoom Controls */}
                            <div className="flex items-center gap-1 bg-gray-800 rounded-lg p-1">
                                <button onClick={zoomOut} className="p-2 hover:bg-gray-700 rounded-md transition-colors" title="Zoom Out">
                                    <i className="ph ph-magnifying-glass-minus text-lg"></i>
                                </button>
                                <span className="text-sm font-medium w-12 text-center">{zoom}%</span>
                                <button onClick={zoomIn} className="p-2 hover:bg-gray-700 rounded-md transition-colors" title="Zoom In">
                                    <i className="ph ph-magnifying-glass-plus text-lg"></i>
                                </button>
                            </div>

                            {/* Action Controls */}
                            <div className="flex items-center gap-2">
                                <a 
                                    href={pdfUrl}
                                    download="Panduan_KarirSebaya.pdf"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-2 px-4 py-2 bg-brand-primary hover:bg-brand-purple text-white text-sm font-bold rounded-lg transition-colors"
                                >
                                    <i className="ph ph-download-simple text-lg"></i> Unduh
                                </a>
                                
                                <div className="w-px h-6 bg-gray-700 mx-1"></div>
                                
                                <button onClick={toggleFullscreen} className="p-2 hover:bg-gray-800 rounded-md transition-colors" title={isFullscreen ? "Keluar Layar Penuh" : "Layar Penuh"}>
                                    {isFullscreen ? (
                                        <i className="ph ph-corners-in text-xl"></i>
                                    ) : (
                                        <i className="ph ph-corners-out text-xl"></i>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Viewer Body (Iframe) */}
                        <div className="flex-1 bg-gray-200 overflow-hidden relative flex items-center justify-center p-0">
                            {pdfUrl ? (
                                <iframe 
                                    src={`${pdfUrl}#view=FitH`} 
                                    className="w-full h-full border-0"
                                    style={{ minHeight: '100%' }}
                                ></iframe>
                            ) : (
                                <div className="text-center text-gray-500 bg-white shadow-xl flex flex-col items-center justify-center"
                                     style={{ width: '800px', minHeight: '100%', transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}>
                                    <i className="ph ph-file-pdf text-6xl text-gray-300 mb-4 block"></i>
                                    <p>File panduan belum diunggah.</p>
                                </div>
                            )}
                        </div>


                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
