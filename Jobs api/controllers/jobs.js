const createJob = async (req, res)=> {
  res.status(200).send('create job')
}

const getAllJobs = async (req, res)=> {
  res.status(200).send('get all jobs')
}

const getJob = async (req, res)=> {
  res.status(200).send('get job')
}

const updateJob = async (req, res)=> {
  res.status(200).send('update job')
}

const deleteJob = async (req, res)=> {
  res.status(200).send('delete job')
}

module.exports = {
  createJob,
  getAllJobs,
  getJob,
  updateJob,
  deleteJob
}