import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";
import { comparePassword, hashPassword } from "./../helpers/authHelper.js"; 
import JWT from "jsonwebtoken";

export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address ,answer} = req.body;
    //validations
    if (!name) {
      return res.send({ message: "Name is Required" });
    }
    if (!email) {
      return res.send({ message: "Email is Required" });
    }
    if (!password) {
      return res.send({ message: "Password is Required" });
    }
    if (!phone) {
      return res.send({ message: "Phone no is Required" });
    }
    if (!address) {
      return res.send({ message: "Address is Required" });
    }
    if (!answer ){
      return res.send({ message: "Answer is Required" });
    }

    //check user
    const exisitingUser = await userModel.findOne({ email });
    // exisiting user
    if (exisitingUser) {
      return res.status(200).send({
        success: false,
        message: "Already Registered please login",
      });
    }

    //register user
    const hashedPassword = await hashPassword(password);
    //save
    const user = await new userModel({name, email, phone,address,password: hashedPassword,answer,}).save();

    res.status(201).send({
      success: true,
      message: "User Registered Successfully",
      user,
    });
  }
   catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Registeration",
      error,
    });
  }
};


//POST LOGIN
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    //validation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }
    
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    const match = await comparePassword(password, user.password);

    if (!match) {
      return res.status(401).send({
        success: false,
        message: "Invalid Password",
      });
    }

    // token
    const token = await JWT.sign(
      { _id: user._id },
      process.env.JWT_SECRET, {
      expiresIn: "365d",
    });
    
    res.status(200).send({
      success: true,
      message: "login successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};


//forgot password
export const forgotPasswordController = async (req,res)=>{
  try{
    const {email,answer,newPassword}=req.body;  

     // Validation
     if (!email || !answer || !newPassword) {
      res.status(400).send({
        message: "Email, answer, and new password are required",
      });
      return;
    }

 //check user
  const user = await userModel.findOne({ email , answer});

  if (!user) {
    return res.status(404).send({
      success: false,
      message: "Wrong Email Or Answer",
    });
  }
 //ResetPassword
 const hashed = await hashPassword(newPassword);
 await userModel.findByIdAndUpdate(user._id,{password:hashed})
 res.status(200).send({
   success:true,
   message:"Password Reset Successfully",
 })

  } 
  catch (error) {
    // console.log(error);
    res.status(500).send({
      success: false,
      message: "something went wrong",
      error,
    });
  }
};


//test controller
export const testController = (req, res) => {
  try {
    res.send("Protected Routes");
  } catch (error) {
    res.send({ error });
  }
};




// -----------------------------------------------------------------------------------------





//update prfile
export const updateProfileController = async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;
    const user = await userModel.findById(req.user._id);
    //password
    if (password && password.length < 6) {
      return res.json({ error: "Passsword is required and atleast 6 character long" });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        address: address || user.address,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Profile Updated Successfully",
      updatedUser,
    });
  } catch (error) {
    // console.log(error);
    res.status(400).send({
      success: false,
      message: "Error While Updating profile",
      error,
    });
  }
};





// ---------------------------------------------------------------------

//get the buyer(user)
export const getOrdersController = async (req, res) => {
  try {
    
    if (!req.user || !req.user._id) {
      return res.status(400).send({ success: false, message: "User not authenticated" });
    }
    // This is a MongoDB query using Mongoose that fetches all orders where the buyer field matches req.user._id
    const orders = await orderModel.find({ buyer: req.user._id })
    .populate("products", "-photo").populate("buyer", "name");
    res.json(orders);
  } 
  catch (error) {
    // console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Getting Orders",
      error,
    });
  }
};

//get all orders
export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel.find({})
    .populate("products", "-photo").populate("buyer", "name")
      .sort({ createdAt: "-1" });
    res.json(orders);
  } 
  catch (error) {
    // console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Getting Orders",
      error,
    });
  }
};


//order status:["Not Process", "Processing", "Shipped", "deliverd", "cancel"]
export const orderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const orders = await orderModel.findByIdAndUpdate(orderId,{ status },{ new: true });
    res.json(orders);
  } 
  catch (error) {
    // console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Updating Order",
      error,
    });
  }
};



//chatbot
// export const chatController=async(req,res)=>{
//   try{
//     const {email,answer,newPassword}=req.body  

//      // Validation
//      if (!email || !answer || !newPassword) {
//       res.status(400).send({
//         message: "Email, answer, and new password are required",
//       });
//       return;
//     }

//   } 
//   catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       message: "something went wrong",
//       error,
//     });
//   }
// };