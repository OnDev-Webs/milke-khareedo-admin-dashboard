import upload from "@/assets/upload.svg"

export default function AddProjectPhotoUpload() {
  return (
    <div className="flex items-center justify-center bg-white h-[89svh]">
      <div>
        <label
        htmlFor="project-photo"
        className="w-100 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-blue-400 bg-blue-50/40 px-10 py-8 text-center hover:bg-blue-50"
      >
        <img src={upload.src} alt="" className="mb-4.5" />
        <p className="text-sm font-medium text-gray-800">
          Upload Project Photo{" "}
          <span className="font-semibold text-[#1849D6] ">browse</span>
        </p>

        <p className="mt-1 text-xs text-gray-500">
          Max 10 MB files are allowed
        </p>

        <input
          id="project-photo"
          type="file"
          accept="image/*"
          className="hidden"
        />
      </label>
      </div>
    </div>
  );
}
