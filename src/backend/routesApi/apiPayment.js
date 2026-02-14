const express = require('express');
const router = express.Router();
const omise = require('omise')({
    'publicKey': process.env.OMISE_PUBLIC_KEY,
    'secretKey': process.env.OMISE_SECRET_KEY
});
const supabase = require('../supabase');

// ดึงข้อมูลบัตรของ user เฉพาะคน
router.get('/user/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const { data, error } = await supabase
            .from('card_information')
            .select('*')
            .eq('user_id', userId);

        if (error) {
            throw error;
        }

        res.json({ success: true, data });
    } catch (error) {
        console.error('Error fetching user cards:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

//ต้องแก้จากข้อมูล react native เหลือเอาตัวแปรid user มาจาก แอป
router.post('/addcreditcard', async (req, res) => {
    try {
        const { users_id, omise_customer_id, number_card, cvv, name_card, expiration_date } = req.body;
        const { data, error } = await supabase
            .from('card_information')
            .insert([
                {
                    user_id: users_id,
                    omise_customer_id,
                    number_card,
                    cvv,
                    name_card,
                    expiration_date
                }
            ])
            .select();

        if (error) {
            throw error;
        }
        res.json({
            success: true,
            message: "เพิ่มข้อมูลบัตรสำเร็จ",
            data: data
        });

    } catch (error) {
        console.error('Error adding card:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }

});

// POST /payment/deletecard - ลบข้อมูลบัตร
router.post('/deletecard', async (req, res) => {
    try {
        const { users_id, id_card } = req.body;
        console.log(`[DELETE CARD] Request received - users_id: ${users_id}, id_card: ${id_card}`);

        // Validation: ต้องมี id_card เสมอเพื่อป้องกันการลบทั้งหมด
        if (!id_card) {
            return res.status(400).json({
                success: false,
                message: "Missing 'id_card'. Please provide both 'users_id' and 'id_card'."
            });
        }

        const { error } = await supabase
            .from('card_information')
            .delete()
            .eq('user_id', users_id)
            .eq('id', id_card); // ต้องตรงทั้ง User ID และ Card ID

        if (error) {
            throw error;
        }

        console.log(`[DELETE CARD] Successfully deleted card id: ${id_card} for user: ${users_id}`);

        res.json({
            success: true,
            message: "ลบข้อมูลบัตรสำเร็จ"
        });

    } catch (error) {
        console.error('Error deleting card:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// POST /payment/checkout - ตัดเงิน (แบบครั้งเดียว)
router.post('/checkout', async (req, res) => {
    const { name, number, expiryDate, cvc, amount } = req.body;
    try {
        let exp_month, exp_year;

        if (expiryDate.includes('-')) {
            // Format: YYYY-MM-DD
            const parts = expiryDate.split('-');
            exp_year = parts[0];
            exp_month = parts[1];
        } else if (expiryDate.includes('/')) {
            // Format: MM/YY
            const parts = expiryDate.split('/');
            exp_month = parts[0];
            exp_year = '20' + parts[1];
        } else {
            throw new Error('Invalid expiry date format. Use YYYY-MM-DD or MM/YY');
        }

        // 1. Create Token (Or Mock Token for demo)
        let token;
        const targetDemoNumber = '4242424242424245';
        const isDemo = number === targetDemoNumber || number.includes('*') || number.length < 12;

        console.log(`[Checkout] Processing payment - Number: ${number.slice(0, 4)}...${number.slice(-4)}, Amount: ${amount}, isDemo: ${isDemo}`);

        if (isDemo) {
            console.log('[Checkout] Demo mode detected');
            token = { id: 'tokn_test_mock' + Date.now() };
        } else {
            token = await omise.tokens.create({
                card: {
                    name: name,
                    number: number.replace(/\s/g, ''),
                    expiration_month: parseInt(exp_month),
                    expiration_year: parseInt(exp_year),
                    security_code: cvc
                }
            });
        }

        // 2. Charge (Or Mock Charge for demo)
        let charge;
        if (isDemo) {
            charge = {
                id: 'chrg_test_mock' + Date.now(),
                amount: Math.round(amount * 100),
                currency: 'thb',
                status: 'successful',
                created_at: new Date().toISOString()
            };
        } else {
            charge = await omise.charges.create({
                amount: Math.round(amount * 100), // Amount in satang
                currency: 'thb',
                card: token.id
            });
        }

        if (charge.status === 'successful') {
            res.json({ success: true, charge });
        } else {
            res.status(400).json({ success: false, message: charge.failure_message || 'Charge failed', charge });
        }

    } catch (error) {
        console.error('Checkout error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

router.post('/savelog', async (req, res) => {
    try {
        const { users_id, amount, type, detail } = req.body;

        if (!users_id) return res.status(400).json({ success: false, message: 'Missing users_id' });

        // Basic Deduplication: Check if a similar log was created in the last 10 seconds
        const tenSecondsAgo = new Date();
        tenSecondsAgo.setSeconds(tenSecondsAgo.getSeconds() - 10);

        const { data: existing, error: checkError } = await supabase
            .from('orders')
            .select('*')
            .eq('user_id', users_id)
            .eq('detail', detail || `Payment for ${type}`)
            .gte('created_at', tenSecondsAgo.toISOString())
            .limit(1);

        if (existing && existing.length > 0) {
            console.log('[Savelog] Duplicate request detected, skipping processing.');
            return res.json({ success: true, message: 'Duplicate log suppressed', data: existing[0] });
        }

        // Reward coins for both 'coin' top-ups and 'package' subscriptions
        if (type === 'coin' || type === 'package') {
            const { data: user, error: fetchError } = await supabase
                .from('users')
                .select('coin_balance')
                .eq('users_id', users_id)
                .single();

            if (fetchError) throw fetchError;

            const increment = parseInt(amount);
            const newBalance = (user.coin_balance || 0) + increment;

            const { error: updateError } = await supabase
                .from('users')
                .update({ coin_balance: newBalance })
                .eq('users_id', users_id);

            if (updateError) throw updateError;
        }

        // Record in orders
        const { data, error } = await supabase
            .from('orders')
            .insert([
                {
                    user_id: users_id,
                    total_coin: type === 'coin' ? 0 : parseInt(amount),
                    quantity: 1,
                    detail: detail || `Payment for ${type}`,
                    status: 'completed' // Assume completed if log is saved
                }
            ])
            .select();

        if (error) throw error;

        res.json({ success: true, message: 'Log saved successfully', data: data[0] });
    } catch (error) {
        console.error('Error saving log:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get('/check-subscription/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // Check for package orders in the last 30 days
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('user_id', userId)
            .ilike('detail', '%Plan%') // Packages are named "Standard Plan", etc.
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

router.post('/savepayment', async (req, res) => {
    try {
        const { success, charge, users_id } = req.body;

        if (!users_id || !charge) {
            return res.status(400).json({ success: false, message: 'Missing users_id or charge data' });
        }

        const { data, error } = await supabase
            .from('payment_logs')
            .insert([
                {
                    user_id: users_id,
                    omise_charge_id: charge.id,
                    amount: charge.amount, // in satang
                    status: success ? 'successful' : 'failed',
                    created_at: charge.created_at || new Date().toISOString()
                }
            ])
            .select();

        if (error) {
            throw error;
        }

        res.json({
            success: true,
            message: 'Payment record saved successfully',
            data: data[0]
        });

    } catch (err) {
        console.error('Error saving payment:', err);
        res.status(500).json({ success: false, message: err.message });
    }
});



module.exports = router;