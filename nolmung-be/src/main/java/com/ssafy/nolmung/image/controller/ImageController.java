package com.ssafy.nolmung.image.controller;

import com.ssafy.nolmung.image.service.ImageService;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@RequestMapping("/image")
@RestController
@Slf4j
public class ImageController {

    @Autowired
    ImageService imageService;

    @PostMapping(value="/board/{boardId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity uploadBoardImage(@PathVariable int boardId, @RequestPart("files") List<MultipartFile> files) {
        HashMap<String, List<String>> map = new HashMap<>();
        List<String> result = new ArrayList<>();
        result = imageService.uploadBoardImages(boardId, files);
        map.put("imgUrl", result);
        return new ResponseEntity(map, HttpStatus.OK);
    }

    @ApiOperation(value = "강아지 이미지 업로드", notes = "이미지의 url을 통해 S3에 이미지를 업로드하는 API")
    @PostMapping(value="/puppy/{puppyId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity uploadPuppyImage(@PathVariable int puppyId, @RequestPart("files") MultipartFile file) {
        HashMap<String, Object> result = new HashMap<>();
        String imageUrl;

        try {
            imageUrl = imageService.uploadPuppyImage(puppyId, file);
            result.put("message", "success");
            result.put("puppyImgUrl", imageUrl);
            result.put("puppyId", puppyId);
            return new ResponseEntity(result, HttpStatus.OK);
        }catch (Exception e){
            result.put("message", "[error] - 강아지 이미지 업로드 오류");
            result.put("puppyId", puppyId);
            return new ResponseEntity(result, HttpStatus.BAD_REQUEST);
        }
    }

    @ApiOperation(value = "유저 이미지 업로드", notes = "이미지의 url을 통해 S3에 이미지를 업로드하는 API")
    @PostMapping(value="/user/{userId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity uploadUserImage(@PathVariable int userId, @RequestPart("files") MultipartFile file) {
        HashMap<String, Object> result = new HashMap<>();
        String imageUrl;
        log.info("통신은 되는 중: {}", userId);
        log.info("통신은 되는 중: {}", file.getName());

        try {
            imageUrl = imageService.uploadUserImage(userId, file);
            result.put("message", "success");
            result.put("userImgUrl", imageUrl);
            result.put("userId", userId);
            return new ResponseEntity(result, HttpStatus.OK);
        }catch (Exception e){
            result.put("message", "[error] - 유저 이미지 업로드 오류");
            result.put("userId", userId);
            return new ResponseEntity(result, HttpStatus.BAD_REQUEST);
        }
    }

    @ApiOperation(value = "랜드마크 방명록 이미지 업로드", notes = "이미지의 url을 통해 S3에 이미지를 업로드하는 API")
    @PostMapping(value="/landmarkBoard/{landmarkBoardId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity uploadlandmarkBoardImage(@PathVariable int landmarkBoardId, @RequestPart("files") MultipartFile file) {
        HashMap<String, Object> result = new HashMap<>();
        String imageUrl;

        try {
            imageUrl = imageService.uploadlandmarkBoardImage(landmarkBoardId, file);
            result.put("message", "success");
            result.put("boardImgUrl", imageUrl);
            result.put("landmarkBoardId", landmarkBoardId);
            return new ResponseEntity(result, HttpStatus.OK);
        }catch (Exception e){
            result.put("message", "[error] - 랜드마크 방명록 이미지 업로드 오류");
            result.put("landmarkBoardId", landmarkBoardId);
            return new ResponseEntity(result, HttpStatus.BAD_REQUEST);
        }
    }

    @ApiOperation(value = "산책 기록 이미지 업로드", notes = "이미지의 url을 통해 S3에 이미지를 업로드하는 API")
    @PostMapping(value="/walk/{walkId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity uploadWalkImage(@PathVariable int walkId, @RequestPart("files") MultipartFile file) {
        HashMap<String, Object> result = new HashMap<>();
        String imageUrl;

        try {
            imageUrl = imageService.uploadWalkImage(walkId, file);
            result.put("message", "success");
            result.put("boardImgUrl", imageUrl);
            result.put("walkId", walkId);
            return new ResponseEntity(result, HttpStatus.OK);
        }catch (Exception e){
            result.put("message", "[error] - 산책 기록 이미지 업로드 오류");
            result.put("walkId", walkId);
            return new ResponseEntity(result, HttpStatus.BAD_REQUEST);
        }
    }


}
