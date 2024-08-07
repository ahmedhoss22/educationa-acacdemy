const Job = require("../model/jobs.model");
const loggerEvent = require("../services/logger");
const logger = loggerEvent("job");
const validator=require('validator')

const createJob = (req, res) => {
  console.log("body" ,req.body);
  console.log("file" ,req.file);
  const {
    companyName,
    field,
    location,
    aboutCompany,
    position,
    type,
    minRange,
    maxRange,
    currency,
    description,
    requirements,
    skills,
    status,
    postedAT
  
  } = req.body;
  console.log(postedAT);
  owner=req.user._id
  console.log("userrrr - " ,req.user);
  console.log("fileeeeeees",req.file);
  if (
    !companyName||
    !field||
    !location ||
    !aboutCompany ||
    !position ||
    !type ||
    !minRange ||
    !maxRange ||
    !currency ||
    !description ||
    !requirements ||
    !skills 
  ) {
    return res.status(400).send("all fields are required")
  }

  const newJob = new Job({
    companyName,
    field,
    location,
    companyLogo:`/api/file/${req.file.filename}`,
    aboutCompany,
    position,
    type,
    minRange,
    maxRange,
    currency,
    description,
    requirements,
    skills,
    status,
    postedAT,
    owner,
  });
      newJob.save().then((job) => {
      logger.info("Job created:", req.body);
      res.status(201).send(job);
    })
    .catch((error) => {
      res.status(500).send(error);
      logger.error("Error creating job:", error.message);
    });
};//done

const getJobs = (req, res) => {
  
  Job
    .find({})
    .then((jobs) => {
      logger.info("Retrieved jobs:", jobs);
      jobs.reverse()
      res.status(200).send(jobs);
    })
    .catch((error) => {
      res.status(500).send(error);
      logger.error("Error retrieving jobs:", error.message);
    });
};

const createJobApplication = (req, res) => {
  const _id = req.params.id;
  const { yearsExp, email, phone } = req.body;
  const owner=req.user.id
  const ownerName = `${req.user.userId}`;
  Job
    .findById(_id)
    .then((job) => {
      if (!job) {
        return res.status(404).send("Job not found.");
      }
      const newApplication = {
        yearsExp,
        email,
        phone,
        cv:`/api/file/${req.file.filename}`,
        owner,
        ownerName,
      };
      const existingApplication = job.applications.find(
        (job) => job.email === email
      );

        const isValidPhoneNumber = validator.isMobilePhone(phone, "any", {
          strictMode: false,
        });

      if (existingApplication) {
        return res
          .status(400)
          .send("Email is already used for another application.");
      }
      if (!isValidPhoneNumber) {
        return res
          .status(400)
          .send("enter a correct phone number");
      }
      job.applications.push(newApplication);
      job.save();
      res.status(201).send(job);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
};//done

const getJob = (req, res) => {
  const _id = req.params.id;
  Job
    .findOne({_id})
    .then((job) => {
      if (!job) {
        return res.status(404).send("Job not found.");
      }
      logger.info("Retrieved job:", job);
      res.status(200).send(job);
    })
    .catch((error) => {
      res.status(500).send(error);
      logger.error("Error retrieving job:", error.message);
    });
};//

const getApplication = (req, res) => {
  const _id = req.params.id;
  const _ida = req.params.ida;
  Job
    .findById(_id, "applications")
    .then((job) => {
      if (!job) {
        logger.error("Job not found.");
        return res.status(404).send("Job not found.");
      }
      const application = job.applications.id(_ida);
      if (!application) {
        logger.error("Application not found.");
        return res.status(404).send("Application not found.");
      }
      logger.info("Retrieved application:", application);
      res.status(200).send(application);
    })
    .catch((error) => {
      res.status(500).send(error);
      logger.error("Error retrieving application:", error.message); 
    });
};//

const deleteJob = (req, res) => {
const _id = req.params.id;
  Job
    .findById(_id)
    .then((job) => {
      if (!job) {
        logger.error("Job not found.");
        return res.status(404).send("Job not found.");
      }
      //console.log(job);
      // if (job.owner?.toString() !== req.user.id.toString()) {
      //   logger.error("Unauthorized access.");
      //   return res.status(401).send("Unauthorized access.");
      // }
      Job
        .findByIdAndDelete(_id)
        .then(() => {
          logger.info("Job deleted:", job);
          res.status(200).send("Job deleted successfully.");
        })
        .catch((error) => {
          res.status(505).send(error);
          logger.error("Error deleting job:", error.message);
        });
    })
    .catch((error) => {
      res.status(505).send(error);
      logger.error("Error deleting job:", error);
    });
};//done

const deleteApplication = (req, res) => {
  const applicationId = req.params.id;
  Job
    .findOneAndUpdate(
      { "applications._id": applicationId, "applications.owner": req.user._id},
      { $pull: { applications: { _id: applicationId } } }
    )
    .then((job) => {
      if (!job) {
        logger.error("application not found.");
        return res.status(404).send("application not found.");
        
      }
      logger.info("Application deleted:", job);
      res.status(200).send("application deleted successfully.");
    })
    .catch((error) => {
      res.status(500).send(error);
      logger.error("Error deleting application:", error.message);
    });
};//

const updateApplication = (req, res) => {
  const applicationId = req.params.id;
  const updatedApplication = req.body;

  Job
    .findOneAndUpdate(
      {
        "applications._id": applicationId,
        "applications.owner": req.user._id,
      },
      {
        $set: {
          "applications.$.yearsExp": updatedApplication.yearsExp,
          "applications.$.email": updatedApplication.email,
          "applications.$.phone": updatedApplication.phone,
          "applications.$.Name": updatedApplication.Name,
          "applications.$.owner": updatedApplication.owner,
        },
      },
      { new: true, runValidators: true }
    )
    .then((updatedJob) => {
      if (!updatedJob) {
        logger.error("Application not found.");
        return res.status(404).send("Application not found.");
      }
      logger.info("Application updated", req.body);
      res.status(200).send(updatedJob);
    })
    .catch((error) => {
      res.status(500).send(error.toString());
      logger.error("Error updating application:", error.message);
    });
};//

const updateJob = async (req, res) => {
  const _id = req.params.id;
  const {
    companyName,
    field,
    location,
    aboutCompany,
    position,
    type,
    minRange,
    maxRange,
    currency,
    description,
    requirements,
    skills,
    status,
  } = req.body;
  const job = await Job.findById(_id);
  // if (job.owner.toString() !== req.user.id.toString()) {
  //   logger.error("You are not authorized to update this job.");
  //   return res.status(403).send("You are not authorized to update this job.");
  // }
  try {
    job.set({
      companyName,
      companyLogo: req.file?`/api/file/${req.file.filename}`:req.body.companyLogo,
      field,
      location,
      aboutCompany,
      position,
      type,
      minRange,
      maxRange,
      currency,
      description,
      requirements,
      skills,
      status,
    });
    const updatedJobData = await job.save(); 
    res.status(200).send(updatedJobData);
    logger.info("Job updated", req.body);
  } catch (error) {
    res.status(500).send(error);
    logger.error("Error updating job:", error.message);
    console.log(error)
  }
};//done

const publishJob= async (req,res)=>{
     try {
        let {id} =req.params
        console.log(req.body);
        await Job.findOneAndUpdate({_id:id},req.body)
        .then(()=>res.send())
        .catch((error)=>{
          logger.error("Error updating job:", error.message);
          console.log(error.message)
          res.status(507).send({message:error.message});
        })
     } catch (error) {
        logger.error("Error updating job:", error.message);
        console.log(error.message)
        res.status(507).send({message:error.message});
     }
}

module.exports = {
  createJob,
  getJobs,
  createJobApplication,
  getJob,
  getApplication,
  deleteJob,
  deleteApplication,
  updateApplication,
  updateJob,
  publishJob,

};
