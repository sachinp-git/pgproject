/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const bcrypt=require('bcrypt');
const saltRounds=2;

module.exports = {
  async signup(req, res){
    if (_.any(['name', 'email', 'password'], attr => !req.body[attr] || req.body[attr].trim().length === 0 )) {
      return res.badRequest({error: {message:'The provided fullName, password and/or email address are invalid.'},code:400});
    }
    try{
      let search={
        name:req.body.name.split(" ").join("")
      }
      const users = await User.find(search)
      let userName=search.name +(users.length+1)
      let addData={
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, saltRounds),
        name: req.body.name,
        userName
      }
      
      await User.create(addData)
      .intercept('E_UNIQUE', 'emailAlreadyInUse');
      return res.json(200);
    }catch(err){
      return res.badRequest({error: err.message}, null, err);
    }
  },
  async getUserBookingDetails(req, res){
    if (_.any(['username'], attr => !req.body[attr] || req.body[attr].trim().length === 0 )) {
      return res.badRequest({error: {message:'The provided fullName, password and/or email address are invalid.'},code:400});
    }
    try{
      let searchData={
        appointmentWith:req.body.username
      }
      const userAppointments = await Booking.find(searchData)
      if(userAppointments.length<1){
          return res.json({
              bookedDates:[]
          });
      }
      else{
         let slots= userAppointments.map(slot=>{
           return {
            time:slot.time,
            name:slot.appointmentSeeker
           }
         })
         return res.json({
           bookedDates:slots
         });
      }
      
    }catch(err){
      return res.badRequest({error: err.message}, null, err);
    }
  },
  async login(req, res){
    if (_.any(['email', 'password'], attr => !req.body[attr] || req.body[attr].trim().length === 0 )) {
      return res.badRequest({error: {message:'The provided password and email address are invalid.'},code:400});
    }
    try{
      let searchData={
        email:req.body.email
      }
      const userDetails = await User.findOne(searchData)
      console.log(userDetails);
      if(!userDetails){
        return res.badRequest({error:{message:'The provided email address is invalid.'},code:401})
      }
      else{
        if(bcrypt.compareSync(req.body.password,userDetails.password)){
          delete userDetails.password
          return res.json(userDetails);
        }
        else{
          return res.badRequest({error:{message:'The provided Password is invalid'},code:402})
        }
      }
    }catch(err){
      return res.badRequest({error: err.message}, null, err);
    }
  }
};

