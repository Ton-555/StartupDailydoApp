const supabase = require('./supabase');

async function inspectUser() {
    try {
        const { data, error } = await supabase.from('users').select('*').limit(1);
        if (error) {
            console.error('Error:', error.message);
        } else if (data && data.length > 0) {
            console.log('USERS_COLUMNS:', JSON.stringify(Object.keys(data[0])));
            console.log('USER_EXAMPLE_TYPES:', JSON.stringify(Object.fromEntries(Object.entries(data[0]).map(([k, v]) => [k, typeof v]))));
            console.log('COIN_BALANCE_VALUE:', data[0].coin_balance);
        }
    } catch (err) {
        console.error('Catch error:', err.message);
    }
}

inspectUser();
