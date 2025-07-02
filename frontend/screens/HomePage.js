import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import axios from 'axios';
import { endpoints } from '../src/config/api';
import { useCart } from '../src/CartContext';

const { width } = Dimensions.get('window');
const FEATURED_CARD_WIDTH = width * 0.6; // 60% of screen width
const FEATURED_CARD_HEIGHT = FEATURED_CARD_WIDTH * 1.7; // smaller proportional height

// Sample data for the image carousel
const carouselImages = [
  { id: '1', uri: 'https://skylyf.com/wp-content/uploads/2025/02/SKYLYF-BUILDING-2.png' },
  { id: '2', uri: 'https://img1.wsimg.com/isteam/ip/bc9de112-5f52-4c10-9592-67271ffb75f3/SKYLYF.jpg/:/cr=t:0%25,l:0%25,w:100%25,h:100%25/rs=w:1240,cg:true' },
  { id: '3', uri: 'https://img1.wsimg.com/isteam/ip/bc9de112-5f52-4c10-9592-67271ffb75f3/PP.png' },
];

// Sample data for testimonials
const testimonials = [
  {
    id: '1',
    text: 'My experience with SKYLYF is outstanding. It\'s rare to find a company that genuinely invests in the success of its clients in the way that SKYLYF does. I wholeheartedly recommend SKYLYF to anyone in need of reliable paper cup machinery, quality paper cup raw materials, and essential spare parts for paper cup production. They have earned my highest recommendation',
    name: 'MANISH AGGARWAL',
    location: 'NEW DELHI',
    avatar: 'https://skylyf.com/wp-content/uploads/2025/01/skylyf_client.png',
  },
  {
    id: '2',
    text: 'Working with SKYLYF has completely transformed our production capabilities. Their machines are reliable and the customer support is exceptional.',
    name: 'RAJESH KUMAR',
    location: 'MUMBAI',
    avatar: 'https://i0.wp.com/skylyf.com/wp-content/uploads/2025/01/testimonial-2.jpg?resize=100,100',
  },
  {
    id: '3',
    text: 'As a new business owner, I was concerned about investing in machinery. SKYLYF guided me through every step and provided excellent training for my team.',
    name: 'PRIYA PATEL',
    location: 'AHMEDABAD',
    avatar: 'https://i0.wp.com/skylyf.com/wp-content/uploads/2025/01/testimonial-3.jpg?resize=100,100',
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
    image: 'https://skylyf.com/wp-content/uploads/2020/02/paper-cups-all-size-768x768.jpg',
  },
  {
    id: '2',
    title: 'HOW TO START PAPER CUP MANUFACTURING',
    date: 'February 7, 2020',
    featured: true,
    categories: ['Blog', 'Featured'],
    image: 'https://skylyf.com/wp-content/uploads/2020/02/HOW-TO-START-PAPER-CUP-MANUFACTURING-768x768.jpeg',
  },
  {
    id: '3',
    title: 'Paper Cup Making Machine',
    date: 'February 6, 2020',
    featured: true,
    categories: ['Blog', 'Branding', 'Featured'],
    image: 'https://skylyf.com/wp-content/uploads/2020/02/PAPER-CUP-WITH-LID-SKYLYF-e1739453813619-768x648.jpg',
  },
  {
    id: '4',
    title: 'Paper Cup Making Machine Project Report',
    date: 'February 6, 2020',
    featured: true,
    categories: ['Blog', 'Featured'],
    image: 'https://skylyf.com/wp-content/uploads/2020/02/PAPER-CUP-MAKING-MACHINE-PROJECT-REPORTK-768x768.jpeg',
  },
];

const Home = ({ navigation }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('home');
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  // Image carousel auto-scroll
  const [activeSlide, setActiveSlide] = useState(0);

  const { cartProducts, addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(endpoints.products);
        setProducts(res.data);
      } catch (error) {
        console.log('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prevSlide) =>
        prevSlide === carouselImages.length - 1 ? 0 : prevSlide + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleSearch = (text) => {
    setSearchTerm(text);
  };

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  const renderImageCarouselItem = ({ item }) => (
    <View style={styles.carouselItem}>
      <Image source={{ uri: item.uri }} style={styles.carouselImage} />
    </View>
  );

  const renderProductItem = ({ item }) => (
    <View style={styles.productItem}>
      <Image source={{ uri: item.uri }} style={styles.productImage} />
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productPrice}>{item.price}</Text>
      <TouchableOpacity style={styles.addToCartButton} onPress={() => handleAddToCart(item)}>
        <Text style={styles.addToCartText}>Add to Cart</Text>
      </TouchableOpacity>
    </View>
  );

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
  const renderTestimonialItem = ({ item }) => (
    <View style={styles.testimonialItem}>
      <View style={styles.testimonialContent}>
        <FontAwesome name="quote-left" size={24} color="#007BFF" style={styles.quoteIcon} />
        <Text style={styles.testimonialText}>{item.text}</Text>
        <View style={styles.testimonialAuthor}>
          <Image 
            source={{ uri: item.avatar }} 
            style={styles.testimonialAvatar}
          />
          <View style={styles.testimonialAuthorInfo}>
            <Text style={styles.testimonialName}>{item.name}</Text>
            <Text style={styles.testimonialLocation}>{item.location}</Text>
          </View>
        </View>
      </View>
    </View>
  );
  
  // Render blog post item (horizontal)
  const renderBlogItem = ({ item }) => (
    <TouchableOpacity style={styles.blogItemHorizontal}>
      <Image 
        source={{ uri: item.image }}
        style={styles.blogImageHorizontal}
      />
      <View style={styles.blogContentHorizontal}>
        <View style={styles.blogCategoriesContainer}>
          {item.categories.map((category, index) => (
            <Text key={index} style={styles.blogCategory}>
              {category}
            </Text>
          ))}
        </View>
        <Text style={styles.blogTitleHorizontal} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.blogDate}>posted on {item.date}</Text>
        <View style={styles.readMoreContainer}>
          <Text style={styles.readMoreText}>Read More</Text>
          <FontAwesome name="arrow-right" size={14} color="#007BFF" style={styles.readMoreIcon} />
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <FontAwesome name="search" size={20} color="#888" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search products..."
              value={searchTerm}
              onChangeText={handleSearch}
              placeholderTextColor="#888"
            />
            {/* Cart Icon */}
            <TouchableOpacity style={styles.cartIconContainer} onPress={() => navigation.navigate('Cart')}>
              <FontAwesome name="shopping-cart" size={24} color="#888" />
              {cartProducts.length > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{cartProducts.length}</Text>
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
              keyExtractor={(item) => item.id}
              renderItem={renderImageCarouselItem}
              onMomentumScrollEnd={(event) => {
                const slideIndex = Math.floor(
                  event.nativeEvent.contentOffset.x / width
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
              <TouchableOpacity>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={products}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                // Placeholder rating (out of 5)
                const rating = item.rating || 4.5;
                // Placeholder subtitle/description
                const subtitle = item.short_description || 'High quality, reliable performance.';
                return (
                  <View style={styles.featuredCard}>
                    <Image
                      source={{ uri: item.images?.[0]?.src || 'https://via.placeholder.com/200' }}
                      style={styles.featuredImage}
                    />
                    <View style={styles.featuredInfo}>
                      <Text style={styles.featuredTitle} numberOfLines={2}>{item.name}</Text>
                      <View style={styles.featuredRatingRow}>
                        {[1,2,3,4,5].map((star) => (
                          <FontAwesome
                            key={star}
                            name={rating >= star ? 'star' : rating >= star - 0.5 ? 'star-half-full' : 'star-o'}
                            size={16}
                            color="#FFD700"
                            style={{ marginRight: 2 }}
                          />
                        ))}
                        <Text style={styles.featuredRatingText}>{rating}</Text>
                      </View>
                      <View style={styles.featuredPriceTag}><Text style={styles.featuredPrice}>₹{item.price}</Text></View>
                    </View>
                    <TouchableOpacity style={styles.featuredAddToCartButton} onPress={() => handleAddToCart(item)}>
                      <Text style={styles.featuredAddToCartText}>Add to Cart</Text>
                    </TouchableOpacity>
                    
                  </View>
                );
              }}
              contentContainerStyle={styles.productList}
            />
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
              keyExtractor={(item) => item.id}
              renderItem={renderTestimonialItem}
              contentContainerStyle={styles.testimonialList}
              snapToInterval={width - 48} // For card snapping effect
              decelerationRate="fast"
              snapToAlignment="center"
            />
          </View>

          {/* Blog Section (Horizontal) */}
          <View style={styles.blogSection}>
            <View style={styles.blogHeader}>
              <View style={styles.blogHeaderTitles}>
                <Text style={styles.blogHeaderTitle}>Featured Blogs</Text>
                <Text style={styles.blogHeaderSubtitle}>News From The Blog</Text>
              </View>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={blogPosts}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              renderItem={renderBlogItem}
              contentContainerStyle={styles.blogListHorizontal}
              snapToInterval={width * 0.75} // For card snapping effect
              decelerationRate="fast"
            />
          </View>

          {/* Add additional content as needed */}
          <View style={{ height: 80 }} /> {/* Space for bottom tabs */}
        </ScrollView>

        {/* Bottom Tab Navigation */}
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
  carouselContainer: {
    marginVertical: 12,
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
    marginTop: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#007BFF',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  productSection: {
    marginVertical: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAllText: {
    fontSize: 14,
    color: '#007BFF',
  },
  productList: {
    paddingLeft: 16,
  },
  productItem: {
    width: 150,
    height: 280, // Fixed height to ensure equal size
    marginRight: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productImage: {
    width: '100%',
    height: 120,
    borderRadius: 6,
    marginBottom: 8,
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    color: '#007BFF',
    fontWeight: '500',
  },
  addToCartButton: {
    backgroundColor: '#007BFF',
    borderRadius: 8,
    paddingVertical: 6,
    marginTop: 'auto', // Ensures button stays at the bottom of the card
    alignItems: 'center',
  },
  addToCartText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  // Testimonial Section Styles
  testimonialSection: {
    marginVertical: 16,
  },
  testimonialList: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  testimonialItem: {
    width: width - 48, // Full width with padding
    marginRight: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    marginVertical: 8,
  },
  testimonialContent: {
    padding: 20,
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
    marginVertical: 20,
  },
  blogHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    marginBottom: 8,
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
  },
  blogItemHorizontal: {
    width: width * 0.7,
    marginRight: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  blogImageHorizontal: {
    width: '100%',
    height: 140,
    resizeMode: 'cover',
  },
  blogContentHorizontal: {
    padding: 12,
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
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { padding: 16 },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 16,
    padding: 12,
    alignItems: 'center',
    elevation: 2,
    
  },
  image: { width: 70, height: 70, borderRadius: 8, marginRight: 16, backgroundColor: '#eee' },
  info: { flex: 1 },
  title: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  price: { color: '#007AFF', fontWeight: 'bold' },
  featuredCard: {
    width: FEATURED_CARD_WIDTH,
    height: FEATURED_CARD_HEIGHT,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginRight: 18,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
    justifyContent: 'flex-start',
  },
  featuredImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    marginBottom: 14,
    backgroundColor: '#f0f0f0',
    resizeMode: 'contain',
  },
  featuredInfo: {
    alignItems: 'center',
    marginBottom: 12,
    flex: 1,
    width: '100%',
  },
  featuredTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
    marginBottom: 8,
    minHeight: 40,
  },
  featuredSubtitle: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    marginBottom: 6,
    minHeight: 18,
  },
  featuredRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  featuredRatingText: {
    fontSize: 13,
    color: '#888',
    marginLeft: 4,
    fontWeight: '500',
  },
  featuredPriceTag: {
    backgroundColor: '#e6f0ff',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'center',
    marginBottom: 4,
  },
  featuredPrice: {
    color: '#007AFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  featuredAddToCartButton: {
    backgroundColor: '#007BFF',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 24,
    alignItems: 'center',
    width: '100%',
    marginBottom: 8,
  },
  featuredAddToCartText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  goToCartButton: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 24,
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: '#007BFF',
  },
  goToCartButtonText: {
    color: '#007BFF',
    fontSize: 15,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});

export default Home;