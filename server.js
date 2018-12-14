const express = require('express');
const multer = require('multer')
const app = express();
const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient('localhost', '5001', { protocol: 'http' })
var fs = require('fs');
var path = require('path');


console.log("check-----",process.cwd())

app.post('/api/uploadipfsimage',(req,res)=>{
    const storage = multer.diskStorage({
        limits: {
            fileSize: 1000000,
            files: 1
        },
        destination: function(req, file, callback) {
            callback(null, './uploads');
        },
        filename: function(req, file, callback) {
            callback(null, file.fieldname + '-' + Date.now()+'.'+file.originalname.split(".")[1]);
        }
    })
    
    const upload = multer({
        storage: storage
    }).single('userPhoto');
    upload(req,res,(err,data)=>{
        if(err){
            return res.status(400).send("error uploading file")
        } else {
            console.log("file-----",req.file);
            ipfs.add(fs.readFileSync(req.file.path),(err,result)=>{
                if(err){
                    res.status(400).send(err)
                }else {
                    res.status(200).send({hash:result[0].hash,url:'https://ipfs.io/ipfs/'+result[0].hash})
                }
            })
        }
    })

})

app.listen(4200,()=>{
    console.log("running on port 4200")
})