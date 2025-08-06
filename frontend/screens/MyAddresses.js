import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackButton from '../src/components/BackButton';

const MyAddresses = ({ navigation, route }) => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  
  // Form state
  const [addressName, setAddressName] = useState('');
  const [fullName, setFullName] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('India');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  // Check if we're in selection mode (coming from checkout)
  const { isSelectionMode, onSelectAddress } = route.params || {};

  // Fetch addresses
  useEffect(() => {
    const fetchAddresses = async () => {
      setLoading(true);
      try {
        // Get saved addresses from AsyncStorage
        const savedAddresses = await AsyncStorage.getItem('userAddresses');
        if (savedAddresses) {
          setAddresses(JSON.parse(savedAddresses));
        } else {
          // Start with empty array if no saved addresses
          setAddresses([]);
        }
      } catch (error) {
        console.error('Error fetching addresses:', error);
        // Start with empty array if there's an error
        setAddresses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, []);

  const openAddAddressModal = () => {
    resetForm();
    setEditingAddress(null);
    setShowAddAddressModal(true);
  };

  const openEditAddressModal = (address) => {
    setEditingAddress(address);
    setAddressName(address.name);
    setFullName(address.fullName);
    setAddressLine1(address.addressLine1);
    setAddressLine2(address.addressLine2 || '');
    setCity(address.city);
    setState(address.state);
    setPostalCode(address.postalCode);
    setCountry(address.country);
    setPhoneNumber(address.phoneNumber);
    setIsDefault(address.isDefault);
    setShowAddAddressModal(true);
  };

  const resetForm = () => {
    setAddressName('');
    setFullName('');
    setAddressLine1('');
    setAddressLine2('');
    setCity('');
    setState('');
    setPostalCode('');
    setCountry('India');
    setPhoneNumber('');
    setIsDefault(false);
  };

  const validateForm = () => {
    if (!addressName.trim()) {
      Alert.alert('Error', 'Please enter an address name (e.g., Home, Work)');
      return false;
    }
    if (!fullName.trim()) {
      Alert.alert('Error', 'Please enter the full name');
      return false;
    }
    if (!addressLine1.trim()) {
      Alert.alert('Error', 'Please enter the address line 1');
      return false;
    }
    if (!city.trim()) {
      Alert.alert('Error', 'Please enter the city');
      return false;
    }
    if (!state.trim()) {
      Alert.alert('Error', 'Please enter the state');
      return false;
    }
    if (!postalCode.trim()) {
      Alert.alert('Error', 'Please enter the postal code');
      return false;
    }
    if (!phoneNumber.trim()) {
      Alert.alert('Error', 'Please enter the phone number');
      return false;
    }
    return true;
  };

  const saveAddress = async () => {
    if (!validateForm()) return;

    let updatedAddresses;

    if (editingAddress) {
      // Update existing address
      updatedAddresses = addresses.map(addr => 
        addr.id === editingAddress.id 
          ? {
              ...addr,
              name: addressName,
              fullName,
              addressLine1,
              addressLine2,
              city,
              state,
              postalCode,
              country,
              phoneNumber,
              isDefault,
            }
          : isDefault ? { ...addr, isDefault: false } : addr
      );
    } else {
      // Add new address
      const newAddress = {
        id: 'addr_' + Date.now(), // Use timestamp for unique ID
        name: addressName,
        fullName,
        addressLine1,
        addressLine2,
        city,
        state,
        postalCode,
        country,
        phoneNumber,
        isDefault,
      };

      // If the new address is default, make all others non-default
      if (isDefault) {
        updatedAddresses = addresses.map(addr => ({
          ...addr,
          isDefault: false,
        }));
      } else {
        updatedAddresses = [...addresses];
      }

      updatedAddresses = [...updatedAddresses, newAddress];
    }

    // Save updated addresses
    setAddresses(updatedAddresses);
    
    // Save to AsyncStorage
    try {
      await AsyncStorage.setItem('userAddresses', JSON.stringify(updatedAddresses));
    } catch (error) {
      console.error('Error saving addresses:', error);
      Alert.alert('Error', 'Failed to save address. Please try again.');
    }

    // Close modal
    setShowAddAddressModal(false);
  };

  const deleteAddress = (addressId) => {
    Alert.alert(
      'Delete Address',
      'Are you sure you want to delete this address?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const isRemovingDefault = addresses.find(addr => addr.id === addressId)?.isDefault;
            let updatedAddresses = addresses.filter(addr => addr.id !== addressId);
            
            // If we're removing the default address and there are other addresses,
            // make the first one the default
            if (isRemovingDefault && updatedAddresses.length > 0) {
              updatedAddresses[0].isDefault = true;
            }
            
            setAddresses(updatedAddresses);
            
            // Save to AsyncStorage
            try {
              await AsyncStorage.setItem('userAddresses', JSON.stringify(updatedAddresses));
            } catch (error) {
              console.error('Error saving addresses after delete:', error);
              Alert.alert('Error', 'Failed to delete address. Please try again.');
            }
          },
        },
      ],
    );
  };

  const setAddressAsDefault = async (addressId) => {
    const updatedAddresses = addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === addressId,
    }));
    
    setAddresses(updatedAddresses);
    
    // Save to AsyncStorage
    try {
      await AsyncStorage.setItem('userAddresses', JSON.stringify(updatedAddresses));
    } catch (error) {
      console.error('Error saving default address:', error);
      Alert.alert('Error', 'Failed to set default address. Please try again.');
    }
  };

  const handleAddressSelect = (address) => {
    if (isSelectionMode && onSelectAddress) {
      onSelectAddress(address);
      navigation.goBack();
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { paddingTop: Platform.OS === 'android' ? 30 : 0 }]}>
        <View style={styles.header}>
          <BackButton />
          <Text style={styles.headerTitle}>
            {isSelectionMode ? 'Select Address' : 'My Addresses'}
          </Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007BFF" />
          <Text style={styles.loadingText}>Loading addresses...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { paddingTop: Platform.OS === 'android' ? 30 : 0 }]}>
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.headerTitle}>
          {isSelectionMode ? 'Select Address' : 'My Addresses'}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.addressesContainer}>
        {addresses.length === 0 ? (
          <View style={styles.emptyContainer}>
            <FontAwesome name="map-marker" size={60} color="#ccc" />
            <Text style={styles.emptyText}>No addresses added yet</Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={openAddAddressModal}
            >
              <Text style={styles.addButtonText}>Add Address</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {addresses.map((address) => (
              <TouchableOpacity 
                key={address.id} 
                style={[
                  styles.addressCard,
                  isSelectionMode && styles.selectableAddressCard
                ]}
                onPress={() => isSelectionMode ? handleAddressSelect(address) : null}
                activeOpacity={isSelectionMode ? 0.7 : 1}
              >
                <View style={styles.addressHeader}>
                  <View style={styles.addressNameContainer}>
                    <Text style={styles.addressName}>{address.name}</Text>
                    {address.isDefault && (
                      <View style={styles.defaultBadge}>
                        <Text style={styles.defaultText}>Default</Text>
                      </View>
                    )}
                    {isSelectionMode && (
                      <View style={styles.selectBadge}>
                        <Text style={styles.selectText}>Tap to select</Text>
                      </View>
                    )}
                  </View>
                  {!isSelectionMode && (
                    <View style={styles.addressActions}>
                      <TouchableOpacity 
                        style={styles.editButton}
                        onPress={() => openEditAddressModal(address)}
                      >
                        <FontAwesome name="pencil" size={16} color="#007BFF" />
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.deleteButton}
                        onPress={() => deleteAddress(address.id)}
                      >
                        <FontAwesome name="trash" size={16} color="#FF3B30" />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
                
                <View style={styles.addressContent}>
                  <Text style={styles.fullName}>{address.fullName}</Text>
                  <Text style={styles.addressLine}>{address.addressLine1}</Text>
                  {address.addressLine2 ? (
                    <Text style={styles.addressLine}>{address.addressLine2}</Text>
                  ) : null}
                  <Text style={styles.addressLine}>
                    {address.city}, {address.state} {address.postalCode}
                  </Text>
                  <Text style={styles.addressLine}>{address.country}</Text>
                  <Text style={styles.phoneNumber}>{address.phoneNumber}</Text>
                </View>
                
                {!address.isDefault && !isSelectionMode && (
                  <TouchableOpacity 
                    style={styles.setDefaultButton}
                    onPress={() => setAddressAsDefault(address.id)}
                  >
                    <Text style={styles.setDefaultText}>Set as Default</Text>
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            ))}
            
            <TouchableOpacity 
              style={styles.addAddressButton}
              onPress={openAddAddressModal}
            >
              <FontAwesome name="plus-circle" size={20} color="#007BFF" />
              <Text style={styles.addAddressText}>Add New Address</Text>
            </TouchableOpacity>
            
            {/* Add some bottom padding for better scrolling */}
            <View style={{ height: 20 }} />
          </>
        )}
      </ScrollView>

      {/* Add/Edit Address Modal */}
      <Modal
        visible={showAddAddressModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddAddressModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingAddress ? 'Edit Address' : 'Add New Address'}
              </Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowAddAddressModal(false)}
              >
                <FontAwesome name="times" size={20} color="#333" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Address Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Home, Work, etc."
                  value={addressName}
                  onChangeText={setAddressName}
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="John Doe"
                  value={fullName}
                  onChangeText={setFullName}
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Address Line 1</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Street address, P.O. box"
                  value={addressLine1}
                  onChangeText={setAddressLine1}
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Address Line 2 (Optional)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Apartment, suite, unit, building, floor, etc."
                  value={addressLine2}
                  onChangeText={setAddressLine2}
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>City</Text>
                <TextInput
                  style={styles.input}
                  placeholder="City"
                  value={city}
                  onChangeText={setCity}
                />
              </View>
              
              <View style={styles.row}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                  <Text style={styles.inputLabel}>State</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="State"
                    value={state}
                    onChangeText={setState}
                  />
                </View>
                
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Postal Code</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Postal Code"
                    value={postalCode}
                    onChangeText={setPostalCode}
                    keyboardType="number-pad"
                  />
                </View>
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Country</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Country"
                  value={country}
                  onChangeText={setCountry}
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Phone Number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="+91 9876543210"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                />
              </View>
              
              <TouchableOpacity 
                style={styles.defaultOption}
                onPress={() => setIsDefault(!isDefault)}
              >
                <View style={[
                  styles.checkbox, 
                  isDefault && styles.checkboxChecked
                ]}>
                  {isDefault && (
                    <FontAwesome name="check" size={14} color="#fff" />
                  )}
                </View>
                <Text style={styles.defaultOptionText}>
                  Set as default address
                </Text>
              </TouchableOpacity>
            </ScrollView>
            
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={saveAddress}
            >
              <Text style={styles.saveButtonText}>Save Address</Text>
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
  addressesContainer: {
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
  addressCard: {
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
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  addressNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  defaultBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 10,
  },
  defaultText: {
    color: '#007BFF',
    fontSize: 12,
    fontWeight: '500',
  },
  addressActions: {
    flexDirection: 'row',
  },
  editButton: {
    padding: 8,
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
  },
  addressContent: {
    marginBottom: 16,
  },
  fullName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
    marginBottom: 6,
  },
  addressLine: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  phoneNumber: {
    fontSize: 14,
    color: '#555',
    marginTop: 6,
  },
  setDefaultButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginTop: 4,
  },
  setDefaultText: {
    fontSize: 14,
    color: '#007BFF',
    fontWeight: '500',
  },
  addAddressButton: {
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
  addAddressText: {
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
    maxHeight: '65%',
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
  selectableAddressCard: {
    borderWidth: 2,
    borderColor: '#E3F2FD',
    backgroundColor: '#FAFFFE',
  },
  selectBadge: {
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 10,
  },
  selectText: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: '500',
  },
});

export default MyAddresses;
