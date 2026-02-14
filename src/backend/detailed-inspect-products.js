const supabase = require('./supabase');

async function inspectProducts() {
    try {
        const { data, error } = await supabase.from('products').select('*');
        if (error) {
            console.error('Error:', error.message);
        } else if (data) {
            console.log('COUNT:', data.length);
            data.slice(0, 3).forEach((p, i) => {
                console.log(`PRODUCT_${i}:`, JSON.stringify(p));
            });
        }
    } catch (err) {
        console.error('Catch error:', err.message);
    }
}

inspectProducts();
