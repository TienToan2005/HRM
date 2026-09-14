package com.tientoan21.hrm.service;

import com.tientoan21.hrm.dto.reponse.UserDetailResponse;
import com.tientoan21.hrm.dto.request.ChangePasswordRequest;
import com.tientoan21.hrm.dto.request.MyProfileRequest;
import com.tientoan21.hrm.dto.request.UserRequest;
import com.tientoan21.hrm.enums.ErrorCode;
import com.tientoan21.hrm.enums.UserRole;
import com.tientoan21.hrm.exception.AppException;
import com.tientoan21.hrm.mapper.UserMapper;
import com.tientoan21.hrm.model.Department;
import com.tientoan21.hrm.model.Position;
import com.tientoan21.hrm.model.User;
import com.tientoan21.hrm.repository.DepartmentRepository;
import com.tientoan21.hrm.repository.PositionRepository;
import com.tientoan21.hrm.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final PositionRepository positionRepository;
    private final DepartmentRepository departmentRepository;

    @Transactional
    public UserDetailResponse createUser(UserRequest request){
        if (userRepository.existsByEmail(request.email())) {
            throw new AppException(ErrorCode.USER_EXISTS);
        }
        Department department = departmentRepository.findById(request.departmentId())
                .orElseThrow(() -> new AppException(ErrorCode.DEPARTMENT_NOT_FOUND));
        Position position = positionRepository.findById(request.positionId())
                .orElseThrow(() -> new AppException(ErrorCode.POSITION_NOT_FOUND));

        User user = User.builder()
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .fullName(request.fullName())
                .phoneNumber(request.phoneNumber())
                .address(request.address())
                .birthday(request.birthday())
                .department(department)
                .position(position)
                .role(UserRole.EMPLOYEE)
                .build();

        User saved = userRepository.save(user);
        return userMapper.toUserDetailResponse(saved);
    }
    public Page<UserDetailResponse> searchUsers(String keyword, Long departmentId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);

        Page<User> userPage = userRepository.searchUsers(keyword, departmentId, pageable);

        return userPage.map(userMapper::toUserDetailResponse);
    }

    public UserDetailResponse getUser(Long id){
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        return userMapper.toUserDetailResponse(user);
    }
    public UserDetailResponse getMyProfile(){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        return userMapper.toUserDetailResponse(user);
    }
    @Transactional
    public UserDetailResponse updateUsers(Long id, UserRequest request){
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        if (!user.getEmail().equals(request.email()) && userRepository.existsByEmail(request.email())) {
            throw new AppException(ErrorCode.EMAIL_ALREADY_EXISTS);
        }
        if (request.departmentId() != null) {
            Department department = departmentRepository.findById(request.departmentId())
                    .orElseThrow(() -> new AppException(ErrorCode.DEPARTMENT_NOT_FOUND));
            user.setDepartment(department);
        } else {
            user.setDepartment(null);
        }
        if (request.positionId() != null) {
            Position position = positionRepository.findById(request.positionId())
                    .orElseThrow(() -> new AppException(ErrorCode.POSITION_NOT_FOUND));
            user.setPosition(position);
        } else {
            user.setPosition(null);
        }

        user.setEmail(request.email());
        user.setPhoneNumber(request.phoneNumber());
        user.setAddress(request.address());
        user.setBirthday(request.birthday());
        User saved = userRepository.save(user);

        return userMapper.toUserDetailResponse(saved);
    }
    @Transactional
    public UserDetailResponse updateMyProfile(MyProfileRequest request){
        Long userId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        user.setPhoneNumber(request.phoneNumber());
        user.setAddress(request.address());
        user.setBirthday(request.birthday());
        User saved = userRepository.save(user);

        return userMapper.toUserDetailResponse(saved);
    }
    @Transactional
    public void deleteUser(Long id){
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        String currentHrEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        user.setDeletedAt(LocalDateTime.now());
        user.setDeletedBy(currentHrEmail);
        userRepository.save(user);
    }
    @Transactional
    public void changePassword(ChangePasswordRequest request){
        Long userId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        if(!passwordEncoder.matches(request.oldPassword(), user.getPassword())){
            throw new AppException(ErrorCode.INVALID_CREDENTIALS);
        }
        if(!request.newPassword().equals(request.confirmPassword())){
            throw new AppException(ErrorCode.CONFIRM_PASSWORD);
        }
        user.setPassword(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);
    }
}
