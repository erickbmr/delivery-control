const electron = require('electron');
const {ipcRenderer} = electron; 

//var for link html with js
const salesTotal = document.querySelector('.sales-total');
const salesPres = document.querySelector('.sales-pres');
const salesApp = document.querySelector('.sales-app');
const salesWpp = document.querySelector('.sales-wpp');
const salesAmount = document.querySelector('.sales-amount');
const cardAmount = document.querySelector('.card-amount');
const moneyAmount = document.querySelector('.money-amount');
const onlineAmount = document.querySelector('.online-amount');

//total
var amount = 0;

//increment in html which sale registered
function handleIncrement(sale)
{
    if(sale[1] == 1)
    {
        incrementSalesAmount(sale[2], cardAmount);
    }
    else if(sale[1] == 2)
    {
        incrementSalesAmount(sale[2], moneyAmount);
    }
    else
    {
        incrementSalesAmount(sale[2], onlineAmount);
    }
}

//check the channel and payment type from a sale and call increment function
function handleCheck(sale)
{
    //sale[0] => channel
    //sale[1] => pay type
    //sale[2] => pay value

    //1 => card     --   app
    //2 => money    --   wpp
    //3 => online   --   pres

    if(sale[0] == 1)
    {
        incrementSales(salesApp);
        handleIncrement(sale);
    }

    else if(sale[0] == 2)
    {
        incrementSales(salesWpp);
        handleIncrement(sale);
    }

    else
    {
        incrementSales(salesPres);
        handleIncrement(sale);
    }
}

//increment number of sales across all channels
function incrementSales(saleGeneric)
{
    amount = saleGeneric.innerHTML;
    amount++;
    saleGeneric.innerHTML = amount;
}

//increment values of sales across all channels
function incrementSalesAmount(newValue, saleGeneric)
{
    amount = saleGeneric.innerHTML;
    amount = Number(amount) + newValue;
    saleGeneric.innerHTML = amount;
}

//from a sale registered, this is called
ipcRenderer.on('sale:add', function(e, sale)
{
    //0 => channel
    //1 => payment type
    //2 => payment value
    //wpp and pres do not offer online payment
    //
    incrementSales(salesTotal);
    incrementSalesAmount(sale[2], salesAmount);
    handleCheck(sale);
});
      
