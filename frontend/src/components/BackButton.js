import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

const BackButton = ({ style, color = '#333' }) => {
  const navigation = useNavigation();
  
  return (
    <TouchableOpacity 
      style={[styles.backButton, style]} 
      onPress={() => navigation.goBack()}
    >
      <FontAwesome name="arrow-left" size={20} color={color} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f2f5',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#b8b9be',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#ffffff50',
  }
});

export default BackButton;
