package com.tientoan21.hrm.dto.request;

import java.util.List;

public record DepartmentRequest(
        String name,
        String description,
        Long managerId,
        List<Long> ListUserId
) {
}
