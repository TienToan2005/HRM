package com.tientoan21.hrm.dto.reponse;


import lombok.*;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class ApiResponse<T> {
    @Builder.Default
    private int code = 100;
    @Builder.Default
    private String message = "Success";
    private T data;
}
