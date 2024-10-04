"use client";

import { useState, useRef, useCallback } from "react";
import { CropperRef, FixedCropperRef, FixedCropper, ImageRestriction, Coordinates } from "react-advanced-cropper";
import "react-advanced-cropper/dist/style.css";
import { createCanvas, drawImage, getCanvasData, drawMask } from "@/lib/canvas";
import ImageSelector from "@/components/ImageSelector";
import Navigation from "@/components/Navigation";
import LoaderIcon from "@/components/icons/LoaderIcon";
import { FiUpload } from "react-icons/fi"; // Make sure to install react-icons if you haven't already

interface Props {
  createEdit?: (prompt: string) => void;
}

export default function ImageEditor({ createEdit }: Props) {
  const cropperRef = useRef<FixedCropperRef>(null);
  const [selectionRect, setSelectionRect] = useState<Coordinates | null>();
  const [src, setSrc] = useState("");
  const [mode, setMode] = useState("crop");
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const isGenerating = mode === "generate";

  const crop = async () => {
    const imageSrc = await getCroppedImageSrc();
    if (imageSrc) {
      setSrc(imageSrc);
      setMode("generate");
    }
  };

  const onUpload = useCallback((imageSrc: string) => {
    setSrc(imageSrc);
    setMode("crop");
  }, []);

  const onGenerate = (imageSrc: string, prompt: string) => {
    createEdit && createEdit(prompt);
    setSrc(imageSrc);
  };

  const onDownload = async () => {
    if (isGenerating) {
      downloadImage(src);
      return;
    }
    const imageSrc = await getCroppedImageSrc();
    if (imageSrc) {
      downloadImage(imageSrc);
    }
  };

  const downloadImage = (objectUrl: string) => {
    const linkElement = document.createElement("a");
    linkElement.download = "image.png";
    linkElement.href = objectUrl;
    linkElement.click();
  };

  const getCroppedImageSrc = async () => {
    if (!cropperRef.current) return;
    const canvas = cropperRef.current.getCanvas({
      height: 1024,
      width: 1024,
    });
    if (!canvas) return;
    const blob = (await getCanvasData(canvas)) as Blob;
    return blob ? URL.createObjectURL(blob) : null;
  };

  const onSelectionChange = (cropper: CropperRef) => {
    setSelectionRect(cropper.getCoordinates());
  };

  const getImageData = async () => {
    if (!src) return;
    const canvas = createCanvas();
    await drawImage(canvas, src);
    return getCanvasData(canvas);
  };

  const getMaskData = async () => {
    if (!src || !selectionRect) return;
    const canvas = createCanvas();
    await drawImage(canvas, src);
    drawMask(canvas, selectionRect);
    return getCanvasData(canvas);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onUpload(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  }, [onUpload]);

  return (
    <div className="bg-white p-8 max-w-4xl mx-auto">
      <div className="relative w-full mb-6 overflow-hidden rounded-lg shadow-lg">
        <div className="aspect-w-16 aspect-h-9">
          {src ? (
            isGenerating ? (
              <ImageSelector
                src={src}
                selectionRect={selectionRect}
                onSelectionChange={onSelectionChange}
              />
            ) : (
              <FixedCropper
                src={src}
                ref={cropperRef}
                className={"h-full"}
                stencilProps={{
                  movable: false,
                  resizable: false,
                  lines: false,
                  handlers: false,
                }}
                stencilSize={{
                  width: 600,
                  height: 600,
                }}
                imageRestriction={ImageRestriction.stencil}
              />
            )
          ) : (
            <div 
              className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 transition-all duration-300 ease-in-out ${isDragging ? 'scale-98 ring-2 ring-blue-400' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="text-center p-8 rounded-lg backdrop-blur-sm bg-white/30">
                <FiUpload className="mx-auto text-4xl text-blue-500 mb-4" />
                <p className="text-gray-700 font-semibold mb-2">Drag and drop an image here</p>
                <p className="text-gray-500 mb-4">or</p>
                <label 
                  htmlFor="fileInput"
                  className="cursor-pointer inline-block px-6 py-3 bg-blue-500 text-white rounded-full font-semibold shadow-md hover:bg-blue-600 transition-colors duration-300"
                >
                  Select an image
                </label>
                <input 
                  id="fileInput"
                  type="file" 
                  accept="image/*" 
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        if (event.target?.result) {
                          onUpload(event.target.result as string);
                        }
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </div>
            </div>
          )}
        </div>
        {isLoading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <LoaderIcon />
          </div>
        )}
      </div>
      <Navigation
        mode={mode}
        onUpload={onUpload}
        onDownload={onDownload}
        onCrop={crop}
        onGenerate={onGenerate}
        onGenerateStart={() => setIsLoading(true)}
        onGenerateEnd={() => setIsLoading(false)}
        getImageData={getImageData}
        getMaskData={getMaskData}
      />
    </div>
  );
}