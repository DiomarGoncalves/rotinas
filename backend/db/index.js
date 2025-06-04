import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Create a new pool using the database URL from environment variables
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Connect to the database and create tables if they don't exist
export const connectDB = async () => {
  try {
    // Test connection
    const client = await pool.connect();
    console.log('Connected to PostgreSQL database');
    
    // Create tables if they don't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS routines (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        description TEXT,
        days TEXT[], -- ex: ['Monday', 'Tuesday']
        time TIME,
        priority TEXT CHECK (priority IN ('Alta', 'Média', 'Baixa')),
        status TEXT CHECK (status IN ('pendente', 'concluída', 'atrasada')) DEFAULT 'pendente',
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS suggestions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        profile TEXT CHECK (profile IN ('estudante', 'trabalhador', 'treinamento')),
        title TEXT NOT NULL,
        description TEXT,
        days TEXT[],
        time TIME,
        priority TEXT
      );
    `);
    
    // Insert default suggestions if they don't exist
    const suggestionsCount = await client.query('SELECT COUNT(*) FROM suggestions');
    
    if (parseInt(suggestionsCount.rows[0].count) === 0) {
      await client.query(`
        INSERT INTO suggestions (profile, title, description, days, time, priority) VALUES
        ('estudante', 'Estudo matinal', 'Revisar material do dia anterior', ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], '08:00:00', 'Alta'),
        ('estudante', 'Anotações de aula', 'Organizar anotações das aulas do dia', ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], '18:00:00', 'Média'),
        ('trabalhador', 'Planejamento do dia', 'Listar tarefas e prioridades do dia', ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], '07:30:00', 'Alta'),
        ('trabalhador', 'Revisão de pendências', 'Verificar emails e pendências do dia anterior', ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], '09:00:00', 'Alta'),
        ('treinamento', 'Prática de exercícios', 'Resolver exercícios práticos do módulo atual', ARRAY['Monday', 'Wednesday', 'Friday'], '19:00:00', 'Alta'),
        ('treinamento', 'Revisão semanal', 'Revisar todo o conteúdo da semana', ARRAY['Friday'], '17:00:00', 'Média')
      `);
      console.log('Default suggestions inserted');
    }
    
    client.release();
  } catch (error) {
    console.error('Error connecting to database:', error);
    process.exit(1);
  }
};

// Query helper function
export const query = (text, params) => pool.query(text, params);

export default { query, pool };