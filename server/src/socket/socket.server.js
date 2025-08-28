const { Server, Socket } = require("socket.io");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const { genrateResponse, genrateVectors } = require("../service/ai.service");
const messageModel = require("../models/message.model");
const { createMemory, searchMemory } = require("../service/vector.service");

function shouldStoreResponse(response) {
  if (!response || typeof response !== "string") {
    return false;
  }
  const minLength = 50;
  if (response.length < minLength) {
    return false;
  }
  const uselessPhrases = [
    // Uncertainty responses
    "i don't know",
    "i'm not sure",
    "i can't help",
    "i don't understand",

    // Generic responses
    "sorry",
    "unclear",
    "can you clarify",
    "please provide more details",

    // Conversation fillers
    "hello",
    "hi there",
    "how are you",
    "goodbye",
    "bye",
  ];
  const responseText = response.toLowerCase();
  for (let pharse of uselessPhrases) {
    if (responseText.includes(pharse)) {
      return false;
    }
  }
  const valuableKeywords = [
    // Educational content
    "here's how",
    "you can",
    "step by step",
    "tutorial",
    "guide",
    "explanation",

    // Problem-solving
    "solution",
    "fix",
    "solve",
    "resolve",
    "troubleshoot",

    // Technical content
    "code",
    "function",
    "implementation",
    "example",
    "syntax",

    // Learning content
    "learn",
    "understand",
    "concept",
    "principle",
    "theory",

    // How-to content
    "create",
    "build",
    "setup",
    "configure",
    "install",
  ];

  let hasValuableKeywords = false;
  for (let keywords of valuableKeywords) {
    if (responseText.includes(keywords)) {
      hasValuableKeywords = true;
      break;
    }
  }
  return hasValuableKeywords;
}
function initSocketServer(httpserver) {
  const io = new Server(httpserver, {
    cors:{
      origin:"http://localhost:5173",
      credentials:true
    } 
  });

  //middleware
  io.use(async (socket, next) => {
   const cookies = socket.handshake.headers.cookie 
  ? cookie.parse(socket.handshake.headers.cookie) 
  : {};

    if (!cookies.token) {
      return next(new Error("unauthorized user"));
    }
    try {
      const decode = jwt.verify(cookies.token, process.env.JWT_SEC_KEY);
      const user = await userModel.findById(decode.id);

      socket.user = user;
      next();
    } catch (error) {
      next(new Error("unauthorized user"));
    }
  });

  io.on("connection", (socket) => {
    console.log("New client connected", socket.id);

    socket.on("user-message", async (messagePayload) => {
   
      const [userMessageData, vectors] = await Promise.all([
        //monogdb create db for user message
        messageModel.create({
          chat: messagePayload.chat,
          user: socket.user._id,
          content: messagePayload.content,
          role: "user",
        }),
        //genrate vectors
        genrateVectors(messagePayload.content)
        //usermessagedata save in pincecon
       
      ]);
       await createMemory({
          messageId: userMessageData._id,
          vectors,
          metadata: { 
            chat: messagePayload.chat.toString(),
            user: socket.user._id.toString(),
            content: messagePayload.content,
          } 
        })
      //search memory rag implement
      const memory = await searchMemory({
        queryvector: vectors,
        limit: 5,
        metadata: {
          user: socket.user._id,
        },
      });

      //create a user role database with pinecon

      const chatHistory = (
        await messageModel
          .find({
            chat: messagePayload.chat,
          })
          .sort({ createdAt: -1 })
          .limit(20)
          .lean()
      ).reverse();

      const stm = chatHistory.slice(-5).map((item) => {
        return {
          role: item.role,
          parts: [{ text: item.content }],
        };
      });
      const ltm = [
        {
          role: "user",
          parts: [
            {
              text: `
  
    these are some previous messages from the chat, use them to generate a response
${memory.map((item) => item.metadata.content).join("\n")}
    `,
            },
          ],
        },
      ];

      console.log("stm", stm);
      console.log("ltm", ltm[0]);

      const response = await genrateResponse([...ltm, ...stm]);
         
        socket.emit("ai-response", {
        content: response,
        chat: messagePayload.chat,
      });

       
      const aiMessageData = await messageModel.create({
        chat: messagePayload.chat,
        user: socket.user._id,
        content: response,
        role: "model",
      });

      if (shouldStoreResponse(response)) {
        const vectorResponse = await genrateVectors(response);
        await createMemory({
          vectors: vectorResponse,
          messageId: aiMessageData._id,
          metadata: {
            chat: aiMessageData.chat.toString(),
            user: socket.user._id.toString(),
            content: response,
          },
        });
      }
      
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
}

module.exports = initSocketServer;
