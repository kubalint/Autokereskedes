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
    
    //++ Megfigyeljük a mezők alatt lévő gombot ++//
    uploadButton.addEventListener('click',Button_Click_Handler, false);

    //++ Megfigyeljük a raktáron lévő autók tömbjének változását ++//
    //carsOnStock.addEventListener('change',Draw_Stock_Table,false);
}

//++ A gomb megnyomásakor ezt a függvényt futtatjuk le ++//
function Button_Click_Handler(){    

    //++ Adatok beolvasása a mezőkből ++//
    var currentName = productNameTXT.value;
    var currentColor = productColorTXT.value;
    var currentHP = productHPTXT.value;
    var currentPrice = productPriceTXT.value;
    var currentPic = productPicTXT.value;

    stockTable = document.querySelector("#stockTableElement");


    //++ Mezők validálása ++//    
    if(currentName=="" || currentColor=="" || currentHP=="" || currentPrice=="" || currentPic==""){
        alert("Tölts ki minden mezőt!");
    } else {
    
        //++ Ha minden ki van töltve, készítünk egy új autót a tömbünkbe++//
        var currentCar = new Car(1,currentName,currentColor,currentHP,currentPrice,currentPic);    
        carsOnStock.push(currentCar);

        //++ Gomb megnyomására a középső div gyerekét törli majd újat csinál neki ++//
        var StockDivChildList = document.getElementById("stockDiv");  
        StockDivChildList.removeChild(StockDivChildList.childNodes[0]);           
        Draw_Stock_Table();
    }

    
}

function Draw_Stock_Table(){
    var inputArray= carsOnStock;
    var table = document.createElement("table");
    var row = document.createElement("tr");
    for (var k in inputArray[0]){
        var col = document.createElement("th");
        col.innerText = k;
        row.appendChild(col);
    }
    //++ Delete oszlop létrehozása utolsóként ++//
    var col = document.createElement("th");
    col.innerText = "Delete";
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
        col.innerHTML = "<button id=\"stockDelBtn\" style=\"color: red;\">X</button>"
        row.appendChild(col);
        
        table.appendChild(row);
    }
    table.setAttribute("border","1");
    table.setAttribute("id","stockTableElement");

    stockTableParent.appendChild(table);
}


