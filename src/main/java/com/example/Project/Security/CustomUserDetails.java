package com.example.Project.Security;

import com.example.Project.User.User;
import com.example.Project.User.UserRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collection;

public class CustomUserDetails implements UserDetails {
    private final Integer id;
    private final String firstname;
    private final String lastname;
    private final LocalDate dateOfBirth;
    private final String email;
    private final LocalDateTime createdDate;
    private final LocalDateTime lastModifiedDate;
    private final Collection<? extends GrantedAuthority> authorities;


    public CustomUserDetails(User user) {
        this.id = user.getId();
        this.firstname = user.getFirstname();
        this.lastname = user.getLastname();
        this.dateOfBirth = user.getDateOfBirth();
        this.email = user.getEmail();
        this.createdDate = user.getCreatedDate();
        this.lastModifiedDate = user.getLastModifiedDate();
        this.authorities = user.getAuthorities();
    }

    public Integer getId() {
        return id;
    }

    public String getFirstname() {
        return firstname;
    }

    public String getLastname() {
        return lastname;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public String getEmail() {
        return email;
    }

    public LocalDateTime getCreatedDate() {
        return createdDate;
    }

    public LocalDateTime getLastModifiedDate() {
        return lastModifiedDate;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return null; // Password should not be exposed
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }


}
