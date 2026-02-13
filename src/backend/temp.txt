const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const desc = "This premium item is carefully selected for your daily needs. High quality, durable, and worth every coin.";
const products = {
    consumer: [
        { id: 1, name: 'แปรงสีฟันdd', price: 550, icon: '🪥', description: desc, category: 'consumer' },
        { id: 2, name: 'ยาสีฟัน', price: 850, icon: '🦷', description: desc, category: 'consumer' },
        { id: 3, name: 'มีดโกนหนวด', price: 1200, icon: '🪒', description: desc, category: 'consumer' },
        { id: 4, name: 'ยาสระผม', price: 1590, icon: '🧴', description: desc, category: 'consumer' },
        { id: 5, name: 'ทิชชู่', price: 450, icon: '🧻', description: desc, category: 'consumer' },
        { id: 6, name: 'สบู่', price: 350, icon: '🧼', description: desc, category: 'consumer' },
        { id: 7, name: 'น้ำยาซักผ้า', price: 1290, icon: '🧺', description: desc, category: 'consumer' },
        { id: 8, name: 'น้ำยาล้างจาน', price: 490, icon: '🍽️', description: desc, category: 'consumer' }
    ],
    consumable: [
        { id: 9, name: 'ข้าวสาร (5kg)', price: 2500, icon: '🍚', description: desc, category: 'consumable' },
        { id: 10, name: 'บะหมี่กึ่งสำเร็จรูป', price: 150, icon: '🍜', description: desc, category: 'consumable' },
        { id: 11, name: 'อาหารกระป๋อง', price: 350, icon: '🥫', description: desc, category: 'consumable' },
        { id: 12, name: 'อาหารแห้ง', price: 650, icon: '🥜', description: desc, category: 'consumable' },
        { id: 13, name: 'ซีเรียล', price: 1800, icon: '🥣', description: desc, category: 'consumable' },
        { id: 14, name: 'คุกกี้', price: 450, icon: '🍪', description: desc, category: 'consumable' },
        { id: 15, name: 'เวเฟอร์', price: 250, icon: '🧇', description: desc, category: 'consumable' },
        { id: 16, name: 'หมากฝรั่ง', price: 100, icon: '🍬', description: desc, category: 'consumable' },
        { id: 17, name: 'กาแฟผง', price: 1200, icon: '☕', description: desc, category: 'consumable' },
        { id: 18, name: 'น้ำดื่ม', price: 120, icon: '💧', description: desc, category: 'consumable' }
    ]
};

app.get('/api/products', (req, res) => {
    res.json(products);
});

app.listen(port, () => {
    console.log(`Backend API running at http://localhost:${port}`);
});
