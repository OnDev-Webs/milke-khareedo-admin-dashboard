import RecentLeads from "./recentLeads";
import TopPerformingProjects from "./topPerformingProjects";

export default function DashboardRecentLeads() {
  return (
    <section className="w-full">
      <div className="mx-auto  grid  grid-cols-12 gap-4">
        <div className="col-span-7">
          <RecentLeads />
        </div>

        <div className="col-span-5">
          <TopPerformingProjects />
        </div>
      </div>
    </section>
  );
}
