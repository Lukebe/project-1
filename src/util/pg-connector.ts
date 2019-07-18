import { Pool } from 'pg';

const db = new Pool({
    database: 'postgres',
    host: process.env.INVENTORY_URL || 'localhost',
    password: process.env.INVENTORY_PASSWORD || 'dragon333',
    port: 5433,
    user: process.env.INVENTORY_USER || 'postgres',
});

export function closePool() {
    db.end();
}

export default db;