export default function Loader({ size = 32 }: { size?: number }) {
  return (
    <div className="flex items-center justify-center py-6">
      <div
        className="animate-spin rounded-full border-2 border-gray-200 border-t-[#2F3A8F]"
        style={{ width: size, height: size }}
      />
    </div>
  );
}
