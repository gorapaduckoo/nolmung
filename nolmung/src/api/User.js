import AsyncStorage from '@react-native-async-storage/async-storage';
import {login} from '@react-native-seoul/kakao-login';
import {apiInstance, apiLoginInstance, imageInstance} from './Index';

const imageApi = imageInstance();
const loginApi = apiLoginInstance();
const api = apiInstance();

api.interceptors.request.use(async config => {
  if (!config.headers) {
    return config;
  }
  let token = null;

  token = await AsyncStorage.getItem('accessToken');

  if (token !== null) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const loginCheckNewUser = async (data, success, fail) => {
  // console.log("여기선 돌아가네요", JSON.stringify(data));
  return await loginApi
    .post(`/user/kakaoLogin`, data)
    .then(success)
    .catch(fail);
};

export const findAllUser = async (success, fail) => {
  await loginApi.get(`/user/findAll`).then(success).catch(fail);
};

export const registUserInfo = async (data, success, fail) => {
  await AsyncStorage.getItem('userId', (err, res) => {
    api.put(`/user/regist/${res}`, data).then(success).catch(fail);
  });
};

export const getUserInfo = async (response, success, fail) => {
  return await api.get(`/user/${response.id}`).then(success).catch(fail);
};

export const registUserImage = async (response, success, fail) => {
  await AsyncStorage.getItem('userId', (err, res) => {
    console.log('이미지 업로드쪽', response);
    imageApi.post(`/image/user/${res}`, response).then(success).catch(fail);
  });
};

export const user_info_change = async (response, success, fail) => {
  // console.log('유저 정보 수정 콘솔', response);
  return await api
    .put(`/user/regist/${response.userId}`, {
      userNickName: response.userNickName,
      userAddressText: response.userAddressText,
      userIntroduction: response.userIntroduction,
    })
    .then(success)
    .catch(fail);
};
