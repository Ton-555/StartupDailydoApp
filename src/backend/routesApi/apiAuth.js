const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

// Register endpoint
router.post('/register', async (req, res) => {
    try {
        const { user_id, username, password, first_name = '', last_name = '' } = req.body; // รับจากแอป

        const userNameToUse = username || user_id;

        if (!userNameToUse || !password) {
            return res.status(400).json({ success: false, message: 'username (or user_id) and password are required' });
        }

        // ตรวจสอบว่ามี username อยู่แล้วหรือไม่
        const { data: existing, error: selectErr } = await supabase
            .from('users')
            .select('username')
            .eq('username', userNameToUse)
            .limit(1);

        if (selectErr) throw selectErr;
        if (existing && existing.length > 0) {
            return res.status(409).json({ success: false, message: 'username already exists' });
        }

        const { data, error } = await supabase
            .from('users')
            .insert([
                {
                    address: '',
                    coin_balance: 0,
                    first_name: first_name,
                    last_name: last_name,
                    username: userNameToUse,
                    password: password
                }
            ])
            .select();

        if (error) throw error;

        res.status(201).json({ success: true, message: 'บันทึกสำเร็จ', data: data[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// Login endpoint
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) return res.status(400).json({ success: false, message: 'username and password required' });

        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('username', username)
            .eq('password', password)
            .limit(1);

        if (error) throw error;
        if (!data || data.length === 0) return res.status(401).json({ success: false, message: 'invalid credentials' });

        const user = data[0];
        // remove password before returning
        if (user.password) delete user.password;

        res.json({ success: true, data: user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
