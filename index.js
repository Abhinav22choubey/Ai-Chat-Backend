const express = require("express");
const main = require("./aiChatting");
const cors=require("cors")
const app = express();
app.use(express.json());
app.use(cors());
app.listen(3000, () => {
  console.log("Listening at Port 3000");
});
// app.use('/',(req,res,next)=>{
//   res.send("Chatbot is alive")
// })
let Allchat = {};

app.post("/chat", async (req, res) => {
  const { _id } = req.body;
  const { msg } = req.body;
  if (!Allchat[_id]) {
    Allchat[_id] = [];
  }
  const history = Allchat[_id];

  const ques = [
    ...history,
    {
      role: "user",
      parts: [{ text: msg+"try to give me response in less than 6 lines but for detail problem give me proper resposnse and don't mention ever about less lines or conscise in response don't mention try too" }],
    },
  ];

  try{
    const answer = await main(ques);
    Allchat[_id] = [
      ...history,
      {
        role: "user",
        parts: [{ text: msg }],
      },
      {
        role: "model",
        parts: [{ text: answer }],
      },
    ];

    res.send(answer);
  }catch(err){
  const message = err?.message || JSON.stringify(err);
  res.send(message);
  }
});
