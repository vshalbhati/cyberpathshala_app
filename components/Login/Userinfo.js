import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { firestore } from '../../config/Firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { setUser } from '../../slices/userSlice';


const Userinfo = ({route}) => {
  const {info} = route.params;
  const navigation = useNavigation()
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [university, setUniversity] = useState('');
  const [professionalBackground, setProfessionalBackground] = useState('');
  const [experience, setExperience] = useState('');
  const [userId, setUserId] = useState('');
  const dispatch = useDispatch();
  // Function to retrieve user info from AsyncStorage (Google Sign-In)
  const getUserInfo = async () => {
    try {
      if (info) {
        setName(info.name); // Name from Google Sign-In
        setEmail(info.email); // Email from Google Sign-In
        setUserId(info.id); // User's unique Google ID
      }
    } catch (error) {
      console.log('Error retrieving user data:', error);
    }
  };

  // Save data to Firestore
  const saveUserInfo = async () => {
    if (!gender || !age || !university || !professionalBackground || !experience) {
      Alert.alert('Error', 'Please fill out all fields.');
      return;
    }

    try {

      await setDoc(doc(firestore, 'users', userId), {
        id:userId,
        name:name,
        short_name: info.given_name,
        email,
        gender,
        age,
        university,
        professionalBackground,
        experience,
      });

      const updatedUser = {
        userId,
        name:name,
        short_name:info.given_name,
        email,
        gender,
        age,
        university,
        professionalBackground,
        experience,
        picture: info.picture
      };
      
      await AsyncStorage.setItem('@user', JSON.stringify(updatedUser));
      dispatch(setUser({
        id:userId,
        name:info.name, 
        short_name:info.given_name,
        emailid:info.email, 
        profilePic:info.picture,
        age:age,
        gender:gender,
        university:university,
        professionalBackground:professionalBackground,
        experience:experience
      }))
      Alert.alert('Success', 'Your profile has been updated successfully!');
      navigation.navigate('community')
    } catch (error) {
      console.log('Error saving user data:', error);
      Alert.alert('Error', 'There was an error updating your profile.');
    }
  };

  useEffect(() => {
    getUserInfo(); // Fetch the user's info when the component mounts
  });

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Name</Text>
      <TextInput style={styles.input} value={info.name} editable={false} />

      <Text style={styles.label}>Email</Text>
      <TextInput style={styles.input} value={info.email} editable={false} />

      <Text style={styles.label}>Gender</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your gender"
        value={gender}
        onChangeText={setGender}
      />

      <Text style={styles.label}>Age</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your age"
        keyboardType="numeric"
        value={age}
        onChangeText={setAge}
      />

      <Text style={styles.label}>University</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter the name of your university"
        value={university}
        onChangeText={setUniversity}
      />

      <Text style={styles.label}>Professional Background</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your professional background"
        value={professionalBackground}
        onChangeText={setProfessionalBackground}
      />

      <Text style={styles.label}>Experience (in years)</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your experience"
        keyboardType="numeric"
        value={experience}
        onChangeText={setExperience}
      />

      <Button title="Save Profile" onPress={saveUserInfo} />
    </ScrollView>
  );
};

export default Userinfo;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
});
