package com.tientoan21.hrm.mapper;

import com.tientoan21.hrm.dto.reponse.SalaryResponse;
import com.tientoan21.hrm.model.Salary;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface SalaryMapper {
    SalaryResponse toSalaryResponse(Salary salary);
}
