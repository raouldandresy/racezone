import React from 'react';
import TabNavigator from './src/navigation/tabNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DriversProvider } from './src/context/DrivesContext';

export default function App() {
  return (
    <SafeAreaProvider>
       <DriversProvider>
         <TabNavigator/>
       </DriversProvider>
    </SafeAreaProvider>
  );
}
