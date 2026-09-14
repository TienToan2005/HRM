package com.tientoan21.hrm.dto.reponse;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.tientoan21.hrm.enums.RequestStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class LeaveRequestResponse {
    private LocalDate dateFrom;
    private LocalDate dateTo;
    private String reason;
    private RequestStatus status;
    private Long userId;
}
