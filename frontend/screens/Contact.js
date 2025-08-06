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
  Linking,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BackButton from '../src/components/BackButton';

const { width } = Dimensions.get('window');

const ContactPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cartCount, setCartCount] = useState(0);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });

  const [subscribeEmail, setSubscribeEmail] = useState('');

  const handleSearch = (text) => {
    setSearchTerm(text);
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = () => {
    // Validate required fields
    if (!formData.name || !formData.phone) {
      Alert.alert('Missing Information', 'Please fill in all required fields');
      return;
    }
    
    // Submit form logic would go here
    Alert.alert(
      'Message Sent',
      'Thank you for contacting us. We will get back to you soon.',
      [{ text: 'OK', onPress: () => resetForm() }]
    );
  };

  const handleSubscribe = () => {
    if (!subscribeEmail) {
      Alert.alert('Missing Email', 'Please enter your email address to subscribe');
      return;
    }
    
    Alert.alert(
      'Subscription Successful',
      'Thank you for subscribing to our newsletter.',
      [{ text: 'OK', onPress: () => setSubscribeEmail('') }]
    );
  };

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      message: ''
    });
  };

  const openWhatsApp = () => {
    Linking.openURL('whatsapp://send?phone=+917654044444');
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={[styles.safeArea, { paddingTop: Platform.OS === 'android' ? 30 : 0 }]}>
        <View style={styles.header}>
          <BackButton />
          <Text style={styles.headerTitle}>Contact Us</Text>
        </View>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidContainer}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.headerContainer}>
              <View style={styles.headerOverlay}>
                <Text style={styles.headerTitle}>Contact Us</Text>
              </View>
            </View>

            {/* Thank You Message */}
            <View style={styles.serviceDescriptionContainer}>
              <Text style={styles.thanksTitle}>THANKS FOR APPROACHING US</Text>
              <Text style={styles.serviceDescription}>
                We'd love to hear from you! If you have questions, need support, or want to learn more about our Paper Cup Making Machine and Services, we are here to help.
              </Text>
            </View>

            {/* Contact Form */}
            <View style={styles.formContainer}>
              <Text style={styles.formTitle}>CONTACT US</Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Name <Text style={styles.requiredStar}>*</Text></Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChangeText={(text) => handleInputChange('name', text)}
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Phone <Text style={styles.requiredStar}>*</Text></Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your phone number"
                  keyboardType="phone-pad"
                  value={formData.phone}
                  onChangeText={(text) => handleInputChange('phone', text)}
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
                <Text style={styles.inputLabel}>Message</Text>
                <TextInput
                  style={[styles.textInput, styles.textAreaInput]}
                  placeholder="Type your message here..."
                  multiline
                  numberOfLines={5}
                  textAlignVertical="top"
                  value={formData.message}
                  onChangeText={(text) => handleInputChange('message', text)}
                />
              </View>
              
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
              >
                <Text style={styles.submitButtonText}>SUBMIT</Text>
              </TouchableOpacity>
            </View>

            {/* Company Information Section */}
            <View style={styles.infoContainer}>
              <View style={styles.infoSection}>
                <Text style={styles.sectionTitle}>Legal</Text>
                <View style={styles.divider} />
                <Text style={styles.companyName}>BAGCLUES EXIM PRIVATE LIMITED</Text>
                <Text style={styles.companyAddress}>
                  A-79, SECTOR-58, NOIDA-201301 NOIDA(U.P)-201301, DELHI-NCR
                </Text>
              </View>

              <View style={styles.infoSection}>
                <Text style={styles.sectionTitle}>Visit us</Text>
                <View style={styles.divider} />
                <View style={styles.emailSection}>
                  <View style={styles.emailItem}>
                    <Text style={styles.emailLabel}>General Inquiries:</Text>
                    <Text style={styles.emailValue}>info@skylyf.com</Text>
                  </View>
                  <View style={styles.emailItem}>
                    <Text style={styles.emailLabel}>Sales Team:</Text>
                    <Text style={styles.emailValue}>sales@skylyf.com</Text>
                  </View>
                  <View style={styles.emailItem}>
                    <Text style={styles.emailLabel}>Service Team:</Text>
                    <Text style={styles.emailValue}>service@skylyf.com</Text>
                  </View>
                </View>
              </View>

              <View style={styles.infoSection}>
                <Text style={styles.sectionTitle}>Get in touch</Text>
                <View style={styles.divider} />
                <View style={styles.phoneSection}>
                  <View style={styles.phoneItem}>
                    <Text style={styles.phoneLabel}>General Inquiries:</Text>
                    <Text style={styles.phoneValue}>+91 7654044444, +91 7654022222</Text>
                  </View>
                  <View style={styles.phoneItem}>
                    <Text style={styles.phoneLabel}>Sales Inquiries:</Text>
                    <Text style={styles.phoneValue}>+91 9999758880, +91 9999459977</Text>
                  </View>
                  <View style={styles.phoneItem}>
                    <Text style={styles.phoneLabel}>Service Support:</Text>
                    <Text style={styles.phoneValue}>+91 9999756605</Text>
                  </View>
                </View>
              </View>

              {/* Business Hours */}
              <View style={styles.hoursContainer}>
                <Text style={styles.hoursTitle}>Business Hours</Text>
                <View style={styles.divider} />
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, index) => (
                  <View key={index} style={styles.hourItem}>
                    <Text style={styles.dayText}>{day}</Text>
                    <Text style={styles.timeText}>9:00 am – 7:00 pm</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* WhatsApp Button */}
            <TouchableOpacity style={styles.whatsappButton} onPress={openWhatsApp}>
              <FontAwesome name="whatsapp" size={24} color="#fff" style={styles.whatsappIcon} />
              <Text style={styles.whatsappText}>Chat on WhatsApp</Text>
            </TouchableOpacity>

            {/* Subscribe Section */}
            <View style={styles.subscribeContainer}>
              <View style={styles.subscribeContent}>
                <Text style={styles.subscribeTitle}>Subscribe</Text>
                <View style={styles.subscribeForm}>
                  <TextInput
                    style={styles.subscribeInput}
                    placeholder="Type your email..."
                    value={subscribeEmail}
                    onChangeText={setSubscribeEmail}
                    keyboardType="email-address"
                  />
                  <TouchableOpacity style={styles.subscribeButton} onPress={handleSubscribe}>
                    <Text style={styles.subscribeButtonText}>SUBSCRIBE</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
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
  thanksTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007BFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  serviceDescription: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
    textAlign: 'center',
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
  infoContainer: {
    marginVertical: 16,
    marginHorizontal: 16,
  },
  infoSection: {
    marginBottom: 20,
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
    color: '#007BFF',
    marginBottom: 8,
  },
  divider: {
    height: 2,
    backgroundColor: '#ddd',
    marginBottom: 12,
  },
  companyName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  companyAddress: {
    fontSize: 14,
    color: '#555',
    lineHeight: 22,
  },
  emailSection: {
    marginTop: 8,
  },
  emailItem: {
    marginBottom: 8,
  },
  emailLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  emailValue: {
    fontSize: 14,
    color: '#007BFF',
  },
  phoneSection: {
    marginTop: 8,
  },
  phoneItem: {
    marginBottom: 10,
  },
  phoneLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  phoneValue: {
    fontSize: 14,
    color: '#333',
  },
  hoursContainer: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  hoursTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007BFF',
    marginBottom: 8,
  },
  hourItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dayText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
  timeText: {
    fontSize: 14,
    color: '#555',
  },
  whatsappButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#25D366',
    marginHorizontal: 16,
    marginVertical: 12,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  whatsappIcon: {
    marginRight: 10,
  },
  whatsappText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  subscribeContainer: {
    marginHorizontal: 16,
    marginVertical: 20,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  subscribeContent: {
    alignItems: 'center',
  },
  subscribeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007BFF',
    marginBottom: 16,
  },
  subscribeForm: {
    width: '100%',
  },
  subscribeInput: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    color: '#333',
  },
  subscribeButton: {
    backgroundColor: '#007BFF',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  subscribeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ContactPage;