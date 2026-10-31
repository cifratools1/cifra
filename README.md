# Cifra — Herramientas Técnicas Gratuitas y Seguras

> Suite web moderna de utilidades para redes, programación, criptografía, conversión y manipulación de texto.
> 100% Client-Side: todos los cálculos se ejecutan en el navegador mediante JavaScript nativo, Web Crypto API y Web Workers. Tu información nunca sale de tu dispositivo.

Sitio en producción: [https://cifra.tools](https://cifra.tools)

---

## 🛠️ Herramientas Implementadas (11 herramientas activas)

### 🌐 Redes e IP
- **Calculadora de Subredes IPv4 (`/herramientas/calculadora-subredes`)**: Cálculo de red, broadcast, máscara, wildcard, rango de hosts útiles, desglose binario de 32 bits y presets CIDR (/0 a /32).

### 🔢 Conversión de Datos
- **Conversor Binario, Decimal y Hexadecimal (`/herramientas/conversor-binario-decimal-hexadecimal`)**: Conversión bidireccional reactiva entre Base 2, 8, 10 y 16 con soporte para números gigantescos mediante `BigInt` y pasos matemáticos detallados.
- **Codificador y Decodificador Base64 (`/herramientas/codificador-base64`)**: Soporte UTF-8 completo, formato URL-safe, división MIME/PEM y procesamiento local de archivos.
- **Conversor de Unidades de Almacenamiento (`/herramientas/conversor-unidades-almacenamiento`)**: Comparativa SI (Base 10: KB, MB, GB, TB) vs IEC (Base 2: KiB, MiB, GiB, TiB) y cálculo de discrepancia en sistemas operativos.

### 🔒 Seguridad y Criptografía
- **Generador de Contraseñas Seguras (`/herramientas/generador-contrasenas`)**: Generación criptográfica aleatoria mediante `window.crypto.getRandomValues`, cálculo de entropía en bits y barra de fortaleza.
- **Generador de Hashes Criptográficos (`/herramientas/generador-hash`)**: Cálculo simultáneo de MD5, SHA-1, SHA-256 y SHA-512 para texto plano y archivos locales (Drag & Drop), más verificador de checksum.

### 📝 Texto y Contenido
- **Contador de Caracteres y Palabras (`/herramientas/contador-caracteres`)**: Conteo en tiempo real de letras, palabras, oraciones, tiempo de lectura y barras de límites para redes sociales (Twitter, Meta Description, Instagram).
- **Conversor de Mayúsculas y Minúsculas (`/herramientas/conversor-mayusculas-minusculas`)**: 10 transformaciones (MAYÚSCULAS, minúsculas, Title Case, Capitalizar oraciones en español con tildes, kebab-case, snake_case, camelCase).

### ⚙️ Desarrollo Web
- **Formateador y Validador JSON (`/herramientas/formateador-json`)**: Embellecedor con sangría configurable, minificador, validador sintáctico con puntero al error exacto y estadísticas de claves y profundidad.
- **Codificador y Decodificador URL (`/herramientas/codificador-url`)**: Percent-Encoding (RFC 3986), comparador `encodeURI` vs `encodeURIComponent` y desglose de caracteres convertidos.
- **Conversor de Colores (`/herramientas/conversor-colores`)**: Conversión entre HEX, RGB y HSL, paletas armónicas (complementario, análogo, triádico) y verificación de contraste WCAG 2.1 (AA / AAA).

---

## 📚 Centro de Guías (SEO de Contenido)

- `/guias/como-calcular-subredes-ipv4-paso-a-paso`
- `/guias/guia-seguridad-contrasenas-entropia`
- `/guias/diferencia-kb-kib-por-que-mi-disco-tiene-menos-espacio`

## ⚖️ Páginas Institucionales y Cumplimiento

- `/acerca` — Filosofía de privacidad, rendimiento y principios del proyecto.
- `/contacto` — Canales de soporte y reporte de fallos.
- `/privacidad` — Política de privacidad conforme a RGPD y directrices de Google AdSense.
- `/aviso-legal` — Información de titularidad (LSSI-CE).
- `/cookies` — Política de cookies y gestión del consentimiento (TCF v2.2).
- `/editorial` — Metodología de verificación técnica, estándares (RFC, NIST, ISO) y control de calidad.

---

## 🚀 Despliegue en Producción

### Opción A: Despliegue en Vercel (Recomendado)
1. Sube este repositorio a GitHub.
2. Inicia sesión en [Vercel](https://vercel.com) e importa el repositorio.
3. El framework Next.js será detectado automáticamente. Haz clic en **Deploy**.
4. Coste de hosting: **0 €/mes** en el plan Hobby (soporta millones de peticiones estáticas).

### Opción B: Despliegue en Cloudflare Pages
1. Conecta el repositorio de GitHub en el panel de Cloudflare Pages.
2. Comando de construcción: `npx @cloudflare/next-on-pages` o `npm run build`.
3. Directorio de salida: `.vercel/output/static` o `.next`.
4. Coste de hosting: **0 €/mes** con ancho de banda ilimitado.

---

## 💰 Activación de Google AdSense

La plantilla está 100% preparada con los contenedores y espacios publicitarios aprobados por las directrices de Google:

1. **Obtener la aprobación de AdSense**:
   - Compra un dominio propio (ej. `cifra.tools` o `cifra-tools.com` por ~10-15 €/año).
   - Despliega la web y espera a tenerla indexada en Google con visitas orgánicas durante 3 a 5 semanas.
   - Solicita la cuenta en [Google AdSense](https://www.google.com/adsense/).

2. **Vincular el script de AdSense**:
   - Abre `src/app/layout.tsx`.
   - Localiza la sección de AdSense en el `<head>` y descomenta la etiqueta `<script>` reemplazando `ca-pub-XXXXXXXXXX` con tu ID de editor real:
   ```tsx
   <script
     async
     src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1234567890123456"
     crossOrigin="anonymous"
   />
   ```

3. **Ubicaciones de bloques de anuncios ya preparadas**:
   - `id="cifra-ad-top"`: Banner superior no invasivo (debajo del título y antes de la herramienta).
   - `id="cifra-ad-mid"`: Bloque contextual (entre la herramienta y la sección didáctica).
   - `id="cifra-ad-bottom"`: Bloque inferior antes de herramientas relacionadas.

---

## 📈 Configuración de Google Search Console y Analytics

1. Abre [Google Search Console](https://search.google.com/search-console).
2. Añade tu propiedad de dominio `cifra.tools`.
3. Envía el sitemap: `https://cifra.tools/sitemap.xml`.
4. Para Google Analytics 4 (opcional):
   - Abre `src/app/layout.tsx`.
   - Descomenta las líneas del script de Google Tag Manager reemplazando `G-XXXXXXXXXX` por tu ID de medición.

---

## 💻 Desarrollo Local

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo en http://localhost:3000
npm run dev

# Compilar para producción (SSG estático)
npm run build

# Probar la build de producción
npm start
```
