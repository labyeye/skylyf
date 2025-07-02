import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { CartProvider } from './src/CartContext';

const App = () => {
  return (
    <CartProvider>
      <AppNavigator />
    </CartProvider>
  );
};

export default App;
