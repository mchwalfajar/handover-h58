const express = require('express');
const mysql = require('mysql2/promise');
const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('public'));

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'sakura',
    database: 'handover_h58',
};

const serDisplayNames = {
    batam_ser: 'Total High SER Batam',
    tarakan_ser: 'Total High SER Tarakan',
    pontianak_ser: 'Total High SER Pontianak',
    manado_ser: 'Total High SER Manado',
    batam_ut: 'Integrasi UT Batam',
    tarakan_ut: 'Integrasi UT Tarakan',
    pontianak_ut: 'Integrasi UT Pontianak',
    manado_ut: 'Integrasi UT Manado',
    batam_trafik: 'Mon Trafik Batam',
    tarakan_trafik: 'Mon Trafik  Tarakan',
    pontianak_trafik: 'Mon Trafik  Pontianak',
    manado_trafik: 'Mon Trafik  Manado',
    ip_transit: 'IP Transit'
};

app.get('/', async (req, res) => {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);

        const tables = [
            'ip_transit','batam_trafik', 'pontianak_trafik', 'tarakan_trafik', 'manado_trafik',
            'batam_ut', 'pontianak_ut', 'tarakan_ut', 'manado_ut',
            'batam_ser', 'pontianak_ser', 'tarakan_ser', 'manado_ser',
        ];

    let tableData = {};

        for (const table of tables) {
            const [latestTimestampRow] = await connection.execute(`
                SELECT MAX(timestamp) AS latestTimestamp FROM ${table}
            `);

            const latestTimestamp = latestTimestampRow[0]?.latestTimestamp;

            if (latestTimestamp) {
                // Default query for all tables
                let query = `SELECT * FROM ${table} WHERE timestamp = ?`;
                let params = [latestTimestamp];

                // Add 15% filter query
                if (table.includes('_ser')) {
                    query += ' AND percentage > 15';
                }

                // Execute query and store data
                const [rows] = await connection.execute(query, params);
                tableData[table] = rows;
            }
        }    

        res.render('home', { tableData, serDisplayNames });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).send('Internal Server Error');
    } finally {
        if (connection) {
            await connection.end();
        }
    }
});

const PORT = 3005;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
