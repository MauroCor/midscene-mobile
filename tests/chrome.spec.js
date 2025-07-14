const { AndroidAgent, AndroidDevice, getConnectedDevices } = require('@midscene/android');

(async () => {
  const devices = await getConnectedDevices();
  if (!devices.length) {
    throw new Error('No se detectó ningún dispositivo/emulador Android conectado.');
  }
  const page = new AndroidDevice(devices[0].udid);

  // Sugerencia para la IA
  const agent = new AndroidAgent(page, {
    aiActionContext: 'Si aparece algún popup, acepta o cierra.',
  });

  // Conecta al dispositivo
  await page.connect();

  // Abre Chrome
  await page.launch('com.android.chrome');

  // Navega a Saucedemo
  await page.adb.shell('am start -a android.intent.action.VIEW -d "https://www.saucedemo.com/" com.android.chrome');

  await new Promise(r => setTimeout(r, 1000));

  // Ingresa Username
  await agent.aiInput('standard_user', 'campo Username')
  
  // Ingresa Password
  await agent.aiInput('secret_sauce', 'campo Pasword')

  // Clic Login
  await agent.aiTap('Login')

  // Assert
  await agent.aiAssert('Visualiza productos en la Home de Saucedemo')
})();
