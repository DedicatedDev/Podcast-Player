import * as React from 'react'
import { Text, Image, View, Dimensions } from 'react-native'
//import { i } from 'react-native-vector-icons'
import { createStackNavigator } from '@react-navigation/stack'

// import Menu from '../components/Menu'
// import About from '../components/About'
// import Home from '../components/Home'
// import Player from '../components/Player'
// import Insight from '../components/Insight'
// import Profile from '../components/Profile'

import * as RootNavigation from '../navigation/RootNavigation'
import {HomeScreen} from '../views/home/Home'
import { Button } from 'react-native-paper'
import { InsightScreen } from '../views/insight/Insight'

const { width: DEVICE_WIDTH } = Dimensions.get('window')
const Stack = createStackNavigator()

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName='Inwoven'>
      <Stack.Screen name="Show" component={HomeScreen} />
      <Stack.Screen name="Insight" component={InsightScreen} />
    </Stack.Navigator>
  )
}

// AuthNavigator.propTypes = {}
// AuthNavigator.defaultProps = {}

export default AppNavigator