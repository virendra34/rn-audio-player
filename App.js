import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './app/navigation/AppNavigator';
import AudioProvider from './app/context/AudioProvider';
import ThemeProvider from './app/context/ThemeProvider';
import AudioListItem from './app/components/AudioListItem';
import { View } from 'react-native';


export default function App() {
  // return <View style={{marginTop:50}}>
  //   <AudioListItem />
  // </View>
  // return <React.StrictMode>
    return <AudioProvider>
      <ThemeProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </ThemeProvider>
    </AudioProvider>
  // </React.StrictMode>
}