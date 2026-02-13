const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

// POST /address/add-address - เพิ่ม/แก้ไขที่อยู่ (ใช้ Logic เดียวกันคือ Update)
router.post('/add-address', async (req, res) => {
    try {
        const { id_user, address } = req.body;

        const { data, error } = await supabase
            .from('users')
            .update({ address: address })
            .eq('id_user', id_user)
            .select();

        if (error) {
            throw error;
        }

        res.json({
            success: true,
            message: "บันทึกที่อยู่สำเร็จ",
            data: data
        });

    } catch (error) {
        console.error('Error adding address:', error);
        res.status(500).json({ success: false, message: error.message });
    }
}); 

// POST /address/edit-address - แก้ไขที่อยู่ (ทำงานเหมือน Add)
router.post('/edit-address', async (req, res) => {
    try {
        const { id_user, address } = req.body;

        const { data, error } = await supabase
            .from('users')
            .update({ address: address })
            .eq('id_user', id_user)
            .select();

        if (error) {
            throw error;
        }

        res.json({
            success: true,
            message: "แก้ไขที่อยู่สำเร็จ",
            data: data
        });

    } catch (error) {
        console.error('Error editing address:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// POST /address/delete-address - ลบที่อยู่ (Set เป็น NULL หรือค่าว่าง)
router.post('/delete-address', async (req, res) => {
    try {
        const { id_user } = req.body;
        const { data, error } = await supabase
            .from('users')
            .update({ address: "" }) // แก้จาก null เป็น "" ตาม Requirement
            .eq('id_user', id_user)
            .select();

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

// GET /address/get-address/:id_user - ดึงที่อยู่ของ User
router.get('/get-address/:id_user', async (req, res) => {
    try {
        const { id_user } = req.params;

        const { data, error } = await supabase
            .from('users')
            .select('address')
            .eq('id_user', id_user)
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
