import * as React from 'react'
import { Dimensions } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'

// import Menu from '../components/Menu'
// import About from '../components/About'
// import Home from '../components/Home'
// import Player from '../components/Player'
// import Insight from '../components/Insight'
// import Profile from '../components/Profile'

import * as RootNavigation from '../navigation/RootNavigation'
import {HomeScreen} from '../views/home/Home'
import { InsightScreen } from '../views/insight/Insight'
import Icon from 'react-native-dynamic-vector-icons'
import About from '../views/sidemenus/about/About'
import MenuBlock from '../views/sidemenus/menu/menu'
import Profile from '../views/sidemenus/profile/Profile'

const Stack = createStackNavigator()
const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName='Show'
      screenOptions={{
        headerStyle: {
          backgroundColor: '#333333',
        },
        headerTintColor: '#fff',
        headerRight: () => (
          <Icon
            name='md-menu'
            style={{ paddingRight: 5 }}
            size={40}
            color='white'
            type = {'Ionicons'}
            onPress={() => {RootNavigation.navigate('Menu',null)}}
          />
        ),
      }}
    >
      <Stack.Screen name='Show' component={HomeScreen} />
      <Stack.Screen name='Insight' component={InsightScreen} />
      <Stack.Screen name = 'About' component={About} /> 
      <Stack.Screen name ='Menu' component={MenuBlock} />
      <Stack.Screen name='Profile' component={Profile} />
    </Stack.Navigator>
  )
}

// AuthNavigator.propTypes = {}
// AuthNavigator.defaultProps = {}

export default AppNavigator