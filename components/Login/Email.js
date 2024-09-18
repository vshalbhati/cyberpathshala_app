import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../../config/Firebase';
import { useDispatch } from 'react-redux';
import { setIsUserPresent } from '../../slices/isUserPres';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Email = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      dispatch(setIsUserPresent(true));
      navigation.navigate('community');
    } catch (error) {
      setError('Failed to log in. Please check your email and password.');
      console.error('Error during login:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
        <View style={{height:40,width:40,borderRadius:50,alignItems:'center',justifyContent:'center',backgroundColor:'rgba(173,216,280,0.8)',margin:20,marginTop:40}}>
            <TouchableOpacity onPress={()=>navigation.goBack()}>
                <Icon name="arrow-back" size={40} color="white" style={styles.icon}/>
            </TouchableOpacity>
        </View>  
      <View style={styles.container}>
        <Text style={styles.title}>Log in with Email</Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('register')}>
          <Text style={styles.registerText}>New user? Register here</Text>
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
    justifyContent: 'center',
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#1877f2',
    padding: 14,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  registerText: {
    color: '#1877f2',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default Email;