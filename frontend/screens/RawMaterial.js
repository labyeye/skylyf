import React, {useState, useEffect} from 'react';
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
  Platform,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import {endpoints} from '../src/config/api';
import {useCart} from '../src/CartContext';
import BackButton from '../src/components/BackButton';

const {width} = Dimensions.get('window');

const RawMaterialScreen = ({navigation}) => {
  const [cartCount, setCartCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortOption, setSortOption] = useState('priceLowToHigh');
  const [filterPriceRange, setFilterPriceRange] = useState([0, 5000000]);
  const [filterDiscount, setFilterDiscount] = useState(0);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const {cartProducts, addToCart} = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await axios.get(endpoints.products);
        // Transform the data to ensure it has the expected structure
        const transformedProducts = res.data.map(product => ({
          id: product.id || '',
          name: product.name || '',
          description: product.description || '',
          price: product.price || product.regular_price || '0',
          regular_price: product.regular_price || product.price || '0',
          discount:
            product.discount ||
            (product.regular_price &&
            product.price &&
            product.regular_price > product.price
              ? Math.round(
                  (1 - Number(product.price) / Number(product.regular_price)) *
                    100,
                )
              : 0),
          rating: product.rating || product.average_rating || 0,
          images: Array.isArray(product.images) ? product.images : [],
          stock_quantity: product.stock_quantity || 0,
          categories: Array.isArray(product.categories)
            ? product.categories
            : [],
        }));
        console.log('Transformed products:', transformedProducts.length);
        setProducts(transformedProducts);
        setFilteredProducts(transformedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const searchResults = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setFilteredProducts(searchResults);
    } else {
      applyFilters();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, products]);

  const handleAddToCart = product => {
    addToCart(product);
  };

  const handleSortChange = value => {
    setSortOption(value);
    sortProducts(value);
  };

  const handlePriceRangeChange = value => {
    setFilterPriceRange(value);
    applyFilters();
  };

  const handleDiscountChange = value => {
    setFilterDiscount(value);
    applyFilters();
  };

  const applyFilters = () => {
    const filtered = products.filter(product => {
      const matchesSearch = searchTerm
        ? product.name.toLowerCase().includes(searchTerm.toLowerCase())
        : true;

      const productPrice = Number(product.price);

      return (
        matchesSearch &&
        productPrice >= filterPriceRange[0] &&
        productPrice <= filterPriceRange[1] &&
        (product.discount || 0) >= filterDiscount
      );
    });
    sortProducts(sortOption, filtered);
  };

  const sortProducts = (option, data = filteredProducts) => {
    let sortedData = [...data];
    if (option === 'priceLowToHigh') {
      sortedData.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (option === 'priceHighToLow') {
      sortedData.sort((a, b) => Number(b.price) - Number(a.price));
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

  const formatPrice = price => {
    if (!price && price !== 0) return '0';
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const renderProductItem = ({item}) => {
    // Calculate the discounted price
    const regularPrice = Number(item.regular_price || item.price || 0);
    const discount = item.discount || 0;
    const discountedPrice =
      discount > 0
        ? regularPrice - (regularPrice * discount) / 100
        : Number(item.price || 0);

    return (
      <View style={styles.productItem}>
        <Image
          source={{
            uri: item.images?.[0]?.src || 'https://via.placeholder.com/200',
          }}
          style={styles.productImage}
          resizeMode="cover"
        />

        <View style={styles.productDetails}>
          <Text style={styles.productName} numberOfLines={2}>
            {item.name}
          </Text>

          <View style={styles.priceContainer}>
            {discount > 0 && (
              <>
                <Text style={styles.discountText}>-{discount}%</Text>
                <Text style={styles.originalPrice}>
                  ₹{formatPrice(regularPrice)}
                </Text>
              </>
            )}
            <Text style={styles.productPrice}>
              ₹{formatPrice(Math.round(discountedPrice))}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.addToCartButton}
            onPress={() => handleAddToCart(item)}>
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
    {label: 'All Prices', value: [0, 5000000]},
    {label: '₹0 - ₹50,000', value: [0, 50000]},
    {label: '₹50,000 - ₹1,00,000', value: [50000, 100000]},
    {label: '₹1,00,000 - ₹10,00,000', value: [100000, 1000000]},
  ];

  // Discount options for picker
  const discountOptions = [
    {label: 'All Discounts', value: 0},
    {label: 'Discount 10%+', value: 10},
    {label: 'Discount 20%+', value: 20},
  ];

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Loading products...</Text>
      </View>
    );
  }

  if (!filteredProducts.length) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>No products found.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        {paddingTop: Platform.OS === 'android' ? 30 : 0},
      ]}>
      <View style={styles.header}>
        <BackButton />
        <View style={styles.searchBarContainer}>
          <View style={styles.searchContainer}>
            <FontAwesome
              name="search"
              size={20}
              color="#888"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search products..."
              value={searchTerm}
              onChangeText={setSearchTerm}
              placeholderTextColor="#888"
            />
          </View>
        </View>
        <TouchableOpacity
          style={styles.cartIconContainer}
          onPress={() => navigation.navigate('Cart')}>
          <FontAwesome name="shopping-cart" size={24} color="#333" />
          {cartProducts.length > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartProducts.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.filterBar}>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={toggleFilterModal}>
          <FontAwesome name="filter" size={16} color="#333" />
          <Text style={styles.filterButtonText}>Filters</Text>
        </TouchableOpacity>

        <View style={styles.sortButtonsContainer}>
          <TouchableOpacity
            style={[
              styles.sortButton,
              sortOption === 'priceLowToHigh' && styles.activeSortButton,
            ]}
            onPress={() => handleSortChange('priceLowToHigh')}>
            <Text
              style={[
                styles.sortButtonText,
                sortOption === 'priceLowToHigh' && styles.activeSortText,
              ]}>
              Price: Low to High
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.sortButton,
              sortOption === 'priceHighToLow' && styles.activeSortButton,
            ]}
            onPress={() => handleSortChange('priceHighToLow')}>
            <Text
              style={[
                styles.sortButtonText,
                sortOption === 'priceHighToLow' && styles.activeSortText,
              ]}>
              Price: High to Low
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={filteredProducts}
        keyExtractor={item => item.id}
        renderItem={renderProductItem}
        contentContainerStyle={styles.productList}
        showsVerticalScrollIndicator={false}
        numColumns={1}
      />

      {/* Filter Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showFilterModal}
        onRequestClose={toggleFilterModal}>
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
                <FontAwesome
                  name="money"
                  size={18}
                  color="#007BFF"
                  style={styles.pickerIcon}
                />
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={filterPriceRange}
                    style={styles.picker}
                    onValueChange={handlePriceRangeChange}
                    dropdownIconColor="#007BFF"
                    mode="dropdown">
                    {priceRangeOptions.map((option, index) =>
                      renderPickerItem(option.label, option.value, index),
                    )}
                  </Picker>
                </View>
              </View>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Discount</Text>
              <View style={styles.pickerWrapper}>
                <FontAwesome
                  name="tag"
                  size={18}
                  color="#007BFF"
                  style={styles.pickerIcon}
                />
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={filterDiscount}
                    style={styles.picker}
                    onValueChange={handleDiscountChange}
                    dropdownIconColor="#007BFF"
                    mode="dropdown">
                    {discountOptions.map((option, index) =>
                      renderPickerItem(option.label, option.value, index),
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
                }}>
                <FontAwesome
                  name="refresh"
                  size={16}
                  color="#555"
                  style={{marginRight: 8}}
                />
                <Text style={styles.resetButtonText}>Reset</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.applyButton}
                onPress={applyFiltersAndCloseModal}>
                <FontAwesome
                  name="check"
                  size={16}
                  color="#fff"
                  style={{marginRight: 8}}
                />
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
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 12,
    flex: 1,
  },
  searchBarContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    width:"70%",
    height: 50,
    backgroundColor: 'transparent',
    borderRadius: 8,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    backgroundColor: 'transparent',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
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
    justifyContent: 'flex-end',
  },
  sortButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginLeft: 8,
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
    shadowOffset: {width: 0, height: 2},
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
});

export default RawMaterialScreen;
