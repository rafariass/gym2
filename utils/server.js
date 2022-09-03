const express = require('express');

const app = express();

const { insertar, leer, actualizar, eliminar } = require('./pg');

app.use(express.static('./public', { root: process.cwd() }));
app.use(express.json());
app.use('/usuarios', (req, res, next) => {
  req.headers.authorization === '123'
    ? next()
    : res.status(403).json({ code: 403, message: 'Usted no esta autorizado...'});
});

app.get('/', (req, res) => res.sendFile('./public/index.html', { root: process.cwd() }));

app.get('/ejercicios', async (req, res) => {
  const result = await leer();
  res.status(result?.code ? 500 : 200).json(result)
});

app.post('/ejercicios', async (req, res) => {
  const result = await insertar(Object.values(req.body));
  res.status(result?.code ? 500 : 200).json(result);
});

app.put('/ejercicios', async (req, res) => {
  const result = await actualizar(Object.values(req.body));
  res.status(result?.code ? 500 : 200).json(result);
});

/* app.delete('/ejercicios', async (req, res) => {
  const result = await eliminar([req.query.nombre]);
  res.status(result?.code ? 500 : 200).json(result);
}); */

app.delete('/ejercicios/:nombre', async (req, res) => {
  const result = await eliminar([req.params.nombre]);
  res.status(result?.code ? 500 : 200).json(result);
});

app.all('*', (req, res) => res.status(404).json({ code: 404, message: 'Page not Found !!!' }));

app.listen(process.env.PORT || 3_000);

module.exports = { app };
