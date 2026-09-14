package com.tientoan21.hrm.mapper;

import com.tientoan21.hrm.dto.reponse.AttendanceRecordResponse;
import com.tientoan21.hrm.model.AttendanceRecord;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface AttendanceRecordMapper {
    AttendanceRecordResponse toAttendanceRecordResponse(AttendanceRecord attendanceRecord);
}
