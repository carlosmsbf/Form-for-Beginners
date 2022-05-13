

    function results() {
        var nameValue = document.getElementById("name").value; 
        var emailValue = document.getElementById("email").value;
        var phoneValue = document.getElementById("phone").value;
        var addressValue = document.getElementById("address").value;
        var cityValue = document.getElementById("city").value;
        var postCodeValue = document.getElementById("zip").value;
        var stateValue = document.getElementById("state").value;
        var firstProductString = document.getElementById("productFirst").value;
        var secondProductString = document.getElementById("productSecond").value;
        var thirdProductString = document.getElementById("productThird").value;
        var deliberyTimeValue = parseInt(document.getElementById("deliveryTime").value);
        var totalPrice = 0;


        if (firstProductString == ""){
            var firstProductValue = 0;
         }
         else{
            var firstProductValue = parseInt(firstProductString);
         }

         if (secondProductString == ""){
            var secondProductValue = 0;
         }
         else{
            var secondProductValue = parseInt(secondProductString);
         }

         if (thirdProductString == ""){
            var thirdProductValue = 0;
         }
         else{
            var thirdProductValue = parseInt(thirdProductString);
         }

            var firstProductValueInt = firstProductValue * 10;
            var secondProductValueInt = secondProductValue * 20;
            var thirdProductValueInt = thirdProductValue * 30;

         


            if(deliberyTimeValue == 4){

            deliberyTimeValueInt = 10;
            }

            else if (deliberyTimeValue == 3){
            deliberyTimeValueInt = 20;
            }

            else if (deliberyTimeValue == 2){

            deliberyTimeValueInt = 30;
            }

            else{
            deliberyTimeValueInt = 40;
            }

            totalPrice = deliberyTimeValueInt + firstProductValueInt + secondProductValueInt + thirdProductValueInt;





        var layoutInvoice =`
        <!DOCTYPE html>
        <html>
        <head>
        <title>Validation Example</title>
        <link rel="stylesheet" href="css/layout.css">  
        </head> 
        <body>
        <h1>Invoice</h1>
        <p>Name: ${nameValue}</p>
        <p>Email: ${emailValue}</p>
        <p>Phone: ${phoneValue}</p>
        <p>Address: ${addressValue}</p>
        <p>City: ${cityValue}</p>
        <p>Post code: ${postCodeValue}</p>
        <p>State: ${stateValue}</p>
        <p>-----------------------------------------</p>
        <p>Product 1: $ ${firstProductValueInt}</p>
        <p>Product 2: $ ${secondProductValueInt}</p>
        <p>Product 3: $ ${thirdProductValueInt}</p>
        <p>Delivery Price: $ ${deliberyTimeValueInt}</p>


        <p>-----------------------------------------</p>
        <p>Total Price: $ ${totalPrice}</p>
        </form> 
        </body>
        </html>               
        `;

   
        document.write(layoutInvoice);


    }


