import express from 'express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'

const app = express()
const port = 3001

// db connect
// mongoose.connect("mongodb://localhost:27017/users").then(() => {
//     console.log("Connected to MongoDB...");
// }).catch(err => console.log(`Connection MongoDB Error: ${err}`));

mongoose.connect("mongodb://mongodb:27017/users").then(() => {
    console.log("Connected to MongoDB...");
}).catch(err => console.log(`Connection MongoDB Error: ${err}`));

// Schema
const UserSchema = new mongoose.Schema({
    name: String,
    email: String
})

const User = mongoose.model("User", UserSchema);

// middleware
app.use(bodyParser.json())

app.get("/users", async (req, res) => {
    const users = await User.find();

    res.status(200).json(users)
})

app.post("/users", async (req, res) => {
    try {        
        const { name, email } = req.body
        const user = new User({ name, email })

        await user.save(user);

        res.status(201).json({
            message: "create user successful",
            user: user
        });
    } catch (error) {
        console.log(`Error ${error}`);
        res.status(500).json({
            error: `Internal Server error: ${error}`
        })
    }
})

app.get('/', (req, res) => {
    res.send('user-service')
})

app.listen(port, () => {
    console.log(`app listening on port: ${port}`)
})

