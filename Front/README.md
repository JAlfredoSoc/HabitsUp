# Habits UP

## Desarrollo local

1. Inicia MongoDB y configura el backend:

   ```powershell
   Copy-Item Back\.env.example Back\.env
   Set-Location Back
   npm install
   npm run dev
   ```

   El backend usa `MONGO_URI` de `Back\.env` y escucha en el puerto `3000`.

2. En otra terminal, inicia el frontend:

   ```powershell
   Copy-Item Front\.env.example Front\.env
   Set-Location Front
   npm install
   npm run dev
   ```

   El frontend consume `http://localhost:3000` por defecto. Si el backend está en otra dirección, cambia `VITE_API_URL` en `Front\.env`.

La API debe tener categorías disponibles en MongoDB para que el formulario permita crear hábitos.
