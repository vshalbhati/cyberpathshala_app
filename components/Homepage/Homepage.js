import { ScrollView, StyleSheet, Text, View, Image, TouchableOpacity, Animated, Dimensions, FlatList } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Navigation from '../DownNavigation/Navigation';
import { useNavigation } from '@react-navigation/native';
import { client } from '../../sanityClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window'); 

const Homepage = () => {
    const navigation=useNavigation()
    const [carouselimg, setCarouselImg] = useState([])
    const [carind, setcarind] = useState(0);
    const translateX = useRef(new Animated.Value(0)).current;
    const [selectedcategory, setselectedcategory] = useState(0)
    useEffect(() => {
        const interval = setInterval(() => {
          Animated.timing(translateX, {
            toValue: -(width),
            duration: 150, 
            useNativeDriver: true,
          }).start(() => {
            setcarind((prevIndex) => (prevIndex + 1) % carouselimg.length);
            translateX.setValue(width);
            Animated.timing(translateX, {
              toValue: 0,
              duration: 150,
              useNativeDriver: true,
            }).start();
          });
        }, 2000);
    
        return () => clearInterval(interval);
      }, [carouselimg.length, translateX]);

    const [subjectarr, setsubjectarr] = useState([])
    const [Topicarr, setTopicarr] = useState([])

    const [userName, setUsername] = useState("New User")
    const [profilepic, setProfilepic]= useState(null)
    const getUserFromStorage = async () => {
      try {
        const user = await AsyncStorage.getItem('@user');
          setUsername(JSON.parse(user).short_name)
          setProfilepic(JSON.parse(user).profilePic)
      } catch (error) {
        console.log('Error retrieving user data:', error);
      }
    };
  
    useEffect(() => {
      getUserFromStorage();
    }, []);

    const [firstTime, setFirstTime] = useState(true);
    const [num, setnum] = useState(0);
    const [trendingData, setTrendingData] = useState([])

    const fetchTrendingData = async () => {
        try {
          const data = await client.fetch(`*[_type == "courses"]{
                name, 
                image{asset->{url}},
                short_description,
                rating,
                benefits,
                Duration,
                "videos": videos[]->{
                  title,
                  videoFile{
                    asset->{
                      url
                    }
                  }}
            }`);
          setTrendingData(data);
        } catch (error) {
          console.error('Error fetching content:', error);
        }
      };
      const fetchcarouselimages = async () => {
        try {
          const data = await client.fetch(`*[_type == "carouselimg"]{
                ... image
                {... 
                    asset->
                    {
                    url
                    }}}`);
          setCarouselImg(data);
        } catch (error) {
          console.error('Error fetching content:', error);
        }
      };
      const fetchcategories = async () => {
        try {
          const data = await client.fetch(`*[_type == "categories"]{
          name,
          "subjects": subjects[]->{
            name,
            short_description,
            Duration,
            image{
              asset->{
                url
              }
            },
            rating,
            benefits,
            "videos": videos[]->{
              title,
              videoFile{
                asset->{
                  url
                }
              }
            }
          }
        }`);
          setsubjectarr(data);

        } catch (error) {
          console.error('Error fetching content:', error);
        }
      };

      useEffect(() => {
        if (subjectarr.length > 0) {
          setTopicarr(subjectarr[0].subjects);
        }
      }, [subjectarr]);

      useEffect(() => {
        fetchTrendingData();
        fetchcarouselimages();
        fetchcategories();
      }, []); 
    
  return (
    <View style={{ flex: 1 }}>
        <ScrollView className="Maindabba" style={{ flex: 1 ,marginVertical:10}}>
            <View style={{flexDirection: 'row', marginTop: 40, width: "100%"}}>
                <View style={{marginLeft: 22}}>
                    <Text style={{fontSize: 25}}> Hi, {userName}!</Text>
                    <Text style={{fontSize: 16, marginLeft: 7}}>
                        {firstTime ? "Let's continue your learning!" : "Explore the new courses and don't lag behind"}
                    </Text>
                </View>
                <TouchableOpacity onPress={()=>{navigation.navigate('userprofile')}} style={styles.icon}>
                  {(profilepic)?(
                    <Image
                      source={{ uri: profilepic }}
                      style={{height:40,width:40,borderRadius:50}}
                    />
                  ):(
                    <Icon name="person" size={40} color="black" />
                  )}
                </TouchableOpacity>
            </View>

            <View style={styles.carousel}>
                <Animated.View style={[styles.imageContainer, { transform: [{ translateX }] }]}>
                    <Image
                        source={{uri:carouselimg[carind]?.url}}
                        style={styles.carouselimage}
                        resizeMode="cover"
                    />   
                </Animated.View>                
            </View>

            <View style={{flexDirection:'row',width:"100%",justifyContent:'center',alignItems:'center',margin:10,gap:20,marginLeft:20}}>
                {
                    carouselimg.map((indix)=>{
                        return(
                            <View style={{height:10,width:10,borderRadius:50,
                                backgroundColor:(carouselimg.indexOf(indix)===carind)?"rgba(128,128,128,0.8)":"rgba(128,128,128,0.3)"
                            }} key={carouselimg.indexOf(indix)}></View>
                        )
                    })
                }
            </View>
            <View >
                <Text style={{fontSize: 20,marginLeft:20}}>Categories</Text>
                <ScrollView horizontal contentContainerStyle={styles.subjectoptions} showsHorizontalScrollIndicator={false}>
                    {subjectarr.map((subject,index) => {
                        return (
                            <TouchableOpacity key={index} 
                                style={[styles.subjectdabba,{
                                    backgroundColor:(index===selectedcategory)?'black':'rgb(255,255,255)'
                                  }]} 
                                onPress={() => {
                                  setnum(index);
                                  setTopicarr(subjectarr[index].subjects);
                                  setselectedcategory(index)
                                }}
                            >                                
                                <Text style={{color:(index===selectedcategory)?'rgb(255,255,255)':'black'}}>{subject.name}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>
            
            <View>
                <Text style={{fontSize: 20, margin: 10,marginLeft:20}}>Trending Courses</Text>
                <ScrollView horizontal contentContainerStyle={{flexDirection:'row',marginLeft:10,gap:20}} showsHorizontalScrollIndicator={false}>
                    {trendingData.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.trendingdabba}
                            onPress={() => navigation.navigate('courseinfo', {
                                topic: item.name, 
                                image: item.image.asset.url,
                                description:item.short_description,
                                arr:item
                            })}
                        >
                        <Image
                            source={{ uri: item.image.asset.url }}
                            style={{ height:130, width:130,borderRadius: 10,marginTop:25}}
                        />
                        <View style={{backgroundColor:"rgba(255,255,255,1)",width:"100%",height:40,justifyContent:'center',alignItems:'center',borderBottomLeftRadius:20,borderBottomRightRadius:20}}>
                          <Text>{item.name}</Text>
                        </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
            

            <View>
                <Text style={{fontSize: 20, margin: 10,marginLeft:20}}>Explore the category</Text>
                <ScrollView
                    contentContainerStyle={{
                        paddingBottom: 20,
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap:20,
                        marginLeft:20,
                    }}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                >
                    {Topicarr ? (
                        Topicarr.map((subject,index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.trendingdabba}
                            onPress={() => navigation.navigate('courseinfo', {
                                topic: subject.name, 
                                image: subject.image.asset.url,
                                description:subject.short_description,
                                arr:subject
                            })}
                        >
                            <Image
                                source={{uri:subject.image.asset.url}}
                                style={{height:130, width:130,borderRadius: 10,marginTop:25}}
                            />
                            <View style={{backgroundColor:"rgba(255,255,255,1)",width:"100%",height:40,justifyContent:'center',alignItems:'center',borderBottomLeftRadius:20,borderBottomRightRadius:20}}>
                                <Text>{subject.name}</Text>
                            </View>
                        </TouchableOpacity>
                        ))
                    ) : (
                        <Text>No courses available</Text>
                    )}
                </ScrollView>
            </View>

            <View style={styles.carousel}>
                <View style={styles.imageContainer}>
                    <Image
                        source={{uri:carouselimg[0]?.url}}
                        style={styles.carouselimage}
                        resizeMode="cover"
                    />   
                </View>                
            </View>
        </ScrollView>

        <View style={{position: 'absolute', bottom: 0, left: 0, right: 0}}>
            <Navigation />
        </View>
    </View>
  );
}

export default Homepage;

const styles = StyleSheet.create({
    usericon: {
        height: 30,
        width: 30,
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "flex-end",
    },
    carousel: {
        height: 220,
        width: "90%",
        justifyContent: "center",
        marginLeft: 22,
        marginTop: 10,
        borderRadius: 10,
        alignItems: 'center'
    },
    subjectdabba: {
        height: 30,
        width: 120,
        backgroundColor: "rgb(255,255,255)",
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor:'black',
        borderWidth:1,
        borderStyle:'solid'
    },
    subjectoptions: { 
        flexDirection: 'row',
        gap: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        paddingHorizontal: 20,
        height: 50,
        alignSelf:'center'
        
    },
    imageContainer: {
        height: "100%",
        width: "100%", 
        overflow: 'hidden', 
    },
    carouselimage: {
        height: "100%",
        width: "100%",
        borderRadius: 20
    },
    trendingdabba:{
      height: 180,
      width: 170,
      borderRadius: 20,
      backgroundColor: 'rgb(255,255,255)',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
      elevation:10,
    },
    icon:{
        flex:1, 
        justifyContent:'center',
        alignItems:'center',
        marginLeft:80
      },
});
