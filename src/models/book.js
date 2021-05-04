const mongodb = require('mongodb');
let db = require('../app');


function bookSchemaValidator() {
    db.getDb().createCollection("books", {
        validator: {
            $jsonSchema: {
                bsonType: "object",
                required: ["booktitle", "bookfilepath", "lastvisitedpage"],
                properties: {
                    booktitle: {
                        bsonType: "string",
                        description: "String allowed and is required"
                    },
                    bookfilename: {
                        bsonType: "string",
                        description: "String allowed"
                    },
                    bookfilepath: {
                        bsonType: "string",
                        description: "String allowed and is required"
                    },
                    lastvisitedpage: {
                        bsonType: "int",
                        description: "Integer allowed and is required"
                    },
                    markedpages: {
                        bsonType: "array",
                        description: "Array of integers allowed and is required"
                    },
                    user_id: {
                        bsonType: "objectId",
                        description: "object id allowed and is required"
                    },
                    uploadedOn: {
                        bsonType: "timestamp",
                        description: "epoch timestamp allowed and is required"
                    },
                    lastvisitedon: {
                        bsonType: "timestamp",
                        description: "epoch timestamp allowed and is required"
                    }
                }
            }
        }
    })
}


module.exports = {
    bookSchemaValidator
}