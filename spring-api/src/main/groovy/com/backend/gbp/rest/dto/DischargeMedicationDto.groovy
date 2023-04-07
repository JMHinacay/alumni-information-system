package com.backend.gbp.rest.dto

class DischargeMedicationDto {
	MedicineDto medicine
	UUID dosage
	String instructions
}

class MedicineDto {
	UUID id
	String descLong
	String __typename
}

class DischargeMedicationDto2 {
	String medication, dosage, instructions, breakfast_instructions, breakfast, lunch_instructions, lunch, supper_instructions, supper, bedtime, qty
}
