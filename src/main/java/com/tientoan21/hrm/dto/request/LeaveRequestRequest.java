package com.tientoan21.hrm.dto.request;

import jakarta.validation.constraints.Pattern;

import java.time.LocalDate;

public record LeaveRequestRequest(
        @Pattern(regexp = "^\\d{4}-\\d{2}-\\d{2}$", message = "The date must be in yyyy-MM-dd format.")
        LocalDate dateFrom,
        @Pattern(regexp = "^\\d{4}-\\d{2}-\\d{2}$", message = "The date must be in yyyy-MM-dd format.")
        LocalDate dateTo,
        String reason
) {
}
