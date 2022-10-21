package com.ssafy.nolmung.user.domain;

import lombok.*;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.validation.constraints.NotBlank;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User {

    @Column(name = "userId")
    @Id
    @NotBlank
    private String userId;


    @Builder
    public User (String userId) {
        this.userId = userId;
    }
}
