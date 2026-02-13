
const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

// GET /users/alltest - ดึงข้อมูลผู้ใช้งานทั้งหมด (สำหรับทดสอบ)
router.get('/alltest', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('*');

        if (error) {
            throw error;
        }

        res.json({ success: true, data });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
