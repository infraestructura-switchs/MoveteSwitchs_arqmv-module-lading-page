# Contexto del proyecto (MoveteSwitchs_arqmv-module-lading-page)

## Resumen
Frontend Vite + React + TypeScript para una landing/menú digital con carrito, categorías, búsqueda y panel administrativo. Consume una API externa para productos y configuración de empresa. El flujo depende de parámetros en la URL (token y companyId).

## Stack
- Vite 5, React 18, TypeScript 5
- Tailwind CSS + MUI
- Axios para API
- Vitest + Testing Library
- ESLint

## Entrypoints y flujo principal
- Punto de entrada: src/main.tsx → monta App
- App maneja:
  - Parseo y persistencia de parámetros de URL
  - Carga inicial de productos por compañía
  - Carrito en localStorage
  - Búsqueda y ordenamiento server-side
  - Render de Header, ProductGrid, Cart y AdminPanel
- Sin token válido se muestra GenericScreen (pantalla 404)

## Parámetros de URL y estado persistente
- parseUrlParams() lee query o hash y guarda en localStorage como urlParams
- Variables esperadas en URL:
  - token (JWT o token de acceso)
  - companyId
  - productNameCompany, userToken, qr, mesa (opcional)
- localStorage:
  - restaurant-cart (carrito)
  - restaurant-config (configuración empresa)
  - urlParams (parámetros URL)

## API y configuración
- BASE_URL_API viene de VITE_ARQBS_API_URL
- Productos:
  - GET /product/getProductByCompany/:companyId (requiere Authorization Bearer token)
  - GET /product/search?companyId=&name=&category=
  - GET /product/by-price?companyId=&sort=ASC|DESC&category=&name=
- Empresa:
  - POST /company/create (multipart/form-data)
  - GET /company/get-company
  - DELETE /company/delete/:companyId

## Componentes clave
- Header: logo, buscador y acceso a carrito/admin
- Cart: resumen de pedido, WhatsApp, total y ajustes
- ProductGrid + ProductCard + ProductModal: catálogo y detalle
- CategorySelector + SortOptions: filtros
- AdminPanel: CRUD de categorías y configuración de empresa

## Assets
- Imágenes y logos en public/assets (icons y image)
- Favicon dinámico con logo de empresa

## Scripts principales
- npm run dev
- npm run build
- npm run lint
- npm run test
- npm run preview

## Build y despliegue
- Dockerfile con build en Node 18 y runtime en Nginx
- nginx.conf y default.conf sirven dist como SPA
