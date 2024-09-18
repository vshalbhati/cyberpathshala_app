import { StyleSheet, Text, View, Image,TouchableOpacity, ScrollView,TextInput, SafeAreaView} from 'react-native'
import React,{useEffect, useState, useRef} from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import {  doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import { firestore } from '../../config/Firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { client } from '../../sanityClient';
// import LottieView from 'lottie-react-native';
// import { useStripe } from '@stripe/stripe-react-native';


const Coursecost = ({route}) => {
    const navigation=useNavigation();
    const {topic} = route.params;
    // const animationRef = useRef(null);

    // const { initPaymentSheet, presentPaymentSheet } = useStripe();


    const insubstime=["1 Month","3 Months","6 Months","1 Year"];
    const insubprice=[1000,3000,4000,5000];

    const onsubstime=["1 Month","3 Months","6 Months","1 Year"];
    const onsubprice=[500,1500,2500,3500];

    const [mode,setMode]=useState("")
    const [cost, setCost] = useState(0)
    const [discountcode, setdiscountcode] = useState("")
    const [subtotal, setSubTotal] = useState(0)
    const [SelectedModeofPay, setSelectedModeofPay]= useState(0)
    // const [showAnimation, setShowAnimation] = useState(false);
    const payimg=[
        require('../../assets/app_images/payimgs/phonepe.png'),
        require('../../assets/app_images/payimgs/gpay.png'),
        require('../../assets/app_images/payimgs/paytm.jpg'),
    ]
    const [isdiscountcodeavailable, setisdiscountcodeavailable] = useState(false)
    
    const fetchdiscountcodes = async () => {
        try {
          const query = `*[_type == "discount" && code == "${discountcode}"]{...}`;
          const data = await client.fetch(query);
          if (data.length > 0) {
            setisdiscountcodeavailable(true);
            setSubTotal(0);
            // setShowAnimation(true);
            // setTimeout(() => setShowAnimation(false), 3000);
          } else {
            setisdiscountcodeavailable(false);
            console.log("Invalid discount code.");
          }
        } catch (error) {
          console.error('Error fetching discount codes:', error);
        }
      };
      
      useEffect(() => {
        if (isdiscountcodeavailable) {
          setSubTotal(0);
        } else {
          setSubTotal(cost + cost * (18 / 100));
        }
      }, [cost, isdiscountcodeavailable]);
      
      const saveCourseToFirestore = async () => {
        try {
          const user = await AsyncStorage.getItem('@user');
          const parsedUser = JSON.parse(user);
      
          if (parsedUser && parsedUser.id) {
            const userId = parsedUser.id;
      
            const courseData = {
              courseName: topic,
              duration: mode,
              price: cost,
              totalWithGST: subtotal,
              paymentMode: SelectedModeofPay === 0 ? "PhonePe" : SelectedModeofPay === 1 ? "GPay" : "Paytm",
            };
      
            const userDocRef = doc(firestore, 'users', userId);
            const userDoc = await getDoc(userDocRef);
            const userData = userDoc.data();
      
            if (userData && userData.enrolledCourses) {
              const enrolledCourses = userData.enrolledCourses;
      
              const courseExists = enrolledCourses.some(course =>
                course.courseName === courseData.courseName
              );
      
              if (courseExists) {
                console.log('Error: The course is already enrolled.');
                return;
              }
            }
      
            await updateDoc(userDocRef, {
              enrolledCourses: arrayUnion(courseData)
            });
      
            console.log("Course added successfully to Firestore!");
            navigation.goBack();
          } else {
            console.log('Error', 'User not logged in.');
          }
        } catch (error) {
          console.error('Error saving course to Firestore: ', error);
        }
      };
      
    //   const handlePayment = async () => {
    //         try {
    //             const response = await fetch('http://localhost:3000/create-payment-intent', {
    //                 method: 'POST',
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                 },
    //                 body: JSON.stringify({ amount: subtotal * 100, currency: 'inr' }),
    //             });
    //             const { clientSecret } = await response.json();

    //             const { error } = await initPaymentSheet({ paymentIntentClientSecret: clientSecret });
    //             if (error) {
    //                 alert(`Error: ${error.message}`);
    //                 return;
    //             }

    //             const { error: paymentError } = await presentPaymentSheet();
    //             if (paymentError) {
    //                 alert(`Payment failed: ${paymentError.message}`);
    //             } else {
    //                 alert('Payment successful!');
    //                 saveCourseToFirestore();
    //             }
    //         } catch (error) {
    //             console.error('Error processing payment: ', error);
    //         }
    //     };
  return (
    <SafeAreaView style={{flex:1}}>

        <ScrollView showsVerticalScrollIndicator={false}>

        
        <View style={{height:40,width:40,borderRadius:50,alignItems:'center',justifyContent:'center',backgroundColor:'rgba(173,216,280,0.8)',margin:20,marginTop:40}}>
            <TouchableOpacity onPress={()=>navigation.goBack()}>
                <Icon name="arrow-back" size={40} color="white" style={styles.icon}/>
            </TouchableOpacity>
        </View>   
        <Text style={{margin:10,marginLeft:20,fontSize:30}}>{topic}</Text> 
        <Text style={{margin:10,marginLeft:20,fontSize:20}}>How do you want to enroll?</Text>
        <View>
            <Text style={{margin:10,marginLeft:15,fontSize:20}}> In Class Based</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap:10,padding:10,marginRight:20}}>
                {insubstime.map((item, index)=>{
                    return(
                        <TouchableOpacity key={index} style={[styles.contentdabba,{backgroundColor:(cost===insubprice[index])?'rgba(173,216,280,0.4)':'rgba(173,216,280,0.8)'}]} onPress={()=>{setCost(insubprice[index]);setMode(item);setSubTotal(cost + cost*(18/100))}}>
                            <Text>{item}</Text>
                            <Text>{insubprice[index]}</Text>
                        </TouchableOpacity>
                    )
                })}
            </ScrollView>
        </View>

        <View>
            <Text style={{margin:10,marginLeft:15,fontSize:20}}> Online Based</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap:10,padding:10,marginRight:20}}>
                {onsubstime.map((item, index)=>{
                    return(
                        <TouchableOpacity key={index} style={[styles.contentdabba,{backgroundColor:(cost===onsubprice[index])?'rgba(173,216,280,0.4)':'rgba(173,216,280,0.8)'}]} 
                            onPress={()=>{
                                setCost(onsubprice[index]);
                                setMode(item)
                                setSubTotal(cost + cost*(18/100))
                            }}
                        >
                            <Text>{item}</Text>
                            <Text>{onsubprice[index]}</Text>
                        </TouchableOpacity>
                    )
                })}
            </ScrollView>
        </View>

        <View style={styles.discountdabba}>
            <Text style={{margin:20}}>Do you have a discount Code?</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter the code"
                keyboardType="text"
                value={discountcode}
                onChangeText={setdiscountcode}
            />
            <TouchableOpacity 
                style={styles.applybtn}
                onPress={fetchdiscountcodes}
            >
                <Text style={{textAlign:'center',color:'white'}}>Apply</Text>
            </TouchableOpacity>
          {/* {showAnimation && (
            <View style={styles.animationContainer}>
              <LottieView
                ref={animationRef}
                source={require('../../assets/app_images/celebration.json')}
                autoPlay
                loop={false}
                style={styles.animation}
              />
            </View>
          )} */}
        </View>

        <View style={{backgroundColor:'rgba(255,255,255,0.8)',height:'auto',padding:15,margin:10,borderRadius:20}}>
                <Text style={{margin:7,marginLeft:15,fontSize:17}}>Selected Mode: <Text style={{fontSize:17,textAlign:'right'}}>{mode}</Text></Text>
                <Text style={{margin:7,marginLeft:15,fontSize:17}}>Total: <Text style={{fontSize:17,textAlign:'right'}}>{cost}</Text></Text>
                <Text style={{margin:7,marginLeft:15,fontSize:17}}>GST: <Text style={{fontSize:17,textAlign:'right'}}>{cost*(18/100)}</Text></Text>
                <Text style={{margin:7,marginLeft:15,fontSize:17}}>Sub Total: <Text style={{fontSize:17,textAlign:'right'}}>{subtotal}</Text></Text>
        </View>

        <View style={{backgroundColor:'rgba(255,255,255,0.8)',height:'auto',padding:15,margin:10,borderRadius:20}}>
            <Text style={{margin:10,marginLeft:15,fontSize:15}}>Mode of Payment</Text>
            {payimg.map((item,index)=>{
                return(
                    <TouchableOpacity key={index} onPress={()=>setSelectedModeofPay(index)} style={{flexDirection:'row',gap:290,justifyContent:'center',alignItems:'center'}}>
                        <Image
                            source={payimg[index]}
                            style={{height:40,width:100}}
                        />
                        <View style={{height:15,width:15,borderRadius:50,backgroundColor:(index===SelectedModeofPay)?"rgba(255,165,10,0.8)":"rgba(128,128,128,0.4)"}}></View>
                    </TouchableOpacity>
                )
            })
                
            }   
        </View>


        </ScrollView>

        <View style={{flexDirection:'row',backgroundColor:'rgba(255,255,255,0.8)'}}>
            <TouchableOpacity style={[styles.enrollbtn,{width:"20%",backgroundColor:'rgba(255,255,255,0.8)'}]}>
                <Image
                    source={payimg[SelectedModeofPay]}
                    style={{height:50,width:80}}
                />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.enrollbtn} onPress={saveCourseToFirestore}>
                <Text style={{textAlign:'center',fontSize:20,color:'white'}}>Checkout</Text>
                <Text style={{textAlign:'center',fontSize:25,color:'white'}}>{subtotal}</Text>
            </TouchableOpacity>
        </View>
    </SafeAreaView>
  )
}

export default Coursecost

const styles = StyleSheet.create({
    discountAppliedMessage: {
        position: 'absolute',
        bottom: -30,
        left: 0,
        right: 0,
        alignItems: 'center',
        padding: 10,
      },
    applybtn:{
        height:40,
        width:200,
        borderRadius:30,
        backgroundColor:'rgba(255,165,10,0.8)',
        justifyContent:'center',
        alignItems:'center'
    },
    contentdabba:{
        justifyContent:'center',
        alignItems:'center',
        height:100,
        width:170,
        borderRadius:20,
        backgroundColor:'rgba(173,216,280,0.8)',
      },
    enrollbtn:{
        backgroundColor:'rgba(255,165,10,0.8)',
        height:50,
        width:"70%",
        borderRadius:10,
        alignSelf:'flex-end',
        margin:10,
        justifyContent:'center',
        alignItems:'center',
        flexDirection:'row',
        gap:150
      },
    input: {
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
        width: '80%',
      },
    discountdabba:{
        backgroundColor:'rgba(255,255,255,0.8)',
        height:'auto',
        width:"90%",
        alignSelf:'center',
        borderRadius:20,
        justifyContent:'center',
        alignItems:'center',
        margin:10,
        padding:10
    },
    animationContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      },
    animation: {
        width: 200,
        height: 200,
      },
})