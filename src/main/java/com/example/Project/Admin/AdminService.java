package com.example.Project.Admin;

import com.example.Project.User.User;
import com.example.Project.User.UserRepository;
import com.example.Project.role.Role;
import com.example.Project.role.RoleRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public void promoteToAdmin(int userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        Role adminRole = roleRepository.findByName("ADMIN")
                .orElseThrow(() -> new IllegalStateException("ROLE ADMIN not found"));

        if (!user.getRoles().contains(adminRole)) {
            user.getRoles().add(adminRole);
            userRepository.save(user);
        }
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public void demoteToUser(int userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        Role adminRole = roleRepository.findByName("ADMIN")
                .orElseThrow(() -> new IllegalStateException("ROLE ADMIN not found"));

        user.getRoles().remove(adminRole);
        userRepository.save(user);
    }
}
