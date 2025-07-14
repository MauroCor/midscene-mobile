# Midscene Mobile (Android)

Proyecto de automatización mobile web y apps en Android, usando Midscene para facilitar pruebas end-to-end con inteligencia artificial visual-lenguaje.

## 1. Requisitos previos
- Node.js 18+
- Dispositivo Android físico conectado ó emulador Android creado y corriendo

## 2. Instalación de dependencias
```bash
npm install
```

## 3. Consigue una API Key de modelo VL (ejemplo Gemini 2.5 Pro)
- [Guía de modelos soportados](https://midscenejs.com/choose-a-model.html)
- Ejemplo para Gemini:
```bash
export OPENAI_BASE_URL="https://generativelanguage.googleapis.com/v1beta/openai/"
export OPENAI_API_KEY="TU_API_KEY_DE_GEMINI"
export MIDSCENE_MODEL_NAME="gemini-2.5-pro-preview-05-06"
export MIDSCENE_USE_GEMINI=1
```

## 4. Corre el emulador Android
Puedes usar **Android Studio** (Device Manager > Inicia tu emulador) o, si prefieres una opción automatizada y portable, sigue la sección [Emulación Android fácil con Docker](#emulación-android-fácil-con-docker) más abajo en este README.

#### Sólo si usas Android Studio:
Configura el SDK de Android. Agrega a tu terminal:
```bash
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

## 5. Ejecuta el test
```bash
node tests/chrome.spec.js
```

---

- El reporte HTML se genera en `midscene_run/report/`.
- Si usas otro modelo VL, consulta la doc oficial para los exports.
- El script debe usar `require` y no `import`.

---

## ¿Qué es Midscene?
Midscene permite automatizar flujos mobile/web usando instrucciones en lenguaje natural y visión AI, facilitando:
- Interacción con apps/webs como un usuario real.
- Steps AI para tap, input, validaciones y extracción de datos.
- Automatización robusta sin selectores frágiles.

### Ejemplos de steps AI con Midscene
```js
await agent.aiAction('Clic en buscador y escribe youtube.com');

await agent.aiInput('música', 'el campo de búsqueda principal de YouTube');

await agent.aiTap('el botón de buscar');

const resultado = await agent.aiQuery({ cantidad: '¿Cuántos resultados de búsqueda se muestran?' });
console.log('Cantidad de resultados:', resultado.cantidad);
```
- Los steps pueden ser acciones, validaciones, inputs o queries en lenguaje natural.

## 📱 Emulación Android fácil con Docker
https://github.com/budtmo/docker-android
### Requisitos
- **SO:** Ubuntu o cualquier Linux con soporte para KVM (la imagen no funciona en Mac ni Windows directamente, solo en Linux o en VM con Ubuntu).
- **Docker instalado**
- **Virtualización habilitada** en la BIOS (KVM)

### 1. Verifica virtualización y KVM
Instala cpu-checker y verifica que tu máquina soporta virtualización:
```bash
sudo apt-get update
sudo apt-get install cpu-checker
kvm-ok
```
Debe decir: `KVM acceleration can be used`

### 2. Arranca el emulador Android con Docker
Ejecuta este comando:
```bash
docker run -d \
  -p 6080:6080 \
  -p 5555:5555 \
  -e EMULATOR_DEVICE="Samsung Galaxy S10" \
  -e WEB_VNC=true \
  --device /dev/kvm \
  --name android-container \
  budtmo/docker-android:emulator_11.0
```
**¿Qué hace cada parte?**
- `-p 6080:6080` expone la interfaz web VNC en tu navegador.
- `-p 5555:5555` → Permite conectar ADB desde tu host al emulador.
- `-e EMULATOR_DEVICE=...` elige el modelo de dispositivo emulado.
- `-e WEB_VNC=true` habilita la interfaz web.
- `--device /dev/kvm` habilita virtualización por hardware (necesario para buen rendimiento).
- `--name android-container` nombra el contenedor para fácil manejo.
- `budtmo/docker-android:emulator_11.0` es la imagen de Android 11 lista para emular.

### 3. Abre el emulador y selecciona "Conectar"
Abre [http://localhost:6080](http://localhost:6080) en tu navegador. Cliquea "Conectar".

### 4. Espera a que el emulador esté listo
Verifica el estado:
```bash
docker exec -it android-container cat device_status
```
- `BOOTED` veras el dispositivo inicializandose en la web.
- `READY` veras el dispositivo en la Home en la web.

### 5. Conecta ADB al emulador (obligatorio para los tests)
```bash
adb connect localhost:5555
adb devices
```
Deberías ver el emulador listado como `device`.

---

## Diseña pruebas con ayuda de midscene/android-playground

Es una herramienta visual para experimentar, probar y depurar pasos AI sobre un dispositivo Android (emulador o físico) conectado por ADB.

Con el dispositivo conectado o emulado y las variables de entorno exportadas. Ejecuta:

```bash
npx --yes @midscene/android-playground
```

Abrirá en tu navegador la herramienta de playground en localhost.

Deberás configurar las mismas variables de entorno seleccionando el ícono de engranaje.

```bash
OPENAI_BASE_URL="https://generativelanguage.googleapis.com/v1beta/openai/"
OPENAI_API_KEY="TU_API_KEY_VL_MODEL”
MIDSCENE_MODEL_NAME="gemini-2.5-pro-preview-05-06"
MIDSCENE_USE_GEMINI=1
```

---