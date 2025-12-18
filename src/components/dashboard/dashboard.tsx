"use client";
import { useEffect } from "react";
import DashboardHeader from "./dashboardHeader";
import DashboardKPI from "./dashboardKPI";
import DashboardLeads from "./dashboardLead";
import DashboardRecentLeads from "./dashboardReacentLeads";
import { useAppDispatch } from "@/lib/store/hooks";
import { fetchDashboard } from "@/lib/features/dashboard/dashboardApi";

export default function Dashboard() {
  const dispatch = useAppDispatch();

  async function getDashboardData() {
    await dispatch(fetchDashboard());
  }

  useEffect(() => {
    getDashboardData();

    
  }, [dispatch]);

  return (
    <div className="space-y-5 pt-5">
      {/* <DashboardHeader /> */}
      <DashboardKPI />
      <DashboardRecentLeads />
      <DashboardLeads />
    </div>
  );
}
