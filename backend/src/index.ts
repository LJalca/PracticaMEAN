import app from './app';
import { connectDatabase } from './config/database';

const port = app.get('puerto') || 3000;

connectDatabase();

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});