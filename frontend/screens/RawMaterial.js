import React, { useState, useEffect } from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  FlatList,
  Dimensions,
  SafeAreaView,
  TextInput,
  Modal,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const { width } = Dimensions.get('window');

const rawMaterialProducts = [
  {
    id: '1',
    name: 'Contactor NXC 12 | 12 Amp | 220 VAC | 3 NO | Chint',
    uri: 'https://skylyf.com/wp-content/uploads/2019/06/contactor-12-amp.jpg',
    price: 1000,
    discount: 10,
    rating: 4.5,
  },
  {
    id: '2',
    name: 'Contactor NXC 18 | 18 Amp | 220 VAC | 3 NO | Chint',
    uri: 'https://skylyf.com/wp-content/uploads/2019/06/contactor-18-amp-nxc-18-in-paper-cup-making-machine.jpg',
    price: 950,
    discount: 10,
    rating: 4.0,
  },
  {
    id: '3',
    name: 'Contactor NXC 25 | 25 Amp | 220 VAC | 3 NO | Chint',
    uri: 'https://skylyf.com/wp-content/uploads/2019/06/contactor-nxc-25-in-paper-cup-making-machine.jpg',
    price: 900,
    discount: 5,
    rating: 4.7,
  },
  {
    id: '4',
    name: 'Contactor NXC 09 | 9 Amp | 220 VAC | 3 NO | Chint',
    uri: 'https://skylyf.com/wp-content/uploads/2019/10/9-AMP-CONTACTOR.jpg',
    price: 950,
    discount: 10,
    rating: 3.5,
  },
  {
    id: '5',
    name: 'Fully Automatic Paper Cup Making Machine',
    uri: 'https://skylyf.com/wp-content/uploads/2024/12/ZSL-350-PAPER-CUP-MAKING-MACHINE-768x545.png',
    price: 1050000,
    discount: 0,
    rating: 4.2,
  },
  {
    id: '6',
    name: 'High Speed Paper Disposable Cup Machine',
    uri: 'https://skylyf.com/wp-content/uploads/2024/12/ZSL-220-PAPER-CUP-MAKING-MACHINE-768x545.jpg',
    price: 890000,
    discount: 0,
    rating: 4.6,
  },
  {
    id: '7',
    name: 'L Type Rubber | Top Outer Dia 18 mm | Big Nozzle Dia 10 mm | Small Nozzle Dia 4 mm | Imported',
    uri: 'https://skylyf.com/wp-content/uploads/2025/02/L-Type-Rubber.png',
    price: 50,
    discount: 0,
    rating: 4.3,
  },
  {
    id: '8',
    name: 'Paper Cup Raw Material Sample Kit',
    uri: 'https://skylyf.com/wp-content/uploads/2019/06/PAPER-CUPS-RAW-MATERIAL-SAMPLE-KIT-768x768.jpg',
    price: 15,
    discount: 33,
    rating: 4.8,
  },
  {
    id: '9',
    name: 'Pneumatic Air Cylinder SC 63X125 | Bore Dia 63 mm | Stroke 125 mm | Techno',
    uri: 'https://skylyf.com/wp-content/uploads/2019/06/Pneumatic-Cylinders-63125-768x566.jpg',
    price: 1600,
    discount: 15,
    rating: 4.2,
  },
  {
    id: '10',
    name: 'Pneumatic Air Cylinder SC 80X125 | Bore Dia 80 mm | Stroke 125 mm | Techno',
    uri: 'https://skylyf.com/wp-content/uploads/2019/06/Pneumatic-Cylinders-63125-768x566.jpg',
    price: 2350,
    discount: 30,
    rating: 4.4,
  },
  {
    id: '11',
    name: 'Silicone Vacuum Suction Cup | Double Layer Small | Paper Cup Vacuum Sucker',
    uri: 'https://skylyf.com/wp-content/uploads/2019/06/double-layer-paper-cup-vacuum-rubber.png',
    price: 50,
    discount: 0,
    rating: 4.0,
  },
  {
    id: '12',
    name: 'Silicone Vacuum Suction Cup | Double Layer | Paper Cup Big Sucker',
    uri: 'https://skylyf.com/wp-content/uploads/2019/06/double_layer_big_suction_cup.png',
    price: 6,
    discount: 0,
    rating: 4.6,
  },
  {
    id: '13',
    name: 'Silicone Vacuum Suction Cup | Double Layer | Paper Cup Rubber',
    uri: 'https://skylyf.com/wp-content/uploads/2019/06/paper-cup-rubber.png',
    price: 30,
    discount: 0,
    rating: 4.3,
  },
  {
    id: '14',
    name: 'Silicone Vacuum Suction Cup | Double Layer | Paper Cup Rubber',
    uri: 'https://skylyf.com/wp-content/uploads/2019/06/silicone_vacuum_suction_cup.png',
    price: 50,
    discount: 0,
    rating: 4.1,
  },
];

const RawMaterialScreen = () => {
  const [cartCount, setCartCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(rawMaterialProducts);
  const [sortOption, setSortOption] = useState('priceLowToHigh');
  const [filterPriceRange, setFilterPriceRange] = useState([0, 5000000]);
  const [filterDiscount, setFilterDiscount] = useState(0);
  const [showFilterModal, setShowFilterModal] = useState(false);
  
  useEffect(() => {
    if (searchTerm) {
      const searchResults = rawMaterialProducts.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(searchResults);
    } else {
      applyFilters();
    }
  }, [searchTerm]);

  const handleAddToCart = () => {
    setCartCount(cartCount + 1);
  };

  const handleSortChange = (value) => {
    setSortOption(value);
    sortProducts(value);
  };

  const handlePriceRangeChange = (value) => {
    setFilterPriceRange(value);
    applyFilters();
  };

  const handleDiscountChange = (value) => {
    setFilterDiscount(value);
    applyFilters();
  };

  const applyFilters = () => {
    const filtered = rawMaterialProducts.filter((product) => {
      const matchesSearch = searchTerm ? 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) : true;
        
      return (
        matchesSearch &&
        product.price >= filterPriceRange[0] &&
        product.price <= filterPriceRange[1] &&
        product.discount >= filterDiscount
      );
    });
    sortProducts(sortOption, filtered);
  };

  const sortProducts = (option, data = filteredProducts) => {
    let sortedData = [...data];
    if (option === 'priceLowToHigh') {
      sortedData.sort((a, b) => a.price - b.price);
    } else if (option === 'priceHighToLow') {
      sortedData.sort((a, b) => b.price - a.price);
    } else if (option === 'rating') {
      sortedData.sort((a, b) => b.rating - a.rating);
    }
    setFilteredProducts(sortedData);
  };

  const toggleFilterModal = () => {
    setShowFilterModal(!showFilterModal);
  };

  const applyFiltersAndCloseModal = () => {
    applyFilters();
    setShowFilterModal(false);
  };

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const renderProductItem = ({ item }) => {
    const discountedPrice = item.discount > 0 
      ? item.price - (item.price * item.discount / 100) 
      : item.price;
      
    return (
      <View style={styles.productItem}>
        <Image source={{ uri: item.uri }} style={styles.productImage} />
        
        <View style={styles.productDetails}>
          <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
          
          <View style={styles.priceContainer}>
            {item.discount > 0 && (
              <>
                <Text style={styles.discountText}>-{item.discount}%</Text>
                <Text style={styles.originalPrice}>₹{formatPrice(item.price)}</Text>
              </>
            )}
            <Text style={styles.productPrice}>
              ₹{formatPrice(Math.round(discountedPrice))}
            </Text>
          </View>
          
          <View style={styles.ratingContainer}>
            <FontAwesome name="star" size={16} color="#FFD700" />
            <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.addToCartButton} 
            onPress={handleAddToCart}
          >
            <Text style={styles.addToCartText}>+ Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Custom picker item renderer
  const renderPickerItem = (label, value, index) => {
    return (
      <Picker.Item 
        key={index} 
        label={label} 
        value={value} 
        style={styles.pickerItem}
      />
    );
  };

  // Price range options for picker
  const priceRangeOptions = [
    { label: 'All Prices', value: [0, 5000000] },
    { label: '₹0 - ₹50,000', value: [0, 50000] },
    { label: '₹50,000 - ₹1,00,000', value: [50000, 100000] },
    { label: '₹1,00,000 - ₹10,00,000', value: [100000, 1000000] }
  ];

  // Discount options for picker
  const discountOptions = [
    { label: 'All Discounts', value: 0 },
    { label: 'Discount 10%+', value: 10 },
    { label: 'Discount 20%+', value: 20 }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <FontAwesome name="search" size={20} color="#888" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholderTextColor="#888"
          />
        </View>
        
        <TouchableOpacity style={styles.cartIconContainer}>
          <FontAwesome name="shopping-cart" size={24} color="#333" />
          {cartCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.filterBar}>
        <TouchableOpacity style={styles.filterButton} onPress={toggleFilterModal}>
          <FontAwesome name="filter" size={16} color="#333" />
          <Text style={styles.filterButtonText}>Filters</Text>
        </TouchableOpacity>
        
        <View style={styles.sortButtonsContainer}>
          <TouchableOpacity 
            style={[
              styles.sortButton, 
              sortOption === 'priceLowToHigh' && styles.activeSortButton
            ]}
            onPress={() => handleSortChange('priceLowToHigh')}
          >
            <Text style={[
              styles.sortButtonText,
              sortOption === 'priceLowToHigh' && styles.activeSortText
            ]}>
              Low to High
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.sortButton, 
              sortOption === 'priceHighToLow' && styles.activeSortButton
            ]}
            onPress={() => handleSortChange('priceHighToLow')}
          >
            <Text style={[
              styles.sortButtonText,
              sortOption === 'priceHighToLow' && styles.activeSortText
            ]}>
              High to Low
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.sortButton, 
              sortOption === 'rating' && styles.activeSortButton
            ]}
            onPress={() => handleSortChange('rating')}
          >
            <Text style={[
              styles.sortButtonText,
              sortOption === 'rating' && styles.activeSortText
            ]}>
              Top Rated
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {filteredProducts.length === 0 ? (
        <View style={styles.emptyResultsContainer}>
          <FontAwesome name="search" size={50} color="#ccc" />
          <Text style={styles.emptyResultsText}>No products found</Text>
          <Text style={styles.emptyResultsSubtext}>
            Try adjusting your search or filters
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          renderItem={renderProductItem}
          contentContainerStyle={styles.productList}
          showsVerticalScrollIndicator={false}
          numColumns={1}
        />
      )}

      {/* Filter Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showFilterModal}
        onRequestClose={toggleFilterModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Products</Text>
              <TouchableOpacity onPress={toggleFilterModal}>
                <FontAwesome name="times" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Price Range</Text>
              <View style={styles.pickerWrapper}>
                <FontAwesome name="money" size={18} color="#007BFF" style={styles.pickerIcon} />
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={filterPriceRange}
                    style={styles.picker}
                    onValueChange={handlePriceRangeChange}
                    dropdownIconColor="#007BFF"
                    mode="dropdown"
                  >
                    {priceRangeOptions.map((option, index) => 
                      renderPickerItem(option.label, option.value, index)
                    )}
                  </Picker>
                </View>
              </View>
            </View>
            
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Discount</Text>
              <View style={styles.pickerWrapper}>
                <FontAwesome name="tag" size={18} color="#007BFF" style={styles.pickerIcon} />
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={filterDiscount}
                    style={styles.picker}
                    onValueChange={handleDiscountChange}
                    dropdownIconColor="#007BFF"
                    mode="dropdown"
                  >
                    {discountOptions.map((option, index) => 
                      renderPickerItem(option.label, option.value, index)
                    )}
                  </Picker>
                </View>
              </View>
            </View>
            
            <View style={styles.filterActions}>
              <TouchableOpacity 
                style={styles.resetButton}
                onPress={() => {
                  setFilterPriceRange([0, 5000000]);
                  setFilterDiscount(0);
                }}
              >
                <FontAwesome name="refresh" size={16} color="#555" style={{ marginRight: 8 }} />
                <Text style={styles.resetButtonText}>Reset</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.applyButton}
                onPress={applyFiltersAndCloseModal}
              >
                <FontAwesome name="check" size={16} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.applyButtonText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
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
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    height: 42,
    color: '#333',
  },
  cartIconContainer: {
    marginLeft: 16,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF6347',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  filterBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    marginRight: 12,
  },
  filterButtonText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#333',
  },
  sortButtonsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sortButton: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  activeSortButton: {
    backgroundColor: '#e6f2ff',
  },
  sortButtonText: {
    fontSize: 12,
    color: '#555',
  },
  activeSortText: {
    color: '#007BFF',
    fontWeight: 'bold',
  },
  productList: {
    padding: 12,
  },
  productItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    padding: 12,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 12,
  },
  productDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
    lineHeight: 18,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    flexWrap: 'wrap',
  },
  discountText: {
    backgroundColor: '#FF6347',
    color: '#fff',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 6,
  },
  originalPrice: {
    fontSize: 12,
    color: '#888',
    textDecorationLine: 'line-through',
    marginRight: 6,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007BFF',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666',
  },
  addToCartButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  addToCartText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  filterSection: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  // New picker styling
  pickerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pickerIcon: {
    marginRight: 10,
  },
  pickerContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    color: '#333',
  },
  pickerItem: {
    fontSize: 16,
    color: '#333',
    height: 50,
  },
  filterActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  resetButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  resetButtonText: {
    fontSize: 16,
    color: '#555',
    fontWeight: '500',
  },
  applyButton: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007BFF',
    paddingVertical: 14,
    borderRadius: 8,
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  emptyResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyResultsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
  },
  emptyResultsSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default RawMaterialScreen;