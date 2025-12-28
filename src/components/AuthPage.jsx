// src/components/AuthPage.jsx
// (Requires Icon and Button components)

const { useState } = React;

const AuthPage = ({ onLogin }) => {
    const [phone, setPhone] = useState("");
    const [name, setName] = useState("");

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-slate-900">
            <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2 animate-blob"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-x-1/2 translate-y-1/2 animate-blob animation-delay-2000"></div>

            <div className="glass-panel p-8 rounded-3xl w-full max-w-sm border border-white/10 relative z-10">
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl mx-auto flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.15)] mb-4 animate-pulse">
                        <span className="text-3xl font-black text-cyan-400">2D</span>
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-1">အကောင့်ဝင်ရန်</h1>
                    <p className="text-slate-400 text-sm">Pro System သို့ ကြိုဆိုပါသည်</p>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="text-xs text-slate-400 uppercase font-bold ml-1 mb-1 block">အမည်</label>
                        <input value={name} onChange={e => setName(e.target.value)} className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500 transition-colors" placeholder="Mg Mg" />
                    </div>
                    <div>
                        <label className="text-xs text-slate-400 uppercase font-bold ml-1 mb-1 block">ဖုန်းနံပါတ်</label>
                        <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500 transition-colors" placeholder="09xxxxxxxxx" />
                    </div>
                    <Button onClick={() => name && phone ? onLogin({name, phone, coins: 5000}) : null} className="w-full mt-4 !bg-gradient-to-r !from-cyan-600 !to-blue-600">စတင်အသုံးပြုမယ်</Button>
                </div>
            </div>
        </div>
    );
};
