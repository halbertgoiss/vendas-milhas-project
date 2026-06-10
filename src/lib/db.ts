import { neon } from '@neondatabase/serverless';

// Esse comando vai ler a credencial que configuramos na Vercel
const sql = neon(process.env.DATABASE_URL!);

export default sql;