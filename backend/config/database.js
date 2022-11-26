const mongoose = require('mongoose'); //



const connectDatabase=()=>{

mongoose.connect(process.env.db_URI , {useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,})
.then(( data )=>{
    
        console.log(`mongodb connected with server data ${data.connection.host}`);
});
};


module.exports=connectDatabase
