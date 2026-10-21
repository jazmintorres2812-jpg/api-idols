# API de idols asiáticos

API REST en Node.js/Express, PostgreSQL y n8n. Docker Compose crea los contenedores y los volúmenes persistentes `postgres_data` y `n8n_data`.

## Iniciar localmente

Requiere Docker Desktop en ejecución. Desde esta carpeta:

```powershell
docker compose up --build -d
docker compose ps
```

- API: `http://localhost:3000`
- Ejemplo equivalente al patrón solicitado: `http://localhost:3000/api/idols/4`
- Listado: `http://localhost:3000/api/idols?limit=20&offset=0`
- Filtros: `http://localhost:3000/api/idols?country=Japón&group_name=TWICE`
- Salud: `http://localhost:3000/health`
- n8n: `http://localhost:5678` (crear usuario propietario en el primer acceso)
- PostgreSQL: `localhost:5432`, base `idols_db`, usuario `idols_user`

La primera ejecución importa y activa un flujo n8n que consulta toda la API cada cinco minutos. n8n conserva su configuración en `n8n_data`; PostgreSQL conserva los datos en `postgres_data`. El flujo consulta la API y deja el resultado disponible en la ejecución n8n; todavía no lo envía a otra aplicación.

## Imágenes y contenedores

`docker compose up --build` construye la imagen `idols-api-api` y descarga `postgres:17-alpine` y `docker.n8n.io/n8nio/n8n:latest`. El volumen PostgreSQL persiste aunque se elimine y vuelva a crear el contenedor. Para eliminar los contenedores conservando datos: `docker compose down`. Para borrar también los datos: `docker compose down -v`.

## Git

El directorio de trabajo proporcionado no tiene todavía un repositorio Git. Para inicializar y publicar el proyecto en un repositorio GitHub nuevo:

```powershell
git init
git add .
git commit -m "Crear API de idols asiáticos con PostgreSQL y n8n"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/asiatic-idols-api.git
git push -u origin main
```

Sustituye la URL por la del repositorio que crees. No subas `.env`, contraseñas ni llaves.

## Render y n8n

`render.yaml` define el despliegue de la API y una base PostgreSQL gestionada en Render. El plan de base configurado es de pago; revisa el costo en el Dashboard antes de aplicar el Blueprint. El servicio API usa el plan gratuito. La inicialización `db/init.sql` es solo para el contenedor local; para producción habrá que aplicar el esquema y cargar los datos iniciales en la base de Render.

Para n8n en producción usa un servicio persistente y una clave `N8N_ENCRYPTION_KEY` secreta. En el flujo desplegado, cambia `http://api:3000` por la URL pública HTTPS de la API. El compose incluido sirve para desarrollo local; no expongas su contraseña de ejemplo ni su clave n8n en producción.
