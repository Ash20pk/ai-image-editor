"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Wand2 } from "lucide-react";
import { toast } from "react-hot-toast";

interface Props {
  getImageData: () => Promise<any>;
  getMaskData: () => Promise<any>;
  onGenerate?: (blob: Blob, prompt: string) => void;
  onGenerateStart?: () => void;
  onGenerateEnd?: () => void;
}

export default function GenerateImage({
  getImageData,
  getMaskData,
  onGenerate,
  onGenerateStart,
  onGenerateEnd,
}: Props) {
  const [prompt, setPrompt] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  const placeholders = [
    "Make the sky more dramatic with sunset colors",
    "Remove the background and replace it with a beach scene",
    "Add a soft, dreamy glow to the entire image",
    "Change the subject's hair color to vibrant blue"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prevIndex) => (prevIndex + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const canGenerate = !!prompt && !isGenerating;

  const onPromptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value);
  };

  const generate = async () => {
    if (!canGenerate) return;

    setIsGenerating(true);
    onGenerateStart && onGenerateStart();

    try {
      const image = (await getImageData()) as Blob;
      const mask = (await getMaskData()) as Blob;

      if (!image || !mask) throw new Error("Failed to get image or mask data");

      const formData = new FormData();
      formData.append("image", image);
      formData.append("mask", mask);
      formData.append("prompt", prompt);
      formData.append("response_format", "b64_json");

      const response = await fetch("/images/edit", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.error) {
        throw new Error(result.error.message);
      }

      const imageData = result.data[0].b64_json;
      const blob = dataURLToBlob(imageData, "image/png");

      if (onGenerate) {
        onGenerate(blob, prompt);
      }

      toast.success("Image generated successfully!");
    } catch (error) {
      console.error("Generation error:", error);
      toast.error("Failed to generate image. Please try again.");
    } finally {
      setIsGenerating(false);
      onGenerateEnd && onGenerateEnd();
    }
  };

  const dataURLToBlob = (dataURL: string, type: string) => {
    var binary = atob((dataURL || "").trim());
    var array = new Array(binary.length);

    for (let i = 0; i < binary.length; i++) {
      array[i] = binary.charCodeAt(i);
    }

    return new Blob([new Uint8Array(array)], { type });
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col md:flex-row gap-2">
        <input
          type="text"
          value={prompt}
          placeholder={placeholders[placeholderIndex]}
          onChange={onPromptChange}
          className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700 placeholder-gray-400 transition-all duration-300 ease-in-out"
        />
        <Button 
          onClick={generate} 
          disabled={!canGenerate}
          className={`px-6 py-2 font-semibold text-white rounded-lg transition-all duration-300 ease-in-out ${
            canGenerate 
              ? 'bg-indigo-600 hover:bg-indigo-700' 
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5 mr-2" />
              Generate
            </>
          )}
        </Button>
      </div>
      <p className="text-sm text-gray-500 italic">
        Tip: Be specific in your prompt for better results!
      </p>
    </div>
  );
}