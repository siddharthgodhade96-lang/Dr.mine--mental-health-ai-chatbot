const mongoose = require("mongoose");

mongoose.connect(process.env.DB_URL);

const userSchema = mongoose.Schema({
  username: { type: String,required:true,unique:true },
  email: { type: String,required:true },
  password: { type: String,required:true,unique:true },
  mood: [
    {
      mood: String,
      time: Date,
    },
  ],
  notes:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Notes'
  }],

},{ timestamps: true });



module.exports = mongoose.model("User", userSchema);

