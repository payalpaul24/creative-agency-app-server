const express = require('express')
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors')
const bodyParser = require('body-parser');


const port = 5000;

const app = express()
app.use(bodyParser.json());
app.use(cors());


app.get('/', (req, res) => {
    res.send('Welcome to Creative Agency Server Side')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mjawr.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    const orderCollection = client.db("myAgencyApp").collection("orderList");
    const feedbackCollection = client.db("myAgencyApp").collection("reviewsList");
    const AddServiceCollection = client.db("myAgencyApp").collection("serviceList");
    const makeAdminCollection = client.db("myAgencyApp").collection("makeAdmin");

    // store customer order in database
    app.post('/placeOrder', (req, res) => {
        order = req.body;
        orderCollection.insertOne(order)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    app.get("/placeOrders", (req, res) => {
        orderCollection.find({})
            .toArray((error, documents) => {
                res.send(documents);
            });
    });

    // feedback/reviews post method

    app.post('/insertFeedback', (req, res) => {
        feedback = req.body;
        feedbackCollection.insertOne(feedback)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    app.get('/reviews', (req, res) => {
        feedbackCollection.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })

    app.post('/addServices', (req, res) => {
        addService = req.body;
        AddServiceCollection.insertOne(addService)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    app.get('/addServiceView', (req, res) => {
        AddServiceCollection.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })

    // make new admin
    app.post('/makeAdmin', (req, res) => {
        newAdmin = req.body
        makeAdminCollection.insertOne(newAdmin)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    app.get('/makeIsAdmin', (req, res) => {
        const email = req.body.email;
        makeAdminCollection.find({ email: email })
            .toArray((err, isAdmin) => {
                res.send(isAdmin > 0)
            })
    })

    




});









app.listen(process.env.PORT || port);