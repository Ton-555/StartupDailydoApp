const supabase = require('./supabase');

async function inspectProducts() {
    try {
        const { data, error } = await supabase.from('products').select('*').limit(1);
        if (error) {
            console.error('Error:', error.message);
        } else if (data && data.length > 0) {
            console.log('KEYS:', Object.keys(data[0]).join(','));
            console.log('ID_VAL:', data[0].products_id);
            console.log('NAME_VAL:', data[0].name);
            console.log('PROD_NAME_VAL:', data[0].product_name);
        }
    } catch (err) {
        console.error('Catch error:', err.message);
    }
}

inspectProducts();
