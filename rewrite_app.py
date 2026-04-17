import re

with open('components/cricket-app.tsx', 'r') as f:
    code = f.read()

# Replace backgrounds and card classes globally
code = code.replace('bg-slate-950', 'bg-black')
code = code.replace('bg-slate-900 border border-white/5 rounded-2xl shadow-xl', 'border-b border-white/10')
code = code.replace('bg-slate-900 border border-white/5 p-5 rounded-3xl shadow-sm border border-white/5', 'py-4 border-b border-white/10')
code = code.replace('bg-slate-900 border border-white/5 rounded-2xl px-4 py-3 shadow-sm', 'py-4 border-b border-white/10')
code = code.replace('bg-slate-900 border border-white/10 text-white p-8 rounded-3xl', 'py-6')
code = code.replace('bg-slate-900 border border-white/5/10 p-4 rounded-2xl', 'py-4 border-b border-white/10')
code = code.replace('bg-slate-900 border border-white/5/5 p-4 rounded-2xl', 'py-4 border-b border-white/10')
code = code.replace('bg-slate-900 border border-white/5 p-6 rounded-2xl shadow-sm text-center', 'bg-black p-6 text-center border-b border-white/10')
code = code.replace('bg-slate-950 p-4 rounded-2xl', 'py-4 border-b border-white/10')
code = code.replace('shadow-2xl', '')
code = code.replace('shadow-sm', '')
code = code.replace('rounded-[2.5rem]', '')
code = code.replace('rounded-3xl', '')
code = code.replace('rounded-2xl', '')
code = code.replace('border border-white/5', 'border-white/10')

with open('components/cricket-app.tsx', 'w') as f:
    f.write(code)
