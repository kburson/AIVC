import { createRetrievalApp } from './http/app.js';
const app = createRetrievalApp();
for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.once(signal, () => {
    void app.close().then(
      () => {
        process.exitCode = 0;
      },
      (error) => {
        console.error(error);
        process.exitCode = 1;
      },
    );
  });
}
try {
  await app.listen({ host: '127.0.0.1', port: 3001 });
} catch (error) {
  console.error(error);
  process.exitCode = 1;
  await app.close();
}
