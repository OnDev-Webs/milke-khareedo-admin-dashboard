import GroupBuyProgess from "./groupBuyProgess";
import Leads from "./leads";

type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  project: string;
  price: string;
};

type Project = {
  id: string;
  name: string;
  newLeads: number;
};

const data: Lead[] = [
  {
    id: "1",
    name: "Hello, John Deo!",
    email: "Email address",
    phone: "+91 695 265 2651",
    project: "Project name",
    price: "₹ 20.00 Cr",
  },
  {
    id: "2",
    name: "Hello, John Deo!",
    email: "Email address",
    phone: "+91 695 265 2651",
    project: "Project name",
    price: "₹ 20.00 Cr",
  },
  {
    id: "3",
    name: "Hello, John Deo!",
    email: "Email address",
    phone: "+91 695 265 2651",
    project: "Project name",
    price: "₹ 20.00 Cr",
  },
  {
    id: "4",
    name: "Hello, John Deo!",
    email: "Email address",
    phone: "+91 695 265 2651",
    project: "Project name",
    price: "₹ 20.00 Cr",
  },
];

const cardData: Project[] = [
  { id: "1", name: "Project Name", newLeads: 50 },
  { id: "2", name: "Project Name", newLeads: 20 },
  { id: "3", name: "Project Name", newLeads: 10 },
];

export default function DashboardLeads() {
  return (
    <section className="w-full">
      <div className="mx-auto  w-full grid gap-6 md:grid-cols-3">
        <div className="col-span-2">
          <Leads/>
        </div>
        <div className="col-span-1">
       <GroupBuyProgess/>
        </div>
      </div>
    </section>
  );
}