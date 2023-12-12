import router from './routes';
import express from 'express';

const app = express();
const port = 3000;

app.use(express.json());
app.use(router);

app.listen(port, function () {
  console.log(`Server listening on port ${port}!`);
});