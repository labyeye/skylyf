import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  Platform,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackButton from '../src/components/BackButton';

const PaymentMethods = ({ navigation }) => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [cardholderName, setCardholderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [saveAsDefault, setSaveAsDefault] = useState(false);

  // Mock data for demonstration
  const mockPaymentMethods = [
    {
      id: 'card_1',
      type: 'credit',
      brand: 'visa',
      last4: '4242',
      expMonth: 12,
      expYear: 27,
      holderName: 'John Doe',
      isDefault: true,
    },
    {
      id: 'card_2',
      type: 'credit',
      brand: 'mastercard',
      last4: '5678',
      expMonth: 10,
      expYear: 26,
      holderName: 'John Doe',
      isDefault: false,
    },
  ];

  // Fetch payment methods
  useEffect(() => {
    const fetchPaymentMethods = async () => {
      setLoading(true);
      try {
        // In a real app, you would fetch from API here
        // const userData = await AsyncStorage.getItem('userData');
        // const { token } = JSON.parse(userData || '{}');
        // const response = await fetch('your-api-endpoint/payment-methods', {
        //   headers: { Authorization: `Bearer ${token}` },
        // });
        // const data = await response.json();
        // setPaymentMethods(data);

        // Using mock data for demonstration
        setTimeout(() => {
          setPaymentMethods(mockPaymentMethods);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error fetching payment methods:', error);
        setLoading(false);
      }
    };

    fetchPaymentMethods();
  }, []);

  const addPaymentMethod = () => {
    // Validation
    if (!cardholderName.trim()) {
      Alert.alert('Error', 'Please enter cardholder name');
      return;
    }

    if (cardNumber.replace(/\s/g, '').length !== 16) {
      Alert.alert('Error', 'Please enter a valid 16-digit card number');
      return;
    }

    const expiryPattern = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
    if (!expiryPattern.test(expiryDate)) {
      Alert.alert('Error', 'Please enter a valid expiry date (MM/YY)');
      return;
    }

    if (cvv.length < 3) {
      Alert.alert('Error', 'Please enter a valid CVV');
      return;
    }

    // In a real app, you would send this data to your API
    // and then update the local state with the response

    // For demo, we'll just add a new card to the list
    const newCard = {
      id: 'card_' + (paymentMethods.length + 1),
      type: 'credit',
      brand: detectCardBrand(cardNumber),
      last4: cardNumber.slice(-4),
      expMonth: parseInt(expiryDate.split('/')[0]),
      expYear: parseInt(expiryDate.split('/')[1]),
      holderName: cardholderName,
      isDefault: saveAsDefault,
    };

    // If the new card is default, make all others non-default
    let updatedMethods;
    if (saveAsDefault) {
      updatedMethods = paymentMethods.map(method => ({
        ...method,
        isDefault: false,
      }));
    } else {
      updatedMethods = [...paymentMethods];
    }

    setPaymentMethods([...updatedMethods, newCard]);
    setShowAddPaymentModal(false);
    resetForm();
  };

  const detectCardBrand = (number) => {
    const cleanNumber = number.replace(/\s/g, '');
    if (cleanNumber.startsWith('4')) return 'visa';
    if (/^5[1-5]/.test(cleanNumber)) return 'mastercard';
    if (/^3[47]/.test(cleanNumber)) return 'amex';
    if (/^6(?:011|5)/.test(cleanNumber)) return 'discover';
    return 'unknown';
  };

  const resetForm = () => {
    setCardholderName('');
    setCardNumber('');
    setExpiryDate('');
    setCvv('');
    setSaveAsDefault(false);
  };

  const formatCardNumber = (text) => {
    // Remove all non-digits
    const cleaned = text.replace(/\D/g, '');
    // Format with spaces every 4 digits
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
    return formatted.substring(0, 19); // Limit to 16 digits + 3 spaces
  };

  const formatExpiryDate = (text) => {
    // Remove all non-digits
    const cleaned = text.replace(/\D/g, '');
    
    if (cleaned.length >= 3) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    } else {
      return cleaned;
    }
  };

  const setAsDefault = (id) => {
    const updatedMethods = paymentMethods.map(method => ({
      ...method,
      isDefault: method.id === id,
    }));
    setPaymentMethods(updatedMethods);
  };

  const removePaymentMethod = (id) => {
    Alert.alert(
      'Remove Payment Method',
      'Are you sure you want to remove this payment method?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            const updatedMethods = paymentMethods.filter(method => method.id !== id);
            // If we removed the default card and there are other cards, make the first one default
            if (paymentMethods.find(m => m.id === id)?.isDefault && updatedMethods.length > 0) {
              updatedMethods[0].isDefault = true;
            }
            setPaymentMethods(updatedMethods);
          },
        },
      ],
    );
  };

  const getCardBrandIcon = (brand) => {
    switch (brand) {
      case 'visa':
        return 'cc-visa';
      case 'mastercard':
        return 'cc-mastercard';
      case 'amex':
        return 'cc-amex';
      case 'discover':
        return 'cc-discover';
      default:
        return 'credit-card';
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { paddingTop: Platform.OS === 'android' ? 30 : 0 }]}>
        <View style={styles.header}>
          <BackButton />
          <Text style={styles.headerTitle}>Payment Methods</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007BFF" />
          <Text style={styles.loadingText}>Loading payment methods...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { paddingTop: Platform.OS === 'android' ? 30 : 0 }]}>
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.headerTitle}>Payment Methods</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.methodsContainer}>
        {paymentMethods.length === 0 ? (
          <View style={styles.emptyContainer}>
            <FontAwesome name="credit-card" size={60} color="#ccc" />
            <Text style={styles.emptyText}>No payment methods added yet</Text>
            <TouchableOpacity 
              style={styles.addButton} 
              onPress={() => setShowAddPaymentModal(true)}>
              <Text style={styles.addButtonText}>Add Payment Method</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {paymentMethods.map((method) => (
              <View key={method.id} style={styles.cardContainer}>
                <View style={styles.cardHeader}>
                  <FontAwesome 
                    name={getCardBrandIcon(method.brand)} 
                    size={28} 
                    color="#333" 
                  />
                  {method.isDefault && (
                    <View style={styles.defaultBadge}>
                      <Text style={styles.defaultText}>Default</Text>
                    </View>
                  )}
                </View>
                
                <View style={styles.cardBody}>
                  <Text style={styles.cardNumber}>
                    •••• •••• •••• {method.last4}
                  </Text>
                  <Text style={styles.cardDetails}>
                    {method.holderName} | Expires {method.expMonth}/{method.expYear}
                  </Text>
                </View>
                
                <View style={styles.cardActions}>
                  {!method.isDefault && (
                    <TouchableOpacity 
                      style={styles.cardAction}
                      onPress={() => setAsDefault(method.id)}
                    >
                      <FontAwesome name="check-circle" size={16} color="#007BFF" />
                      <Text style={styles.cardActionText}>Set as default</Text>
                    </TouchableOpacity>
                  )}
                  
                  <TouchableOpacity 
                    style={[styles.cardAction, styles.deleteAction]}
                    onPress={() => removePaymentMethod(method.id)}
                  >
                    <FontAwesome name="trash" size={16} color="#FF3B30" />
                    <Text style={[styles.cardActionText, styles.deleteText]}>Remove</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
            
            <TouchableOpacity 
              style={styles.addCardButton}
              onPress={() => setShowAddPaymentModal(true)}
            >
              <FontAwesome name="plus-circle" size={20} color="#007BFF" />
              <Text style={styles.addCardText}>Add New Payment Method</Text>
            </TouchableOpacity>
            
            {/* Add some bottom padding for better scrolling */}
            <View style={{ height: 20 }} />
          </>
        )}
      </ScrollView>

      {/* Add Payment Method Modal */}
      <Modal
        visible={showAddPaymentModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddPaymentModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Payment Method</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowAddPaymentModal(false)}
              >
                <FontAwesome name="times" size={20} color="#333" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Cardholder Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="John Doe"
                  value={cardholderName}
                  onChangeText={setCardholderName}
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Card Number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="1234 5678 9012 3456"
                  keyboardType="number-pad"
                  value={cardNumber}
                  onChangeText={(text) => setCardNumber(formatCardNumber(text))}
                  maxLength={19}
                />
              </View>
              
              <View style={styles.row}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                  <Text style={styles.inputLabel}>Expiry Date</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="MM/YY"
                    keyboardType="number-pad"
                    value={expiryDate}
                    onChangeText={(text) => setExpiryDate(formatExpiryDate(text))}
                    maxLength={5}
                  />
                </View>
                
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>CVV</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="123"
                    keyboardType="number-pad"
                    value={cvv}
                    onChangeText={setCvv}
                    maxLength={4}
                    secureTextEntry={true}
                  />
                </View>
              </View>
              
              <TouchableOpacity 
                style={styles.defaultOption}
                onPress={() => setSaveAsDefault(!saveAsDefault)}
              >
                <View style={[
                  styles.checkbox, 
                  saveAsDefault && styles.checkboxChecked
                ]}>
                  {saveAsDefault && (
                    <FontAwesome name="check" size={14} color="#fff" />
                  )}
                </View>
                <Text style={styles.defaultOptionText}>
                  Save as default payment method
                </Text>
              </TouchableOpacity>
            </ScrollView>
            
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={addPaymentMethod}
            >
              <Text style={styles.saveButtonText}>Save Payment Method</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  methodsContainer: {
    flex: 1,
    padding: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    marginBottom: 24,
  },
  addButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardContainer: {
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  defaultBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  defaultText: {
    color: '#007BFF',
    fontSize: 12,
    fontWeight: '500',
  },
  cardBody: {
    marginBottom: 16,
  },
  cardNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  cardDetails: {
    fontSize: 14,
    color: '#666',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
  cardAction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  cardActionText: {
    fontSize: 14,
    color: '#007BFF',
    marginLeft: 6,
  },
  deleteAction: {
    marginLeft: 20,
  },
  deleteText: {
    color: '#FF3B30',
  },
  addCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  addCardText: {
    color: '#007BFF',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: 20,
    maxHeight: '70%',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  defaultOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: '#007BFF',
    borderRadius: 4,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#007BFF',
  },
  defaultOptionText: {
    fontSize: 14,
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#007BFF',
    marginHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PaymentMethods;
