import { useAppSelector } from "@/lib/store/hooks";
import { RootState } from "@/lib/store/store";

export default function GroupBuyProgess() {

  const {groupBuyProgress} = useAppSelector((state:RootState)=>state.dashboard)

  return (
    <section id="groupBuyProgress" className="w-full shadow-[0_10px_30px_rgba(0,0,0,0.04)] bg-white border rounded-xl h-full">
      <div className="p-4 space-y-6">
        <h1 className="text-[19px] font-bold ">Group-Buy Progress</h1>
        <div className="space-y-6">
            <div className="p-5 rounded-lg bg-linear-to-r from-card via-card to-transparent">
              <div className="font-semibold text-xl">{"Target Units"}</div>
              <div className="text-gray-500">{groupBuyProgress?.targetUnits} {" Units"}</div>
            </div>

            <div className="p-5 rounded-lg bg-linear-to-r from-card via-card to-transparent">
              <div className="font-semibold text-xl">{"Confirmed Units"}</div>
              <div className="text-gray-500">{groupBuyProgress?.confirmedUnits}{" Units"}</div>
            </div>
        </div>
      </div>
    </section>
  );
}