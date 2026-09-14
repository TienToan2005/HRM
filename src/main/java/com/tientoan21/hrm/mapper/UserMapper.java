package com.tientoan21.hrm.mapper;

import com.tientoan21.hrm.dto.reponse.RegisterResponse;
import com.tientoan21.hrm.dto.reponse.UserDetailResponse;
import com.tientoan21.hrm.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {
    @Mapping(source = "id", target = "userId")
    RegisterResponse toRegisterResponse(User user);

    @Mapping(source = "id", target = "userId")
    UserDetailResponse toUserDetailResponse(User user);
}
