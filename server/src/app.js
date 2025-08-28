    const express = require('express')
    const app = express()
    //Router required
    const authRoutes = require('./routes/auth.routes')
    const chatRoutes = require('./routes/chat.routes')
    const cookieparser = require('cookie-parser')
    const cors = require('cors')

    //middleware
    app.use(express.json())
    app.use(cors({
        origin:"http://localhost:5173",
        credentials:true,
    }))
    app.use(cookieparser())
    app.use('/api/auth', authRoutes)
    app.use('/api/chat', chatRoutes)

    module.exports = app