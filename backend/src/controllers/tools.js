const ErrorResponse = require('../utils/errorResponse');
const ipService = require('../services/ipService');
const SearchHistory = require('../models/SearchHistory');

// Helper to save history
const saveHistory = async (userId, toolName, ipAddress, ipVersion, inputData, resultData) => {
  if (userId) {
    await SearchHistory.create({
      userId,
      toolName,
      ipAddress,
      ipVersion,
      inputData,
      resultData
    });
  }
};

exports.validateIp = async (req, res, next) => {
  try {
    const { ip } = req.body;
    if (!ip) return next(new ErrorResponse('IP is required', 400));

    const ipaddr = require('ipaddr.js');
    let result = { isValid: false, version: 'None' };

    if (ipaddr.IPv4.isValid(ip)) {
      result = { isValid: true, version: 'IPv4', details: ipService.analyzeIPv4(ip) };
    } else if (ipaddr.IPv6.isValid(ip)) {
      result = { isValid: true, version: 'IPv6', details: ipService.analyzeIPv6(ip) };
    }

    if (result.isValid && req.user) {
      await saveHistory(req.user.id, 'Validate IP', ip, result.version, { ip }, result);
    }

    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

exports.ipv4Subnet = async (req, res, next) => {
  try {
    const { ip, cidr } = req.body;
    if (!ip || !cidr) return next(new ErrorResponse('IP and CIDR are required', 400));

    const result = ipService.analyzeIPv4(ip, cidr);
    
    if (req.user) {
      await saveHistory(req.user.id, 'IPv4 Subnet', ip, 'IPv4', { ip, cidr }, result);
    }

    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(new ErrorResponse(err.message, 400));
  }
};

exports.ipv6Analyze = async (req, res, next) => {
  try {
    const { ip, prefix } = req.body;
    if (!ip) return next(new ErrorResponse('IP is required', 400));

    const result = ipService.analyzeIPv6(ip, prefix);
    
    if (req.user) {
      await saveHistory(req.user.id, 'IPv6 Analyzer', ip, 'IPv6', { ip, prefix }, result);
    }

    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(new ErrorResponse(err.message, 400));
  }
};

exports.dnsLookup = async (req, res, next) => {
  try {
    const { domain } = req.body;
    if (!domain) return next(new ErrorResponse('Domain is required', 400));

    const result = await ipService.dnsLookup(domain);

    if (req.user) {
      await saveHistory(req.user.id, 'DNS Lookup', domain, 'Domain', { domain }, result);
    }

    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(new ErrorResponse(err.message, 400));
  }
};

exports.generateRange = async (req, res, next) => {
  try {
    const { startIp, endIp } = req.body;
    if (!startIp || !endIp) return next(new ErrorResponse('Start and End IP are required', 400));

    const result = ipService.generateRange(startIp, endIp);

    if (req.user) {
      await saveHistory(req.user.id, 'Range Generator', startIp, 'IPv4', { startIp, endIp }, result);
    }

    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(new ErrorResponse(err.message, 400));
  }
};

exports.cidrConverter = async (req, res, next) => {
  try {
    const { input } = req.body;
    if (!input) return next(new ErrorResponse('Input is required', 400));
    const result = ipService.cidrConverter(input.trim());
    if (req.user) await saveHistory(req.user.id, 'CIDR Converter', input, 'IPv4', { input }, result);
    res.status(200).json({ success: true, data: result });
  } catch (err) { next(new ErrorResponse(err.message, 400)); }
};

exports.binaryVisualizer = async (req, res, next) => {
  try {
    const { ip } = req.body;
    if (!ip) return next(new ErrorResponse('IP is required', 400));
    const result = ipService.binaryVisualizer(ip);
    if (req.user) await saveHistory(req.user.id, 'Binary Visualizer', ip, result.version, { ip }, result);
    res.status(200).json({ success: true, data: result });
  } catch (err) { next(new ErrorResponse(err.message, 400)); }
};

exports.vlsmCalculator = async (req, res, next) => {
  try {
    const { network, subnets } = req.body;
    if (!network || !subnets || !Array.isArray(subnets) || subnets.length === 0)
      return next(new ErrorResponse('Network CIDR and subnets array are required', 400));
    const result = ipService.vlsmCalculator(network, subnets);
    if (req.user) await saveHistory(req.user.id, 'VLSM Calculator', network, 'IPv4', { network, subnets }, result);
    res.status(200).json({ success: true, data: result });
  } catch (err) { next(new ErrorResponse(err.message, 400)); }
};

exports.myIp = async (req, res, next) => {
  try {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    res.status(200).json({ success: true, data: { ip } });
  } catch (err) {
    next(err);
  }
};
