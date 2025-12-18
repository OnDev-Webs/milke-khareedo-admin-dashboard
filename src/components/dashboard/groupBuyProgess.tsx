export default function GroupBuyProgess() {
  const arr = [
    {
      id: 1,
      title: "Target Units",
      description: "250 Units",
    },
    {
      id: 2,
      title: "Confirmed Units",
      description: "80 Units",
    },
  ];

  return (
    <section
      id="groupBuyProgress"
      className="w-full shadow-[0_10px_30px_rgba(0,0,0,0.04)] bg-white border rounded-xl h-full"
    >
      <div className="p-5 space-y-5">
        <h1 className="text-xl font-bold text-[#474747]">Group-Buy Progress</h1>
        <div className="space-y-5">
          {arr?.map((row) => (
            <div
              key={row?.id}
              className="p-5 rounded-lg bg-linear-to-r from-card via-card to-transparent"
            >
              <div className="font-semibold text-xl">{row?.title}</div>
              <div className="text-gray-500">{row?.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}