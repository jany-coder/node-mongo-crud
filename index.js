const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

const password = 'J@ny15011988';


const uri = "mongodb+srv://admin:J@ny15011988@cluster0.5dt4u.mongodb.net/organicdb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
// Body-parser middleware

// app.use(express.urlencoded({extended:false}))
// app.use(express.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

app.get('/', (req, res) =>{
    res.sendFile(__dirname + '/index.html');
})


client.connect(err => {
  const productCollection = client.db("organicdb").collection("products");

  app.get('/products', (req, res) =>{
    productCollection.find({})
    .toArray((err, documents) => {
      res.send(documents);
    })
  })

  app.get('/product/:id', (req, res) =>{
    productCollection.find({_id: ObjectId(req.params.id)})
    .toArray((err, documents) =>{
      res.send(documents[0]);
    })
  })
  
  app.post("/addProduct", (req, res)=>{
      const product = req.body;
      productCollection.insertOne(product)
      .then(result =>{
        console.log('data added successfully');
        //res.send('success');
        res.redirect('/')
      })
  })

  app.patch('/update/:id', (req, res) =>{
    productCollection.updateOne({_id: ObjectId(req.params.id)},
    {
      $set: {price: req.body.price, quantity: req.body.quantity }
    })
    .then(result => {
      res.send(result.modifiedCount > 0)
    })
  })
    
  app.delete('/delete/:id', (req, res) =>{
    productCollection.deleteOne({_id: ObjectId(req.params.id)})
    .then(result =>{
      res.send(result.deletedCount > 0)
    })
  })
  
  });
  
  
  //client.close();



app.listen(4000);