"use client";

import { GripVertical, Trash2, X } from "lucide-react";
import React, { useRef } from "react";
import { useFormContext } from "react-hook-form";
import upload from "@/assets/upload.svg";
import Image from "next/image";

export default function AddProjectPhotoUpload() {
  const { setValue, watch } = useFormContext<any>();
  const files: File[] = watch("images") || [];
  const inputRef = useRef<HTMLInputElement | null>(null);
  const dragIndex = useRef<number | null>(null);

  const pickFiles = () => inputRef.current?.click();

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    if (!selected) return;

    const validImages = Array.from(selected).filter((file) =>
      file.type.startsWith("image/")
    );

    if (validImages.length) {
      setValue("images", [...files, ...validImages], {
        shouldValidate: true,
      });
    }

    e.target.value = "";
  };

  const removeFile = (index: number) => {
    const updated = files.filter((_, i) => i !== index);
    setValue("images", updated, { shouldValidate: true });
  };

  const moveItem = (from: number, to: number) => {
    if (from === to) return;

    const updated = [...files];
    const [item] = updated.splice(from, 1);
    updated.splice(to, 0, item);

    setValue("images", updated, { shouldValidate: true });
  };

  return (
    <div className="h-[80svh] p-4 overflow-y-auto overflow-x-hidden">
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
            const previewUrl =
              file instanceof File
                ? URL.createObjectURL(file)
                : typeof file === "string"
                  ? file
                  : "";

            return (
              <div
                key={idx}
                className="relative rounded-xl overflow-hidden h-58"
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  if (dragIndex.current !== null) {
                    moveItem(dragIndex.current, idx);
                    dragIndex.current = null;
                  }
                }}
              >
                <Image
                  src={previewUrl}
                  alt="preview"
                  fill
                  className="object-cover"
                />

                <button
                  type="button"
                  onClick={() => removeFile(idx)}
                  className="absolute top-2 right-2 bg-white p-2 rounded-full"
                >
                  <Trash2 size={14} className="text-[#F00004]" />
                </button>

                <button
                  type="button"
                  draggable
                  onDragStart={() => (dragIndex.current = idx)}
                  className="absolute top-12 right-2 bg-white p-2 rounded-full cursor-grab active:cursor-grabbing"
                  title="Move image"
                >
                  <GripVertical size={14} />
                </button>

                {/* INFO */}
                <div className="absolute bottom-2 right-2 bg-black/30 text-xs px-2 py-1 rounded text-white">
                  {idx + 1}/{files.length} {idx === 0 ? "Preferred cover" : ""}
                </div>
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
