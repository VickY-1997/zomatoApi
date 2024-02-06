const mongo = require('mongodb')
const {MongoClient} = require('mongodb')
const url = "mongodb+srv://vicky_03:2gBDRqpEelizHMgw@kfc.uh3mvos.mongodb.net/"
const client = new MongoClient(url)

const dbConnect = async () => {
    await client.connect()
    console.log('Database connected');
}
const db = client.db('zomato')

const getData = async(colName,query) => {
    let output = [];
    try{
        const cursor = db.collection(colName).find(query)
        for await(const data of cursor){
            output.push(data)
            cursor.closed
        }
    }catch(err){
        output.push({"Error" : "Error in getData"})
    }
    return output
}

const postData = async (colName,data) => {
    let  output = []
    try{
        const result = await db.collection(colName).insertOne(data)
        output.push(result)
    }catch(err){
        output.push({"Error" : "Error in postData"})
    }
    return output;
}

const updateOrder = async(colName, condition, data) => {
    let output = [];
    try{
        output = await db.collection(colName).updateOne(condition,data)
    }catch(err){
        output.push({"Error": "Error in updating order"});
    }
    return output
}

const deleteOrder = async(colName,condition) => {
    let output = [];
    try{
        output = await db.collection(colName).deleteOne(condition)
    }catch(err){
        output.push({"Error" : "Error in deleteOrder"})
    }
    return output;
}

module.exports = {
    dbConnect,
    getData,
    postData,
    updateOrder,
    deleteOrder
}


