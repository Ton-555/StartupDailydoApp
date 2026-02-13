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
const addressRouter = require('./routesApi/apiAddress');

//หลังโค้ดบรรนี้ให้เรียกใช้ api

// api ของ payment ซึ่งมีอะไรบ้างให้ดูใน api Pyament.js
// api ของ payment ซึ่งมีอะไรบ้างให้ดูใน api Pyament.js
app.use('/payment', paymentRouter);

app.use('/address', addressRouter);

app.use('/users', userRouter);

app.listen(port, () => {
    console.log(`Backend API listening on port ${port}`);
});
