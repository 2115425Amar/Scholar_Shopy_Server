import productModel from "../models/productModel.js";
import categoryModel from "../models/categoryModel.js";
import orderModel from "../models/orderModel.js";
import fs from "fs";   //filesystem
import slugify from "slugify";

// import braintree from "braintree";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // Use your secret key

// //payment gateway
// var gateway = new braintree.BraintreeGateway({
//   environment: braintree.Environment.Sandbox,
//   merchantId: process.env.BRAINTREE_MERCHANT_ID,
//   publicKey: process.env.BRAINTREE_PUBLIC_KEY,
//   privateKey: process.env.BRAINTREE_PRIVATE_KEY,
// });


export const createProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } = req.fields;     //contains non-file fields
    const { photo } = req.files; //contain files

    //validation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required" });
      case !description:
        return res.status(500).send({ error: "Description is Required" });
      case !price:
        return res.status(500).send({ error: "Price is Required" });
      case !category:
        return res.status(500).send({ error: "Category is Required" });
      case !quantity:
        return res.status(500).send({ error: "Quantity is Required" });
      case photo && photo.size > 1000000:  //random
        return res
          .status(500)
          .send({ error: "photo is Required and should be less then 1mb" });
    }

    const products = new productModel({ ...req.fields, slug:slugify(name) });
    
    //photo validation
    // fs.readFileSync(photo.path) reads the image file into a Buffer from the temporary uploaded file path on the server.
    // The photo binary data is stored directly in the products.photo.data field.
    // The MIME type (e.g., "image/jpeg") is stored in products.photo.contentType.

    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }

    await products.save();

    res.status(201).send({
      success: true,
      message: "Product Created Successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in creating product",
    });
  }
};


//get all products
export const getProductController = async (req, res) => {
  try {
    const products = await productModel.find({})
    //filters
      .populate("category") //to show all data without this only id will show
      .select("-photo")
      //initial time photo nhi chaihe 
      //photo ke liye alag se api banayenge
      //for apk perfomance and avoid loading
      .limit(12) //12 product limit  
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      counTotal: products.length,
      message: "All Products ",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Erorr in getting products",
      error: error.message,
    });
  }
};


// get single product
export const getSingleProductController = async (req, res) => {
  try {
    const product = await productModel.findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");
    res.status(200).send({
      success: true,
      message: "Single Product Fetched",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getitng single product",
      error,
    });
  }
};


// get photo
export const productPhotoController = async (req, res) => {
  try {
    // This endpoint reads the stored image binary from MongoDB and sends it with the correct content-type, so the frontend can display it.
    const product = await productModel.findById(req.params.pid).select("photo");   //pid==product id
    if (product.photo.data) {
      res.set("Content-type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting image",
      error,
    });
  }
};


//delete product
export const deleteProductController = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.pid).select("-photo");
    res.status(200).send({
      success: true,
      message: "Product Deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting product",
      error,
    });
  }
};


//update product
export const updateProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } = req.fields;
    const { photo } = req.files;
    //validation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required" });
      case !description:
        return res.status(500).send({ error: "Description is Required" });
      case !price:
        return res.status(500).send({ error: "Price is Required" });
      case !category:
        return res.status(500).send({ error: "Category is Required" });
      case !quantity:
        return res.status(500).send({ error: "Quantity is Required" });
      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: "photo is Required and should be less then 1mb" });
    }

    const products = await productModel.findByIdAndUpdate(req.params.pid,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );

    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }

    await products.save();
    
    res.status(201).send({
      success: true,
      message: "Product Updated Successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Update product",
    });
  }
};

// filters
export const productFiltersController = async (req, res) => {
  try {
    const { checked, radio } = req.body;

    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };  //[0, 500]
    //find
    const products = await productModel.find(args);   

    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error While Filtering Products",
      error,
    });
  }
};

// product count
export const productCountController = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount(); 
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: "Error in product count",
      error,
      success: false,
    });
  }
};

// product list based on page
export const productListController = async (req, res) => {
  try {
    const perPage = 8;
    const page = req.params.page ? req.params.page : 1;    //Receives a page number like 1, 2, etc.
    const products = await productModel.find({})
      .select("-photo")
      .skip((page - 1) * perPage)  // skip already loaded items
      .limit(perPage)              // load only next 8
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error in per page ctrl",
      error,
    });
  }
};


// search product
export const searchProductController = async (req, res) => {
  try {
    const {keyword} = req.params;
    const results = await productModel.find({
      $or :[
        {name:{$regex:keyword, $options:"i"}},  //option:"i" means case sensitive ko delete kr denge
        {description:{$regex:keyword, $options:"i"}}
      ]
    }).select("-photo");
    res.json(results)
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error In Search Product API",
      error,
    });
  }
};





// similar products
export const realtedProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await productModel
      .find({
        category: cid,
        _id: { $ne: pid },  //pid ko dobara include mat kro
      })
      .select("-photo")
      .limit(3)
      .populate("category");
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error while geting related product",
      error,
    });
  }
};




// get product by catgory
export const productCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    const products = await productModel.find({ category }).populate("category");
    res.status(200).send({
      success: true,
      category,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      error,
      message: "Error While Getting products",
    });
  }
};


//payment gateway api
//token
// export const braintreeTokenController = async (req, res) => {
//   try {
//     gateway.clientToken.generate({}, function (err, response) {
//       if (err) {
//         res.status(500).send(err);
//       } else {
//         res.send(response);
//       }
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };

//payment
// export const brainTreePaymentController = async (req, res) => {
//   try {
//     const { nonce, cart } = req.body;
//     let total = 0;
//     cart.map((i) => {
//       total += i.price;
//     });
//     let newTransaction = gateway.transaction.sale(
//       {
//         amount: total,
//         paymentMethodNonce: nonce,
//         options: {
//           submitForSettlement: true,
//         },
//       },
//       function (error, result) {
//         if (result) {
//           const order = new orderModel({
//             products: cart,
//             payment: result,
//             buyer: req.user._id,
//           }).save();
//           res.json({ ok: true });
//         } else {
//           res.status(500).send(error);
//         }
//       }
//     );
//   } catch (error) {
//     console.log(error);
//   }
// };


export const stripePaymentController = async (req, res) => {
  // console.log("stripePaymentController hit");
  try {
    const { cart } = req.body;
    // const { cart, buyerEmail } = req.body;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const line_items = cart.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: { name: item.name },
        unit_amount: item.price * 100,
      },
      quantity: 1,
    }));

    // Backend uses the cart to create a Stripe Checkout session.
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/home`,
      cancel_url: `${process.env.CLIENT_URL}/cart`,
      metadata: {
        // cart: JSON.stringify(cart),
        productIds: cart.map((item) => item._id).join(","), // ✅ limit within 500 characters
        // buyerEmail, // Optional
      },
    });
    // Backend sends the session ID back.
    res.status(200).json({ id: session.id });
  } catch (error) {
    console.error("Stripe Checkout Error:", error.message);
    res.status(500).json({ error: "Stripe session creation failed" });
  }
};



//  Stripe Webhook to Save Order
// https://ecommerce-2-mern.onrender.com/api/v1/product/stripe-webhook

// Stripe Webhook (must use raw body middleware)
export const stripeWebhookController = async (req, res) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
  } catch (err) {
    console.error("⚠️  Webhook signature verification failed.", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // ✅ When payment is successful
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const productIds = session.metadata?.productIds?.split(",") || [];
    const buyerEmail = session.metadata?.buyerEmail || "guest";

    try {
      const products = await productModel.find({
        _id: { $in: productIds },
      });

      const newOrder = new orderModel({
        products: products.map((p) => p._id),
        payment: session,
        buyer: buyerEmail,
      });

      await newOrder.save();
      console.log("✅ Order saved to DB from webhook");
    } catch (err) {
      console.error("❌ Error saving order from webhook:", err);
    }
  }

  res.status(200).json({ received: true });
};