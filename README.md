# MCD-App-Ionic
La aplicación Mis Clientes Deudores se realizó para tener un registro de pagos de los clientes y conocer cuánto quedan a deber, así también poder llevar la información a todos lados contigo.

## 🔗 Enlaces
*   [Ver diseño en Figma](https://www.figma.com/file/qDE4AiZfwxkgMl5ZdWxpzE/Proyecto-dise%C3%B1o-app?node-id=0%3A1)
## 📱 Guía de Ejecución en iOS (iPhone)

Sigue estos pasos para compilar y ejecutar la aplicación en un dispositivo iPhone físico.

### 1. Requisitos Previos
*   **Mac** con la última versión de **Xcode** instalada.
*   **Homebrew** (opcional pero recomendado): `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`
*   **CocoaPods** instalado: `brew install cocoapods` (o `sudo gem install cocoapods`).
*   Configurar herramientas de Xcode:
    `sudo xcode-select -s /Applications/Xcode.app/Contents/Developer`

### 2. Preparación del Proyecto
Cada vez que realices cambios en el código de Angular/Ionic, debes sincronizarlos con la carpeta de iOS:

```bash
# 1. Compilar el código web
npm run build

# 2. Sincronizar con iOS (instala plugins y dependencias nativas)
npx cap sync ios
```

### 3. Ejecución en Xcode
1.  Abre el proyecto en Xcode:
    `npx cap open ios`
    *(O abre directamente el archivo `ios/App/App.xcworkspace`)*.
2.  **Firma (Signing)**:
    - Selecciona el proyecto **App** (icono azul) en el panel izquierdo.
    - Ve a la pestaña **Signing & Capabilities**.
    - En **Team**, selecciona tu Apple ID personal (gratis).
3.  **Correr**:
    - Conecta tu iPhone por USB.
    - Selecciónalo en la lista de dispositivos (arriba).
    - Presiona el botón **Play (▶️)**.

### 4. Confiar en la App (Solo la primera vez)
En tu iPhone, ve a:
**Configuración > General > VPN y gestión de dispositivos > [Tu Apple ID] > Confiar**.

---

## 🎨 Generación de Iconos y Splash Screen
Para actualizar el diseño de la app:
1.  **Icono**: Coloca `icon.png` (1024x1024) en la carpeta `/assets`.
2.  **Splash Screen**: Coloca `splash.png` y `splash-dark.png` (2732x2732) en la carpeta `/assets`.
    *   *Nota: Es importante tener la versión dark para que se vea correctamente en Modo Oscuro.*
3.  **Generar**:
    ```bash
    # Genera todos los tamaños para iOS
    npx @capacitor/assets generate --ios
    
    # Sincroniza con el proyecto nativo
    npx cap sync ios
    ```

### 💡 Tips para el Splash Screen en iOS
Si después de generar los archivos sigues viendo el logo viejo o una pantalla vacía:
- **Borra la app** de tu iPhone.
- En Xcode, ve a **Product > Clean Build Folder**.
- Vuelve a instalar la app (`Play ▶️`).
- iOS guarda una caché muy fuerte del Launch Screen y a veces requiere borrar la app para refrescarse.
