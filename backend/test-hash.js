const crypto = require('crypto');

// Your merchant credentials
const key = 'cOOwyH';
const salt = 'GVDShzBRUjcUFz5CqA40YenHy8VdwoQZ';

// Test transaction data
const txnid = 'TEST123';
const amount = '100.00';
const productinfo = 'Test Product';
const firstname = 'John';
const email = 'test@example.com';

// Test hash without UDFs (11 empty pipes after email)
const hashString = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|||||||||||${salt}`;
const hash = crypto.createHash('sha512').update(hashString).digest('hex');

console.log('=== PayU Hash Generation Test ===');
console.log('Key:', key);
console.log('Salt:', salt.substring(0, 10) + '...');
console.log('Hash String:', hashString);
console.log('Number of pipes:', (hashString.match(/\|/g) || []).length);
console.log('Generated Hash:', hash);
console.log('Hash Length:', hash.length);

// Test with UDFs (should have 6 empty pipes after udf5)
const udf1 = 'test_udf1';
const udf2 = 'test_udf2';
const hashStringWithUdf = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|${udf1}|${udf2}|||${salt}`;
const hashWithUdf = crypto.createHash('sha512').update(hashStringWithUdf).digest('hex');

console.log('\n=== With UDFs ===');
console.log('Hash String with UDF:', hashStringWithUdf);
console.log('Number of pipes:', (hashStringWithUdf.match(/\|/g) || []).length);
console.log('Generated Hash with UDF:', hashWithUdf);

// Test response hash (reverse)
const status = 'success';
const responseHashString = `${salt}|${status}|||||||||||${email}|${firstname}|${productinfo}|${amount}|${txnid}|${key}`;
const responseHash = crypto.createHash('sha512').update(responseHashString).digest('hex');

console.log('\n=== Response Hash ===');
console.log('Response Hash String:', responseHashString);
console.log('Number of pipes:', (responseHashString.match(/\|/g) || []).length);
console.log('Response Hash:', responseHash);
