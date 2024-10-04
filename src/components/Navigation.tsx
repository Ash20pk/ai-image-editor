"use client";

import { useRef } from "react";
import { FiUpload, FiDownload } from "react-icons/fi";

import { Button } from "@/components/ui/button";
import IconButton from "@/components/icons/IconButton";
import GenerateImage from "@/components/GenerateImage";
import Link from 'next/link';

interface Props {
  mode?: string;
  onDownload?: () => void;
  onUpload?: (blob: string) => void;
  onCrop: () => void;
  onGenerate?: (blob: string, prompt: string) => void;
  onGenerateStart?: () => void;
  onGenerateEnd?: () => void;
  getImageData: () => Promise<any>;
  getMaskData: () => Promise<any>;
}

export default function Navigation({
  onUpload,
  onCrop,
  onGenerate,
  onGenerateStart,
  onGenerateEnd,
  onDownload,
  getImageData,
  getMaskData,
  mode,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const onUploadButtonClick = () => {
    inputRef.current?.click();
  };

  const onLoadImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;

    if (files && files[0]) {
      if (onUpload) {
        onUpload(URL.createObjectURL(files[0]));
      }
    }

    event.target.value = "";
  };

  const onGenerateImage = (blob: Blob, prompt: string) => {
    if (onGenerate) {
      onGenerate(URL.createObjectURL(blob), prompt);
    }
  };

  return (
    <div className="flex justify-between bg-slate-900 p-5">
      <IconButton title="Upload image" onClick={onUploadButtonClick}>
        <FiUpload />
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={onLoadImage}
          className="hidden"
        />
      </IconButton>
      <div className="flex grow items-center justify-center gap-2 mx-20">
        {mode === "crop" && <Button onClick={onCrop}>Crop</Button>}
        {mode === "generate" && (
          <>
            <GenerateImage
              getImageData={getImageData}
              getMaskData={getMaskData}
              onGenerate={onGenerateImage}
              onGenerateStart={onGenerateStart}
              onGenerateEnd={onGenerateEnd}
            />
          </>
        )}
      </div>
      <IconButton title="Download image" onClick={onDownload}>
        <FiDownload />
      </IconButton>
    </div>
  );
}
