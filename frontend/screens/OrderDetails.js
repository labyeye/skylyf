import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  Platform,
  Alert,
  Linking,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import BackButton from '../src/components/BackButton';

const OrderDetails = ({ route }) => {
  const navigation = useNavigation();
  const { order } = route.params;
  const [expandedSection, setExpandedSection] = useState(null);

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatCurrency = (amount) => {
    return `₹${parseFloat(amount).toFixed(2)}`;
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
      case 'Pending':
        return '#FF9800';
      default:
        return '#757575';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Delivered':
        return 'check-circle';
      case 'Processing':
        return 'clock-o';
      case 'Cancelled':
        return 'times-circle';
      case 'Shipped':
        return 'truck';
      case 'Pending':
        return 'hourglass-half';
      default:
        return 'circle';
    }
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleContactSupport = () => {
    Alert.alert(
      'Contact Support',
      'How would you like to contact us?',
      [
        { text: 'Call', onPress: () => Linking.openURL('tel:+911234567890') },
        { text: 'Email', onPress: () => Linking.openURL('mailto:support@skylyf.com') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleTrackOrder = () => {
    if (order.status === 'Delivered') {
      Alert.alert('Order Delivered', 'This order has already been delivered.');
    } else {
      Alert.alert('Track Order', `Tracking order #${order.id}...`);
    }
  };

  const renderSection = (title, content, sectionKey) => (
    <View style={styles.section}>
      <TouchableOpacity 
        style={styles.sectionHeader}
        onPress={() => toggleSection(sectionKey)}
      >
        <Text style={styles.sectionTitle}>{title}</Text>
        <FontAwesome 
          name={expandedSection === sectionKey ? 'chevron-up' : 'chevron-down'} 
          size={16} 
          color="#666" 
        />
      </TouchableOpacity>
      {expandedSection === sectionKey && (
        <View style={styles.sectionContent}>
          {content}
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { paddingTop: Platform.OS === 'android' ? 30 : 0 }]}>
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.headerTitle}>Order Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content}>
        {/* Order Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <FontAwesome 
              name={getStatusIcon(order.status)} 
              size={24} 
              color={getStatusColor(order.status)} 
            />
            <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
              {order.status}
            </Text>
          </View>
          <Text style={styles.orderNumber}>Order #{order.id}</Text>
          <Text style={styles.orderDate}>
            Placed on {formatDate(order.dateCreated)}
          </Text>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton} onPress={handleTrackOrder}>
              <FontAwesome name="map-marker" size={16} color="#007BFF" />
              <Text style={styles.actionButtonText}>Track Order</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={handleContactSupport}>
              <FontAwesome name="headphones" size={16} color="#007BFF" />
              <Text style={styles.actionButtonText}>Contact Support</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Order Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Items in this order</Text>
          <View style={styles.sectionContent}>
            {order.items.map((item, index) => (
              <View key={item.id} style={styles.itemCard}>
                <Image 
                  source={{ uri: item.image }} 
                  style={styles.itemImage}
                  defaultSource={require('../src/assets/images/logo.png')}
                />
                <View style={styles.itemDetails}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <View style={styles.itemMeta}>
                    <Text style={styles.itemPrice}>{formatCurrency(item.price)}</Text>
                    <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
                  </View>
                  <Text style={styles.itemTotal}>
                    Subtotal: {formatCurrency(item.total)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.sectionContent}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal:</Text>
              <Text style={styles.summaryValue}>
                {formatCurrency(order.totalAmount - order.shippingTotal - order.taxTotal)}
              </Text>
            </View>
            {order.shippingTotal > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Shipping:</Text>
                <Text style={styles.summaryValue}>{formatCurrency(order.shippingTotal)}</Text>
              </View>
            )}
            {order.taxTotal > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tax:</Text>
                <Text style={styles.summaryValue}>{formatCurrency(order.taxTotal)}</Text>
              </View>
            )}
            {order.discountTotal > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Discount:</Text>
                <Text style={[styles.summaryValue, { color: '#4CAF50' }]}>
                  -{formatCurrency(order.discountTotal)}
                </Text>
              </View>
            )}
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalValue}>{formatCurrency(order.totalAmount)}</Text>
            </View>
          </View>
        </View>

        {/* Shipping Address */}
        {order.shipping && renderSection(
          'Shipping Address',
          (
            <View>
              <Text style={styles.addressName}>
                {order.shipping.first_name} {order.shipping.last_name}
              </Text>
              <Text style={styles.addressLine}>{order.shipping.address_1}</Text>
              {order.shipping.address_2 && (
                <Text style={styles.addressLine}>{order.shipping.address_2}</Text>
              )}
              <Text style={styles.addressLine}>
                {order.shipping.city}, {order.shipping.state} {order.shipping.postcode}
              </Text>
              <Text style={styles.addressLine}>{order.shipping.country}</Text>
            </View>
          ),
          'shipping'
        )}

        {/* Billing Address */}
        {order.billing && renderSection(
          'Billing Address',
          (
            <View>
              <Text style={styles.addressName}>
                {order.billing.first_name} {order.billing.last_name}
              </Text>
              <Text style={styles.addressLine}>{order.billing.address_1}</Text>
              {order.billing.address_2 && (
                <Text style={styles.addressLine}>{order.billing.address_2}</Text>
              )}
              <Text style={styles.addressLine}>
                {order.billing.city}, {order.billing.state} {order.billing.postcode}
              </Text>
              <Text style={styles.addressLine}>{order.billing.country}</Text>
              {order.billing.email && (
                <Text style={styles.addressLine}>Email: {order.billing.email}</Text>
              )}
              {order.billing.phone && (
                <Text style={styles.addressLine}>Phone: {order.billing.phone}</Text>
              )}
            </View>
          ),
          'billing'
        )}

        {/* Payment Information */}
        {renderSection(
          'Payment Information',
          (
            <View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Payment Method:</Text>
                <Text style={styles.summaryValue}>{order.paymentMethod}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Order Date:</Text>
                <Text style={styles.summaryValue}>{formatDate(order.dateCreated)}</Text>
              </View>
              {order.dateModified !== order.dateCreated && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Last Updated:</Text>
                  <Text style={styles.summaryValue}>{formatDate(order.dateModified)}</Text>
                </View>
              )}
            </View>
          ),
          'payment'
        )}

        {/* Customer Note */}
        {order.customerNote && renderSection(
          'Special Instructions',
          (
            <Text style={styles.noteText}>{order.customerNote}</Text>
          ),
          'note'
        )}

        {/* Add some bottom padding */}
        <View style={{ height: 20 }} />
      </ScrollView>
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
  },
  content: {
    flex: 1,
    padding: 16,
  },
  statusCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007BFF',
  },
  actionButtonText: {
    fontSize: 14,
    color: '#007BFF',
    marginLeft: 8,
    fontWeight: '500',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  sectionContent: {
    padding: 16,
  },
  itemCard: {
    flexDirection: 'row',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 16,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  itemMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    color: '#666',
  },
  itemQuantity: {
    fontSize: 14,
    color: '#666',
  },
  itemTotal: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 8,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  addressName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  addressLine: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  noteText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
});

export default OrderDetails;
