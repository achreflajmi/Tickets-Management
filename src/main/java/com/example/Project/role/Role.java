    package com.example.Project.role;

    import com.example.Project.User.User;
    import com.fasterxml.jackson.annotation.JsonIgnore;
    import jakarta.persistence.*;
    import lombok.AllArgsConstructor;
    import lombok.Builder;
    import lombok.Getter;
    import lombok.NoArgsConstructor;
    import lombok.Setter;
    import org.springframework.data.annotation.CreatedDate;
    import org.springframework.data.annotation.LastModifiedDate;
    import org.springframework.data.jpa.domain.support.AuditingEntityListener;

    import java.time.LocalDateTime;
    import java.util.List;

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Entity
    @Table(name = "role")
    @EntityListeners(AuditingEntityListener.class)
    public class Role {

        @Id
        @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "role_seq")
        @SequenceGenerator(name = "role_seq", sequenceName = "role_seq", allocationSize = 1)
        private Integer id;

        @Column(unique = true)
        private String name;

        @ManyToMany(mappedBy = "roles")
        @JsonIgnore
        private List<User> users;


        @CreatedDate
        @Column(nullable = false, updatable = false)
        private LocalDateTime createdDate;

        @LastModifiedDate
        @Column(insertable = false)
        private LocalDateTime lastModifiedDate;

        // Constructors, getters, and setters
    }
