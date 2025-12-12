const mongoose=require("mongoose");

mongoose.connect(process.env.DB_URL);

const noteSchema=mongoose.Schema({
    title:{type:String},
    desc:{type:String},
    timestamp: { type: Date, default: Date.now },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
})

module.exports=mongoose.model("Notes",noteSchema);