const { AndroidAgent, AndroidDevice, getConnectedDevices } = require('@midscene/android');

(async () => {
  const devices = await getConnectedDevices();
  if (!devices.length) {
    throw new Error('No se detectó ningún dispositivo/emulador Android conectado.');
  }
  const page = new AndroidDevice(devices[0].udid);

  // Sugerencia para la IA
  const agent = new AndroidAgent(page, {
    aiActionContext: 'Si aparece algún popup de permisos, acepta.',
  });

  // Conecta al dispositivo
  await page.connect();

  // Despliega la barra de notificaciones
  await page.adb.shell('cmd statusbar expand-notifications');

  // Detecta si el botón Bluetooth está habilitado y guarda el valor
  const estadoBluetoothAntes = await agent.aiQuery({ habilitado: '¿El botón de Bluetooth está habilitado? Devuelve true o false.' });
  const bluetoothHabilitadoAntes = estadoBluetoothAntes.habilitado;

  // Toca el botón de Bluetooth
  await agent.aiTap('Bluetooth');

  // Hace click en el switch 'Use Bluetooth'
  await agent.aiTap('el switch Use Bluetooth');

  await new Promise(r => setTimeout(r, 1000));

  // Toca el botón de Done
  await agent.aiTap('Done');

  // Verifica que el estado del botón Bluetooth haya cambiado respecto al valor guardado
  const estadoBluetoothDespues = await agent.aiQuery({ habilitado: '¿El botón de Bluetooth está habilitado? Devuelve true o false.' });
  const bluetoothHabilitadoDespues = estadoBluetoothDespues.habilitado;

  if (bluetoothHabilitadoAntes === bluetoothHabilitadoDespues) {
    throw new Error('El estado del botón Bluetooth no cambió tras usar el switch.');
  } else {
    console.log('El estado del botón Bluetooth cambió correctamente.');
  }
})();
