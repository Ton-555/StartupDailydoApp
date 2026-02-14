
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

module.exports = router;
