package com.tientoan21.hrm.dto.request;

import jakarta.validation.constraints.NotNull;


import java.time.LocalDateTime;

public record RawPunchRequest(
        @NotNull(message = "User ID is required")
        Long userId,
        @NotNull(message = "Punch time is required")
        LocalDateTime punchTime
) {

}
