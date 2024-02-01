const express = require('express')
const app = express();
const mongoose = require('mongoose')
const mongodb=require('mongodb')
const cookieparser = require('cookie-parser')
app.use(express.static('public'));
const jwt = require('jsonwebtoken')
app.use(cookieparser())
const mongouri = "mongodb+srv://adilahmadshah7860:alima7860@cluster0.k7tugya.mongodb.net/?retryWrites=true&w=majority"
mongoose.connect(mongouri, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log("Db connected"))
  .catch((e) => console.log(e))

const messageSchema = new mongoose.Schema({
  name: String,
  email: String
})
const user = []
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
})
const User = mongoose.model("user", userSchema)


const Messge = mongoose.model("Message", messageSchema)
app.set('view engine', '.ejs');


const isAuthenticated = (async (req, res, next) => {
  const { token } = req.cookies;
  if (token) {
    const decoded = jwt.verify(token, "sdfdshasddj")
    req.user = await User.findById(decoded._id)
    next();
  }
  else {
    res.redirect('/login')
  }

})

app.get('/login',(req,res)=>{
  res.render('login')
})

app.use(express.urlencoded({ extended: true }))


app.get('/', (req, res) => {
 res.render('index1')
})
app.get('/add', async (req, res) => {
  await Messge.create({ name: "adil", email: "adil@123" }).then(() => {
    res.send("NICE")
  })
})

app.get('/login', (req, res) => {
  res.render('login')
})

app.get('/logout', async (req, res) => {
  res.cookie("token", null, {
    httpOnly: true,
    expires: new Date(Date.now())

  })
  res.redirect("/")
})

app.get('/register', (req, res) => {
  res.render("register")
})
app.post('/register', async (req, res) => {

  const { name, email, password } = req.body;

  let user = await User.findOne({email:email})
  if (user) {
    res.redirect("/")
  }
 
  user = await User.create(({
    name,
    email,
    password,
  }))
  const token = jwt.sign({ _id: user._id }, "sdfdshasddj")

  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + 60 * 1000)
  })
  user.save();
  res.redirect("/login")
})
app.post('/', (req, res) => {
  // console.log(req.body.name);
  user.push({ username: req.body.name, email: req.body.email })

  res.redirect("/")
})

app.post('/login', async (req, res) => {
  const { email, password } = req.body
  let user = await User.findOne({email:email})
 
  if (!user) {
    res.redirect('/register')
  }
  const isMatch = user?.password === password
  if (!isMatch){
    
    return res.render("/login", { message: "incorrrect password" })

      }    const token = jwt.sign({ _id: user._id }, "sdfdshasddj")
  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + 60 * 1000)
  })  
  
  res.redirect("/index1")


})

app.get('/index1', (req, res) => {
  res.render('index1')
})
app.get('/delete', (req,res)=>{
      res.render('delete');
})

app.post('/delete',async (req,res)=>{
  const {email}=req.body
  
  try{
      const userdata= await User.findOne({email: email});  
      console.log(userdata)
      if(!userdata){
          return res.status(404).json({message:"user not found"});
      }

      await User.deleteOne({email})
      res.status(200).json({ message: "User deleted successfully" });
  }
 
  catch(error){

    console.error("Error deleting user:");
    res.status(500).json({ message: "Internal server error" });
  }

})
app.get('/update',(req,res)=>{
  res.render('update')
})

app.post('/update',async (req,res)=>{
  const {name,email,password}=req.body
console.log(req.body)
  const user=await User.findOne({email:email})
  console.log(user)
  if(user){
    await User.updateOne({email:email},{name:name,password:password})
    

  }
  else{
    res.send(404).json({message:"not found"})
  }
  res.render('index1')

})
app.listen(3000, () => {
  console.log("server started")
})  