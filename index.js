/**
 * Expense tracker
 * 
 * Features and end points
 * 
 * adding a new expense/income :  /add-expense ->post
 * displaying existing expenses : /get-expenses ->get
 * editing existing entries : /edit-expense ->/put
 * deleting expenses : /delete-expense ->delete
 * 
 * budget reporting
 * creating new user
 * validating user
 * 
 * Defining schema
 * Categories,Amount,Date
 */
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose=require('mongoose')
const express =require('express')
const{Expense} = require('./schema.js')
const app = express()
app.use(bodyParser.json())
app.use(cors())

 async function connectToDb() {
    try{
    await mongoose.connect('mongodb+srv://Jayshree:Jay3107@cluster0.56k4uif.mongodb.net/ExpenseTracker?retryWrites=true&w=majority&appName=Cluster0')
    console.log('DB connection established :)')
    const port = process.env.PORT|| 8000
    app.listen(port, function() {
        console.log(`Listening on port ${port}...`)
    })
}catch(error){
    console.log(error)
}
}
connectToDb()
app.post('/add-expense',async function(request,response){
    try{
//     console.log(request.body)
//     response.json ({
//         "status" : "created"  
// })
   
    await Expense.create({
        "amount" : request.body.amount,
        "category": request.body.category,
        "date":request.body.date
    })
    response.status(201).json({
        "status":"success",
        "message":"new message sended"
    })
}catch(error){
    response.status(500).json({
        "status":"failure",
        "message":"new message  not sended"
    })
}
})
app.get('/get-expenses',async function(request,response){
    try{
        const expensesData = await Expense.find()
        response.status(200).json(expensesData)
    }catch(error){
        response.status(500).json({
            "status" : "failure",
            "message" : "couldnot fetch entries",
            "error" : error
        })
    }
    
})  

//localhost:8000/delete-expense/65e69ebc07b38a2af4b6c453
//localhost:8000/delete-expense/<params>
app.delete('/delete-expense/:id',async function(request,response){
    //console.log(request.params.id)
   try{
    const expenseData = await Expense.findById(request.params.id)
    if(expenseData){
        await Expense.findByIdAndDelete(request.params.id)
        response.status(200).json({
            "status" : "success",
            "message" : "deleted entry"
        })
    }else{
        response.status(404).json({
            "status" : "failure",
            "message": "could not find document"
        })
    }
   }
   catch(error){
    response.status(500).json({
        "status" : "error",
       
    })
   }
})
app.patch('/edit-expense/:id',async function(request,response){
    try{
        const expenseentry=await Expense.findById(request.params.id)
    if(expenseentry){
        await expenseentry.updateOne({
            "amount":request.body.amount,
            "category":request.body.category,
            "date":request.body.date
        })
        response.status(200).json({
            "status":"Success",
            "message":"edited"
        })
    }
    else{
        response.status(404).json({
            "status":"failure",
            "message":"not edited"
        })
    }
    }
    catch(error){
        response.status(500).json({
            "status":"error"
        })
    }
})

// const port=8000
// app.listen(port,function(){
//     console.log(`Listening on port  ${port}...`)
// })