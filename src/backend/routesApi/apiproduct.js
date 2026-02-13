const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

// GET 
router.get('/all', async (req, res) => {
    try {
        // ensure consistent ordering and return all columns
        // Do a plain select first (avoid ordering by a non-existent column)
        const { data, error } = await supabase
            .from('products')
            .select('*');

        if (error) {
            throw error;
        }

        res.json({ success: true, data });
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET by id
router.get('/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (!id) return res.status(400).json({ success: false, message: 'Invalid id' });

        // Try common id columns as some schemas use different names
        const idCols = ['id', 'id_product', 'product_id', 'productid'];
        let finalData = null;
        let finalError = null;

        for (const col of idCols) {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq(col, id)
                .limit(1);

            if (error) {
                // If column doesn't exist, try next
                if (error.message && error.message.includes('does not exist')) {
                    continue;
                }
                finalError = error;
                break;
            }

            if (data && data.length > 0) {
                finalData = data[0];
                break;
            }
        }

        if (finalError) throw finalError;
        if (!finalData) return res.status(404).json({ success: false, message: 'product not found' });

        res.json({ success: true, data: finalData });
    } catch (error) {
        console.error('Error fetching product by id:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
console.log("Product route loaded");