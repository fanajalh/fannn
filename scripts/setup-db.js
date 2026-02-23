const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

// Manual .env parser
function loadEnv() {
    const envPath = path.resolve(__dirname, '../.env');
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        envContent.split('\n').forEach(line => {
            const match = line.match(/^\s*([\w]+)\s*=\s*(.*)?\s*$/);
            if (match) {
                const key = match[1];
                let value = match[2] || '';
                if (value.startsWith('"') && value.endsWith('"')) {
                    value = value.slice(1, -1);
                }
                process.env[key] = value;
            }
        });
    }
}

loadEnv();

async function setupDatabase() {
    const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

    if (!DB_HOST || !DB_USER || !DB_PASSWORD || !DB_NAME) {
        console.error('❌ Error: Missing MySQL configuration in .env');
        console.error('Please add the following keys to your .env file:');
        console.error('DB_HOST=localhost');
        console.error('DB_USER=root');
        console.error('DB_PASSWORD=your_password');
        console.error('DB_NAME=your_database_name');
        process.exit(1);
    }

    console.log(`🔌 Connecting to MySQL database '${DB_NAME}' at '${DB_HOST}'...`);

    try {
        const connection = await mysql.createConnection({
            host: DB_HOST,
            user: DB_USER,
            password: DB_PASSWORD,
            database: DB_NAME,
            multipleStatements: true,
        });

        console.log('✅ Connected.');

        const schemaPath = path.resolve(__dirname, 'schema.sql');
        if (!fs.existsSync(schemaPath)) {
            console.error(`❌ Schema file not found at ${schemaPath}`);
            process.exit(1);
        }
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        console.log('📜 Executing schema.sql...');
        await connection.query(schemaSql);

        console.log('✅ Database schema initialized successfully!');
        await connection.end();
    } catch (error) {
        console.error('❌ Error initializing database:', error.message);
        process.exit(1);
    }
}

setupDatabase();
