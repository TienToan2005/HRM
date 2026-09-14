package com.tientoan21.hrm.mapper;

import com.tientoan21.hrm.dto.reponse.DepartmentResponse;
import com.tientoan21.hrm.model.Department;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface DepartmentMapper {
    DepartmentResponse toDepartmentResponse(Department department);
}
