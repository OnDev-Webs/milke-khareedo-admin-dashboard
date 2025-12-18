import cardImg from "@/assets/cardImg.jpg"
import Image from "next/image";

export default function TopPerformingProjects() {
  type Project = {
    id: string;
    name: string;
    newLeads: number;
  };
  const cardData: Project[] = [
    { id: "1", name: "Project Name", newLeads: 50 },
    { id: "2", name: "Project Name", newLeads: 20 },
    { id: "3", name: "Project Name", newLeads: 10 },
  ];
  return (
    <div className="border rounded-2xl bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
      <div className="flex items-start justify-between mb-6.5">
        <h3 className="text-xl font-bold text-[#474747]">
          Top Performing Projects
        </h3>
        <div className="text-sm text-gray-600">
          <button className="hover:underline">View All</button>
        </div>
      </div>

      <div className="overflow-x-auto md:overflow-visible">
        <div className="flex gap-4 overflow-x-auto hide-scrollbar">
          {cardData.map((proj) => (
            <div
              key={proj.id}
              className="min-w-52 rounded-xl overflow-hidden bg-[#f7f5ff] shadow-sm "
            >
              <div className="relative rounded-lg ">
                <div className="h-56 w-full rounded-md flex items-center justify-center">
                  <Image src={cardImg} alt="" className="w-full h-full"/>
                </div>
              <div className="absolute bottom-0 space-y-2 text-sm px-4 bg-black/70 inset-0 flex flex-col justify-end pb-2">
                <Image src={cardImg} alt="" className="w-10 h-10 bg-gray-200 rounded-full" />
                <div>
                  <div className=" text-white text-sm">{proj.name}</div>
                  <div className=" text-base text-orange-500 font-semibold">
                    {proj.newLeads} New Leads
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