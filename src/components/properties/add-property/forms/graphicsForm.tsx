"use client";

import { X } from "lucide-react";
import React, { useRef } from "react";
import { useFormContext } from "react-hook-form";
import upload from "@/assets/upload.svg";

export default function AddProjectPhotoUpload() {
  const { setValue, watch } = useFormContext<any>();
  const files: File[] = watch("projectImages") || [];
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
      setValue("projectImages", [...files, ...validImages], {
        shouldValidate: true,
      });
    }

    e.target.value = "";
  };

  /** REMOVE IMAGE */
  const removeFile = (index: number) => {
    const updated = files.filter((_, i) => i !== index);
    setValue("projectImages", updated, { shouldValidate: true });
  };

  return (
    <div className="h-[85svh] p-4">
      {files.length === 0 && (
        <div className="w-full h-full flex items-center justify-center">
          <div
            onClick={pickFiles}
            className="w-full max-w-100 cursor-pointer flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-blue-400 bg-blue-50/40 px-10 py-8 text-center hover:bg-blue-50"
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
        <div className="grid grid-cols-4 gap-4">
          {files.map((file, idx) => {
            const previewUrl = URL.createObjectURL(file);

            return (
              <div
                key={idx}
                className="relative rounded-md overflow-hidden group"
              >
                <img
                  src={previewUrl}
                  alt="preview"
                  className="w-full h-full object-cover"
                />

                <button
                  type="button"
                  onClick={() => removeFile(idx)}
                  className="absolute top-2 right-2 bg-black/60 p-1 rounded-full opacity-0 group-hover:opacity-100"
                >
                  <X size={14} className="text-white" />
                </button>

                {idx === 0 && (
                  <div className="absolute bottom-2 left-2 bg-black/60 text-xs px-2 py-1 rounded text-white">
                    Cover photo
                  </div>
                )}
              </div>
            );
          })}

          <div
            onClick={pickFiles}
            className="cursor-pointer flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-blue-400 bg-blue-50/40 px-10 py-8 text-center hover:bg-blue-50"
          >
            <img src={upload.src} alt="" className="mb-4" />
            <p className="text-sm font-medium text-gray-800">
              Upload Project Photo{" "}
              <span className="font-semibold text-[#1849D6]">browse</span>
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
