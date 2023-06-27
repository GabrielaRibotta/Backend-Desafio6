import 'dotenv/config.js'
import mongoose from "mongoose";

const URI = process.env.URL_MONGODB_ATLAS

mongoose.connect(URI)
.then(() => console.log(`Conected to DB`))
.catch(error => console.log(error))