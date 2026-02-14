const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

router.get('/all', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('packages')
            .select('*');

        if (error) {
            throw error;
        }

        res.json({ success: true, data });
    } catch (error) {
        console.error('Error fetching package:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get('/check/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // Fetch package IDs from packages table to be dynamic
        const { data: pkgData, error: pkgError } = await supabase
            .from('packages')
            .select('package_id');

        if (pkgError) throw pkgError;
        const pkgIds = pkgData.map(p => p.package_id);

        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('user_id', userId)
            .in('products_id', pkgIds)
            .gte('created_at', thirtyDaysAgo.toISOString());

        if (error) throw error;

        res.json({
            success: true,
            hasActivePackage: data.length > 0,
            activePackage: data.length > 0 ? data[0] : null
        });
    } catch (error) {
        console.error('Error checking subscription:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
console.log("Package route loaded");