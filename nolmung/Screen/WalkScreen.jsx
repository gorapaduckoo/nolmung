import React, {useState, useEffect, useRef} from 'react';
import {
  Button,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import Geolocation, {
  getCurrentPosition,
} from 'react-native-geolocation-service';
import MapView, {
  PROVIDER_GOOGLE,
  Polyline,
  Marker,
  Circle,
} from 'react-native-maps';
import styled from 'styled-components';
import {Platform, PermissionsAndroid, AppState} from 'react-native';
// import useInterval from 'use-interval';
import {getDistance} from 'geolib';
import useInterval from 'react-useinterval';
// import BackgroundTimer from 'react-native-background-timer';
import {AppRegistry} from 'react-native';

async function requestPermission() {
  try {
    // 안드로이드 위치 정보 수집 권한 요청
    if (Platform.OS === 'android') {
      return await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );

      console.log(Platform.OS);
    }
  } catch (e) {
    console.log(e);
  }
}

async function requestPermission2() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
      {
        title: '위치 권한',
        message: '앱 위치 정보를 항상 허용해주세요!',
        buttonNeutral: '나중에',
        buttonNegative: '거부',
        buttonPositive: '승인',
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use the location in background');
      return true;
    } else {
      console.log('Location permission denied');
      return false;
    }
  } catch (err) {
    console.warn(err);
    return false;
  }
}

function WalkScreen({navigation}) {
  let [curlocation, setCurlocation] = useState([]);
  let [circleLocation, setCircleLocation] = useState([
    {
      latitude: 0,
      longitude: 0,
    },
  ]);
  const [startlocation, setstartlocation] = useState({});
  const [distance, setDistance] = useState(0);
  const [flag, setFlag] = useState(0);
  const [ondo, setondo] = useState(10);
  const [weathers, setweathers] = useState('');
  const [sec, setsec] = useState(0);
  const [min, setmin] = useState(0);
  const [speed, setspeed] = useState(0);
  const appState = useRef(AppState.currentState);
  const [landmark, setLocations] = useState([
    {landmarkId: 1, latitude: 37.50202794087094, longitude: 127.041301445791},
    {landmarkId: 2, latitude: 37.50148996696899, longitude: 127.03293235165089},
    {landmarkId: 3, latitude: 37.49761475728036, longitude: 127.03596135511745},
    {landmarkId: 4, latitude: 37.4982761803595, longitude: 127.01112323944},
    {landmarkId: 5, latitude: 37.4949943443586, longitude: 127.012134384912},
    {landmarkId: 6, latitude: 37.4936599915248, longitude: 127.012626632694},
    {landmarkId: 7, latitude: 37.4928178646055, longitude: 127.013838469407},
  ]);
  const accessableLength = 200; // 사용자 원의 반경, 접근할 수 있는 랜드마크까지의 거리

  useInterval(() => {
    // console.log('inter내부로그', AppState.currentState);
    Geolocation.getCurrentPosition(
      position => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        setCurlocation([
          ...curlocation,
          {latitude: latitude, longitude: longitude},
        ]);
        setCircleLocation([
          ...circleLocation,
          {latitude: latitude, longitude: longitude},
        ]);
        // setCurlocation({latitude, longitude});

        if (curlocation.length > 2 && flag === 1) {
          console.log(flag);
          // console.log(curlocation);
          // console.log(circleLocation);
          // console.log('!!!!!!!' + curlocation.length);
          // console.log(curlocation[curlocation.length - 1].latitude);
          let long = getDistance(
            curlocation[curlocation.length - 1],
            curlocation[curlocation.length - 2],
            0.1
          );
          setspeed(long);
          console.log('2초당 거리', long);
          if (long < 4) {
            setDistance(distance + long);

            console.log('거리계산 :', distance);
          } else {
            console.log('속도가 선을 넘엇습니다');
          }
        }
      },
      error => {
        console.log(error);
      },
      {
        maximumAge: 100,
        timeout: 50000,
        enableHighAccuracy: true,
        distanceFilter: 1,
      }
    );
    if (flag === 1 && speed < 4) {
      if (sec !== 58) {
        setsec(sec + 2);
      } else {
        setsec(0);
        setmin(min + 1);
      }
    }
    // getLandmarkAccessibility(() => {});
  }, 2000);

  const handleAppStateChange = nextAppState => {
    console.log('⚽️appState nextAppState', appState.current, nextAppState);
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      console.log('⚽️⚽️App has come to the foreground!');
    }
    if (
      appState.current.match(/inactive|active/) &&
      nextAppState === 'background'
    ) {
      console.log('⚽️⚽️App has come to the background!');
    }
    appState.current = nextAppState;
  };

  // console.log('example의 타입은?' + typeof example);`

  // AppState.addEventListener('change', handleAppStateChange);
  // useEffect(() => {
  //   AppState.addEventListener('change', handleAppStateChange);
  //   return () => {
  //     AppState.removeEventListener('change', handleAppStateChange);
  //   };
  // }, []);

  // if (AppState.currentState === 'active') {
  //   console.log('active', AppState.currentState);
  //   example;
  // } else {
  //   console.log('BBBBB', AppState.currentState);
  //   example;
  // }

  useEffect(() => {
    requestPermission().then(result => {
      if (result === 'granted') {
        requestPermission2();
        console.log('실행');
        Geolocation.getCurrentPosition(
          position => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            console.log(latitude, longitude);
            setstartlocation({latitude: latitude, longitude: longitude});
            // setCurlocation({latitude, longitude});
            // console.log(startlocation);
          },
          error => {
            console.log(error);
          },
          {
            maximumAge: 0,
            timeout: 50000,
            enableHighAccuracy: true,
            distanceFilter: 1,
          }
        );
      }
    });
  }, []);

  useEffect(() => {
    Geolocation.getCurrentPosition(position => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      const API_KEY = 'f2defff7944dd4ae7c6c13961b8ab82a';

      // console.log(`You live in ${latitude} and ${longitude}`);

      fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
      )
        .then(response => response.json())
        .then(data => {
          setondo(data.main.temp);
          setweathers(data.weather[0].main);
        });
    });
  }, []);

  function StartCount() {
    if (flag === 1) {
      setFlag(0);
    } else {
      setFlag(1);
    }
    console.log(flag);
  }

  // 위,경도 좌표 2개 사이의 거리를 구하는 메서드
  function getDistanceFromLatLonInKm(lat1, lng1, lat2, lng2) {
    function deg2rad(deg) {
      return deg * (Math.PI / 180);
    }
    var r = 6371; //지구의 반지름(km)
    var dLat = deg2rad(lat2 - lat1);
    var dLon = deg2rad(lng2 - lng1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = r * c; // Distance in km
    return Math.round(d * 1000);
  }

  // 거리를 구해서 일정 범위 이내인지 판단하는 메서드
  function getLandmarkAccessibility(landmark) {
    var myLat = circleLocation[circleLocation.length - 1].latitude;
    var myLng = circleLocation[circleLocation.length - 1].longitude;
    var landmarkLat = landmark.latitude;
    var landmarkLng = landmark.longitude;

    if (
      getDistanceFromLatLonInKm(myLat, myLng, landmarkLat, landmarkLng) <=
      accessableLength
    )
      return true;
    return false;
  }

  return (
    <>
      <View>
        {startlocation.latitude && ondo ? (
          <>
            <Text>
              온도 : {ondo.toFixed(1)} 날씨 : {weathers}
            </Text>
            <Text>
              이동거리 : {distance.toFixed(1)}m 이동시간 : {min}분 {sec}초
            </Text>

            {speed > 4 ? <Text>이동속도가 너무 빠릅니다</Text> : null}
            <Map
              provider={PROVIDER_GOOGLE}
              style={{flex: 1}}
              showsUserLocation={true}
              showsMyLocationButton={true}
              initialRegion={{
                latitude: startlocation.latitude,
                longitude: startlocation.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}>
              <Polyline
                strokeWidth={6}
                strokeColor="#000"
                coordinates={curlocation}
              />
              {landmark.map((landmark, index) => (
                <Marker
                  key={`landmark-${index}`}
                  coordinate={{
                    latitude: landmark.latitude,
                    longitude: landmark.longitude,
                  }}
                  image={require('../assets/icons/map_marker64.png')}
                  onPress={() => {
                    console.log(landmark.landmarkId, '번 랜드마크');
                    if (getLandmarkAccessibility(landmark)) {
                      navigation.push('LandmarkScreen');
                    } else {
                      alert('접근할 수 없는 거리에 위치한 랜드마크입니다.');
                    }
                  }}
                />
              ))}
              <Circle
                center={{
                  latitude: circleLocation[circleLocation.length - 1].latitude,
                  longitude:
                    circleLocation[circleLocation.length - 1].longitude,
                }}
                radius={accessableLength}
                strokeWidth={2}
                strokeColor="#FF0000"
                fillColor="#FF0000"
              />
            </Map>
            {flag === 0 ? (
              <TouchableOpacity onPress={StartCount} style={Styles.buttonTest}>
                <Text style={{color: '#fff'}}>산책 시작</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={StartCount} style={Styles.buttonTest}>
                <Text style={{color: '#fff'}}>산책 종료</Text>
              </TouchableOpacity>
            )}
          </>
        ) : (
          <Text>로딩중...</Text>
        )}
      </View>
    </>
  );
}

const View = styled.View`
  flex: 1;
`;

const Map = styled(MapView)`
  flex: 1;
`;

export default WalkScreen;

const Styles = StyleSheet.create({
  buttonTest: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ff772f',
    marginTop: 'auto',
    marginHorizontal: 20,
    position: 'absolute',
    bottom: 100,
    width: '90%',
  },
});