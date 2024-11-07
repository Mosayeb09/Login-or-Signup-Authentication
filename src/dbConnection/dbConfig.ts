import mongoose  from "mongoose";


export async function connect() {

    try{

       mongoose.connect(process.env.MONGO_URI! )

    //    const connection = mongoose.Connection
       mongoose.connection.on('connected',()=>{
        console.log('MongoBD connected');
       })

    //    connection.on('conneted', ()=> {
    //     console.log('MongoBD connected');
    //    })

       mongoose.connection.on('error',(err)=> {
        console.log('MongoDB connection error , please make sure db is up and running' + err);
        process.exit()
       })

    }
    catch (error){

        console.log('Somthing went wrong with the db connection');
        console.log(error);


    }
    
}