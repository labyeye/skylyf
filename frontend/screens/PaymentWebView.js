import React, { useState } from 'react';
import { StyleSheet, View, ActivityIndicator, Text, SafeAreaView, TouchableOpacity, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import BackButton from '../src/components/BackButton';

const PaymentWebView = ({ route, navigation }) => {
  const { paymentData } = route.params;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Create HTML form for PayU
  const htmlForm = `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: Arial, sans-serif; text-align: center; padding: 20px; }
          .loader { display: flex; justify-content: center; margin-top: 20px; }
          h2 { color: #333; }
        </style>
      </head>
      <body>
        <h2>Redirecting to Payment Gateway</h2>
        <div class="loader">
          <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" stroke="#007BFF">
            <g fill="none" fill-rule="evenodd">
              <g transform="translate(1 1)" stroke-width="3">
                <circle stroke-opacity=".2" cx="18" cy="18" r="18"/>
                <path d="M36 18c0-9.94-8.06-18-18-18">
                  <animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="1s" repeatCount="indefinite"/>
                </path>
              </g>
            </g>
          </svg>
        </div>
        <form id="payuForm" action="${paymentData.payment_url}" method="post">
          <input type="hidden" name="key" value="${paymentData.key}" />
          <input type="hidden" name="txnid" value="${paymentData.txnid}" />
          <input type="hidden" name="amount" value="${paymentData.amount}" />
          <input type="hidden" name="productinfo" value="${paymentData.productinfo}" />
          <input type="hidden" name="firstname" value="${paymentData.firstname}" />
          <input type="hidden" name="email" value="${paymentData.email}" />
          <input type="hidden" name="phone" value="${paymentData.phone}" />
          <input type="hidden" name="lastname" value="${paymentData.lastname || ''}" />
          <input type="hidden" name="address1" value="${paymentData.address1 || ''}" />
          <input type="hidden" name="address2" value="${paymentData.address2 || ''}" />
          <input type="hidden" name="city" value="${paymentData.city || ''}" />
          <input type="hidden" name="state" value="${paymentData.state || ''}" />
          <input type="hidden" name="country" value="${paymentData.country || ''}" />
          <input type="hidden" name="zipcode" value="${paymentData.zipcode || ''}" />
          <input type="hidden" name="udf1" value="${paymentData.udf1 || ''}" />
          <input type="hidden" name="udf2" value="${paymentData.udf2 || ''}" />
          <input type="hidden" name="udf3" value="" />
          <input type="hidden" name="udf4" value="" />
          <input type="hidden" name="udf5" value="" />
          <input type="hidden" name="surl" value="${paymentData.surl}" />
          <input type="hidden" name="furl" value="${paymentData.furl}" />
          <input type="hidden" name="hash" value="${paymentData.hash}" />
          <input type="hidden" name="service_provider" value="payu_paisa" />
        </form>
        <script>
          document.addEventListener('DOMContentLoaded', function() {
            console.log('Form ready for submission');
            setTimeout(function() {
              document.getElementById('payuForm').submit();
              console.log('Form submitted');
            }, 1000);
          });
        </script>
      </body>
    </html>
  `;

  const handleNavigationStateChange = (navState) => {
    const { url } = navState;
    
    console.log('Navigation URL:', url);
    
    // Check if the URL matches success or failure URLs
    if (url.includes('/payment-success') || url.includes('payment-success')) {
      console.log('Payment success detected');
      
      // Extract order ID and transaction ID from URL if available
      const urlParams = new URLSearchParams(url.split('?')[1]);
      const orderId = urlParams.get('order_id');
      const txnId = urlParams.get('txnid');
      
      navigation.navigate('PaymentSuccess', { 
        transactionId: txnId || paymentData.txnid,
        orderId: orderId 
      });
    } else if (url.includes('/payment-failure') || url.includes('payment-failure')) {
      console.log('Payment failure detected');
      
      const urlParams = new URLSearchParams(url.split('?')[1]);
      const reason = urlParams.get('reason');
      
      navigation.navigate('PaymentFailure', { 
        transactionId: paymentData.txnid,
        reason: reason 
      });
    } else if (url.includes('skylyf://')) {
      // Handle deep link redirects from our success/failure pages
      if (url.includes('payment-success')) {
        const urlParams = new URLSearchParams(url.split('?')[1]);
        const orderId = urlParams.get('order_id');
        const txnId = urlParams.get('txnid');
        
        navigation.navigate('PaymentSuccess', { 
          transactionId: txnId || paymentData.txnid,
          orderId: orderId 
        });
      } else if (url.includes('payment-failure')) {
        const urlParams = new URLSearchParams(url.split('?')[1]);
        const reason = urlParams.get('reason');
        
        navigation.navigate('PaymentFailure', { 
          transactionId: paymentData.txnid,
          reason: reason 
        });
      }
    }
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: Platform.OS === 'android' ? 30 : 0 }]}>
      <BackButton />
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <FontAwesome name="arrow-left" size={20} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Gateway</Text>
        <View style={{ width: 40 }} />
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <FontAwesome name="exclamation-circle" size={50} color="#FF6347" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => navigation.goBack()}>
            <Text style={styles.retryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <React.Fragment>
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007BFF" />
              <Text style={styles.loadingText}>Connecting to payment gateway...</Text>
            </View>
          )}
          <WebView
            source={{ html: htmlForm }}
            onLoadEnd={() => setLoading(false)}
            onError={(e) => {
              setError('Failed to connect to payment gateway. Please try again.');
              setLoading(false);
            }}
            onNavigationStateChange={handleNavigationStateChange}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            style={[styles.webView, loading ? { height: 0 } : {}]}
          />
        </React.Fragment>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  backButton: {
    width: 40,
  },
  webView: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    zIndex: 1,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    marginTop: 20,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#007BFF',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 20,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PaymentWebView;
