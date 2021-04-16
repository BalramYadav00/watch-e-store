const Order = require('../../../models/order');
const moment = require('moment')

const regexPhone = /^[6-9]\d{9}$/;

function orderController() {
    return{
        store(req, res){
            // Validate Request

            // Getting fields
            const { phone, address } = req.body
            const finalPhone = phone.trim();
            const finalAddress = address.trim();

            if(!finalPhone || !finalAddress) {
                req.flash('error', 'All fields are required!')
                req.flash('phone', phone)
                req.flash('address', address)
                return res.redirect('/cart')
            }
            if(!regexPhone.test(finalPhone)){
                req.flash('error', 'Please enter a valid Phone Number!')
                req.flash('phone', phone)
                req.flash('address', address)
                return res.redirect('/cart')
            }

            const order = new Order({
                customerId: req.user._id,
                items: req.session.cart.items,
                phone: finalPhone,
                address: finalAddress
            })
            order.save().then(result => {
                Order.populate(result, { path: 'customerId' }, (err, placedOrder) => {
                    req.flash('success', 'Order placed successfully.')
                    delete req.session.cart
                    // Emit
                    const eventEmitter = req.app.get('eventEmitter') // From server.js
                    eventEmitter.emit('orderPlaced', placedOrder)  //So that it can be emit (accessible) anywhere
                    
                    return res.redirect('/customer/orders')
            })
            }).catch(err => {
                req.flash('error', 'Something went wrong!')
                return res.redirect('/cart')
            })
        },
        async index(req, res) {
            const orders = await Order.find({ customerId: req.user._id },
                null,
                { sort: { 'createdAt': -1 } })
            
            res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0')  // The green flash on my orders will be only once after placing order
            res.render('customers/orders', { orders: orders, moment: moment }) // Passing this using EJS on order.ejs
            console.log()
        },
        async show(req, res) {
            const order = await Order.findById(req.params.id)
            // Authorizing User
            if(req.user._id.toString() === order.customerId.toString())
                return res.render('customers/singleOrder', { order });
                
            return res.redirect('customers/orders')
        }
    }
}

module.exports = orderController;