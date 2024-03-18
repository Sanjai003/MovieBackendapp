import  express  from "express";
import { MongoClient, ObjectId } from 'mongodb'
import  cors  from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const app = express();
const url="mongodb+srv://sanjai:sanjai02@movie.pnu5g5a.mongodb.net/?retryWrites=true&w=majority&appName=Movie"

const client= new MongoClient(url);
await client.connect();
console.log("database connected successfully");

app.use(express.json());
app.use(cors());
const Auth =((request,response,next)=>{
   try{
  const token =request.header("backend-token");
  jwt.verify(token,"sanjai");
  next();
  

  }
catch{
      response.status(401).send({message:error.message})
}
})

app.get("/",function(request,response){
   
    response.status(200).send("hello world!")
});
app.post("/post" , async function(request,response){
    const getpostman=request.body;
   // console.log(getpostman);
    const sendmethod = await client.db("CRUD").collection("data").insertOne(getpostman);
    response.status(201).send(sendmethod)
});

app.post("/postmany", async function(request,response){
    const getmany = request.body;
    const sendmethod =await client.db("CRUD").collection("data").insertMany(getmany);
    response.status(201).send(sendmethod)
});
app.get("/get",Auth, async function(request,response){
    const getmethod = await client.db("CRUD").collection("data").find({}).toArray();
    response.status(200).send(getmethod)
});
app.get("/getone/:id", async function(request,response){
    const {id} = request.params ;
    //console.log(id);
    const getmethod = await client.db("CRUD").collection("data").findOne({_id:new ObjectId(id)});
    response.status(200).send(getmethod)

});

app.put("/update/:id",async function(request,response){
    const {id}= request.params ;
    const getpostman =request.body;
    const updatemethod = await client.db("CRUD").collection("data").updateOne({_id:new ObjectId(id)},{$set:getpostman});
    response.status(201).send(updatemethod)
    
});


app.delete("/delete/:id",async function(request,response){
    const {id} = request.params ;
    const deletemethod = await client.db("CRUD").collection("data").deleteOne({_id:new ObjectId(id)});
    response.status(200).send(deletemethod)
});

app.post("/register", async (req, res) => {

    const {username , email , password} = req.body;


  const UserFind = await client
    .db("CURD")
    .collection("private").findOne({email:email});


  if (UserFind) res.status(400).send("User Already Exist");
  else {
    const salt = await bcrypt.genSalt(10);
    const hashedpassword= await bcrypt.hash(password,salt);
    console.log(hashedpassword);
    const registerMethod =await client
      .db("CURD")
      .collection("private")
      .insertOne({username:username , email:email , password:hashedpassword});
     
    res.status(201).send(registerMethod);
  }
});


app.post("/login",async function(request,response){
    const {email,password} = request.body;
    const userfind= await client.db("CRUD").collection("private").findOne({email:email});
    if(userfind)
    {
        const mongodbpassword=userfind.password;
        const passwordcheck=await bcrypt.compare(password,mongodbpassword);
        console.log(passwordcheck);
        if(passwordcheck)
        {
          const token= jwt.sign({id:userfind._id},"sanjai");
          response.status(200).send({token:token});
        }
        else
        {
           response.status(400).send("Invalid password");
        }
    }
    //console.log();
    else
    {
        response.status(400).send("Invalid email");
    }
 })




app.listen(4000,()=>
{
    console.log("server connection succesfully");
})
