const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema= new mongoose.Schema({
    name : {
        type : String,
        required : [true, 'Name is Required'],
        trime: true,
        maxlenght:[50,'Name should not exceed 50 char']
    },
    email:{
        type: String,
        required:[true,'Email is req'],
        unique: true,
        lowercase: true,
        trime: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    password : {
        type: String,
        required : [ true,'Password is required'],
        minlenght : [10, 'password must be of 10 charecters'],
        select: false

    },
    bio:{
        type: String,
        maxlenght:[100,'Bio should not exceed 100 charecters']

    },
    college: {
    type: String,
    maxlength: [100, 'College name cannot exceed 100 characters'],
    default: ''
  },
  skills: [{
    type: String,
    trim: true
  }],
  profilePhoto: {
    url: { type: String, default: '' },
    publicId: { type: String, default: '' }
  },
  theme: {
    type: String,
    enum: ['light', 'dark'],
    default: 'dark'
  }
},
{
  timestamps: true

});
//HASHING BEFORE WE SAVE
userSchema.pre('save',async function(next){
    if(!this.isModified('password'))return next();
    this.password = await bcrypt.hash(this.password,10);
});

userSchema.method.toSafeObject = function(){
    const obj= this.toObject();
    delete obj.password;
    return obj;  //RETURN SAFE USER OBJECT

}

module.exports = mongoose.model('User', userSchema);
