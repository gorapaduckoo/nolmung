package com.ssafy.nolmung.user.service;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.time.LocalDateTime;
import java.util.*;

import com.google.gson.JsonElement;
import com.google.gson.JsonParser;
import com.ssafy.nolmung.rank.domain.DailyRank;
import com.ssafy.nolmung.rank.domain.MonthlyRank;
import com.ssafy.nolmung.rank.domain.WeeklyRank;
import com.ssafy.nolmung.rank.repository.DailyRankRepository;
import com.ssafy.nolmung.rank.repository.MonthlyRankRepository;
import com.ssafy.nolmung.rank.repository.WeeklyRankRepository;
import com.ssafy.nolmung.user.domain.User;
import com.ssafy.nolmung.user.dto.request.UserTokenRequestDto;
import com.ssafy.nolmung.user.dto.response.UserTokenDataResponseDto;
import com.ssafy.nolmung.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final DailyRankRepository dailyRankRepository;
    private final WeeklyRankRepository weeklyRankRepository;
    private final MonthlyRankRepository monthlyRankRepository;

    @Value("${KAKAO.API}")
    private String apiKey;


//    public List<Tuple> findAllUser () {
//
//        List<Tuple> users = userRepository.findAllUser();
//
//        return users;
//    }

//    public int getUserIdFromHeader(){
//        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes())
//                .getRequest();
//        String jwt = request.getHeader("Authorization");
//        Jws<Claims> claimsJws = null;
//    }

    @Transactional
    public String deleteUser(int userId){
        log.info("유저 정보 삭제 : {}", userId );
        userRepository.deleteByUserId(userId);
        return "유저 정보 삭제 완료";
    }

    public List<User> findAllUser(){
        System.out.println("모든 유저 찾기 in repository");
        List<User> userList = userRepository.findAll();
        return userList;
    }

    public User findByIdForUser (int id){

        Optional<User>  optionalUser = userRepository.findById(id);

        return optionalUser.get();
    }


    public User findById (int id){

        User user= userRepository.findById(id).get();
        String imgUrl = user.getUserImg();
        if(imgUrl.equals("")) user.setUserImg("https://cdn-icons-png.flaticon.com/512/1959/1959921.png");

        return user;
    }

    public User findByKakaoUuid (String uuid){

        return userRepository.findByUserKakaoUuid(uuid);
    }

    @Transactional
    public String kakaoRegist(JsonElement element, String refreshToken){

        String id = element.getAsJsonObject().get("id").getAsString();
        String email = "";
        String profileImage="";
        String nickname = "";
        boolean hasEmail = element.getAsJsonObject().get("kakao_account").getAsJsonObject().get("has_email").getAsBoolean();
        boolean checkEmail = element.getAsJsonObject().get("kakao_account").getAsJsonObject().has("email");
        boolean isProperties = element.getAsJsonObject().has("properties");
        if(isProperties && element.getAsJsonObject().get("properties").getAsJsonObject().has("nickname")){
            nickname = element.getAsJsonObject().get("properties").getAsJsonObject().get("nickname").getAsString();
        }
        if(isProperties && element.getAsJsonObject().get("properties").getAsJsonObject().has("profile_image")){
            profileImage = element.getAsJsonObject().get("properties").getAsJsonObject().get("profile_image").getAsString();
        }
        if(hasEmail && checkEmail) {
            email = element.getAsJsonObject().get("kakao_account").getAsJsonObject().get("email").getAsString();
        }

        //랜덤 코드 생성기
        int leftLimit = 48; // numeral '0'
        int rightLimit = 122; // letter 'z'
        int targetStringLength = 8;
        Random random = new Random();

        String generatedString = random.ints(leftLimit,rightLimit + 1)
                .filter(i -> (i <= 57 || i >= 65) && (i <= 90 || i >= 97))
                .limit(targetStringLength)
                .collect(StringBuilder::new, StringBuilder::appendCodePoint, StringBuilder::append)
                .toString();

        User user = User.builder()
                .userEmail(email)
                .userKakaoUuid(id)
                .userNickname(nickname)
                .userImg(profileImage)
                .userUpdateDate(LocalDateTime.now())
                .userCode(generatedString)
                .userRefreshToken(refreshToken)
                .build();

        userRepository.save(user);
        /**
         랭크 등록 부분
         */
        DailyRank dailyRank = new DailyRank(user.getUserId());
        dailyRankRepository.save(dailyRank);
        WeeklyRank weeklyRank = new WeeklyRank(user.getUserId());
        weeklyRankRepository.save(weeklyRank);
        MonthlyRank monthlyRank = new MonthlyRank(user.getUserId());
        monthlyRankRepository.save(monthlyRank);


        return "UserService : 신규 (카카오) 유저 등록완료";
    }

    @Transactional
    public String userRegist(User user){
        userRepository.save(user);

        return "UserService : 유저 정보 등록완료";
    }

    @Transactional
    public List getKakaoAccessToken(String code){
        String access_Token="";
        String refresh_Token = "";
        String reqURL = "https://kauth.kakao.com/oauth/token";

        try{
            URL url = new URL(reqURL);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();

            //HttpURLConnection의 요청을 POST로 바꿈, 서버에 데이터 전송 가능 여부를 true로 설정
            conn.setRequestMethod("POST");
            conn.setDoOutput(true);

            //POST 요청에 필요로 요구하는 파라미터 스트림을 통해 전송
            BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(conn.getOutputStream()));
            StringBuilder sb = new StringBuilder();
            sb.append("grant_type=authorization_code");
            sb.append("&client_id="+apiKey); // TODO REST_API_KEY 입력
            sb.append("&redirect_uri=http://localhost:3000/redirect"); // TODO 인가코드 받은 redirect_uri 입력
            sb.append("&code=" + code);
            bw.write(sb.toString());
            bw.flush();

            //서버에서 보낸 HTTP 상태 코드 반환. 결과 코드가 200이라면 성공
            int responseCode = conn.getResponseCode();
            System.out.println("responseCode : " + responseCode);
            //요청을 통해 얻은 JSON타입의 Response 메세지 읽어오기
            BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            String line = "";
            String result = "";

            while ((line = br.readLine()) != null) {
                result += line;
            }
            System.out.println("여기의 response body : " + result);

            //Gson 라이브러리에 포함된 클래스로 JSON파싱 객체 생성

            JsonParser parser = new JsonParser();
            JsonElement element = parser.parse(result);

            access_Token = element.getAsJsonObject().get("access_token").getAsString();
            refresh_Token = element.getAsJsonObject().get("refresh_token").getAsString();

            System.out.println("access_token : " + access_Token);
            System.out.println("refresh_token : " + refresh_Token);

            br.close();
            bw.close();
        }catch (IOException e) {
            e.printStackTrace();
        }

        List<String> list = new ArrayList<>();
        list.add(access_Token);
        list.add(refresh_Token);

        return list;
    }

    /**
     * 카카오 로그인시 UUID, 이름, 프로필사진, email 카카오에서 받아오기, userId는 AutoIncrement
     */
    @Transactional
    public UserTokenDataResponseDto getKakaoUser(UserTokenRequestDto token) throws RuntimeException {

        String reqURL = "https://kapi.kakao.com/v2/user/me";

        int isNewUser = 0;

        //access_token을 이용하여 사용자 정보 조회
        try {
            URL url = new URL(reqURL);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();

            conn.setRequestMethod("POST");
            conn.setDoOutput(true);
            conn.setRequestProperty("Authorization", "Bearer " + token.getAccessToken()); //전송할 header 작성, access_token전송

            //결과 코드가 200이라면 성공
            int responseCode = conn.getResponseCode();
            System.out.println("responseCode : " + responseCode);

            //요청을 통해 얻은 JSON타입의 Response 메세지 읽어오기
            BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            String line = "";
            String result = "";

            while ((line = br.readLine()) != null) {
                result += line;
            }
            System.out.println("response body : " + result);

            //Gson 라이브러리로 JSON파싱
            JsonParser parser = new JsonParser();
            JsonElement element = parser.parse(result);


            String id = element.getAsJsonObject().get("id").getAsString();

            User user = userRepository.findByUserKakaoUuid(id);

            if(user == null){
                kakaoRegist(element, token.getRefreshToken());
                user = userRepository.findByUserKakaoUuid(id);
                isNewUser = 0;
                System.out.println("유저 등록 성공!!!" + id);
            }
            else {
                isNewUser = 1;
                System.out.println("이미 등록된 유저!" + id);
            }
            br.close();
            return new UserTokenDataResponseDto(user, isNewUser);

        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }


}
