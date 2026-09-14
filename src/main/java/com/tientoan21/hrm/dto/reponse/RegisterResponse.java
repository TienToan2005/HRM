package com.tientoan21.hrm.dto.reponse;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.tientoan21.hrm.enums.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class RegisterResponse {
    private Long userId;
    private String email;
    private UserRole role;
}
