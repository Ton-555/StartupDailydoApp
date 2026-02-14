const express = require('express')
const router = express.Router()
const supabase = require('../supabase')

router.post('/buy', async (req, res) => {
  try {
    const user_id = Number(req.body.user_id);
    const product_id = Number(req.body.product_id);
    const quantity = Number(req.body.quantity || 1);
    const months = Number(req.body.months || 1);

    console.log('[API Buy] Request:', { user_id, product_id, quantity, months });

    if (isNaN(user_id) || isNaN(product_id)) {
      return res.status(400).json({ error: 'Valid user_id and product_id are required' })
    }

    // 1️⃣ ดึงราคาสินค้าจริง
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('products_id, price_coin')
      .eq('products_id', product_id)
      .single()

    if (productError || !product) {
      console.error('[API Buy] Product fetch error:', productError);
      return res.status(400).json({ error: 'Product not found' })
    }

    const unitPrice = product.price_coin
    const total_price = unitPrice * quantity * months;
    console.log(`[API Buy] Calculation: ${unitPrice} * ${quantity} * ${months} = ${total_price}`);

    // 2️⃣ ดึง coin user
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('users_id, coin_balance')
      .eq('users_id', user_id)
      .single()

    if (userError || !user) {
      return res.status(400).json({ error: 'User not found' })
    }

    if (user.coin_balance < total_price) {
      return res.status(400).json({ error: 'Not enough coin. Required: ' + total_price + ', has: ' + user.coin_balance })
    }

    // 3️⃣ หัก coin
    const { error: updateError } = await supabase
      .from('users')
      .update({ coin_balance: user.coin_balance - total_price })
      .eq('users_id', user_id)

    if (updateError) {
      return res.status(400).json(updateError)
    }

    // 4️⃣ สร้าง order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user_id,
        products_id: product_id,
        total_coin: total_price
      })
      .select()

    if (orderError) {
      return res.status(400).json(orderError)
    }

    // 5️⃣ ดึงข้อมูล user ล่าสุดเพื่อส่งกลับไปอัปเดตแอป
    const { data: updatedUser } = await supabase
      .from('users')
      .select('*')
      .eq('users_id', user_id)
      .single()

    return res.json({
      message: 'Purchase successful',
      order: order,
      user: updatedUser
    })

  } catch (err) {
    return res.status(500).json({ error: 'Server error', detail: err.message })
  }
})

module.exports = router