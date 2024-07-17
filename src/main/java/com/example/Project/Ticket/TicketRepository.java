package com.example.Project.Ticket;

import com.example.Project.User.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Integer>, JpaSpecificationExecutor<Ticket> {
    Page<Ticket> findAllByUserId(Integer userId, Pageable pageable);
    List<Ticket> findByAssignedAdmin(User assignedAdmin);
    List<Ticket> findByUser(User user);
}