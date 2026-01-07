import cardImg from "@/assets/cardImg.jpg";
import { useAppSelector } from "@/lib/store/hooks";
import { RootState } from "@/lib/store/store";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function TopPerformingProjects() {
  const router = useRouter();
  const { topPerformingProjects } = useAppSelector((state: RootState) => state.dashboard);

  return (
    <div className="border rounded-2xl bg-white py-4 px-4 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
      <div className="flex items-start justify-between mb-6.5">
        <h3 className="text-[18px] font-bold text-[#000000]">Top Performing Projects</h3>
        <div className="text-[17px] font-medium text-[#3A59A6]">
            <button onClick={() => router.push("/properties")} className="hover:underline">
              View All
            </button>
        </div>
      </div>

      <div className="overflow-x-auto md:overflow-visible">
        <div className="flex gap-4 overflow-x-auto hide-scrollbar">
          {topPerformingProjects?.map((proj) => (
            <div key={proj.id} className="min-w-[170px] rounded-xl overflow-hidden bg-[#f7f5ff] shadow-sm">
              <div className="relative rounded-lg ">
                <div className="h-[210px] w-full rounded-md flex items-center justify-center">
                  <Image
                    src={proj.image || cardImg}
                    alt={proj.projectName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute bottom-0 space-y-2 text-sm px-4 inset-0 flex flex-col justify-end pb-2 bg-gradient-to-t from-black/90 via-black/70 to-transparent">
                  <img
                    src={proj?.image}
                    alt="img"
                    className="w-10 h-10 bg-gray-200 rounded-full"
                  />
                  <div>
                    <div className=" text-white text-sm">
                      {proj.projectName}
                    </div>
                    <div className=" text-base text-orange-500 font-semibold">
                      {proj.newLeadsFormatted}
                    </div>
                  </div>
                </div>
                <div className=" inset-0 z-0 absolute"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
