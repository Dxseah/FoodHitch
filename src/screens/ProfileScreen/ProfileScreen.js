import React, { useEffect, useState } from 'react'
import { Image, ImageBackground, Text, TextInput, TouchableOpacity, View, SafeAreaView } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';
import { getAuth, updatePassword, signInWithEmailAndPassword} from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";

export default function ProfileScreen({navigation}) {
    const [fullName, setFullName] = useState('')
    const [changeName, setChangeName] = useState(false)
    const [password, setPassword] = useState('')
    const [oldPassword, setOldPassword] = useState('')
    const [changePW, setChangePW] = useState(false)
    const [confirmPassword, setConfirmPassword] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [changeNum, setChangeNum] = useState(false)
    const db = getFirestore()
    const auth = getAuth()

    useEffect(()=>{
        const docRefName = doc(db,"user", auth.currentUser.email)
        const docSnapName = getDoc(docRefName)
        .then(docSnap=>{
            if (docSnap.exists()) {
                setFullName(docSnap.data().data.fullName)
                setPhoneNumber(docSnap.data().data.phoneNumber)
            } else {
                alert("No user logged in")
                return
        }
        })
    },[])
    const onNamePress = () => {
        if(changePW||changeNum){
            alert("Please change one credential at a time!")
            return
        }
        setChangeName(true)

    }
    const onPasswordPress = () => {
        if(changeName||changeNum){
            alert("Please change one credential at a time!")
            return
        }
        setChangePW(true)
    }
    const onNumberPress = () => {
        if(changePW||changeName){
            alert("Please change one credential at a time!")
            return
        }
        setChangeNum(true)

    }
    const onConfirmNamePress = () => {
        const docRefName = doc(db,"user", auth.currentUser.email)
        updateDoc(docRefName, {
            'data.fullName': fullName
          });
        alert("Name changed!")
        setChangeName(false)
    }
    const onConfirmNumPress = () => {
        if (Number(phoneNumber) <= 80000000) {
            alert('Invalid phone number.')
            return
        } 
        const docRefNum = doc(db,"user", auth.currentUser.email)
        updateDoc(docRefNum, {
            'data.phoneNumber': phoneNumber
          });
        alert("Phone Number changed!")
        setChangeNum(false)
    }
    const onConfirmPasswordPress = () => {
        if (password !== confirmPassword) {
            alert("Passwords don't match.")
            return
        }
        signInWithEmailAndPassword(auth, auth.currentUser.email, oldPassword)
        .then((userCredential) => {
            // Signed in 
            const user = auth.currentUser;
            updatePassword(user, password).then(() => {
                alert("Password changed!")
            }).catch((error) => {
                alert(error.message)
            });
            setChangePW(false)
        })
        .catch((error) => {
            const errorMessage = error.message;
            alert(errorMessage)
        });

    }
    return (
    <SafeAreaView style = {styles.container}>

        <Text style={styles.welcomeText1}> Your Profile!</Text>
        <View style={styles.container}>
            
                <Image
                    style={styles.logo}
                    source={require('../../../assets/foodcute.png')}
                />

                { changeName ?
                <View style={styles.originalWrap}>
                <Text style={styles.emailText}>Name: </Text>
                <TextInput
                    style={styles.input}
                    placeholder= {fullName}
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => setFullName(text)}
                    value={fullName}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                /> 
                <TouchableOpacity onPress = {() => onConfirmNamePress()}>
                    <Image style={styles.logo3}
                        source={require('../../../assets/confirm.png')}/>
                </TouchableOpacity>
                </View>
                :
                <View style={styles.originalWrap}>
                <Text style={styles.emailText}>Name: </Text>
                <Text style={styles.emailText}> {fullName} </Text>
                <TouchableOpacity onPress = {() => onNamePress()}>
                    <Image style={styles.logo2}
                    source={require('../../../assets/edit2.png')}/>
                </TouchableOpacity>
                </View>
                }

                <Text style={styles.emailText}>
                 Email: {auth.currentUser.email}
                </Text>
                
                { changeNum ?
                <View style={styles.originalWrap}>
                    <Text style={styles.emailText}>Phone Number: </Text>
                    <TextInput
                    style={styles.input}
                    placeholder={phoneNumber}
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => setPhoneNumber(text)}
                    value={phoneNumber}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                    />                 
                    <TouchableOpacity onPress = {() => onConfirmNumPress()}>
                        <Image style={styles.logo3}
                        source={require('../../../assets/confirm.png')}/>
                    </TouchableOpacity>
                </View>:
                <View style={styles.originalWrap}>
                <Text style={styles.emailText}>Phone Number: </Text>
                <Text style={styles.emailText}>{phoneNumber}</Text>
                <TouchableOpacity onPress = {() => onNumberPress()}>
                <Image style={styles.logo2}
                source={require('../../../assets/edit2.png')}/>
                </TouchableOpacity>
                </View>
                }

                { changePW ?
                <View>
                    <TextInput
                        style={styles.input2}
                        placeholderTextColor="#aaaaaa"
                        placeholder="Old Password"
                        onChangeText={(text) => setOldPassword(text)}
                        value={oldPassword}
                        underlineColorAndroid="transparent"
                        autoCapitalize="none"
                    />
                    <TextInput
                        style={styles.input2}
                        placeholderTextColor="#aaaaaa"
                        secureTextEntry
                        placeholder="New Password"
                        onChangeText={(text) => setPassword(text)}
                        value={password}
                        underlineColorAndroid="transparent"
                        autoCapitalize="none"
                    />
                    <TextInput
                        style={styles.input2}
                        placeholderTextColor="#aaaaaa"
                        secureTextEntry
                        placeholder='Reconfirm New Password  '
                        onChangeText={(text) => setConfirmPassword(text)}
                        value={confirmPassword}
                        underlineColorAndroid="transparent"
                        autoCapitalize="none"
                    />
                    <TouchableOpacity onPress = {() => onConfirmPasswordPress()}>
                        <Image style={styles.logo2}
                        source={require('../../../assets/confirm.png')}/>
                    </TouchableOpacity>
                </View> :
                <View style={styles.originalWrap}>
                <Text style={styles.emailText}>Password: ***hidden***</Text>
                <TouchableOpacity onPress = {() => onPasswordPress()}>
                    <Image style={styles.logo2}
                    source={require('../../../assets/edit2.png')}/>
                </TouchableOpacity>
                </View>
                }
        </View>
    </SafeAreaView>
    )
}