const router = require('express').Router();
const userController = require("../controllers/userControllers")
const authGuard = require('../middleware/authGuard');

router.post('/register', userController.createUser)

// create login api
router.post('/login', userController.loginUser)
router.post('/create_feedback/:id',userController.createFeedback)
router.post('/create_request',userController.createRequest)
router.get('/activatedRequests/:id',userController.getActivatedRequests)
router.post('/create_favourite',userController.createFavourites)
router.get('/get_favourite/:id',userController.getFavourites)
router.delete('/delete_favourite/:id',authGuard,userController.deleteFavourite)
router.put('/updateProfile/:id',authGuard,userController.updateUserProfile)
router.get('/getSingleUser/:id',userController.getSingleUser)
router.get('/get_notification/:id',userController.getNotification)
router.get('/getAllUsers',userController.getAllUsers)
router.delete('/delete_notifications/:id',userController.deleteNotification)
router.post('/complete/:id',userController.requestComplete)
router.put('/updateCoordinates/:id',userController.updateUserCoordinates);
router.get('/getCoordinates/:id',userController.getUserCoordinates);
router.delete('/cancelRequest/:id',userController.cancelRequest)

router.delete('/deleteUser/:id',userController.deleteUser)
module.exports = router;
