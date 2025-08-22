export default function LogLine({ icon = "✳", message = "", tone = "info" }) {
  const color =
    tone === "ok"
      ? "text-emerald-400"
      : tone === "warn"
      ? "text-yellow-300"
      : tone === "err"
      ? "text-rose-400"
      : "text-sky-300";
  const bullet =
    tone === "ok" ? "✅" : tone === "err" ? "❌" : tone === "warn" ? "⚠️" : "▹";
  return (
    <div className="flex items-start gap-2">
      <span className="select-none">{bullet}</span>
      <span className={color}>{message}</span>
    </div>
  );
}