'use strict';
//++ Oldal betöltésének megfigyelése ++//
window.addEventListener('load', WindowLoadHandler, false);

//++ Létrehozzuk a változókat, amit minden függvényből el kell érjünk ++//
var productNameTXT = "";
var productColorTXT = "";
var productHPTXT = "";
var productPriceTXT = "";
var productPicTXT = "";
var uploadButton = "";

var stockTableParent = "";
var cartTableParent = "";

var stockTable = "";

//++ Ezekben a tömbökben tároljuk az autókat. Egyelőre üresek ++//
var carsOnStock = [];
var carsInCart = [];



var carID = 0;
var alreadyUploaded=false;


//++ Amikor betöltődött az oldal, ez a függvény le fog futni ++//
function WindowLoadHandler(){

    //++ Változóba mentjük az import mezőket ++//
    productNameTXT = document.querySelector("#productName");
    productColorTXT = document.querySelector("#productColor");
    productHPTXT = document.querySelector("#productHP");
    productPriceTXT = document.querySelector("#productPrice");
    productPicTXT = document.querySelector("#productPic");
    uploadButton = document.querySelector("#btnUpload");


    stockTableParent = document.querySelector("#stockDiv");
    cartTableParent = document.querySelector("#cartDiv");
    
    //++ Megfigyeljük a mezők alatt lévő gombot ++//
    uploadButton.addEventListener('click',Add_Button_Click_Handler, false);

    //++ Megfigyeljük a raktáron lévő autók tömbjének változását ++//
    //carsOnStock.addEventListener('change',Draw_Stock_Table,false);
}

//++ A gomb megnyomásakor ezt a függvényt futtatjuk le ++//
function Add_Button_Click_Handler(){    

    //++ Adatok beolvasása a mezőkből ++//
    var currentName = productNameTXT.value;
    var currentColor = productColorTXT.value;
    var currentHP = parseInt(productHPTXT.value);
    var currentPrice = parseInt(productPriceTXT.value);
    var currentPic = productPicTXT.value;

    stockTable = document.querySelector("#stockTableElement");


    //++ Mezők validálása ++//    
    if(currentName=="" || currentColor=="" || currentHP=="" || currentPrice=="" || currentPic=="" || isNaN(parseInt(currentHP)) || isNaN(parseInt(currentPrice))) {
        alert("Tölts ki helyesen minden mezőt!");
    } else {
    
        //++ Ha minden ki van töltve, készítünk egy új autót a tömbünkbe++//
        carID++;
        var currentCar = new Car(carID,currentName,currentColor,currentHP,currentPrice,currentPic);    
        carsOnStock.push(currentCar);

        //++ Gomb megnyomására a középső div gyerekét törli majd újat csinál neki ++//
        var StockDivChildList = document.getElementById("stockDiv");  
        StockDivChildList.removeChild(StockDivChildList.childNodes[0]);           
        Draw_Stock_Table();

        productNameTXT.value = "";
        productColorTXT.value = "";
        productHPTXT.value = "";
        productPriceTXT.value = "";
        productPicTXT.value = "";
    }

    
}

function Draw_Stock_Table(){
    var inputArray= carsOnStock;
    var table = document.createElement("table");

    if (inputArray.length != 0){

       
        var row = document.createElement("tr");
        for (var k in inputArray[0]){
            var col = document.createElement("th");
            col.innerText = k;
            row.appendChild(col);
        }
        //++ Select oszlop létrehozása utolsóként ++//
        var col = document.createElement("th");
        col.innerText = "Select";
        row.appendChild(col);
        table.appendChild(row);

        
        for (var i=0 ; i<inputArray.length ; i++){
            var row = document.createElement("tr");
            for(var k in inputArray[i])
            {
                var col = document.createElement("td");
                col.innerText = inputArray[i][k];      
                if (typeof inputArray[i][k] == "number"){
                    col.setAttribute("align","right");
                }
                row.appendChild(col);
            }
            //++ Soronként utolsó cellaként egy törlés gomb ++//            
                var col = document.createElement("td");
                col.innerHTML = "<input type=\"checkbox\" class=\"stockCheckbox\">";
            
                row.appendChild(col);       
            
            table.appendChild(row);
        }

        var row = document.createElement("tr");
        var col = document.createElement("td");
        col.setAttribute("colspan","6");
        row.appendChild(col);
        var col = document.createElement("td");
        col.innerHTML="<button onclick=\"buyButtonClickHandler()\">Buy</button>";
        row.appendChild(col);
        table.appendChild(row);


        table.setAttribute("border","1");
        table.setAttribute("id","stockTableElement");
    }

    stockTableParent.appendChild(table);
    

    
}

function Draw_Cart_Table(){
    var inputArray= carsInCart;
    var table = document.createElement("table");
    var fullPrice = 0;

    if (inputArray.length != 0){

        //++ Kosárban lévő termékek összértékének kiszámítása ++//
        for (var i=0 ; i<inputArray.length ; i++){
            fullPrice += inputArray[i].Price;
        }
        
        var row = document.createElement("tr");
        for (var k in inputArray[0]){
            var col = document.createElement("th");
                if (k=="ID"){
                    col.innerText="Order ID";
                }else {
                col.innerText = k;
                }
            row.appendChild(col);
        }
        //++ Select oszlop létrehozása utolsóként ++//
        var col = document.createElement("th");
        col.innerText = "Select";
        row.appendChild(col);
        table.appendChild(row);

        
        for (var i=0 ; i<inputArray.length ; i++){
            var row = document.createElement("tr");
            for(var k in inputArray[i])
            {
                var col = document.createElement("td");
            if ( k =="ID"){
                col.innerText = i+1;
            } else {
                col.innerText = inputArray[i][k];   
            }
                if (typeof inputArray[i][k] == "number"){
                    col.setAttribute("align","right");
                }
                row.appendChild(col);
            }

            //++ Soronként utolsó cellaként egy checkbox ++//       
        
                var col = document.createElement("td");
                col.innerHTML = "<input type=\"checkbox\" class=\"cartCheckbox\">";     

                row.appendChild(col);             
            
            table.appendChild(row);
        }


        //++ Lábléc létrehozása vásárlás és törlés gombbal++//
        var row = document.createElement("tr");
        var col = document.createElement("td");
        col.setAttribute("colspan","6");
        col.innerHTML="<button onclick=\"sendOrderButtonClickHandler()\">Checkout: " + fullPrice + "Ft </button>";
        col.setAttribute("align","right");
        col.firstChild.setAttribute("style","background-color: #42f44b; color: white");
        row.appendChild(col);
        var col = document.createElement("td");
        col.innerHTML="<button onclick=\"cartDelButtonClickHandler()\">Del</button>";
        row.appendChild(col);
        table.appendChild(row);


        table.setAttribute("border","1");
        table.setAttribute("id","stockTableElement");
    }

    cartTableParent.appendChild(table);

    
        
}


function delButtonClickHandler(){
    //++ Kijelölt elemek kigyűjtése tömbbe ++//
    var checkedCheckboxes = document.querySelectorAll(".stockCheckbox:checked");
    var idsToDelete = [];
    for (var i=0; i<checkedCheckboxes.length; i++){        
        idsToDelete.push(parseInt(checkedCheckboxes[i].parentNode.parentNode.firstChild.innerText));
    }
    console.log(idsToDelete);
    deleteElements(carsOnStock,idsToDelete);
}

function deleteElements(elementArray,idsToDeleteArray){
    
    for (var delIdIndex=0; delIdIndex<idsToDeleteArray.length; delIdIndex++){
       for  (var elementsIndex=0; elementsIndex<elementArray.length; elementsIndex++){
           if(idsToDeleteArray[delIdIndex]==elementArray[elementsIndex].ID){
            elementArray.splice(elementsIndex, 1);
           }
       }
    }
    
    var StockDivChildList = document.getElementById("stockDiv");  
        StockDivChildList.removeChild(StockDivChildList.childNodes[0]);           
        Draw_Stock_Table();
}

function buyButtonClickHandler(){
   
    //++ Kijelölt elemek kigyűjtése tömbbe ++//
    var checkedCheckboxes = document.querySelectorAll(".stockCheckbox:checked");
    var idsToBuy = [];
    for (var i=0; i<checkedCheckboxes.length; i++){        
        checkedCheckboxes[i].checked = false;
        idsToBuy.push(parseInt(checkedCheckboxes[i].parentNode.parentNode.firstChild.innerText));
    }
    
    buyElements(carsOnStock,idsToBuy);
}

function buyElements(elementArray,idsToBuyArray){

    for (var buyIdIndex=0; buyIdIndex<idsToBuyArray.length; buyIdIndex++){
        for  (var elementsIndex=0; elementsIndex<elementArray.length; elementsIndex++){
            if(idsToBuyArray[buyIdIndex]==elementArray[elementsIndex].ID){
             carsInCart.push(elementArray[elementsIndex]);
             
            }
        }
     }
/*
     for (var i=0 ; i<carsInCart.length ; i++){
         carsInCart[i].ID = i+1;
     }
*/     
     var cartDivChildList = document.getElementById("cartDiv");  
         cartDivChildList.removeChild(cartDivChildList.childNodes[0]);           
         Draw_Cart_Table();
}

function cartDelButtonClickHandler(){
     //++ Kijelölt elemek kigyűjtése tömbbe ++//
     var checkedCheckboxes = document.querySelectorAll(".cartCheckbox:checked");
     var indexesToDelete = [];
     for (var i=0; i<checkedCheckboxes.length; i++){        
         indexesToDelete.push(parseInt(checkedCheckboxes[i].parentNode.parentNode.firstChild.innerText));
     }
     console.log(indexesToDelete);
     deleteCartElements(carsInCart,indexesToDelete);
}

function deleteCartElements(elementArray,indexesToDeleteArray){
    
    var tempArray=[];

    
    var notToCopy = 0;

        for (var i=0; i<elementArray.length; i++){
            if (i == (indexesToDeleteArray[notToCopy]-1)){
                notToCopy++;
            } else {
            tempArray.push(elementArray[i]);
            }
        }

    console.log(tempArray);

    carsInCart=tempArray;


   
    var cartDivChildList = document.getElementById("cartDiv");  
        cartDivChildList.removeChild(cartDivChildList.childNodes[0]);           
        Draw_Cart_Table();
}

function uploadStockDB() {
  if (alreadyUploaded){
      alert("Már feltöltötted az adatbázist.");
  }  else {
        alreadyUploaded=true;
        var savedStockDatabase = 
        [
            {
                "ID" : "",
                "Name" : "Seat Cordoba",
                "Color" : "sárga",
                "HorsePower" : 110,
                "Price" : 500000,
                "Picture" : "seat.jpg",
            },

            {
            "ID" : "",
            "Name" : "Opel Omega",
            "Color" : "szürke",
            "HorsePower" : 150,
            "Price" : 300000,
            "Picture" : "opel.jpg",
            },      
            
            {
                "ID" : "",
                "Name" : "Suzuki Vitara",
                "Color" : "piros",
                "HorsePower" : 90,
                "Price" : 3000000,
                "Picture" : "vitara.jpg",
            },

            {
            "ID" : "",
            "Name" : "Toyota Supra",
            "Color" : "piros",
            "HorsePower" : 190,
            "Price" : 500000,
            "Picture" : "supra.jpg",
            },      
            
            {
                "ID" : "",
                "Name" : "Volvo V40",
                "Color" : "fekete",
                "HorsePower" : 220,
                "Price" : 1200000,
                "Picture" : "v40.jpg",
            },

            {
            "ID" : "",
            "Name" : "Audi S8",
            "Color" : "fekete",
            "HorsePower" : 550,
            "Price" : 50000000,
            "Picture" : "s8.jpg",
            },      
            
            {
                "ID" : "",
                "Name" : "Mercedes SLS AMG",
                "Color" : "ezüst",
                "HorsePower" : 700,
                "Price" : 60000000,
                "Picture" : "slsamg.jpg",
            },

            {
            "ID" : "",
            "Name" : "Trabant 601",
            "Color" : "fehér",
            "HorsePower" : 28,
            "Price" : 15000,
            "Picture" : "trabi.jpg",
            },

        ];

        for (var i=0; i<savedStockDatabase.length; i++){
            carID++;
            var currentCar = new Car(carID,savedStockDatabase[i].Name,savedStockDatabase[i].Color,savedStockDatabase[i].HorsePower,savedStockDatabase[i].Price,savedStockDatabase[i].Picture);    
            carsOnStock.push(currentCar);
        }
        

        //++ Gomb megnyomására a középső div gyerekét törli majd újat csinál neki ++//
        var StockDivChildList = document.getElementById("stockDiv");  
        StockDivChildList.removeChild(StockDivChildList.childNodes[0]);           
        Draw_Stock_Table();
    }
  

}

function sendOrderButtonClickHandler(){
    var orderJson = JSON.stringify(carsInCart);
    var paragraphJson = document.createElement("p");
    paragraphJson.innerText = orderJson;
    document.body.appendChild(paragraphJson);
}