import React, { useState, useRef, useCallback } from 'react';
import Modal from './Modal';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface FreeformCropModalProps {
    show: boolean;
    imageSrc: string | null;
    onClose: () => void;
    onCropComplete: (croppedFile: File) => void;
    aspect?: number;
}

export default function FreeformCropModal({ show, imageSrc, onClose, onCropComplete, aspect }: FreeformCropModalProps) {
    const [crop, setCrop] = useState<Crop>({
        unit: '%',
        width: 50,
        height: 50,
        x: 25,
        y: 25
    });
    const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
    const imgRef = useRef<HTMLImageElement | null>(null);
    const [isCropping, setIsCropping] = useState(false);

    const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
        imgRef.current = e.currentTarget;
        const { width, height } = e.currentTarget;
        const cropWidthInPercent = (Math.min(width, height) / width) * 50;
        
        setCrop({
            unit: '%',
            width: cropWidthInPercent,
            height: (Math.min(width, height) / height) * 50,
            x: (100 - cropWidthInPercent) / 2,
            y: (100 - ((Math.min(width, height) / height) * 50)) / 2,
        });
    }, []);

    const getCroppedImg = async (
        image: HTMLImageElement,
        crop: PixelCrop,
        fileName: string
    ): Promise<File | null> => {
        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext('2d');

        if (!ctx) return null;

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
        );

        return new Promise((resolve, reject) => {
            canvas.toBlob((blob) => {
                if (!blob) {
                    reject(new Error('Canvas is empty'));
                    return;
                }
                const file = new File([blob], fileName, {
                    type: 'image/jpeg',
                    lastModified: Date.now(),
                });
                resolve(file);
            }, 'image/jpeg', 0.95);
        });
    };

    const handleSave = async () => {
        if (imgRef.current && completedCrop?.width && completedCrop?.height) {
            setIsCropping(true);
            try {
                const croppedFile = await getCroppedImg(imgRef.current, completedCrop, 'cropped_logo.jpg');
                if (croppedFile) {
                    onCropComplete(croppedFile);
                }
            } catch (e) {
                console.error(e);
            }
            setIsCropping(false);
            onClose();
        } else {
            // If no crop was explicitly completed but image exists, maybe they didn't change the crop
            onClose();
        }
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="2xl">
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Potong Foto</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <i className="ph ph-x text-xl"></i>
                    </button>
                </div>

                {imageSrc && (
                    <div className="relative w-full bg-gray-100 rounded-xl overflow-hidden mb-6 flex justify-center max-h-[500px]">
                        <ReactCrop
                            crop={crop}
                            onChange={(_, percentCrop) => setCrop(percentCrop)}
                            onComplete={(c) => setCompletedCrop(c)}
                            aspect={aspect}
                        >
                            <img
                                ref={imgRef}
                                src={imageSrc}
                                alt="Crop me"
                                className="max-h-[500px] w-auto object-contain"
                                onLoad={onImageLoad}
                                crossOrigin="anonymous"
                            />
                        </ReactCrop>
                    </div>
                )}

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-full font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                        disabled={isCropping}
                    >
                        Batal
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-6 py-2.5 rounded-full font-bold text-white bg-brand-primary hover:bg-brand-purple shadow-lg shadow-brand-primary/30 transition-all flex items-center gap-2"
                        disabled={isCropping || !completedCrop?.width || !completedCrop?.height}
                    >
                        {isCropping ? (
                            <><i className="ph ph-spinner animate-spin"></i> Memproses...</>
                        ) : (
                            <><i className="ph ph-crop"></i> Terapkan</>
                        )}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
