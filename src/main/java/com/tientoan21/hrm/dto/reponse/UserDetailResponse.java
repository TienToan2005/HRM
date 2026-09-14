package com.tientoan21.hrm.dto.reponse;


import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.tientoan21.hrm.enums.UserRole;
import lombok.*;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonFormat(pattern = "dd/MM/yyyy")
public class UserDetailResponse {
    private Long userId;
    private String email;
    private String phoneNumber;
    private String fullName;
    private LocalDate birthday;
    private String address;
    private UserRole role;
    private String departmentName;
    private String positionName;
}
