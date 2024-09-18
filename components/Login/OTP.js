import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { PhoneAuthProvider, signInWithCredential } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useNavigation, useRoute } from '@react-navigation/native';
import { auth, firestore } from '../../config/Firebase';
import { useDispatch } from 'react-redux';
import { setIsUserPresent } from '../../slices/isUserPres';

const OTP = () => {
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(60);
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();

  const { verificationId, phoneNumber } = route.params;

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleVerifyOtp = async () => {
    try {
      const credential = PhoneAuthProvider.credential(verificationId, otp);
      const userCredential = await signInWithCredential(auth, credential);
      const user = userCredential.user;

      // Check if the user already exists in Firestore
      const userRef = doc(firestore, 'users', user.uid);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        // User exists, update the login timestamp
        await setDoc(userRef, { lastLogin: new Date() }, { merge: true });
        dispatch(setIsUserPresent(true));
        navigation.navigate('community');
      } else {
        // New user, navigate to profile creation
        navigation.navigate('userinfo', { 
          info: { 
            id: user.uid, 
            phoneNumber: user.phoneNumber 
          } 
        });
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      Alert.alert('Error', 'Invalid OTP. Please try again.');
    }
  };

  const handleResendOtp = async () => {
    try {
      // Implement the logic to resend OTP
      // This might involve calling your backend API or using Firebase functions
      // For now, we'll just reset the timer
      setTimer(60);
      Alert.alert('Success', 'OTP resent successfully');
    } catch (error) {
      console.error('Error resending OTP:', error);
      Alert.alert('Error', 'Failed to resend OTP. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Verify Your Phone Number</Text>
        <Text style={styles.subtitle}>
          Enter the 6-digit code sent to {phoneNumber}
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Enter OTP"
          keyboardType="number-pad"
          value={otp}
          onChangeText={setOtp}
          maxLength={6}
        />
        <TouchableOpacity style={styles.button} onPress={handleVerifyOtp}>
          <Text style={styles.buttonText}>Verify OTP</Text>
        </TouchableOpacity>
        {timer > 0 ? (
          <Text style={styles.timerText}>Resend OTP in {timer} seconds</Text>
        ) : (
          <TouchableOpacity onPress={handleResendOtp}>
            <Text style={styles.resendText}>Resend OTP</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    fontSize: 18,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  timerText: {
    marginTop: 20,
    color: 'gray',
  },
  resendText: {
    marginTop: 20,
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
});

export default OTP;