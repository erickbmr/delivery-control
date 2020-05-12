const electron = require('electron');
const {ipcRenderer} = electron;

const sale = document.querySelector('form');

sale.addEventListener('submit', submitForm);

function submitForm(e)
{
    e.preventDefault();
    const saleChannel = document.querySelector('#channel-option').value;
    const paymentType = document.querySelector('#payment-option').value;
    const paymentValue = document.querySelector('#money-input').value;

    if(!isNaN(Number(paymentValue)) && saleChannel != 0 && paymentType != 0)
    {
        //online payment only happens in app sale
        if(paymentType == 3 && saleChannel != 1)
            return;
        
        const sale = [saleChannel, paymentType, Number(paymentValue)];

        ipcRenderer.send('sale:add', sale);
    }

}