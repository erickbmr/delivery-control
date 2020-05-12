const electron = require('electron');
const {ipcRenderer} = electron; 
const salesTotal = document.querySelector('.sales-total');
const salesPres = document.querySelector('.sales-pres');
const salesApp = document.querySelector('.sales-app');
const salesWpp = document.querySelector('.sales-wpp');
const salesAmount = document.querySelector('.sales-amount');
const cardAmount = document.querySelector('.card-amount');
const moneyAmount = document.querySelector('.money-amount');
const onlineAmount = document.querySelector('.online-amount');

var amount = 0;

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

function incrementSales(saleInstance)
{
    amount = saleInstance.innerHTML;
    amount++;
    saleInstance.innerHTML = amount;
}

function incrementSalesAmount(newValue, saleInstance)
{
    amount = saleInstance.innerHTML;
    amount = Number(amount) + newValue;
    saleInstance.innerHTML = amount;
}

ipcRenderer.on('sale:add', function(e, sale)
{
    //0 => channel
    //1 => payment type
    //2 => payment value
    //online payment c/ wpp and pres
    //
    incrementSales(salesTotal);
    incrementSalesAmount(sale[2], salesAmount);
    handleCheck(sale);
});
      
