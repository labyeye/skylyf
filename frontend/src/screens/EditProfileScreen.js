import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
  Switch,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { endpoints } from '../config/api';
import * as ImagePicker from 'react-native-image-picker';
import BackButton from '../components/BackButton';

const EditProfileScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [customerId, setCustomerId] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [billing, setBilling] = useState({ address_1: '', address_2: '', city: '', state: '', postcode: '', country: '' });
  const [shipping, setShipping] = useState({ address_1: '', address_2: '', city: '', state: '', postcode: '', country: '' });
  const [useSameAddress, setUseSameAddress] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          const user = JSON.parse(userData);
          setCustomerId(user.id);
          setEmail(user.email || '');
          if (user.name) {
            const parts = user.name.split(' ');
            setFirstName(parts[0] || '');
            setLastName(parts.slice(1).join(' ') || '');
          }
          // Fetch full customer details from backend
          const res = await axios.get(`${endpoints.register.replace('/auth/register','')}/customers/${user.id}`);
          const customer = res.data;
          setPhone(customer.phone || '');
          setBilling(customer.billing || billing);
          setShipping(customer.shipping || shipping);
          if (customer.profile_image) setProfileImage({ uri: customer.profile_image });
        }
      } catch (e) {
        Alert.alert('Error', 'Failed to load profile info');
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  // Handle "Use same as billing address"
  useEffect(() => {
    if (useSameAddress) {
      setShipping({ ...billing });
    }
  }, [useSameAddress, billing]);

  const handleCancel = () => navigation.goBack();

  const handleSave = async () => {
    if (!firstName || !email) {
      Alert.alert('Error', 'First name and email are required');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        // billing and shipping removed for troubleshooting
      };
      await axios.put(`${endpoints.register.replace('/auth/register','')}/customers/${customerId}`, payload);
      // Update AsyncStorage
      const updatedUser = { id: customerId, name: `${firstName} ${lastName}`.trim(), email };
      await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
      Alert.alert('Success', 'Profile updated successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.log('Profile update error:', error.response?.data || error.message);
      Alert.alert('Error', error.response?.data?.error || error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleImagePick = () => {
    ImagePicker.launchImageLibrary(
      { mediaType: 'photo', quality: 0.7 },
      (response) => {
        if (response.didCancel) return;
        if (response.errorCode) {
          Alert.alert('Error', response.errorMessage || 'Image pick error');
          return;
        }
        if (response.assets && response.assets.length > 0) {
          setProfileImage({ uri: response.assets[0].uri });
        }
      }
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, { paddingTop: Platform.OS === 'android' ? 30 : 0 }]}>
        <BackButton />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { paddingTop: Platform.OS === 'android' ? 30 : 0 }]}>
      <BackButton />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.imageSection}>
          <TouchableOpacity onPress={handleImagePick} style={styles.imagePicker}>
            <Image
              source={profileImage ? { uri: profileImage.uri } : require('../assets/images/avatar.png')}
              style={styles.profileImage}
            />
            <Text style={styles.imageText}>Change Photo</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.card}>
          <Text style={styles.section}>Basic Info</Text>
          <TextInput style={styles.input} placeholder="First Name" value={firstName} onChangeText={setFirstName} />
          <TextInput style={styles.input} placeholder="Last Name" value={lastName} onChangeText={setLastName} />
          <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
          <TextInput style={styles.input} placeholder="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        </View>
        <View style={styles.card}>
          <Text style={styles.section}>Billing Address</Text>
          <TextInput style={styles.input} placeholder="Address 1" value={billing.address_1} onChangeText={v => setBilling({ ...billing, address_1: v })} />
          <TextInput style={styles.input} placeholder="Address 2" value={billing.address_2} onChangeText={v => setBilling({ ...billing, address_2: v })} />
          <TextInput style={styles.input} placeholder="City" value={billing.city} onChangeText={v => setBilling({ ...billing, city: v })} />
          <TextInput style={styles.input} placeholder="State" value={billing.state} onChangeText={v => setBilling({ ...billing, state: v })} />
          <TextInput style={styles.input} placeholder="Postcode" value={billing.postcode} onChangeText={v => setBilling({ ...billing, postcode: v })} />
          <TextInput style={styles.input} placeholder="Country" value={billing.country} onChangeText={v => setBilling({ ...billing, country: v })} />
        </View>
        <View style={styles.card}>
          <View style={styles.sameAddressRow}>
            <Text style={styles.section}>Shipping Address</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Switch value={useSameAddress} onValueChange={setUseSameAddress} />
              <Text style={{ marginLeft: 8 }}>Use same as billing</Text>
            </View>
          </View>
          {!useSameAddress && (
            <>
              <TextInput style={styles.input} placeholder="Address 1" value={shipping.address_1} onChangeText={v => setShipping({ ...shipping, address_1: v })} />
              <TextInput style={styles.input} placeholder="Address 2" value={shipping.address_2} onChangeText={v => setShipping({ ...shipping, address_2: v })} />
              <TextInput style={styles.input} placeholder="City" value={shipping.city} onChangeText={v => setShipping({ ...shipping, city: v })} />
              <TextInput style={styles.input} placeholder="State" value={shipping.state} onChangeText={v => setShipping({ ...shipping, state: v })} />
              <TextInput style={styles.input} placeholder="Postcode" value={shipping.postcode} onChangeText={v => setShipping({ ...shipping, postcode: v })} />
              <TextInput style={styles.input} placeholder="Country" value={shipping.country} onChangeText={v => setShipping({ ...shipping, country: v })} />
            </>
          )}
        </View>
        <View style={{ height: 80 }} />
      </ScrollView>
      <View style={styles.stickyButtons}>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel} disabled={saving}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={saving}>
          <Text style={styles.saveButtonText}>{saving ? 'Saving...' : 'Save'}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f7f8fa',
  },
  container: {
    padding: 20,
    backgroundColor: '#f7f8fa',
    flexGrow: 1,
  },
  imageSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  imagePicker: {
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#007AFF',
    marginBottom: 8,
    backgroundColor: '#eee',
  },
  imageText: {
    color: '#007AFF',
    fontSize: 15,
    marginBottom: 8,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  section: {
    fontWeight: 'bold',
    marginBottom: 10,
    fontSize: 16,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  sameAddressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  stickyButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  cancelButton: {
    backgroundColor: '#ccc',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditProfileScreen; 