import { useMemo, useState } from "react"
import ReactApexChart from "react-apexcharts"

type Row = { name: string; cause: string; description: string }

export default function ChartPanel({ rows }: { rows: Row[] }) {
  const [type, setType] = useState<"bar" | "pie">("bar")
  const counts = useMemo(() => {
    const m = new Map<string, number>()
    for (const r of rows) {
      const k = (r.cause || "نامشخص").trim()
      m.set(k, (m.get(k) || 0) + 1)
    }
    const entries = [...m.entries()].sort((a, b) => b[1] - a[1])
    return { labels: entries.map(e => e[0]), values: entries.map(e => e[1]) }
  }, [rows])

  const barOptions = useMemo(() => ({
    chart: { type: "bar", toolbar: { show: false } },
    xaxis: { categories: counts.labels },
    plotOptions: { bar: { horizontal: true } },
    dataLabels: { enabled: true },
    theme: { mode: "dark" },
    tooltip: { y: { formatter: (v: number) => v.toString() } }
  }), [counts])

  const pieOptions = useMemo(() => ({
    chart: { type: "pie", toolbar: { show: false } },
    labels: counts.labels,
    theme: { mode: "dark" },
    dataLabels: { enabled: true }
  }), [counts])

  return (
    <div className="bg-slate-800 rounded-xl p-4 w-full">
      <div className="flex items-center justify-between mb-3">
        <div className="font-semibold text-sm">تحلیل بر اساس نحوه ایجاد بیماری</div>
        <div className="flex gap-2">
          <button onClick={() => setType("bar")} className={"px-3 py-1 rounded-lg text-xs " + (type === "bar" ? "bg-sky-600" : "bg-slate-700")}>نمودار میله‌ای</button>
          <button onClick={() => setType("pie")} className={"px-3 py-1 rounded-lg text-xs " + (type === "pie" ? "bg-sky-600" : "bg-slate-700")}>نمودار دایره‌ای</button>
        </div>
      </div>
      {type === "bar" && <ReactApexChart options={barOptions as any} series={[{ name: "تعداد", data: counts.values }]} type="bar" height={420} />}
      {type === "pie" && <ReactApexChart options={pieOptions as any} series={counts.values} type="pie" height={420} />}
    </div>
  )
}
