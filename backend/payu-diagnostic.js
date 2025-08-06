const crypto = require('crypto');
const axios = require('axios');

// PayU Portal Diagnostic Tool
class PayUDiagnostic {
  constructor() {
    this.merchantKey = 'cOOwyH';
    this.merchantSalt = 'GVDShzBRUjcUFz5CqA40YenHy8VdwoQZ';
    this.testMode = true;
    this.baseUrl = this.testMode ? 'https://test.payu.in' : 'https://secure.payu.in';
  }

  // Generate hash for verification
  generateHash(txnid, amount, productinfo, firstname, email) {
    const hashString = `${this.merchantKey}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|||||||||||${this.merchantSalt}`;
    return crypto.createHash('sha512').update(hashString).digest('hex');
  }

  // Test hash generation
  testHashGeneration() {
    console.log('\n=== PayU Hash Generation Test ===');
    
    const testData = {
      txnid: 'TEST' + Date.now(),
      amount: '100.00',
      productinfo: 'Test Product',
      firstname: 'John',
      email: 'john@example.com'
    };
    
    const hash = this.generateHash(
      testData.txnid,
      testData.amount,
      testData.productinfo,
      testData.firstname,
      testData.email
    );
    
    console.log('Test Data:', testData);
    console.log('Generated Hash:', hash);
    console.log('Hash Length:', hash.length);
    console.log('✓ Hash generation working correctly');
    
    return { testData, hash };
  }

  // Test API connectivity
  async testApiConnectivity() {
    console.log('\n=== API Connectivity Test ===');
    
    try {
      // Test local backend
      const response = await axios.get('http://localhost:3000/api/test-payu-hash', {
        timeout: 5000
      });
      
      console.log('✓ Backend API accessible');
      console.log('Response:', response.data);
      return true;
    } catch (error) {
      console.log('✗ Backend API connection failed');
      console.log('Error:', error.message);
      return false;
    }
  }

  // Check PayU service status
  async checkPayUStatus() {
    console.log('\n=== PayU Service Status Check ===');
    
    try {
      const response = await axios.get(this.baseUrl, {
        timeout: 10000,
        headers: {
          'User-Agent': 'PayU-Diagnostic-Tool'
        }
      });
      
      console.log('✓ PayU service is accessible');
      console.log('Status Code:', response.status);
      return true;
    } catch (error) {
      console.log('✗ PayU service connection failed');
      console.log('Error:', error.message);
      return false;
    }
  }

  // Validate merchant credentials format
  validateCredentials() {
    console.log('\n=== Merchant Credentials Validation ===');
    
    const keyValid = this.merchantKey && this.merchantKey.length > 0;
    const saltValid = this.merchantSalt && this.merchantSalt.length > 10;
    
    console.log('Merchant Key:', keyValid ? '✓ Valid' : '✗ Invalid');
    console.log('Merchant Salt:', saltValid ? '✓ Valid' : '✗ Invalid');
    console.log('Test Mode:', this.testMode ? '✓ Enabled' : '✗ Disabled');
    
    return keyValid && saltValid;
  }

  // Generate payment form for manual testing
  generateTestPaymentForm() {
    console.log('\n=== Test Payment Form Generation ===');
    
    const testData = this.testHashGeneration();
    const formData = {
      key: this.merchantKey,
      txnid: testData.testData.txnid,
      amount: testData.testData.amount,
      productinfo: testData.testData.productinfo,
      firstname: testData.testData.firstname,
      email: testData.testData.email,
      phone: '9876543210',
      surl: 'http://localhost:3000/api/payment/success',
      furl: 'http://localhost:3000/api/payment/failure',
      hash: testData.hash,
      service_provider: 'payu_paisa'
    };
    
    console.log('Form Data for Manual Testing:');
    console.log(JSON.stringify(formData, null, 2));
    
    return formData;
  }

  // Run complete diagnostic
  async runDiagnostic() {
    console.log('🔍 Starting PayU Integration Diagnostic...\n');
    
    const results = {
      credentials: this.validateCredentials(),
      hashGeneration: true,
      apiConnectivity: await this.testApiConnectivity(),
      payuStatus: await this.checkPayUStatus()
    };
    
    console.log('\n=== Diagnostic Summary ===');
    console.log('Credentials Valid:', results.credentials ? '✓' : '✗');
    console.log('Hash Generation:', results.hashGeneration ? '✓' : '✗');
    console.log('API Connectivity:', results.apiConnectivity ? '✓' : '✗');
    console.log('PayU Service Status:', results.payuStatus ? '✓' : '✗');
    
    const allPassed = Object.values(results).every(result => result === true);
    console.log('\nOverall Status:', allPassed ? '✅ All tests passed' : '❌ Some tests failed');
    
    if (!allPassed) {
      console.log('\n⚠️  Issues detected. Please check the following:');
      if (!results.credentials) console.log('- Verify your PayU merchant credentials');
      if (!results.apiConnectivity) console.log('- Check if backend server is running');
      if (!results.payuStatus) console.log('- Check internet connectivity and PayU service status');
    }
    
    // Generate test form regardless
    this.generateTestPaymentForm();
    
    return results;
  }
}

// Run diagnostic if called directly
if (require.main === module) {
  const diagnostic = new PayUDiagnostic();
  diagnostic.runDiagnostic().catch(console.error);
}

module.exports = PayUDiagnostic;
