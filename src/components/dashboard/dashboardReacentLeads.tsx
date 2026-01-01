import RecentLeads from "./recentLeads";
import TopPerformingProjects from "./topPerformingProjects";

export default function DashboardRecentLeads() {
  return (
    <section className="w-full">
      <div className="mx-auto  grid  grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-7">
          <RecentLeads />
        </div>

        <div className="col-span-5 hidden md:block">
          <TopPerformingProjects />
        </div>
      </div>
    </section>
  );
}