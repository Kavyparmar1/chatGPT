const chatModel = require("../models/chat.model");

async function createChat(req,res) {
    try {
        const { title } = req.body;
        const user = req.user

    const chat = await chatModel.create({

        user:user._id, 
        title,
        lastActivity: Date.now()
    })
    res.status(201).json({
        message:"chat created successfully",
        chat:{
            id:chat._id,
            title:chat.title,
            lastActivity:chat.lastActivity,
            user:chat.user
        }
    })
    } catch (error) {
        return res.status(401).json({
            message:"errore",error
        }) 
    } 
}
module.exports = {
    createChat
}