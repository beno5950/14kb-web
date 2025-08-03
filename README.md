<p align="center">
  <img src="https://github.com/dunamismax/images/blob/main/javascript/Vanilla-JS-Logo.png" alt="14KB Web Logo" width="300" />
</p>

<div align="center">

# 14KB Web Monorepo

</div>

<p align="center">
  <a href="https://github.com/dunamismax/14kb-web">
    <img src="https://readme-typing-svg.demolab.com/?font=Inter&weight=600&size=28&pause=1000&color=FCCD3C&center=true&vCenter=true&width=1200&height=90&lines=Ultra-Lightweight+Web+Development+Under+14KB;High-Performance+Fastify+API+%2B+SQLite+Database;Minimalist+Blog+with+Performance+Philosophy;Weather+App+with+OpenWeatherMap+Integration;Tasks+App+with+Scheduler+and+Notes;Zero+Framework+Overhead+%26+Maximum+Speed;Production+Ready+with+esbuild+%26+Performance+Budget;TCP+Slow+Start+Optimized+Architecture;Complete+Accessibility+with+Semantic+HTML;Lightning+Fast+14KB+Page+Loads;Open+Source+MIT+Licensed+Framework" alt="Typing SVG" />
  </a>
</p>

<div align="center">

<p style="color: #58A448; font-size: 18px; font-weight: 500;">
A comprehensive monorepo for building ultra-fast websites under 14KB per page<br>
Featuring optimized performance, beautiful UIs, and zero framework dependencies
</p>

</div>

<p align="center">
  <a href="https://14kb-web.dunamismax.com/">
    <img src="https://img.shields.io/badge/Live-Demo-58A448.svg?style=for-the-badge&logo=rocket&logoColor=white" alt="Live Demo">
  </a>
</p>

<details>
<summary style="cursor: pointer; padding: 12px; background: linear-gradient(135deg, #58A448, #2c5234); color: white; border-radius: 8px; text-align: center; font-weight: bold; margin: 8px 0; list-style: none;">
  Click to explore the applications
</summary>
<div style="margin-top: 16px;">
<p align="center">
  <strong>Blog:</strong> <code>http://localhost:3000</code><br>
  <strong>Weather App:</strong> <code>http://localhost:3001</code><br>
  <strong>Tasks App:</strong> <code>http://localhost:3002</code><br>
  <strong>Size Check:</strong> <code>pnpm check-size</code><br>
  <strong>Build All:</strong> <code>pnpm build-all</code>
</p>
</div>
</details>

---

<p align="center">
  <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Node.js-22.18+-58A448.svg?logo=nodedotjs&logoColor=white&style=for-the-badge" alt="Node.js Version"></a>
  <a href="https://www.fastify.io/"><img src="https://img.shields.io/badge/Fastify-5.4+-58A448.svg?logo=fastify&logoColor=white&style=for-the-badge" alt="Fastify Version"></a>
  <a href="https://esbuild.github.io/"><img src="https://img.shields.io/badge/esbuild-0.25+-58A448.svg?style=for-the-badge&logoColor=white" alt="esbuild"></a>
  <a href="https://pnpm.io/"><img src="https://img.shields.io/badge/pnpm-8+-58A448.svg?logo=pnpm&logoColor=white&style=for-the-badge" alt="pnpm"></a>
</p>

<p align="center">
  <a href="https://vinejs.dev/"><img src="https://img.shields.io/badge/VineJS-3.0+-58A448.svg?style=for-the-badge&logoColor=white" alt="VineJS"></a>
  <a href="https://eslint.org/"><img src="https://img.shields.io/badge/ESLint-9.32+-58A448.svg?logo=eslint&logoColor=white&style=for-the-badge" alt="ESLint"></a>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-58A448.svg?style=for-the-badge&logoColor=white" alt="MIT License"></a>
  <img src="https://img.shields.io/badge/14KB-Budget_Enforced-58A448.svg?style=for-the-badge&logoColor=white" alt="14KB Budget">
</p>

---

## Core Features

<table align="center">
<tr>
<td align="center" width="25%">
<img src="https://img.shields.io/badge/-14KB_Budget-58A448?style=for-the-badge&logo=speedtest&logoColor=white" alt="14KB Budget"><br>
<sub><b>TCP Slow Start<br>Optimized</b></sub>
</td>
<td align="center" width="25%">
<img src="https://img.shields.io/badge/-Vanilla_JS-58A448?style=for-the-badge&logo=javascript&logoColor=white" alt="Vanilla JS"><br>
<sub><b>Pure JavaScript<br>Zero Frameworks</b></sub>
</td>
<td align="center" width="25%">
<img src="https://img.shields.io/badge/-Performance_First-58A448?style=for-the-badge&logo=flash&logoColor=white" alt="Performance First"><br>
<sub><b>Lightning Fast<br>Load Times</b></sub>
</td>
<td align="center" width="25%">
<img src="https://img.shields.io/badge/-Accessibility-58A448?style=for-the-badge&logo=accessibility&logoColor=white" alt="Accessibility"><br>
<sub><b>Semantic HTML<br>WCAG Compliant</b></sub>
</td>
</tr>
</table>

### Performance & Architecture

- **14KB budget enforcement** with automated size checking for optimal TCP slow start performance
- **Zero framework overhead** with pure vanilla JavaScript and modern web standards
- **High-performance backend** built with Fastify 5 for maximum throughput and efficiency
- **Advanced validation** with VineJS 3.0 for type-safe data validation
- **Modern build pipeline** with esbuild 0.25+ for lightning-fast bundling and optimization
- **Enhanced security** with comprehensive security headers and input validation

### Developer Experience

- **Monorepo architecture** with pnpm workspaces for efficient dependency management
- **Code quality tools** with ESLint 9.32+ and Prettier for consistent, maintainable code
- **Performance budget checking** with automated 14KB gzipped size validation
- **Production deployment** ready with optimized builds and performance monitoring

### Modern Standards

- **Semantic HTML5** with accessible markup and ARIA attributes
- **Modern CSS** with custom properties, grid, and flexbox layouts
- **Progressive enhancement** from HTML to CSS to JavaScript
- **Native Web APIs** including fetch, localStorage, and modern browser features

---

<p align="center">
  <img src="https://github.com/dunamismax/images/blob/main/javascript/js-coffee-particles.jpg" alt="JavaScript Coffee" width="500" />
</p>

## Project Structure

```sh
14kb-web/
├── apps/
│   ├── blog/               # 14KB Blog - Performance philosophy
│   ├── tasks/              # Tasks App - Task scheduler and notes
│   └── weather/            # Weather App - OpenWeatherMap integration
├── build/                  # Production-ready optimized builds
├── packages/               # Shared utilities (future expansion)
├── scripts/                # Build tools and performance checks
│   ├── build-all.js       # Generate optimized builds
│   └── check-size.js      # 14KB budget enforcement
└── docs/                   # Documentation and guides
```

## Documentation

**Guides:** [Performance](docs/PERFORMANCE.md) • [Architecture](docs/ARCHITECTURE.md) • [Deployment](docs/DEPLOYMENT.md)

**Resources:** [14KB Rule](https://mobilehtml5.org/) • [TCP Slow Start](https://developer.mozilla.org/en-US/docs/Glossary/TCP_slow_start) • [Fastify Docs](https://www.fastify.io/docs/) • [esbuild Guide](https://esbuild.github.io/)

---

## Quick Start

**Prerequisites:** Node.js 22.18.0-24.x and pnpm 8+ installed

```bash
# Clone and setup
git clone https://github.com/dunamismax/14kb-web.git && cd 14kb-web

# Ensure correct Node.js version (22.18.0 recommended)
node --version  # Should show v22.18.x
# If using nvm: nvm use 22.18.0

# Check Node.js compatibility
pnpm check-node

# Install dependencies
pnpm install

# Configure weather app (optional)
echo "OPENWEATHER_API_KEY=your_api_key_here" > apps/weather/.env

# Start all apps
pnpm dev

# Or run individual apps
pnpm --filter blog dev        # Blog at localhost:3000
pnpm --filter weather dev     # Weather at localhost:3001  
pnpm --filter tasks dev       # Tasks at localhost:3002

# Build optimized production files
pnpm build-all

# Verify 14KB budget compliance
pnpm check-size
```

<div align="center">

**Blog:** `http://localhost:3000` • **Weather:** `http://localhost:3001` • **Tasks:** `http://localhost:3002`

> **Note:** The Tasks app uses Node.js built-in SQLite (experimental) and may show warnings in Node.js 24+

<img src="https://img.shields.io/badge/Status-Under_14KB-58A448?style=for-the-badge&logoColor=white" alt="Under 14KB">
<img src="https://img.shields.io/badge/Performance-TCP_Optimized-58A448?style=for-the-badge&logoColor=white" alt="TCP Optimized">

</div>

---

## Development & Build

```bash
# Development
pnpm dev                          # Start all dev servers
pnpm lint                         # Run ESLint
pnpm format                       # Format with Prettier
pnpm check-size                   # Verify 14KB budget

# Production
pnpm build-all                    # Build optimized deployments
pnpm build                        # Build individual apps

# Individual apps
pnpm --filter blog dev            # Blog server only
pnpm --filter tasks build         # Build tasks app only
```

---

## Deployment

```bash
# Generate production builds
pnpm build-all

# Verify performance
pnpm check-size

# Deploy from build/ directory
# Each app has: index.html, index.html.gz, index.html.br
```

**Architecture:** CDN/Proxy → Static Files (≤14KB) → APIs (Weather/Tasks) → SQLite

---

<p align="center">
  <img src="https://github.com/dunamismax/images/blob/main/javascript/JavaScript-logo.png" alt="JavaScript Logo" width="200" />
</p>

## Technology Stack

<table align="center">
<tr>
<td align="center">
<img src="https://img.shields.io/badge/Runtime-Node.js_22-58A448?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js"><br>
<sub>JavaScript runtime for backend services</sub>
</td>
<td align="center">
<img src="https://img.shields.io/badge/Framework-Fastify_5-58A448?style=for-the-badge&logo=fastify&logoColor=white" alt="Fastify"><br>
<sub>High-performance web framework</sub>
</td>
<td align="center">
<img src="https://img.shields.io/badge/Database-SQLite_3-58A448?style=for-the-badge&logo=sqlite&logoColor=white" alt="SQLite"><br>
<sub>Embedded relational database</sub>
</td>
</tr>
<tr>
<td align="center">
<img src="https://img.shields.io/badge/Build-esbuild-58A448?style=for-the-badge&logoColor=white" alt="esbuild"><br>
<sub>Ultra-fast JavaScript bundler</sub>
</td>
<td align="center">
<img src="https://img.shields.io/badge/Package-pnpm_8-58A448?style=for-the-badge&logo=pnpm&logoColor=white" alt="pnpm"><br>
<sub>Fast, disk space efficient package manager</sub>
</td>
<td align="center">
<img src="https://img.shields.io/badge/Performance-14KB_Budget-58A448?style=for-the-badge&logoColor=white" alt="14KB Budget"><br>
<sub>TCP slow start optimized architecture</sub>
</td>
</tr>
</table>

**Stack highlights:** 14KB budget • Zero frameworks • Modern JavaScript • Production ready • TCP optimized

## Philosophy

### Why 14KB Matters?

1. **TCP Slow Start** - The first 14KB can be delivered in the initial TCP round trip, critical for perceived performance
2. **Mobile Performance** - Ensures fast loading on slower mobile connections and devices
3. **User Experience** - Sub-second page loads create superior user experiences
4. **Network Efficiency** - Minimizes bandwidth usage and reduces server costs

### Why This Approach?

- **Vanilla JavaScript** - Direct browser APIs without framework overhead
- **Progressive Enhancement** - Semantic HTML foundation enhanced with CSS and JavaScript
- **Performance Budget** - Hard 14KB limit enforces disciplined, optimized development
- **Modern Standards** - ES modules, CSS Grid, and native web APIs

### Blog Topics

- Why 14KB Matters: TCP Slow Start Performance
- Vanilla JavaScript Renaissance: Building Without Frameworks  
- Modern CSS Without Frameworks: Grid, Flexbox, Custom Properties
- Network Optimization: Gzip, Caching, TCP Strategies
- Fastify + SQLite: Minimal Backend Stack
- ESBuild: Performance Champion Bundler
- Accessibility on a Budget: Semantic HTML
- Performance Metrics That Matter

## Applications

### 14KB Blog

A minimalist blog focused on ultra-lightweight web development philosophy.

**Features:**

- Static site generation under 14KB per page
- Markdown blog posts about performance optimization
- Dark/light mode with CSS `prefers-color-scheme`
- Semantic HTML structure for accessibility
- Progressive enhancement with minimal JavaScript

### Weather App

A fully-featured weather application using the OpenWeatherMap API, all under 14KB.

**Features:**

- ZIP code weather lookup with validation
- Comprehensive weather data (temperature, humidity, wind, pressure)
- Sunrise/sunset times with local formatting
- Dark/light mode toggle with localStorage persistence
- Error handling and loading states
- Responsive design for all devices
- Local caching for performance

### Tasks App

A comprehensive task scheduler, reminders, and notes application with full CRUD functionality, all under 14KB.

**Features:**

- Create, edit, and delete tasks with titles and notes
- Priority levels (Low, Medium, High) with visual indicators
- Due date scheduling with overdue detection
- Task completion tracking with visual feedback
- Filter by status (All, Pending, Completed, Overdue)
- Sort by creation date, due date, priority, or title
- Dark/light mode with system preference detection
- SQLite database for reliable data persistence
- Responsive design optimized for all devices
- Real-time task status updates

## Production Builds

**[Optimized Production Builds](build/)**

Pre-built, production-ready applications are available in the `build/` directory. Each application is:

- **Single-file deployment** - HTML with inlined CSS and JavaScript
- **Multiple compression formats** - Gzip and Brotli pre-compressed versions
- **CDN ready** - Optimized for content delivery networks
- **Zero dependencies** - Self-contained applications
- **Performance verified** - All under 14KB gzipped

See [build/README.md](build/README.md) for deployment instructions and performance metrics.

## Performance Metrics

All applications in this monorepo are designed to meet strict performance criteria:

- **Page Size**: ≤14KB gzipped (HTML + critical CSS/JS)
- **First Contentful Paint**: <1 second
- **Time to Interactive**: <2 seconds
- **Cumulative Layout Shift**: <0.1
- **Accessibility**: WCAG 2.1 AA compliant

## License

<div align="center">

<img src="https://img.shields.io/badge/License-MIT-58A448?style=for-the-badge&logo=opensource&logoColor=white" alt="MIT License">

**This project is licensed under the MIT License**
_Feel free to use, modify, and distribute_

[View License Details](LICENSE)

</div>

---

<p align="center">
  <a href="https://www.buymeacoffee.com/dunamismax">
    <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" >
  </a>
</p>

<p align="center">
  <a href="https://twitter.com/dunamismax" target="_blank"><img src="https://img.shields.io/badge/Twitter-58A448.svg?&style=for-the-badge&logo=twitter&logoColor=white" alt="Twitter"></a>
  <a href="https://bsky.app/profile/dunamismax.bsky.social" target="_blank"><img src="https://img.shields.io/badge/Bluesky-58A448?style=for-the-badge&logo=bluesky&logoColor=white" alt="Bluesky"></a>
  <a href="https://reddit.com/user/dunamismax" target="_blank"><img src="https://img.shields.io/badge/Reddit-58A448.svg?&style=for-the-badge&logo=reddit&logoColor=white" alt="Reddit"></a>
  <a href="https://discord.com/users/dunamismax" target="_blank"><img src="https://img.shields.io/badge/Discord-58A448.svg?style=for-the-badge&logo=discord&logoColor=white" alt="Discord"></a>
  <a href="https://signal.me/#p/+dunamismax.66" target="_blank"><img src="https://img.shields.io/badge/Signal-58A448.svg?style=for-the-badge&logo=signal&logoColor=white" alt="Signal"></a>
</p>

---

<p align="center">
  <strong style="color: #58A448; font-size: 18px;">14KB Web Monorepo</strong><br>
  <sub style="color: #58A448;">Ultra-Lightweight • 14KB Budget • Vanilla JavaScript • Fastify API • SQLite Database • Modern CSS • Zero Frameworks • TCP Optimized • Lightning Fast • Open Source</sub>
</p>

<p align="center">
  <img src="https://github.com/dunamismax/images/blob/main/javascript/js-evolution-wallpaper.jpg" alt="JavaScript Evolution" width="500" />
</p>
