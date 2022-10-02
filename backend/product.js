var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productSchema = new Schema({
    name: String,
    price: Number,
    stock: Number,
    departments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Department'}]
}, {versionKey: false});

module.exports = mongoose.model("Product", productSchema);
