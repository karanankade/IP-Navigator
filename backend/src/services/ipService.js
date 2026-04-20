const ipaddr = require('ipaddr.js');
const dns = require('dns').promises;

// IPv4 Helpers
const getIPv4Class = (octets) => {
  const first = octets[0];
  if (first >= 1 && first <= 126) return 'A';
  if (first >= 128 && first <= 191) return 'B';
  if (first >= 192 && first <= 223) return 'C';
  if (first >= 224 && first <= 239) return 'D (Multicast)';
  if (first >= 240 && first <= 255) return 'E (Experimental)';
  return 'Unknown';
};

const toBinary = (octets) => octets.map(o => o.toString(2).padStart(8, '0')).join('.');

const calculateWildcard = (cidr) => {
  const mask = ipaddr.IPv4.subnetMaskFromPrefixLength(cidr).octets;
  return mask.map(o => 255 - o).join('.');
};

const getHostRange = (networkStr, broadcastStr) => {
  const net = ipaddr.IPv4.parse(networkStr).toByteArray();
  const bc = ipaddr.IPv4.parse(broadcastStr).toByteArray();
  
  // increment network by 1
  net[3]++;
  for(let i=3; i>0; i--) { if(net[i] > 255) { net[i]=0; net[i-1]++; } }
  
  // decrement broadcast by 1
  bc[3]--;
  for(let i=3; i>0; i--) { if(bc[i] < 0) { bc[i]=255; bc[i-1]--; } }

  return `${net.join('.')} - ${bc.join('.')}`;
};

// IPv4 Main Analysis
exports.analyzeIPv4 = (ipString, cidr = null) => {
  if (!ipaddr.IPv4.isValid(ipString)) {
    throw new Error('Invalid IPv4 address');
  }
  const ip = ipaddr.IPv4.parse(ipString);
  const range = ip.range();
  
  let result = {
    ip: ipString,
    version: 'IPv4',
    type: range === 'unicast' ? 'Public' : range,
    class: getIPv4Class(ip.octets),
    binary: toBinary(ip.octets),
    octets: ip.octets
  };

  if (cidr !== null) {
    const cidrNum = parseInt(cidr, 10);
    if (cidrNum < 0 || cidrNum > 32) throw new Error('Invalid CIDR');
    
    const network = ipaddr.IPv4.networkAddressFromCIDR(ipString + '/' + cidrNum);
    const broadcast = ipaddr.IPv4.broadcastAddressFromCIDR(ipString + '/' + cidrNum);
    const subnetMask = ipaddr.IPv4.subnetMaskFromPrefixLength(cidrNum);
    
    const totalHosts = Math.pow(2, 32 - cidrNum);
    const usableHosts = cidrNum >= 31 ? 0 : totalHosts - 2;

    result = {
      ...result,
      cidr: `/${cidrNum}`,
      networkAddress: network.toString(),
      broadcastAddress: broadcast.toString(),
      subnetMask: subnetMask.toString(),
      wildcardMask: calculateWildcard(cidrNum),
      totalHosts,
      usableHosts,
      hostRange: usableHosts > 0 ? getHostRange(network.toString(), broadcast.toString()) : 'N/A'
    };
  }

  return result;
};

// IPv6 Main Analysis
exports.analyzeIPv6 = (ipString, prefixLength = null) => {
  if (!ipaddr.IPv6.isValid(ipString)) {
    throw new Error('Invalid IPv6 address');
  }
  const ip = ipaddr.IPv6.parse(ipString);
  const range = ip.range();
  
  let result = {
    ip: ipString,
    version: 'IPv6',
    expanded: ip.toNormalizedString(),
    compressed: ip.toString(),
    type: range === 'unicast' ? 'Global Unicast' : range,
    parts: ip.parts,
    binary: ip.parts.map(p => p.toString(2).padStart(16, '0')).join(':')
  };

  if (prefixLength !== null) {
    const pl = parseInt(prefixLength, 10);
    if (pl < 0 || pl > 128) throw new Error('Invalid Prefix Length');
    
    // In IPv6, calculating a true 'network address' is complex and often just the IP masked to the prefix.
    result.prefixLength = `/${pl}`;
    // BigInt used for 128 bit calculations
    const totalAddresses = pl === 128 ? "1" : `2^${128 - pl}`;
    result.totalAddresses = totalAddresses;
  }

  return result;
};

// Utilities
exports.dnsLookup = async (domain) => {
  try {
    const recordsA = await dns.resolve4(domain).catch(()=>[]);
    const recordsAAAA = await dns.resolve6(domain).catch(()=>[]);
    const cname = await dns.resolveCname(domain).catch(()=>[]);
    const mx = await dns.resolveMx(domain).catch(()=>[]);
    const txt = await dns.resolveTxt(domain).catch(()=>[]);

    return { domain, A: recordsA, AAAA: recordsAAAA, CNAME: cname, MX: mx, TXT: txt };
  } catch (err) {
    throw new Error('DNS Lookup failed: ' + err.message);
  }
};

// CIDR Converter
exports.cidrConverter = (input) => {
  // Accept either a subnet mask or a CIDR prefix number
  if (ipaddr.IPv4.isValid(input)) {
    // It's a subnet mask - convert to CIDR
    const octets = ipaddr.IPv4.parse(input).octets;
    const binary = octets.map(o => o.toString(2).padStart(8, '0')).join('');
    if (!/^1*0*$/.test(binary)) throw new Error('Invalid subnet mask');
    const cidr = binary.split('').filter(b => b === '1').length;
    const wildcard = octets.map(o => 255 - o).join('.');
    return {
      input,
      type: 'Subnet Mask → CIDR',
      cidrNotation: `/${cidr}`,
      prefixLength: cidr,
      subnetMask: input,
      wildcardMask: wildcard,
      totalHosts: Math.pow(2, 32 - cidr),
      usableHosts: cidr >= 31 ? 0 : Math.pow(2, 32 - cidr) - 2,
      binaryMask: binary.replace(/(.{8})/g, '$1.').slice(0, -1)
    };
  }
  // It's a CIDR number
  const cidr = parseInt(input, 10);
  if (isNaN(cidr) || cidr < 0 || cidr > 32) throw new Error('Enter a valid CIDR (0-32) or subnet mask');
  const mask = ipaddr.IPv4.subnetMaskFromPrefixLength(cidr).octets;
  const wildcard = mask.map(o => 255 - o).join('.');
  const binary = mask.map(o => o.toString(2).padStart(8, '0')).join('');
  return {
    input: `/${cidr}`,
    type: 'CIDR → Subnet Mask',
    cidrNotation: `/${cidr}`,
    prefixLength: cidr,
    subnetMask: mask.join('.'),
    wildcardMask: wildcard,
    totalHosts: Math.pow(2, 32 - cidr),
    usableHosts: cidr >= 31 ? 0 : Math.pow(2, 32 - cidr) - 2,
    binaryMask: binary.replace(/(.{8})/g, '$1.').slice(0, -1)
  };
};

// Binary Visualizer
exports.binaryVisualizer = (ipString) => {
  if (ipaddr.IPv4.isValid(ipString)) {
    const ip = ipaddr.IPv4.parse(ipString);
    const octets = ip.octets;
    return {
      ip: ipString,
      version: 'IPv4',
      binary: toBinary(octets),
      octets: octets.map((o, i) => ({
        decimal: o,
        binary: o.toString(2).padStart(8, '0'),
        hex: o.toString(16).toUpperCase().padStart(2, '0'),
        label: `Octet ${i + 1}`
      })),
      hexadecimal: octets.map(o => o.toString(16).toUpperCase().padStart(2, '0')).join(':'),
      decimal: ((octets[0] << 24) >>> 0) + ((octets[1] << 16) >>> 0) + ((octets[2] << 8) >>> 0) + octets[3],
      class: getIPv4Class(octets),
      type: ip.range()
    };
  }
  if (ipaddr.IPv6.isValid(ipString)) {
    const ip = ipaddr.IPv6.parse(ipString);
    return {
      ip: ipString,
      version: 'IPv6',
      expanded: ip.toNormalizedString(),
      compressed: ip.toString(),
      groups: ip.parts.map((p, i) => ({
        decimal: p,
        hex: p.toString(16).toUpperCase().padStart(4, '0'),
        binary: p.toString(2).padStart(16, '0'),
        label: `Group ${i + 1}`
      })),
      fullBinary: ip.parts.map(p => p.toString(2).padStart(16, '0')).join(':'),
      type: ip.range()
    };
  }
  throw new Error('Invalid IP address');
};

// VLSM Calculator
exports.vlsmCalculator = (networkCidr, subnets) => {
  const [networkIp, cidrStr] = networkCidr.split('/');
  if (!ipaddr.IPv4.isValid(networkIp)) throw new Error('Invalid network IP');
  const baseCidr = parseInt(cidrStr, 10);
  if (isNaN(baseCidr) || baseCidr < 0 || baseCidr > 30) throw new Error('Invalid base CIDR');

  // Sort subnets by required hosts descending
  const sorted = [...subnets].sort((a, b) => b.hosts - a.hosts);

  const networkAddr = ipaddr.IPv4.networkAddressFromCIDR(networkCidr);
  let currentIp = ipaddr.IPv4.parse(networkAddr.toString()).toByteArray();
  const toNum = (b) => ((b[0] << 24) >>> 0) + ((b[1] << 16) >>> 0) + ((b[2] << 8) >>> 0) + b[3];
  const toBytes = (n) => [(n >>> 24) & 0xff, (n >>> 16) & 0xff, (n >>> 8) & 0xff, n & 0xff];

  const results = sorted.map((subnet) => {
    const neededHosts = subnet.hosts + 2; // +network +broadcast
    let bits = 0;
    while (Math.pow(2, bits) < neededHosts) bits++;
    const subnetCidr = 32 - bits;
    if (subnetCidr < baseCidr) throw new Error(`Subnet "${subnet.name}" requires more space than the base network`);

    const subnetSize = Math.pow(2, bits);
    const networkNum = toNum(currentIp);
    const broadcastNum = networkNum + subnetSize - 1;
    const mask = ipaddr.IPv4.subnetMaskFromPrefixLength(subnetCidr).toString();

    const result = {
      name: subnet.name,
      requiredHosts: subnet.hosts,
      cidr: `${currentIp.join('.')}/${subnetCidr}`,
      networkAddress: currentIp.join('.'),
      subnetMask: mask,
      firstHost: toBytes(networkNum + 1).join('.'),
      lastHost: toBytes(broadcastNum - 1).join('.'),
      broadcastAddress: toBytes(broadcastNum).join('.'),
      totalHosts: subnetSize,
      usableHosts: subnetSize - 2
    };

    currentIp = toBytes(broadcastNum + 1);
    return result;
  });

  return { network: networkCidr, subnetsAllocated: results.length, allocations: results };
};

exports.generateRange = (startIpStr, endIpStr) => {
  if (ipaddr.IPv4.isValid(startIpStr) && ipaddr.IPv4.isValid(endIpStr)) {
    const start = ipaddr.IPv4.parse(startIpStr).toByteArray();
    const end = ipaddr.IPv4.parse(endIpStr).toByteArray();
    
    const startNum = ((start[0] << 24) >>> 0) + ((start[1] << 16) >>> 0) + ((start[2] << 8) >>> 0) + start[3];
    const endNum = ((end[0] << 24) >>> 0) + ((end[1] << 16) >>> 0) + ((end[2] << 8) >>> 0) + end[3];
    
    if (startNum > endNum) throw new Error('Start IP must be before End IP');
    if (endNum - startNum > 1000) throw new Error('Range too large, max 1000 IPs');

    let range = [];
    for (let i = startNum; i <= endNum; i++) {
        const ip = [
            (i >> 24) & 0xff,
            (i >> 16) & 0xff,
            (i >> 8) & 0xff,
            i & 0xff
        ].join('.');
        range.push(ip);
    }
    return { type: 'IPv4', count: range.length, ips: range };
  }
  throw new Error('Unsupported or Invalid IPs for range generation');
};
