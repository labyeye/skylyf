const crypto = require('crypto');
const axios = require('axios');

// PayU Testing Environment Setup
class PayUTester {
  constructor() {
    this.merchantKey = 'cOOwyH';
    this.merchantSalt = 'GVDShzBRUjcUFz5CqA40YenHy8VdwoQZ';
    this.testMode = true;
    this.baseUrl = 'http://localhost:3000/api';
    this.payuUrl = 'https://test.payu.in/_payment';
  }

  // Generate test transaction ID
  generateTestTxnId() {
    return `TEST_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  }

  // Test Case 1: Basic Payment Initiation
  async testBasicPayment() {
    console.log('\n🧪 Test Case 1: Basic Payment Initiation');
    console.log('=' .repeat(50));

    const testData = {
      txnid: this.generateTestTxnId(),
      amount: '10.00',
      productinfo: 'Test Product - Basic',
      firstname: 'Test',
      email: 'test@example.com',
      phone: '9876543210',
      address: 'Test Address',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipcode: '400001',
      country: 'India'
    };

    try {
      console.log('📤 Sending payment request...');
      console.log('Test Data:', JSON.stringify(testData, null, 2));

      const response = await axios.post(`${this.baseUrl}/payment/initiate`, testData, {
        timeout: 10000,
        headers: { 'Content-Type': 'application/json' }
      });

      console.log('✅ Payment initiated successfully!');
      console.log('Response:', response.data);
      
      return { success: true, data: response.data, testData };
    } catch (error) {
      console.log('❌ Payment initiation failed');
      console.log('Error:', error.response?.data || error.message);
      return { success: false, error: error.response?.data || error.message };
    }
  }

  // Test Case 2: Hash Verification
  async testHashVerification() {
    console.log('\n🧪 Test Case 2: Hash Verification');
    console.log('=' .repeat(50));

    try {
      const response = await axios.get(`${this.baseUrl}/test-payu-hash`);
      console.log('✅ Hash verification passed!');
      console.log('Hash Test Results:', response.data);
      return { success: true, data: response.data };
    } catch (error) {
      console.log('❌ Hash verification failed');
      console.log('Error:', error.response?.data || error.message);
      return { success: false, error: error.response?.data || error.message };
    }
  }

  // Test Case 3: Multiple Payment Scenarios
  async testMultipleScenarios() {
    console.log('\n🧪 Test Case 3: Multiple Payment Scenarios');
    console.log('=' .repeat(50));

    const scenarios = [
      {
        name: 'Small Amount',
        amount: '1.00',
        productinfo: 'Test - Small Amount'
      },
      {
        name: 'Regular Amount',
        amount: '100.00',
        productinfo: 'Test - Regular Amount'
      },
      {
        name: 'Large Amount',
        amount: '1000.00',
        productinfo: 'Test - Large Amount'
      }
    ];

    const results = [];

    for (const scenario of scenarios) {
      console.log(`\n📋 Testing: ${scenario.name}`);
      
      const testData = {
        txnid: this.generateTestTxnId(),
        amount: scenario.amount,
        productinfo: scenario.productinfo,
        firstname: 'Test',
        email: 'test@example.com',
        phone: '9876543210'
      };

      try {
        const response = await axios.post(`${this.baseUrl}/payment/initiate`, testData);
        console.log(`✅ ${scenario.name}: Success`);
        results.push({ scenario: scenario.name, success: true, data: response.data });
      } catch (error) {
        console.log(`❌ ${scenario.name}: Failed`);
        results.push({ scenario: scenario.name, success: false, error: error.response?.data || error.message });
      }
    }

    return results;
  }

  // Test Case 4: Server Connectivity
  async testServerConnectivity() {
    console.log('\n🧪 Test Case 4: Server Connectivity');
    console.log('=' .repeat(50));

    const endpoints = [
      { name: 'Health Check', url: `${this.baseUrl.replace('/api', '')}/` },
      { name: 'Hash Test', url: `${this.baseUrl}/test-payu-hash` },
      { name: 'PayU Service', url: this.payuUrl }
    ];

    const results = [];

    for (const endpoint of endpoints) {
      try {
        const response = await axios.get(endpoint.url, { timeout: 5000 });
        console.log(`✅ ${endpoint.name}: Accessible (${response.status})`);
        results.push({ endpoint: endpoint.name, success: true, status: response.status });
      } catch (error) {
        console.log(`❌ ${endpoint.name}: Failed (${error.message})`);
        results.push({ endpoint: endpoint.name, success: false, error: error.message });
      }
    }

    return results;
  }

  // Generate test payment form HTML for manual testing
  generateTestForm(paymentData) {
    const html = `
<!DOCTYPE html>
<html>
<head>
    <title>PayU Test Payment Form</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
        .form-group { margin: 15px 0; }
        label { display: block; margin-bottom: 5px; font-weight: bold; }
        input { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
        button { background: #5C2D91; color: white; padding: 15px 30px; border: none; border-radius: 4px; cursor: pointer; font-size: 16px; }
        button:hover { background: #4A2574; }
        .info { background: #f0f8ff; padding: 15px; border-radius: 4px; margin: 20px 0; }
    </style>
</head>
<body>
    <h1>PayU Test Payment Form</h1>
    <div class="info">
        <strong>Test Mode:</strong> This form will redirect to PayU test environment<br>
        <strong>Merchant Key:</strong> ${this.merchantKey}<br>
        <strong>Amount:</strong> ₹${paymentData.amount}
    </div>
    
    <form action="${this.payuUrl}" method="post">
        <input type="hidden" name="key" value="${paymentData.key}">
        <input type="hidden" name="txnid" value="${paymentData.txnid}">
        <input type="hidden" name="amount" value="${paymentData.amount}">
        <input type="hidden" name="productinfo" value="${paymentData.productinfo}">
        <input type="hidden" name="firstname" value="${paymentData.firstname}">
        <input type="hidden" name="email" value="${paymentData.email}">
        <input type="hidden" name="phone" value="${paymentData.phone}">
        <input type="hidden" name="surl" value="${paymentData.surl}">
        <input type="hidden" name="furl" value="${paymentData.furl}">
        <input type="hidden" name="hash" value="${paymentData.hash}">
        <input type="hidden" name="service_provider" value="payu_paisa">
        
        <div class="form-group">
            <label>Transaction ID:</label>
            <input type="text" value="${paymentData.txnid}" readonly>
        </div>
        
        <div class="form-group">
            <label>Amount:</label>
            <input type="text" value="₹${paymentData.amount}" readonly>
        </div>
        
        <div class="form-group">
            <label>Product Info:</label>
            <input type="text" value="${paymentData.productinfo}" readonly>
        </div>
        
        <div class="form-group">
            <label>Customer Name:</label>
            <input type="text" value="${paymentData.firstname}" readonly>
        </div>
        
        <div class="form-group">
            <label>Email:</label>
            <input type="text" value="${paymentData.email}" readonly>
        </div>
        
        <button type="submit">Proceed to PayU Payment</button>
    </form>
    
    <div class="info">
        <strong>Test Cards for PayU:</strong><br>
        • Visa: 4111111111111111 (CVV: 123, Any future date)<br>
        • MasterCard: 5555555555554444 (CVV: 123, Any future date)<br>
        • Net Banking: Use any test bank credentials
    </div>
</body>
</html>`;

    return html;
  }

  // Run all tests
  async runAllTests() {
    console.log('🚀 Starting PayU Testing Suite...');
    console.log('Test Environment: PayU Test Mode');
    console.log('Merchant Key:', this.merchantKey);
    console.log('Time:', new Date().toLocaleString());

    const results = {
      serverConnectivity: await this.testServerConnectivity(),
      hashVerification: await this.testHashVerification(),
      basicPayment: await this.testBasicPayment(),
      multipleScenarios: await this.testMultipleScenarios()
    };

    // Generate test form if basic payment succeeded
    if (results.basicPayment.success) {
      const testFormHtml = this.generateTestForm(results.basicPayment.data);
      require('fs').writeFileSync('payu-test-form.html', testFormHtml);
      console.log('\n📄 Test payment form generated: payu-test-form.html');
    }

    console.log('\n📊 Test Summary:');
    console.log('=' .repeat(50));
    console.log('Server Connectivity:', results.serverConnectivity.every(r => r.success) ? '✅ Pass' : '❌ Fail');
    console.log('Hash Verification:', results.hashVerification.success ? '✅ Pass' : '❌ Fail');
    console.log('Basic Payment:', results.basicPayment.success ? '✅ Pass' : '❌ Fail');
    console.log('Multiple Scenarios:', results.multipleScenarios.every(r => r.success) ? '✅ Pass' : '❌ Fail');

    return results;
  }
}

// Run tests if called directly
if (require.main === module) {
  const tester = new PayUTester();
  tester.runAllTests().catch(console.error);
}

module.exports = PayUTester;
