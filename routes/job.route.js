const express = require("express");

const router = express.Router();
const jobsController = require("../controller/job.controller");
const auth = require("../services/auth.service");
const photoUpload = require("../services/uploadImage.service");

router.get("/:id/:ida", auth.authenticate, jobsController.getApplication);
router
  .route("/application/:id")
  .delete(auth.authenticate, jobsController.deleteApplication)
  .patch(auth.authenticate, jobsController.updateApplication);
router
  .route("/")
  .get(auth.authenticate, jobsController.getJobs) //done
  .post(
    auth.authenticate,
    photoUpload.single("companyLogo"),
    jobsController.createJob
  );//done
router.put("/publish/:id",jobsController.publishJob)
router
  .route("/:id")
  .delete(auth.authenticate, jobsController.deleteJob) //done
  .patch(auth.authenticate,photoUpload.single("companyLogo"),jobsController.updateJob) //done
  .post(auth.authenticate,photoUpload.single("cv"), jobsController.createJobApplication) //done
  .get(auth.authenticate,jobsController.getJob);//done

        
module.exports = router;
