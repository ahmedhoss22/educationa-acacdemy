const News =require("../model/news.model")
const Course =require("../model/course.model")
const loggerEvent = require("./logger")
const logger= loggerEvent("schedule");
const Jobs =require("../model/jobs.model");
const {formatDistanceToNow , format} = require("date-fns")

exports.newPublish = async (req,res)=>{
    let today = new Date().toISOString()
    logger.info("schedule time for news !!")
    await News.updateMany(
        { publishingDate: { $lte: today } },
        { $set: { published: true } }
      );   
}

exports.coursePublish = async (req,res)=>{
  let today = new Date().toISOString()
  logger.info("schedule time for courses !!")
  await Course.updateMany(
      { publishDate: { $lte: today } },
      { $set: { published: true } }
    );   
}

exports.deleteJobs = async () => {
  try {
    const jobs = await Jobs.find({}); // Fetch all jobs
    const currentDate = new Date();

    const jobsToDelete = jobs.filter((job) => {
      let date = job?.postedAT?.split("-")
      let formatted= `${date[1]}-${date[0]}-${date[2]}`
      const postedDate = new Date(formatted);
      const daysSincePosted = Math.floor(
        (currentDate - postedDate) / (1000 * 60 * 60 * 24)
      );
      console.log(daysSincePosted);
        // console.log(job);
        // console.log((currentDate - postedDate)/( 1000 *60 * 60 *24 ));
      return daysSincePosted > 15;
    });

    // Delete jobs that exceed 15 days
    for (const job of jobsToDelete) {
      // await Jobs.findByIdAndDelete(job._id);
      logger.info(`Deleted job with ID ${job._id}`)
    }
    logger.info(`${jobsToDelete.length} jobs deleted.`)
  } catch (error) {
    logger.error('Error deleting jobs:', error)
  }
};

exports.deleteNewss = async () => {
  try {
    const news = await News.find({}); // Fetch all jobs
    const currentDate = new Date();

    const newsToDelete = news.filter((item) => {
      let date = item?.publishingDate?.split("-")
      let formatted= `${date[1]}-${date[2]}-${date[0]}`
      const postedDate = new Date(formatted);
      const daysSincePosted = Math.floor(
        (currentDate - postedDate) / (1000 * 60 * 60 * 24)
      );
      console.log(daysSincePosted);
        // console.log(job);
        // console.log((currentDate - postedDate)/( 1000 *60 * 60 *24 ));
      return daysSincePosted > 15;
    });

    // Delete jobs that exceed 15 days
    for (const news of newsToDelete) {
      await newss.findByIdAndDelete(news._id);
      logger.info(`Deleted news with ID ${news._id}`)
    }
    logger.info(`${newsToDelete.length} newss deleted.`)
  } catch (error) {
    logger.error('Error deleting newss:', error)
  }
};