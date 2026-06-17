package com.autoorder.order.api;

import com.autoorder.order.application.OrderService;
import com.autoorder.order.domain.OrderStatus;
import com.autoorder.order.infrastructure.OrderRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderRepository orderRepository;
    private final OrderService orderService;

    @GetMapping
    public ResponseEntity<Page<OrderSummary>> listOrders(
            @RequestParam(required = false) OrderStatus status,
            @PageableDefault(size = 20, sort = "createdAt") Pageable pageable
    ) {
        Page<OrderSummary> page = status != null
                ? orderRepository.findAllProjectedByStatus(status, pageable)
                : orderRepository.findAllProjectedBy(pageable);
        return ResponseEntity.ok(page);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderDetailResponse> getOrder(@PathVariable UUID id) {
        return orderRepository.findByIdWithItems(id)
                .map(order -> orderService.buildDetailResponse(order))
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new EntityNotFoundException("Order not found: " + id));
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<OrderDetailResponse> approveOrder(@PathVariable UUID id) {
        return ResponseEntity.ok(orderService.buildDetailResponse(orderService.approve(id)));
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<OrderDetailResponse> rejectOrder(@PathVariable UUID id) {
        return ResponseEntity.ok(orderService.buildDetailResponse(orderService.reject(id)));
    }
}
