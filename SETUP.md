# Configurar Firebase (cuentas y avance en la nube)

## 1. Crear el proyecto
1. Entra a https://console.firebase.google.com con tu cuenta de Google.
2. **Agregar proyecto** → nombre, por ejemplo `farma-capacitacion`. Google Analytics es opcional.

## 2. Activar correo y contraseña
**Compilación → Authentication → Comenzar → Método de acceso → Correo electrónico/contraseña → Habilitar → Guardar.**

En **Authentication → Configuración → Dominios autorizados**, agrega `manolo7aguilar-boop.github.io`.

## 3. Crear la base de datos
**Compilación → Firestore Database → Crear base de datos** → modo **producción** → elige una región (por ejemplo `us-central1` o `southamerica-east1`).

## 4. Pegar las reglas de seguridad
En **Firestore → Reglas**, borra lo que hay, pega el contenido del archivo `firestore.rules` de este repositorio y presiona **Publicar**.

## 5. Registrar la app web y copiar la configuración
1. **Configuración del proyecto (⚙️) → General → Tus apps → icono `</>` (Web)** → nombre `farma-web` → Registrar (no hace falta Hosting).
2. Firebase muestra un bloque `firebaseConfig`. Copia `.env.example` a `.env` y llena cada valor:

```
VITE_FIREBASE_API_KEY=...            (apiKey)
VITE_FIREBASE_AUTH_DOMAIN=...        (authDomain)
VITE_FIREBASE_PROJECT_ID=...         (projectId)
VITE_FIREBASE_STORAGE_BUCKET=...     (storageBucket)
VITE_FIREBASE_MESSAGING_SENDER_ID=...(messagingSenderId)
VITE_FIREBASE_APP_ID=...             (appId)
```

Estos valores web no son contraseñas secretas (la seguridad la dan las reglas), pero `.env` no se sube al repositorio.

## 6. El primer gerente
La **primera persona que se registra** en la app queda automáticamente como **gerente** (Manolo debe registrarse primero). Todas las demás entran como **colaborador**.

Si hiciera falta hacerlo a mano: **Firestore → colección `users` → tu documento → campo `role` = `gerente`**.

## 7. Asignar supervisores y regiones
Como gerente: **Panel admin → Detalle por persona** → elige el rol y escribe la región (por ejemplo `Coatepeque`) → Guardar.
- Supervisor: ve solo a las personas con su misma región.
- Gerente: ve toda la cadena.
- Escribe la región exactamente igual para todos (mismas mayúsculas y tildes).

## 8. Volver a publicar en GitHub Pages
La configuración se incluye al compilar. Con el `.env` lleno, se vuelve a ejecutar `npm run build` y se publica la carpeta `dist` en GitHub Pages. Sin `.env`, la app muestra "Falta configurar Firebase".
