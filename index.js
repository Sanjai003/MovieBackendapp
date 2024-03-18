import  express  from "express";
import { MongoClient, ObjectId } from 'mongodb'

const app = express();
const url="mongodb+srv://sanjai:sanjai02@movie.pnu5g5a.mongodb.net/?retryWrites=true&w=majority&appName=Movie"

const client= new MongoClient(url);
await client.connect();
console.log("database connected successfully");

app.use(express.json());

app.get("/",function(request,response){
   
    response.send("hello world!")
});
app.post("/post" , async function(request,response){
    const getpostman=request.body;
   // console.log(getpostman);
    const sendmethod = await client.db("CRUD").collection("data").insertOne(getpostman);
    response.send(sendmethod)
});

app.post("/postmany", async function(request,response){
    const getmany = request.body;
    const sendmethod =await client.db("CRUD").collection("data").insertMany(getmany);
    response.send(sendmethod)
});
app.get("/get", async function(request,response){
    const getmethod = await client.db("CRUD").collection("data").find({}).toArray();
    response.send(getmethod)
});
app.get("/getone/:id", async function(request,response){
    const {id} = request.params ;
    //console.log(id);
    const getmethod = await client.db("CRUD").collection("data").findOne({_id:new ObjectId(id)});
    response.send(getmethod)

});

app.put("/update/:id ",async function(request,response){
    const {id}= request.params ;
    const getpostman =request.body;
    const updatemethod = await client.db("CRUD").collection("data").updateOne({_id:new ObjectId(id)},{$set:getpostman});
    response.send(updatemethod)
    
});


app.delete("/delete/:id",async function(request,response){
    const {id} = request.params ;
    const deletemethod = await client.db("CRUD").collection("data").deleteOne({_id:new ObjectId(id)});
    response.send(deletemethod)
})
   




app.listen(4000,()=>
{
    console.log("server connection succesfully");
})
