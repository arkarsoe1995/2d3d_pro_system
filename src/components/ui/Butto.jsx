// src/components/ui/Button.jsx

const Button = ({ children, onClick, variant = "primary", className = "", disabled=false }) => {
    const base = "px-4 py-3 rounded-xl font-bold transition-all active:scale-95 flex items-center justify-center gap-2";
    const styles = {
        primary: "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/30",
        secondary: "bg-slate-700 text-white hover:bg-slate-600",
        ghost: "bg-transparent text-slate-400 hover:text-white"
    };
    return (
        <button disabled={disabled} onClick={onClick} className={`${base} ${styles[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
            {children}
        </button>
    );
};
