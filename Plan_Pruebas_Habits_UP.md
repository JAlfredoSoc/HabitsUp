# Entregable 1: Plan de pruebas y diseño de casos
**Proyecto:** Habits UP  
**Asignatura:** Ingeniería de Pruebas Automatizadas  
**Institución:** Universidad Popular del Cesar (UPC)  

---

## Paso 1: Sistema, arquitectura, stack y roles

### Descripción del sistema

Habits UP es una aplicación web diseñada para que los usuarios gestionen y den seguimiento a sus hábitos personales mediante metas periódicas y progreso cuantificable. El sistema permite:
- Autenticación y gestión de perfil de usuario.
- Consulta de categorías predefinidas y catálogo de sugerencias de hábitos.
- Creación, personalización, edición, clonación y eliminación de hábitos.
- Registro y actualización interactiva del progreso (diario, semanal, mensual).
- Visualización de historial de cumplimiento y estadísticas de rendimiento.

**Alcance de pruebas:**  
El alcance de este plan cubre los flujos funcionales expuestos por el código del backend y frontend: gestión de cuentas de usuario, catálogo de categorías/sugerencias, administración de hábitos y reglas de progreso. Las funcionalidades complementarias (historial, estadísticas y notificaciones) se integran mediante pruebas con dobles/mocks controlados para garantizar reproducibilidad sin efectos secundarios externos.

### Arquitectura

La aplicación implementa una arquitectura desacoplada cliente-servidor:

```
[ Navegador Web ]
       │
       ▼ (HTTP / JSON - Axios)
[ Frontend SPA (React 19 + Vite 8) ]
       │
       ▼ (Peticiones REST + CORS)
[ API REST (Node.js + Express 5) ]
       │
       ├─► [ Enrutadores y Controladores ]
       ├─► [ Capa de Servicios y Estrategias (Progreso / Proxy) ]
       └─► [ Modelos Mongoose ]
                 │
                 ▼
          [ MongoDB Atlas ]
```

1. **Frontend SPA:** Aplicación de una sola página en React 19. Gestiona las vistas y navegación mediante `react-router-dom` v7 y realiza peticiones asíncronas HTTP a la API REST mediante `axios`.
2. **API REST:** Servidor en Node.js con Express 5. Expone rutas modulares (`usuario.routes.js`, `habito.routes.js`), delega la orquestación a controladores y encapsula la lógica de negocio en servicios (patrones Strategy y Proxy para cálculo de progreso).
3. **Persistencia:** Base de datos NoSQL MongoDB accedida a través de Mongoose 8. Define esquemas para usuarios, hábitos, categorías, progreso, historial, sugerencias y notificaciones.
4. **Seguridad y Comunicación:** Comunicación vía JSON sobre HTTP con políticas de CORS. Cifrado unidireccional de contraseñas mediante `bcrypt`.

### Stack tecnológico y herramientas de prueba

| Componente | Tecnología / Librería | Versión declarada | Propósito |
|---|---|---|---|
| Frontend | React, Vite, React Router, Axios | React 19, Vite 8, RR 7, Axios 1.13 | Interfaz de usuario SPA |
| Backend | Node.js, Express, Mongoose | Node 20+, Express 5.2, Mongoose 8.23 | API REST y persistencia |
| Seguridad | bcrypt | 6.0.0 | Hashing seguro de contraseñas |
| Pruebas Unitarias | Mocha, Chai, Sinon / Supertest | Última LTS | Ejecución de pruebas unitarias aisladas y aserciones BDD |
| Pruebas de API | Postman y Newman | v10+ / Newman CLI | Pruebas de contrato, integración API y Data-Driven Testing (DDT) |
| Pruebas E2E | Playwright | v1.40+ | Automatización funcional E2E con Page Object Model (POM) |
| Accesibilidad y Calidad Web | @axe-core/playwright, Lighthouse | Última LTS | Auditoría automatizada de accesibilidad (WCAG) y rendimiento web |
| Integración Continua (CI) | GitHub Actions | Workflows YAML | Pipeline automatizado en cada Push y Pull Request |

### Roles y responsabilidades del equipo

| Integrante | Responsabilidad Principal | Participación en el Ciclo de Vida (SDLC) |
|---|---|---|
| **Jose Alfredo Maestre Manjarrez** | Liderar el plan de pruebas y automatizar la suite de pruebas unitarias. | - Diseño del plan de pruebas, definición de alcance y criterios.<br>- Automatización de pruebas unitarias en backend con Mocha/Chai bajo enfoque AAA.<br>- Medición y reporte de cobertura de código.<br>- Revisión cruzada de la suite API.<br>- Gestión y cierre de defectos unitarios. |
| **Ismael Jose Peñaloza Ortiz** | Automatizar las pruebas de API (Postman/Newman) y pruebas E2E (Playwright). | - Diseño de colecciones Postman, aserciones y suites Newman con DDT.<br>- Implementación de pruebas E2E en Playwright aplicando Page Object Model (POM).<br>- Revisión cruzada de pruebas unitarias.<br>- Configuración de reportes de ejecución API y E2E.<br>- Gestión y cierre de defectos funcionales. |
| **Ambos (Equipo Conjunto)** | Calidad integral, integración y entrega. | - Revisión continua de pull requests.<br>- Integración del pipeline en GitHub Actions.<br>- Ejecución de auditorías de accesibilidad y rendimiento (Lighthouse/axe).<br>- Consolidación del informe final de pruebas y preparación de sustentación. |

---

## Paso 2: Estrategia de pruebas y pirámide

### Alcance y estrategia

La estrategia adopta la **Pirámide de Pruebas** (Mike Cohn) para garantizar una base amplia de pruebas unitarias rápidas y económicas, un nivel intermedio de integración/API que valide contratos y flujos CRUD, y una cúspide selecta de pruebas E2E que valide la experiencia de usuario final, evitando el antipatrón del "cono de helado" (*ice cream cone*).

```
         /\
        /  \     E2E / Playwright (8+ escenarios críticos)
       /----\
      /      \   Integración & API / Postman & Newman (17+ requests CRUD + negativos)
     /--------\
    /          \ Pruebas Unitarias / Mocha & Chai (15+ pruebas de lógica de negocio)
   --------------
```

| Nivel | Herramienta | Enfoque y Propósito | Meta Mínima de Diseño |
|---|---|---|---:|
| **Unitaria** | Mocha + Chai | Pruebas de caja blanca y caja negra aisladas sobre reglas de progreso (`ProgresoDiario`, `ProgresoSemanal`, `ProgresoMensual`), validaciones de usuario, cifrado y operaciones de hábitos sin tocar base de datos real. | **15 pruebas unitarias** en al menos 3 módulos de negocio |
| **Integración / API** | Postman + Newman | Validación de endpoints HTTP, verificación de códigos de respuesta (`2xx`, `4xx`), validación de esquemas JSON (contratos), flujos CRUD encadenados y pruebas parametrizadas (DDT). | **12+ requests CRUD** y **5+ escenarios negativos** |
| **Sistema / E2E** | Playwright (POM) | Simulación de flujos de usuario real en navegador Chromium: registro, login, validación visual de formularios, creación, edición, progreso y eliminación de hábitos. | **8+ escenarios** en 3 flujos críticos (al menos 2 negativos) |
| **Aceptación** | Playwright | Verificación de criterios de aceptación de usuario (UAT) embebidos en los escenarios E2E. | Cubierto en la suite E2E (sin duplicar conteo) |

#### Pirámide: Línea base y metas cuantitativas

| Nivel de Prueba | Línea Base Actual (Pruebas Automatizadas Existentes) | Meta de Diseño (Plan) | Criterio de Éxito / Parada |
|---|---:|---:|---|
| **Unitaria** | 0 pruebas con aserciones | 15 pruebas | 100% aprobadas, cobertura >= 70% en módulos probados |
| **Integración / API** | 0 con aserciones automatizadas identificadas | 17 requests (12 CRUD + 5 negativos) | 100% aprobadas en Newman; contratos JSON válidos |
| **Data Driven Testing (DDT)** | 0 ejecuciones parametrizadas | 1 request con >= 5 iteraciones de datos | 5/5 iteraciones exitosas con datos sintéticos |
| **Sistema / E2E** | 0 escenarios Playwright | 8 escenarios (6 positivos + 2 negativos) | 100% aprobados en modo headless |
| **Accesibilidad & Web** | 0 auditorías automatizadas | 3 vistas clave auditadas con axe/Lighthouse | Reporte de hallazgos sin violaciones críticas WCAG A/AA |

### Tipos de prueba a ejecutar

- **Pruebas Funcionales:** Verificación del comportamiento del sistema respecto a los requerimientos de gestión de usuarios y hábitos.
- **Pruebas de Humo (Smoke Testing):** Comprobación rápida de disponibilidad básica (`GET /health` y carga de categorías) antes de iniciar suites pesadas.
- **Pruebas Negativas:** Validación de manejo robusto de excepciones (entradas vacías, correos duplicados, identificadores inexistentes, contraseñas erróneas) verificando respuestas `400`, `401`, `403`, `404` o `409` sin caídas del servidor (`500`).
- **Pruebas de Contrato:** Validación estricta de estructura y tipos de datos del JSON devuelto mediante esquemas en Postman (`tv4` / `ajv`).
- **Data Driven Testing (DDT):** Ejecución parametrizada de creación de hábitos con al menos 5 combinaciones distintas de periodos, metas y frecuencias leídas desde un archivo de datos.
- **Pruebas de Rendimiento Básico:** Umbrales máximos admisibles: peticiones de lectura < 500 ms; escrituras < 1000 ms en entorno de pruebas local.
- **Pruebas de Accesibilidad y Rendimiento Frontend:** Evaluación automatizada con axe-core y Lighthouse en tres vistas clave: Inicio (`/`), Modal de Registro/Login y Panel Principal (`/panel-principal`).

### Criterios de entrada y salida (Entry & Exit Criteria)

#### Criterios de Entrada (Entry Criteria)
1. Repositorio de código con rama base estable.
2. Base de datos `habitsUp_Test` aprovisionada y accesible con credenciales de prueba.
3. Dependencias de desarrollo (`npm install`) instaladas correctamente tanto en `Back` como en `Front`.
4. Suite de pruebas configurada con scripts de ejecución unificados en `package.json`.

#### Criterios de Salida (Exit Criteria)
1. 100% de los casos de prueba diseñados automatizados y ejecutados.
2. Tasa de aprobación mínima del 95% en la suite general, con 0 defectos de severidad Crítica o Bloqueante abiertos.
3. Cobertura de código unitaria mínima del 70% en los módulos de lógica de negocio seleccionados.
4. Ejecución exitosa del pipeline de integración continua (CI) en GitHub Actions en verde.

### Técnicas de diseño de casos aplicadas

Para la derivación de los casos de prueba se aplican formalmente las siguientes técnicas:
1. **Partición de Equivalencia (PE):** División del dominio de entrada en clases válidas e inválidas (ej. formatos de email, rangos de frecuencia de hábitos, roles).
2. **Análisis de Valores Límite (AVL / BVA):** Prueba de los extremos en entradas numéricas y límites de progreso (ej. meta de frecuencia 0, 1, límite máximo, superación del límite).
3. **Pruebas de Transición de Estados:** Verificación de cambios de estado del hábito y su progreso (pendiente → completado → reiniciado al clonar).
4. **Pruebas Basadas en Casos de Uso / Flujos:** Validación de caminos felices y alternativos en la interacción del usuario de punta a punta.

---

## Paso 3: Entorno, datos y política de limpieza

### Entornos de ejecución

| Entorno | Componentes y URLs | Base de Datos | Propósito |
|---|---|---|---|
| **Desarrollo Local** | Frontend: `http://localhost:5173`<br>API Backend: `http://localhost:3000` | MongoDB Atlas (Cluster dev) | Desarrollo activo y pruebas manuales exploratorias. |
| **Pruebas Automatizadas** | Frontend: `http://localhost:5173`<br>API Backend: `http://localhost:3000` | MongoDB Atlas (`habitsUp_Test`) | Ejecución de suites Mocha, Newman y Playwright en entorno aislado. |
| **Integración Continua (CI)** | Runner Ubuntu en GitHub Actions | MongoDB Service Container / Atlas Test | Ejecución automatizada en cada Pull Request sin intervención manual. |

### Configuración de variables de entorno

Las pruebas automatizadas requerirán un archivo `.env.test` específico en el backend para evitar colisiones con el entorno de desarrollo:

```env
PORT=3000
NODE_ENV=test
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/habitsUp_Test?retryWrites=true&w=majority
JWT_SECRET=secret_key_de_pruebas_automatizadas_upc_2026
```

> [!WARNING]
> Ninguna credencial productiva, clave de servicio ni URI real de base de datos se almacena en el repositorio de código ni en este documento. Se gestionan como secretos cifrados en GitHub Actions (`Secrets and variables`).

### Datos de prueba y semillas (Seeding)

1. **Categorías del sistema:** Se precargan las 6 categorías requeridas por el frontend: `Salud`, `Bienestar`, `Estudio`, `Productividad`, `Trabajo`, `Relaciones`.
2. **Sugerencias de hábitos:** Se precargan al menos 3 sugerencias representativas (ej. "Beber 2L de agua", "Lectura diaria", "Meditación").
3. **Usuarios sintéticos:** Todos los usuarios de prueba utilizarán el dominio de prueba reservado `@example.test` con identificadores únicos basados en timestamp (`test_user_<timestamp>@example.test`) para garantizar unicidad e idempotencia.
4. **Mocks de Notificaciones:** Los adaptadores de Email y Telegram se configuran con implementaciones mock o dobles de prueba para asegurar que **nunca se envíen correos ni mensajes externos reales** durante las pruebas.

### Política de limpieza y seguridad

1. **Aserción de seguridad de base de datos:** Antes de cualquier operación de limpieza o inserción, el script de setup de pruebas verifica mediante código que el nombre de la base de datos conectada sea estrictamente `habitsUp_Test`. Si la base contiene otro nombre (ej. `habitsUp`, `production`, `admin`), el proceso se aborta inmediatamente con excepción de seguridad.
2. **Ciclo Before/After:**
   - **BeforeAll / Global Setup:** Limpieza de colecciones de prueba e inserción de semillas de categorías y sugerencias.
   - **AfterAll / Teardown:** Vaciado de colecciones de usuarios, hábitos, historiales y progresos creados durante la corrida de pruebas, dejando la base en estado limpio de referencia.

---

## Paso 4: Matriz de casos de prueba

> **Convenciones de Técnica:** **PE** = Partición de Equivalencia | **AVL** = Análisis de Valores Límite | **CU** = Caso de Uso / Flujo | **ERR** = Manejo de Error / Prueba Negativa.  
> **Nota de Rutas:** Los casos `CP-19` a `CP-33` y `CP-41` contemplan los endpoints vigentes de la API (`/RegistroUsuario`, `/IniciarSesion`, `/CrearHabitos`, `/ObtenerCategoria`, `/ActualizarProgreso/:habitoId`, `/clonar/:habitoId`, `/editar/:habitoId`, `/eliminar/:habitoId`, `/ObtenerHabitos/:usuarioID`, `/health`) junto con las mejoras planificadas de autorización y endpoints complementarios acordados (`GET /usuario/:id`, `DELETE /usuario/:id`, `GET /habito/:id`).

### Bloque 1: Pruebas Unitarias (Mocha + Chai) — Meta: 15 casos mínimos

| ID | Módulo / Clase | Descripción | Técnica | Precondiciones | Pasos y Datos (AAA) | Resultado Esperado | Nivel | Prior. |
|---|---|---|:---:|---|---|---|:---:|:---:|
| **CP-01** | `ProgresoDiario` | Calcular límite máximo de progreso para hábito diario | PE | Módulo `ProgresoDiario.js` cargado | **Arrange:** Instanciar estrategia con frecuencia = 3.<br>**Act:** Invocar `calcularLimite()`.<br>**Assert:** Verificar retorno. | Retorna exactamente `3`. | Unitaria | Alta |
| **CP-02** | `ProgresoSemanal` | Calcular límite máximo para hábito semanal ignorando frecuencia diaria | PE | Módulo `ProgresoSemanal.js` cargado | **Arrange:** Instanciar estrategia con frecuenciaSemanal = 5, frecuenciaDiaria = 2.<br>**Act:** Invocar `calcularLimite()`.<br>**Assert:** Verificar retorno. | Retorna `5` (respeta la frecuencia semanal). | Unitaria | Alta |
| **CP-03** | `ProgresoMensual` | Calcular límite para hábito mensual | PE | Módulo `ProgresoMensual.js` cargado | **Arrange:** Instanciar con frecuenciaMensual = 12.<br>**Act:** Invocar `calcularLimite()`.<br>**Assert:** Verificar valor. | Retorna `12`. | Unitaria | Media |
| **CP-04** | `ProgresoBridge` | Lanzar excepción ante periodicidad de progreso no soportada | ERR | Módulo `ProgresoBridge.js` cargado | **Arrange:** Enviar periodicidad `"anual"` o inválida.<br>**Act:** Invocar resolución de estrategia.<br>**Assert:** Capturar excepción arrojada. | Lanza `Error("Periodo no soportado")` controlado; no genera estado inválido. | Unitaria | Alta |
| **CP-05** | `ProgresoProxy` | Permitir incremento de progreso cuando el valor actual es menor que la meta | AVL | Progreso actual = 2, meta = 3 | **Arrange:** Progreso con valor 2.<br>**Act:** Ejecutar `incrementarProgreso()`.<br>**Assert:** Inspeccionar nuevo valor. | Progreso incrementa a `3` y retorna éxito. | Unitaria | Alta |
| **CP-06** | `ProgresoProxy` | Bloquear incremento de progreso en el valor límite (límite alcanzado) | AVL | Progreso actual = 3, meta = 3 | **Arrange:** Progreso con valor 3 igual a la meta.<br>**Act:** Ejecutar `incrementarProgreso()`.<br>**Assert:** Verificar que no aumente. | El valor se mantiene en `3`; se emite mensaje de meta ya alcanzada. | Unitaria | Alta |
| **CP-07** | Validador Usuario | Rechazar registro cuando el correo electrónico no tiene formato válido | PE / ERR | Validador de formato de usuario | **Arrange:** Objeto usuario con email `"usuario-invalido"`.<br>**Act:** Ejecutar `validarFormatoUsuario()`.<br>**Assert:** Inspeccionar resultado. | Retorna `valido: false` indicando error de sintaxis de correo. | Unitaria | Alta |
| **CP-08** | Validador Usuario | Rechazar registro cuando la contraseña no cumple longitud mínima | AVL / ERR | Regla de contraseña >= 6 caracteres | **Arrange:** Contraseña con 5 caracteres (`"12345"`).<br>**Act:** Ejecutar `validarPassword()`.<br>**Assert:** Inspeccionar error. | Retorna `valido: false` con mensaje de longitud insuficiente. | Unitaria | Alta |
| **CP-09** | Validador Usuario | Aceptar contraseña en el valor límite inferior exacto | AVL | Regla de contraseña >= 6 caracteres | **Arrange:** Contraseña con 6 caracteres (`"Abc123"`).<br>**Act:** Ejecutar `validarPassword()`.<br>**Assert:** Inspeccionar resultado. | Retorna `valido: true` sin errores. | Unitaria | Media |
| **CP-10** | Validador Usuario | Rechazar registro cuando la edad es negativa o un valor no numérico | AVL / ERR | Regla edad > 0 | **Arrange:** Objeto usuario con edad `-1` o `"veinte"`.<br>**Act:** Ejecutar `validarEdad()`.<br>**Assert:** Inspeccionar respuesta. | Retorna `valido: false` con error de edad no permitida. | Unitaria | Media |
| **CP-11** | Seguridad / bcrypt | Generar hash seguro y no almacenar contraseña en texto plano | PE | Librería `bcrypt` disponible | **Arrange:** Password `"Secreta123!"`.<br>**Act:** Ejecutar hashing asíncrono.<br>**Assert:** Comparar hash vs texto original. | El hash es distinto al texto plano y `bcrypt.compare` retorna `true`. | Unitaria | Alta |
| **CP-12** | Modelo Hábito | Rechazar creación de hábito si falta el nombre o la categoría | ERR | Esquema/Validador de Hábito | **Arrange:** Hábito omitiendo campo `nombre`.<br>**Act:** Validar esquema.<br>**Assert:** Inspeccionar errores. | Falla la validación con mensaje de campo obligatorio requerido. | Unitaria | Alta |
| **CP-13** | Servicio Hábito | Reiniciar contadores de progreso al clonar un hábito existente | Transición | Hábito origen con progreso = 5 | **Arrange:** Objeto hábito con progreso acumulado.<br>**Act:** Ejecutar función lógica `prepararClonacion()`.<br>**Assert:** Verificar campos del clon. | El nuevo hábito tiene progreso en `0`, conservando nombre y categoría. | Unitaria | Alta |
| **CP-14** | `EmailAdapter` | Formatear correctamente el asunto y cuerpo de notificación por correo | PE | `EmailAdapter` con mock de transporte | **Arrange:** Mensaje `"Recordatorio de hábito"`, destinatario válido.<br>**Act:** Ejecutar `construirEmail()`.<br>**Assert:** Verificar estructura generada. | Retorna objeto con remitente, destinatario y cuerpo HTML estructurado. | Unitaria | Media |
| **CP-15** | `TelegramAdapter` | Rechazar envío de notificación si el usuario no tiene configurado `chatId` | ERR | `TelegramAdapter` aislado | **Arrange:** Usuario con campo `telegramChatId: null`.<br>**Act:** Invocar `enviarNotificacion()`.<br>**Assert:** Inspeccionar excepción controlada. | Retorna error controlado indicando ausencia de identificador de chat. | Unitaria | Media |

---

### Bloque 2: Pruebas de Integración y API (Postman / Newman) — Meta: 18 casos

| ID | Endpoint y Método | Descripción del Escenario | Técnica | Datos y Condiciones | Resultado Esperado | Nivel | Prior. |
|---|---|---|:---:|---|---|:---:|:---:|
| **CP-16** | `GET /health` | Verificar disponibilidad y estado operativo del backend | Humo | Servidor backend en ejecución | Status `200 OK`, JSON `{ status: "ok", timestamp: ... }`. | Humo API | Alta |
| **CP-17** | `GET /ObtenerCategoria` | Consultar catálogo de categorías para poblar formularios | Contrato | Categorías sembradas en base de datos de pruebas | Status `200 OK`, arreglo con 6 categorías, cada una con `_id` y `nombre`. | Integración | Alta |
| **CP-18** | `GET /ObtenerSugerencias` | Consultar lista de hábitos sugeridos predefinidos | Integración | Sugerencias sembradas en `habitsUp_Test` | Status `200 OK`, lista de sugerencias con campos de descripción y periodicidad. | Integración | Media |
| **CP-19** | `POST /RegistroUsuario` | Registrar exitosamente una nueva cuenta de usuario | CU / PE | Body JSON con nombre, apellido, correo único `@example.test`, edad y contraseña | Status `201 Created`, usuario creado; respuesta no expone la contraseña ni su hash. | API | Alta |
| **CP-20** | `POST /RegistroUsuario` | Rechazar registro cuando se omite un campo obligatorio | ERR | Body JSON omitiendo campo `email` | Status `400 Bad Request`, mensaje indicando campo faltante, ningún registro insertado. | API Negativa | Alta |
| **CP-21** | `POST /RegistroUsuario` | Rechazar registro cuando el correo ya existe en el sistema | ERR / AVL | Correo previamente registrado en CP-19 | Status `409 Conflict`, mensaje de correo duplicado, el usuario original no sufre cambios. | API Negativa | Alta |
| **CP-22** | `POST /IniciarSesion` | Iniciar sesión exitosamente con credenciales válidas | CU | Correo y contraseña correctos del usuario creado | Status `200 OK`, retorna datos de sesión / token de acceso; no expone credenciales. | API | Alta |
| **CP-23** | `POST /IniciarSesion` | Rechazar inicio de sesión con contraseña incorrecta | ERR | Correo válido con contraseña errónea | Status `401 Unauthorized`, mensaje genérico de credenciales inválidas. | API Negativa | Alta |
| **CP-24** | `GET /usuario/:id` | Consultar perfil propio con autenticación válida | CU | ID de usuario y encabezado de autorización válido | Status `200 OK`, JSON con nombre, apellido, correo y perfil sin credenciales sensibles. | API | Alta |
| **CP-25** | `GET /usuario/:id` | Rechazar consulta de perfil sin token de autorización | ERR | Petición sin encabezado `Authorization` | Status `401 Unauthorized`, mensaje de autenticación requerida. | API Negativa | Alta |
| **CP-26** | `GET /usuario/:id` | Impedir que un usuario autenticado consulte el perfil de otro | ERR | Token de usuario A solicitando ID de usuario B | Status `403 Forbidden`, acceso denegado; no se exponen datos del usuario B. | API Negativa | Alta |
| **CP-27** | `PUT /EditarUsuario/:id` | Actualizar datos del perfil propio (nombre y teléfono) | CU | Token del propietario y campos actualizados en Body | Status `200 OK`, datos actualizados persistidos, campos omitidos intactos. | API | Alta |
| **CP-28** | `POST /CrearHabitos` | Crear un nuevo hábito válido asociado al usuario | CU | Token válido, nombre, categoría existente, horario, periodo diario y frecuencia = 2 | Status `201 Created`, hábito creado y vinculado al usuario con registro de progreso inicial. | API | Alta |
| **CP-29** | `GET /ObtenerHabitos/:usuarioID` | Listar todos los hábitos pertenecientes a un usuario | CU | ID del usuario con hábitos creados previamente | Status `200 OK`, arreglo con los hábitos del usuario y sus respectivos progresos. | API | Alta |
| **CP-30** | `PUT /ActualizarProgreso/:habitoId` | Incrementar progreso de un hábito dentro del límite | Transición | ID de hábito con progreso menor a la meta | Status `200 OK`, progreso incrementado en 1 unidad; persiste en MongoDB. | API | Alta |
| **CP-31** | `POST /clonar/:habitoId` | Clonar un hábito existente para duplicar su estructura | CU | ID del hábito original del usuario | Status `201 Created`, nuevo hábito creado con mismos parámetros pero progreso en 0. | API | Media |
| **CP-32** | `PUT /editar/:habitoId` | Editar nombre y horario de un hábito propio | CU | ID de hábito propio y nuevos valores en body | Status `200 OK`, cambios guardados; el histórico de progreso previo se conserva. | API | Alta |
| **CP-33** | `DELETE /eliminar/:habitoId` | Eliminar un hábito propio y limpiar sus dependencias | CU | ID de hábito propio existente | Status `200 OK`, hábito removido; consultas posteriores devuelven `404`. | API | Alta |
| **CP-34** | `GET /habito/:id` | Rechazar consulta de hábito con identificador inexistente | ERR | ID sintético inexistente en formato ObjectId válido | Status `404 Not Found`, mensaje de recurso no encontrado, sin caída del servidor (`500`). | API Negativa | Alta |
| **CP-35** | `DELETE /usuario/:id` | Eliminar cuenta de usuario en cascada (datos asociados) | CU | Token y ID del usuario propio | Status `200 OK`, usuario, hábitos y progresos asociados quedan eliminados de la base. | API | Alta |
| **CP-36** | `POST /CrearHabitos` (DDT) | Crear hábitos masivamente mediante Data Driven Testing | PE / DDT | Archivo JSON con 5 conjuntos de prueba (diario, semanal, mensual, límites mín/máx) | Las 5 iteraciones retornan `201 Created` con validación de aserciones por cada fila. | DDT API | Media |

---

### Bloque 3: Pruebas de Sistema y E2E (Playwright) — Meta: 11 escenarios

| ID | Flujo del Sistema | Descripción del Escenario E2E | Técnica | Precondiciones | Pasos de Usuario | Resultado Esperado | Nivel | Prior. |
|---|---|---|:---:|---|---|---|:---:|:---:|
| **CP-37** | Registro | Validación visual de campos requeridos y errores en formulario | ERR | Frontend abierto en navegador, usuario anónimo | 1. Abrir modal/página de registro.<br>2. Intentar enviar con campos vacíos o edad inválida. | Se muestran mensajes de validación bajo los campos; el formulario no se envía. | E2E Negativa | Alta |
| **CP-38** | Registro | Flujo completo de registro exitoso de nuevo usuario | CU | Datos de usuario con email único `@example.test` | 1. Completar nombre, apellido, correo, edad y password.<br>2. Clic en "Registrarse". | Mensaje de éxito visible; redirección automática u opción para iniciar sesión. | E2E | Alta |
| **CP-39** | Login | Iniciar sesión exitosamente y acceder al panel principal | CU | Cuenta válida creada en CP-38 | 1. Abrir modal de login.<br>2. Digitar correo y password.<br>3. Clic en "Ingresar". | Redirección a `/panel-principal`; la barra de navegación muestra el nombre del usuario. | E2E | Alta |
| **CP-40** | Login | Rechazar inicio de sesión ante credenciales inválidas | ERR | Cuenta de prueba existente | 1. Ingresar correo válido con contraseña incorrecta.<br>2. Clic en "Ingresar". | Alerta visible de credenciales incorrectas; el usuario permanece en el login. | E2E Negativa | Alta |
| **CP-41** | Seguridad SPA | Bloquear acceso al panel principal a usuarios no autenticados | ERR | Almacenamiento local (localStorage/sessionStorage) limpio | 1. Navegar directamente en barra de direcciones a `/panel-principal`. | Guardia de ruta intercepta y redirige a la vista inicial `/` o login sin mostrar datos. | E2E Negativa | Alta |
| **CP-42** | Hábitos | Crear un nuevo hábito desde el formulario del panel | CU | Sesión activa en `/panel-principal` | 1. Clic en "Nuevo Hábito".<br>2. Ingresar nombre, categoría, horario y periodicidad.<br>3. Guardar. | El formulario se cierra y la nueva tarjeta de hábito aparece en la lista activa. | E2E | Alta |
| **CP-43** | Hábitos | Validación en interfaz ante creación de hábito con campos incompletos | ERR | Sesión activa en modal de creación | 1. Clic en guardar sin ingresar nombre ni categoría. | La interfaz resalta en rojo los campos obligatorios y bloquea el envío. | E2E Negativa | Media |
| **CP-44** | Progreso | Actualizar e incrementar el progreso de un hábito desde su tarjeta | Transición | Tarjeta de hábito visible con meta pendiente | 1. Localizar tarjeta del hábito.<br>2. Clic en botón "Completar / +1". | La barra o contador de progreso se incrementa visualmente; persiste tras recargar página (F5). | E2E | Alta |
| **CP-45** | Hábitos | Editar el nombre y horario de un hábito existente | CU | Tarjeta de hábito visible en el panel | 1. Clic en icono de edición.<br>2. Cambiar nombre del hábito.<br>3. Guardar cambios. | La tarjeta actualiza inmediatamente el nombre mostrado y conserva el historial previo. | E2E | Media |
| **CP-46** | Hábitos | Eliminar un hábito con confirmación del usuario | CU | Tarjeta de hábito de prueba creada | 1. Clic en "Eliminar".<br>2. Confirmar en el diálogo modal de confirmación. | La tarjeta se remueve de la pantalla; no vuelve a aparecer tras refrescar el navegador. | E2E | Media |
| **CP-47** | Sugerencias | Adoptar un hábito predefinido desde el catálogo de sugerencias | CU | Sesión activa, sugerencias disponibles | 1. Abrir pestaña/sección de "Sugerencias".<br>2. Seleccionar "Agregar Hábito" en una sugerencia. | El hábito se importa al panel del usuario con los valores de la sugerencia seleccionada. | E2E | Media |

---

## Paso 5: Resumen y trazabilidad de la pirámide

Con este diseño ampliado y riguroso, la matriz de casos cumple con total consistencia las metas cuantitativas y de cobertura requeridas para el Entregable 1:

| Nivel | Meta Mínima Declarada | Casos Diseñados en la Matriz | IDs Asociados | Estado de Diseño |
|---|:---:|:---:|:---:|:---:|
| **Unitarias** | 15 pruebas en >= 3 módulos | **15 casos** | CP-01 al CP-15 | Diseñado al 100% |
| **Integración / API** | 12 CRUD + 5 negativos | **21 casos** (15 funcionales/CRUD + 5 negativos + 1 DDT) | CP-16 al CP-36 | Diseñado al 100% |
| **Sistema / E2E** | 8 escenarios (>= 2 negativos) | **11 escenarios** (8 positivos + 3 negativos) | CP-37 al CP-47 | Diseñado al 100% |
| **Total General** | **35 casos mínimos** | **47 casos diseñados** | **CP-01 a CP-47** | **Completo y balanceado** |

> **Nota para los siguientes entregables:**  
> En el Entregable 2 se automatizarán las pruebas unitarias (Mocha/Chai) y de API (Postman/Newman) ejecutando esta matriz sobre el entorno `habitsUp_Test`, reportando la tasa real de aprobación/fallo y cobertura de código. En el Entregable 3 se automatizarán los flujos E2E con Playwright (POM) y la integración continua en GitHub Actions.
