package com.tientoan21.hrm.dto.request;

import jakarta.validation.constraints.Pattern;

import java.time.LocalDate;

public record MyProfileRequest(
        @Pattern(regexp = "^0\\d{9}$", message = "The phone number must start with the number 0 and have exactly 10 digits.")
        String phoneNumber,
        String address,
        LocalDate birthday
) {
}
