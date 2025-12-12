import DashboardHeader from "./dashboardHeader";
import DashboardKPI from "./dashboardKPI";
import DashboardLeads from "./dashboardLead";
import DashboardRecentLeads from "./dashboardReacentLeads";

export default function Dashboard() {
  return (
    <div className="space-y-5 pt-5">
      <DashboardHeader />
      <DashboardKPI />
      <DashboardRecentLeads />
      <DashboardLeads/>
      
    </div>
  );
}
