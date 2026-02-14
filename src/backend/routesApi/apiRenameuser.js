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
// /users/alltest
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
// /users/id/:id
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
      .eq('id_user', id)
      .single();

    if (error) throw error;

    return sendSuccess(res, data);

  } catch (err) {
    return sendError(res, err);
  }

});


// =================================
// GET USER BY FIREBASE UID
// /users/firebase/:uid
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
// PATCH /users/:id/fullname
// =================================
router.patch('/:id/fullname', async (req, res) => {

  try {

    const id = parseInt(req.params.id);
    const { full_name } = req.body;

    if (!id || !full_name) {
      return sendError(res, 'Missing fullname or id', 400);
    }

    // ⭐ แยกชื่อ
    const nameParts = full_name.trim().split(' ');

    const first_name = nameParts[0];
    const last_name = nameParts.slice(1).join(' ') || null;

    const { data, error } = await supabase
      .from('users')
      .update({
        first_name,
        last_name
      })
      .eq('id_user', id)
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

      // assign into payload for update
      payload = Object.assign({}, payload, { first_name, last_name });
      // remove full_name to avoid storing unknown column
      delete payload.full_name;
    }

    const { data, error } = await supabase
      .from('users')
      .update(payload)
      .eq('id_user', id)
      .select()
      .single();

    if (error) throw error;

    return sendSuccess(res, data);

  } catch (err) {
    return sendError(res, err);
  }

});


// =================================
// UPDATE COIN
// PATCH /users/:id/coin
// =================================
router.patch('/:id/coin', async (req, res) => {

  try {

    const id = parseInt(req.params.id);
    const amount = Number(req.body.amount);

    if (!id || isNaN(amount)) {
      return sendError(res, 'Invalid input', 400);
    }

    // ⭐ ดึง coin ปัจจุบัน
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('coin_balance')
      .eq('id_user', id)
      .single();

    if (fetchError) throw fetchError;

    const newCoin = user.coin_balance + amount;

    if (newCoin < 0) {
      return sendError(res, 'Coin not enough', 400);
    }

    const { data, error } = await supabase
      .from('users')
      .update({ coin_balance: newCoin })
      .eq('id_user', id)
      .select()
      .single();

    if (error) throw error;

    return sendSuccess(res, data);

  } catch (err) {
    return sendError(res, err);
  }

});


// =================================
// UPDATE FULL NAME (PUT)
// PUT /users/:id/fullname
// =================================
router.put('/:id/fullname', async (req, res) => {

  try {

    const id = parseInt(req.params.id);
    const { full_name } = req.body;

    if (!id || !full_name) {
      return sendError(res, 'Missing fullname or id', 400);
    }

    const nameParts = full_name.trim().split(/\s+/);
    const first_name = nameParts[0];
    const last_name = nameParts.slice(1).join(' ') || null;

    const { data, error } = await supabase
      .from('users')
      .update({ first_name, last_name })
      .eq('id_user', id)
      .select()
      .single();

    if (error) throw error;

    return sendSuccess(res, data);

  } catch (err) {
    return sendError(res, err);
  }

});


// =================================
// UPDATE EMAIL (PUT)
// PUT /users/:id/email
// =================================
router.put('/:id/email', async (req, res) => {

  try {

    const id = parseInt(req.params.id);
    const { email } = req.body;

    if (!id || !email) {
      return sendError(res, 'Missing email or id', 400);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return sendError(res, 'Invalid email format', 400);
    }

    // Try to find user by id_user first
    let { data, error } = await supabase
      .from('users')
      .update({ email: email.toLowerCase().trim() })
      .eq('id_user', id)
      .select()
      .single();

    // If not found by id_user, try users_id
    if (error) {
      const result = await supabase
        .from('users')
        .update({ email: email.toLowerCase().trim() })
        .eq('users_id', id)
        .select()
        .single();
      data = result.data;
      error = result.error;
    }

    if (error) throw error;

    return sendSuccess(res, data);

  } catch (err) {
    console.error('Email update error:', err);
    return sendError(res, err);
  }

});


// =================================
// UPDATE PHONE (PUT)
// PUT /users/:id/phone
// =================================
router.put('/:id/phone', async (req, res) => {

  try {

    const id = parseInt(req.params.id);
    const { phone } = req.body;

    if (!id || !phone) {
      return sendError(res, 'Missing phone or id', 400);
    }

    // Validate phone format (exactly 10 digits)
    const phoneDigitsOnly = phone.replace(/\D/g, '');
    
    if (phoneDigitsOnly.length !== 10) {
      return sendError(res, 'Invalid phone format (must be exactly 10 digits)', 400);
    }

    // Try to find user by id_user first
    let { data, error } = await supabase
      .from('users')
      .update({ phone: phone.trim() })
      .eq('id_user', id)
      .select()
      .single();

    // If not found by id_user, try users_id
    if (error) {
      const result = await supabase
        .from('users')
        .update({ phone: phone.trim() })
        .eq('users_id', id)
        .select()
        .single();
      data = result.data;
      error = result.error;
    }

    if (error) throw error;

    return sendSuccess(res, data);

  } catch (err) {
    console.error('Phone update error:', err);
    return sendError(res, err);
  }

});


module.exports = router;