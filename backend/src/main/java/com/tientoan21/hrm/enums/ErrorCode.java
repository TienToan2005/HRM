package com.tientoan21.hrm.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;

@AllArgsConstructor
@NoArgsConstructor
@Getter
public enum ErrorCode {
    INVALID_CREDENTIALS(1000,HttpStatus.BAD_REQUEST,"INVALID_CREDENTIALS"),
    USER_NOT_FOUND(1001,HttpStatus.NOT_FOUND,"User not found"),
    USER_EXISTS(1002,HttpStatus.BAD_REQUEST, "User already exists"),
    EMAIL_ALREADY_EXISTS(1007,HttpStatus.NOT_FOUND,"Email already exists"),
    INVALID_OTP(1008,HttpStatus.BAD_REQUEST,"Incorrect OTP"),
    USER_ALREADY_VERIFIED(1009,HttpStatus.BAD_REQUEST, "USER_ALREADY_VERIFIED"),
    CONFIRM_PASSWORD(1010,HttpStatus.BAD_REQUEST,"Confirm password does not match"),
    CANNOT_BLOCK_ADMIN(1011,HttpStatus.BAD_REQUEST, "CANNOT_BLOCK_ADMIN"),
    UNAUTHENTICATED(1012, HttpStatus.UNAUTHORIZED, "Invalid Token"),
    UNAUTHORIZED(1013, HttpStatus.FORBIDDEN, "Unauthorized access"),
    DEPARTMENT_NOT_FOUND(1014,HttpStatus.NOT_FOUND,"Department not found"),
    POSITION_NOT_FOUND(1015,HttpStatus.NOT_FOUND,"Position not found"),
    DEPARTMENT_EXISTS(1016,HttpStatus.BAD_REQUEST, "DEPARTMENT already exists"),
    POSITION_EXISTS(1017,HttpStatus.BAD_REQUEST, "POSITION already exists"),
    DEPARTMENT_NOT_EMPTY(1018,HttpStatus.BAD_REQUEST,"The department still has staff"),
    LEAVE_REQUEST_NOT_FOUND(1019,HttpStatus.NOT_FOUND,"LeaveRequest not found"),
    INVALID_STATUS(1019,HttpStatus.BAD_REQUEST,"Only applications with a Pending status can be approved!"),
    INVALID_DATE_RANGE(1020,HttpStatus.BAD_REQUEST,"The start date cannot be later than the end dat"),
    ATTENDANCE_RECORD_NOT_FOUND(1019,HttpStatus.NOT_FOUND,"AttendanceRecord not found"),
    REQUEST_NOT_FOUND(1020,HttpStatus.BAD_REQUEST,"Request not found"),
    REQUEST_ALREADY_PROCESSED(1021,HttpStatus.BAD_REQUEST,"REQUEST_ALREADY_PROCESSED"),
    RECORD_NOT_FOUND(1022,HttpStatus.BAD_REQUEST,"Recode not found"),
    UNAUTHORIZED_APPROVAL(1024,HttpStatus.FORBIDDEN,"UNAUTHORIZED_APPROVAL"),
    CONTRACT_NOT_FOUND(1025,HttpStatus.BAD_REQUEST,"Contract not found"),
    PAYCHECK_NOT_FOUND(1026,HttpStatus.BAD_REQUEST,"Paycheck not found"),
    ALREADY_PAID(1027,HttpStatus.BAD_REQUEST,"ALREADY_PAID"),

    INTERNAL_SERVER_ERROR(9999, HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occurred");
    private int code;
    private HttpStatus status;
    private String message;

}
