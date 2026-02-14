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

    // Compute a normalized `coins` value for each order to ensure frontend gets a usable field
    const mapped = (data || []).map((order) => {
      const coins = (() => {
        if (order.coins_used != null) return order.coins_used;
        if (order.coinsUsed != null) return order.coinsUsed;
        if (order.coins != null) return order.coins;
        if (order.total_coin != null) return order.total_coin;
        if (order.total_price != null) return order.total_price;
        if (order.price != null) return Number(order.price) || 0;
        if (order.amount != null) return Number(order.amount) || 0;
        if (order.products) {
          const p = Array.isArray(order.products) ? order.products[0] : order.products;
          if (p) {
            if (p.coins != null) return p.coins;
            if (p.price_coin != null) return p.price_coin;
            if (p.price != null) return Number(p.price) || 0;
            if (p.total_price != null) return p.total_price;
          }
        }
        return 0;
      })();

      return {
        ...order,
        coins
      };
    });

    console.log('apiHistory: returning', mapped.length, 'orders for user', user_id);

    res.json({
      success: true,
      data: mapped
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router