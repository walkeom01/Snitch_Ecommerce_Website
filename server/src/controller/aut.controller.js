import userModel from "../models/user.model.js"


/*
* @description ; register an user and save the data from req.body

param req express.request
param req.body object
param req.body.email string
param req.body.name

*/

async function register(req,res) {
    const {email , name ,password} = req.body
}

