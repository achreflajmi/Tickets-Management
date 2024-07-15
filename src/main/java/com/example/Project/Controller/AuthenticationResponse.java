package com.example.Project.Controller;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
public class AuthenticationResponse {
    private String token;
    private List<String> roles;  // Update to List<String> to handle multiple roles
}
