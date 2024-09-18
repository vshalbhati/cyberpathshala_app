import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, SafeAreaView } from 'react-native';
import {  PhoneAuthProvider, signInWithCredential } from 'firebase/auth';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { doc, getDoc } from 'firebase/firestore';
import { firestore, auth } from '../../config/Firebase'; 
import { useDispatch } from 'react-redux';
import { setIsUserPresent } from '../../slices/isUserPres';
import { setUser } from '../../slices/userSlice';
// import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
// import {  signInWithPhoneNumber, PhoneAuthState } from 'firebase/auth';

WebBrowser.maybeCompleteAuthSession();

const Login = () => {
  const [number, setNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [otp, setOtp] = useState('');
  const [verificationId, setVerificationId] = useState(null);
  const [error, setError] = useState('');
  const navigation = useNavigation();
  const [userInfo, setUserInfo] = React.useState(null);
  // const recaptchaVerifier = useRef(null);
  // const recaptchaVerifier = React.useRef(null);
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId:'231618173133-kqbero5lhi0l1e4ipgsk9hdmj5shf06b.apps.googleusercontent.com',
    androidClientId: '231618173133-8e6b7f1sum225bjqahsm3dqn6nimhm4i.apps.googleusercontent.com',
    webClientId:'231618173133-mqs25ikdaktdh77t508of2j3ear0l63k.apps.googleusercontent.com'
  });

  React.useEffect(() => {
    if (response?.type === 'success') {
      handleGoogleSignIn(response.authentication.accessToken);
    }
  }, [response]);

  React.useEffect(() => {
    async function checkUser() {
      const user = await AsyncStorage.getItem('@user');
      if (user) {
        setUserInfo(JSON.parse(user));
      }
    }
    checkUser();
  }, []);

  const handleGoogleSignIn = async (token) => {
  
    if (!token) return;
  
    try {
      const response = await fetch('https://www.googleapis.com/userinfo/v2/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user = await response.json();
  
      const userRef = doc(firestore, 'users', user.id);
      const docSnapshot = await getDoc(userRef);
  
      // if (docSnapshot.exists()) {
      //   dispatch(setIsUserPresent(true));
      // } else {
        navigation.navigate('userinfo', { info: user });
      // }
    } catch (error) {
      console.error('Error checking user in Firestore:', error);
    }
  };

  const sendOTP = async () => {
    // try {
    //   const phoneNumber= countryCode +  number;
    //   console.log(phoneNumber)
    //   const phoneProvider = new PhoneAuthProvider(auth);
    //   const verificationId = await phoneProvider.verifyPhoneNumber(
    //     phoneNumber,
    //     recaptchaVerifier.current
    //   );
    //   setVerificationId(verificationId);
    //   console.log('OTP sent on ',phoneNumber);
    //   navigation.navigate('otp', { verificationId,phoneNumber });
    // } catch (error) {
    //   console.log('Error sending OTP', error);
    // }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={auth.app.options}
      /> */}
      <Image
        source={require('../../assets/app_images/home_card_top_1.jpg')}
        style={{ height: '55%', width: '100%' }}
      />
      <View style={styles.container}>
        <Text style={styles.title}>Hello, student! Let's log you in.</Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <TextInput
            style={[styles.input, { width: '18%' }]}
            placeholder="+91"
            value={countryCode}
            onChangeText={setCountryCode}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            keyboardType="phone-pad"
            value={number}
            onChangeText={setNumber}
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={sendOTP}>
          <Text style={styles.buttonText}>Request OTP</Text>
        </TouchableOpacity>
        <Text style={styles.orText}>OR</Text>
        <TouchableOpacity style={styles.googleButton} onPress={()=>promptAsync()}>
          <Icon name="person" size={30} color="black" />
          <Text style={styles.googleButtonText}>Log In with Google</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.googleButton} onPress={()=>navigation.navigate('email')}>
          <Icon name="email" size={30} color="black" />
          <Text style={styles.googleButtonText}>Log In with Email</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    width: '80%',
  },
  button: {
    backgroundColor: '#1877f2',
    padding: 14,
    borderRadius: 8,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    margin:10
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
  orText: {
    textAlign: 'center',
    marginVertical: 10,
  },
  googleButton: {
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 8,
    borderWidth:1,
    borderStyle:'solid',
    borderColor:'#1877f2',
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    gap:40,
    margin:10
  },
  googleButtonText: {
    color: '#1877f2',
    textAlign: 'center',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default Login;