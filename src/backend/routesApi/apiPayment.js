const express = require('express');
const router = express.Router();
const omise = require('omise')({
    'publicKey': process.env.OMISE_PUBLIC_KEY,
    'secretKey': process.env.OMISE_SECRET_KEY
});

router.post('/checkout', async (req, res) => {
    const { name, number, expiryDate, cvc, amount } = req.body;
    try {
        const [exp_month, exp_year] = expiryDate.split('/');

        const token = await omise.tokens.create({
            card: {
                name: name,
                number: number.replace(/\s/g, ''),
                expiration_month: parseInt(exp_month),
                expiration_year: parseInt(20 + exp_year),
                security_code: cvc
            }
        });


        const charge = await omise.charges.create({
            amount: amount * 100,
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