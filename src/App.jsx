// src/App.jsx
// (Requires all other components: Icon, NavItem, AuthPage, HomePage, LivePage, ThreeDPage, RankPage)

const { useState, useEffect } = React;

const App = () => {
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState("home");
    const [loading, setLoading] = useState(true);

    useEffect(() => { setTimeout(() => setLoading(false), 2000); }, []);

    if (loading) return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-950 text-white">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
            <h1 className="text-2xl font-bold tracking-widest">ARKARSOE SYS</h1>
            <p className="text-xs text-slate-500 mt-2">v2.2.0 Pro Edition</p>
        </div>
    );

    if (!user) return <AuthPage onLogin={setUser} />;

    const renderPage = () => {
        switch(activeTab) {
            case "home": return <HomePage user={user} setUser={setUser} />;
            case "live": return <LivePage />;
            case "3d": return <ThreeDPage />;
            case "rank": return <RankPage user={user} />;
            case "profile": return <div className="h-full flex items-center justify-center text-slate-500">Coming Soon...</div>;
            default: return <HomePage />;
        }
    };

    return (
        <div className="bg-slate-900 h-screen max-w-md mx-auto relative shadow-2xl flex flex-col overflow-hidden">
            {/* Top Bar */}
            <div className="flex-shrink-0 z-50 glass-panel border-b border-white/5 px-4 py-3 flex justify-between items-center bg-slate-950/80 backdrop-blur-xl">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-cyan-500/10 rounded-xl flex items-center justify-center">
                        <Icon name="activity" size={22} className="text-cyan-500" />
                    </div>
                    <div>
                        <h2 className="text-sm font-black tracking-tight uppercase leading-none">ARKARSOE.SYS</h2>
                        <span className="text-[10px] font-bold text-slate-500">PRO EDITION</span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                     <div className="px-3 py-1 bg-slate-800 rounded-full text-xs font-bold text-yellow-400 border border-yellow-500/20">{user.coins.toLocaleString()} Ks</div>
                     <Icon name="bell" size={20} className="text-slate-400" />
                </div>
            </div>

            {/* Content Area */}
            <main className="flex-1 relative overflow-hidden bg-[#020617]">
                {renderPage()}
            </main>

            {/* Bottom Navigation */}
            <div className="fixed bottom-0 max-w-md w-full glass-panel border-t border-white/5 pb-safe z-50 bg-slate-950/90 backdrop-blur-xl">
                <div className="flex justify-around items-center h-16 px-2">
                    <NavItem id="home" icon="home" label="ပင်မ" activeTab={activeTab} setActiveTab={setActiveTab} />
                    <NavItem id="live" icon="radio" label="Live 2D" activeTab={activeTab} setActiveTab={setActiveTab} />
                    <NavItem id="3d" icon="calendar" label="3D Cal" activeTab={activeTab} setActiveTab={setActiveTab} />
                    <NavItem id="rank" icon="trophy" label="Rank" activeTab={activeTab} setActiveTab={setActiveTab} />
                    <NavItem id="profile" icon="user" label="အကောင့်" activeTab={activeTab} setActiveTab={setActiveTab} />
                </div>
            </div>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
