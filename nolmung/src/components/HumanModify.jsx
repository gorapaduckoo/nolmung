import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  TextInput,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Button,
  Pressable,
  DeviceEventEmitter,
} from 'react-native';
import Postcode from '@actbase/react-daum-postcode';
import Modal from 'react-native-modal';
import {getUserInfo, registUserInfo} from '../api/User';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HumanModify = () => {
  const navi = useNavigation();
  const [userinfo, setuseinfo] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
    console.log(isModalVisible);
  };
  const backdropOpacity = 0.3;
  let flag = 1;
  const onChangeText = event => {
    setNickName(event);
    console.log('이벤트', event);
  };

  const [introduce, setIntroduce] = useState('소개를 해주세요');
  const [address, setAddress] = useState('주소를 입력해주세요');
  const [nickName, setNickName] = useState('닉네임을 입력해주세요');
  console.log('주소', address);

  const onChangeIntro = event => {
    setIntroduce(event);
    console.log(event);
  };

  const user_info_func = async () => {
    try {
      await AsyncStorage.getItem('userId', (err, id) => {
        getUserInfo(
          {id},
          response => {
            setuseinfo(response.data);
            setNickName(response.data.userNickName);
            setAddress(response.data.userAddressText);
            setIntroduce(response.data.userIntroduction);
          },
          err => {
            console.log('유저정보 에러', err);
          },
        );
      });
    } catch (err) {
      console.log(err);
      console.log('심각한 에러;;');
    }
  };

  const user_info_change_func = async () => {
    try {
      await registUserInfo(
        {
          userId: 1,
          userNickName: nickName,
          userAddressText: address,
          userIntroduction: introduce,
        },
        response => {
          //   console.log('gdgd',response)
        },
        err => {
          console.log('강아지정보 에러', err);
        },
      );
    } catch (err) {
      console.log(err);
      console.log('심각한 에러;;');
    }
  };

  useEffect(() => {
    user_info_func();
    return () => {
      DeviceEventEmitter.emit('abc');
    };
  }, []);

  console.log('닉네임');

  const onSubmitting = () => {
    console.log('보낼 닉네임', nickName);
    user_info_change_func();
    console.log('수정완료');
  };
  console.log('flag', flag);

  return (
    <>
      <ScrollView>
        <View style={Styles.HumanContainer}>
          <View style={Styles.HumanNickNameBox}>
            <Text style={Styles.HumanNickname}>닉네임</Text>
            <TextInput
              // onFocus={()=> {setNickName('')}}
              value={nickName}
              onChangeText={onChangeText}
              style={Styles.horizentalLine}
            />
          </View>
          <View style={Styles.HumanIntroBox}>
            <Text style={Styles.IntroTitle}>자기소개</Text>
            <TextInput
              value={introduce}
              onChangeText={onChangeIntro}
              style={Styles.TextArea}
            />
          </View>
          <View style={Styles.HumanAddressBox}>
            <Text style={Styles.AddressText}>주소</Text>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={{color: '#282828'}}>{address}</Text>
              <Pressable onPress={toggleModal}>
                <Text style={Styles.changeBtn}>변경</Text>
              </Pressable>
            </View>
            <View style={Styles.addressBottom} />
          </View>
        </View>
        <View style={{alignItems: 'center'}}>
          <TouchableOpacity
            onPress={() => {
              onSubmitting();
              navi.navigate('프로필');
            }}
            style={Styles.completeBtn}>
            <Text style={{color: '#fff', fontWeight: '500'}}>수정 완료</Text>
          </TouchableOpacity>
        </View>

        <Modal
          isVisible={isModalVisible}
          onBackdropPress={toggleModal}
          backdropOpacity={backdropOpacity}>
          <Postcode
            style={{flex: 1}}
            jsOptions={{animation: true, hideMapBtn: true}}
            onSelected={data => {
              console.log(JSON.stringify(data.roadAddress));
              setAddress(data.roadAddress.replace(/\"/gi, ''));
              toggleModal();
            }}
          />
        </Modal>
      </ScrollView>
    </>
  );
};

export default HumanModify;

const Styles = StyleSheet.create({
  HumanContainer: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  HumanNickname: {
    color: '#282828',
    fontWeight: '600',
    fontSize: 16,
  },
  horizentalLine: {
    color: '#282828',
    borderBottomColor: '#959595',
    borderBottomWidth: 1,
    marginBottom: 20,
    height: 40,
  },
  HumanNickNameBox: {},
  HumanIntroBox: {
    // backgroundColor: 'red'
  },
  IntroTitle: {
    color: '#282828',
    fontWeight: '600',
    marginBottom: 10,
    fontSize: 16,
  },
  TextArea: {
    color: '#282828',
    borderWidth: 1,
    borderColor: '#959595',
    borderRadius: 15,
    paddingLeft: 15,
  },
  HumanAddressBox: {
    marginTop: 20,
  },
  AddressText: {
    fontWeight: '600',
    color: '#282828',
    fontSize: 16,
  },
  addressBottom: {
    marginTop: 5,
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
  },
  changeBtn: {
    color: '#FF772F',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#FF772F',
    borderRadius: 15,
    paddingTop: 2,
    paddingHorizontal: 10,
  },
  completeBtn: {
    marginTop: 100,
    width: '70%',
    height: 43,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF772F',
    borderRadius: 50,
  },
});
