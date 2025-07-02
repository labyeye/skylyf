import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Switch,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useCart} from '../src/CartContext';

const GST_RATE = 0.18; // 18% GST

const Cart = ({navigation}) => {
  const {cartProducts, updateQuantity, removeFromCart} = useCart();
  const [promocode, setPromocode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [gstEnabled, setGstEnabled] = useState(false);
  const [businessName, setBusinessName] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [gstNumber, setGstNumber] = useState('');

  // Calculate subtotal
  const subtotal = cartProducts.reduce((sum, p) => sum + (Number(p.price) * (p.quantity || 1)), 0);
  // Promo discount (example: 10% off for code 'SAVE10')
  const promoDiscount = promoApplied && promocode.trim().toUpperCase() === 'SAVE10' ? subtotal * 0.1 : 0;
  // GST
  const gstAmount = gstEnabled ? (subtotal - promoDiscount) * GST_RATE : 0;
  // Total
  const total = subtotal - promoDiscount + gstAmount;

  const handleApplyPromo = () => {
    if (promocode.trim().toUpperCase() === 'SAVE10') {
      setPromoApplied(true);
    } else {
      setPromoApplied(false);
      alert('Invalid Promocode');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <FontAwesome name="arrow-left" size={22} color="#007BFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Cart</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
      {cartProducts.length > 0 ? (
          <>
            {cartProducts.map((product, idx) => (
              <View style={styles.productCard} key={product.id || idx}>
                <Image
                  source={{
                    uri:
                      product.images?.[0]?.src || 'https://via.placeholder.com/200',
                  }}
                  style={styles.productImage}
                />
                <View style={styles.productInfo}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productPrice}>₹{product.price}</Text>
                  <View style={styles.qtyRow}>
                    <TouchableOpacity
                      style={styles.qtyBtn}
                      onPress={() => updateQuantity(product.id, -1)}>
                      <FontAwesome name="minus" size={16} color="#007BFF" />
                    </TouchableOpacity>
                    <Text style={styles.qtyText}>{product.quantity || 1}</Text>
                    <TouchableOpacity
                      style={styles.qtyBtn}
                      onPress={() => updateQuantity(product.id, 1)}>
                      <FontAwesome name="plus" size={16} color="#007BFF" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.removeBtn}
                      onPress={() => removeFromCart(product.id)}>
                      <FontAwesome name="trash" size={16} color="#FF6347" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>₹{subtotal.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Promocode</Text>
                <View style={styles.promoRow}>
                  <TextInput
                    style={styles.promoInput}
                    placeholder="Enter code"
                    value={promocode}
                    onChangeText={setPromocode}
                    editable={!promoApplied}
                  />
                  <TouchableOpacity
                    style={styles.promoBtn}
                    onPress={handleApplyPromo}
                    disabled={promoApplied}>
                    <Text style={styles.promoBtnText}>{promoApplied ? 'Applied' : 'Apply'}</Text>
                  </TouchableOpacity>
                </View>
              </View>
              {promoApplied && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Promo Discount</Text>
                  <Text style={styles.summaryValue}>-₹{promoDiscount.toFixed(2)}</Text>
                </View>
              )}
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Add GST (18%)</Text>
                <Switch value={gstEnabled} onValueChange={setGstEnabled} />
              </View>
              {gstEnabled && (
                <>
                  <View style={styles.gstInputRow}>
                    <TextInput
                      style={styles.gstInput}
                      placeholder="Business Name"
                      value={businessName}
                      onChangeText={setBusinessName}
                    />
                  </View>
                  <View style={styles.gstInputRow}>
                    <TextInput
                      style={styles.gstInput}
                      placeholder="Business Address"
                      value={businessAddress}
                      onChangeText={setBusinessAddress}
                    />
                  </View>
                  <View style={styles.gstInputRow}>
                    <TextInput
                      style={styles.gstInput}
                      placeholder="GST Number"
                      value={gstNumber}
                      onChangeText={setGstNumber}
                    />
                  </View>
                </>
              )}
              <View style={styles.summaryRowTotal}>
                <Text style={styles.summaryTotalLabel}>Total</Text>
                <Text style={styles.summaryTotalValue}>₹{total.toFixed(2)}</Text>
              </View>
          </View>
            <TouchableOpacity style={styles.checkoutBtn} onPress={() => navigation.navigate('BillDetails', { orderValue: total })}>
              <Text style={styles.checkoutBtnText}>Go to Bill Details</Text>
            </TouchableOpacity>
          </>
      ) : (
        <Text style={styles.emptyText}>No products in cart.</Text>
      )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f8f8f8'},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {marginRight: 12},
  headerTitle: {fontSize: 20, fontWeight: 'bold', color: '#222'},
  scrollContent: {paddingBottom: 32},
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 16,
    backgroundColor: '#eee',
  },
  productInfo: {flex: 1},
  productName: {fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 4},
  productPrice: {fontSize: 15, color: '#007AFF', fontWeight: 'bold', marginBottom: 8},
  qtyRow: {flexDirection: 'row', alignItems: 'center', marginTop: 8},
  qtyBtn: {padding: 6, borderWidth: 1, borderColor: '#007BFF', borderRadius: 6, marginHorizontal: 4},
  qtyText: {fontSize: 16, fontWeight: 'bold', minWidth: 28, textAlign: 'center'},
  removeBtn: {marginLeft: 12, padding: 6},
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  summaryLabel: {fontSize: 15, color: '#555'},
  summaryValue: {fontSize: 15, color: '#222', fontWeight: 'bold'},
  promoRow: {flexDirection: 'row', alignItems: 'center'},
  promoInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 6,
    minWidth: 100,
    marginRight: 8,
    fontSize: 14,
  },
  promoBtn: {
    backgroundColor: '#007BFF',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  promoBtnText: {color: '#fff', fontWeight: 'bold', fontSize: 14},
  summaryRowTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
  summaryTotalLabel: {fontSize: 17, fontWeight: 'bold', color: '#222'},
  summaryTotalValue: {fontSize: 17, fontWeight: 'bold', color: '#007AFF'},
  checkoutBtn: {
    backgroundColor: '#007BFF',
    borderRadius: 10,
    margin: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  checkoutBtnText: {color: '#fff', fontSize: 17, fontWeight: 'bold'},
  emptyText: {marginTop: 40, textAlign: 'center', color: '#888', fontSize: 16},
  gstInputRow: { marginBottom: 10 },
  gstInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 8,
    fontSize: 14,
    backgroundColor: '#fafafa',
  },
});

export default Cart; 
