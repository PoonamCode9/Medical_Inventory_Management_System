package com.medical.om.om_backend.Dto;

import com.medical.om.om_backend.entity.Role;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserDto {
    private String name;
    private String username;
    private String password;
    private Role role;
}
