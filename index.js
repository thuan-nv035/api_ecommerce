const express = require('express')
const app = express()
const port = 3000
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const bodyParser = require('body-parser')
const userRouter = require('./routers/user')
const authRouter = require('./routers/auth')
const productRouter = require('./routers/product')
const cartRouter = require('./routers/cart')
const orderRouter = require('./routers/order')
const commentsRouter = require('./routers/comment')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


dotenv.config()
mongoose.connect(process.env.MONGO_URL).then(data => console.log("ket noi db thanh cong")).catch(err => console.error("ket noi db that bai"));
app.use(express.json());
app.use('/api/v1/user', userRouter)
app.use('/api/v1/auth/', authRouter)
app.use('/api/v1/product', productRouter)
app.use('/api/v1/cart', cartRouter)
app.use('/api/v1/order', orderRouter)
app.use('/api/v1/product/comment', commentsRouter)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})