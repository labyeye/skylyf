import React from 'react';
import { Text, StyleSheet, View, Image, ScrollView, SafeAreaView, TouchableOpacity, StatusBar } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const AboutPage = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#1a73e8" barStyle="light-content" />
      
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          accessible={true}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <FontAwesome name="arrow-left" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About SkyLyf</Text>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Company Banner */}
        <View style={styles.bannerContainer}>
          <Image 
            source={{ uri: 'https://skylyf.com/wp-content/uploads/2025/02/SKYLYF-BUILDING-2.png' }} 
            style={styles.bannerImage}
            resizeMode="cover"
            accessible={true}
            accessibilityLabel="SkyLyf company banner"
          />
          <View style={styles.bannerOverlay}>
            <Text style={styles.bannerText}>Excellence in Disposable Industry Innovation</Text>
          </View>
        </View>
        
        {/* Company Overview */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderContainer}>
            <FontAwesome name="building" size={20} color="#1a73e8" style={styles.sectionIcon} />
            <Text style={styles.sectionTitle}>Overview</Text>
          </View>
          <View style={styles.divider} />
          <Text style={styles.sectionText}>
            BAGCLUES EXIM PRIVATE LIMITED (BRAND: SKYLYF) is a part of the esteemed Kalahanu Group. Founded in the 1980s by the visionary Late Shri Hanuman Mal Bothra, the group initially focused on sales & distribution, logistics, warehousing, supply chain services, and industrial machinery products & services. Today, the group has annual sales exceeding Rs 1500 crores (US$ 177 Million) and a workforce of over 1700 people.
          </Text>
        </View>

        {/* Mission */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderContainer}>
            <FontAwesome name="flag" size={20} color="#1a73e8" style={styles.sectionIcon} />
            <Text style={styles.sectionTitle}>Our Mission</Text>
          </View>
          <View style={styles.divider} />
          <Text style={styles.sectionText}>
            Our Mission is to drive disposable industry innovation and technology advancements, continually enhancing our offerings to create more "Happy Customers." We are committed to delivering the best paper cup making machine and paper products, utilizing our skilled resources and expertise.
          </Text>
        </View>

        {/* Values */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderContainer}>
            <FontAwesome name="heart" size={20} color="#1a73e8" style={styles.sectionIcon} />
            <Text style={styles.sectionTitle}>Our Values</Text>
          </View>
          <View style={styles.divider} />
          <Text style={styles.sectionText}>
            At SKYLYF, we are committed to Teamwork, Customer Focus, Excellence, Integrity, and Efficiency. These values form the foundation of our long-term success, ensuring we deliver top-quality disposable machinery solutions while strengthening our relationship with clients and stakeholders.
          </Text>
          
          {/* Values Cards */}
          <View style={styles.valueCardsContainer}>
            <View style={styles.valueCard}>
              <FontAwesome name="users" size={24} color="#1a73e8" />
              <Text style={styles.valueCardTitle}>Teamwork</Text>
            </View>
            <View style={styles.valueCard}>
              <FontAwesome name="handshake-o" size={24} color="#1a73e8" />
              <Text style={styles.valueCardTitle}>Customer Focus</Text>
            </View>
            <View style={styles.valueCard}>
              <FontAwesome name="trophy" size={24} color="#1a73e8" />
              <Text style={styles.valueCardTitle}>Excellence</Text>
            </View>
            <View style={styles.valueCard}>
              <FontAwesome name="shield" size={24} color="#1a73e8" />
              <Text style={styles.valueCardTitle}>Integrity</Text>
            </View>
            <View style={styles.valueCard}>
              <FontAwesome name="bolt" size={24} color="#1a73e8" />
              <Text style={styles.valueCardTitle}>Efficiency</Text>
            </View>
          </View>
        </View>

        {/* Team */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderContainer}>
            <FontAwesome name="user-circle" size={20} color="#1a73e8" style={styles.sectionIcon} />
            <Text style={styles.sectionTitle}>Leadership Team</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.teamContainer}>
            <View style={styles.teamMember}>
              <View style={styles.teamMemberImageContainer}>
                <Image 
                  source={{ uri: 'https://skylyf.com/wp-content/uploads/2025/02/RAJ-KUMAR-BOTHRA.jpg' }} 
                  style={styles.teamMemberImage}
                  accessible={true}
                  accessibilityLabel="Raj Kumar Bothra profile picture"
                />
              </View>
              <Text style={styles.teamMemberName}>Raj Kumar Bothra</Text>
              <Text style={styles.teamMemberRole}>Founder</Text>
            </View>

            <View style={styles.teamMember}>
              <View style={styles.teamMemberImageContainer}>
                <Image 
                  source={{ uri: 'https://skylyf.com/wp-content/uploads/2021/12/paper-plane-icon-white.png' }} 
                  style={styles.teamMemberImage}
                  accessible={true}
                  accessibilityLabel="Sidharth Bothra profile picture"
                />
              </View>
              <Text style={styles.teamMemberName}>Sidharth Bothra</Text>
              <Text style={styles.teamMemberRole}>Co-Founder | CEO</Text>
            </View>

            <View style={styles.teamMember}>
              <View style={styles.teamMemberImageContainer}>
                <Image 
                  source={{ uri: 'https://skylyf.com/wp-content/uploads/2025/02/sankalp-jain.jpg' }} 
                  style={styles.teamMemberImage}
                  accessible={true}
                  accessibilityLabel="Sankalp Jain profile picture"
                />
              </View>
              <Text style={styles.teamMemberName}>Sankalp Jain</Text>
              <Text style={styles.teamMemberRole}>Co-Founder | CTO</Text>
            </View>
          </View>
        </View>

        {/* Company Stats */}
        {/* <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>1980s</Text>
            <Text style={styles.statLabel}>Founded</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>1700+</Text>
            <Text style={styles.statLabel}>Employees</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>₹1500 Cr</Text>
            <Text style={styles.statLabel}>Annual Sales</Text>
          </View>
        </View> */}
        
        {/* Footer
        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 SkyLyf - All Rights Reserved</Text>
        </View> */}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    backgroundColor: '#1a73e8',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    elevation: 4,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 20,
  },
  scrollView: {
    flex: 1,
  },
  bannerContainer: {
    position: 'relative',
    height: 180,
    marginBottom: 20,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 16,
  },
  bannerText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  section: {
    marginVertical: 10,
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 2,
  },
  sectionHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  sectionIcon: {
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  divider: {
    height: 2,
    backgroundColor: '#1a73e8',
    width: 50,
    marginVertical: 10,
  },
  sectionText: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
  },
  valueCardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  valueCard: {
    backgroundColor: '#f0f7ff',
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    width: '48%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueCardTitle: {
    marginTop: 8,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  teamContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  teamMember: {
    alignItems: 'center',
    marginBottom: 24,
    width: '30%',
  },
  teamMemberImageContainer: {
    backgroundColor: '#e8f0fe',
    borderRadius: 50,
    padding: 4,
    elevation: 3,
  },
  teamMemberImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    resizeMode: 'contain',
  },
  teamMemberName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 12,
    textAlign: 'center',
  },
  teamMemberRole: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#1a73e8',
    marginHorizontal: 16,
    marginVertical: 20,
    borderRadius: 10,
    padding: 20,
    elevation: 3,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    color: '#e1e9ff',
    marginTop: 4,
  },
  statDivider: {
    height: 40,
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  footer: {
    alignItems: 'center',
    marginVertical: 30,
    paddingBottom: 10,
  },
  footerText: {
    color: '#777',
    fontSize: 14,
  },
});

export default AboutPage;