const express = require('express')
const router = express.Router()
const supabase = require('../supabase')

router.post('/buy', async (req, res) => {
  try {
    const { user_id, product_id } = req.body

    if (!user_id || !product_id) {
      return res.status(400).json({ error: 'user_id and product_id required' })
    }

    // 1️⃣ ดึงราคาสินค้าจริง
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id, price')
      .eq('id', product_id)
      .single()

    if (productError || !product) {
      return res.status(400).json({ error: 'Product not found' })
    }

    const price = product.price

    // 2️⃣ ดึง coin user
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, coin')
      .eq('id', user_id)
      .single()

    if (userError || !user) {
      return res.status(400).json({ error: 'User not found' })
    }

    if (user.coin < price) {
      return res.status(400).json({ error: 'Not enough coin' })
    }

    // 3️⃣ หัก coin
    const { error: updateError } = await supabase
      .from('users')
      .update({ coin: user.coin - price })
      .eq('id', user_id)

    if (updateError) {
      return res.status(400).json(updateError)
    }

    // 4️⃣ สร้าง order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user_id,
        products_id: product_id,
        total_coin: price
      })
      .select()

    if (orderError) {
      return res.status(400).json(orderError)
    }

    return res.json({
      message: 'Purchase successful',
      order: order
    })

  } catch (err) {
    return res.status(500).json({ error: 'Server error', detail: err.message })
  }
})

module.exports = router