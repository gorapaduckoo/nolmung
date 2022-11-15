import React from "react";
import {Image, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
const MyFriend = () => {
    const navigation = useNavigation()
    const HumanName = '미이'
    const DogInfo = '미유 7세 믹스 5kg'
    return (
        <>
            <TouchableWithoutFeedback onPress={()=>{navigation.push('FriendProfile')}}>
                <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center',}}>
                    <View style={Styles.requestContainer}>
                        <Image 
                            source={require('../assets/icons/Ellipse.png')}
                            resizeMode="contain"
                            style={{
                                width: 70,
                                height: 70,
                            }}
                        />
                        <View style={Styles.requestTextBox}>
                            <Text style={{...Styles.requestText, fontSize: 20, marginTop: -15,}}>{HumanName}</Text>
                            <Text style={{...Styles.requestText, fontSize: 16, marginTop: 3,}}>{DogInfo}</Text>
                        </View>
                    </View>
                    
                </View>
            </TouchableWithoutFeedback>
        </>
    )
}

export default MyFriend

const Styles = StyleSheet.create({
    requestContainer: {
        flexDirection:'row',
        alignItems: 'center',
        paddingBottom: 20,
    },
    requestTextBox: {
        marginLeft: 10,
    },
    requestText: {
        color: '#282828'
    },
})