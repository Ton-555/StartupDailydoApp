const supabase = require('./supabase');

async function inspectProducts() {
    try {
        const { data, error } = await supabase.from('products').select('*').limit(1);
        if (error) {
            console.error('Error:', error.message);
        } else if (data && data.length > 0) {
            console.log('PRODUCTS_COLUMNS:', JSON.stringify(Object.keys(data[0])));
            console.log('PRODUCT_EXAMPLE:', JSON.stringify(data[0]));
        }
    } catch (err) {
        console.error('Catch error:', err.message);
    }
}

inspectProducts();
