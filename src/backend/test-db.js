const supabase = require('./supabase');

async function inspectTables() {
    const tables = ['users', 'orders', 'card_information', 'payment_logs', 'products'];
    for (const table of tables) {
        try {
            const { data, error } = await supabase.from(table).select('*').limit(1);
            if (error) {
                console.error(`Error in ${table}:`, error.message);
            } else if (data && data.length > 0) {
                console.log(`Table: ${table}`);
                console.log(`Columns: ${JSON.stringify(Object.keys(data[0]))}`);
                console.log('---');
            } else {
                console.log(`Table ${table} is empty - attempting to get column names from schema...`);
                // Fallback for empty tables if possible, or just note it's empty.
            }
        } catch (err) {
            console.error(`Catch error in ${table}:`, err.message);
        }
    }
}

inspectTables();
