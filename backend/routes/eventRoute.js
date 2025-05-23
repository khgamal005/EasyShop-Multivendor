const express = require("express");
const {
  eventValidator,
  deleteEventValidator,
} = require("../utils/validators/eventValidatoor");

const {
  createEvent,
  getallEventsofShop,
  uploadeventImages,
  resizeventImages,
  deletEvent,
  getallEvents
} = require("../controller/event");

const { isAuthenticated, isAdminOrSeller } = require("../middleware/auth");

const router = express.Router();

router.route("/").get(
      isAuthenticated,
    isAdminOrSeller,
  getallEventsofShop);

router
  .route("/create-event")
  .post(
    isAuthenticated,
    isAdminOrSeller,
    uploadeventImages,
    eventValidator,
    resizeventImages,
    createEvent
  );

router
  .route("/:id")
  .delete(isAuthenticated, isAdminOrSeller, deleteEventValidator, deletEvent);
router
  .route("/getallEvents")
  .get( getallEvents);

module.exports = router;
