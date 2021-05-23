/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import * as React from 'react';
import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { navigationRef } from './src/navigation/RootNavigation';
import AppNavigator from './src/navigation/AppNavigator';
import { AppContextProvider, useAppContextStore } from './src/context/AppContext'
import { MediaPlayer } from './src/views/mediaPlayer/MediaPlayer';
import { PlayerContextProvider } from './src/views/mediaPlayer/MediaPlayerContext';
import * as Keychain from 'react-native-keychain'
import { useEffect, useState } from 'react';
import LoginScreen from './src/views/auth/Login';
const Stack = createStackNavigator();
const App = () => {
  const [isLogin, setIsLogin] = useState<boolean>(false)
  useEffect(() => {
    const checkToken = async () => {
      try {
        const credentials = await Keychain.getInternetCredentials("adyen.thomasjacobs.dev");
        if (credentials) {
          console.log('token is successfully loaded');
          console.log(credentials)
          setIsLogin(true);
        } else {
          setIsLogin(false);
          console.log('user did not login')
        }
      } catch (error) {
        console.log(error);
      }
    }
    checkToken()
  })

  const checkToken = () => {
    console.log(isLogin)
    if (isLogin) {
      return (
        <AppContextProvider>
          <AppNavigator />
          <PlayerContextProvider>
            <MediaPlayer />
          </PlayerContextProvider>
        </AppContextProvider>)
    } else {
      return (<LoginScreen></LoginScreen>)
    }
  }
  return (
    <NavigationContainer ref={navigationRef} theme={DarkTheme}>
      {checkToken()}
    </NavigationContainer>
  );
};
export default App;

// import {
//   SafeAreaView,
//   ScrollView,
//   StatusBar,
//   StyleSheet,
//   Text,
//   useColorScheme,
//   View,
// } from 'react-native';

// import {
//   Colors,
//   DebugInstructions,
//   Header,
//   LearnMoreLinks,
//   ReloadInstructions,
// } from 'react-native/Libraries/NewAppScreen';

// import { NavigationContainer } from '@react-navigation/native';

// const Section = ({children, title}) => {
//   const isDarkMode = useColorScheme() === 'dark';
//   return (
//     <View style={styles.sectionContainer}>
//       <Text
//         style={[
//           styles.sectionTitle,
//           {
//             color: isDarkMode ? Colors.white : Colors.black,
//           },
//         ]}>
//         {title}
//       </Text>
//       <Text
//         style={[
//           styles.sectionDescription,
//           {
//             color: isDarkMode ? Colors.light : Colors.dark,
//           },
//         ]}>
//         {children}
//       </Text>
//     </View>
//   );
// };

// const App = () => {
//   const isDarkMode = useColorScheme() === 'dark';
//   const backgroundStyle = {
//     backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
//   };

//   return (
//     <SafeAreaView style={backgroundStyle}>
//       <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
//       <ScrollView
//         contentInsetAdjustmentBehavior="automatic"
//         style={backgroundStyle}>
//         <Header />
//         <View
//           style={{
//             backgroundColor: isDarkMode ? Colors.black : Colors.white,
//           }}>
//           <Section title="Step One">
//             Edit <Text style={styles.highlight}>App.js</Text> to change this
//             screen and then come back to see your edits.
//           </Section>
//           <Section title="See Your Changes">
//             <ReloadInstructions />
//           </Section>
//           <Section title="Debug">
//             <DebugInstructions />
//           </Section>
//           <Section title="Learn More">
//             Read the docs to discover what to do next:
//           </Section>
//           <LearnMoreLinks />
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   sectionContainer: {
//     marginTop: 32,
//     paddingHorizontal: 24,
//   },
//   sectionTitle: {
//     fontSize: 24,
//     fontWeight: '600',
//   },
//   sectionDescription: {
//     marginTop: 8,
//     fontSize: 18,
//     fontWeight: '400',
//   },
//   highlight: {
//     fontWeight: '700',
//   },
// });

// export default App;
