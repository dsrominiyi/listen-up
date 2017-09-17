import express from 'express';
import di from 'serenitydi';

import register from './register';
import routes from './routes';

const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
const port = process.env.PORT || 6307;
const app = express();

process.on('uncaughtException', err => {
  console.log(`Uncaught exception!! : ${err.stack}`);
  process.exit(1);
});

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', clientUrl);
  next();
});

register(di);
routes(app, di);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});