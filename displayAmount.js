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
        incrementCardAmount(sale[2]);
    }
    else if(sale[1] == 2)
    {
        incrementMoneyAmount(sale[2]);
    }
    else
    {
        incrementOnlineAmount(sale[2]);
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
        incrementSalesApp();
        handleIncrement(sale);
    }

    else if(sale[0] == 2)
    {
        incrementSalesWpp();
        handleIncrement(sale);
    }

    else
    {
        incrementSalesPres();
        handleIncrement(sale);
    }
}

function incrementSalesTotal()
{
    amount = salesTotal.innerHTML;
    amount++;
    salesTotal.innerHTML = amount;
}

function incrementSalesPres()
{
    amount = salesPres.innerHTML;
    amount++;
    salesPres.innerHTML = amount;
}

function incrementSalesApp()
{
    amount = salesApp.innerHTML;
    amount++;
    salesApp.innerHTML = amount;
}

function incrementSalesWpp()
{
    amount = salesWpp.innerHTML;
    amount++;
    salesWpp.innerHTML = amount;
}

function incrementSalesAmount(newValue)
{
    amount = salesAmount.innerHTML;
    amount = Number(amount) + newValue;
    salesAmount.innerHTML = amount;
}

function incrementCardAmount(newValue)
{
    amount = cardAmount.innerHTML;
    amount = Number(amount) + newValue;
    cardAmount.innerHTML = amount;
}

function incrementMoneyAmount(newValue)
{
    amount = moneyAmount.innerHTML;
    amount = Number(amount) + newValue;
    moneyAmount.innerHTML = amount;
}

function incrementOnlineAmount(newValue)
{
    amount = onlineAmount.innerHTML;
    amount = Number(amount) + newValue;
    onlineAmount.innerHTML = amount;
}

ipcRenderer.on('sale:add', function(e, sale)
{
    //0 => channel
    //1 => payment type
    //2 => payment value
    //online payment c/ wpp and pres
    //
    incrementSalesTotal();
    incrementSalesAmount(sale[2]);
    handleCheck(sale);
});
      