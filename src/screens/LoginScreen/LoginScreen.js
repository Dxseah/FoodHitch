import React, { useState } from 'react'
import { Image, Text, TextInput, TouchableOpacity, View, SafeAreaView } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export default function LoginScreen({navigation}) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const onFooterLinkPress = () => {
        navigation.navigate('Registration')
    }

    const onLoginPress = (email, password) => {
        const auth = getAuth();
        signInWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            const data = {
                id: user.uid,
                email: user.email
            }
            console.log(data)
            navigation.navigate('Home',  {email: user.email})
            })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert("Wrong email or password! Please try again.")
          });
    }
    
    const onFooterLink2Press = () => {
        navigation.navigate("ForgotPassword")
    }

    return (
        <SafeAreaView style={styles.container}>
            <View
                style={{ flex: 1, width: '100%' }}
                keyboardShouldPersistTaps="always">
                                <Image
                    style={styles.logo1}
                    source={require('../../../assets/foodhitchlogo.png')}
                />
                <TextInput
                    style={styles.input}
                    placeholder='E-mail'
                    placeholderTextColor="#000000"
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input2}
                    placeholderTextColor="#000000"
                    secureTextEntry
                    placeholder='Password'
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => onLoginPress(email,password)}>
                    <Text style={styles.buttonTitle}>Log in</Text>
                </TouchableOpacity>
                <View style={styles.footerView}>
                    <Text style={styles.footerText}>
                        Don't have an account?◦  
                        <Text onPress={onFooterLinkPress} style={styles.footerLink}>
                            Sign up
                        </Text>
                    </Text>
                </View>
                <View style={styles.footerView}>
                        <Text onPress={onFooterLink2Press} style={styles.footerLink}>
                            Forgot password?
                        </Text>
                </View>
            </View>
        </SafeAreaView>
    )
}
