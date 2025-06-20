import React, { useState, useEffect } from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Platform,
  Alert,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { endpoints } from '../src/config/api';

const Profile = ({ navigation }) => {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [premium, setPremium] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [customerId, setCustomerId] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          const user = JSON.parse(userData);
          setUserName(user.name || '');
          setUserEmail(user.email || '');
          setPremium(user.premium || false);
          setCustomerId(user.id);
        }
      } catch (e) {
        console.log('Failed to load user data', e);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', onPress: async () => {
            await AsyncStorage.removeItem('userData');
            navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
          }
        }
      ]
    );
  };

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => setIsEditing(false);

  const handleSave = async () => {
    if (!userName || !userEmail) {
      Alert.alert('Error', 'Name and email cannot be empty');
      return;
    }
    setSaving(true);
    try {
      // Update WooCommerce customer
      await axios.put(`${endpoints.register.replace('/auth/register','')}/customers/${customerId}`, {
        first_name: userName.split(' ')[0],
        last_name: userName.split(' ').slice(1).join(' '),
        email: userEmail,
      });
      // Update AsyncStorage
      const updatedUser = { id: customerId, name: userName, email: userEmail, premium };
      await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const profileOptions = [
    { icon: 'history', text: 'Order History', action: () => console.log('Order History') },
    { icon: 'credit-card', text: 'Payment Methods', action: () => console.log('Payment Methods') },
    { icon: 'map-marker', text: 'My Addresses', action: () => console.log('My Addresses') },
    { icon: 'cog', text: 'Settings', action: () => console.log('Settings') },
    { icon: 'sign-out', text: 'Sign Out', action: handleSignOut, danger: true }
  ];

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      {/* Header with edit option */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Profile</Text>
        {isEditing ? (
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity onPress={handleSave} disabled={saving} style={{ marginRight: 10 }}>
              <FontAwesome name="check" size={20} color="#28a745" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCancel} disabled={saving}>
              <FontAwesome name="times" size={20} color="#e74c3c" />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity onPress={handleEdit}>
            <FontAwesome name="pencil" size={20} color="#0066cc" />
          </TouchableOpacity>
        )}
      </View>

      {/* Profile Header */}
      <View style={styles.headerContainer}>
        <View style={styles.profileImageContainer}>
          <Image
            source={{ uri: 'https://via.placeholder.com/150' }}
            style={styles.profileImage}
          />
          {premium && (
            <View style={styles.premiumBadge}>
              <FontAwesome name="star" size={12} color="#fff" />
            </View>
          )}
        </View>
        <View style={styles.userInfo}>
          {isEditing ? (
            <>
              <TextInput
                style={styles.input}
                value={userName}
                onChangeText={setUserName}
                placeholder="Full Name"
              />
              <TextInput
                style={styles.input}
                value={userEmail}
                onChangeText={setUserEmail}
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </>
          ) : (
            <>
              <Text style={styles.userName}>{userName}</Text>
              <Text style={styles.userEmail}>{userEmail}</Text>
            </>
          )}
        </View>
      </View>

      {/* Profile Options */}
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.optionContainer}>
            {profileOptions.map((option, index) => (
              <TouchableOpacity 
                key={index} 
                style={[
                  styles.optionButton,
                  option.danger && styles.dangerButton
                ]}
                onPress={option.action}
              >
                <View style={styles.optionIconContainer}>
                  <FontAwesome 
                    name={option.icon} 
                    size={20} 
                    color={option.danger ? "#e74c3c" : "#0066cc"} 
                  />
                </View>
                <Text style={[
                  styles.optionText,
                  option.danger && styles.dangerText
                ]}>
                  {option.text}
                </Text>
                {!option.danger && (
                  <FontAwesome name="chevron-right" size={16} color="#bbb" style={styles.chevron} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Support Section */}
        <View style={styles.supportContainer}>
          <Text style={styles.sectionTitle}>Support</Text>
          <TouchableOpacity style={styles.supportButton} onPress={()=> navigation.navigate("Contact")}>
            <View style={styles.supportIconContainer}>
              <FontAwesome name="comment" size={20} color="#0066cc" />
            </View>
            <Text style={styles.supportText}>Contact Support</Text>
            <FontAwesome name="chevron-right" size={16} color="#bbb" style={styles.chevron} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.appInfo}>
          <Text style={styles.appVersion}>Developed By Kala Tech</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 30,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e8e8e8',
  },
  profileImageContainer: {
    position: 'relative',
    marginRight: 16,
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: '#fff',
  },
  premiumBadge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#0066cc',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  userInfo: {
    justifyContent: 'center',
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#777',
    marginBottom: 8,
  },
  premiumTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff8e1',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  premiumText: {
    color: '#ffa000',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  sectionContainer: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    marginBottom: 12,
  },
  optionContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f7ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  dangerButton: {
    borderBottomWidth: 0,
  },
  dangerText: {
    color: '#e74c3c',
  },
  chevron: {
    marginLeft: 'auto',
  },
  supportContainer: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  supportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  supportIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f7ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  supportText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  appInfo: {
    marginTop: 30,
    alignItems: 'center',
    paddingBottom: 10,
  },
  appVersion: {
    color: '#999',
    fontSize: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
});

export default Profile;