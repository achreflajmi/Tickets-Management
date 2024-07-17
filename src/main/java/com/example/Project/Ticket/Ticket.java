package com.example.Project.Ticket;

import com.example.Project.User.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder // Added this line
@ToString
@Entity
@Table(name = "tickets")
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false, name = "subject", length = 45)
    private String subject;

    @Column(nullable = false, name = "username", length = 45)
    private String username;

    @Column(nullable = false, name = "date")
    private LocalDate date;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, name = "type")
    private Type type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, name = "status")
    private Status status;

    @Getter
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, name = "priority")
    private Priority priority;

    @Column(name = "closure_date")
    private LocalDate closureDate;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    @ManyToOne
    @JoinColumn(name = "assigned_admin_id")
    private User assignedAdmin;

    public enum Type {
        Incident, Suggestion, Question, Problem
    }

    public enum Status {
        New, InProgress, Resolved, Closed
    }

    public enum Priority {
        LOW, MEDIUM, HIGH
    }

    // Constructor without id and user for mapper usage
    public Ticket(String subject, String username, LocalDate date, Type type, Status status, Priority priority, LocalDate closureDate) {
        this.subject = subject;
        this.username = username;
        this.date = date;
        this.type = type;
        this.status = status;
        this.priority = priority;
        this.closureDate = closureDate;
    }

}
