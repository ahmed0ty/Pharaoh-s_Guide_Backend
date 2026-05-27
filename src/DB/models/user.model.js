// import mongoose from 'mongoose';

// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   password: {
//     type: String,
//     required: true,
//   },
//   profileImage: {
//     type: String,
//     default: '',
//   },
//   isConfirmed: {
//     type: Boolean,
//     default: false,
//   },
//   isActive: {
//     type: Boolean,
//     default: true,
//   },
//   role: {
//     type: String,
//     enum: ['user', 'admin'],
//     default: 'user',
//   },
//   confirmEmailOTP: String,
//   confirmEmailExpires: Date,
//   resetPasswordOTP: String,
//   resetPasswordExpires: Date,
//   refreshTokens: [
//     {
//       token: String,
//     },
    
//   ],
//   favorites: [
//   {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Place',
//     default: [],
//   },
// ],
  
// }, { timestamps: true });

// export default mongoose.model('User', userSchema);








import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String,
    default: null,
  },
  isConfirmed: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  confirmEmailOTP: String,
  confirmEmailExpires: Date,
  resetPasswordOTP: String,
  resetPasswordExpires: Date,
  refreshTokens: [
    {
      token: String,
    },
  ],
  favorites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Place',
      default: [],
    },
  ],
}, { timestamps: true });

export default mongoose.model('User', userSchema);