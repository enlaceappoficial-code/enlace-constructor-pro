# Enlace Constructor Pro — Tauri

## Requisitos previos (instalar una sola vez)

### 1. Rust
Abre PowerShell como administrador y ejecuta:
```
winget install --id Rustlang.Rustup
```
Luego cierra y vuelve a abrir PowerShell y verifica:
```
rustc --version
```

### 2. Visual Studio Build Tools
Descarga e instala desde:
https://visualstudio.microsoft.com/visual-cpp-build-tools/
- Selecciona "Desarrollo de escritorio con C++"

### 3. Node.js (si no lo tienes)
```
winget install OpenJS.NodeJS
```

### 4. WebView2 (ya incluido en Windows 11, para Windows 10)
https://developer.microsoft.com/es-es/microsoft-edge/webview2/

---

## Estructura del proyecto

```
enlace-tauri/
├── package.json
├── src/
│   └── Enlace_Constructor_Pro__v1_2.html   ← copiar aquí el HTML de ECP
└── src-tauri/
    ├── Cargo.toml
    ├── build.rs
    ├── tauri.conf.json
    ├── icons/                               ← copiar iconos aquí
    │   ├── icon.ico
    │   ├── icon.icns
    │   ├── 32x32.png
    │   ├── 128x128.png
    │   └── 128x128@2x.png
    └── src/
        └── main.rs
```

---

## Pasos para compilar

### Primera vez
```powershell
cd D:\enlace-tauri
npm install
npm run build
```

El ejecutable quedará en:
`src-tauri/target/release/bundle/msi/Enlace Constructor Pro_1.0.0_x64_en-US.msi`

### Desarrollo (modo dev con recarga automática)
```powershell
npm run dev
```

---

## Diferencias vs Electron

| | Electron | Tauri |
|---|---|---|
| Tamaño .exe | ~150 MB | ~5 MB |
| RAM usada | ~200 MB | ~30 MB |
| localStorage | ✅ | ✅ |
| Velocidad arranque | Lenta | Rápida |
| Compilación | Simple | Requiere Rust |

---

## Notas importantes

- El HTML de ECP va en la carpeta `src/` con el nombre exacto que está en tauri.conf.json
- localStorage funciona igual que en el navegador
- Los PDFs/blobs funcionan igual
- Para cambiar el ícono reemplaza los archivos en `icons/`
