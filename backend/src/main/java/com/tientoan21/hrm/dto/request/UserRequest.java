package com.tientoan21.hrm.dto.request;

import com.tientoan21.hrm.enums.UserRole;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

import java.time.LocalDate;

public record UserRequest(
        @NotBlank(message = "fullName cannot be blank or contain only spaces.")
        String fullName,
        @NotBlank(message = "Password cannot be blank or contain only spaces.")
        String password,
        @NotBlank(message = "Email cannot be blank or contain only spaces.")
        String email,
        @Pattern(regexp = "^0\\d{9}$", message = "The phone number must start with the number 0 and have exactly 10 digits.")
        String phoneNumber,
        String address,
        LocalDate birthday,
        Long departmentId,
        Long positionId,
        UserRole role
) { }
