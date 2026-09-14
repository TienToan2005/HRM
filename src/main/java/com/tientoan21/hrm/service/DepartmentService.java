package com.tientoan21.hrm.service;

import com.tientoan21.hrm.dto.reponse.DepartmentResponse;
import com.tientoan21.hrm.dto.request.DepartmentRequest;
import com.tientoan21.hrm.dto.request.UpdateDepartmentRequest;
import com.tientoan21.hrm.enums.ErrorCode;
import com.tientoan21.hrm.exception.AppException;
import com.tientoan21.hrm.mapper.DepartmentMapper;
import com.tientoan21.hrm.model.Department;
import com.tientoan21.hrm.model.User;
import com.tientoan21.hrm.repository.DepartmentRepository;
import com.tientoan21.hrm.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DepartmentService {
    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;
    private final DepartmentMapper departmentMapper;

    @Transactional
    public DepartmentResponse createDepartment(DepartmentRequest request){
        if(departmentRepository.findByName(request.name()).isPresent()){
            throw new AppException(ErrorCode.DEPARTMENT_EXISTS);
        }

        User managerUser = userRepository.findById(request.managerId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        Department department = Department.builder()
                .name(request.name())
                .description(request.description())
                .manager(managerUser)
                .build();
        Department saved = departmentRepository.save(department);

        if(request.ListUserId() != null && !request.ListUserId().isEmpty()){
            List<User> users = userRepository.findAllById(request.ListUserId());
            users.forEach(user -> user.setDepartment(saved));
            userRepository.saveAll(users);
        }

        return departmentMapper.toDepartmentResponse(saved);
    }
    public Page<DepartmentResponse> searchDepartment(String keyword, int page, int size){
        Pageable pageable = PageRequest.of(page,size);

        Page<Department> departmentPage = departmentRepository.searchByName(keyword,pageable);

        return departmentPage.map(departmentMapper::toDepartmentResponse);
    }
    @Transactional
    public DepartmentResponse updateDepartment(Long id, UpdateDepartmentRequest request){
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.DEPARTMENT_NOT_FOUND));

        if (!department.getName().equals(request.name()) &&
                departmentRepository.findByName(request.name()).isPresent()) {
            throw new AppException(ErrorCode.DEPARTMENT_EXISTS);
        }
        department.setName(request.name());
        department.setDescription(request.description());

        Department saved = departmentRepository.save(department);

        return departmentMapper.toDepartmentResponse(saved);
    }
    @Transactional
    public void deleteDepartment(Long id){
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.DEPARTMENT_NOT_FOUND));

        if(userRepository.existsByDepartment_IdAndDeletedAtIsNull(id)){
            throw new AppException(ErrorCode.DEPARTMENT_NOT_EMPTY);
        }

        String currentHrEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        department.setDeletedAt(LocalDateTime.now());
        department.setDeletedBy(currentHrEmail);
        departmentRepository.save(department);
    }
}
