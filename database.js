const mongoose = require("mongoose");


class database {

    constructor(){
        this.connect();
    }

    connect(){
        mongoose.connect("mongodb+srv://tanisha:tanisha0804@twitter-clone.hb9b6sb.mongodb.net/?retryWrites=true&w=majority")
        .then(() => {
            console.log("database connection successful!");
        })
        .catch((error) => {
            console.log("database connection error!"+ error);
        })
    }
}


module.exports = new database();
