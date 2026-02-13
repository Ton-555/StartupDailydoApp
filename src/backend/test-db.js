const supabase = require('./supabase');

async function testProducts() {
    try {
        const { data, error } = await supabase.from('products').select('*');
        if (error) {
            console.error('Error:', error);
        } else {
            console.log('Products:', JSON.stringify(data, null, 2));
        }
    } catch (err) {
        console.error('Catch error:', err);
    }
}

testProducts();
