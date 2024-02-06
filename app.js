const express = require('express')
const app = express()
const port = process.env.PORT || 1717
const { dbConnect, getData,postData, updateOrder, deleteOrder} = require('./controller/dbController')
const Mongo = require('mongodb')
const bodyParser = require('body-parser')
const cors = require('cors')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cors())

app.get('/', (req,res) => {
    res.send('<center><h1>This is Zomato Application API</h1></center>')
})

app.get('/location', async(req,res) => {
    let query = {}
    if(req.query.stateId){
        query = {state_id : parseInt(req.query.stateId)}
    }else{
        query = {}
    }
    let collection = 'location'
    let output = await getData(collection,query)
    res.send(output)
})

app.get('/orders', async(req,res) => {
    let query = {}
    if(req.query.email){
        query = {email : req.query.email}
    }else{
        query = {}
    }
    
    let collection = 'orders'
    let output = await getData(collection,query)
    res.send(output)
})

app.post('/placeOrders', async(req,res) => {
    let data  = req.body
    let collections = 'orders'
    let output = await postData(collections,data)
    res.send(output)
})

app.get('/mealType', async(req,res) => {
    let query = {}
    let collection = 'mealType'
    let output = await getData(collection,query)
    res.send(output)
})

app.get('/restData', async(req,res) => {
    let query = {}
    if(req.query.stateId){
        query = {state_id : parseInt(req.query.stateId) }
    }else if(req.query.mealType){
        query = {"mealTypes.mealtype_id" : Number(req.query.mealType)}
    }else if(req.query.mealName){
        query = {"mealTypes.mealtype_name" : req.query.mealName}
    }
    else{
        query = {}
    }
    let collection = 'restData'
    let output = await getData(collection,query)
    res.send(output)
})

app.get('/orders', async(req,res) => {
    let email = req.query.email
    if(email){
        query = {email : email}
    }else{
        query = {}
    }
    let collection = 'orders'
    let output = await postData(collection,data)
    res.send(output)
})

app.get('/filter/:mealId', async (req,res) => {
    let mealId = Number(req.params.mealId)
    let cuisineId = Number(req.query.cuisineId)
    let lCost = Number(req.query.lCost)
    let hCost = Number(req.query.hCost)
    if(cuisineId){
        query = {"mealTypes.mealtype_id" : mealId, 
                 "cuisines.cuisine_id" : cuisineId}
    }else if( lCost & hCost){
        query = {
            "mealTypes.mealtype_id" : mealId,
             $and : [{cost : {$gt : lCost, $lt : hCost}}]}
    }else{
        query = {}
    }
    let  collection = "restData"
    let output = await getData(collection,query)
    res.send(output) 
    
})

app.get('/details/:id', async(req,res) => {
    let id = Number(req.params.id)
    let query = {restaurant_id : id}
    let collection = 'restData'
    let output = await getData(collection,query)
    res.send(output)
})

app.get('/restMenu/:id', async (req,res) => {
    let id = Number(req.params.id)
    let query = {restaurant_id : id}
    let collection = 'restMenu'
    let output = await getData(collection,query)
    res.send(output)
})

app.get('/menuDetails', async(req,res) =>{
    let query = {}
    if(Array.isArray(req.body.id)){
        query = {menu_id : {$in : req.body.id}}
    }else{
        res.send('Please pass data in Array format')
    }
    let collection = 'restMenu'
    let output = await getData(collection,query)
    res.send(output)
})

app.put('/updateOrder', async(req,res) => {
    let collection = 'orders'
    let condition = {"_id" : new Mongo.ObjectId(req.body._id)}
    let data = {
        $set: {
            "status" : req.body.status
        }
    }
    let output = await updateOrder(collection,condition,data)
    res.send(output)
})

app.delete('/deleteOrder', async(req,res) => {
    let collection = 'orders'
    let condition = {"_id" : new Mongo.ObjectId(req.body._id)}
    let output = await deleteOrder(collection,condition)
    res.send(output)
})

app.listen(port, (err) => {
    dbConnect()
    if(err) throw err;
    console.log(`The server is running on port ${port}`);
})