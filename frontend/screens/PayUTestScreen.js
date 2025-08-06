import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ScrollView,
  TextInput 
} from 'react-native';
import { generateTxnId, initiatePayuPayment } from '../src/config/paymentService';

const PayUTestScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [testAmount, setTestAmount] = useState('10.00');
  const [testResults, setTestResults] = useState([]);

  // Test Cases
  const testCases = [
    {
      name: 'Small Amount Test',
      amount: '1.00',
      productinfo: 'Test Product - Small Amount'
    },
    {
      name: 'Regular Amount Test',
      amount: '100.00',
      productinfo: 'Test Product - Regular Amount'
    },
    {
      name: 'Custom Amount Test',
      amount: testAmount,
      productinfo: 'Test Product - Custom Amount'
    }
  ];

  const runTest = async (testCase) => {
    setLoading(true);
    const startTime = Date.now();

    try {
      const paymentData = {
        txnid: generateTxnId(),
        amount: testCase.amount,
        productinfo: testCase.productinfo,
        firstname: 'Test User',
        email: 'test@example.com',
        phone: '9876543210',
        address: 'Test Address',
        city: 'Mumbai',
        state: 'Maharashtra',
        zipcode: '400001',
        country: 'India'
      };

      console.log('🧪 Testing:', testCase.name);
      console.log('Payment Data:', paymentData);

      const response = await initiatePayuPayment(paymentData);
      const endTime = Date.now();

      const result = {
        name: testCase.name,
        status: 'SUCCESS',
        time: endTime - startTime,
        txnid: paymentData.txnid,
        amount: testCase.amount,
        hash: response.hash.substring(0, 20) + '...',
        timestamp: new Date().toLocaleTimeString()
      };

      setTestResults(prev => [result, ...prev]);

      Alert.alert(
        'Test Successful ✅',
        `${testCase.name} completed successfully!\n\nTransaction ID: ${paymentData.txnid}\nAmount: ₹${testCase.amount}\nTime: ${endTime - startTime}ms`,
        [
          { text: 'View Payment', onPress: () => navigation.navigate('PaymentWebView', { paymentData: response }) },
          { text: 'OK', style: 'default' }
        ]
      );

    } catch (error) {
      const endTime = Date.now();
      const result = {
        name: testCase.name,
        status: 'FAILED',
        time: endTime - startTime,
        error: error.message,
        timestamp: new Date().toLocaleTimeString()
      };

      setTestResults(prev => [result, ...prev]);

      Alert.alert(
        'Test Failed ❌',
        `${testCase.name} failed!\n\nError: ${error.message}\nTime: ${endTime - startTime}ms`
      );
    }

    setLoading(false);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>PayU Integration Testing</Text>
        <Text style={styles.subtitle}>Test Environment: PayU Test Mode</Text>
      </View>

      {/* Custom Amount Input */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Custom Test Amount</Text>
        <TextInput
          style={styles.input}
          value={testAmount}
          onChangeText={setTestAmount}
          placeholder="Enter amount (e.g., 10.00)"
          keyboardType="decimal-pad"
        />
      </View>

      {/* Test Cases */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Tests</Text>
        {testCases.map((testCase, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.testButton, loading && styles.disabledButton]}
            onPress={() => runTest(testCase)}
            disabled={loading}
          >
            <Text style={styles.testButtonText}>{testCase.name}</Text>
            <Text style={styles.amountText}>₹{testCase.amount}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Test Results */}
      {testResults.length > 0 && (
        <View style={styles.section}>
          <View style={styles.resultsHeader}>
            <Text style={styles.sectionTitle}>Test Results</Text>
            <TouchableOpacity onPress={clearResults} style={styles.clearButton}>
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
          </View>
          
          {testResults.map((result, index) => (
            <View key={index} style={[
              styles.resultItem,
              result.status === 'SUCCESS' ? styles.successResult : styles.failResult
            ]}>
              <View style={styles.resultHeader}>
                <Text style={styles.resultName}>{result.name}</Text>
                <Text style={[
                  styles.resultStatus,
                  result.status === 'SUCCESS' ? styles.successText : styles.failText
                ]}>
                  {result.status}
                </Text>
              </View>
              
              <Text style={styles.resultDetail}>
                {result.status === 'SUCCESS' 
                  ? `TxnID: ${result.txnid}\nAmount: ₹${result.amount}\nHash: ${result.hash}`
                  : `Error: ${result.error}`
                }
              </Text>
              
              <Text style={styles.resultTime}>
                Time: {result.time}ms | {result.timestamp}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Test Info */}
      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>Test Information</Text>
        <Text style={styles.infoText}>
          • All tests use PayU test environment{'\n'}
          • Use test cards for payment completion{'\n'}
          • Visa: 4111111111111111 (CVV: 123){'\n'}
          • MasterCard: 5555555555554444 (CVV: 123){'\n'}
          • Any future expiry date works
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#5C2D91',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#E0E0E0',
  },
  section: {
    backgroundColor: 'white',
    margin: 15,
    padding: 15,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  testButton: {
    backgroundColor: '#5C2D91',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  testButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  amountText: {
    color: '#E0E0E0',
    fontSize: 14,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  clearButton: {
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
  },
  clearButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  resultItem: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
  },
  successResult: {
    backgroundColor: '#f0fff4',
    borderColor: '#68d391',
  },
  failResult: {
    backgroundColor: '#fff5f5',
    borderColor: '#fc8181',
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  resultName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  resultStatus: {
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  successText: {
    color: '#38a169',
    backgroundColor: '#c6f6d5',
  },
  failText: {
    color: '#e53e3e',
    backgroundColor: '#fed7d7',
  },
  resultDetail: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
    fontFamily: 'monospace',
  },
  resultTime: {
    fontSize: 11,
    color: '#999',
  },
  infoSection: {
    backgroundColor: '#e6f3ff',
    margin: 15,
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#4299e1',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2b6cb0',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#2c5282',
    lineHeight: 20,
  },
});

export default PayUTestScreen;
