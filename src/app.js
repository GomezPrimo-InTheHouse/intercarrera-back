// app.js
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Listado de microservicios
const services = [
  { name: 'ms-principal.js', port: 7001 },
  // podés sumar más acá:
  // { name: 'ms-twilio.js', port: 7002 },
];

// Levantar cada microservicio
services.forEach(service => {
  const servicePath = path.join(__dirname, 'microservicios', service.name);

  const child = spawn('node', [servicePath], {
    env: { ...process.env, PORT: service.port },
    stdio: 'inherit',
    shell: true
  });

  child.on('close', code => {
    console.log(`✅ ${service.name} finalizó con código ${code}`);
  });

  child.on('error', err => {
    console.error(`❌ Error al iniciar ${service.name}:`, err);
  });
});
