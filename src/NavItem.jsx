// src/NavItem.jsx
// (Requires Icon component to be loaded before this one)

const NavItem = ({ id, icon, label, activeTab, setActiveTab }) => (
    <button onClick={() => setActiveTab(id)} className={`flex flex-col items-center justify-center w-full py-2 transition-all duration-300 ${activeTab === id ? 'tab-active' : 'text-slate-500 hover:text-slate-300'}`}>
        <Icon name={icon} size={24} className={activeTab === id ? "fill-cyan-500/20" : ""} />
        <span className="text-[10px] font-bold mt-1">{label}</span>
    </button>
);
