    const express = require('express')
    const app = express()
    //Router required
    const authRoutes = require('./routes/auth.routes')
    const chatRoutes = require('./routes/chat.routes')
    const cookieparser = require('cookie-parser')
    const cors = require('cors')
    const path = require('path')

    //middleware
    app.use(express.json())
    app.use(cors({
        origin:"http://localhost:5173",
        credentials:true,
    }))
    app.use(cookieparser())
    app.use(express.static(path.join(__dirname, '../public')))
    app.use('/api/auth', authRoutes)
    app.use('/api/chat', chatRoutes)

    app.get("*name",(req,res)=>{
        res.sendFile(path.join(__dirname, '../public/index.html'))
    })
    module.exports = app