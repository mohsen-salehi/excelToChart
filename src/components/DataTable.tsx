type Row = { name: string; cause: string; description: string }

export default function DataTable({ rows }: { rows: Row[] }) {
  return (
    <div className="bg-slate-800 rounded-xl overflow-hidden w-full">
      <div className="overflow-auto">
        <table className="min-w-full text-sm">
          <colgroup>
            <col style={{width:"18%"}} />
            <col style={{width:"22%"}} />
            <col />
          </colgroup>
          <thead className="bg-slate-700">
            <tr>
              <th className="px-3 py-2 text-right whitespace-nowrap">اسم بیماری</th>
              <th className="px-3 py-2 text-right whitespace-nowrap">نحوه ایجاد بیماری</th>
              <th className="px-3 py-2 text-right whitespace-nowrap">توضیحات</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="odd:bg-slate-900/20">
                <td className="px-3 py-2 align-top whitespace-nowrap">{r.name || "-"}</td>
                <td className="px-3 py-2 align-top whitespace-nowrap">{r.cause || "-"}</td>
                <td className="px-3 py-2 align-top">{r.description || "-"}</td>
              </tr>
            ))}
            {!rows.length && (
              <tr>
                <td className="px-3 py-4" colSpan={3}>داده‌ای یافت نشد</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="px-3 py-2 text-xs text-slate-400">تعداد ردیف‌ها: {rows.length}</div>
    </div>
  )
}
