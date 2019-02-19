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

//++ A táblázatok rendezettségének aktuális állapotát tároló tömb. csokkeno vagy novekvo ++//
//++ A sortByColumn függvény használja. Ha csokkeno, akkor novekvobe rendez és fordítva ++//
var rendezesAllapota=
[
    {
        ID:"",
        Name:"",
        Color:"",
        HorsePower:"",
        Price:"",
    },

    {
        Name:"",
        Color:"",
        HorsePower:"",
        Price:"",
    },
];


//++ A raktáron lévő kocsik ID-ja. Új elem hozzáadásánál növekszik ++//
var carID = 0;

//++ Annak az eldöntésére, hogy használtuk-e már a Raktárkészlet beolvasása featuret ++//
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

    //++Változóba mentjük a 2 táblázat szülő DIV-jét++//
    stockTableParent = document.querySelector("#stockDiv");
    cartTableParent = document.querySelector("#cartDiv");
    
    //++ Megfigyeljük a mezők alatt lévő gombot ++//
    uploadButton.addEventListener('click',Add_Button_Click_Handler, false);

}

//++ A Feltöltés gomb megnyomásakor ezt a függvényt futtatjuk le ++//
function Add_Button_Click_Handler(){    

    //++ Adatok beolvasása a mezőkből ++//
    var currentName = productNameTXT.value;
    var currentColor = productColorTXT.value;
    var currentHP = parseInt(productHPTXT.value);
    var currentPrice = parseInt(productPriceTXT.value);
    var currentPic = productPicTXT.value;   


    //++ Mezők validálása ++//    
    if(currentName=="" || currentColor=="" || currentHP=="" || currentPrice=="" || currentPic=="" || isNaN(parseInt(currentHP)) || isNaN(parseInt(currentPrice))) {
        alert("Tölts ki helyesen minden mezőt!");
    } else {
    
        //++ Ha minden ki van töltve, készítünk egy új autót a tömbünkbe++//
        carID++;
        var currentCar = new Car(carID,currentName,currentColor,currentHP,currentPrice,currentPic);    
        carsOnStock.push(currentCar);

        //++ Gomb megnyomására frissíti a stock táblázatot és a beviteli mezőket törli ++//
        refreshTable("stock");

        productNameTXT.value = "";
        productColorTXT.value = "";
        productHPTXT.value = "";
        productPriceTXT.value = "";
        productPicTXT.value = "";
    }

    
}

//++ Táblázatrajzoló függvény: stock table ++//
function Draw_Stock_Table(){
    //++ A kirajzoláshoz áttöltjük az "adatbázist" egy helyi változóba ++//
    var inputArray= carsOnStock;

    var table = document.createElement("table");
    stockTableParent.appendChild(table);

    //++ Ha a kirajzolandó tömb nem üres, kezdje el a táblázatkészítést ++// 
    if (inputArray.length != 0){       
        var row = document.createElement("tr");

        //++A tömb összes eleme objektum. A 0 indexen lévő kulcsai alapján fejlécet készítünk++//
        for (var k in inputArray[0]){
            var col = document.createElement("th");       
            if(k=="Picture"){
                col.innerText="Picture";
            } else {    
            col.innerHTML = "<a onclick=\"sortByColumn('"+k+"','stock')\">"+k+"</a>";
            }
            row.appendChild(col);
        }
        //++ Select oszlop létrehozása utolsóként ++//
        var col = document.createElement("th");
        col.innerHTML = "<a onclick=\"selectAll('stock')\">Select</a>";
        row.appendChild(col);
        table.appendChild(row);

        
        for (var i=0 ; i<inputArray.length ; i++){
            var row = document.createElement("tr");
            for(var k in inputArray[i])
            {
                var col = document.createElement("td");

                if (k=="Picture"){
                    col.innerHTML ="<a href=\"" + inputArray[i][k] +"\" target=\"_blank\"><button>View</button></a>";   
                } else {
                    col.innerText = inputArray[i][k];      
                }

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

        

        var filterBtn=document.createElement('button');
        filterBtn.setAttribute("onClick",'filter("stock")');
        filterBtn.innerText="Filter";
        filterBtn.setAttribute("style","margin: 10px;");
        document.querySelector("#stockDiv").appendChild(filterBtn);
        
        var searchBtn=document.createElement('button');
        searchBtn.setAttribute("onClick",'search("stock")');
        searchBtn.innerText="Search";
        searchBtn.setAttribute("style","margin: 10px;");
        document.querySelector("#stockDiv").appendChild(searchBtn);
    }

    

    
}

function Draw_Cart_Table(){
    var inputArray= carsInCart;
    var table = document.createElement("table");
    cartTableParent.appendChild(table);
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
                    col.innerText="Order";
                } else if(k=="Picture") {
                    col.innerText="Picture";
                } else {               
                    col.innerHTML = "<a onclick=\"sortByColumn('"+k+"','cart')\">"+k+"</a>";
                }
            row.appendChild(col);
        }
        //++ Select oszlop létrehozása utolsóként ++//
        var col = document.createElement("th");
        col.innerHTML = "<a onclick=\"selectAll('cart')\">Select</a>";
        row.appendChild(col);
        table.appendChild(row);

        
        for (var i=0 ; i<inputArray.length ; i++){
            var row = document.createElement("tr");
            for(var k in inputArray[i])
            {
                var col = document.createElement("td");
            if ( k =="ID"){
                col.innerText = i+1;
            } else if(k=="Picture") {
                col.innerHTML ="<a href=\"" + inputArray[i][k] +"\" target=\"_blank\"><button>View</button></a>";   
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

        var filterBtn=document.createElement('button');
        filterBtn.setAttribute("onClick",'filter("cart")');
        filterBtn.innerText="Filter";
        filterBtn.setAttribute("style","margin: 10px;");
        document.querySelector("#cartDiv").appendChild(filterBtn);
        
        var searchBtn=document.createElement('button');
        searchBtn.setAttribute("onClick",'search("cart")');
        searchBtn.innerText="Search";
        searchBtn.setAttribute("style","margin: 10px;");
        document.querySelector("#cartDiv").appendChild(searchBtn);
    }

    

    
        
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
    
    refreshTable("stock");
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
refreshTable("cart");

         

         
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


   
    refreshTable("cart");
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
                "Picture" : "https://www.automaniac.org/resources/images/variant/551/cordoba_3.jpg",
            },

            {
            "ID" : "",
            "Name" : "Opel Omega",
            "Color" : "szürke",
            "HorsePower" : 150,
            "Price" : 300000,
            "Picture" : "https://www.autonavigator.hu/wp-content/uploads/2016/02/5618_orig.jpg",
            },      
            
            {
                "ID" : "",
                "Name" : "Suzuki Vitara",
                "Color" : "piros",
                "HorsePower" : 90,
                "Price" : 3000000,
                "Picture" : "https://auto.suzuki.hu/vitara/assets/img/pic-exterior1.jpg",
            },

            {
            "ID" : "",
            "Name" : "Toyota Supra",
            "Color" : "piros",
            "HorsePower" : 190,
            "Price" : 500000,
            "Picture" : "http://www.autosspeed.com/wp-content/uploads/2017/09/supra-1.jpg",
            },      
            
            {
                "ID" : "",
                "Name" : "Volvo V40",
                "Color" : "fekete",
                "HorsePower" : 220,
                "Price" : 1200000,
                "Picture" : "https://www.caranddriving.com/images/new/large/VolvoV40D20516.jpg",
            },

            {
            "ID" : "",
            "Name" : "Audi S8",
            "Color" : "fekete",
            "HorsePower" : 550,
            "Price" : 50000000,
            "Picture" : "https://www.autoscout24.hu/assets/auto/images/model/audi/audi-s8/audi-s8-l-01.jpg",
            },      
            
            {
                "ID" : "",
                "Name" : "Mercedes SLS AMG",
                "Color" : "ezüst",
                "HorsePower" : 700,
                "Price" : 60000000,
                "Picture" : "https://img.automobile.de/modellbilder/Mercedes-Benz-SLS-AMG-40541_inden_mer_17_sls_1.jpg",
            },

            {
            "ID" : "",
            "Name" : "Trabant 601",
            "Color" : "fehér",
            "HorsePower" : 28,
            "Price" : 15000,
            "Picture" : "https://www.autonavigator.hu/wp-content/uploads/2011/01/4859_orig.jpg",
            },

        ];

        for (var i=0; i<savedStockDatabase.length; i++){
            carID++;
            var currentCar = new Car(carID,savedStockDatabase[i].Name,savedStockDatabase[i].Color,savedStockDatabase[i].HorsePower,savedStockDatabase[i].Price,savedStockDatabase[i].Picture);    
            carsOnStock.push(currentCar);
        }
        

        //++ Gomb megnyomására a középső div gyerekét törli majd újat csinál neki ++//
        refreshTable("stock");
    }
  

}

function sendOrderButtonClickHandler(){
    var orderJson = JSON.stringify(carsInCart);
    var paragraphJson = document.createElement("p");
    paragraphJson.innerText = orderJson;
    document.body.appendChild(paragraphJson);
}

function sortByColumn(miAlapjan,hol){
  
    var tempArray = [];
    var rendezesAllapotaIndex=0;
    var rendezo=0;

    if (hol=="stock"){
        var tempArray=carsOnStock;
        rendezesAllapotaIndex=0;
    }else{
        var tempArray=carsInCart;
        rendezesAllapotaIndex=1;
    }

    if(rendezesAllapota[rendezesAllapotaIndex][miAlapjan]=="csokkeno"){
        rendezesAllapota[rendezesAllapotaIndex][miAlapjan]="novekvo";
        rendezo=-1;
    } else {
        rendezesAllapota[rendezesAllapotaIndex][miAlapjan]="csokkeno";
        rendezo=1;
    } 


    tempArray.sort(function(first,second){
        if (first[miAlapjan] < second[miAlapjan]){
            return rendezo;
        } else {
            return -rendezo;
        }
    });

    if (hol=="stock"){
        carsOnStock=tempArray;

        refreshTable("stock");
      
    } else {
        carsInCart=tempArray;

        refreshTable("cart");
    }
    
}

function selectAll(hol){
    
    if (hol=="stock"){
        var chckBoxes = document.querySelectorAll(".stockCheckbox");
    }else {
        var chckBoxes = document.querySelectorAll(".cartCheckbox");
    }

    var mindenKiVanJelolve = true;
    for (var i=0; i<chckBoxes.length;i++){
        if (!chckBoxes[i].checked){
            mindenKiVanJelolve=false;
            break;
        }
    }

    if(mindenKiVanJelolve){
        for (var i=0; i<chckBoxes.length;i++){
            chckBoxes[i].checked=false;
        }
    }else {
        for (var i=0; i<chckBoxes.length;i++){
            chckBoxes[i].checked=true;
        }
    }
}

//++ !!!!Filter és search feature-ök implementálása!!!! ++//
function filter(hol){
    alert("szűrés a "+hol+"-ban");
}

function search(hol){
    alert("keresés a "+hol+"-ban");
}

function refreshTable(mit){
    if(mit=="stock"){
        var StockDivChildList = document.getElementById("stockDiv");  
        
        while (StockDivChildList.childElementCount>0){
            StockDivChildList.removeChild(StockDivChildList.childNodes[0]);   
        }

        Draw_Stock_Table();

    } else {
        var cartDivChildList = document.getElementById("cartDiv");  
        
        while (cartDivChildList.childElementCount>0){
            cartDivChildList.removeChild(cartDivChildList.childNodes[0]);   
        }
                           
        Draw_Cart_Table();

    }
    }