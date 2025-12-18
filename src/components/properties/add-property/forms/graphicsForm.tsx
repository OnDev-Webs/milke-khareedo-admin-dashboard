"use client";

import { Upload, X } from "lucide-react";
import React, { useRef, useState } from "react";
import upload from "@/assets/upload.svg";

export default function AddProjectPhotoUpload({
  onBack,
  onContinue,
}: {
  onBack?: () => void;
  onContinue?: () => void;
}) {
  const [files, setFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  /** OPEN FILE PICKER */
  const pickFiles = () => inputRef.current?.click();

  /** HANDLE FILE SELECT */
  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    if (!selected) return;

    const validImages = Array.from(selected).filter((file) =>
      file.type.startsWith("image/")
    );

    if (validImages.length) {
      setFiles((prev) => [...prev, ...validImages]);
    }

    // Reset input so same file can be selected again
    e.target.value = "";
  };

  /** REMOVE IMAGE */
  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  /** CONTINUE */
  const handleSubmit = () => {
    if (!files.length) {
      alert("Please upload at least one photo.");
      return;
    }

    if (onContinue) onContinue();
  };

  return (
    <div className="h-[85svh]  text-white p-4">
      {files.length === 0 && (
        <div className="w-full h-full flex items-center justify-center ">
          <div
            onClick={pickFiles}
            className="w-full max-w-100 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-blue-400 bg-blue-50/40 px-10 py-8 text-center hover:bg-blue-50"
          >
            <img src={upload.src} alt="" className="mb-4" />
            <p className="text-sm font-medium text-gray-800">
              Upload Project Photo{" "}
              <span className="font-semibold text-[#1849D6]">browse</span>
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Max 10 MB files are allowed
            </p>
          </div>
        </div>
      )}

      {files.length > 0 && (
        <div className=" w-full grid grid-cols-4 gap-4 ">
          {files.map((file, idx) => {
            const previewUrl = URL.createObjectURL(file);

            return (
              <div
                key={idx}
                className="relative rounded-md overflow-hidden max-h-62 group"
              >
                <img
                  src={previewUrl}
                  alt="preview"
                  className="w-full h-full object-cover"
                />

                <button
                  onClick={() => removeFile(idx)}
                  className="absolute top-2 right-2 bg-black/60 p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                >
                  <X size={14} />
                </button>

                {idx === 0 && (
                  <div className="absolute bottom-2 left-2 bg-black/60 text-xs px-2 py-1 rounded">
                    Cover photo
                  </div>
                )}
              </div>
            );
          })}

          <div
            onClick={pickFiles}
            className="w-full h-62 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-blue-400 bg-blue-50/40 px-10 py-8 text-center hover:bg-blue-50"
          >
            <img src={upload.src} alt="" className="mb-4" />
            <p className="text-sm font-medium text-gray-800">
              Upload Project Photo{" "}
              <span className="font-semibold text-[#1849D6]">browse</span>
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Max 10 MB files are allowed
            </p>
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={onInputChange}
      />
    </div>
  );
}