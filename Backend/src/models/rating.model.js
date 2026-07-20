const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rating = new Schema({
    email : {
        type:String,
        required:true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    name : {
        type : String
    },
    stars : {
        type : Number,
        require : true
    },
    Comment : {
        type : String,
        require : true
    },
    time : {
        type : Date
    }
});

module.exports = mongoose.model('Rating',rating);