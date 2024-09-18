import { useState, useEffect} from 'react';
import Login from './Login/Login';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import OTP from './Login/OTP';
import Userinfo from './Login/Userinfo';
import Community from './Community/Community';
import Email from './Login/Email';
import Register from './Login/Register';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Homepage from './Homepage/Homepage';
import Userprofile from './User/Userprofile';
import Courseinfo from './Course/Courseinfo';
import Coursecost from './Course/Coursecost';


const Stack = createNativeStackNavigator();

export default function Routings() {

  // const [user, setUser] = useState(null);
  return (
    <NavigationContainer>
      {/* {(user)?( */}
      {/* ):( */}
          <Stack.Navigator>
            <Stack.Screen name="Home" component={Homepage} options={{ headerShown: false }}/>
            <Stack.Screen name="userprofile" component={Userprofile} options={{ headerShown: false }}/>
            <Stack.Screen name="courseinfo" component={Courseinfo} options={{ headerShown: false }}/>
            <Stack.Screen name="coursecost" component={Coursecost} options={{ headerShown: false }}/>

            <Stack.Screen name="login" component={Login} options={{ headerShown: false }}/>
            <Stack.Screen name="otp" component={OTP} options={{ headerShown: false }}/>
            <Stack.Screen name="userinfo" component={Userinfo} options={{ headerShown: false }}/>
            <Stack.Screen name="email" component={Email} options={{ headerShown: false }}/>
            <Stack.Screen name="register" component={Register} options={{ headerShown: false }}/>
            <Stack.Screen name="community" component={Community} options={{ headerShown: false }}/>

          </Stack.Navigator>
      {/* )} */}
        
    </NavigationContainer>
  )
}
// exp://192.168.171.210:8081