import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  Modal,
  FlatList,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCart } from '../src/CartContext';
import { generateTxnId, initiatePayuPayment } from '../src/config/paymentService';
import BackButton from '../src/components/BackButton';

const Checkout = ({ route, navigation }) => {
  const { orderValue } = route.params || {};
  const { cartProducts, clearCart } = useCart();
  
  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [useCustomAddress, setUseCustomAddress] = useState(false);
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [savedAddresses, setSavedAddresses] = useState([]);

  // Calculate total
  const total = orderValue || cartProducts.reduce((sum, p) => sum + (Number(p.price) * (p.quantity || 1)), 0);

  // Load user data from AsyncStorage
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        const addressesData = await AsyncStorage.getItem('userAddresses');
        
        if (userData) {
          const user = JSON.parse(userData);
          console.log('Retrieved user data:', user);
          
          setName(user.name || user.first_name + ' ' + user.last_name || '');
          setEmail(user.email || '');
          setPhone(user.phone || user.billing?.phone || '');
        }

        if (addressesData) {
          const addresses = JSON.parse(addressesData);
          setSavedAddresses(addresses);
          
          // Set the default address as selected if available
          const defaultAddress = addresses.find(addr => addr.isDefault);
          if (defaultAddress) {
            setSelectedAddress(defaultAddress);
          } else if (addresses.length > 0) {
            setSelectedAddress(addresses[0]);
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setInitialLoading(false);
      }
    };
    
    loadUserData();
  }, []);

  // Form validation
  const validateForm = () => {
    if (!name.trim()) return 'Name is required';
    if (!email.trim()) return 'Email is required';
    if (!/\S+@\S+\.\S+/.test(email)) return 'Please enter a valid email';
    if (!phone.trim()) return 'Phone number is required';
    if (phone.trim().length < 10) return 'Please enter a valid phone number';
    
    if (useCustomAddress) {
      if (!address.trim()) return 'Address is required';
      if (!city.trim()) return 'City is required';
      if (!state.trim()) return 'State is required';
      if (!zipcode.trim()) return 'Zipcode is required';
    } else if (!selectedAddress) {
      return 'Please select an address or choose to enter a custom address';
    }
    
    return null;
  };

  const navigateToAddresses = () => {
    navigation.navigate('MyAddresses', {
      isSelectionMode: true,
      onSelectAddress: (address) => {
        setSelectedAddress(address);
        setUseCustomAddress(false);
      }
    });
  };

  const handleUseCustomAddress = () => {
    setUseCustomAddress(true);
    setSelectedAddress(null);
  };

  // Process payment
  const handleCheckout = async () => {
    const validationError = validateForm();
    if (validationError) {
      Alert.alert('Form Error', validationError);
      return;
    }

    setLoading(true);

    try {
      // Create a transaction ID
      const txnid = generateTxnId();
      
      // Prepare the products info
      const productNames = cartProducts.map(p => p.name).join(', ');
      const productinfo = productNames.length > 100 
        ? productNames.substring(0, 97) + '...' 
        : productNames || 'SkyLyf Products';

      // Payment data
      const paymentData = {
        txnid,
        amount: total.toFixed(2),
        productinfo,
        firstname: name.split(' ')[0] || 'Test',
        lastname: name.split(' ').slice(1).join(' ') || 'User',
        email: email || 'test@example.com',
        phone: phone || '9999999999',
        address1: useCustomAddress 
          ? address 
          : `${selectedAddress.addressLine1}${selectedAddress.addressLine2 ? ', ' + selectedAddress.addressLine2 : ''}`,
        city: useCustomAddress ? city : selectedAddress.city,
        state: useCustomAddress ? state : selectedAddress.state,
        country: useCustomAddress ? 'India' : selectedAddress.country,
        zipcode: useCustomAddress ? zipcode : selectedAddress.postalCode,
        cartItems: cartProducts.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        }))
      };

      console.log('Initiating payment with data:', paymentData);
      
      // Initiate payment
      const paymentResponse = await initiatePayuPayment(paymentData);
      
      console.log('Payment response:', paymentResponse);
      
      // Handle free order
      if (paymentResponse.isFreeOrder || paymentResponse.free_order) {
        Alert.alert(
          'Order Placed Successfully! 🎉',
          `Your free order has been placed successfully!\n\nOrder ID: ${paymentResponse.order_id}\nTransaction ID: ${paymentResponse.txnid}`,
          [
            {
              text: 'View Orders',
              onPress: () => {
                // Clear cart and navigate to order history
                clearCart();
                navigation.navigate('Home', { screen: 'Profile' });
              }
            }
          ]
        );
        return;
      }
      
      // Navigate to payment WebView for paid orders
      navigation.navigate('PaymentWebView', { paymentData: paymentResponse });
    } catch (error) {
      console.error('Payment error:', error);
      Alert.alert('Payment Error', 'Failed to initiate payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: Platform.OS === 'android' ? 30 : 0 }]}>
      <BackButton />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}>
            <FontAwesome name="arrow-left" size={20} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Checkout</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView style={styles.scrollView}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Shipping Information</Text>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter your full name"
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email address"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Delivery Address</Text>
              
              {/* Show selected address or address selection options */}
              {selectedAddress && !useCustomAddress ? (
                <View style={styles.selectedAddressContainer}>
                  <View style={styles.selectedAddress}>
                    <View style={styles.addressInfo}>
                      <Text style={styles.selectedAddressName}>{selectedAddress.name}</Text>
                      <Text style={styles.selectedAddressText}>
                        {selectedAddress.fullName}
                      </Text>
                      <Text style={styles.selectedAddressText}>
                        {selectedAddress.addressLine1}
                        {selectedAddress.addressLine2 ? ', ' + selectedAddress.addressLine2 : ''}
                      </Text>
                      <Text style={styles.selectedAddressText}>
                        {selectedAddress.city}, {selectedAddress.state} {selectedAddress.postalCode}
                      </Text>
                      <Text style={styles.selectedAddressText}>
                        {selectedAddress.phoneNumber}
                      </Text>
                    </View>
                    <TouchableOpacity 
                      style={styles.changeAddressButton}
                      onPress={navigateToAddresses}
                    >
                      <FontAwesome name="pencil" size={16} color="#007BFF" />
                    </TouchableOpacity>
                  </View>
                  
                  <TouchableOpacity 
                    style={styles.useCustomAddressButton}
                    onPress={handleUseCustomAddress}
                  >
                    <Text style={styles.useCustomAddressText}>Use different address</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.addressSelectionContainer}>
                  {savedAddresses.length > 0 && !useCustomAddress ? (
                    <TouchableOpacity 
                      style={styles.selectAddressButton}
                      onPress={navigateToAddresses}
                    >
                      <FontAwesome name="map-marker" size={20} color="#007BFF" />
                      <Text style={styles.selectAddressText}>Select from saved addresses</Text>
                      <FontAwesome name="chevron-right" size={16} color="#666" />
                    </TouchableOpacity>
                  ) : null}
                  
                  {!useCustomAddress && (
                    <TouchableOpacity 
                      style={styles.customAddressButton}
                      onPress={handleUseCustomAddress}
                    >
                      <FontAwesome name="plus" size={16} color="#007BFF" />
                      <Text style={styles.customAddressText}>Enter address manually</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
            
            {/* Show manual address fields only when using custom address */}
            {useCustomAddress && (
              <>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Street Address</Text>
                  <TextInput
                    style={styles.input}
                    value={address}
                    onChangeText={setAddress}
                    placeholder="Enter your street address"
                  />
                </View>
                
                <View style={styles.formRow}>
                  <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                    <Text style={styles.label}>City</Text>
                    <TextInput
                      style={styles.input}
                      value={city}
                      onChangeText={setCity}
                      placeholder="City"
                    />
                  </View>
                  
                  <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                    <Text style={styles.label}>State</Text>
                    <TextInput
                      style={styles.input}
                      value={state}
                      onChangeText={setState}
                      placeholder="State"
                    />
                  </View>
                </View>
                
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Postal Code</Text>
                  <TextInput
                    style={styles.input}
                    value={zipcode}
                    onChangeText={setZipcode}
                    placeholder="Enter postal code"
                    keyboardType="number-pad"
                  />
                </View>
                
                <TouchableOpacity 
                  style={styles.backToSavedButton}
                  onPress={() => {
                    setUseCustomAddress(false);
                    if (savedAddresses.length > 0) {
                      const defaultAddress = savedAddresses.find(addr => addr.isDefault);
                      setSelectedAddress(defaultAddress || savedAddresses[0]);
                    }
                  }}
                >
                  <Text style={styles.backToSavedText}>← Back to saved addresses</Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Order Summary</Text>
            
            <View style={styles.orderSummary}>
              {cartProducts.map((item, index) => (
                <View key={index} style={styles.orderItem}>
                  <Text style={styles.orderItemName} numberOfLines={1}>
                    {item.name} × {item.quantity || 1}
                  </Text>
                  <Text style={styles.orderItemPrice}>
                    ₹{(Number(item.price) * (item.quantity || 1)).toFixed(2)}
                  </Text>
                </View>
              ))}
              
              <View style={styles.divider} />
              
              <View style={styles.orderTotal}>
                <Text style={styles.orderTotalLabel}>Total</Text>
                <Text style={styles.orderTotalValue}>₹{total.toFixed(2)}</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Method</Text>
            <View style={styles.paymentMethod}>
              <Text style={styles.paymentInfo}>
                Your payment will be processed securely via PayU Money.
              </Text>
              <View style={styles.payuBadge}>
                <Text style={styles.payuText}>PAYU</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.checkoutButton, loading && styles.checkoutButtonDisabled]}
            onPress={handleCheckout}
            disabled={loading}>
            {loading ? (
              <Text style={styles.checkoutButtonText}>Processing...</Text>
            ) : (
              <Text style={styles.checkoutButtonText}>Pay Now ₹{total.toFixed(2)}</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  formRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  orderSummary: {
    marginTop: 8,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  orderItemName: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    marginRight: 16,
  },
  orderItemPrice: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 12,
  },
  orderTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  orderTotalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  orderTotalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007BFF',
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  paymentInfo: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  payuBadge: {
    backgroundColor: '#5C2D91',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  payuText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  checkoutButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkoutButtonDisabled: {
    backgroundColor: '#ccc',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedAddressContainer: {
    marginTop: 8,
  },
  selectedAddress: {
    backgroundColor: '#f0f8ff',
    borderWidth: 1,
    borderColor: '#007BFF',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  addressInfo: {
    flex: 1,
  },
  selectedAddressName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  selectedAddressText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 18,
  },
  changeAddressButton: {
    padding: 8,
  },
  useCustomAddressButton: {
    marginTop: 12,
    alignItems: 'center',
  },
  useCustomAddressText: {
    color: '#007BFF',
    fontSize: 14,
    fontWeight: '500',
  },
  addressSelectionContainer: {
    marginTop: 8,
  },
  selectAddressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  selectAddressText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
  },
  customAddressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#007BFF',
    borderRadius: 8,
    padding: 16,
  },
  customAddressText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#007BFF',
    fontWeight: '500',
  },
  backToSavedButton: {
    marginTop: 12,
    alignItems: 'center',
  },
  backToSavedText: {
    color: '#007BFF',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default Checkout;
