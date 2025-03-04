const express = require('express');
const router = express();
const User = require('../model/user_model')

//midlleware
const requireAuth = (req, res, next) => {
  console.log("Session data:", req.session); // Debugging session
  if (!req.session.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  next();
};

//get all users
router.get('/users',requireAuth,async(req,res)=>{
    const userdata =await User.find();
    res.send(userdata);
})

//login for users
router.post('/userbyemail',async(req,res)=>{
    const {email,password} = req.body;
    const userdata = await User.findOne({email:email});

    if (userdata && password==userdata?.password) {
        req.session.user = { id: userdata.id, email: userdata.email };
    
        res.cookie("user", JSON.stringify({_id: userdata.id,email: userdata.email }), {
          httpOnly: false, // Allow frontend access (set `true` if only for backend)
          secure: false, // Set to `true` in production (HTTPS)
          maxAge: 24 * 60 * 60 * 1000, // 1 day
        });
        console.log(req.session.user);
        res.json({ message: "Login successful", userdata });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
})

//get user by id
router.get('/userbyid/:id',async(req,res)=>{
  console.log("get user by id called........")
    if (req.session.user) {
        const {id} = req.params;
        const userdata =await User.find({_id:id});
        console.log(userdata[0])
        res.send(userdata[0]);
      } else {
        res.status(401).json({ message: "Not authenticated" });
      }
    
})

//registration
router.post('/newuser',async(req,res)=>{
    const data = req.body;
    const user_data = new User(data);
    await user_data.save();
    res.send(user_data);
})

//update user
router.put('/updateuser/:id',async(req,res)=>{
    console.log("update user called........")
    const {id} = req.params;
    const user_data = await User.findOneAndUpdate({_id : id},{$set : req.body},{new : true});
    console.log(user_data);
    res.send(user_data);
})

//delete user
router.delete('/delete/:id',async(req,res)=>{
    const {id} = req.params;
    const user_data = await User.deleteOne({_id : id});
    res.send(user_data);
})

router.post("/logout", (req, res) => {
  req.session.user = ""
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    res.clearCookie("user", {
      httpOnly: false, // Set to true if only backend should access the cookie
      secure: false, // Set to true if using HTTPS
      sameSite: "Lax",
    });
    return res.json({ message: "Logout successful" });
  });
});

module.exports = router