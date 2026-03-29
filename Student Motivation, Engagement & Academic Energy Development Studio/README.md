# Student Motivation, Engagement & Academic Energy Development Studio
**Developed by Mateen Yousuf | Teacher, School Education Department Kashmir**
**Aligned with NEP 2020 | Joyful Learning | Student Agency**

---

## 📁 FILE STRUCTURE

```
motivation-studio/
├── index.html          ← Main app (entire app in one file)
├── manifest.json       ← PWA manifest for installability
├── service-worker.js   ← Offline caching & background sync
├── author.jpg          ← Author photo (place your photo here)
└── README.md           ← This guide
```

---

## 🚀 HOW TO RUN LOCALLY

### Option 1: VS Code Live Server (Recommended)
1. Install VS Code from https://code.visualstudio.com
2. Install the "Live Server" extension
3. Right-click `index.html` → "Open with Live Server"
4. App opens at `http://127.0.0.1:5500`

### Option 2: Python HTTP Server
```bash
# Python 3
python -m http.server 8000
# Then open: http://localhost:8000
```

### Option 3: Direct Browser
- Simply double-click `index.html`
- Note: Service Worker won't activate on file:// protocol
- Use Live Server for full PWA functionality

---

## 🌐 HOW TO HOST FOR FREE

### GitHub Pages (Recommended — Free & Fast)
1. Create a free GitHub account at https://github.com
2. Create a new repository: `motivation-studio`
3. Upload all files to the repository
4. Go to: Settings → Pages → Source: "main branch"
5. Your app will be live at: `https://yourusername.github.io/motivation-studio`

### Netlify (Drag & Drop — Easiest)
1. Go to https://netlify.com
2. Sign up free
3. Drag your entire folder to the Netlify dashboard
4. App is instantly live with a free HTTPS URL

### Cloudflare Pages
1. Go to https://pages.cloudflare.com
2. Connect GitHub repository
3. Deploy — free with global CDN

---

## 📱 CONVERTING TO ANDROID APK

### Method 1: PWABuilder (Easiest — No Coding)
1. Host your app on GitHub Pages or Netlify
2. Go to https://www.pwabuilder.com
3. Enter your app URL
4. Click "Start" → Select Android → Download Package
5. Install the APK on Android device (enable "Unknown Sources" in settings)

### Method 2: Android Studio WebView (Full Control)
1. Install Android Studio from https://developer.android.com/studio
2. Create new project: "Empty Activity"
3. In `MainActivity.java`:
```java
WebView webView = new WebView(this);
setContentView(webView);
webView.getSettings().setJavaScriptEnabled(true);
webView.getSettings().setDomStorageEnabled(true);
webView.loadUrl("file:///android_asset/www/index.html");
```
4. Copy all your files to `app/src/main/assets/www/`
5. Build → Generate Signed APK

### APK Signing (for distribution)
```bash
keytool -genkey -v -keystore motivation-studio.keystore -alias motivationkey -keyalg RSA -keysize 2048 -validity 10000
```

### Splash Screen Setup
- Add launcher icons to `res/mipmap-*/` folders
- Icon sizes needed: 48×48, 72×72, 96×96, 144×144, 192×192 px
- Add splash screen in `res/drawable/splash.xml`

---

## 📊 APP FEATURES

| Feature | Description |
|---------|-------------|
| 🔍 Motivation Self-Check | 6-factor scoring: Interest, Goals, Confidence, Distraction, Consistency, Enjoyment |
| 📊 Engagement Tracker | 5-indicator academic engagement index |
| ⚡ Energy Monitor | Sleep/Screen/Study/Exercise → Burnout Risk calculation |
| 🎯 Goal Analyzer | Short-term + Long-term goal alignment scoring |
| 📈 Trend Tracker | Visual charts of motivation & energy over time |
| 📖 20 Foundation Chapters | 1000-1400 words each on motivation science |
| 🌟 Joyful Learning Index | Composite score from all four tools |
| 💡 Interventions | Personalised suggestions based on scores |
| 📄 PDF Report | Printable motivation & engagement report |

---

## 🔢 SCORING FORMULAS

### Motivation Strength Index (MSI)
```
Adjusted values: Distraction = 6 - Distraction_rating (reverse scored)
MSI = Σ(Factor_value × Factor_weight) / 5 × 100

Weights:
- Interest:     0.25
- Goals:        0.20
- Confidence:   0.20
- Distraction:  0.15 (reverse)
- Consistency:  0.15
- Enjoyment:    0.05
```

### Academic Engagement Index (AEI)
```
AEI = Σ(Indicator_value × Indicator_weight) / 5 × 100

Weights:
- Participation:  0.25
- Questioning:    0.20
- Homework:       0.20
- Project:        0.20
- Peer collab:    0.15
```

### Energy Stability Score (ESS)
```
ESS = sleep_score×0.35 + screen_score×0.20 + study_score×0.25 + phys_score×0.20

Sleep scoring: 7-9h=100, 6-7h=75, 5-6h=50, <5h=25
Screen scoring: ≤1h=100, ≤2h=85, ≤3h=65, ≤4h=45, >4h=25
```

### Burnout Risk Indicator (BRI)
```
BRI = min(100, (5 - sleep/2)×15 + screen×8 + (60 - min(60, phys_min))×0.4)
```

### Goal Alignment Index (GAI)
```
effort_score = min(100, effort_hours / 4 × 100)
days_score = min(100, study_days / 6 × 100)
ECR = effort_score × 0.6 + days_score × 0.4
PCS = clarity_rating / 10 × 100
GAI = min(100, ECR×0.45 + PCS×0.35 + goal_bonus×0.1 + both_goals_bonus×0.1)
```

### Joyful Learning Composite (JLC)
```
JLC = (MSI×0.35 + AEI×0.35 + ESS×0.30) / (sum of available weights) × 100
```

---

## 💾 LOCAL STORAGE KEYS

```javascript
'motivationLogs'    // Array of { date, msi, interest, goals, confidence, distraction, consistency, enjoyment }
'engagementLogs'    // Array of { date, aei, participation, questioning, homework, project, peer }
'energyData'        // Array of { date, ess, bri, sleep, screen, study, phys }
'trendHistory'      // Reserved for future weekly summaries
'reports'           // Reserved for saved report snapshots
```

---

## 🎨 DESIGN SPECIFICATIONS

- **Primary Color:** #0a1628 (Deep Navy)
- **Accent:** #00d4ff (Turquoise)
- **Accent 2:** #00ffb3 (Mint Green)
- **Accent 3:** #7c5cfc (Purple)
- **Warning:** #ff6b6b (Red)
- **Gold:** #ffd166 (Amber)
- **Fonts:** Sora (body) + Nunito (headings/numbers)
- **Theme:** Youth-dynamic, dark theme, offline-first

---

## 📋 NEP 2020 ALIGNMENT

This app supports NEP 2020's joyful learning framework by:
- Tracking student agency and self-awareness (not just grades)
- Supporting holistic development (academic + energy + wellbeing)
- Enabling teacher-free, student-directed self-improvement
- Providing evidence-based motivation science in accessible language
- Working fully offline for low-connectivity environments

---

*Developed with ❤️ by Mateen Yousuf | School Education Department, Jammu & Kashmir*
