import React, { useState } from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
  TextInput,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Alert,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import BackButton from '../src/components/BackButton';

const { width } = Dimensions.get('window');

// Machine models data
const machineModels = [
  "Select Machine Model",
  "ZSL-21 PAPER CUP MAKING MACHINE",
  "ZSL-31 PAPER CUP MAKING MACHINE",
  "ZSL-200 PAPER CUP MAKING MACHINE",
  "ZSL-220 PAPER CUP MAKING MACHINE",
  "ZSL-350 PAPER CUP MAKING MACHINE",
  "ZSL-450 PAPER CUP MAKING MACHINE",
  "OTHER COMPANY MACHINE"
];

// Issue types data
const issueTypes = [
  "Select Issue Type",
  "Machine Not Starting (Power supply issue, Faulty switch or circuit breaker)",
  "Machine Stops During Operation (Motor failure, Mechanical malfunction or faulty sensors)",
  "Error Messages or Alerts on Machine Panel (Sensor malfunction, Incorrect settings or parameters)",
  "Excessive Noise or Vibration (Poor lubrication, Loose components or Worn-out bearings or gears)",
  "Paper Not Feeding Properly (Paper jam or misalignment, Worn-out rollers, Incorrect mold or die settings)",
  "Other"
];

const ServiceRequest = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  const [formData, setFormData] = useState({
    customerName: '',
    contactNumber: '',
    email: '',
    machineLocation: '',
    requestedPriority: '',
    machineModel: machineModels[0],
    serviceDate: new Date(),
    issueType: issueTypes[0],
    faultDetails: ''
  });

  const handleSearch = (text) => {
    setSearchTerm(text);
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData({ ...formData, serviceDate: selectedDate });
    }
  };

  const formatDate = (date) => {
    return date.toISOString().split('T')[0]; // YYYY-MM-DD format
  };

  const handleSubmitRequest = () => {
    // Validate required fields
    if (!formData.customerName || !formData.contactNumber || !formData.machineLocation) {
      Alert.alert('Missing Information', 'Please fill in all required fields');
      return;
    }
    
    if (formData.machineModel === machineModels[0]) {
      Alert.alert('Missing Information', 'Please select a machine model');
      return;
    }
    
    if (formData.issueType === issueTypes[0]) {
      Alert.alert('Missing Information', 'Please select an issue type');
      return;
    }
    
    // Submit form logic would go here
    Alert.alert(
      'Service Request Submitted',
      'Thank you for your request. Our team will contact you within 24 hours.',
      [{ text: 'OK', onPress: () => resetForm() }]
    );
  };

  const resetForm = () => {
    setFormData({
      customerName: '',
      contactNumber: '',
      email: '',
      machineLocation: '',
      requestedPriority: '',
      machineModel: machineModels[0],
      serviceDate: new Date(),
      issueType: issueTypes[0],
      faultDetails: ''
    });
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={[styles.safeArea, { paddingTop: Platform.OS === 'android' ? 30 : 0 }]}>
        <View style={styles.header}>
          <BackButton />
          <Text style={styles.headerText}>Service Request</Text>
          <View style={styles.headerRight} />
        </View>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidContainer}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Search Bar */}
            <View style={styles.searchContainer}>
              <FontAwesome name="search" size={20} color="#888" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search services..."
                value={searchTerm}
                onChangeText={handleSearch}
                placeholderTextColor="#888"
              />
              {/* Cart Icon */}
              <TouchableOpacity style={styles.cartIconContainer}>
                <FontAwesome name="shopping-cart" size={24} color="#888" />
                {cartCount > 0 && (
                  <View style={styles.cartBadge}>
                    <Text style={styles.cartBadgeText}>{cartCount}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {/* Page Header */}
            <View style={styles.headerContainer}>
              <Image 
                source={{ uri: 'https://skylyf.com/wp-content/uploads/2025/02/SKYLYF-BUILDING-2.png' }} 
                style={styles.headerImage} 
              />
              <View style={styles.headerOverlay}>
                <Text style={styles.headerTitle}>Machine Service Request</Text>
              </View>
            </View>

            {/* Service Description */}
            <View style={styles.serviceDescriptionContainer}>
              <Text style={styles.serviceDescription}>
                We provide <Text style={styles.highlightText}>fast, reliable, and affordable repair services</Text> for all types of SKYLYF Paper Cup Making Machines, Ripple Cup Making Machine, Paper Bowl Making Machine, Paper Cup Printing Machine, Roll Die Cutting Machine, Slitting Machine, Tissue Paper Making Machine to ensure your production line runs smoothly!
              </Text>
            </View>

            {/* Request Form */}
            <View style={styles.formContainer}>
              <Text style={styles.formTitle}>MACHINE SERVICE REQUEST</Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Customer Name <Text style={styles.requiredStar}>*</Text></Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your full name"
                  value={formData.customerName}
                  onChangeText={(text) => handleInputChange('customerName', text)}
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Contact Number <Text style={styles.requiredStar}>*</Text></Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your phone number"
                  keyboardType="phone-pad"
                  value={formData.contactNumber}
                  onChangeText={(text) => handleInputChange('contactNumber', text)}
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your email address"
                  keyboardType="email-address"
                  value={formData.email}
                  onChangeText={(text) => handleInputChange('email', text)}
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Machine Location <Text style={styles.requiredStar}>*</Text></Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter machine location"
                  value={formData.machineLocation}
                  onChangeText={(text) => handleInputChange('machineLocation', text)}
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Requested Priority</Text>
                <View style={styles.radioGroup}>
                  {['Critical (Must be done within an hour / Online Service)', 
                    'High (Must be done within 24 hours)', 
                    'Medium (Within 2-3 days)', 
                    'Low (When you get a chance)'].map((option, index) => (
                    <TouchableOpacity 
                      key={index}
                      style={styles.radioOption}
                      onPress={() => handleInputChange('requestedPriority', option)}
                    >
                      <View style={styles.radioButton}>
                        {formData.requestedPriority === option && <View style={styles.radioButtonSelected} />}
                      </View>
                      <Text style={styles.radioText}>{option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Machine Model</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={formData.machineModel}
                    style={styles.picker}
                    onValueChange={(itemValue) => handleInputChange('machineModel', itemValue)}
                  >
                    {machineModels.map((model, index) => (
                      <Picker.Item key={index} label={model} value={model} />
                    ))}
                  </Picker>
                </View>
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Preferred Service Date (YYYY-MM-DD)</Text>
                <TouchableOpacity 
                  style={styles.dateInput}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text style={styles.dateText}>{formatDate(formData.serviceDate)}</Text>
                  <FontAwesome name="calendar" size={20} color="#007BFF" />
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={formData.serviceDate}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                    minimumDate={new Date()}
                  />
                )}
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Issue</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={formData.issueType}
                    style={styles.picker}
                    onValueChange={(itemValue) => handleInputChange('issueType', itemValue)}
                  >
                    {issueTypes.map((issue, index) => (
                      <Picker.Item key={index} label={issue} value={issue} />
                    ))}
                  </Picker>
                </View>
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Fault Details</Text>
                <TextInput
                  style={[styles.textInput, styles.textAreaInput]}
                  placeholder="Describe the fault in detail"
                  multiline
                  numberOfLines={5}
                  textAlignVertical="top"
                  value={formData.faultDetails}
                  onChangeText={(text) => handleInputChange('faultDetails', text)}
                />
              </View>
              
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmitRequest}
              >
                <Text style={styles.submitButtonText}>SUBMIT</Text>
              </TouchableOpacity>
            </View>

            {/* Contact Information */}
            <View style={styles.contactContainer}>
              <Text style={styles.sectionTitle}>Contact Us Directly</Text>
              
              <View style={styles.contactItem}>
                <FontAwesome name="phone" size={20} color="#007BFF" style={styles.contactIcon} />
                <Text style={styles.contactText}>+1 (800) 123-4567</Text>
              </View>
              
              <View style={styles.contactItem}>
                <FontAwesome name="envelope" size={20} color="#007BFF" style={styles.contactIcon} />
                <Text style={styles.contactText}>service@skylyf.com</Text>
              </View>
              
              <View style={styles.contactItem}>
                <FontAwesome name="clock-o" size={20} color="#007BFF" style={styles.contactIcon} />
                <Text style={styles.contactText}>24/7 Service Support</Text>
              </View>
            </View>

            {/* Bottom Space for tabs */}
            <View style={{ height: 80 }} />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    width: 40,
  },
  keyboardAvoidContainer: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    height: 48,
    position: 'relative',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    height: 48,
    color: '#333',
  },
  cartIconContainer: {
    position: 'absolute',
    right: 16,
    top: 12,
  },
  cartBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#FF6347',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  headerContainer: {
    position: 'relative',
    height: 180,
    marginVertical: 12,
  },
  headerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 123, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  serviceDescriptionContainer: {
    marginHorizontal: 16,
    marginVertical: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  serviceDescription: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
  },
  highlightText: {
    fontWeight: 'bold',
    color: '#007BFF',
  },
  formContainer: {
    marginVertical: 16,
    marginHorizontal: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007BFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#444',
    marginBottom: 8,
  },
  requiredStar: {
    color: '#e74c3c',
    fontWeight: 'bold',
  },
  textInput: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  textAreaInput: {
    minHeight: 100,
    paddingTop: 12,
  },
  radioGroup: {
    marginVertical: 8,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  radioButton: {
    height: 22,
    width: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#007BFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radioButtonSelected: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: '#007BFF',
  },
  radioText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    marginVertical: 4,
  },
  picker: {
    height: 50,
    color: '#333',
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    height: 50,
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#007BFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  contactContainer: {
    marginVertical: 16,
    marginHorizontal: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactIcon: {
    marginRight: 12,
    width: 24,
    textAlign: 'center',
  },
  contactText: {
    fontSize: 16,
    color: '#333',
  },
});

export default ServiceRequest;