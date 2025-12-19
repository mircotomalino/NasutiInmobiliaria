# Guía de Verificación SEO

Esta guía describe cómo verificar la implementación SEO del sitio web usando herramientas externas.

## 1. Google Rich Results Test

**URL:** https://search.google.com/test/rich-results

**Pasos:**
1. Ingresa la URL de una página del sitio (ej: `https://inmobiliarianasuti.com.ar/`)
2. Haz clic en "Test URL"
3. Verifica que todos los schemas JSON-LD sean detectados correctamente:
   - LocalBusiness / RealEstateAgent
   - Organization
   - Product (en páginas de propiedades)
   - CollectionPage (en catálogo)
   - BreadcrumbList

**Qué verificar:**
- ✅ Todos los schemas aparecen como válidos
- ✅ No hay errores de sintaxis
- ✅ Los datos estructurados se muestran correctamente

---

## 2. Google Search Console

**URL:** https://search.google.com/search-console

**Pasos para verificar el sitio:**
1. Ingresa a Google Search Console
2. Agrega la propiedad del sitio: `https://inmobiliarianasuti.com.ar`
3. Verifica la propiedad usando uno de estos métodos:
   - **Meta tag:** Descomenta y agrega el código en `index.html`
   - **Archivo HTML:** Sube el archivo de verificación
   - **DNS:** Agrega registro TXT en el DNS

**Después de verificar:**
- Envía el sitemap: `https://inmobiliarianasuti.com.ar/sitemap.xml`
- Revisa el reporte de cobertura de indexación
- Verifica que las páginas se estén indexando correctamente

---

## 3. Bing Webmaster Tools

**URL:** https://www.bing.com/webmasters

**Pasos:**
1. Ingresa a Bing Webmaster Tools
2. Agrega tu sitio
3. Verifica usando el meta tag (descomenta en `index.html`)
4. Envía el sitemap: `https://inmobiliarianasuti.com.ar/sitemap.xml`

---

## 4. PageSpeed Insights

**URL:** https://pagespeed.web.dev/

**Pasos:**
1. Ingresa la URL del sitio
2. Ejecuta el análisis para móvil y escritorio
3. Revisa las métricas Core Web Vitals:
   - LCP (Largest Contentful Paint)
   - FID (First Input Delay)
   - CLS (Cumulative Layout Shift)

**Objetivos:**
- LCP: < 2.5s
- FID: < 100ms
- CLS: < 0.1

---

## 5. Lighthouse (Chrome DevTools)

**Pasos:**
1. Abre Chrome DevTools (F12)
2. Ve a la pestaña "Lighthouse"
3. Selecciona "SEO" y "Performance"
4. Haz clic en "Generate report"

**Qué revisar:**
- Puntuación SEO: Debe ser 90+
- Verifica que todos los elementos SEO estén presentes:
  - Meta description
  - Canonical URL
  - Structured data
  - Robots.txt
  - Sitemap

---

## 6. Schema Markup Validator

**URL:** https://validator.schema.org/

**Pasos:**
1. Ingresa la URL o pega el código JSON-LD
2. Verifica que los schemas sean válidos según Schema.org

---

## Checklist de Verificación

### Meta Tags
- [ ] Title tags únicos en cada página
- [ ] Meta descriptions (120-160 caracteres)
- [ ] Canonical URLs configuradas
- [ ] Open Graph tags presentes
- [ ] Twitter Cards configuradas
- [ ] Robots meta tag correcto

### Structured Data
- [ ] LocalBusiness/RealEstateAgent en landing
- [ ] Organization schema en landing
- [ ] Product schema en páginas de propiedades
- [ ] CollectionPage en catálogo
- [ ] BreadcrumbList en todas las páginas relevantes

### Archivos Técnicos
- [ ] `robots.txt` accesible y correcto
- [ ] `sitemap.xml` accesible y actualizado
- [ ] `manifest.json` para PWA
- [ ] `browserconfig.xml` para Microsoft

### Performance
- [ ] Imágenes con lazy loading
- [ ] Preload de recursos críticos
- [ ] Preconnect para fuentes externas
- [ ] Core Web Vitals dentro de objetivos

---

## Notas

- Los meta tags de verificación están comentados en `index.html` - descomenta y agrega tus códigos cuando los tengas
- El sitemap se genera dinámicamente desde la base de datos
- Los schemas JSON-LD se generan automáticamente en cada página

