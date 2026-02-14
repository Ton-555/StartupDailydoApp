const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

// POST /address/add-address - เพิ่ม/แก้ไขที่อยู่
router.post('/add-address', async (req, res) => {
    try {
        const { users_id, address } = req.body;

        const { data, error } = await supabase
            .from('users')
            .update({ address: address })
            .eq('users_id', users_id)
            .select();

        if (error) {
            throw error;
        }

        res.json({
            success: true,
            message: "บันทึกที่อยู่สำเร็จ",
            data: data[0]
        });

    } catch (error) {
        console.error('Error adding address:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// POST /address/edit-address (Alias for add-address)
router.post('/edit-address', async (req, res) => {
    try {
        const { users_id, address } = req.body;

        const { data, error } = await supabase
            .from('users')
            .update({ address: address })
            .eq('users_id', users_id)
            .select();

        if (error) {
            throw error;
        }

        res.json({
            success: true,
            message: "แก้ไขที่อยู่สำเร็จ",
            data: data[0]
        });

    } catch (error) {
        console.error('Error editing address:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// POST /address/delete-address
router.post('/delete-address', async (req, res) => {
    try {
        const { users_id } = req.body;
        const { error } = await supabase
            .from('users')
            .update({ address: "" })
            .eq('users_id', users_id);

        if (error) {
            throw error;
        }

        res.json({
            success: true,
            message: "ลบที่อยู่สำเร็จ"
        });

    } catch (error) {
        console.error('Error deleting address:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET /address/get-address/:users_id
router.get('/get-address/:users_id', async (req, res) => {
    try {
        const { users_id } = req.params;

        const { data, error } = await supabase
            .from('users')
            .select('address')
            .eq('users_id', users_id)
            .single();

        if (error) {
            throw error;
        }

        res.json({
            success: true,
            address: data.address
        });

    } catch (error) {
        console.error('Error fetching address:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
