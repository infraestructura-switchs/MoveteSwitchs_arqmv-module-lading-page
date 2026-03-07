# Especificación SDD — templateLanding

## Resumen
Se agregará un nuevo query param `templateLanding` con valores permitidos `RestaurantLanding` y `EcommerceLanding`. Este parámetro define qué plantilla de landing se renderiza en la app. La plantilla `RestaurantLanding` corresponde al flujo actual del menú con carrito. La plantilla `EcommerceLanding` presentará un catálogo digital orientado a ropa o calzado, reutilizando datos y servicios existentes (productos, búsqueda, filtros, carrito), pero con un layout y jerarquía visual diferente.

## Objetivos
- Permitir seleccionar el template desde la URL sin romper el comportamiento actual.
- Mantener compatibilidad con el flujo de productos, carrito y configuración de empresa.
- Introducir una nueva experiencia visual para ecommerce con secciones de marketing.

## Alcance funcional
- Lectura y persistencia de `templateLanding` junto con otros parámetros de URL.
- Render condicional del layout principal según el valor de `templateLanding`.
- Reutilización de carga de productos, categorías, búsqueda y carrito.
- Mantener el fallback actual: sin token válido mostrar `GenericScreen`.

## Reglas de negocio
- Si `templateLanding` no existe o su valor es inválido, se usa `RestaurantLanding`.
- Si `templateLanding=RestaurantLanding`, se conserva el layout actual.
- Si `templateLanding=EcommerceLanding`, se muestra un layout alternativo con secciones de ecommerce.
- La lógica de autenticación por `token` y `companyId` se mantiene igual.
- La persistencia en `localStorage` permanece en la clave `urlParams`.

## Parámetros de URL
- Requeridos:
  - `token`
  - `companyId`
- Opcionales:
  - `productNameCompany`, `userToken`, `qr`, `mesa`
  - `templateLanding` con valores `RestaurantLanding` | `EcommerceLanding`

## Flujos actuales relevantes
- `parseUrlParams()` procesa query o hash, y guarda el objeto en `localStorage`.
- `App` lee `token` y `companyId` desde `urlParams` persistidos.
- Cuando `loading` termina y `hasToken` es verdadero, se renderiza la interfaz principal.

Referencias actuales:
- `parseUrlParams`, `storeUrlParams`, `getStoredUrlParam` en [urlParams.ts](file:///C:/Users/LENOVO/OneDrive%20-%20Arquitecsoft%20S.A.S/Arquitecsoft/Unidad_E/Git/Swithcs/ProyectoMoveteArqui/github_dokploy/MoveteSwitchs_arqmv-module-lading-page/src/utils/urlParams.ts#L1-L31)
- Render principal en [App.tsx](file:///C:/Users/LENOVO/OneDrive%20-%20Arquitecsoft%20S.A.S/Arquitecsoft/Unidad_E/Git/Swithcs/ProyectoMoveteArqui/github_dokploy/MoveteSwitchs_arqmv-module-lading-page/src/App.tsx#L542-L616)

## Arquitectura propuesta (sin código)
### 1) Selección del template
- Al montar `App`, leer `templateLanding` desde `urlParams` (estado reactivo).
- Resolver el template final:
  - `templateLanding` válido → usarlo.
  - Valor faltante o inválido → `RestaurantLanding`.
- Exponer un enum interno o unión de strings para evitar valores inesperados.

### 2) Estructura de render
- Mantener el flujo de datos (carga de productos, categorías, búsqueda, carrito).
- Encapsular layouts:
  - `RestaurantLanding` → usa el layout actual.
  - `EcommerceLanding` → nueva estructura visual, pero reutiliza componentes de catálogo y carrito.

### 3) Layout EcommerceLanding (propuesta)
Secciones (orden y comportamiento):
1. **Hero principal**
   - Logo, nombre de la tienda, tagline.
   - CTA hacia catálogo (scroll al grid de productos).
2. **Categorías destacadas**
   - Cards con 4–6 categorías con mayor inventario.
   - Reutiliza el mapeo actual de categorías para la navegación.
3. **Banner de colección**
   - Sección con imagen y texto de campaña.
4. **Catálogo**
   - Grid de productos con búsqueda, filtros y ordenamiento.
   - Reutiliza `CategorySelector`, `SortOptions` y `ProductGrid`.
5. **Beneficios/Confianza**
   - Envío, cambios, pagos, soporte.
6. **Footer ecommerce**
   - Versión y datos básicos de contacto.

### 4) Comportamiento del carrito
- El carrito sigue siendo global y se accede desde el header.
- El layout Ecommerce puede incluir un CTA permanente hacia carrito.
- Persistencia en `restaurant-cart` no cambia.

## Datos y estados
- `urlParams.templateLanding`: se guarda en `localStorage` junto con el resto de parámetros.
- `templateLanding` resuelto (estado interno): valor final de template usado por el render.
- `config`: continúa siendo la fuente de color primario y datos de la empresa.
- `allProducts`, `products`, `categories`: se reutilizan sin cambios.

## Comportamiento esperado por template
### RestaurantLanding
- Header, categorías, grid de productos, carrito y admin panel igual al actual.

### EcommerceLanding
- Header reutilizado con estilos ajustados (color primario como acento).
- Secciones de marketing además del catálogo.
- Categorías destacadas:
  - Selección por mayor número de productos en `allProducts`.
  - Excluir la categoría `all`.
  - Máximo 6 elementos para evitar saturación.
- Catálogo:
  - Misma lógica de búsqueda, filtros y ordenamiento.
  - Misma interacción de `ProductCard` y `ProductModal`.

## Estilos y diseño
- Reutilizar Tailwind CSS con nuevas secciones y spacing consistente.
- Reutilizar `config.primaryColor` como color de acento.
- Tipografías y tamaños alineados a los componentes existentes.
- Imágenes:
  - Si la imagen de campaña no está disponible, usar placeholders con color de marca.

## Accesibilidad
- Botones y CTAs con foco visible.
- Contraste mínimo en textos sobre fondos con color de marca.
- `alt` basado en `productName` para imágenes de productos.

## Rendimiento
- No agregar nuevas llamadas a la API.
- Mantener el render del catálogo bajo las mismas condiciones actuales.
- Evitar recalcular categorías destacadas en cada render si no cambian los datos.

## Manejo de errores y estados vacíos
- Sin token válido → `GenericScreen` (sin cambios).
- Sin productos en una categoría → no renderizar la sección.
- Sin productos en general → mostrar estado vacío en catálogo.

## Plan de implementación (sin código)
1. Extender el parseo y uso de `templateLanding` desde `urlParams`.
2. Crear un wrapper de layout que seleccione entre `RestaurantLanding` y `EcommerceLanding`.
3. Reutilizar `Header`, `CategorySelector`, `SortOptions`, `ProductGrid`, `Cart`, `AdminPanel`.
4. Maquetar secciones de ecommerce (hero, categorías destacadas, banners).
5. Ajustar estilos con Tailwind siguiendo tokens de `config.primaryColor`.
6. Verificar que el flujo de carrito y búsqueda funcione igual en ambos templates.

## Criterios de aceptación
- La URL con `templateLanding=RestaurantLanding` renderiza el layout actual.
- La URL con `templateLanding=EcommerceLanding` renderiza el nuevo layout.
- Si el valor es inválido o falta, se usa `RestaurantLanding`.
- No se rompe la carga de productos ni el carrito en ningún template.
- El color primario de la empresa se aplica en CTAs clave.
- La navegación por categorías y la búsqueda siguen funcionando.

## Casos de prueba manual
- Abrir con `templateLanding` ausente y con token válido.
- Abrir con `templateLanding=RestaurantLanding`.
- Abrir con `templateLanding=EcommerceLanding`.
- Buscar y filtrar productos en EcommerceLanding.
- Abrir/cerrar carrito y verificar persistencia.
