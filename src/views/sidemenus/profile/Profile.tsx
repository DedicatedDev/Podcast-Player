import * as React from 'react'
import  { useContext } from "react";
import {
    View,
    StyleSheet,
    TouchableWithoutFeedback,
    Keyboard,
    KeyboardAvoidingView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TextInput, Button, Text, Snackbar } from "react-native-paper";
import { Colors } from 'react-native/Libraries/NewAppScreen';

const Profile  =  () => {
    return (
        <View>
            <Text style={{color:Colors.white}}>After make auth, we will implement this.</Text>
        </View>
    )
}
export default Profile;
const styles = StyleSheet.create({
    container: {
        backgroundColor: "#000",
        flex: 1,
        color: "#fff",
        padding: 20,
    },
    text: {
        marginTop: 80,
        fontSize: 15,
        lineHeight: 24,
        color: '#fff',
        textAlign: 'center'
    },
    inputContainer: {
        marginBottom: 10,
    },
    inputButton: {
        marginTop: 10,
        color: "#000",
        backgroundColor: "#ccc",
    },
});
