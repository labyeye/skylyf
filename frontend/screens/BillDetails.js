import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Switch, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import countriesData from '../src/assets/countries.json'; // You will need to add this JSON file

const BillDetails = ({ navigation, route }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [country, setCountry] = useState('India');
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [showStatePicker, setShowStatePicker] = useState(false);
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [shipToDifferent, setShipToDifferent] = useState(false);
  const [orderNotes, setOrderNotes] = useState('');
  const [diffAddress, setDiffAddress] = useState('');
  const [diffCity, setDiffCity] = useState('');
  const [diffState, setDiffState] = useState('');
  const [diffPincode, setDiffPincode] = useState('');

  // Get all countries and states
  const countries = countriesData.map(c => c.name);
  const selectedCountryObj = countriesData.find(c => c.name === country);
  const states = selectedCountryObj && selectedCountryObj.states ? selectedCountryObj.states.map(s => s.name) : [];

  const handlePlaceOrder = () => {
    // You can add validation and order logic here
    alert('Order placed!');
  };

  // Get order value from route params
  const orderValue = route?.params?.orderValue || 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Billing Details</Text>
        <View style={styles.inputRow}>
          <TextInput style={styles.input} placeholder="First Name" value={firstName} onChangeText={setFirstName} />
          <TextInput style={styles.input} placeholder="Last Name" value={lastName} onChangeText={setLastName} />
        </View>
        <TextInput style={styles.input} placeholder="Address" value={address} onChangeText={setAddress} />
        <TouchableOpacity style={styles.countryField} onPress={() => setShowCountryPicker(true)}>
          <Text style={styles.countryFieldText}>{country}</Text>
        </TouchableOpacity>
        <Modal visible={showCountryPicker} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Picker
                selectedValue={country}
                onValueChange={(val) => {
                  setCountry(val);
                  setShowCountryPicker(false);
                  setState('');
                }}
              >
                {countries.map((c) => (
                  <Picker.Item key={c} label={c} value={c} />
                ))}
              </Picker>
              <TouchableOpacity onPress={() => setShowCountryPicker(false)} style={styles.closeModalBtn}>
                <Text style={styles.closeModalText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        {states.length > 0 && (
          <>
            <TouchableOpacity style={styles.countryField} onPress={() => setShowStatePicker(true)}>
              <Text style={styles.countryFieldText}>{state || 'Select State'}</Text>
            </TouchableOpacity>
            <Modal visible={showStatePicker} transparent animationType="slide">
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <Picker
                    selectedValue={state}
                    onValueChange={(val) => {
                      setState(val);
                      setShowStatePicker(false);
                    }}
                  >
                    <Picker.Item label="Select State" value="" />
                    {states.map((s) => (
                      <Picker.Item key={s} label={s} value={s} />
                    ))}
                  </Picker>
                  <TouchableOpacity onPress={() => setShowStatePicker(false)} style={styles.closeModalBtn}>
                    <Text style={styles.closeModalText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </>
        )}
        <View style={styles.inputRow}>
          <TextInput style={styles.input} placeholder="City/Town" value={city} onChangeText={setCity} />
          <TextInput style={styles.input} placeholder="Pincode" value={pincode} onChangeText={setPincode} keyboardType="numeric" />
        </View>
        <TextInput style={styles.input} placeholder="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Ship to a different address?</Text>
          <Switch value={shipToDifferent} onValueChange={setShipToDifferent} />
        </View>
        {shipToDifferent && (
          <>
            <TextInput style={styles.input} placeholder="Shipping Address" value={diffAddress} onChangeText={setDiffAddress} />
            <View style={styles.inputRow}>
              <TextInput style={styles.input} placeholder="City/Town" value={diffCity} onChangeText={setDiffCity} />
              <TextInput style={styles.input} placeholder="State" value={diffState} onChangeText={setDiffState} />
            </View>
            <TextInput style={styles.input} placeholder="Pincode" value={diffPincode} onChangeText={setDiffPincode} keyboardType="numeric" />
          </>
        )}
        <TextInput
          style={[styles.input, { height: 80 }]}
          placeholder="Order Notes (optional)"
          value={orderNotes}
          onChangeText={setOrderNotes}
          multiline
        />
        <View style={styles.orderValueRow}>
          <Text style={styles.orderValueLabel}>Order Value:</Text>
          <Text style={styles.orderValueAmount}>₹{orderValue.toFixed(2)}</Text>
        </View>
        <TouchableOpacity style={styles.placeOrderBtn} onPress={handlePlaceOrder}>
          <Text style={styles.placeOrderBtnText}>Place Order</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8' },
  scrollContent: { padding: 20, paddingBottom: 40 },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#222', textAlign: 'center' },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    fontSize: 15,
    marginBottom: 14,
    flex: 1,
  },
  inputRow: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  pickerWrapper: { flex: 1, backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#ddd', marginBottom: 14 },
  picker: { height: 48, width: '100%' },
  countryField: { backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#ddd', padding: 12, marginBottom: 14 },
  countryFieldText: { fontSize: 15, color: '#333' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', borderRadius: 12, padding: 20, width: '80%' },
  closeModalBtn: { marginTop: 10, alignSelf: 'center' },
  closeModalText: { color: '#007BFF', fontWeight: 'bold', fontSize: 16 },
  switchRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  switchLabel: { fontSize: 15, color: '#333', flex: 1 },
  orderValueRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, marginTop: 10 },
  orderValueLabel: { fontSize: 16, color: '#222', fontWeight: 'bold' },
  orderValueAmount: { fontSize: 16, color: '#007BFF', fontWeight: 'bold' },
  placeOrderBtn: { backgroundColor: '#007BFF', borderRadius: 10, paddingVertical: 16, alignItems: 'center', marginTop: 10 },
  placeOrderBtnText: { color: '#fff', fontSize: 17, fontWeight: 'bold' },
});

export default BillDetails; 