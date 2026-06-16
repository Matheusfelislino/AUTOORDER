package com.autoorder.shared.events;

import com.autoorder.translation.domain.TranslatedOrderItem;
import java.util.List;

public record OrderTranslatedEvent(
        String messageId,
        String customerId,
        List<TranslatedOrderItem> items,
        String observation
) {}