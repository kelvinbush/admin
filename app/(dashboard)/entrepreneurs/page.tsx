import { ArrowUpRight } from "lucide-react";

const statCards = [
  { label: "Total SMEs", value: "0", delta: "0%" },
  { label: "Complete Profiles", value: "0", delta: "0%" },
  { label: "Incomplete Profiles", value: "0", delta: "0%" },
  { label: "Pending Activation", value: "0", delta: "0%" },
  { label: "SMEs with Loans", value: "0", delta: "0%" },
];

export default function EntrepreneursPage() {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="rounded-md bg-primaryGrey-500 text-white px-5 py-3.5 shadow-lg border border-white/5"
          >
            <p className="text-base tracking-tight">{card.label}</p>
            <p className="text-3xl font-semibold mt-4">{card.value}</p>
            <div className="mt-5 flex items-center gap-2 text-sm">
              <span className="flex h-5 w-5 items-center justify-center rounded-full border border-primary-green/30 bg-primary-green">
                <ArrowUpRight className="h-3.5 w-3.5 text-black" />
              </span>
              <span className="text-primary-green font-medium">{card.delta}</span>
              <span className="text-primaryGrey-200">From last month</span>
            </div>
          </div>
        ))}
      </section>

      <section className="rounded-2xl bg-white shadow-sm border border-primaryGrey-50 p-8 min-h-[420px] flex items-center justify-center">
        <p className="text-primaryGrey-400 text-sm">
          Filters, tabs, and SME table will appear here.
        </p>
      </section>
    </div>
  );
}