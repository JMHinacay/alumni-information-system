package com.backend.gbp.domain.enums;

public enum UserActivityStatus {
    //ongoing
    FOR_APPROVAL, PENDING, FOR_TRANSMISSION, FINAL_STEP,
    //finished
    APPROVED, TRANSMITTED, FORWARDED, REROUTED
}
