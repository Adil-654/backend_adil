const express = require('express')
const app = express();
const mongoose = require('mongoose')
const cookieparser = require('cookie-parser')

const jwt = require('jsonwebtoken')
app.use(cookieparser())
const mongouri = "mongodb+srv://adilahmadshah7860:alima7860@cluster0.tlwyhtl.mongodb.net/?retryWrites=true&w=majority"
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
app.set("view engine", "ejs")


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

app.use(express.urlencoded({ extended: true }))


app.get('/', (req, res) => {
  console.log(req.user)
  res.render("logout", { name: req.user.name })
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

  let user = await User.findOne({ email })
  if (user) {
    res.redirect("login")
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
  res.redirect("/")
})
app.post('/', (req, res) => {
  // console.log(req.body.name);
  user.push({ username: req.body.name, email: req.body.email })

  res.redirect("/")
})

app.post('/login', async (req, res) => {
  const { name, password } = req.body
  let user = await User.findOne({ name })
  if (!user) {
    res.redirect('/register')
  }
  const isMatch = user?.password === password
  if (!isMatch)
    return res.render("/login", { message: "incorrrect password" })



  const token = jwt.sign({ _id: user._id }, "sdfdshasddj")
  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + 60 * 1000)
  })
  console.log("  ")
  res.redirect("/index")


})

app.get('/index', (req, res) => {
  res.redirect('/index1')
})
app.listen(3000, () => {
  console.log("server started")
})  