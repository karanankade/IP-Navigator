const express = require('express');
const { validateIp, ipv4Subnet, ipv6Analyze, dnsLookup, generateRange, myIp, cidrConverter, binaryVisualizer, vlsmCalculator } = require('../controllers/tools');
const { protect } = require('../middleware/auth');

const router = express.Router();

const optionalProtect = async (req, res, next) => {
  const jwt = require('jsonwebtoken');
  const User = require('../models/User');
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
      req.user = await User.findById(decoded.id);
    } catch (err) {}
  }
  next();
};

router.post('/validate-ip', optionalProtect, validateIp);
router.post('/ipv4-subnet', optionalProtect, ipv4Subnet);
router.post('/ipv6-analyze', optionalProtect, ipv6Analyze);
router.post('/dns-lookup', optionalProtect, dnsLookup);
router.post('/range-generator', optionalProtect, generateRange);
router.post('/cidr-converter', optionalProtect, cidrConverter);
router.post('/binary-visualizer', optionalProtect, binaryVisualizer);
router.post('/vlsm-calculator', optionalProtect, vlsmCalculator);
router.get('/my-ip', optionalProtect, myIp);

module.exports = router;
