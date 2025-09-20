# SUBSCRIPTIO - Gestione Abbonamenti Moderna

**SUBSCRIPTIO** è un'applicazione moderna e professionale per la gestione degli abbonamenti e spese condivise, progettata con un design system monocromatico elegante e minimalista ispirato ai migliori standard di design contemporaneo.

## 🎨 Design System Monocromatico

### Caratteristiche del Design
- **Font**: Google "Inter" come font globale per tutti i testi
- **Palette Colori**: Esclusivamente nero, bianco e sfumature di grigio
- **Componenti**: Design system coerente e riutilizzabile
- **Animazioni**: Framer Motion per transizioni fluide
- **Responsive**: Layout adattivo per tutti i dispositivi
- **Dark Mode**: Supporto completo per tema chiaro/scuro

### Palette Colori Monocromatica
- **Primari**: `gray-900` (#111827) per bottoni e accenti
- **Neutri**: `white` a `black` per sfondi e testi
- **Stati**: Solo sfumature di grigio per badge e indicatori
- **Ombre**: `shadow-sm` e `shadow-md` per profondità soft senza colori

### Componenti Monocromatici
- **Button**: Varianti primary (`bg-gray-900`), secondary (`bg-gray-100`), danger (`bg-gray-700`)
- **Card**: Sfondo bianco/grigio scuro con bordi soft
- **Badge**: Stati con sfumature di grigio (attivo: `bg-gray-900`, sospeso: `bg-gray-600`)
- **Form**: Input con bordi grigi e focus ring monocromatico

## 🚀 Funzionalità Principali

### Core Features
- ✅ **Dashboard** - Panoramica completa con metriche e grafici
- ✅ **Gestione Abbonamenti** - CRUD completo con categorie e ricorrenze
- ✅ **Pagamenti** - Tracciamento scadenze e stati pagamento
- ✅ **Contabilità** - Report finanziari e analisi spese
- ✅ **Calendario** - Vista mensile con scadenze
- ✅ **Persone** - Gestione partecipanti e quote condivise
- ✅ **Impostazioni** - Configurazione tema, notifiche e preferenze
- ✅ **Aiuto** - Documentazione completa e FAQ

### Caratteristiche Avanzate
- 🔄 **Calcoli Automatici** - Quote divise e saldi per persona
- 📊 **Grafici Interattivi** - Recharts con palette monocromatica
- 🔔 **Sistema Notifiche** - Promemoria personalizzabili
- 📱 **Responsive Design** - Ottimizzato per mobile e desktop
- 🌙 **Dark Mode** - Tema automatico o manuale
- 💾 **Persistenza** - LocalStorage con mock data realistici

## 🛠️ Stack Tecnologico

### Frontend
- **React 18** - Hooks e Context API
- **Vite** - Build tool veloce e moderno
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animazioni fluide e transizioni
- **Recharts** - Grafici e visualizzazioni dati
- **Lucide React** - Icone SVG moderne e scalabili

### Utilities
- **date-fns** - Manipolazione date
- **uuid** - Generazione ID univoci
- **LocalStorage** - Persistenza dati lato client

## 📦 Installazione e Setup

### Prerequisiti
- Node.js 16+ 
- npm o yarn

### Setup Rapido
```bash
# Clona il repository
git clone <repository-url>
cd subscriptio

# Installa le dipendenze
npm install

# Avvia il server di sviluppo
npm run dev

# L'app si aprirà automaticamente su http://localhost:3000
```

### Script Disponibili
```bash
npm run dev          # Server di sviluppo
npm run build        # Build di produzione
npm run preview      # Preview build di produzione
npm run lint         # Controllo codice ESLint
```

## 🎯 Utilizzo

### Primi Passi
1. **Dashboard**: Visualizza metriche e attività recenti
2. **Abbonamenti**: Aggiungi il tuo primo abbonamento
3. **Persone**: Configura partecipanti per spese condivise
4. **Impostazioni**: Personalizza tema e notifiche

### Gestione Abbonamenti
- **Aggiunta**: Nome, categoria, importo, ricorrenza
- **Condivisione**: Seleziona partecipanti per quote divise
- **Categorie**: Streaming, Musica, Utilità, Salute, ecc.
- **Ricorrenze**: Mensile, annuale o personalizzato

### Sistema Pagamenti
- **Scadenze**: Tracciamento automatico date di scadenza
- **Stati**: Pagato, In Sospeso, Scaduto
- **Quote**: Calcolo automatico per abbonamenti condivisi
- **Promemoria**: Notifiche configurabili

## 🎨 Personalizzazione Design Monocromatico

### Modificare Colori
Il design system monocromatico è centralizzato in `src/styles/global.css`. Per modificare i colori mantenendo la monocromia:

```css
/* Modifica palette primaria (sempre grigi) */
.btn-primary {
  @apply bg-gray-900 hover:bg-gray-800; /* Cambia con altre sfumature di grigio */
}

/* Modifica colori neutri */
.card {
  @apply bg-white dark:bg-gray-900; /* Personalizza sfondi mantenendo monocromia */
}
```

### Modificare Font
Il font "Inter" è configurato in `tailwind.config.js`:

```js
theme: {
  extend: {
    fontFamily: {
      sans: ['Inter', 'ui-sans-serif', 'system-ui'],
    },
  },
}
```

### Componenti Personalizzabili
- **Button**: Varianti primary, secondary, danger, success, warning, info (tutte monocromatiche)
- **Card**: Header, body, footer con padding e ombre configurabili
- **Badge**: Stati e dimensioni personalizzabili (solo grigi)
- **Modal**: Overlay e animazioni configurabili

## 📱 Responsive Design

### Breakpoints
- **Mobile**: `< 768px` - Layout verticale ottimizzato
- **Tablet**: `768px - 1024px` - Grid adattivo
- **Desktop**: `> 1024px` - Layout completo con sidebar

### Componenti Adattivi
- **Sidebar**: Collassabile su mobile
- **Grid**: Adattivo per diverse dimensioni schermo
- **Tabelle**: Scroll orizzontale su mobile
- **Modali**: Dimensioni ottimizzate per dispositivo

## 🔧 Architettura

### Struttura Progetto
```
src/
├── components/          # Componenti riutilizzabili
│   ├── Button.jsx      # Sistema bottoni monocromatici
│   ├── Card.jsx        # Sistema card
│   ├── Modal.jsx       # Modali e overlay
│   ├── Badge.jsx       # Badge e stati monocromatici
│   ├── Sidebar.jsx     # Navigazione principale
│   └── Topbar.jsx      # Barra superiore
├── pages/              # Pagine dell'applicazione
├── repositories/       # Data access layer
├── utils/             # Utility e business logic
├── data/              # Mock data e seed
└── styles/            # Stili globali e design system monocromatico
```

### Pattern Utilizzati
- **Repository Pattern**: Astrazione per accesso dati
- **Context API**: Gestione stato globale
- **Custom Hooks**: Logica riutilizzabile
- **Component Composition**: Componenti composabili
- **Utility Functions**: Business logic separata

## 🚀 Deployment

### Build di Produzione
```bash
npm run build
```

### Output
- `dist/` - File ottimizzati per produzione
- Bundle splitting automatico
- Minificazione CSS e JavaScript
- Tree shaking per ridurre dimensioni

### Hosting
- **Vercel**: Deploy automatico da Git
- **Netlify**: Drag & drop del folder `dist/`
- **GitHub Pages**: Deploy da branch `gh-pages`
- **Server Statico**: Qualsiasi web server

## 🔮 Roadmap

### Prossime Funzionalità
- [ ] **OCR Receipts** - Scansione automatica ricevute
- [ ] **Integrazione Stripe** - Pagamenti online
- [ ] **Multi-currency** - Supporto valute multiple
- [ ] **API Backend** - Sostituzione LocalStorage
- [ ] **Mobile App** - React Native o PWA
- [ ] **Collaborazione** - Condivisione tra utenti

### Miglioramenti Design Monocromatico
- [ ] **Micro-interazioni** - Animazioni più sofisticate
- [ ] **Skeleton Loading** - Stati di caricamento migliorati
- [ ] **Toast Notifications** - Feedback utente avanzato
- [ ] **Keyboard Shortcuts** - Navigazione da tastiera
- [ ] **Personalizzazione Palette** - Opzioni per diverse sfumature di grigio

## 🤝 Contribuire

### Setup Sviluppo
```bash
# Fork e clone
git clone <your-fork-url>
cd subscriptio

# Branch feature
git checkout -b feature/nuova-funzionalita

# Sviluppo
npm run dev

# Commit e push
git add .
git commit -m "feat: aggiunge nuova funzionalità"
git push origin feature/nuova-funzionalita
```

### Guidelines Design Monocromatico
- **Conventional Commits** per i messaggi
- **ESLint** per consistenza codice
- **Componenti** riutilizzabili e testabili
- **Design System** sempre monocromatico (nero/bianco/grigio)
- **Nessun colore** saturato o accento colorato

## 📄 Licenza

MIT License - Vedi [LICENSE](LICENSE) per dettagli.

## 🆘 Supporto

### Documentazione
- **README**: Questa guida completa
- **Codice**: Commenti JSDoc per funzioni principali
- **Componenti**: Props e esempi di utilizzo

### Problemi Comuni
1. **Porta occupata**: Cambia porta in `vite.config.js`
2. **Dati non salvati**: Verifica LocalStorage nel browser
3. **Tema non cambia**: Controlla `localStorage.theme`
4. **Colori non monocromatici**: Verifica `src/styles/global.css`

### Contatti
- **Issues**: GitHub Issues per bug e feature requests
- **Discussions**: GitHub Discussions per domande
- **Wiki**: Documentazione estesa e tutorial

---

**SUBSCRIPTIO** - Gestione abbonamenti resa semplice e moderna con design monocromatico elegante 🚀
