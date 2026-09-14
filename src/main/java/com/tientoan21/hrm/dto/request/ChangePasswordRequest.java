package com.tientoan21.hrm.dto.request;

import jakarta.validation.constraints.NotBlank;

public record ChangePasswordRequest(
        @NotBlank(message = "Password cannot be blank or contain only spaces.")
        String oldPassword,
        @NotBlank(message = "Password cannot be blank or contain only spaces.")
        String newPassword,
        @NotBlank(message = "Password cannot be blank or contain only spaces.")
        String confirmPassword
) {
}
