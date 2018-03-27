/**
 * BookingController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */


module.exports = {  
  async getUserBookings(req,res){
    if (_.any(['username'], attr => !req.body[attr] || req.body[attr].trim().length === 0 )) {
        return res.badRequest({error: {message:'Attributes Incomplete.'},code:400});
      }   
      try{
        let searchData={
          username:req.body.username
        }
        const userDetails = await User.findOne(searchData)
         if(!userDetails)
          return  res.badRequest({error: {message:'No Such Username'},code:401});
      }catch(err){
        return res.badRequest({error: err.message}, null, err);
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
           let slots= userAppointments.map(slot=>slot.time)
           return res.json({
             bookedDates:slots
           });
        }
      }catch(err){
        return res.badRequest({error: err.message}, null, err);
      }
  },  
  async bookNewAppointment(req,res){
      console.log(req.body)
    if (_.any(['utcTimeSlots',
               'appointmentWith',
               'username'], attr => !req.body[attr] )) {
           return res.badRequest({error: {message:'Attributes Incomplete.'},code:400});
    }
     req.body.utcTimeSlots.map(async (time)=>{
        let bookingData={
          time,
          appointmentSeeker:req.body.username,
          appointmentWith:req.body.appointmentWith
        } 
        await Booking.create(bookingData)
     })
      return res.json(200);

  },
  async listAll(req,res){
    if (_.any(['username'], attr => !req.body[attr] || req.body[attr].trim().length === 0 )) {
        return res.badRequest({error: {message:'Attributes Incomplete.'},code:400});
      }
    
  },
  async delele(req,res){
    
  }
};

