package com.example.Project.Ticket;

import org.springframework.data.jpa.domain.Specification;

public class TicketSpecification {

    public static Specification<Ticket> withUserId(Integer userId) {
        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("user").get("id"), userId);
    }
}
