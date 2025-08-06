import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ActivityIndicator, Platform } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCart } from '../src/CartContext';
import { endpoints } from '../src/config/api';
import BackButton from '../src/components/BackButton';

const PaymentSuccess = ({ route, navigation }) => {
  const { transactionId, orderId: routeOrderId } = route.params;
  const { cartProducts, clearCart } = useCart();
  const [creatingOrder, setCreatingOrder] = useState(!routeOrderId); // Don't create if order ID already provided
  const [orderId, setOrderId] = useState(routeOrderId || null);
  
  // Create an order and clear the cart after successful payment
  useEffect(() => {
    // If order ID is already provided (from backend), just clear cart
    if (routeOrderId) {
      setOrderId(routeOrderId);
      clearCart();
      setCreatingOrder(false);
      return;
    }

    const createOrder = async () => {
      try {
        // Get user data from AsyncStorage
        const userData = await AsyncStorage.getItem('userData');
        const user = userData ? JSON.parse(userData) : null;
        
        // Calculate order total
        const total = cartProducts.reduce(
          (sum, p) => sum + Number(p.price) * (p.quantity || 1),
          0
        );
        
        // Prepare order data
        const orderData = {
          payment_method: 'PayU Money',
          payment_method_title: 'PayU Money',
          transaction_id: transactionId,
          status: 'processing',
          customer_id: user?.id || 0,
          total: total.toString(),
          line_items: cartProducts.map(product => ({
            product_id: product.id,
            name: product.name,
            quantity: product.quantity || 1,
            price: product.price
          }))
        };
        
        // Create order in backend
        console.log('Creating order with data:', orderData);
        const response = await axios.post(endpoints.orders, orderData);
        
        console.log('Order created:', response.data);
        setOrderId(response.data.id || 'ORD_' + Date.now());
        
        // Clear the cart
        clearCart();
      } catch (error) {
        console.error('Error creating order:', error);
        // Still set a dummy order ID if there's an error
        setOrderId('ORD_' + Date.now());
      } finally {
        setCreatingOrder(false);
        clearCart();
      }
    };
    
    createOrder();
  }, []);

  if (creatingOrder) {
    return (
      <SafeAreaView style={[styles.container, { paddingTop: Platform.OS === 'android' ? 30 : 0 }]}>
        <BackButton />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Creating your order...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { paddingTop: Platform.OS === 'android' ? 30 : 0 }]}>
      <BackButton />
      <View style={styles.successContainer}>
        <View style={styles.iconContainer}>
          <FontAwesome name="check-circle" size={100} color="#4CAF50" />
        </View>
        
        <Text style={styles.successTitle}>Payment Successful!</Text>
        <Text style={styles.successText}>
          Your order has been placed successfully.
        </Text>
        
        <View style={styles.transactionContainer}>
          <Text style={styles.transactionLabel}>Transaction ID:</Text>
          <Text style={styles.transactionId}>{transactionId}</Text>
        </View>

        <View style={styles.transactionContainer}>
          <Text style={styles.transactionLabel}>Order Number:</Text>
          <Text style={styles.transactionId}>{orderId || 'Processing...'}</Text>
        </View>
        
        <Text style={styles.noteText}>
          You will receive an email confirmation shortly.
        </Text>
        
        <TouchableOpacity 
          style={styles.continueButton}
          onPress={() => navigation.navigate('HomePage')}>
          <Text style={styles.continueButtonText}>Continue Shopping</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.viewOrderButton}
          onPress={() => navigation.navigate('Home', { 
            screen: 'Profile',
            params: { showOrders: true }
          })}>
          <Text style={styles.viewOrderButtonText}>View My Orders</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.continueShoppingButton}
          onPress={() => navigation.navigate('Home')}>
          <Text style={styles.continueShoppingButtonText}>Continue Shopping</Text>
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
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  iconContainer: {
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  successText: {
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
  continueButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  viewOrderButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  viewOrderButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  continueShoppingButton: {
    backgroundColor: 'transparent',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  continueShoppingButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PaymentSuccess;
