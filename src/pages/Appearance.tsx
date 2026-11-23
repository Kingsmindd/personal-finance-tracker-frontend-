import { useEffect, useState } from "react";
import { Check, Monitor, Moon, Palette, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import SettingsLayout, { SettingsNotice } from "../components/SettingsLayout";

export default function Appearance() {
  const { theme, setTheme } = useTheme();
  const [notice, setNotice] = useState("");
  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(""), 5000);
    return () => window.clearTimeout(timer);
  }, [notice]);
  const options = [
    { value: "light" as const, label: "Light", description: "A clean, bright workspace.", icon: Sun },
    { value: "dark" as const, label: "Dark", description: "A softer view for darker spaces.", icon: Moon },
    { value: "system" as const, label: "System", description: "Follow your device’s preference.", icon: Monitor },
  ];
  return <SettingsLayout title="A view that suits you." description="Choose your theme. Your preference is saved on this browser." icon={Palette}>
    <SettingsNotice message={notice} />
    <section aria-label="Theme preference" className="grid gap-4 sm:grid-cols-3">{options.map(option => {
      const selected = theme === option.value;
      return <button key={option.value} type="button" aria-pressed={selected} onClick={() => { if (selected) return; setTheme(option.value); setNotice(option.label + " theme selected."); }} className={"relative cursor-pointer rounded-2xl border p-4 text-left shadow-sm transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 " + (selected ? "border-blue-500 bg-blue-50 dark:border-blue-500 dark:bg-blue-950/25" : "border-gray-200 bg-white hover:border-blue-300 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-700")}>
        <div aria-hidden="true" className={"mb-5 flex h-28 overflow-hidden rounded-xl border " + (option.value === "dark" ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-white")}><div className={"w-1/4 border-r p-2 " + (option.value === "dark" ? "border-gray-700 bg-gray-800" : "border-gray-100 bg-gray-50")}><div className="h-2 w-5 rounded bg-blue-500" /><div className="mt-3 h-1 rounded bg-gray-300" /><div className="mt-2 h-1 rounded bg-gray-300" /></div><div className={"flex-1 space-y-2 p-3 " + (option.value === "system" ? "bg-gradient-to-br from-white to-gray-800" : "")}><div className="h-2 w-12 rounded bg-blue-400" /><div className="grid grid-cols-2 gap-2"><div className="h-7 rounded bg-blue-500/20" /><div className="h-7 rounded bg-emerald-500/20" /></div><div className="h-1.5 w-3/4 rounded bg-gray-300/50" /></div></div>
        <span className="flex items-center justify-between gap-2"><span className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white"><option.icon size={17} aria-hidden="true" />{option.label}</span>{selected && <Check size={17} className="text-blue-600 dark:text-blue-400" aria-hidden="true" />}</span><span className="mt-2 block text-xs leading-5 text-gray-500 dark:text-gray-400">{option.description}</span>
      </button>;
    })}</section>
    <p className="text-xs leading-6 text-gray-500 dark:text-gray-400">Theme changes apply immediately. System mode follows changes to your device’s light or dark setting.</p>
  </SettingsLayout>;
}
