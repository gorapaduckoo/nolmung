import React, { useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableHighlight, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ReceiveMessage from "../Components/ReceiveMessage";
import SendMessage from "../Components/SendMessage";
import Modal from 'react-native-modal'
const MessageRoomScreen = ({navigation: {navigate}, route}) => {
    console.log(route.params.userName)
    const navi = useNavigation()
    const dogInfo = "지용 (믹스견, 3세)"
    const send = true
    const receive = true
    const [message, setMessage] = useState('')
    const [isModalVisible, setModalVisible] = useState(false);
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
        console.log(isModalVisible)
    };
    const [outChat, setOutChat] = useState(false)
    const [cutOffUser, setCutOffUser] = useState(false)
    const [cancle, setCancle] = useState(false)
    const backdropOpacity = 0.5
    return (
        <>
            <View style={Styles.messageHeader}>
                <View style={{flexDirection:'row', alignItems:'center',}}>
                    <TouchableOpacity onPress={navi.goBack}>
                        <Image
                            source={require('../assets/icons/GoBack.png')}
                            resizeMode="contain"
                            style={{
                            width: 25,
                            height: 25,
                            
                            }}
                        />
                    </TouchableOpacity>
                    <Image
                        source={route.params.img}
                        resizeMode="contain"
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: 100,
                            marginLeft: 20,
                            marginRight: 5,
                            borderColor:'#FF772F',
                            borderWidth:2,
                        }}/>
                    <View style={{flexDirection:'column'}}>
                        <Text style={{color:'#282828', fontSize: 18,}}>{route.params.userName}</Text>
                        <Text style={{color:'#959595', fontSize: 14,}}>{dogInfo}</Text>
                    </View>
                </View>
                <View>
                    <Pressable onPress={toggleModal}>
                        <Image 
                            source={require('../assets/icons/menuvertical.png')}
                            resizeMode="contain"
                            style={{
                                width: 25,
                                height: 25,
                            }}
                        />
                    </Pressable>
                </View>
            </View>
            <ScrollView automaticallyAdjustContentInsets = {false} contentContainerStyle={{justifyContent:'space-between',...Styles.MessageContainer}}>
                
                {receive ? (
                    <ReceiveMessage userName={route.params.userName} img={route.params.img}/>
                ): null}
                {send ? (
                    <SendMessage />
                ): null}
                
            </ScrollView>
            {/* 채팅 입력창 */}
            <View style={{marginTop:'auto', justifyContent:'center',}}>
                
                <TextInput onChangeText={(e)=>setMessage(e)} style={Styles.TextInput} value={message} placeholder="메세지를 입력하세요..." placeholderTextColor="#959595"/>
                <Image 
                    source={require('../assets/icons/send.png')}
                    resizeMode="contain"
                    style={{position:'absolute', right: 20,}}/>
            </View>

            <Modal  
                isVisible={isModalVisible}
                onBackdropPress={toggleModal}
                backdropOpacity = {backdropOpacity}
            >
                <View style={Styles.ChatSetting}>
                {/* <TouchableOpacity onPress={onPressFriend} style={select =='Friend' ? Styles.bottomBorder : Styles.selectTextHuman}> */}
                    <TouchableOpacity onPress={()=>navi.goBack()} style={{width:'100%', alignItems:'center'}}>
                        <Text style={{color:'#282828', fontSize: 20,}}>채팅방 나가기</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{width:'100%', alignItems:'center'}}>
                        <Text style={{color:'#282828', fontSize: 20, marginVertical:35,}}>대화 상대 차단하기</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={toggleModal} style={{width:'100%', alignItems:'center'}}>
                        <Text style={{color:'#282828', fontSize: 20,}}>취소</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </>
    )
}

export default MessageRoomScreen;

const Styles = StyleSheet.create({
    messageHeader: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems:'center',
        justifyContent:'space-between',
        paddingHorizontal:20,
        paddingVertical: 14,
    },
    TextInput: {
        backgroundColor:'#fff',
        color: '#282828',
        paddingHorizontal: 20,
    },
    MessageContainer:{
        marginHorizontal:28,
        marginTop:'auto',
        marginBottom: 10,
    },
    ChatSetting: {
        marginHorizontal: -20,
        height: '30%', 
        backgroundColor: '#f1f1f1', 
        marginTop:'auto',
        borderTopLeftRadius:15,
        borderTopRightRadius:15,
        borderBottomLeftRadius:0,
        borderBottomRightRadius:0,
        alignItems:'center',
        paddingTop: 15,
        marginBottom: -20,
        justifyContent:'center',
    }
   
})