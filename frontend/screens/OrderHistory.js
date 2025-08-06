import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { endpoints } from '../src/config/api';
import BackButton from '../src/components/BackButton';

const OrderHistory = () => {
  const navigation = useNavigation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userEmail, setUserEmail] = useState(null);

  // Fetch order history from API
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // Get user data from AsyncStorage
      const userData = await AsyncStorage.getItem('userData');
      if (!userData) {
        console.log('No user data found');
        setLoading(false);
        return;
      }

      const user = JSON.parse(userData);
      const email = user.email;
      setUserEmail(email);

      console.log('Fetching orders for user:', email);

      // Fetch orders from API
      const response = await axios.get(endpoints.userOrders(email));
      console.log('Orders fetched:', response.data);

      // Transform WooCommerce orders to our format
      const transformedOrders = response.data.map(order => ({
        id: order.number || order.id,
        wooCommerceId: order.id,
        date: order.date_created,
        totalAmount: parseFloat(order.total),
        status: transformOrderStatus(order.status),
        items: order.line_items.map(item => ({
          id: item.id,
          productId: item.product_id,
          name: item.name,
          price: parseFloat(item.price),
          quantity: item.quantity,
          total: parseFloat(item.total),
          image: item.image?.src || 'https://via.placeholder.com/80',
        })),
        billing: order.billing,
        shipping: order.shipping,
        paymentMethod: order.payment_method_title,
        orderKey: order.order_key,
        currency: order.currency,
        dateCreated: order.date_created,
        dateModified: order.date_modified,
        customerNote: order.customer_note,
        shippingTotal: parseFloat(order.shipping_total),
        taxTotal: parseFloat(order.tax_total),
        discountTotal: parseFloat(order.discount_total),
        metaData: order.meta_data,
      }));

      setOrders(transformedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      Alert.alert(
        'Error',
        'Failed to fetch your orders. Please check your internet connection and try again.',
        [
          { text: 'Retry', onPress: fetchOrders },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  // Transform WooCommerce status to user-friendly status
  const transformOrderStatus = (status) => {
    const statusMap = {
      'pending': 'Pending',
      'processing': 'Processing',
      'on-hold': 'On Hold',
      'completed': 'Delivered',
      'cancelled': 'Cancelled',
      'refunded': 'Refunded',
      'failed': 'Failed',
    };
    return statusMap[status] || status.charAt(0).toUpperCase() + status.slice(1);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return '#4CAF50';
      case 'Processing':
        return '#FFC107';
      case 'Cancelled':
        return '#F44336';
      case 'Shipped':
        return '#2196F3';
      default:
        return '#757575';
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatCurrency = (amount) => {
    return `₹${amount.toFixed(2)}`;
  };

  const viewOrderDetails = (order) => {
    navigation.navigate('OrderDetails', { order });
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { paddingTop: Platform.OS === 'android' ? 30 : 0 }]}>
        <View style={styles.header}>
          <BackButton />
          <Text style={styles.headerTitle}>Order History</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007BFF" />
          <Text style={styles.loadingText}>Loading your orders...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { paddingTop: Platform.OS === 'android' ? 30 : 0 }]}>
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.headerTitle}>Order History</Text>
        <TouchableOpacity onPress={fetchOrders} style={styles.refreshButton}>
          <FontAwesome name="refresh" size={20} color="#007BFF" />
        </TouchableOpacity>
      </View>

      {orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <FontAwesome name="shopping-bag" size={60} color="#ccc" />
          <Text style={styles.emptyText}>No orders found</Text>
          <Text style={styles.emptySubText}>
            {userEmail ? 'You haven\'t placed any orders yet.' : 'Please log in to view your orders.'}
          </Text>
          <TouchableOpacity 
            style={styles.shopNowButton} 
            onPress={() => navigation.navigate('Home')}>
            <Text style={styles.shopNowButtonText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView 
          style={styles.ordersContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#007BFF']}
              tintColor="#007BFF"
            />
          }
        >
          {orders.map((order) => (
            <TouchableOpacity 
              key={order.wooCommerceId} 
              style={styles.orderCard}
              onPress={() => viewOrderDetails(order)}
            >
              <View style={styles.orderHeader}>
                <View>
                  <Text style={styles.orderId}>Order #{order.id}</Text>
                  <Text style={styles.orderDate}>{formatDate(order.date)}</Text>
                </View>
                <View style={styles.orderStatusContainer}>
                  <View 
                    style={[
                      styles.statusDot, 
                      { backgroundColor: getStatusColor(order.status) }
                    ]} 
                  />
                  <Text 
                    style={[
                      styles.orderStatus, 
                      { color: getStatusColor(order.status) }
                    ]}
                  >
                    {order.status}
                  </Text>
                </View>
              </View>

              <View style={styles.orderItemsContainer}>
                {order.items.slice(0, 2).map((item) => (
                  <View key={item.id} style={styles.orderItem}>
                    <Image source={{ uri: item.image }} style={styles.productImage} />
                    <View style={styles.productInfo}>
                      <Text style={styles.productName} numberOfLines={1}>
                        {item.name}
                      </Text>
                      <Text style={styles.productMeta}>
                        Qty: {item.quantity} × {formatCurrency(item.price)}
                      </Text>
                    </View>
                  </View>
                ))}
                {order.items.length > 2 && (
                  <Text style={styles.moreItemsText}>
                    +{order.items.length - 2} more item{order.items.length - 2 > 1 ? 's' : ''}
                  </Text>
                )}
              </View>

              <View style={styles.orderFooter}>
                <View style={styles.paymentInfo}>
                  <Text style={styles.paymentMethod}>{order.paymentMethod}</Text>
                  <Text style={styles.totalLabel}>Total: {formatCurrency(order.totalAmount)}</Text>
                </View>
                <TouchableOpacity 
                  style={styles.viewDetailsButton}
                  onPress={() => navigation.navigate('OrderDetails', { order })}
                >
                  <Text style={styles.viewDetailsText}>View Details</Text>
                  <FontAwesome name="chevron-right" size={12} color="#007BFF" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
          
          {/* Add some bottom padding for better scrolling */}
          <View style={{ height: 20 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 20,
    marginBottom: 30,
  },
  shopNowButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  shopNowButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  ordersContainer: {
    flex: 1,
    padding: 16,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  orderStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  orderStatus: {
    fontSize: 14,
    fontWeight: '500',
  },
  orderItemsContainer: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  productImage: {
    width: 40,
    height: 40,
    borderRadius: 6,
    backgroundColor: '#f0f0f0',
  },
  productInfo: {
    marginLeft: 12,
    flex: 1,
  },
  productName: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  productMeta: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 8,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentMethod: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  totalLabel: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  refreshButton: {
    padding: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  moreItemsText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 8,
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f0f8ff',
    borderRadius: 4,
  },
  viewDetailsText: {
    fontSize: 12,
    color: '#007BFF',
    marginRight: 4,
    fontWeight: '500',
  },
});

export default OrderHistory;
