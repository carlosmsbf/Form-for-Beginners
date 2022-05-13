var express = require('express');
var path = require ('path');
var mongoose = require('mongoose');

//conect to Mongoose and storing the data in 4_Inclass File.
mongoose.connect(
    'mongodb://localhost:27017/4_Inclass',
    {useNewUrlParser:true},
    () => console.log("Connected to database")
);

const Product = mongoose.model('Product', {name: String, email: String, phone: Number, address: String, city: String, state: String, productOneQuantity: Number,productTwoQuantity: Number, subTotal: String, stateBillTax: String, totalOfBill: String});

var bodyParser  = require('body-parser');
const {check, validationResult} = require('express-validator');

var session = require('express-session');
const { urlencoded } = require('express');
const { isNull } = require('util');

var myApp = express();



//parse application/x-www-form-urlencoded
myApp.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
myApp.use(bodyParser.json());

myApp.set('views','views');
myApp.use(express.static(__dirname+'/public'));
myApp.set('view engine', 'ejs'); 



function renderProducts(res) {
    Product.find ({},(err, docs) =>{
        for (doc of docs){
            console.log(doc.name);
            console.log(doc.email);
            console.log(doc.phone);
            console.log(doc.address);
            console.log(doc.city);
            console.log(doc.zip);
            console.log(doc.state);
            console.log(doc.productOneQuantity);
            console.log(doc.productTwoQuantity);
            console.log(doc.subTotal);
            console.log(doc.stateBillTax);
            console.log(doc.totalOfBill);
        }      
        res.render('form',{form: docs});       
    });   
}

myApp.get('/',function(req, res){
    
    res.render('form');
    
});

myApp.get('/', (req,res) => {
    renderProducts(res);
});

myApp.post('/invoice',


//Handle Errors
    [
    check('name', 'The name must have at least 2+ characters').exists().isLength({min: 2}),
    check('address', 'Must have Address').not().isEmpty(),
    check('city', 'Must have City').not().isEmpty(),
    check('state', 'Must have State').not().isEmpty(),
    check('email', 'Must have Email').isEmail(),
    check('phone', 'Must have Phone').matches(/^\d{3}\.\d{3}\.\d{4}|\d{3}\s\d{3}\s\d{4}|\d{3}\-\d{3}\-\d{4}|(\d{5}){2}$/),
    check ('zip', 'Must have PostCode').matches(/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/),
    check ('productFirst').custom((value,{req}) =>{
        
        
        if(req.body.productFirst  == "" && req.body.productSecond == "")
        {
            throw new Error("Must have at least one product for purchased");
        }
      

        if (req.body.productFirst %1 != 0 || req.body.productSecond %1 != 0)
        {
            throw new Error("Must have an integer number");
        }
        

        var productOneQuantity = req.body.productFirst;
        var productTwoQuantity = req.body.productSecond;

        if(productOneQuantity == ""){
            productOneQuantity = 0;
        }
        else{
            productOneQuantity = parseFloat(req.body.productFirst);
        }

        if(productTwoQuantity == ""){
            productTwoQuantity = 0;
        }

        else{
            productTwoQuantity = parseFloat(req.body.productSecond);
        }




       // parseFloat(req.body.productSecond);



        var productOnePrice = 5;
        var productTwoPrice = 5;

            //Calculation
            var productOneTotal = productOneQuantity * productOnePrice;
            var productTwoTotal = productTwoQuantity * productTwoPrice;
    
        
        
        
            //sum of products
    
             var productsTotal = productOneTotal + productTwoTotal;   

            if (productsTotal < 9.9){
                throw new Error ("Your have to purchased at least 2 to make $10")
             }
             return true;
        }
    )

    ],   (req,res) =>  {

        

        //Print Errors in the Webpage
        const errors = validationResult(req)
        if(!errors.isEmpty()) {
            const alert = errors.array() 
            res.render('form', {alert
            })
        }
    
        //Data User Inputs
        var name = req.body.name;
        var email = req.body.email;
        var phone = req.body.phone;
        var address = req.body.address;
        var city = req.body.city;
        var zip = req.body.zip;
        var state = req.body.state;
        
        //In case the user does not set the quantity of the product, 
        //it will automatically set 0
        
        if(req.body.productFirst == ""){
            var productOneQuantity = 0;
        }
        else{
            var productOneQuantity = parseFloat(req.body.productFirst);
        }

        if(req.body.productSecond == ""){
            var productTwoQuantity = 0;
        }
        else{
            var productTwoQuantity = parseFloat(req.body.productSecond);
        }
        

        //Price of Products
        var productOnePrice = 5;
        var productTwoPrice = 5;

        //Calculation (price * quantity)
        var productOneTotal = productOneQuantity * productOnePrice;
        var productTwoTotal = productTwoQuantity * productTwoPrice;

        //Sum of products ( SubTotal)

         var productsTotal = productOneTotal + productTwoTotal;    
         var subTotal = productsTotal.toLocaleString('en-CA', { style: 'currency', currency: 'CAD' });


         //Calculating Provincial Tax
          var stateTax;
          var totalOfBill;
          var stateBillTax;

         if(state == "Ontario"){

         stateTax = 1.13;
            totalOfBill = productsTotal * stateTax;
           stateBillTax = "13%";   
        
        }

        else if(state == "Manitoba" || state == "British Colombia"){

          stateTax = 1.12;
         totalOfBill = productsTotal * stateTax;  
         stateBillTax = "12%";     

         }
         else if(state == "Saskatchewan"){

          stateTax = 1.11;
          totalOfBill = productsTotal * stateTax; 
           stateBillTax = "11%";      

          }
         else if(state == "Quebec"){

          stateTax = 1.14975;
         totalOfBill = productsTotal * stateTax; 
         stateBillTax = "14.975%";      

          }
         else if(state == "Nova Scotia" || state =="Newfoundland" || state =="Princess Edward Island" 
         || state =="Labrador" || state =="New Brunswick"){

           stateTax = 1.15;
          totalOfBill = productsTotal * stateTax; 
          stateBillTax = "15%";      

          }
    
         else if (state == "Nunavut" || state == "Yukon" || state == "Northwest Territories" || state == "Alberta"){

            stateTax = 1.05;
         totalOfBill = productsTotal * stateTax;
         stateBillTax = "5%";       

         }


         totalOfBill = totalOfBill.toLocaleString('en-CA', { style: 'currency', currency: 'CAD' });

         
        //Calculation
        //Open FIle and Rewrite
        res.render('invoice',
        {
            name:name, 
            email:email,
            phone:phone,
            address:address,
            city:city,
            zip:zip,
            state:state,
            productOneQuantity:productOneQuantity,
            productTwoQuantity:productTwoQuantity,
            subTotal:subTotal,
            stateBillTax:stateBillTax,
            totalOfBill:totalOfBill

        });


         var newProduct= new Product( {
            name: name,
            email: email,
            phone: phone,
            address: address,
            city: city,
            zip: zip,
            state: state,
            productOneQuantity:productOneQuantity,
            productTwoQuantity:productTwoQuantity,
            subTotal:subTotal,
            stateBillTax: stateBillTax,
            totalOfBill: totalOfBill,
        });

        newProduct.save().then( () => 
        console.log('New form saved') );
        
        renderProducts(res);
    });


    
myApp.listen(8080);
console.log('Server started at 8080 for mywebsite...');