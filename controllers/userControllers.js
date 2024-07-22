
const Users = require("../model/userModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const Feedback = require("../model/feedbackModel")
const Requests = require("../model/requestModel")
const Favourites = require("../model/favouriteModel")
const Notification = require("../model/notificationModel")

const createUser = async (req, res) => {
    // Step 1: Check incoming data
    console.log(req.body); // body includes JSON data

    // Step 2: Destructure the JSON data
    const { firstName, lastName, email, password, service } = req.body;

    // Step 3: Validate the data
    if (!firstName || !lastName || !email || !password) {
        return res.json({
            success: false,
            message: "Please enter all fields."
        });
    }

    try {
        // Step 4: Check if the user already exists
        const existingUser = await Users.findOne({ email });
        if (existingUser) {
            return res.json({
                success: false,
                message: "User already exists."
            });
        }

        // Step 5: Encrypt the password
        const generateSalt = await bcrypt.genSalt(10);
        const encryptedPassword = await bcrypt.hash(password, generateSalt);

        // Step 6: Create new user object
        const newUser = new Users({
            firstName,
            lastName,
            email,
            password: encryptedPassword,
            ...(service && { service, provider: true })
        });

        // Step 7: Save user
        await newUser.save();

        // Step 8: Send response
        res.json({
            success: true,
            message: "User created successfully."
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};
const loginUser = async(req,res) => {
    console.log(req.body)
    
    const {email,password}=req.body

    if(!email||!password){
        return res.json({
            success : false,
            message : "Enter all fields"
        })
    }
    
    // step 4: try catch block
    try{
        // step 5 : find user 
        const user = await Users.findOne({email:email}) //user store all the data of user
        if(!user){
            return res.json({
                success : false,
                message : "User does not exists"
            })
        }
        // step 6 : check password
        const passwordToCompare = user.password;
        const isMatch = await bcrypt.compare(password,passwordToCompare)

        if(!isMatch){
            return res.json({
                success : false,
                message : "Incorrect Password"
            })

        }
        // step 7 : create token
        const token = jwt.sign(
            {id : user._id},
            process.env.JWT_TOKEN_SECRET,
        )
        // step 8 : send response
        res.status(200).json({
            success : true,
            token : token,
            userData : user,
            message : "User logged in successfully."
        })
    }catch(error){
        console.log(error);
        res.json(error)

    }
}

const getSingleUser= async(req,res)=>{
    const id = req.params.id;
    if(!id){
        return res.json({
            success : false,
            message : "User ID is required!"
        })
    }
    try{
        const user = await Users.findById(id);
        res.json({
            success : true,
            message : "User fetched successfully",
            user : user
        })

    }catch(error){
        console.log(error);
        res.status(500).json("Server Error")

    }
}
const deleteUser = async (req, res) => {
  try {
      const userId = req.params.id;
      await Users.findByIdAndDelete(userId);
      await Requests.deleteMany({ providerId:userId });
      await Notification.deleteMany({ providerId:userId });
      await Favourites.deleteMany({ providerId:userId });
      await Feedback.deleteMany({ providerId:userId });

      res.json({
          success: true,
          message: 'User deleted successfully'
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({
          success: false,
          message: 'Server error'
      });
  }
};

const  createFeedback = async(req,res)=>{
    const providerId = req.params.id;

    console.log(req.body)
    const{feedback}=req.body;
    if(!feedback){
        return res.json({
            success : false,
            message : "All fields are required"
        })
    }
    try {
        const newfeedback = new Feedback({
            providerId : providerId,
            feedback : feedback,
        })
        await newfeedback.save();
        res.status(200).json({
            success : true,
            message : "Added successfully",
            data : newfeedback
        })
        
    } catch (error) {
        console.log(error);    
        res.status(500).json({
            success : false,
            message : error
        })
        
    }
}

const createRequest = async (req, res) => {
    const { userId, providerId, price } = req.body;
  
    if (!userId || providerId == null) {
      return res.json({
        success: false,
        message: "All fields are required"
      });
    }
  
    try {
      const existingRequest = await Requests.findOne({
        userId: userId,
        providerId: providerId
      });
  
      if (existingRequest) {
        return res.json({
          success: false,
          message: "You've already requested it"
        });
      }
  
      // Fetch provider's profile to get the default price if not provided
      let finalPrice = price;
      if (price == null) {
        const provider = await Users.findById(providerId);
        if (!provider) {
          return res.json({
            success: false,
            message: "Provider not found"
          });
        }
        finalPrice = provider.price;
      }
  
      const request = new Requests({
        userId: userId,
        providerId: providerId,
        price: finalPrice
      });
  
      await request.save();
  
      res.status(200).json({
        success: true,
        message: "Request added successfully",
        data: request
      });
  
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message
      });
    }
  };
  
  
  
  

const getActivatedRequests = async (req, res) => {
    const userId = req.params.id;
    const requestedPage = parseInt(req.query._page, 10) || 1;
    const limit = parseInt(req.query._limit, 10) || 5;
    const skip = (requestedPage - 1) * limit;
  
    if (requestedPage <= 0 || limit <= 0) {
      return res.status(400).json({
        success: false,
        message: "Page number and limit must be greater than zero",
      });
    }
    try {
        const requests = await Requests.find({
            userId : userId,
            accepted: true
        }).populate('providerId','firstName lastName email service').skip(skip).limit(limit);
        res.json({
            success : true,
            message : "Requests Fetched successfully",
            requests : requests
        })
    } catch (error) {
        console.log(error)
        res.status(500).json("Server error");
        
    }
  };
  
const createFavourites = async(req,res) =>{
    const{userId,providerId}=req.body;
    if(!userId || !providerId ){
        return res.json({
            success : false,
            message : "All fields are required"
        })
    }
    try {

        const favourite = await Favourites.findOne({
            userId:userId,
            providerId:providerId
        }) 
        if(favourite){
            return res.json({
                success : false,
                message : "You've already added it"
            })
        }
        const favourites = new Favourites({
            userId : userId,
            providerId : providerId,
        })
        await favourites.save();
        res.status(200).json({
            success : true,
            message : "Added Favourite successfully",
            data : favourites
        })
        
    } catch (error) {
        console.log(error);    
        res.status(500).json({
            success : false,
            message : error
        })
        
    }
}


const getFavourites = async(req, res) =>{
    const userId = req.params.id;
    const requestedPage = parseInt(req.query._page, 5)
    const limit = parseInt(req.query._limit, 5)
    const skip = (requestedPage - 1) * limit;

    try {
        const favourites = await Favourites.find({
            userId : userId
        }).populate('providerId','firstName lastName email service').skip(skip).limit(limit);
        res.json({
            success : true,
            message : "Favourites Fetched successfully",
            favourites : favourites
        })
    } catch (error) {
        console.log(error)
        res.status(500).json("Server error");
        
    }
}
const deleteFavourite = async(req,res)=>{
    try {
        const deleteFavourite = await Favourites.findByIdAndDelete(req.params.id);
        if(!deleteFavourite){
            return res.json({
                success:false,
                message:"Not found"
            })
        }
        res.json({
            success : true,
            message:"Favourite Removed"
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success:false,
            message:"Server Error"
        })
        
    }
}
const updateUserProfile = async (req, res) => {
    const userId = req.params.id;
    console.log(req.body);
  
    const { firstName, lastName, email, password, service, price } = req.body;
    if (!firstName || !lastName || !email) {
      return res.json({
        success: false,
        message: "Please enter all required fields."
      });
    }
  
    try {
      const user = await Users.findById(userId);
  
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }
  
      user.firstName = firstName;
      user.lastName = lastName;
      user.email = email;
  
      if (password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
      }
  
      if (service) {
        user.service = service;
        user.provider = true;
      }
  
      if (price !== undefined) {
        user.price = price;
      }
  
      await user.save();
  
      res.json({
        success: true,
        message: "User profile updated successfully",
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          ...(service && { service }),
          ...(price !== undefined && { price })
        }
      });
  
    } catch (error) {
      console.error('Error updating user profile:', error);
      res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message
      });
    }
  };

  const getNotification = async (req, res) => {
    const userId = req.params.id;

    try {
        const notifications = await Notification.find({ userId })
            .populate('userId', 'firstName')
            .populate('providerId', 'firstName')
            .populate('requestId', 'accepted');

        if (!notifications) {
            return res.status(404).json({
                success: false,
                message: 'No notifications found for this user'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Notifications fetched successfully',
            notifications: notifications
        });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};
const deleteNotification = async(req,res)=>{
    const userId = req.params.id
    try {
        const deleteNotification = await Notification.deleteMany({userId});
        if(!deleteNotification){
            return res.json({
                success:false,
                message:"Not found"
            })
        }
        res.json({
            success : true,
            message:"Notification Removed"
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success:false,
            message:"Server Error"
        })
        
    }
}

const getAllUsers = async(req ,res) =>{
    const requestedPage = parseInt(req.query._page, 5)
    const limit = parseInt(req.query._limit, 5)
    const skip = (requestedPage - 1) * limit;

    try {
        const listofusers = await Users.find({provider:false,isAdmin:false
        }).skip(skip).limit(limit);
        res.json({
            success: true,
            message : "All users fetched",
            users : listofusers
        })
    } catch (error) {
        console.log(error);
        res.status(500).json("Server Error")
    }
}

const requestComplete = async (req, res) => {
    try {
      const requestId = req.params.id;
      const { rating } = req.body;
  
      // Debugging: Log the rating received
      console.log('Received rating:', rating);
  
      // Validate rating
      const ratingValue = parseFloat(rating);
      if (isNaN(ratingValue) || ratingValue < 0 || ratingValue > 5) {
        return res.status(400).json({
          success: false,
          message: `Invalid rating. Rating must be a number between 0 and 5. Received: ${rating}`,
        });
      }
  
      const request = await Requests.findById(requestId);
      if (!request) {
        return res.status(404).json({
          success: false,
          message: 'Request not found',
        });
      }
  
      request.completed = true;
      await request.save();
  
      // Update the provider's rating
      const provider = await Users.findById(request.providerId);
      if (!provider) {
        return res.status(404).json({
          success: false,
          message: 'Provider not found',
        });
      }
  
      // Debugging: Log provider details before updating rating
      console.log('Provider details before rating update:', provider);
  
      if (rating) {
        // Update provider's rating
        if (!provider.ratingCount) {
          provider.ratingCount = 0;
        }
        if (!provider.ratingSum) {
          provider.ratingSum = 0;
        }
  
        provider.ratingCount += 1;
        provider.ratingSum += ratingValue;
        provider.rating = provider.ratingSum / provider.ratingCount;
  
        // Debugging: Log provider details after updating rating
        console.log('Provider details after rating update:', provider);
  
        await provider.save();
      }
  
      res.json({
        success: true,
        message: 'Request marked as completed and rating submitted',
      });
    } catch (error) {
      console.error('Error completing request:', error);
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message,
      });
    }
  };
  
const updateUserCoordinates = async(req,res)=>{
    try {
        const userId = req.params.id;
        const { latitude, longitude } = req.body;
    
        const user = await Users.findById(userId);
        if (!user) {
          return res.status(404).json({ success: false, message: 'User not found' });
        }
    
        user.coordinates = { latitude, longitude };
        await user.save();
    
        res.json({ success: true, message: 'Coordinates updated successfully' });
      } catch (error) {
        console.error('Error updating coordinates:', error.message);
        res.status(500).json({ success: false, message: 'Server error' });
      }
}

const getUserCoordinates = async(req,res)=>{
    try {
        const { id } = req.params;
    
        const user = await Users.findById(id).select('coordinates');
    
        if (!user) {
          return res.status(404).json({ success: false, message: 'User not found' });
        }
    
        res.json({ success: true, coordinates: user.coordinates });
      } catch (error) {
        console.error('Error fetching coordinates:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
      }
}

const cancelRequest = async (req, res) => {
    const requestId = req.params.id;
  
    try {
      const request = await Requests.findByIdAndDelete(requestId);
      if (!request) {
        return res.status(404).json({ success: false, message: 'Request not found' });
      }
  
     
      await request.deleteOne();
  
      res.status(200).json({ success: true, message: 'Request canceled successfully' });
    } catch (error) {
      console.error('Error canceling request:', error);
      res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
  };
module.exports = {
    createUser,loginUser,getSingleUser,createFeedback,createRequest,getActivatedRequests,createFavourites,getFavourites,deleteFavourite,updateUserProfile, getNotification,deleteNotification,getAllUsers,requestComplete,updateUserCoordinates,getUserCoordinates,cancelRequest,deleteUser
}