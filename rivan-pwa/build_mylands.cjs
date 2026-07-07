const fs = require('fs');

let raw = fs.readFileSync('src/pages/MyLands_raw.jsx', 'utf-8');

// The main issue with MyLands_raw.jsx was missing JSX fragment wrappers around
// the elements that were conditionally rendered (like inside `{isLands && (`).

// 1. Convert any <sc-if> and <sc-for> correctly, or if they are already converted,
// ensure the brackets are balanced.
// Wait, MyLands_raw.jsx ALREADY HAS {isLands && (, {timeline.map, etc. from earlier scripts!
// Let's just fix the specific style formatting bugs that broke Esbuild!

raw = raw.replace(/style=\{font\}-size:11\.5px;font-weight:700;color:v\.cdColor/g, "style={{fontSize: '11.5px', fontWeight: '700', color: v.cdColor}}");
raw = raw.replace(/style=\{width\}:24px;height:24px;border-radius:50%;background:tl\.dotBg;border:2px solid tl\.dotBorder;display:flex;align-items:center;justify-content:center;flex:none/g, "style={{width: '24px', height: '24px', borderRadius: '50%', background: tl.dotBg, border: `2px solid ${'${tl.dotBorder}'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none'}}");
raw = raw.replace(/style=\{width\}:2px;height:tl\.lineH;background:tl\.lineBg/g, "style={{width: '2px', height: tl.lineH, background: tl.lineBg}}");
raw = raw.replace(/style=\{flex\}:1;padding-bottom:tl\.pad/g, "style={{flex: '1', paddingBottom: tl.pad}}");
raw = raw.replace(/style=\{margin\}:0;font-size:13\.5px;font-weight:700;color:tl\.titleColor/g, "style={{margin: '0', fontSize: '13.5px', fontWeight: '700', color: tl.titleColor}}");
raw = raw.replace(/style=\{margin\}:3px 0 0;font-size:11\.5px;color:tl\.dateColor;font-weight:600/g, "style={{margin: '3px 0 0', fontSize: '11.5px', color: tl.dateColor, fontWeight: '600'}}");
raw = raw.replace(/style=\{width\}:48px;height:28px;border-radius:16px;border:none;cursor:pointer;position:relative;background:cz\.a1track/g, "style={{width: '48px', height: '28px', borderRadius: '16px', border: 'none', cursor: 'pointer', position: 'relative', background: cz.a1track}}");
raw = raw.replace(/style=\{position\}:absolute;top:3px;left:cz\.a1knob;width:22px;height:22px;border-radius:50%;background:#fff;box-shadow:0 2px 5px rgba\(0,0,0,\.2\)/g, "style={{position: 'absolute', top: '3px', left: cz.a1knob, width: '22px', height: '22px', borderRadius: '50%', background: '#fff', boxShadow: '0 2px 5px rgba(0,0,0,.2)'}}");
raw = raw.replace(/style=\{width\}:48px;height:28px;border-radius:16px;border:none;cursor:pointer;position:relative;background:cz\.a2track/g, "style={{width: '48px', height: '28px', borderRadius: '16px', border: 'none', cursor: 'pointer', position: 'relative', background: cz.a2track}}");
raw = raw.replace(/style=\{position\}:absolute;top:3px;left:cz\.a2knob;width:22px;height:22px;border-radius:50%;background:#fff;box-shadow:0 2px 5px rgba\(0,0,0,\.2\)/g, "style={{position: 'absolute', top: '3px', left: cz.a2knob, width: '22px', height: '22px', borderRadius: '50%', background: '#fff', boxShadow: '0 2px 5px rgba(0,0,0,.2)'}}");

// Now handle the missing fragments for adjacent elements inside expressions!
raw = raw.replace(/\{isLands && \(/g, "{isLands && (<>");
raw = raw.replace(/\{isOrders && \(/g, "{isOrders && (<>");
raw = raw.replace(/\{ordersEmpty && \(/g, "{ordersEmpty && (<>");
raw = raw.replace(/\{svc\.hasOptions && \(/g, "{svc.hasOptions && (<>");
raw = raw.replace(/\{svc\.hasAddons && \(/g, "{svc.hasAddons && (<>");

// And replace `)}` with `</>)}` safely! But wait, `))}` is from `map()`, so `))}` should NOT be `</>))}`.
// We can just use a regex that matches `[^\)]\)\}` which is a `)}` NOT preceded by `)`!
raw = raw.replace(/(?<!\))\)\}/g, "</>)}");

let finalStr = `import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function MyLands() {
  const navigate = useNavigate();

  const [stack, setStack] = useState(['lands']);
  const [filter, setFilter] = useState('All');
  const [view, setView] = useState('ready');
  const [sel, setSel] = useState(null);
  const [cat, setCat] = useState(null);
  const [svc, setSvc] = useState(null);
  const [cz, setCz] = useState({ qty: 1, opt: '', a1: true, a2: true });
  const [orderTab, setOrderTab] = useState('In Progress');
  const [orderId, setOrderId] = useState('CW-250703-001');

  const cur = stack[stack.length - 1];

  const go = (s) => {
    setStack((st) => [...st, s]);
  };
  const back = () => {
    setStack((st) => (st.length > 1 ? st.slice(0, -1) : st));
  };

  const goHome = () => navigate('/dashboard');
  const goVisitsPage = () => navigate('/visits');
  const goLandsPage = () => navigate('/my-lands');
  const goPayments = () => {};
  const goProfile = () => {};
  const goOrders = () => setStack(['orders']);
  const goLands = () => setStack(['lands']);
  const addToCart = () => setView('success');

  const totalLands = 3;
  const totalInvest = '₹8.4Cr';
  const total = '₹12,500';

  const catData = [
    { id: 'all', label: 'All Projects', active: true },
    { id: 'ongoing', label: 'Ongoing', active: false },
    { id: 'completed', label: 'Completed', active: false },
    { id: 'sold', label: 'Sold', active: false }
  ];

  const selData = [
    { code: 'SV-4402', codeShort: 'SV-4402', name: 'Sattva Green...', type: 'Villa Plot', size: '2400 sq.ft.', loc: 'North Bengaluru', amt: '₹1.8Cr', ret: '+14.2%', cdText: 'Payment Due', cdColor: '#e2822a', cdBg: 'rgba(226,130,42,.12)' },
    { code: 'SV-8091', codeShort: 'SV-8091', name: 'Prestige Gol...', type: 'Premium Plot', size: '4000 sq.ft.', loc: 'Devanahalli', amt: '₹3.2Cr', ret: '+18.5%', cdText: 'Reg. Pending', cdColor: '#1a5e2e', cdBg: 'rgba(26,94,46,.12)' }
  ];
  
  const timeline = [
    { title: 'Project Visit Scheduled', date: '12 Aug 2025, 10:30 AM', done: true, dotBg: '#1a5e2e', dotBorder: 'rgba(26,94,46,.2)', lineBg: '#1a5e2e', lineH: '28px', titleColor: '#16231a', dateColor: '#6d7d6f', pad: '16px' },
    { title: 'Initial Token Advance', date: 'Pending', done: false, dotBg: '#fff', dotBorder: '#c6d4c7', lineBg: '#eef3ec', lineH: '28px', titleColor: '#8a988c', dateColor: '#b4c4b6', pad: '16px' }
  ];

  const orderTabs = [
    { label: 'In Progress', style: { flex: '1', padding: '10px 0', borderRadius: '10px', border: 'none', background: '#fff', color: '#16231a', fontWeight: '700', fontSize: '12.5px', boxShadow: '0 2px 6px rgba(0,0,0,.04)', cursor: 'pointer' }, pick: () => setOrderTab('In Progress') },
    { label: 'Completed', style: { flex: '1', padding: '10px 0', borderRadius: '10px', border: 'none', background: 'transparent', color: '#6d7d6f', fontWeight: '600', fontSize: '12.5px', cursor: 'pointer' }, pick: () => setOrderTab('Completed') }
  ];

  const statusColor = '#90E0EF';
  const isLands = stack[stack.length - 1] === 'lands';
  const isOrders = stack[stack.length - 1] === 'orders';
  const ordersEmpty = true;
  
  const tog1 = () => setCz({...cz, a1: !cz.a1});
  const tog2 = () => setCz({...cz, a2: !cz.a2});

  return (
    <>
${raw.replace(/\$/g, '$$$$')}
    </>
  );
}
`;

fs.writeFileSync('src/pages/MyLands_tmp.jsx', finalStr);
