import React from 'react';
import { View, Text, Image, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const Cart = ({ navigation, route }) => {
  const { cartProducts = [] } = route.params || {};

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={22} color="#007BFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Cart</Text>
      </View>
      {cartProducts.length > 0 ? (
        cartProducts.map((product, idx) => (
          <View style={styles.productCard} key={idx}>
            <Image source={{ uri: product.images?.[0]?.src || 'https://via.placeholder.com/200' }} style={styles.productImage} />
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productPrice}>₹{product.price}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.emptyText}>No products in cart.</Text>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  backButton: { marginRight: 12 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#222' },
  productCard: { backgroundColor: '#fff', borderRadius: 12, margin: 24, padding: 20, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 2 },
  productImage: { width: 120, height: 120, borderRadius: 10, marginBottom: 16, backgroundColor: '#eee' },
  productName: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 8, textAlign: 'center' },
  productPrice: { fontSize: 16, color: '#007AFF', fontWeight: 'bold' },
  emptyText: { marginTop: 40, textAlign: 'center', color: '#888', fontSize: 16 },
});

export default Cart; 