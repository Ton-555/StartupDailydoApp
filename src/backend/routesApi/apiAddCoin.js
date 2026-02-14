const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

// POST /addcoin/:id
// body: { amount: number }
// เพิ่มจำนวน coin ให้ user (amount เป็นจำนวนที่จะ + ถ้าเป็นลบจะลองหักเช็คไม่ให้ติดลบ)
router.post('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const amount = Number(req.body.amount);

        if (!id || isNaN(amount)) {
            return res.status(400).json({ success: false, message: 'Invalid id or amount' });
        }

        // ดึงยอด coin ปัจจุบัน
        const { data: user, error: fetchError } = await supabase
            .from('users')
            .select('users_id, coin_balance')
            .eq('users_id', id)
            .single();

        if (fetchError || !user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const current = Number(user.coin_balance || 0);
        const newBalance = current + amount;

        if (newBalance < 0) {
            return res.status(400).json({ success: false, message: 'Insufficient coins' });
        }

        const { data, error } = await supabase
            .from('users')
            .update({ coin_balance: newBalance })
            .eq('users_id', id)
            .select()
            .single();

        if (error) throw error;

        return res.json({ success: true, data });
    } catch (err) {
        console.error('apiAddCoin error:', err);
        return res.status(500).json({ success: false, message: err.message || String(err) });
    }
});

module.exports = router;