// src/components/pages/ThreeDPage.jsx
// (Requires Icon component)

const { useState, useEffect, useRef, useCallback, useMemo } = React;

const ThreeDPage = () => {
    const API_URL = 'https://sheetdb.io/api/v1/x9azbgwzmy3a7';
    const VIBRANT_COLORS = ['#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e', '#10b981', '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef'];

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedId, setSelectedId] = useState(null);
    const [styles, setStyles] = useState({});
    const [comments, setComments] = useState({});
    const [search, setSearch] = useState("");
    const [lineCoords, setLineCoords] = useState([]);
    const [zoom, setZoom] = useState(1);
    
    const tableRef = useRef(null);
    const initialDist = useRef(null);

    useEffect(() => {
        const load = async () => {
            const cached = localStorage.getItem('la_data');
            if (cached) setData(JSON.parse(cached));
            setStyles(JSON.parse(localStorage.getItem('la_styles') || '{}'));
            setComments(JSON.parse(localStorage.getItem('la_comments') || '{}'));
            try {
                const res = await fetch(API_URL);
                const json = await res.json();
                if (Array.isArray(json)) {
                    setData(json);
                    localStorage.setItem('la_data', JSON.stringify(json));
                }
            } catch (e) { console.error(e); } finally { setLoading(false); }
        };
        load();
    }, []);

    const getContrastYIQ = (hexcolor) => {
        if (!hexcolor) return 'inherit';
        hexcolor = hexcolor.replace("#", "");
        const r = parseInt(hexcolor.substr(0, 2), 16);
        const g = parseInt(hexcolor.substr(2, 2), 16);
        const b = parseInt(hexcolor.substr(4, 2), 16);
        const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
        return (yiq >= 128) ? '#000000' : '#ffffff';
    };

    const organized = useMemo(() => {
        const map = {};
        data.forEach(item => {
            const d = new Date(item.date);
            const y = d.getFullYear();
            if (!map[y]) map[y] = Array(24).fill(null);
            const idx = d.getMonth() * 2 + (d.getDate() >= 16 ? 1 : 0);
            map[y][idx] = String(item.number || "");
        });
        let years = Object.keys(map).sort((a, b) => Number(a) - Number(b)).map(Number);
        if (years.length === 0) years = [new Date().getFullYear()];
        const next = years[years.length - 1] + 1;
        if (!map[next]) map[next] = Array(24).fill(null);
        years.push(next);
        return { map, years };
    }, [data]);

    const activeNum = useMemo(() => {
        if (search) return search;
        if (!selectedId) return null;
        const [y, r] = selectedId.split('-');
        return organized.map[y]?.[r];
    }, [selectedId, organized, search]);

    const pathSummary = useMemo(() => {
        if (!activeNum) return null;
        const matches = [];
        organized.years.forEach(y => {
            organized.map[y]?.forEach((val, r) => {
                if (val === activeNum) matches.push({ year: y, round: r + 1 });
            });
        });
        return matches;
    }, [activeNum, organized]);

    const handleTouchMove = (e) => {
        if (e.touches.length === 2) {
            const dist = Math.hypot(e.touches[0].pageX - e.touches[1].pageX, e.touches[0].pageY - e.touches[1].pageY);
            if (initialDist.current == null) {
                initialDist.current = dist;
            } else {
                const factor = dist / initialDist.current;
                setZoom(prev => Math.min(Math.max(0.5, prev * factor), 3));
                initialDist.current = dist;
            }
        }
    };
    const handleTouchEnd = () => { initialDist.current = null; };

    const updateLines = () => {
        if (!activeNum || !tableRef.current) { setLineCoords([]); return; }
        const coords = [];
        organized.years.forEach(y => {
            organized.map[y]?.forEach((val, r) => {
                if (val === activeNum) {
                    const cell = tableRef.current.querySelector(`[data-id="${y}-${r}"]`);
                    if (cell) {
                        coords.push({
                            x: cell.offsetLeft + cell.offsetWidth / 2,
                            y: cell.offsetTop + cell.offsetHeight / 2
                        });
                    }
                }
            });
        });
        setLineCoords(coords);
    };

    useEffect(() => {
        updateLines();
        window.addEventListener('resize', updateLines);
        return () => window.removeEventListener('resize', updateLines);
    }, [activeNum, organized, zoom]);

    useEffect(() => { if(window.lucide) window.lucide.createIcons(); }, [activeNum, loading]);

    const saveQuickEdit = (id, num, comm, color) => {
        if (!id) return;
        const [y, r] = id.split('-');
        const newComms = { ...comments, [id]: comm };
        const newStyles = { ...styles, [id]: color };
        setComments(newComms);
        setStyles(newStyles);
        localStorage.setItem('la_comments', JSON.stringify(newComms));
        localStorage.setItem('la_styles', JSON.stringify(newStyles));
        
        const newData = [...data];
        const dateStr = `${y}-${String(Math.floor(r/2)+1).padStart(2,'0')}-${Number(r)%2===0?'01':'16'}`;
        const idx = newData.findIndex(d => d.date === dateStr);
        if (idx > -1) newData[idx].number = num;
        else newData.push({ date: dateStr, number: num });
        setData(newData);
        localStorage.setItem('la_data', JSON.stringify(newData));
    };

    if (loading && data.length === 0) return <div className="h-full flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div></div>;

    return (
        <div className="flex flex-col h-full bg-slate-900" onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
            <div className="px-4 py-2 flex justify-between items-center border-b border-slate-700 bg-slate-900 flex-shrink-0">
                <div className="flex items-center gap-2">
                     <div className="flex items-center gap-1 px-2 py-1 rounded-lg border border-slate-700 bg-slate-800">
                        <Icon name="search" className="w-3 h-3 text-blue-500" />
                        <input type="number" placeholder="Find" className="bg-transparent outline-none w-12 font-bold text-sm text-white" value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setZoom(prev => Math.max(0.5, prev - 0.1))} className="p-1 rounded bg-slate-800 text-white"><Icon name="zoom-out" className="w-4 h-4" /></button>
                    <button onClick={() => setZoom(prev => Math.min(3, prev + 0.1))} className="p-1 rounded bg-slate-800 text-white"><Icon name="zoom-in" className="w-4 h-4" /></button>
                </div>
            </div>

            <div className="excel-ribbon no-scrollbar">
                <div className="ribbon-group">
                    <input className="ribbon-input" placeholder="--" value={selectedId ? (organized.map[selectedId.split('-')[0]]?.[selectedId.split('-')[1]] || "") : ""} onChange={(e) => saveQuickEdit(selectedId, e.target.value, comments[selectedId] || "", styles[selectedId] || "")} disabled={!selectedId} />
                </div>
                <div className="ribbon-group">
                    <input className="ribbon-comm" placeholder="Note..." value={selectedId ? (comments[selectedId] || "") : ""} onChange={(e) => saveQuickEdit(selectedId, organized.map[selectedId.split('-')[0]]?.[selectedId.split('-')[1]] || "", e.target.value, styles[selectedId] || "")} disabled={!selectedId} />
                </div>
                <div className="ribbon-group !border-none">
                    <div className="color-mini-grid">
                        {VIBRANT_COLORS.map(c => (
                            <button key={c} onClick={() => saveQuickEdit(selectedId, organized.map[selectedId.split('-')[0]]?.[selectedId.split('-')[1]] || "", comments[selectedId] || "", c)} className="mini-color-btn shadow-sm" style={{ background: c }} disabled={!selectedId}></button>
                        ))}
                        <button onClick={() => saveQuickEdit(selectedId, organized.map[selectedId.split('-')[0]]?.[selectedId.split('-')[1]] || "", comments[selectedId] || "", "")} className="mini-color-btn flex items-center justify-center bg-slate-700" disabled={!selectedId}><Icon name="eraser" className="w-2.5 h-2.5 text-slate-400" /></button>
                    </div>
                </div>
            </div>

            {activeNum && pathSummary && pathSummary.length > 0 && (
                <div className="px-3 py-1 flex items-center gap-2 overflow-x-auto no-scrollbar flex-shrink-0 bg-slate-900 border-b border-slate-800">
                    <div className="text-lg font-black text-amber-500 px-2 bg-amber-900/30 rounded">{activeNum}</div>
                    <div className="flex gap-1">
                        {pathSummary.map((m, idx) => (
                            <div key={idx} className="whitespace-nowrap px-1.5 py-0.5 rounded text-[8px] font-black border bg-slate-800 border-slate-700 text-slate-300">{m.year}/{m.round}</div>
                        ))}
                    </div>
                </div>
            )}

            <div className="table-viewport no-scrollbar">
                <div className="zoom-wrapper" style={{ transform: `scale(${zoom})` }}>
                    <svg id="path-svg" width={tableRef.current?.scrollWidth || 0} height={tableRef.current?.scrollHeight || 0}>
                        {lineCoords.length > 1 && (<path className="connection-line" d={`M ${lineCoords[0].x} ${lineCoords[0].y} ${lineCoords.slice(1).map(c => `L ${c.x} ${c.y}`).join(' ')}`} />)}
                        {lineCoords.map((c, i) => <circle key={i} cx={c.x} cy={c.y} r="3" fill="#f59e0b" />)}
                    </svg>
                    
                    <table ref={tableRef} className="cal-table">
                        <thead>
                            <tr>
                                <th className="sticky-corner sticky-col z-[60] text-blue-500">No</th>
                                {organized.years.map(y => <th key={y} className="text-blue-500">{y}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {Array.from({ length: 24 }).map((_, rIdx) => (
                                <tr key={rIdx}>
                                    <td className="sticky-col">
                                        <div className="flex flex-col leading-none">
                                            <span className="text-xs font-black text-slate-300">{rIdx + 1}</span>
                                            <span className="text-[6px] opacity-50 text-slate-400">{rIdx % 2 === 0 ? '၁' : '၁၆'}</span>
                                        </div>
                                    </td>
                                    {organized.years.map(y => {
                                        const id = `${y}-${rIdx}`;
                                        const num = organized.map[y]?.[rIdx];
                                        const isFocused = selectedId === id;
                                        const isHighlighted = (activeNum && num === activeNum && num !== "");
                                        const cellColor = styles[id] || "#1e293b";
                                        const textColor = isFocused || isHighlighted ? '#ffffff' : getContrastYIQ(cellColor);

                                        return (
                                            <td key={y} data-id={id} onClick={() => setSelectedId(id)}>
                                                <div className={`cell-box ${isFocused ? 'selected' : ''}`} style={{ backgroundColor: isFocused || isHighlighted ? '#2563eb' : cellColor, color: textColor }}>
                                                    <span className="font-bold tracking-tighter">{num || <span className="opacity-0">.</span>}</span>
                                                    {comments[id] && <div className="comment-dot"></div>}
                                                </div>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="h-24 flex-shrink-0"></div> 
        </div>
    );
};
