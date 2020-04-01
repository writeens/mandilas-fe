module.exports = {
    entry: {
        firebase:'./public/Utility/init-firebase.js',
        navbar:'./public/Navbar/navbar.js',
        cart:'./public/Cart/index.js',
        checkout:'./public/Checkout/index.js'
    },
    output: {
        path: __dirname + '/dist',
        filename: '[name].js'
    }
}
