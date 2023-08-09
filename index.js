import express from 'express'
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import ejs from 'ejs'
import fetch from 'node-fetch';


const app = express();
const apiUrl="https://api.wazirx.com/api/v2/tickers"

mongoose.connect(
  "mongodb+srv://prempk7172:prem@cluster0.dkzlbmo.mongodb.net/quab"
);
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


const dataSchema = {
    name: String,
    last:String,
    buy:String,
    volume:String,
    base_unit:String,
    sell:String
}
//model
const Data = mongoose.model("Data", dataSchema);


//routes
fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
        const a=[]
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
              a.push(key)
            }
            }
        console.log(a.slice(0,10))
        for(var i=0;i<a.length;i++)
        {
            const data1=new Data(
                {
                    name:a[i],
                    last:data[a[i]].last,
                    buy:data[a[i]].buy,
                    volume:data[a[i]].volume,
                    base_unit:data[a[i]].base_unit,
                    sell:data[a[i]].sell 
                }
            )
            data1.save()
        }
        
  })
  .catch(error => {
    console.error(error);
  });
app.get("/",async(req,res)=>
{
    const data=await Data.find({}).limit(10)
    res.render("home",{data:data});
})

app.listen(2000,()=>
{
    console.log("server is running on port 3000");
})
