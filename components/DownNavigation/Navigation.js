import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const Navigation = () => {
  const navigation=useNavigation()
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={()=>{navigation.navigate('Home')}} style={styles.icon}>
        <Icon name="home" size={40} color="black" />
      </TouchableOpacity>
      <TouchableOpacity onPress={()=>{navigation.navigate('community')}} style={styles.icon}>
        <Icon name="chat" size={40} color="black" />
      </TouchableOpacity>
      <TouchableOpacity onPress={()=>{navigation.navigate('userprofile')}} style={styles.icon}>
        <Icon name="person" size={40} color="black"/>
      </TouchableOpacity>

    </View>
  )
}

export default Navigation

const styles = StyleSheet.create({
    container:{
        flexDirection:'row',
        gap:30,
        backgroundColor:'rgb(255,255,255)',
        height:40,
        justifyContent:'center',
        alignItems:'center',
        borderTopRightRadius:20,
        borderTopLeftRadius:20
    },
    icon:{
      flex:1, 
      justifyContent:'center',
      alignItems:'center',
      elevation:5
    },
})