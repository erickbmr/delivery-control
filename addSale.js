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

    const sale = [saleChannel, paymentType, paymentValue];

    ipcRenderer.send('sale:add', sale);

}


