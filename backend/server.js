const express = require('express');
const cors = require('cors');
require('dotenv').config();

//const userRoutes = require('./src/routes/users.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors()); // Permite conexiones desde Angular
app.use(express.json()); // Para parsear JSON

// Rutas
//app.use('/api', userRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});