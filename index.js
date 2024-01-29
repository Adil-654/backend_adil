const express=require('express')
const app=express();
const mongoose=require('mongoose')

const mongouri="mongodb+srv://adilahmadshah7860:adil7860@cluster0.0db5top.mongodb.net/Harsh?retryWrites=true&w=majority"
mongoose.connect(mongouri,{ useNewUrlParser: true, useUnifiedTopology: true }).then(()=>console.log("Db connected"))
.catch((e)=>console.log(e))

app.set("view engine","ejs")
const user=[]

app.use(express.urlencoded({extended:true}))
app.get('/',(req,res)=>{
  res.render('index')
})

app.get('/success',(req,res)=>{
    
  })
app.get('/success',(req,res)=>{
    res.render("sucess")
  })

app.post('/',(req,res)=>{
    // console.log(req.body.name);
    user.push({username:req.body.name,email:req.body.email})
    res.redirect("/success")
})

app.post('/contact',(req,res)=>{
    // console.log(req.body.name);
    user.push({username:req.body.name,email:req.body.email})
    res.redirect("/success")
})
app.get('/users',(req,res)=>{
    res.json({
        user
    })
})
app.listen(3000,()=>{
    console.log("server started")
})