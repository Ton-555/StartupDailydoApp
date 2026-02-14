const express = require('express')
const router = express.Router()
const supabase = require('../supabase')

router.get('/history/:user_id', async (req, res) => {
  const { user_id } = req.params

  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      products(*)
    `)
    .eq('user_id', user_id)

  if (error) return res.status(400).json(error)

  res.json(data)
})

module.exports = router