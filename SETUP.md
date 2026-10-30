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

## 6. Jerarquía de roles
| Rol | Etiqueta | Qué ve |
|---|---|---|
| `admin` | Administrador del sistema | Toda la cadena. **Único** que puede cambiar rol, región y sucursal de otros. |
| `gerente` | Gerente de ventas | Toda la cadena (solo consulta). |
| `supervisor` | Supervisor | Personas con su misma **región** (y a sí mismo). |
| `encargado` | Encargado de sucursal | Personas con su misma **sucursal** (y a sí mismo). |
| `colaborador` | Colaborador | Solo su propio avance. |

**La primera persona que se registra queda como administrador del sistema** (Manolo debe registrarse primero). Todos los demás entran como colaborador.

**Importante:** si ya te registraste con la versión anterior y quedaste como `gerente`, entra a **Firestore → colección `users` → tu documento** y cambia el campo `role` a `admin`.

## 7. Asignar roles, regiones y sucursales
Como administrador: **Panel admin → Detalle por persona** → elige el rol, escribe la región (ej. `Quetzaltenango`) y/o la sucursal (ej. `Coatepeque Centro`) → Guardar.
- Supervisor necesita **región**; encargado necesita **sucursal**; a los colaboradores asígnales ambas para que aparezcan con su supervisor y su encargado.
- Escribe región y sucursal exactamente igual para todos (mismas mayúsculas y tildes).

## 8. Volver a publicar en GitHub Pages
La configuración se incluye al compilar. Con el `.env` lleno, se vuelve a ejecutar `npm run build` y se publica la carpeta `dist` en GitHub Pages. Sin `.env`, la app muestra "Falta configurar Firebase".

## Regiones y supervisores
Las reglas incluyen la colección `regions` (todos los usuarios con sesión la leen; solo el administrador del sistema crea, renombra o elimina). Si actualizaste desde una versión anterior, vuelve a pegar `firestore.rules` en **Firestore → Reglas** y presiona **Publicar**.

En el **Panel administrador → Regiones y supervisores**, el administrador crea hasta 3 regiones y asigna un supervisor por región (elige la persona registrada y la región). La gerente de ventas ve las regiones y sus supervisores, pero no puede editarlos.
