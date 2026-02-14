require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;
app.use(cors());
app.use(bodyParser.json());

//routes แต่ละไฟล์
const paymentRouter = require('./routesApi/apiPayment');
const userRouter = require('./routesApi/apiUser');
const renameUserRouter = require('./routesApi/apiRenameuser');
const registerRouter = require('./routesApi/apiAuth');
const productRouter = require('./routesApi/apiproduct');
const addressRouter = require('./routesApi/apiAddress');
const buyProductRouter = require('./routesApi/apiBuyProduct');
const addCoinRouter = require('./routesApi/apiAddCoin');
const historyRouter = require('./routesApi/apiHistory');

//หลังโค้ดบรรนี้ให้เรียกใช้ api

// api ของ payment ซึ่งมีอะไรบ้างให้ดูใน api Pyament.js
app.use('/payment', paymentRouter);
app.use('/auth', registerRouter);
app.use('/users', userRouter);
app.use('/users', renameUserRouter);
app.use('/products', productRouter);
app.use('/address', addressRouter);
app.use('/buy', buyProductRouter);
app.use('/addcoin', addCoinRouter);
app.use('/history', historyRouter);

app.listen(port, () => {
    console.log(`Backend API listening on port ${port}`);
});
