// src/components/pages/HomePage.jsx
// (Requires Icon and Button components)

const { useState } = React;

const HomePage = ({ user, setUser }) => {
    const [amount, setAmount] = useState("");
    const [num, setNum] = useState("");
    
    const handleBet = () => {
        if(!amount || !num) return;
        if(parseInt(amount) > user.coins) return alert("လက်ကျန်ငွေမလုံလောက်ပါ");
        const newCoins = user.coins - parseInt(amount);
        setUser({...user, coins: newCoins});
        setAmount("");
        setNum("");
        alert(`နံပါတ် ${num} ကို ${amount} ကျပ်ဖိုး ထိုးပြီးပါပြီ။`);
    };

    return (
        <div className="pb-24 pt-4 px-4 space-y-6 overflow-y-auto h-full">
            <div className="w-full bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-white shadow-xl shadow-blue-900/40 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10"><Icon name="wallet" size={120} /></div>
                <div className="relative z-10">
                    <p className="text-blue-200 text-sm font-medium mb-1">လက်ကျန်ငွေ (Balance)</p>
                    <h2 className="text-4xl font-bold tracking-tight mb-6">{user.coins.toLocaleString()} <span className="text-lg font-normal opacity-70">Ks</span></h2>
                    <div className="flex gap-3">
                        <button className="bg-white/20 hover:bg-white/30 backdrop-blur-md px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all"><Icon name="plus-circle" size={16} /> ငွေဖြည့်မည်</button>
                        <button className="bg-white/20 hover:bg-white/30 backdrop-blur-md px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all"><Icon name="history" size={16} /> မှတ်တမ်း</button>
                    </div>
                </div>
            </div>
            <div className="glass-panel p-5 rounded-2xl">
                <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-3"><Icon name="zap" size={20} className="text-yellow-400" /><h3 className="font-bold text-lg">အမြန်ထိုးရန်</h3></div>
                <div className="flex gap-3 mb-4">
                    <div className="flex-1"><label className="text-xs text-slate-400 mb-1 block">နံပါတ်</label><input type="text" maxLength="3" placeholder="99" value={num} onChange={e => setNum(e.target.value)} className="w-full bg-slate-900/50 border border-slate-700 text-center text-2xl font-bold p-3 rounded-xl focus:border-blue-500 focus:outline-none text-white tracking-widest" /></div>
                    <div className="flex-1"><label className="text-xs text-slate-400 mb-1 block">ပမာဏ</label><input type="number" placeholder="1000" value={amount} onChange={e => setAmount(e.target.value)} className="w-full bg-slate-900/50 border border-slate-700 text-center text-xl font-bold p-3 rounded-xl focus:border-blue-500 focus:outline-none text-white" /></div>
                </div>
                <Button onClick={handleBet} className="w-full py-4 text-lg animate-pulse-glow">ထိုးမည်</Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
                <div className="glass-panel p-4 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-slate-800/50 transition-colors cursor-pointer"><div className="bg-green-500/20 p-3 rounded-full text-green-400"><Icon name="phone" size={24} /></div><span className="text-sm font-bold">Viber</span></div>
                <div className="glass-panel p-4 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-slate-800/50 transition-colors cursor-pointer"><div className="bg-blue-500/20 p-3 rounded-full text-blue-400"><Icon name="facebook" size={24} /></div><span className="text-sm font-bold">Facebook</span></div>
            </div>
        </div>
    );
};
