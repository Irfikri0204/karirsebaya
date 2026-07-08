import React, { useState, useCallback } from 'react';
import Modal from './Modal';
import Cropper from 'react-easy-crop';
import { Point, Area } from 'react-easy-crop';

interface ImageCropModalProps {
    show: boolean;
    imageSrc: string | null;
    onClose: () => void;
    onCropComplete: (croppedFile: File) => void;
    aspect?: number;
}

export default function ImageCropModal({ show, imageSrc, onClose, onCropComplete, aspect = 1 }: ImageCropModalProps) {
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [isCropping, setIsCropping] = useState(false);

    const onCropCompleteHandler = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const createImage = (url: string): Promise<HTMLImageElement> =>
        new Promise((resolve, reject) => {
            const image = new Image();
            image.addEventListener('load', () => resolve(image));
            image.addEventListener('error', (error) => reject(error));
            image.setAttribute('crossOrigin', 'anonymous');
            image.src = url;
        });

    const getCroppedImg = async (
        imageSrc: string,
        pixelCrop: Area,
    ): Promise<File | null> => {
        const image = await createImage(imageSrc);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            return null;
        }

        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;

        ctx.drawImage(
            image,
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height,
            0,
            0,
            pixelCrop.width,
            pixelCrop.height
        );

        return new Promise((resolve, reject) => {
            canvas.toBlob((file) => {
                if (file) {
                    const croppedFile = new File([file], 'cropped_image.jpg', {
                        type: 'image/jpeg',
                        lastModified: Date.now(),
                    });
                    resolve(croppedFile);
                } else {
                    reject(new Error('Canvas is empty'));
                }
            }, 'image/jpeg');
        });
    };

    const handleSave = async () => {
        if (imageSrc && croppedAreaPixels) {
            setIsCropping(true);
            try {
                const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels);
                if (croppedFile) {
                    onCropComplete(croppedFile);
                }
            } catch (e) {
                console.error(e);
            }
            setIsCropping(false);
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
                    <div className="relative w-full h-[400px] bg-gray-900 rounded-xl overflow-hidden mb-6">
                        <Cropper
                            image={imageSrc}
                            crop={crop}
                            zoom={zoom}
                            aspect={aspect}
                            onCropChange={setCrop}
                            onCropComplete={onCropCompleteHandler}
                            onZoomChange={setZoom}
                        />
                    </div>
                )}

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Zoom</label>
                    <input
                        type="range"
                        value={zoom}
                        min={1}
                        max={3}
                        step={0.1}
                        aria-labelledby="Zoom"
                        onChange={(e) => setZoom(Number(e.target.value))}
                        className="w-full"
                    />
                </div>

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
                        disabled={isCropping}
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
