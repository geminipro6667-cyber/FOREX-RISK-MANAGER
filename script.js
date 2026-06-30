(function () {
  'use strict';

  const INSTRUMENTS = {
    'EUR/USD': { contract: 100000, pipSize: 0.0001, pipDecimals: 4, pipValUSD: 10, quoteCur: 'USD', type: 'forex', avgDailyPips: 80, spread: '0.2–1.0', notes: 'সবচেয়ে লিকুইড পেয়ার। Pip = 0.0001. $10/pip per std lot.' },
    'GBP/USD': { contract: 100000, pipSize: 0.0001, pipDecimals: 4, pipValUSD: 10, quoteCur: 'USD', type: 'forex', avgDailyPips: 100, spread: '0.5–1.5', notes: 'EUR/USD এর চেয়ে বেশি volatile। $10/pip per std lot.' },
    'USD/JPY': { contract: 100000, pipSize: 0.01, pipDecimals: 2, pipValUSD: null, quoteCur: 'JPY', type: 'forex', avgDailyPips: 70, spread: '0.3–1.0', notes: 'JPY পেয়ার — pip = 0.01। Pip value প্রাইসের সাথে পরিবর্তিত হয়।' },
    'USD/CHF': { contract: 100000, pipSize: 0.0001, pipDecimals: 4, pipValUSD: null, quoteCur: 'CHF', type: 'forex', avgDailyPips: 65, spread: '0.5–1.5', notes: 'CHF পেয়ার — pip value USDCHF রেটের সাথে পরিবর্তিত হয়।' },
    'USD/CAD': { contract: 100000, pipSize: 0.0001, pipDecimals: 4, pipValUSD: null, quoteCur: 'CAD', type: 'forex', avgDailyPips: 60, spread: '0.5–1.5', notes: 'CAD পেয়ার — pip value USDCAD রেটের সাথে পরিবর্তিত হয়।' },
    'AUD/USD': { contract: 100000, pipSize: 0.0001, pipDecimals: 4, pipValUSD: 10, quoteCur: 'USD', type: 'forex', avgDailyPips: 60, spread: '0.3–1.0', notes: 'AUD/USD — $10/pip per std lot.' },
    'NZD/USD': { contract: 100000, pipSize: 0.0001, pipDecimals: 4, pipValUSD: 10, quoteCur: 'USD', type: 'forex', avgDailyPips: 55, spread: '0.5–1.5', notes: 'NZD/USD — $10/pip per std lot.' },
    'EUR/GBP': { contract: 100000, pipSize: 0.0001, pipDecimals: 4, pipValUSD: null, quoteCur: 'GBP', type: 'forex', avgDailyPips: 40, spread: '1.0–2.0', notes: 'কম volatility cross পেয়ার।' },
    'EUR/JPY': { contract: 100000, pipSize: 0.01, pipDecimals: 2, pipValUSD: null, quoteCur: 'JPY', type: 'forex', avgDailyPips: 90, spread: '1.0–2.0', notes: 'হাই-volatility JPY cross।' },
    'GBP/JPY': { contract: 100000, pipSize: 0.01, pipDecimals: 2, pipValUSD: null, quoteCur: 'JPY', type: 'forex', avgDailyPips: 130, spread: '1.5–3.0', notes: 'খুব হাই volatility। বিগিনারদের জন্য নয়।' },
    'GBP/CHF': { contract: 100000, pipSize: 0.0001, pipDecimals: 4, pipValUSD: null, quoteCur: 'CHF', type: 'forex', avgDailyPips: 100, spread: '2.0–4.0', notes: 'প্রশস্ত স্প্রেড, হাই volatility।' },
    'AUD/JPY': { contract: 100000, pipSize: 0.01, pipDecimals: 2, pipValUSD: null, quoteCur: 'JPY', type: 'forex', avgDailyPips: 75, spread: '1.0–2.5', notes: 'Risk-on বারোমিটার পেয়ার।' },
    'CAD/JPY': { contract: 100000, pipSize: 0.01, pipDecimals: 2, pipValUSD: null, quoteCur: 'JPY', type: 'forex', avgDailyPips: 70, spread: '1.5–3.0', notes: 'কমোডিটি + JPY ক্যারি।' },
    'XAU/USD': { contract: 100, pipSize: 0.01, pipDecimals: 2, pipValUSD: 1, quoteCur: 'USD', type: 'metal', avgDailyPips: 1500, spread: '0.2–0.5 USD', notes: 'গোল্ড: 1 lot = 100 oz। $0.10 মুভে $1। হাই volatility।' },
    'XAG/USD': { contract: 5000, pipSize: 0.001, pipDecimals: 3, pipValUSD: 5, quoteCur: 'USD', type: 'metal', avgDailyPips: 300, spread: '2–4 cents', notes: 'সিলভার: 1 lot = 5000 oz। গোল্ডের চেয়ে বেশি volatile।' },
    'US30': { contract: 1, pipSize: 1, pipDecimals: 0, pipValUSD: 1, quoteCur: 'USD', type: 'index', avgDailyPips: 300, spread: '1–3 pts', notes: 'Dow Jones: $1 per point per lot। হাই daily range।' },
    'NAS100': { contract: 1, pipSize: 0.25, pipDecimals: 2, pipValUSD: 1, quoteCur: 'USD', type: 'index', avgDailyPips: 200, spread: '1–2 pts', notes: 'Nasdaq 100: সবচেয়ে volatile মেজর ইনডেক্স।' },
    'SPX500': { contract: 1, pipSize: 0.1, pipDecimals: 1, pipValUSD: 1, quoteCur: 'USD', type: 'index', avgDailyPips: 40, spread: '0.3–0.8 pts', notes: 'S&P 500: NAS100 এর চেয়ে কম volatility।' }
  };

  function getPipVal(sym, price) {
    const I = INSTRUMENTS[sym];
    if (!I) return 10;
    if (I.quoteCur === 'USD') return I.pipValUSD;
    if (['JPY', 'CHF', 'CAD', 'GBP'].includes(I.quoteCur)) {
      return (I.pipSize * I.contract) / price;
    }
    return I.pipValUSD || 10;
  }

  function fmt(n, d = 2) {
    return '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
  }

  function fmtN(n, d = 2) {
    return Number(n).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
  }

  // --- Tab switching ---
  const tabs = document.querySelectorAll('.tab');
  const panels = document.querySelectorAll('.panel');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      tabs.forEach((t) => t.classList.toggle('active', t === tab));
      panels.forEach((p) => p.classList.toggle('active', p.id === target));
      if (target === 'pip') calcPip();
    });
  });

  // --- Position Size ---
  function calcPos() {
    const bal = parseFloat(document.getElementById('ps_bal').value) || 0;
    const riskPct = parseFloat(document.getElementById('ps_risk').value) || 0;
    const sym = document.getElementById('ps_pair').value;
    const entry = parseFloat(document.getElementById('ps_entry').value);
    const sl = parseFloat(document.getElementById('ps_sl').value);
    const I = INSTRUMENTS[sym];
    const warn = document.getElementById('ps_warn');
    warn.classList.remove('show');

    if (!I || !entry || !sl || entry === sl) {
      warn.textContent = 'অনুগ্রহ করে সঠিক Entry এবং Stop-loss প্রাইস দিন।';
      warn.classList.add('show');
      return;
    }

    const dollarRisk = bal * (riskPct / 100);
    const priceDiff = Math.abs(entry - sl);
    const pipDist = priceDiff / I.pipSize;
    const pipVal = getPipVal(sym, entry);
    const lots = dollarRisk / (pipDist * pipVal);
    const lotsRounded = Math.floor(lots * 100) / 100;
    const units = lotsRounded * I.contract;
    const notional = units * entry;

    if (riskPct > 2) {
      warn.textContent = `⚠ Risk ${riskPct}% ইনস্টিটিউশনাল ১–২% গাইডলাইনের চেয়ে বেশি। ক্যাপিটাল রক্ষায় কমিয়ে আনার কথা বিবেচনা করুন।`;
      warn.classList.add('show');
    }
    if (lotsRounded < 0.01) {
      warn.textContent = '⚠ ক্যালকুলেটেড লট 0.01 এর নিচে (মিনিমাম)। ব্যালেন্স বাড়ান অথবা SL ডিস্ট্যান্স বাড়ান।';
      warn.classList.add('show');
    }

    document.getElementById('ps_r_dollarrisk').textContent = fmt(dollarRisk);
    document.getElementById('ps_r_pipdist').textContent = fmtN(pipDist, 1) + ' pips';
    document.getElementById('ps_r_pipval').textContent = fmt(pipVal) + ' / pip';
    document.getElementById('ps_r_lots').textContent = lotsRounded.toFixed(2) + ' lots';
    document.getElementById('ps_r_units').textContent = fmtN(units, 0) + ' units';
    document.getElementById('ps_r_notional').textContent = fmt(notional, 0);

    let pill = '', pillClass = '';
    if (riskPct <= 1) { pill = 'Conservative ✓'; pillClass = 'green'; }
    else if (riskPct <= 2) { pill = 'Standard ✓'; pillClass = 'green'; }
    else if (riskPct <= 3) { pill = 'Moderate ⚠'; pillClass = 'amber'; }
    else { pill = 'Excessive ✖'; pillClass = 'red'; }
    document.getElementById('ps_r_risk_pill').innerHTML = `<span class="pill ${pillClass}">${pill}</span>`;

    document.getElementById('ps_results').classList.add('show');
  }

  // --- P&L ---
  function calcPnL() {
    const sym = document.getElementById('pnl_pair').value;
    const lots = parseFloat(document.getElementById('pnl_lots').value) || 0;
    const dir = parseInt(document.getElementById('pnl_dir').value, 10);
    const entry = parseFloat(document.getElementById('pnl_entry').value);
    const tp = parseFloat(document.getElementById('pnl_tp').value);
    const sl = parseFloat(document.getElementById('pnl_sl').value);
    const I = INSTRUMENTS[sym];
    if (!I || !entry || !tp || !sl) return;

    const pipVal = getPipVal(sym, entry) * lots;
    const tpPips = ((tp - entry) / I.pipSize) * dir;
    const slPips = ((sl - entry) / I.pipSize) * dir;
    const profit = tpPips * pipVal;
    const loss = Math.abs(slPips) * pipVal;
    const rr = loss !== 0 ? profit / loss : 0;
    const be = rr > -1 ? (1 / (1 + rr)) * 100 : 100;
    const ev50 = 0.5 * profit - 0.5 * loss;

    document.getElementById('pnl_r_profit').textContent = fmt(profit);
    document.getElementById('pnl_r_loss').textContent = '-' + fmt(loss);
    document.getElementById('pnl_r_tppips').textContent = fmtN(Math.abs(tpPips), 1) + ' pips';
    document.getElementById('pnl_r_slpips').textContent = fmtN(Math.abs(slPips), 1) + ' pips';
    document.getElementById('pnl_r_rr').textContent = '1 : ' + fmtN(rr, 2);
    document.getElementById('pnl_r_be').textContent = fmtN(be, 1) + '%';
    document.getElementById('pnl_r_ev').textContent = (ev50 >= 0 ? '+' : '') + fmt(ev50) + ' (50% win rate এ)';

    let q = '', qc = '';
    if (rr >= 3) { q = 'Excellent (≥ 1:3)'; qc = 'green'; }
    else if (rr >= 2) { q = 'Good (≥ 1:2)'; qc = 'green'; }
    else if (rr >= 1.5) { q = 'Acceptable (≥ 1:1.5)'; qc = 'amber'; }
    else if (rr >= 1) { q = 'Minimum (1:1)'; qc = 'amber'; }
    else { q = 'Poor (< 1:1) — এড়িয়ে চলুন'; qc = 'red'; }
    document.getElementById('pnl_r_quality').innerHTML = `<span class="pill ${qc}">${q}</span>`;

    document.getElementById('pnl_results').classList.add('show');
  }

  // --- Margin ---
  function calcMargin() {
    const sym = document.getElementById('mg_pair').value;
    const price = parseFloat(document.getElementById('mg_price').value);
    const lots = parseFloat(document.getElementById('mg_lots').value) || 0;
    const lev = parseFloat(document.getElementById('mg_lev').value) || 1;
    const bal = parseFloat(document.getElementById('mg_bal').value) || 0;
    const I = INSTRUMENTS[sym];
    const warn = document.getElementById('mg_warn');
    warn.classList.remove('show');
    if (!I || !price) return;

    const notional = lots * I.contract * price;
    const reqMargin = notional / lev;
    const pct = bal > 0 ? (reqMargin / bal) * 100 : 0;
    const freeMargin = bal - reqMargin;
    const marginLevel = reqMargin > 0 ? (bal / reqMargin) * 100 : 0;
    const effLev = bal > 0 ? notional / bal : 0;

    document.getElementById('mg_r_notional').textContent = fmt(notional, 0);
    document.getElementById('mg_r_req').textContent = fmt(reqMargin);
    document.getElementById('mg_r_pct').textContent = fmtN(pct, 2) + '%';
    document.getElementById('mg_r_free').textContent = fmt(freeMargin);
    document.getElementById('mg_r_level').textContent = fmtN(marginLevel, 0) + '%';
    document.getElementById('mg_r_effLev').textContent = fmtN(effLev, 1) + 'x actual';

    let st = '', sc = '';
    if (marginLevel > 500) { st = 'Safe ✓'; sc = 'green'; }
    else if (marginLevel > 200) { st = 'Moderate ⚠'; sc = 'amber'; }
    else { st = 'Danger — margin call এর কাছাকাছি ✖'; sc = 'red'; }
    document.getElementById('mg_r_status').innerHTML = `<span class="pill ${sc}">${st}</span>`;

    if (lev > 100) {
      warn.textContent = `⚠ লিভারেজ 1:${lev} বেশি। ইফেক্টিভ এক্সপোজার আপনার ব্যালেন্সের ${fmtN(effLev, 1)}x। প্রপ ফার্ম রুল অনুসারে প্রতি ট্রেডে ১–২% রিস্ক ব্যবহার করুন।`;
      warn.classList.add('show');
    }

    document.getElementById('mg_results').classList.add('show');
  }

  // --- Pip Value ---
  function calcPip() {
    const sym = document.getElementById('pip_pair').value;
    const price = parseFloat(document.getElementById('pip_price').value) || 1;
    const I = INSTRUMENTS[sym];
    if (!I) return;

    const pv1 = getPipVal(sym, price);
    const unitLabel = (sym === 'XAU/USD' || sym === 'XAG/USD') ? ' oz' : ' units';

    document.getElementById('pip_r_contract').textContent = fmtN(I.contract, 0) + unitLabel;
    document.getElementById('pip_r_pipsize').textContent = I.pipSize.toFixed(Math.max(I.pipDecimals, 3));
    document.getElementById('pip_r_v1').textContent = fmt(pv1) + ' per pip';
    document.getElementById('pip_r_v01').textContent = fmt(pv1 * 0.1) + ' per pip';
    document.getElementById('pip_r_v001').textContent = fmt(pv1 * 0.01) + ' per pip';
    document.getElementById('pip_r_pointsize').textContent = (I.pipSize / 10).toFixed(Math.max(I.pipDecimals + 1, 4)) + ' (১ পিপের ১/১০)';
    document.getElementById('pip_r_notes').textContent = I.notes;
  }

  // --- Compare ---
  function doCompare() {
    const a = document.getElementById('cmp_a').value;
    const b = document.getElementById('cmp_b').value;
    const IA = INSTRUMENTS[a], IB = INSTRUMENTS[b];
    if (!IA || !IB) return;

    const pvA = getPipVal(a, 1), pvB = getPipVal(b, 1);

    const rows = [
      ['Type', IA.type, IB.type],
      ['Contract size', fmtN(IA.contract, 0), fmtN(IB.contract, 0)],
      ['Pip size', IA.pipSize.toFixed(Math.max(IA.pipDecimals, 3)), IB.pipSize.toFixed(Math.max(IB.pipDecimals, 3))],
      ['Pip value (1 lot)', fmt(pvA), fmt(pvB)],
      ['Avg daily range', IA.avgDailyPips + ' pips', IB.avgDailyPips + ' pips'],
      ['Daily $ move (1 lot)', fmt(pvA * IA.avgDailyPips, 0), fmt(pvB * IB.avgDailyPips, 0)],
      ['Typical spread', IA.spread, IB.spread],
      ['Scalping suitability', (IA.type === 'forex' && IA.avgDailyPips < 100) ? 'High' : 'Medium', (IB.type === 'forex' && IB.avgDailyPips < 100) ? 'High' : 'Medium'],
      ['Swing suitability', IA.avgDailyPips > 100 ? 'High' : 'Medium', IB.avgDailyPips > 100 ? 'High' : 'Medium'],
      ['Volatility', IA.avgDailyPips > 100 ? 'High' : (IA.avgDailyPips > 60 ? 'Medium' : 'Low'), IB.avgDailyPips > 100 ? 'High' : (IB.avgDailyPips > 60 ? 'Medium' : 'Low')]
    ];

    let html = `<div class="compare-grid"><div class="compare-col"><div class="compare-head">${a}</div>`;
    rows.forEach((r) => {
      html += `<div class="compare-row"><div class="lbl">${r[0]}</div><div class="val">${r[1]}</div></div>`;
    });
    html += `</div><div class="compare-col"><div class="compare-head">${b}</div>`;
    rows.forEach((r) => {
      html += `<div class="compare-row"><div class="lbl">${r[0]}</div><div class="val">${r[2]}</div></div>`;
    });
    html += `</div></div>`;

    document.getElementById('cmp_out').innerHTML = html;
  }

  // --- Event bindings ---
  document.getElementById('ps_calc').addEventListener('click', calcPos);
  document.getElementById('pnl_calc').addEventListener('click', calcPnL);
  document.getElementById('mg_calc').addEventListener('click', calcMargin);
  document.getElementById('cmp_calc').addEventListener('click', doCompare);
  document.getElementById('pip_pair').addEventListener('change', calcPip);
  document.getElementById('pip_price').addEventListener('input', calcPip);

  // PWA service worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('service-worker.js').catch(() => {});
    });
  }

  // Initial render
  calcPip();
})();
