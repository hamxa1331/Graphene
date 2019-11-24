/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable*/
import React from 'react'
import {createAppContainer,createStackNavigator} from 'react-navigation'
import ProviderLogin from '../screens/ProviderLogin'
import Splash from '../screens/Splash'
import homescreen from '../screens/homescreen'

const LoginStack = createStackNavigator({
    SplashScreen:Splash,
    ProviderLogin:ProviderLogin,
    HomeScreen:homescreen
},
{
    initialRouteName:'SplashScreen',
    headerMode:'none'
}
)
LoginStack.navigationOptions = ({navigation})=>{
    let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }
  return {
    tabBarVisible,
  };
}
export default createAppContainer(LoginStack)

