import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import BackButton from '../src/components/BackButton';

const PaymentFailure = ({ route, navigation }) => {
  const { transactionId } = route.params;

  return (
    <SafeAreaView style={[styles.container, { paddingTop: Platform.OS === 'android' ? 30 : 0 }]}>
      <BackButton />
      <View style={styles.failureContainer}>
        <View style={styles.iconContainer}>
          <FontAwesome name="times-circle" size={100} color="#FF6347" />
        </View>
        
        <Text style={styles.failureTitle}>Payment Failed</Text>
        <Text style={styles.failureText}>
          Your payment could not be processed. Please try again or use a different payment method.
        </Text>
        
        <View style={styles.transactionContainer}>
          <Text style={styles.transactionLabel}>Transaction ID:</Text>
          <Text style={styles.transactionId}>{transactionId}</Text>
        </View>
        
        <Text style={styles.noteText}>
          If amount was deducted from your account, it will be refunded within 7-10 business days.
        </Text>
        
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => navigation.navigate('Cart')}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.homeButton}
          onPress={() => navigation.navigate('HomePage')}>
          <Text style={styles.homeButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  failureContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  iconContainer: {
    marginBottom: 24,
  },
  failureTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  failureText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  transactionContainer: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 8,
    width: '100%',
    marginBottom: 24,
  },
  transactionLabel: {
    fontSize: 14,
    color: '#666',
  },
  transactionId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
  },
  noteText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 32,
  },
  retryButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  homeButton: {
    backgroundColor: 'transparent',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#007BFF',
  },
  homeButtonText: {
    color: '#007BFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PaymentFailure;
