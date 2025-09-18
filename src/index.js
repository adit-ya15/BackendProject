//jab bhi database se baat krne ki koshish karenge tab 
//kuch na kuch error aa sakti hai isliye hum hamseha usko try catch mai wrap kaarenge
//ek baat hamesha yaad rakho ki databae hamesha dusere continent mai rakha hota hai 
//isliye use connect krne mai time lagega isliye hamesha async and await ka use karo

//threre are two ways to connect to database
//saara code ek hi file index.js mai likh do 
//dusra ki alag file mai likho phir export karo


//require('dotenv').config({path: './env'})
import dotenv from "dotenv"
import connectDB from "./db/index.js";

dotenv.config({
    path: '.env'
})

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err)=>{
    console.log("MONGO db connection failed !!!", err);
})







//first way
/*
import expres from "expres";
const app = expres()
(async () =>{
    try {
      await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`) 
      app.on("error", (error)=>{
        console.log("ERR: ", error);
        throw error
      })

      app.listen(process.env.PORT, ()=>{
        console.log(`App is listening on port ${process.env.PORT}`);
      })

    } catch (error) {
        console.error("ERROR: " , error)
        throw err
    }
})()*/
