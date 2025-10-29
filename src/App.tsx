import { useEffect, useMemo, useState } from "react"
import * as XLSX from "xlsx"
import ChartPanel from "./components/ChartPanel"
import DataTable from "./components/DataTable"

type Row = { name: string; cause: string; description: string }
type SheetData = { sheet: string; rows: Row[] }

function normalizeKey(k: string) { return k.replace(/\s+/g, "").toLowerCase() }

function extractRow(obj: any): Row | null {
  const keys = Object.keys(obj || {})
  if (!keys.length) return null
  const map: Record<string, string> = {}
  for (const k of keys) {
    if (!map.name && /(اسم|بیماری|عنوان)/.test(k)) map.name = k
    if (!map.cause && /(نحوه|عامل|ایجاد|علت)/.test(k)) map.cause = k
    if (!map.description && /(توضیح|شرح|توضیحات)/.test(k)) map.description = k
  }
  const name = String(obj[map.name || keys[0]] || "").trim()
  const cause = String(obj[map.cause || keys[1] || keys[0]] || "").trim()
  const description = String(obj[map.description || keys[2] || keys[0]] || "").trim()
  if (!name && !cause && !description) return null
  return { name, cause, description }
}

function parseWorkbook(buf: ArrayBuffer): SheetData[] {
  const wb = XLSX.read(buf, { type: "array" })
  const out: SheetData[] = []
  for (const sheet of wb.SheetNames) {
    const ws = wb.Sheets[sheet]
    const arr = XLSX.utils.sheet_to_json(ws)
    const rows: Row[] = []
    for (const r of arr) {
      const row = extractRow(r)
      if (row) rows.push(row)
    }
    if (rows.length) out.push({ sheet, rows })
  }
  return out
}

export default function App() {
  const [data, setData] = useState<SheetData[]>([])
  const [active, setActive] = useState(0)
  const [q, setQ] = useState("")

  useEffect(() => {
    fetch("/sample.xlsx").then(r => r.arrayBuffer()).then(b => setData(parseWorkbook(b)))
  }, [])

  const activeSheet = data[active]
  const filteredRows = useMemo(() => {
    if (!activeSheet) return []
    const t = q.trim()
    if (!t) return activeSheet.rows
    return activeSheet.rows.filter(r => r.name.includes(t) || r.cause.includes(t) || r.description.includes(t))
  }, [activeSheet, q])

  const onPick = async (file: File) => {
    const buf = await file.arrayBuffer()
    const parsed = parseWorkbook(buf)
    setData(parsed); setActive(0); setQ("")
  }

  return (
    <div className="min-h-full flex flex-col">
      <header className="w-full border-b border-slate-800">
        <div className="mx-auto max-w-7xl px-4 py-4 flex items-center gap-3 justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-sky-500 flex items-center justify-center font-bold">ب</div>
            <div className="text-lg md:text-xl font-semibold">سامانه تحلیل بیماری‌ها</div>
          </div>
          <label className="inline-flex items-center px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 cursor-pointer text-sm">
            <input type="file" accept=".xlsx,.xls" className="hidden" onChange={e => e.target.files && onPick(e.target.files[0])} />
            بارگذاری اکسل
          </label>
        </div>
      </header>

      <main className="mx-auto max-w-7xl w-full px-4 py-6 flex flex-col gap-6">
        {data.length === 0 && <div className="text-center py-20">برای شروع یک فایل اکسل بارگذاری کنید</div>}

        {data.length > 0 && (
          <>
            <div className="flex items-center gap-2 overflow-auto py-1">
              {data.map((s, i) => (
                <button key={s.sheet} onClick={() => setActive(i)} className={"px-3 py-2 whitespace-nowrap rounded-lg text-sm " + (i === active ? "bg-sky-600" : "bg-slate-800 hover:bg-slate-700")}>
                  {s.sheet}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-4">
              <input value={q} onChange={e => setQ(e.target.value)} className="w-full bg-slate-800 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 ring-sky-600" placeholder="جستجو..." />
              <DataTable rows={filteredRows} />
            </div>

            <ChartPanel rows={filteredRows} />
          </>
        )}
      </main>
      <footer className="py-6 text-center text-xs text-slate-400">PWA • React • Tailwind • ApexCharts</footer>
    </div>
  )
}
