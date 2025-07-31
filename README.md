# MovieHub

MovieHub es una aplicación web de administración de películas desarrollada con Vue.js/Nuxt que consume la API externa de OMDB (Open Movie Database). La aplicación permite a los usuarios explorar películas, ver detalles y gestionar su experiencia de visualización.

## Características

- **Autenticación de usuarios**: Sistema de login con backend dummy
- **Exploración de películas**: Visualización de películas populares por categorías, tendencias y recomendaciones
- **Detalles de películas**: Información detallada de cada película incluyendo reparto, calificaciones y datos técnicos
- **Diseño responsivo**: Experiencia optimizada para dispositivos móviles, tablets y escritorio
- **Interfaz inspirada en plataformas de streaming**: Carruseles arrastrables, banners dinámicos y animaciones
- **SEO optimizado**: Metadatos dinámicos, sitemap y estructura de URLs amigable

## Tecnologías utilizadas

- **Frontend**: Vue.js, Nuxt, TypeScript
- **Estilos**: Tailwind CSS
- **Iconos**: Lucide Vue Next
- **Peticiones HTTP**: Axios

## Requisitos

- Node.js (versión 22.x.x o superior recomendada)
- npm

## Instalación

1. Clona este repositorio:
```bash
git clone https://github.com/DarioAlbor/MovieHub
cd MovieHub
```

2. Instala las dependencias:
```bash
npm install
```

3. Renombra `.env.example` como `.env.local` o crea el tuyo con el siguiente contenido:
```
NUXT_OMDB_API_KEY=tu_api_key_de_omdb
NUXT_OMDB_API_URL=https://www.omdbapi.com
NUXT_AUTH_TOKEN_NAME=auth_token
NUXT_APP_URL=http://localhost:3000
```

### Deploy

Una vez hecha la instalacion solo ejecuta:

```bash
npm run dev
```

## Credenciales de prueba

Para probar la aplicación, puedes usar las siguientes credenciales:

- **Email**: admin@moviehub.com
- **Contraseña**: admin123