# Forex Risk &amp; Position Size Calculator

একটি ইনস্টিটিউশনাল-গ্রেড Forex ক্যালকুলেটর — Position Size, P&amp;L, Margin, Pip Value এবং Instrument Comparison। শুধু HTML, CSS, JavaScript — কোনো framework বা dependency ছাড়া।

## ফিচার

- **Position Size** — Balance, Risk %, Entry, Stop-loss দিয়ে সঠিক লট সাইজ ক্যালকুলেট করে
- **P&L & R:R** — Profit, Loss, Risk:Reward ratio, Break-even win rate, Expected value
- **Margin** — Required margin, Free margin, Margin level, Effective leverage
- **Pip Value** — যেকোনো ইনস্ট্রুমেন্টের জন্য pip value reference (1.0 / 0.10 / 0.01 lot)
- **Compare** — দুইটি ইনস্ট্রুমেন্ট পাশাপাশি তুলনা (volatility, pip value, spread ইত্যাদি)
- ৩০+ Forex pairs, Gold/Silver, এবং Indices সাপোর্ট করে
- Responsive, mobile-friendly ডিজাইন
- PWA — অফলাইনে কাজ করে, ইনস্টলযোগ্য
- PWABuilder দিয়ে সরাসরি APK বানানোর জন্য প্রস্তুত

## প্রজেক্ট স্ট্রাকচার

```
forex-calculator/
├── index.html
├── style.css
├── script.js
├── manifest.json
├── service-worker.js
└── icons/
    ├── icon-192.png
    ├── icon-512.png
    ├── icon-maskable-192.png
    └── icon-maskable-512.png
```

## লোকালি রান করা

`index.html` ফাইলটা ব্রাউজারে খুললেই চলবে। অথবা:

```bash
npx serve .
```

## GitHub Pages এ Deploy করা

1. এই ফোল্ডারটা একটা GitHub রিপোজিটরিতে পুশ করুন।
2. **Settings → Pages** এ যান।
3. Source হিসেবে main branch (root) সিলেক্ট করুন।
4. লাইভ URL পাবেন: `https://<username>.github.io/<repo-name>/`

## PWABuilder দিয়ে Android APK বানানো

1. অ্যাপটি deploy করুন (যেমন GitHub Pages এ) যাতে পাবলিক HTTPS URL পাওয়া যায়।
2. [https://www.pwabuilder.com](https://www.pwabuilder.com) এ যান।
3. আপনার deploy করা URL পেস্ট করে **Start** ক্লিক করুন।
4. PWABuilder manifest এবং service worker ভ্যালিডেট করবে।
5. **Package for Stores → Android** ক্লিক করে APK/AAB জেনারেট করুন।

## গুরুত্বপূর্ণ নোট

এই ক্যালকুলেটরের সব হিসাব শুধুমাত্র শিক্ষামূলক ও সহায়ক উদ্দেশ্যে। ব্রোকার/প্রপ ফার্মের actual spread, swap, এবং কমিশনের কারণে real-world ফলাফল কিছুটা ভিন্ন হতে পারে। ট্রেডিং সিদ্ধান্তের আগে নিজের ব্রোকারের ক্যালকুলেটর দিয়েও যাচাই করুন।

## License

ফ্রি — ব্যবহার ও পরিবর্তন করতে পারবেন।
