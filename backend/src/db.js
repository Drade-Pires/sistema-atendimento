const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST=dpg-d86t0n0g4nts73bao540-a,
  port: process.env.DB_PORT=5432,
  user: process.env.DB_USER=banco_sistema_atendimento_user,
  password: process.env.DB_PASSWORD=jbN1YwuZfWsM5WhWM9NWhvOoxrj66UgJ,
  database: process.env.DB_NAME=banco_sistema_atendimento,
  ssl: {
    rejectUnauthorized: false // necessário no Render
  }
});

module.exports = pool;
