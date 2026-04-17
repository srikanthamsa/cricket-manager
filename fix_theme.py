with open('components/cricket-app.tsx', 'r') as f:
    code = f.read()

# Theme replacements
code = code.replace("bg-[#F2F1EB]", "bg-slate-950")
code = code.replace("bg-[#1A1A1A]", "bg-slate-900 border border-white/10")
code = code.replace("bg-white", "bg-slate-900 border border-white/5")
code = code.replace("text-gray-900", "text-white")
code = code.replace("text-gray-800", "text-slate-100")
code = code.replace("text-gray-700", "text-slate-200")
code = code.replace("text-gray-600", "text-slate-300")
code = code.replace("text-gray-500", "text-slate-400")
code = code.replace("text-gray-400", "text-slate-400")
code = code.replace("text-gray-300", "text-slate-500")
code = code.replace("text-gray-200", "text-slate-600")
code = code.replace("border-gray-100", "border-white/5")
code = code.replace("border-gray-50", "border-white/5")
code = code.replace("border-gray-200", "border-white/10")
code = code.replace("border-gray-300", "border-white/20")
code = code.replace("bg-gray-50", "bg-slate-800/50")
code = code.replace("bg-gray-100", "bg-slate-800")
code = code.replace("bg-gray-300", "bg-slate-700")

# Primary color replace
code = code.replace("bg-[#7B8E45]", "bg-indigo-600")
code = code.replace("text-[#7B8E45]", "text-indigo-400")
code = code.replace("ring-[#7B8E45]/50", "ring-indigo-500/50")

# Typography de-slop
code = code.replace("font-black", "font-semibold")
code = code.replace("uppercase tracking-widest", "tracking-wide")
code = code.replace("uppercase tracking-tight", "tracking-tight")
code = code.replace("tracking-tighter", "tracking-tight")
code = code.replace("uppercase tracking-[0.2em]", "font-medium")
code = code.replace("uppercase text-[#7B8E45]", "text-indigo-400")
code = code.replace("uppercase text-white", "text-white")
code = code.replace("uppercase text-gray-500", "text-slate-400")
code = code.replace("uppercase text-gray-800", "text-slate-100")
code = code.replace("uppercase text-gray-900", "text-white")
code = code.replace("uppercase text-gray-300", "text-slate-500")

code = code.replace("rounded-[2rem]", "rounded-2xl")
code = code.replace("rounded-[3rem]", "rounded-3xl")
code = code.replace("rounded-[2.5rem]", "rounded-3xl")

with open('components/cricket-app.tsx', 'w') as f:
    f.write(code)
