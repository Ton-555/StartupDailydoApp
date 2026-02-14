const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

// =================================
// RESPONSE FORMAT กลาง
// =================================
const sendSuccess = (res, data) => {
    return res.json({
        success: true,
        data
    });
};

const sendError = (res, err, code = 500) => {
    console.error(err);
    return res.status(code).json({
        success: false,
        message: err.message || err
    });
};

// =================================
// GET ALL USERS
// GET /users/alltest
// =================================
router.get('/alltest', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('*');

        if (error) throw error;
        return sendSuccess(res, data);
    } catch (err) {
        return sendError(res, err);
    }
});

// =================================
// GET USER BY ID
// GET /users/id/:id
// =================================
router.get('/id/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (!id) {
            return sendError(res, 'Invalid user id', 400);
        }

        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('users_id', id)
            .single();

        if (error) throw error;
        return sendSuccess(res, data);
    } catch (err) {
        return sendError(res, err);
    }
});

// =================================
// GET USER BY FIREBASE UID
// GET /users/firebase/:uid
// =================================
router.get('/firebase/:uid', async (req, res) => {
    try {
        const uid = req.params.uid;
        if (!uid) {
            return sendError(res, 'Missing firebase uid', 400);
        }

        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('firebase_uid', uid)
            .single();

        if (error) throw error;
        return sendSuccess(res, data);
    } catch (err) {
        return sendError(res, err);
    }
});

// =================================
// UPDATE FULL NAME
// PUT /users/:id/fullname
// =================================
router.put('/:id/fullname', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { full_name } = req.body;

        if (!id || !full_name) {
            return sendError(res, 'Missing fullname or id', 400);
        }

        // ⭐ แยกชื่อ
        const nameParts = full_name.trim().split(/\s+/);
        const first_name = nameParts[0];
        const last_name = nameParts.slice(1).join(' ') || null;

        const { data, error } = await supabase
            .from('users')
            .update({
                first_name,
                last_name
            })
            .eq('users_id', id)
            .select()
            .single();

        if (error) throw error;
        return sendSuccess(res, data);
    } catch (err) {
        return sendError(res, err);
    }
});

// =================================
// UPDATE USER PROFILE (Generic)
// PUT /users/:id
// =================================
router.put('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (!id) {
            return sendError(res, 'Invalid user id', 400);
        }

        let payload = req.body || {};

        // If client sends full_name, split into first_name / last_name
        if (payload.full_name) {
            const nameParts = payload.full_name.trim().split(/\s+/);
            const first_name = nameParts.shift() || '';
            const last_name = nameParts.length ? nameParts.join(' ') : null;

            payload = Object.assign({}, payload, { first_name, last_name });
            delete payload.full_name;
        }

        const { data, error } = await supabase
            .from('users')
            .update(payload)
            .eq('users_id', id)
            .select()
            .single();

        if (error) throw error;
        return sendSuccess(res, data);
    } catch (err) {
        return sendError(res, err);
    }
});

// =================================
// BUY PACKAGE
// POST /users/:id/buy-package
// body: { package_id }
// =================================
router.post('/:id/buy-package', async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const { package_id } = req.body;

        if (!userId || !package_id) {
            return sendError(res, 'Missing user id or package id', 400);
        }

        // 1️⃣ ดึง user
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('users_id', userId)
            .single();

        if (userError || !user) {
            return sendError(res, 'User not found', 404);
        }

        // --- NEW: Active Subscription Check ---
        if (user.package_end) {
            const currentEndDate = new Date(user.package_end);
            if (currentEndDate > new Date()) {
                return sendError(res, 'You already have an active subscription.', 400);
            }
        }
        // --------------------------------------

        // 2️⃣ ดึง package
        const { data: pkg, error: pkgError } = await supabase
            .from('packages')
            .select('*')
            .eq('package_id', package_id)
            .single();

        if (pkgError || !pkg) {
            return sendError(res, 'Package not found', 404);
        }

        // 3️⃣ เช็ค coin
        if (user.coin_balance < pkg.price) {
            return sendError(res, 'Not enough coin', 400);
        }

        // 4️⃣ คำนวณวันเริ่ม / วันหมด
        const now = new Date();
        const endDate = new Date();
        endDate.setDate(now.getDate() + pkg.duration_days);

        // 5️⃣ อัปเดต user
        const { data: updatedUser, error: updateError } = await supabase
            .from('users')
            .update({
                coin_balance: user.coin_balance - pkg.price,
                package_id: pkg.package_id,
                package_start: now,
                package_end: endDate
            })
            .eq('users_id', userId)
            .select()
            .single();

        if (updateError) throw updateError;

        // 6️⃣ บันทึกลง orders/logs
        const { error: logError } = await supabase
            .from('orders')
            .insert([
                {
                    user_id: userId,
                    total_coin: pkg.price,
                    products_id: pkg.package_id,
                    created_at: now
                }
            ]);

        if (logError) {
            console.error('Error logging package purchase:', logError);
            // We don't necessarily want to fail the whole request if logging fails after the update, 
            // but for debugging it's good to know.
        }

        return sendSuccess(res, {
            message: 'Package purchased successfully',
            user: updatedUser
        });

    } catch (err) {
        return sendError(res, err);
    }
});




module.exports = router;