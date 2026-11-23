# Habits UP — Suite Integral de Pruebas Automatizadas

[![Habits UP - CI/CD Pipeline de Pruebas Automatizadas](https://github.com/JAlfredoSoc/HabitsUp/actions/workflows/tests.yml/badge.svg)](https://github.com/JAlfredoSoc/HabitsUp/actions/workflows/tests.yml)

Aplicación web full-stack (**React 19 + Vite 8** en Frontend y **Node.js + Express 5 + MongoDB / Mongoose 8** en Backend) para la gestión y seguimiento de hábitos personales, verificada automáticamente en todos los niveles de la **Pirámide de Pruebas**:
1. **Pruebas Unitarias, Mocking y Cobertura (`Mocha` + `Chai` + `Sinon` + `c8`)**
2. **Pruebas de API REST, Contratos JSON Schema y DDT (`Postman v2.1` + `Newman` + `htmlextra`)**
3. **Pruebas End-to-End con Page Object Model y Asistidas por IA (`Playwright` en Chromium y Firefox)**
4. **Auditorías Automatizadas de Accesibilidad (`@axe-core/playwright`) y Rendimiento Web (`Google Lighthouse`)**
5. **Pipeline de Integración Continua en etapas (`GitHub Actions`)**

---

## 1. Requisitos Previos

- **Node.js** `v20+` LTS y **npm**
- **Git**
- *(Opcional)* Instancia de MongoDB local o MongoDB Atlas configurada en `Back/.env`. Si no se define `MONGO_URI`, el sistema aprovisiona automáticamente una base de datos aislada en memoria (`habitsUp_Test` vía `mongodb-memory-server`) con semillas precargadas de categorías y sugerencias, permitiendo ejecutar **todas las suites desde un clon limpio sin configuración manual externa**.

---

## 2. Instalación desde un Clon Limpio

Ejecute los siguientes comandos desde la raíz del repositorio:

```bash
# 1. Instalar dependencias de la raíz (Playwright, axe-core, Lighthouse)
npm install

# 2. Instalar dependencias del Backend (Express, Mocha, Chai, Sinon, c8, Newman)
npm --prefix Back install

# 3. Instalar dependencias del Frontend (React, Vite, Bootstrap)
npm --prefix Front install

# 4. Instalar navegadores para pruebas E2E (Chromium y Firefox)
npx playwright install chromium firefox
```

---

## 3. Ejecución de las Suites de Pruebas (1 o 2 comandos)

Desde la carpeta raíz del proyecto (`HabitsUp/`), puede ejecutar todas las suites con un solo comando o cada nivel por separado:

| Nivel / Suite | Comando desde la raíz | Descripción y Reporte Generado |
|---|---|---|
| **Todas las Suites** | `npm run test:all` | Ejecuta secuencialmente Unitarias, API (Newman), E2E + Accesibilidad (Playwright/axe) y Rendimiento (Lighthouse). |
| **1. Pruebas Unitarias** | `npm run test:unit` | Ejecuta las 16 pruebas unitarias con bloques AAA y dobles de prueba (`Sinon`) en `Back/test/unit/`. |
| **1b. Cobertura Unitaria** | `npm run test:coverage` | Mide cobertura de código con `c8` (>= 75% de líneas) y genera reporte HTML en `Back/coverage/index.html` y `reports/coverage/index.html`. |
| **2. Pruebas de API REST** | `npm run test:api` | Levanta el backend con datos semilla, ejecuta la colección Postman v2.1 con **5 iteraciones DDT** (125 requests, 530 assertions) y genera reporte HTML `htmlextra` en `reports/newman/habitsup-api-report.html`. |
| **3. Pruebas E2E (POM + IA)** | `npm run test:e2e` | Levanta Backend (`:3000`) y Frontend (`:5173`), ejecuta 37 pruebas E2E en **Chromium** y **Firefox** (incluyendo POM, DDT, negativos, IA y axe) y genera reporte en `reports/playwright/index.html`. |
| **4. Accesibilidad (axe)** | `npm run test:a11y` | Ejecuta las pruebas de accesibilidad WCAG 2.1 A/AA con `@axe-core/playwright` sobre 4 vistas clave y exporta `reports/accessibility/axe-report.html`. |
| **5. Rendimiento (Lighthouse)** | `npm run test:lighthouse` | Evalúa 3 páginas clave con Google Lighthouse (Rendimiento, Accesibilidad, LCP, CLS, TBT) y exporta `reports/lighthouse/index.html`. |

---

## 4. Estructura del Repositorio

```text
HabitsUp/
├── .github/workflows/
│   └── tests.yml                                  # Pipeline CI/CD en 3 etapas secuenciales con artefactos
├── .vscode/
│   └── mcp.json                                   # Configuración de Playwright MCP (Entregable 5)
├── Back/
│   ├── postman/
│   │   ├── HabitsUp.postman_collection.json       # Colección Postman v2.1 (CRUD encadenado, JSON Schema, 4xx, DDT)
│   │   ├── HabitsUp.postman_environment.json      # Environment exportado sin credenciales reales
│   │   └── ddt_habitos.json                       # Datos externos para Data Driven Testing (5 filas)
│   ├── scripts/
│   │   └── run-api-tests.js                       # Orquestador de Newman + htmlextra
│   ├── src/                                       # Código fuente de la API REST (Express + Mongoose)
│   └── test/unit/services/                        # Pruebas unitarias Mocha + Chai + Sinon (Entregable 2)
├── Front/
│   └── src/                                       # Aplicación SPA en React 19 + Vite 8 con atributos data-testid
├── e2e/
│   ├── fixtures/testFixtures.js                   # Inyección de Page Objects con test.extend
│   ├── pages/                                     # 6 Page Objects (Landing, Register, Login, Dashboard, HabitoForm, ProfileModal)
│   ├── ia/pruebas-asistidas-ia.spec.js            # Pruebas E2E generadas y revisadas con IA (Entregable 5)
│   ├── auth.setup.js                              # Proyecto de setup con storageState reutilizable
│   ├── flujo1-autenticacion.spec.js               # Flujo crítico 1: Registro, Login y Guardia SPA
│   ├── flujo2-habitos-crud.spec.js                # Flujo crítico 2: CRUD de Hábitos, Negativos y DDT
│   ├── flujo3-progreso-sugerencias.spec.js        # Flujo crítico 3: Progreso y Catálogo de Sugerencias
│   └── accesibilidad.spec.js                      # Pruebas automatizadas con @axe-core/playwright
├── reports/
│   ├── coverage/                                  # Reporte HTML de cobertura unitaria (c8)
│   ├── newman/                                    # Reporte HTML de Newman (newman-reporter-htmlextra)
│   ├── playwright/                                # Reporte HTML de Playwright E2E
│   ├── accessibility/                             # Reporte HTML y JSON de @axe-core/playwright
│   └── lighthouse/                                # Reportes HTML y JSON de Google Lighthouse
├── Plan_Pruebas_Habits_UP.md                      # Entregable 1: Plan de pruebas y matriz de casos
├── Entregable_5_Pruebas_E2E_Asistidas_IA.md       # Entregable 5: Prompts, código IA vs. final y revisión crítica
├── Entregable_6_CI_CD_Rendimiento_Accesibilidad.md# Entregable 6: Pipeline CI/CD, Lighthouse y Accesibilidad
└── playwright.config.js                           # Configuración de Playwright (Chromium + Firefox)
```
