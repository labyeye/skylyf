import React, {useState, useEffect} from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
  FlatList,
  Dimensions,
  SafeAreaView,
  TextInput,
  ActivityIndicator,
  Platform,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import axios from 'axios';
import {endpoints} from '../src/config/api';
import {useCart} from '../src/CartContext';
import logo from '../src/assets/images/logo.png';

const {width} = Dimensions.get('window');
const FEATURED_CARD_WIDTH = Math.min(width * 0.45, 180); // 45% of screen width with a max of 180px
const FEATURED_CARD_HEIGHT = FEATURED_CARD_WIDTH * 1.4; // Further reduced height ratio from 1.5 to 1.4

// Sample data for the image carousel
const carouselImages = [
  {
    id: '1',
    uri: 'https://skylyf.com/wp-content/uploads/2025/02/SKYLYF-BUILDING-2.png',
  },
  {
    id: '2',
    uri: 'https://img1.wsimg.com/isteam/ip/bc9de112-5f52-4c10-9592-67271ffb75f3/SKYLYF.jpg/:/cr=t:0%25,l:0%25,w:100%25,h:100%25/rs=w:1240,cg:true',
  },
  {
    id: '3',
    uri: 'https://img1.wsimg.com/isteam/ip/bc9de112-5f52-4c10-9592-67271ffb75f3/PP.png',
  },
];

// Sample data for testimonials
const testimonials = [
  {
    id: '1',
    text: "My experience with SKYLYF is outstanding. It's rare to find a company that genuinely invests in the success of its clients in the way that SKYLYF does. I wholeheartedly recommend SKYLYF to anyone in need of reliable paper cup machinery, quality paper cup raw materials, and essential spare parts for paper cup production. They have earned my highest recommendation",
    name: 'MANISH AGGARWAL',
    location: 'NEW DELHI',
    avatar: 'https://skylyf.com/wp-content/uploads/2025/01/skylyf_client.png',
  },
  {
    id: '2',
    text: 'Working with SKYLYF has completely transformed our production capabilities. Their machines are reliable and the customer support is exceptional.',
    name: 'RAJESH KUMAR',
    location: 'MUMBAI',
    avatar:
      'https://i0.wp.com/skylyf.com/wp-content/uploads/2025/01/testimonial-2.jpg?resize=100,100',
  },
  {
    id: '3',
    text: 'As a new business owner, I was concerned about investing in machinery. SKYLYF guided me through every step and provided excellent training for my team.',
    name: 'PRIYA PATEL',
    location: 'AHMEDABAD',
    avatar:
      'https://i0.wp.com/skylyf.com/wp-content/uploads/2025/01/testimonial-3.jpg?resize=100,100',
  },
];

// Sample data for blogs
const blogPosts = [
  {
    id: '1',
    title: 'How To Manufacture Paper Cup From Paper Cup Making Machine',
    date: 'February 12, 2020',
    featured: true,
    categories: ['Blog', 'Featured'],
    // Add a placeholder image for blog posts
    image:
      'https://skylyf.com/wp-content/uploads/2020/02/paper-cups-all-size-768x768.jpg',
  },
  {
    id: '2',
    title: 'HOW TO START PAPER CUP MANUFACTURING',
    date: 'February 7, 2020',
    featured: true,
    categories: ['Blog', 'Featured'],
    image:
      'https://skylyf.com/wp-content/uploads/2020/02/HOW-TO-START-PAPER-CUP-MANUFACTURING-768x768.jpeg',
  },
  {
    id: '3',
    title: 'Paper Cup Making Machine',
    date: 'February 6, 2020',
    featured: true,
    categories: ['Blog', 'Branding', 'Featured'],
    image:
      'https://skylyf.com/wp-content/uploads/2020/02/PAPER-CUP-WITH-LID-SKYLYF-e1739453813619-768x648.jpg',
  },
  {
    id: '4',
    title: 'Paper Cup Making Machine Project Report',
    date: 'February 6, 2020',
    featured: true,
    categories: ['Blog', 'Featured'],
    image:
      'https://skylyf.com/wp-content/uploads/2020/02/PAPER-CUP-MAKING-MACHINE-PROJECT-REPORTK-768x768.jpeg',
  },
];

const Home = ({navigation}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('home');
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  // Image carousel auto-scroll
  const [activeSlide, setActiveSlide] = useState(0);

  const {cartProducts, addToCart} = useCart();

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(endpoints.products);
      if (res.data && Array.isArray(res.data)) {
        setProducts(res.data);
      } else {
        console.log('Invalid data format from API:', res.data);
        setError('Invalid data format received from server');
        setProducts([]);
      }
    } catch (error) {
      console.log('Error fetching products:', error);
      setError(error.message || 'Failed to fetch products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide(prevSlide =>
        prevSlide === carouselImages.length - 1 ? 0 : prevSlide + 1,
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleSearch = text => {
    setSearchTerm(text);
  };

  const handleAddToCart = product => {
    addToCart(product);
  };

  const renderImageCarouselItem = ({item}) => (
    <View style={styles.carouselItem}>
      <Image source={{uri: item.uri}} style={styles.carouselImage} />
    </View>
  );

  const renderProductItem = ({item}) => {
    const rating = item.rating || (Math.random() * 1.5 + 3.5).toFixed(1); // Generate random rating between 3.5 and 5.0
    // Determine badge based on product properties
    const showBadge = item.on_sale || item.is_new;
    const badgeType = item.on_sale ? 'sale' : 'new';

    return (
      <View style={styles.productItem}>
        {/* Product Badge */}
        {showBadge && (
          <View style={styles.badgeContainer}>
            <View
              style={badgeType === 'sale' ? styles.saleBadge : styles.newBadge}>
              <Text style={styles.badgeText}>
                {badgeType === 'sale' ? 'SALE' : 'NEW'}
              </Text>
            </View>
          </View>
        )}

        <Image 
          source={{
            uri: item.images?.[0]?.src || 'https://via.placeholder.com/150'
          }} 
          style={styles.productImage}
        />
        <Text style={styles.productName} numberOfLines={2}>
          {item.name}
        </Text>

        {/* Rating stars */}
        <View style={styles.productRating}>
          {[1, 2, 3, 4, 5].map(star => (
            <FontAwesome
              key={star}
              name={
                rating >= star
                  ? 'star'
                  : rating >= star - 0.5
                  ? 'star-half-full'
                  : 'star-o'
              }
              size={12}
              color="#FFD700"
              style={{marginRight: 2}}
            />
          ))}
        </View>

        {/* Price with optional discount */}
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={styles.productPrice}>₹{item.price || '0'}</Text>
          {item.oldPrice && (
            <Text style={styles.productDiscount}>₹{item.oldPrice}</Text>
          )}
        </View>

        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={() => handleAddToCart(item)}>
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Render carousel pagination indicators
  const renderPagination = () => {
    return (
      <View style={styles.paginationContainer}>
        {carouselImages.map((_, i) => (
          <View
            key={i}
            style={[
              styles.paginationDot,
              i === activeSlide ? styles.paginationDotActive : null,
            ]}
          />
        ))}
      </View>
    );
  };

  // Render testimonial item
  const renderTestimonialItem = ({item}) => (
    <View style={styles.testimonialItem}>
      <View style={styles.testimonialContent}>
        <FontAwesome
          name="quote-left"
          size={24}
          color="#007BFF"
          style={styles.quoteIcon}
        />
        <Text style={styles.testimonialText}>{item.text}</Text>
        <View style={styles.testimonialAuthor}>
          <Image source={{uri: item.avatar}} style={styles.testimonialAvatar} />
          <View style={styles.testimonialAuthorInfo}>
            <Text style={styles.testimonialName}>{item.name}</Text>
            <Text style={styles.testimonialLocation}>{item.location}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  // Render blog post item (horizontal)
  const renderBlogItem = ({item}) => (
    <TouchableOpacity style={styles.blogItemHorizontal}>
      <Image source={{uri: item.image}} style={styles.blogImageHorizontal} />
      <View style={styles.blogContentHorizontal}>
        <View style={styles.blogCategoriesContainer}>
          {item.categories.map((category, index) => (
            <Text key={index} style={styles.blogCategory}>
              {category}
            </Text>
          ))}
        </View>
        <Text style={styles.blogTitleHorizontal} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.blogDate}>posted on {item.date}</Text>
        <View style={styles.readMoreContainer}>
          <Text style={styles.readMoreText}>Read More</Text>
          <FontAwesome
            name="arrow-right"
            size={14}
            color="#007BFF"
            style={styles.readMoreIcon}
          />
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{marginTop: 10, color: '#666'}}>Loading products...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <FontAwesome name="exclamation-circle" size={40} color="#FF6347" />
        <Text style={{marginTop: 10, color: '#666'}}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => {
            setLoading(true);
            fetchProducts();
          }}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={[styles.safeArea, { paddingTop: Platform.OS === 'android' ? 30 : 0 }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Image source={logo} style={styles.logo} />
            <TouchableOpacity
              style={styles.cartIconContainer}
              onPress={() => navigation.navigate('Cart')}>
              <FontAwesome name="shopping-cart" size={24} color="#888" />
              {cartProducts.length > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>
                    {cartProducts.length}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Image Carousel */}
          <View style={styles.carouselContainer}>
            <FlatList
              data={carouselImages}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => item.id}
              renderItem={renderImageCarouselItem}
              onMomentumScrollEnd={event => {
                const slideIndex = Math.floor(
                  event.nativeEvent.contentOffset.x / width,
                );
                setActiveSlide(slideIndex);
              }}
            />
            {renderPagination()}
          </View>

          {/* Product Carousel */}
          <View style={styles.productSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Featured Products</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Raw Materials')}>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            
            {products.length > 0 ? (
              <FlatList
                data={products}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={item => item.id.toString()}
                renderItem={({item}) => {
                  // Placeholder rating (out of 5)
                  const rating = item.rating || 4.5;
                  // Placeholder subtitle/description
                  const subtitle =
                    item.short_description ||
                    'High quality, reliable performance.';
                  return (
                    <View style={styles.featuredCard}>
                      <Image
                        source={{
                          uri:
                            item.images?.[0]?.src ||
                            'https://via.placeholder.com/200',
                        }}
                        style={styles.featuredImage}
                      />
                      <View style={styles.featuredInfo}>
                        <Text style={styles.featuredTitle} numberOfLines={2}>
                          {item.name}
                        </Text>
                        <View style={styles.featuredRatingRow}>
                          {[1, 2, 3, 4, 5].map(star => (
                            <FontAwesome
                              key={star}
                              name={
                                rating >= star
                                  ? 'star'
                                  : rating >= star - 0.5
                                  ? 'star-half-full'
                                  : 'star-o'
                              }
                              size={14}
                              color="#FFD700"
                              style={{marginRight: 2}}
                            />
                          ))}
                          <Text style={styles.featuredRatingText}>{rating}</Text>
                        </View>
                        <View style={styles.featuredPriceTag}>
                          <Text style={styles.featuredPrice}>
                            ₹{item.price || '0'}
                          </Text>
                        </View>
                      </View>
                      <TouchableOpacity
                        style={styles.featuredAddToCartButton}
                        onPress={() => handleAddToCart(item)}>
                        <Text style={styles.featuredAddToCartText}>
                          Add to Cart
                        </Text>
                      </TouchableOpacity>
                    </View>
                  );
                }}
                contentContainerStyle={styles.productList}
              />
            ) : (
              <View style={styles.emptyProductsContainer}>
                <FontAwesome name="shopping-basket" size={50} color="#ccc" />
                <Text style={styles.emptyProductsText}>No products available</Text>
                <TouchableOpacity 
                  style={styles.retryButton}
                  onPress={fetchProducts}>
                  <Text style={styles.retryButtonText}>Refresh</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Regular Products List */}
          <View style={styles.productSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Our Products</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            
            {products.length > 0 ? (
              <FlatList
                data={products}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={item => item.id.toString()}
                renderItem={renderProductItem}
                contentContainerStyle={styles.productList}
              />
            ) : (
              <View style={styles.emptyProductsContainer}>
                <FontAwesome name="shopping-basket" size={50} color="#ccc" />
                <Text style={styles.emptyProductsText}>No products available</Text>
              </View>
            )}
          </View>
          
          {/* Testimonials Section */}
          <View style={styles.testimonialSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Client Testimonials</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>More Testimonials</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={testimonials}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => item.id}
              renderItem={renderTestimonialItem}
              contentContainerStyle={styles.testimonialList}
              snapToInterval={Math.min(width - 64, 300) + 14} // Responsive width + margin
              decelerationRate="fast"
              snapToAlignment="center"
            />
          </View>

          {/* Blog Section (Horizontal) */}
          <View style={styles.blogSection}>
            <View style={styles.blogHeader}>
              <View style={styles.blogHeaderTitles}>
                <Text style={styles.blogHeaderTitle}>Featured Blogs</Text>
                <Text style={styles.blogHeaderSubtitle}>
                  News From The Blog
                </Text>
              </View>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={blogPosts}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => item.id}
              renderItem={renderBlogItem}
              contentContainerStyle={styles.blogListHorizontal}
              snapToInterval={Math.min(width * 0.6, 220) + 12} // Responsive width + margin
              decelerationRate="fast"
            />
          </View>

          {/* Add additional content as needed */}
          <View style={{height: 80}}>{/* Space for bottom tabs */}</View>
        </ScrollView>

        {/* Bottom Tab Navigation */}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5', // Softer background for neumorphic design
  },
  safeArea: {
    flex: 1,
    paddingTop: 16, // Added top margin for safe area
    marginTop: 8, // Additional margin at the top
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
    paddingHorizontal: 12,
    height: 56,
    position: 'relative',
    backgroundColor: '#f0f2f5',
    borderRadius: 16,
    shadowColor: '#fff',
    shadowOffset: {width: -8, height: -8},
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 10,
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
    backgroundColor: '#f0f2f5',
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#b8b9be',
    shadowOffset: {width: 8, height: 8},
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FF6347',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    shadowColor: '#000',
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  carouselContainer: {
    marginVertical: 16,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#b8b9be',
    shadowOffset: {width: 8, height: 8},
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 10,
    marginHorizontal: 16,
  },
  carouselItem: {
    width,
    height: 200,
  },
  carouselImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#f0f2f5',
    marginHorizontal: 6,
    shadowColor: '#b8b9be',
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#ffffff50',
  },
  paginationDotActive: {
    backgroundColor: '#007BFF',
    width: 14,
    height: 14,
    borderRadius: 7,
    shadowColor: '#b8b9be',
    shadowOffset: {width: 3, height: 3},
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 3,
  },
  productSection: {
    marginVertical: 18,
    marginHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    marginBottom: 14,
    paddingVertical: 10,
    backgroundColor: '#f0f2f5',
    borderRadius: 14,
    shadowColor: '#b8b9be',
    shadowOffset: {width: 4, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#ffffff50',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAllText: {
    fontSize: 14,
    color: '#007BFF',
    fontWeight: '600',
  },
  productList: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 8,
  },
  productItem: {
    width: width * 0.3, // Make width responsive (30% of screen width)
    maxWidth: 130, // Maximum width
    height: 290, // Increased height to fit the add to cart button
    marginRight: 12,
    marginBottom: 10,
    backgroundColor: '#f0f2f5',
    borderRadius: 14,
    padding: 8,
    shadowColor: '#b8b9be',
    shadowOffset: {width: 5, height: 5},
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#ffffff50',
    justifyContent: 'flex-start', // Changed to flex-start for better layout control
  },
  productImage: {
    width: '92%',
    height: 80, // Further reduced height to make more room
    borderRadius: 10,
    marginBottom: 6,
    shadowColor: '#b8b9be',
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
    alignSelf: 'center',
    marginTop: 4, // Added margin-top for better spacing
    marginTop: 4,
  },
  productName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2, // Reduced margin
    height: 30, // Reduced fixed height for text
    marginTop: 2,
    numberOfLines: 2, // Ensure text doesn't exceed 2 lines
  },
  productPrice: {
    fontSize: 13,
    color: '#007BFF',
    fontWeight: '700',
    marginBottom: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: 'rgba(230, 240, 255, 0.7)',
    borderRadius: 8,
    alignSelf: 'flex-start',
    overflow: 'visible',
  },
  productDiscount: {
    fontSize: 10,
    color: '#888',
    textDecorationLine: 'line-through',
    marginLeft: 4,
  },
  productRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4, // Reduced
    marginTop: 6, // Increased
  },
  addToCartButton: {
    backgroundColor: '#f0f2f5',
    borderRadius: 10,
    paddingVertical: 6,
    alignItems: 'center',
    shadowColor: '#b8b9be',
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#ffffff50',
    marginHorizontal: 2,
    marginTop: 15, // Further increased margin to prevent overlapping
    position: 'absolute', // Position at bottom
    bottom: 10, // Increased bottom margin
    left: 8,
    right: 8,
  },
  addToCartText: {
    color: '#007BFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  // Testimonial Section Styles
  testimonialSection: {
    marginVertical: 16,
    marginHorizontal: 16,
  },
  testimonialList: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  testimonialItem: {
    width: Math.min(width - 64, 300), // Responsive width with max width
    marginRight: 14,
    backgroundColor: '#f0f2f5',
    borderRadius: 18,
    shadowColor: '#b8b9be',
    shadowOffset: {width: 6, height: 6},
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ffffff50',
  },
  testimonialContent: {
    padding: 24,
  },
  quoteIcon: {
    marginBottom: 12,
    opacity: 0.7,
  },
  testimonialText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
    marginBottom: 16,
    fontStyle: 'italic',
  },
  testimonialAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 16,
  },
  testimonialAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  testimonialAuthorInfo: {
    flex: 1,
  },
  testimonialName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  testimonialLocation: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  // Blog Section Styles (Horizontal)
  blogSection: {
    marginVertical: 24,
    marginHorizontal: 16,
  },
  blogHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 12,
    backgroundColor: '#f0f2f5',
    borderRadius: 16,
    shadowColor: '#b8b9be',
    shadowOffset: {width: 4, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#ffffff50',
  },
  blogHeaderTitles: {
    flex: 1,
  },
  blogHeaderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  blogHeaderSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  blogDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
    paddingHorizontal: 16,
  },
  blogListHorizontal: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  blogItemHorizontal: {
    width: Math.min(width * 0.6, 220), // 60% of screen width with max of 220px
    marginRight: 12,
    backgroundColor: '#f0f2f5',
    borderRadius: 16,
    shadowColor: '#b8b9be',
    shadowOffset: {width: 6, height: 6},
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ffffff50',
  },
  blogImageHorizontal: {
    width: '100%',
    height: 130, // Reduced from 140
    resizeMode: 'cover',
  },
  blogContentHorizontal: {
    padding: 16,
  },
  blogCategoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 6,
  },
  blogCategory: {
    fontSize: 12,
    color: '#007BFF',
    fontWeight: '500',
    marginRight: 8,
    marginBottom: 4,
  },
  blogTitleHorizontal: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
    height: 40, // Fixed height for 2 lines
  },
  blogDate: {
    fontSize: 12,
    color: '#888',
    marginBottom: 10,
    fontStyle: 'italic',
  },
  readMoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readMoreText: {
    fontSize: 14,
    color: '#007BFF',
    fontWeight: '500',
    marginRight: 4,
  },
  readMoreIcon: {
    marginTop: 1,
  },
  bottomTabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    height: 60,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 2,
    color: '#888',
  },
  activeTabLabel: {
    color: '#007BFF',
    fontWeight: '500',
  },
  center: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  list: {padding: 16},
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 16,
    padding: 12,
    alignItems: 'center',
    elevation: 2,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 16,
    backgroundColor: '#eee',
  },
  info: {flex: 1},
  title: {fontSize: 16, fontWeight: 'bold', marginBottom: 4},
  price: {color: '#007AFF', fontWeight: 'bold'},
  featuredCard: {
    width: FEATURED_CARD_WIDTH,
    height: FEATURED_CARD_HEIGHT + 50, // Increased height to ensure no overlapping
    backgroundColor: '#f0f2f5',
    borderRadius: 18,
    marginRight: 16,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#b8b9be',
    shadowOffset: {width: 8, height: 8},
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 10,
    justifyContent: 'flex-start', // Changed to flex-start for better control
    position: 'relative',
    borderWidth: 1,
    borderColor: '#ffffff50',
  },
  featuredImage: {
    width: '95%',
    aspectRatio: 1,
    borderRadius: 14,
    marginBottom: 5, // Reduced margin
    backgroundColor: '#f0f2f5',
    resizeMode: 'contain',
    shadowColor: '#b8b9be',
    shadowOffset: {width: 4, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  featuredInfo: {
    alignItems: 'center',
    width: '100%',
    marginVertical: 6,
    flex: 0, // Changed from 1 to prevent stretching
  },
  featuredTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
    marginBottom: 6,
    minHeight: 36,
  },
  featuredSubtitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 4,
    minHeight: 16,
  },
  featuredRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  featuredRatingText: {
    fontSize: 12,
    color: '#888',
    marginLeft: 4,
    fontWeight: '500',
  },
  featuredPriceTag: {
    backgroundColor: '#e6f0ff',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 3,
    alignSelf: 'center',
    marginBottom: 8,
    shadowColor: '#b8b9be',
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
    zIndex: 1,
  },
  featuredPrice: {
    color: '#007AFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
  featuredAddToCartButton: {
    backgroundColor: '#f0f2f5',
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#b8b9be',
    shadowOffset: {width: 4, height: 4},
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#ffffff50',
    marginTop: 8, // Increased margin to prevent overlapping
  },
  featuredAddToCartText: {
    color: '#007BFF',
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  goToCartButton: {
    backgroundColor: '#f0f2f5',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 24,
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: '#ffffff50',
    shadowColor: '#b8b9be',
    shadowOffset: {width: 4, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  goToCartButtonText: {
    color: '#007BFF',
    fontSize: 15,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  // Add e-commerce specific styles
  badgeContainer: {
    position: 'absolute',
    top: 5,
    left: 5,
    zIndex: 2,
  },
  saleBadge: {
    backgroundColor: '#FF6347',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    shadowColor: '#000',
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  newBadge: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    shadowColor: '#000',
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    marginRight: 12,
    shadowColor: '#b8b9be',
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  retryButton: {
    backgroundColor: '#007BFF',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyProductsContainer: {
    backgroundColor: '#f0f2f5',
    borderRadius: 14,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    height: 250,
    shadowColor: '#b8b9be',
    shadowOffset: {width: 6, height: 6},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#ffffff50',
  },
  emptyProductsText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    marginBottom: 10,
  },
});

export default Home;
