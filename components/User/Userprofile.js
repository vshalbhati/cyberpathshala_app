import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View,Image, ScrollView } from 'react-native'
import React,{useState, useEffect} from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDoc, doc } from 'firebase/firestore';
import { firestore } from '../../config/Firebase';
import { client } from '../../sanityClient';


const Userprofile = () => {
  const navigation=useNavigation();

  const [username, setUsername] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [insti, setinsti] = useState('');
  const [background, setbackgound] = useState('');
  const [exper, setExper] = useState('');
  const [useruniqueid, setuseruniqueid] = useState('');
  const [coursesWithImages, setCoursesWithImages] = useState([]);
  const [enrolledcourses, setenrolledcourses] = useState([]);

  const fetchAllCoursesFromSanity = async () => {
    try {
      const query = `*[_type == "subject" || _type == "courses"]{
        name,
        image {
          asset -> {
            url
          }
        }
      }`;
      const data = await client.fetch(query);
      return data;
    } catch (error) {
      console.error('Error fetching courses from Sanity:', error);
      return [];
    }
  };

  const fetchEnrolledCoursesImages = async () => {
    try {
      const allCourses = await fetchAllCoursesFromSanity();
      const courseImagesMap = {};

      // Create a map of course names to images
      allCourses.forEach(course => {
        if (course.image && course.image.asset && course.image.asset.url) {
          courseImagesMap[course.name] = course.image.asset.url;
        }
      });

      // Add image URLs to enrolled courses
      const enrolledCoursesWithImages = enrolledcourses.map(course => ({
        ...course,
        imageUrl: courseImagesMap[course.courseName] || 'defaultImageUrl',
      }));

      setCoursesWithImages(enrolledCoursesWithImages);
    } catch (error) {
      console.error('Error fetching enrolled courses images:', error);
    }
  };

  const getUserFromStorage = async () => {
    try {
      const user = await AsyncStorage.getItem('@user');
      const parsedUser = JSON.parse(user);

      setUsername(parsedUser.name);
      setProfilePic(parsedUser.profilePic);
      setinsti(parsedUser.university);
      setbackgound(parsedUser.professionalBackground);
      setExper(parsedUser.experience);
      setuseruniqueid(parsedUser.id);
    } catch (error) {
      console.log('Error retrieving user data:', error);
    }
  };

  useEffect(() => {
    getUserFromStorage();
  }, []);

  useEffect(() => {
    if (useruniqueid) {
      fetchEnrolledCourses();
    }
  }, [useruniqueid]);

  useEffect(() => {
    if (enrolledcourses.length > 0) {
      fetchEnrolledCoursesImages();
    }
  }, [enrolledcourses]);

  const fetchEnrolledCourses = async () => {
    try {
      const userDocRef = doc(firestore, 'users', useruniqueid);
      const userDocSnapshot = await getDoc(userDocRef);
      
      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();

        if (userData.enrolledCourses) {
          setenrolledcourses(userData.enrolledCourses);
        } else {
          console.log('No enrolled courses found.');
        }
      } else {
        console.log('User document does not exist.');
      }
    } catch (error) {
      console.log('Error fetching enrolled courses:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('@user');
      console.log("Logout mar dia")
    } catch (error) {
      console.log('Error during logout:', error);
    }
  };

  const defaultuserpp = "../../assets/app_images/home_card_top_3.jpg"

  return (
    <ScrollView style={{flex:1}}>
      <View style={{height:40,width:40,borderRadius:50,alignItems:'center',justifyContent:'center',backgroundColor:'rgba(173,216,280,0.8)',margin:20,marginTop:40,position:'absolute',zIndex:9999}}>
        <TouchableOpacity onPress={()=>navigation.goBack()}>
          <Icon name="arrow-back" size={40} color="white" style={styles.icon} />
        </TouchableOpacity>
      </View>

      <View style={{height:40,width:40,borderRadius:50,alignItems:'center',justifyContent:'center',backgroundColor:'rgba(173,216,280,0.8)',margin:20,marginTop:40,position:'absolute',right:0,zIndex:9999}}>
        <TouchableOpacity onPress={()=>navigation.navigate('useredit')}>
          <Icon name="edit" size={30} color="white" style={styles.icon} />
        </TouchableOpacity>
      </View>

      <View>
        <View>
          <Image
            source={require("../../assets/app_images/home_card_top_1.jpg")}
            style={{height:230,width:"100%"}}
          />
        </View>
        <View>
          <Image
            source={{uri:(profilePic)?profilePic:defaultuserpp}}
            style={styles.userpp}
          />
        </View>
      </View>

      <View style={styles.infobox}>
      <Text style={{fontSize:25,margin:10}}>Profile Summary</Text>
        <Text style={{fontSize:20,margin:10}}>{username}</Text>
        <Text style={styles.heading}>Institute</Text>
        <Text style={styles.headingans}>{insti}</Text>
        <Text style={styles.heading}>Duration</Text>
        <Text style={styles.headingans}>6 Months</Text>
        <Text style={styles.heading}>Professional Background</Text>
        <Text style={styles.headingans}>{background}</Text>
        <Text style={styles.heading}>Total Experience</Text>
        <Text style={styles.headingans}>{exper}</Text>
      </View>

      <View style={{ margin: 20 }}>
        <Text style={{ fontSize: 25, marginBottom: 20 }}>Enrolled Courses</Text>
        <ScrollView 
          horizontal 
          contentContainerStyle={{ flexDirection: 'row', gap: 20 }}
          showsHorizontalScrollIndicator={false}
        >
          {enrolledcourses.length > 0 ? (
            enrolledcourses.map((course, index) => (
              <View style={styles.enrolledcard} key={index}>
                <Image
                  source={{uri:coursesWithImages[index]?.imageUrl}}
                  style={{ height:130, width:130,borderRadius: 10,marginTop:25}}
                />
                <Text style={{ fontSize: 16 }}>{course.courseName}</Text>
                <Text style={{ fontSize: 13 }}>{course.duration}</Text>
              </View>
            ))
          ) : (
            <Text>You haven't enrolled in any course.</Text>
          )}
        </ScrollView>
      </View>


      <View style={{margin:20}}>
        <Text style={{fontSize:25,marginBottom:10}}> Chat and Read </Text>
        <TouchableOpacity style={styles.command} onPress={()=>{navigation.navigate('ChatBot')}}>
          <Icon name="chat" size={30} color="rgb(173,216,280)" style={styles.icon} />
          <Text style={styles.commandtext}>Talk to Assistant</Text>
          <View style={styles.arrayicon}>
            <Icon name="arrow-forward" size={30} color="white" style={styles.icon} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.command} onPress={()=>{navigation.navigate('tnc')}}>
          <Icon name="check-box" size={30} color="rgb(173,216,280)" style={styles.icon} />
          <Text style={styles.commandtext}>Terms and Conditions</Text>
          <View style={styles.arrayicon}>
            <Icon name="arrow-forward" size={30} color="white" style={styles.icon} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.command} onPress={()=>{navigation.navigate('aboutus')}}>
          <Icon name="info" size={30} color="rgb(173,216,280)" style={styles.icon} />
          <Text style={styles.commandtext}>About Us</Text>
          <View style={styles.arrayicon}>
            <Icon name="arrow-forward" size={30} color="white" style={styles.icon} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.command} onPress={handleLogout}>
          <Icon name="logout" size={30} color="rgb(173,216,280)" style={styles.icon} />
          <Text style={styles.commandtext}>Log Out</Text>
          <View style={styles.arrayicon}>
            <Icon name="arrow-forward" size={30} color="white" style={styles.icon} />
          </View>
        </TouchableOpacity>
      </View>

      
    </ScrollView>
  )
}

export default Userprofile

const styles = StyleSheet.create({
  enrolledcard:{
    height: 200,
      width: 170,
      borderRadius: 20,
      backgroundColor: 'rgb(255,255,255)',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
  },
  userpp:{
    height:150,
    width:150,
    position:'absolute',
    borderRadius:75,
    justifyContent:'center',
    alignItems:'center',
    marginTop:"-20%",
    marginLeft:"35%"
  },
  heading:{
    fontSize:20,
    margin:10,
  },
  headingans:{
    fontSize:16,
    margin:5,
    marginLeft:10
  },
  infobox:{
    height:'auto',
    width:"90%",
    backgroundColor:'rgba(255,255,255,1)',
    borderRadius:20,
    margin:20,
    marginTop:70,
    alignSelf:'center'

  },
  command:{
    height:50,
    width:"100%",
    borderRadius:15,
    margin:10,
    backgroundColor:'rgb(255,255,255)',
    flexDirection:'row',
    padding:10,
    alignItems:'center',
    alignSelf:'center'
  },
  commandtext:{
    fontSize:20,
    marginLeft:10,
  },
  arrayicon:{
    height:40,
    width:40,
    backgroundColor:'rgba(173,216,280,0.5)',
    borderRadius:40,
    justifyContent:'center',
    alignItems:'center',
    margin:5,
    position:'absolute',
    zIndex:999,
    right:0
  }
})