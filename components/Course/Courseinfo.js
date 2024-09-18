import { StyleSheet, Text, View, Image,TouchableOpacity, ScrollView} from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { Video } from 'expo-av';

const Courseinfo = ({route}) => {
  const navigation=useNavigation();

  const {topic, image,description,arr} = route.params;
  const [benefitarr, setbenefitarr] = useState([])
  const [videoarray, setvideoarray]= useState([])

  const videoRefs = useRef([]);

  useEffect(() => {
    setvideoarray(arr.videos);
  }, [arr]);

  // console.log(arr)
  
  useEffect(() => {
    setbenefitarr(arr.benefits)
  }, []);

  const playFullScreen = (index) => {
    if (videoRefs.current[index]) {
      videoRefs.current[index].presentFullscreenPlayer();
    }
  };
  return (
    <ScrollView style={{flex:1}}>
      <View style={{height:40,width:40,borderRadius:50,alignItems:'center',justifyContent:'center',backgroundColor:'rgba(173,216,280,0.5)',margin:20,marginTop:40,position:'absolute',zIndex:9999}}>
        <TouchableOpacity onPress={()=>navigation.goBack()}>
          <Icon name="arrow-back" size={40} color="white" style={styles.icon}/>
        </TouchableOpacity>
      </View>
      <Image
        source={{uri:image}}
        style={{width: "100%", height: 300}}
      />
      <Text style={{margin:10,marginLeft:20,fontSize:30}}>{topic}</Text>
      <Text style={{margin:10,marginLeft:20,fontSize:20}}>About the course</Text>
      <Text style={{margin:10,marginLeft:20,fontSize:15}}>{description}</Text>


      <View>
        <Text style={{margin:10,marginLeft:20,fontSize:20}}>Course Benefits</Text>
        {
          benefitarr.map((item,index)=>{
            return(
              <Text key ={index} style={{margin:10,marginLeft:20,fontSize:15}}>{'\u25CF'} {item}</Text>
            )
          })
        }
        
      </View>

      <View>
        <Text style={{margin:10,marginLeft:20,fontSize:20}}>Course Duration</Text>
        <Text style={{margin:8,marginLeft:20,fontSize:18}}>{arr.Duration}</Text>
      </View>

      <View>
        <Text style={{margin:10,marginLeft:20,fontSize:20}}>Course Content</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap:10,padding:10,marginRight:20,alignSelf:'center'}}>
        {videoarray?(
            videoarray.map((item, index) => (
              <TouchableOpacity key={index} style={styles.contentdabba} onPress={() => playFullScreen(index)}>
                <Video
                  ref={(videoElement) => (videoRefs.current[index] = videoElement)}
                  source={{ uri: item.videoFile.asset.url }}
                  rate={1.0}
                  volume={1.0}
                  isMuted={false}
                  resizeMode="contain"
                  shouldPlay={false}
                  isLooping={false}
                  style={styles.video}
                />
              </TouchableOpacity>
            ))
        ):(
          <Text>No Content available</Text>
        )
        }
        </ScrollView>
      </View>
      

      <TouchableOpacity style={styles.enrollbtn} 
        onPress={()=>navigation.navigate('coursecost',{topic:topic})}>
        <Text style={{textAlign:'center',fontSize:20}}>
          Enroll
        </Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

export default Courseinfo

const styles = StyleSheet.create({
  enrollbtn:{
    backgroundColor:'rgba(173,216,280,0.8)',
    height:40,
    width:"90%",
    borderRadius:30,
    alignSelf:'center',
    margin:20,
    justifyContent:'center'
  },
  contentdabba:{
    justifyContent:'center',
    alignItems:'center',
    height:100,
    width:170,
    borderRadius:20,
  },
  video: {
    width: '100%',
    height: "100%",
    marginTop: 10,
    borderRadius:20,
  },
})