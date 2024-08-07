const Certificate = require('../model/certificate.model');
const certificate = require('../validation/certificate.validate');
const fs = require("fs")
const loggerEvent = require("../services/logger")
const logger= loggerEvent("certificate")

exports.createCertificate = (req, res) => {
  const { error } = certificate(req.body);
  // if (error) {
  //   logger.error(error.message)
  //   return res.status(400).json({ error: error.details[0].message });
  // }
  let certificateImage
  console.log(req.file)
  console.log(req.body);
  if (req.file) {
    certificateImage = `/api/file/${req.file.filename}`
  }
  const newCertificate = new Certificate({
    ...req.body,
    certificateImage,
  });

  newCertificate.save()
    .then(savedCertificate => {
      res.status(201).json(savedCertificate);
    })
    .catch(error => {
    logger.error(error.message)
    res.status(500).json({ error: 'Failed to create certificate' });
    });
};

exports.getAllCertificates = (req, res) => {
  Certificate.find().populate("course")
    .then(certificates => {
      res.json(certificates);
    })
    .catch(error => {
      logger.error(error.message)
      res.status(500).json({ error: 'Failed to fetch certificates' });
    });
};

exports.getCertificateById = (req, res) => {
  const certificateId = req.params.id;

  Certificate.findById(certificateId)
    .then(certificate => {
      if (certificate) {
        res.json(certificate);
      } else {
          logger.error(error.message)
          res.status(404).json({ error: 'Certificate not found' });
      }
    })
    .catch(error => {
        logger.error(error.message)
        res.status(500).json({ error: 'Failed to fetch certificate' });
    });
};

exports.deleteCertificate = (req, res) => {
  const certificateId = req.params.id;

  Certificate.findByIdAndDelete(certificateId)
    .then(deletedCertificate => {
      if (deletedCertificate) {
        if (deletedCertificate.certificateImage != '') {
          fs.unlinkSync(deletedCertificate.certificateImage)
        }
        res.json({ message: 'Certificate deleted successfully' });
      } else {
        res.status(404).json({ error: 'Certificate not found' });
      }
    })
    .catch(error => {
        logger.error(error.message)
        res.status(500).json({ error: 'Failed to delete certificate' });
    });
};