const express = require('express')
const router = express.Router()
const supabase = require('../supabase')



router.get('/:user_id', async (req, res) => {
  const { user_id } = req.params;

  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        products(*)
      `)
      .eq('user_id', user_id);

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      data: data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router