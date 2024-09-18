import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { auth } from '../../config/Firebase';
import { getDatabase, ref, onValue, push, serverTimestamp } from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onAuthStateChanged } from 'firebase/auth';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const Community = () => {
  const navigation=useNavigation()

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const userInfo = await AsyncStorage.getItem('@user');
        if (userInfo) {
          const parsedUser = JSON.parse(userInfo);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error("Error retrieving user from AsyncStorage:", error);
      }
    };

    getUserInfo();

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        await AsyncStorage.setItem('@user', JSON.stringify(firebaseUser));
      } else {
        console.log('User not logged in');
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      const messagesRef = ref(getDatabase(), 'messages');
      const unsubscribe = onValue(messagesRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const messageList = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setMessages(messageList.reverse());
        }
      });

      return () => unsubscribe();
    }
  }, [user]);
  const sendMessage = () => {
    if (newMessage.trim() && user) {
      const messagesRef = ref(getDatabase(), 'messages');
      push(messagesRef, {
        text: newMessage,
        userId: user.uid,
        userName: user.displayName || user.email,
        timestamp: serverTimestamp(),
      });
      setNewMessage('');
    }
  };

  const defaultuserpp= "../../assets/app_images/avatar/kemal.jpeg";

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={{flexDirection:'row', margin:20, height:40,width:'100%',gap:20,marginTop:40}}>
        <View style={{height:40,width:40,borderRadius:50,alignItems:'center',justifyContent:'center',backgroundColor:'rgba(173,216,280,0.8)'}}>
          <TouchableOpacity onPress={()=>navigation.goBack()}>
            <Icon name="arrow-back" size={40} color="white" style={styles.icon} />
          </TouchableOpacity>
        </View>
        <Text style={{fontSize:20}}>Welcome to the community!</Text>
      </View>
      
      <FlatList data={messages} renderItem={({ item }) => (
        <View style={styles.messageContainer}>
          <Image
            source={require(defaultuserpp)}
            style={{height:50,width:50,borderRadius:50,marginVertical:10}}
          />
          <View style={{height:'auto', width:"80%",borderRadius:20,padding:10,backgroundColor:'rgb(255,255,255)'}}>
            <Text style={styles.userName}>{item.userName}</Text>
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
          
        </View>
      )} keyExtractor={(item) => item.id} inverted />
      <View style={styles.inputContainer}>
        <TextInput style={styles.input} value={newMessage} onChangeText={setNewMessage} placeholder="Type a message..." />
        <TouchableOpacity style={styles.sendButton} onPress={()=>sendMessage()}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  messageContainer: {
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 10,
    gap:10,
    flexDirection:'row',
  },
  userName: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: 'white',
  },
  input: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#1877f2',
    padding: 10,
    borderRadius: 10,
    justifyContent: 'center',
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Community;
