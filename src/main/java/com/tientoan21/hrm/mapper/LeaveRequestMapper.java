package com.tientoan21.hrm.mapper;

import com.tientoan21.hrm.dto.reponse.LeaveRequestResponse;
import com.tientoan21.hrm.model.LeaveRequest;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface LeaveRequestMapper {
    LeaveRequestResponse toLeaveRequestResponse(LeaveRequest leaveRequest);
}
