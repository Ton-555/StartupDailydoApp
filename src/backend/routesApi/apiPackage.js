const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

// GET all packages
// GET /package/all
router.get('/all', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('packages')
            .select('*')
            .order('package_id', { ascending: true });

        if (error) {
            throw error;
        }

        res.json({ success: true, data });
    } catch (error) {
        console.error('Error fetching packages:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET package by id
router.get('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (!id) return res.status(400).json({ success: false, message: 'Invalid id' });

        const { data, error } = await supabase
            .from('packages')
            .select('*')
            .eq('package_id', id)
            .single();

        if (error) {
            throw error;
        }

        if (!data) return res.status(404).json({ success: false, message: 'Package not found' });

        res.json({ success: true, data });
    } catch (error) {
        console.error('Error fetching package by id:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET check subscription status
// GET /package/check/:userId
router.get('/check/:userId', async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        if (!userId) {
            return res.status(400).json({ success: false, message: 'Invalid user id' });
        }

        const { data, error } = await supabase
            .from('users')
            .select('package_end')
            .eq('users_id', userId)
            .single();

        if (error) {
            throw error;
        }

        let hasActivePackage = false;
        if (data && data.package_end) {
            const endDate = new Date(data.package_end);
            if (endDate > new Date()) {
                hasActivePackage = true;
            }
        }

        res.json({ success: true, hasActivePackage });
    } catch (error) {
        console.error('Error checking package status:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
