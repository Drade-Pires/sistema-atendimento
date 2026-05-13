const express = require('express');
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

// Rotas
const chamadosRoutes = require('./routes/chamados');
app.use('/chamados', chamadosRoutes);

const clientesRoutes = require('./routes/clientes');
app.use('/clientes', clientesRoutes);

const tecnicosRoutes = require('./routes/tecnicos');
app.use('/tecnicos', tecnicosRoutes);

const agendaRoutes = require('./routes/agenda');
app.use('/agenda', agendaRoutes);

const historicoRoutes = require('./routes/historico');
app.use('/historico', historicoRoutes);

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));
