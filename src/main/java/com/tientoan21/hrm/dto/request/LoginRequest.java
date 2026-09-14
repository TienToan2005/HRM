package com.tientoan21.hrm.dto.request;

import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @NotBlank(message = "Email cannot be blank or contain only spaces.")
        String email,
        @NotBlank(message = "Password cannot be blank or contain only spaces.")
        String password
) {
}
