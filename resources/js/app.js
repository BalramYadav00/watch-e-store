// Importing AJAX using axios library
import axios from 'axios'; // Importing from Node Modules folder
// Importing Noty for cart pop-up
import Noty from 'noty';
// Importing admin.js
import { initAdmin } from './admin'
import moment from 'moment'

let addToCart = document.querySelectorAll('.add-to-cart');
let cartCounter = document.querySelector('#cartCount');

function updateCart(item) {
    axios.post('/update-cart', item).then(res => {
        cartCounter.innerText = res.data.totalQty;
        new Noty({
            type: 'success',
            text: 'Item added to Cart',
            timeout: 1000,
            progressBar: false
        }).show();
    }).catch(err => {
        new Noty({
            type: 'error',
            text: 'Something went wrong',
            timeout: 1000,
            progressBar: false
        }).show();
    })
}

addToCart.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        let item = JSON.parse(btn.dataset.item);
        updateCart(item)
        console.log(item)
    })
})

const alertMsg = document.querySelector('#success-alert')
if(alertMsg){
    setTimeout(() => {
        alertMsg.remove()
    }, 2000)
}

// Change Order status
let statuses = document.querySelectorAll('.status-line');
let hidenInput = document.querySelector('#hiddenInput');
let order = hidenInput ? hiddenInput.value : null;
order = JSON.parse(order);
let time = document.createElement('small')

function updateStatus(order) {                          // Changing Colors and all...
    statuses.forEach((status) => {
        status.classList.remove('step-completed')
        status.classList.remove('current')
    })
    let stepCompleted = true;
    statuses.forEach((status) => {
        let dataProp = status.dataset.status
        if(stepCompleted){
            status.classList.add('step-completed')
        }
        if(dataProp === order.status) {
            stepCompleted = false;
            time.innerText = moment(order.updatedAt).format('hh:mm A')
            status.appendChild(time)
            if(status.nextElementSibling) {
                status.nextElementSibling.classList.add('current')
            }
        }
    })
}

updateStatus(order)

// Socket
let socket = io()
initAdmin(socket);

// Join
if(order){
    socket.emit('join', `order_${order._id}`)
}

// Admin
let adminAreaPath = window.location.pathname;
if(adminAreaPath.includes('admin')){
    socket.emit('join', 'adminRoom')
}

socket.on('orderUpdated', (data) => {               // data recieving from server.js
    const updatedOrder = { ...order }
    updatedOrder.updatedAt = moment().format()
    updatedOrder.status = data.status
    updateStatus(updatedOrder)
    new Noty({
        type: 'success',
        text: 'Order status updated',
        timeout: 1000,
        progressBar: false
    }).show();
})