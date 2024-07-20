const router = require('express').Router();
const providerController = require("../controllers/providerControllers")
const authGuard = require('../middleware/authGuard');


// create login api
router.get('/get_provider/:id',providerController.getSingleProvider)
router.get('/get_request/:id',providerController.getRequest)
router.patch('/accept/:id',providerController.acceptRequest)
router.patch('/reject/:id',providerController.rejectRequest)
router.post('/create_notification',providerController.createNotification)
router.get('/get_providers',providerController.getAllProviders)
router.get('/getFeedback',providerController.getFeedback)
router.get('/get_topProviders',providerController.topRatedProvider)

module.exports = router;
