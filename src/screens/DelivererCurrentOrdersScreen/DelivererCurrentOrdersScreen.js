
import React, { useEffect, useState } from 'react'
import { Text, SafeAreaView, TouchableOpacity, FlatList, View} from 'react-native'
import { getAuth} from "firebase/auth";
import styles from './styles';
import { getFirestore, doc, getDoc, updateDoc, getDocs, onSnapshot,  collection, query, where } from "firebase/firestore";
import { ScrollView } from 'react-native-gesture-handler';

export default function DelivererCurrentOrdersScreen({route, navigation}) {

    const [orderData, onChangeOrderData] = useState([]);
    const [isFetching, setIsFetching] = useState(false);
    const [ordererNumber,setOrdererEmail] = useState('');

    useEffect(()=>{
        const db = getFirestore();
        const auth = getAuth();

        const reqRef = collection(db, "Order");
        const q = query(reqRef, where("delivererEmail", "==", auth.currentUser.email));
        const querySnapshot = getDocs(q).then( querySnapshot =>
        querySnapshot.forEach((docNew) => {
          if (orderData.some(e => e[0] === docNew.data().ordererEmail)) {
            console.log("order data already contains this docs 1")
          } else {
            const docRef1 = doc(db, "user", docNew.data().ordererEmail)
            const docSnap1 = getDoc(docRef1)
            .then(docSnap => {
                if (docSnap.exists()) {
                    console.log("get number");
                    onChangeOrderData(prevState=> {return [...prevState, 
                    [docNew.data().ordererEmail,docNew.data().totalPrice,
                    docNew.data().food.food1,docNew.data().food.food2
                    ,docSnap.data().data.phoneNumber]]
                    })
                } else {
                    console.log("No such document!");
                    alert("No such account!")
                }
                })

          }
        }))

    },[])

    const onRefreshPress = () => {
      setIsFetching(true)

      const db = getFirestore();
      const auth = getAuth();

      const reqRef = collection(db, "Order");
      const q = query(reqRef, where("delivererEmail", "==", auth.currentUser.email));
      const querySnapshot = getDocs(q).then( querySnapshot =>
      querySnapshot.forEach((doc) => {
        console.log(doc.data())
        if (orderData.some(e => {
          if (e[0] === doc.data().ordererEmail) {
            return true
          }
          return false
      })) {
          console.log("order data already contains this docs 2")
        } else {
          const docRef1 = doc(db, "user", docNew.data().ordererEmail)
          const docSnap1 = getDoc(docRef1)
          .then(docSnap => {
              if (docSnap.exists()) {
                  console.log("get number");
                  onChangeOrderData(prevState=> {return [...prevState, 
                  [docNew.data().ordererEmail,docNew.data().totalPrice,
                  docNew.data().food.food1,docNew.data().food.food2
                  ,docSnap.data().data.phoneNumber]]
                  })
              } else {
                  console.log("No such document!");
                  alert("No such account!")
              }
              })
            }
      setIsFetching(false)
    })
    )
  }


    const Item = ({ item }) => (
      <View>
          <Text style={styles.text4Title}># ORDER #</Text> 

          <Text style={styles.text4}>Orderer Phone Number: {item[4]}</Text>
          <Text style={styles.text4}>Orderer Email: {item[0]}</Text>

          <Text style={styles.text4}>Food Item 1: {item[2]}</Text>
          <Text style={styles.text4}>Food Item 2: {item[3]}</Text>
      
          <Text style={styles.text4}>Total Price Of Order: ${item[1]}</Text>
      </View>
      );
    const renderItem = ({ item }) => {

        return (
        <Item
            item={item}
        />
        );
    };
    const onPressisPending = () => {
        const auth = getAuth();
        const db = getFirestore();
        
        const data3 = {
            deliveryStatus: "Order Pending"
        };

        updateDoc(doc(db, 'Request', auth.currentUser.email), 
            data3
          ).then(() => {
            // Profile updated!
            console.log('order pending')
            alert("Orderers will see food items status as PENDING!")
          }).catch((error) => {
            // An error occurred
            alert(error)
          });           
        }

    const onPressisOnTheWay = () => {
        const auth = getAuth();
        const db = getFirestore();
        
        const data3 = {
            deliveryStatus: "Order On The Way!"
        };

        updateDoc(doc(db, 'Request', auth.currentUser.email), 
            data3
          ).then(() => {
            // Profile updated!
            console.log('order on the way')
            alert("Orderers will see food items status as ON THE WAY!")
          }).catch((error) => {
            // An error occurred
            alert(error)
          });           
        }
        const onPressisDelivered = () => {
            const auth = getAuth();
            const db = getFirestore();
            
            const data3 = {
                deliveryStatus: "Order Delivered!"
            };

            updateDoc(doc(db, 'Request', auth.currentUser.email), 
                data3
              ).then(() => {
                // Profile updated!
                console.log('order delivered')
                alert("Orderers will see food items status as DELIVERED!")
              }).catch((error) => {
                // An error occurred
                alert(error)
              });           
            }

    console.log(orderData)

    return (
    <SafeAreaView style={styles.container}>
    <Text style={styles.text2}>{'\n'}</Text>

    <Text style={styles.text}>Your Current Orders Are:</Text>

    <Text style={styles.text2}>{'\n'}</Text>
    <FlatList 
                data={orderData}
                renderItem={renderItem}
                keyExtractor={(item) => item[0]}
                onRefresh={onRefreshPress}
                refreshing={isFetching}
                ListEmptyComponent={<Text style={styles.noRequest}>No requests found.</Text>}
            />

    <Text style={styles.text4}>Update Orders Status:</Text>
    <View style={styles.iconWrap}>
            <TouchableOpacity
                    style={styles.buttonIcon}
                    onPress={() => onPressisPending()}>
                    <Text style={styles.buttonTitle}>Order Pending</Text>
            </TouchableOpacity>

            <TouchableOpacity
                    style={styles.buttonIcon}
                    onPress={() => onPressisOnTheWay()}>
                    <Text style={styles.buttonTitle}>Order On The Way</Text>
            </TouchableOpacity>

            <TouchableOpacity
                    style={styles.buttonIcon}
                    onPress={() => onPressisDelivered()}>
                    <Text style={styles.buttonTitle}>Order Delivered</Text>
            </TouchableOpacity>
      </View>
    </SafeAreaView>
    )
}


