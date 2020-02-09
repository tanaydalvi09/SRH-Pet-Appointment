const express = require('express');
const bodyParser = require ("body-parser");
const app = express();
const request = require('request');
const fs = require('fs');
app.use(bodyParser.json());
const path = require ('path');
const cors = require ('cors');
app.use(cors());
const db = require("./db");
const collection = "pets";



var corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
   
 /* app.get('/pets/:id', cors(corsOptions), function (req, res, next) {
    res.json({msg: 'This is CORS-enabled for only example.com.'})
});*/


app.get('/pets/:id', cors(corsOptions), function (req, res) {
    const petsID = req.params.petsID;
    res.json(db.getDB().collection(collection).findOne({_id : db.getDB(petsID)},(err,documents)=>{
        if(err)
            console.log(err);
         else{
             console.log(documents);
             res.json(documents);
         }
    }));
});
   
  /*app.listen(3001, function () {
    console.log('CORS-enabled web server listening on port 3001')
});*/

app.get('/pets/:id', cors(), function (req, res, next) {
    res.json({msg: 'This is CORS-enabled for a Single Route'})
});
   
  /*app.listen(3001, function () {
    console.log('CORS-enabled web server listening on port 3001')
});*/



 
app.get('/pets/:id', function (req, res, next) {
    res.json({msg: 'This is CORS-enabled for all origins!'})
});
   
 /* app.listen(3001, function () {
    console.log('CORS-enabled web server listening on port 3001')
});*/

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'db.js'));
});
 
///// Using Below code we can query out all data in Database 

app.get('/pets',(req,res)=>{
    db.getDB().collection(collection).find({},{projection: {petName:1,ownerName:1,aptNotes:1,aptDate:1,_id:0}}).toArray((err,documents)=>{
        if(err)
            console.log(err);
         else{
             console.log(documents);
             res.json(documents);
         }
    });
});

///////// Using the Below code we can get particular Pet details 
//// syntax example http://localhost:9000/Peter 


app.get('/:petName',(req,res)=>{
    const petName = req.params.petName;
    db.getDB().collection(collection).find({petName: req.params.petName}).toArray((err,documents)=>{
        if(err)
            console.log(err);
         else{
             console.log(documents);
             res.json(documents);
         }
    });
});


///////// Changing Pet Name using Pet ID //////////////77

app.put('/:id',(req,res)=>{
    const petsID = req.params.id;
    const userInput = req.body;
 
    db.getDB().collection(collection).findOneAndUpdate({_id : db.getPrimaryKey(petsID)},{$set :{petName : userInput.petName}},{returnOriginal : false},(err,result )=>{
        if(err)
            console.log(err);
         else
             res.json(result);
    });
});



app.put('/:ownerName',(req,res)=>{
    const ownerName = req.params.ownerName;
    const userInput = req.body;
    db.getDB().collection(collection).findOneAndUpdate({_id : db.getDB(ownerName)},{$set :{ownerName : userInput.ownerName}},{returnOriginal : false},(err,result )=>{
        if(err)
            console.log(err);
         else
             res.json(result);
    });
});



app.put('/:aptNotes',(req,res)=>{
    const aptNotes = req.params.aptNotes;
    const userInput = req.body;
 
    db.getDB().collection(collection).findOneAndUpdate({_id : db.getDB(aptNotes)},{$set :{aptNotes : userInput.aptNotes}},{returnOriginal : false},(err,result )=>{
        if(err)
            console.log(err);
         else
             res.json(result);
    });
});
 

app.put('/:aptDate',(req,res)=>{
    const aptDate = req.params.aptDate;
    const userInput = req.body;
 
    db.getDB().collection(collection).findOneAndUpdate({_id : db.getDB(aptDate)},{$set :{aptDate : userInput.aptDate}},{returnOriginal : false},(err,result )=>{
        if(err)
            console.log(err);
         else
             res.json(result);
    });
});
 
app.post('/',(req,res)=>{
    const userInput = req.body;
    db.getDB().collection(collection).insertOne(userInput,(err,result)=>{
        if(err)
            console.log(err);
        else
            res.json({result :result, document : result.ops[0]});
    });
});
 
app.delete('/:id',(req,res)=>{
    const petsID = req.params.id;
 
    db.getDB().collection(collection).findOneAndDelete({_id : db.getPrimaryKey(petsID)},(err,result)=>{
        if(err)
            console.log(err);
        else
            res.json(result);
    });
});
 
 
 
db.connect((err)=>{
    if(err){
         console.log('unable to connect to database');
         process.exit(1);
    }
    else{
         app.listen(9000,()=>{
             console.log('connected to database,app listening on port 9000');
         });
    }
})