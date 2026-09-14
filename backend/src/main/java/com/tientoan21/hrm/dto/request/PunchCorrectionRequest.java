package com.tientoan21.hrm.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record PunchCorrectionRequest(
        @NotNull(message = "Target date is required")
        LocalDate targetDate,
        LocalDateTime requestedInTime,
        LocalDateTime requestedOutTime,
        @NotBlank(message = "Reason cannot be blank")
        String reason
) {
}
