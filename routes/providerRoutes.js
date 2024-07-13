const router = require('express').Router();
const providerController = require("../controllers/providerControllers")
const authGuard = require('../middleware/authGuard');


// create login api
router.get('/get_providers',providerController.getAllProviders)
router.get('/get_request/:id',providerController.getRequest)
router.patch('/accept/:id',providerController.acceptRequest)
router.patch('/reject/:id',providerController.rejectRequest)
router.post('/create_notification',providerController.createNotification)
router.get('/getAllProviders',providerController.getAllProviders)
router.get('/getFeedback',providerController.getFeedback)

module.exports = router;
