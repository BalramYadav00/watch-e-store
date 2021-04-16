const path = require("path");
const fs = require("fs");
var app = require('express')();
const multer = require("multer");
var bodyParser = require('body-parser');
app.use(bodyParser({uploadDir:'../public'}));
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/img')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname.split('.')[0] + '-' + Date.now() + '.' +file.originalname.split('.')[1])
  }
})
 
var upload = multer({ storage: storage })

// const upload = multer({
//     dest: ""
//     // you might also want to set some limits: https://github.com/expressjs/multer#limits
//   });

  // var storage = multer.diskStorage({
  //     destination: function (req, file, cb) {

  //       cb(null, '/tmp/my-uploads')
    
  //     },
    
  //     filename: function (req, file, cb) {
    
  //       cb(null, file.fieldname + '-' + Date.now())
    
  //     }
    
  //   })
    
     
    
    // var upload = multer({ storage: 
    
    
// Routes

const homeController = require('../app/http/controllers/homeController');
const authController = require('../app/http/controllers/authController');
const cartController = require('../app/http/controllers/customer/cartController');
const orderController = require('../app/http/controllers/customer/orderController');
const adminOrderController = require('../app/http/controllers/admin/orderController');
const statusController = require('../app/http/controllers/admin/statusController');

// Middlewares
const guest = require('../app/http/middlewares/guest');
const auth = require('../app/http/middlewares/auth');
const admin = require('../app/http/middlewares/admin');
const adminNa = require('../app/http/middlewares/adminna');
const changePass = require('../app/http/middlewares/changePass');

// Models
const Menu =  require('../app/models/menu')
const  Order = require('../app/models/order')
function initRoutes(app) {
    
    app.get('/', adminNa, homeController().index)
    app.get('/login', guest, authController().login)
    app.post('/login', authController().postLogin)
    app.get('/register', guest, authController().register)
    app.post('/register', authController().postRegister)
    app.get('/changepassword', changePass, authController().changePassword)
    app.post('/changepassword', changePass, authController().postChangePassword)
    app.post('/logout', authController().logout)
    
    app.get('/cart', adminNa, cartController().index)
    app.post('/update-cart', adminNa, cartController().update)

    // Customer Routes
    app.post('/orders', auth, orderController().store)
    app.get('/customer/orders', auth, orderController().index)
    app.get('/customer/orders/:id', auth, orderController().show)

    // Admin routes
    app.get('/admin/add/product', admin , (req,res)=>{
     res.render("admin/addproduct");
    })

    // app.post('/admin/add/product', admin , (req,res)=>{

// multer

// const handleError = (err, res) => {
//   res
//     .status(500)
//     .contentType("text/plain")
//     .end("Oops! Something went wrong!");
// };




app.post('/admin/add/product',upload.single("file" /* name attribute of <file> element in your form */),
  (req, res) => {
console.log(req.file);
    const handleError = (err, res) => {
        // res
        //   .status(500)
        //   .contentType("text/plain")
        //   .end("Oops! Something went wrong!");
      };

    const tempPath = req.file.path;
    const targetPath = path.join(__dirname, "./uploads/image.png");
console.log(tempPath,targetPath);
    if (path.extname(req.file.originalname).toLowerCase() === '.jpg' || '.png') {
      fs.rename(tempPath, targetPath, err => {
        if (err) return handleError(err, res);

        // res
        //   .status(200)
        //   .contentType("text/plain")
        //   .end("File uploaded!");
      });
    } else {
      fs.unlink(tempPath, err => {
        if (err) return handleError(err, res);

        // res
        //   .status(403)
        //   .contentType("text/plain")
        //   .end("Only .png files are allowed!");
      });
    }

    const {productname,productimage,productprice,productsize,productaval} = req.body;
    const productavaibility = productaval?true:false;
    
    console.log(productavaibility);
    
    
    
    
            // console.log(productaval)
            
           Menu.insertMany({name:productname,image:req.file.filename,price:productprice,size:productsize,available:productavaibility},(err,done)=>{
            if(err) console.log(err);
            else{
              res.redirect('/admin/add/product');
              }
               })
                })
    
    
    





// end multer


    app.get('/admin/cancel/product',(req,res)=>{
               Order.find({},(err,data)=>{
                   if(err) console.log(err);
                   else{
                res.render('cancel',{data:data});
                           
                   }
               })
            })

    app.post('/admin/cancel/:id',(req,res)=>{
        const {id} = req.params;
        Order.findOneAndDelete({_id:id},(err,done)=>{
            if(err){
                console.log(err);
            }
            if(done){
                res.redirect('/admin/cancel/product')
            }
        })
    })






    app.get('/admin/orders', admin, adminOrderController().index)
    app.post('/admin/orders/status', admin, statusController().update)
}

module.exports = initRoutes;