const host1 = "ais-dev-du42qkdpik6hghxubdabfi-118108433863.asia-east1.run.app";
const isLocal = host1.includes('localhost');
const protocol = isLocal ? 'http' : 'https';
console.log(`${protocol}://${host1}/auth/callback/twitter`);
