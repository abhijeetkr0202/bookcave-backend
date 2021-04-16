const apiResponse = require("../helpers/apiResponse");
const bcrypt = require("bcrypt");

var db = require("../../app");
const { body, validationResult } = require("express-validator");
const { insertSignupData } = require("../../models/user");

var collectionName = "logincred";



//validation and /signup route post function
exports.signup = [
    body('username').isLength({min:3}).trim().withMessage("Username is required").isAlphanumeric().withMessage("Username has non-alphanumeric characters."),
    body('useremail').trim().isEmail().withMessage("Valid email address required")
    .custom((value) => {
        let a=db.getDb();
        logincredcollection=a.collection(collectionName);
        return logincredcollection.findOne({"useremail":value}).then((data)=>{
            if (data)
            {
                return Promise.reject("E-mail already registered");
            }
        })
    }),
    body("password").isLength({min:6}).trim().withMessage("Password  must be greater than or equal to 6 characters"),
    (req,res)=>{
        try{
            const errors = validationResult(req);
            //Handling validation error
            if(!errors.isEmpty())
            {
                return apiResponse.validationErrorWithData(res, "Validation Error", errors.array()); 
            }
            else
            {
                //adding data to database after hashing
                bcrypt.hash(req.body.password,10,function (err,hash) {
                var loginData={
                    "username":req.body.username,
                    "useremail":req.body.useremail,
                    "password":hash
                } 
                var dbOb=db.getDb();
                insertSignupData(dbOb,collectionName,loginData);
                return apiResponse.successResponseWithData(res,"Registration Successful");                   
                });
            }
        }
        catch(err){
            return apiResponse.ErrorResponse(res,err);
        }
    }

];

exports.sigin = [
    body('useremail').trim().isEmail().withMessage("Valid email address required"),
    body("password").isLength({min:1}).trim().withMessage("Password must be specified"),
    (req,res)=>{
        try{
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return apiResponse.validationErrorWithData(res,"validation Error",errors.array());
            }
            else{
                let b=db.getDb();
                logincredcollection=b.collection(collectionName);
                logincredcollection.findOne({useremail:req.body.useremail}).then(data=>{
                    if(data)
                    {
                        bcrypt.compare(req.body.password,data.password,function (err,same) {
                            if(same)
                            {
                                let loginData = {
                                    _id: data._id,
                                    useremail: data.useremail
                                }
                                //authentication  token is to be created using logindata
                                return apiResponse.successResponseWithData(res,"Login Success",loginData);
                            }
                            else
                            {
                                return apiResponse.unauthorizedResponse(res,"Wrong password");
                            }
                        });
                    }
                    else
                    {
                        return apiResponse.unauthorizedResponse(res,"Wrong Credentials")
                    }
                });
            }
        }
        catch(err){return apiResponse.ErrorResponse(res,err);}
    }
];