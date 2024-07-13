
const Users = require("../model/userModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const Requests = require("../model/requestModel")
const Notification = require("../model/notificationModel")
const Feedback = require("../model/feedbackModel")



const getAllProviders = async(req ,res) =>{
    const requestedPage = parseInt(req.query._page, 5)
    const limit = parseInt(req.query._limit, 5)
    const skip = (requestedPage - 1) * limit;

    try {
        const listofservices = await Users.find({provider:true}).skip(skip).limit(limit);
        res.json({
            success: true,
            message : "All providers fetched",
            providers : listofservices
        })
    } catch (error) {
        console.log(error);
        res.status(500).json("Server Error")
    }
}


const getRequest = async (req, res) => {
    const providerId = req.params.id;
    const requestedPage = parseInt(req.query._page, 10) || 1;
    const limit = parseInt(req.query._limit, 10) || 5;
    const skip = (requestedPage - 1) * limit;

    if (requestedPage <= 0 || limit <= 0) {
        return res.status(400).json({
            success: false,
            message: "Page number and limit must be greater than zero"
        });
    }

    try {
        const requests = await Requests.find({ providerId: providerId })
            .populate('userId', 'firstName email')
            .skip(skip)

            .limit(limit);

        res.json({
            success: true,
            message: "Requests fetched successfully",
            requests: requests
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};
const acceptRequest = async(req,res)=>{
    const requestId = req.params.id
    try {
        const request = await Requests.findById(requestId);
        if(!request){
            return res.json({
                success:false,
                message:'No requests found'
            })
        }
        request.accepted=true;
        await request.save();
        
        res.json({
            success: true,
            message: 'Request accepted',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
        });
    }
}

const rejectRequest = async(req,res)=>{
    const requestId = req.params.id
    try {
        const request = await Requests.findById(requestId);
        if(!request){
            return res.json({
                success:false,
                message:'No requests found'
            })
        }
        request.accepted=false;
        await request.save();
        res.json({
            success: true,
            message: 'Request rejected',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
        });
    }
}
const createNotification = async (req,res)=>{
    const {userId,providerId,requestId}= req.body;
    if(!userId ||! providerId ||!requestId){
        console.log("Fields Empty");
    }
    try {
        const newNotification = new Notification({
          userId,
          providerId,
          requestId,
        });
    
        await newNotification.save();
        res.status(201).json({ success: true, message: 'Notification created successfully', notification: newNotification });
      } catch (error) {
        console.error('Error creating notification:', error);
        res.status(500).json({ success: false, message: 'Server error' });
      }

}
const getFeedback = async (req, res) => {
    try {
        const feedbackData = await Feedback.find().populate('providerId');
        
        if (!feedbackData) {
            return res.status(404).json({
                success: false,
                message: 'No feedbacks found'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Feedbacks fetched successfully',
            reviews: feedbackData
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};


module.exports = {
    getAllProviders,getRequest,acceptRequest,rejectRequest,createNotification,getFeedback
}