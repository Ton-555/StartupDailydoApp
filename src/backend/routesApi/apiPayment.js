const express = require('express');
const router = express.Router();
const omise = require('omise')({
    'publicKey': process.env.OMISE_PUBLIC_KEY,
    'secretKey': process.env.OMISE_SECRET_KEY
});
const supabase = require('../supabase');

//เหลือเปรียบเทียบข้อมูล id ลูกค้า 
router.get('/allcardtest', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('card_information')
            .select('*');

        if (error) {
            throw error;
        }

        res.json({ success: true, data });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

//ต้องแก้จากข้อมูล react native เหลือเอาตัวแปรid user มาจาก แอป
router.post('/addcreditcard', async (req, res) => {
    try {
        const { user_id, omise_customer_id, number_card, cvv, name_card, expiration_date } = req.body;
        const { data, error } = await supabase
            .from('card_information')
            .insert([
                {
                    user_id,
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
        const { user_id, id_card } = req.body;
        console.log(`[DELETE CARD] Request received - user_id: ${user_id}, id_card: ${id_card}`);

        // Validation: ต้องมี id_card เสมอเพื่อป้องกันการลบทั้งหมด
        if (!id_card) {
            return res.status(400).json({
                success: false,
                message: "Missing 'id_card'. Please provide both 'user_id' and 'id_card'."
            });
        }

        const { error } = await supabase
            .from('card_information')
            .delete()
            .eq('user_id', user_id)
            .eq('id', id_card); // ต้องตรงทั้ง User ID และ Card ID

        if (error) {
            throw error;
        }

        console.log(`[DELETE CARD] Successfully deleted card id: ${id_card} for user: ${user_id}`);

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
        const [exp_month, exp_year] = expiryDate.split('/');

        // 1. Create Token (Frontend ควรทำเอง)
        const token = await omise.tokens.create({
            card: {
                name: name,
                number: number.replace(/\s/g, ''),
                expiration_month: parseInt(exp_month),
                expiration_year: parseInt(20 + exp_year),
                security_code: cvc
            }
        });

        // 2. Charge
        const charge = await omise.charges.create({
            amount: amount * 100, // Amount in satang
            currency: 'thb',
            card: token.id
        });

        if (charge.status === 'successful' || charge.status === 'pending') {
            res.json({ success: true, charge });
        } else {
            res.status(400).json({ success: false, message: 'Charge failed', charge });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
});




module.exports = router;