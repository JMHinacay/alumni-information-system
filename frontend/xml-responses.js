export const checkStatusResponse = `<?xml version="1.0" encoding="UTF-8"?>
<STATUS
pAsOf="07-25-2012"
pAsOfTime="04:46:23PM">
<CLAIM
pClaimSeriesLhio="120723190000119"
pPin="190892937994"
pPatientLastName="ALARCON"
pPatientFirstName="MAMERTO"
pPatientMiddleName="TRIA"
pPatientSuffix=""
pAdmissionDate="05-02-2012"
pDischargeDate="05-06-2012"
pClaimDateReceived="05-15-2012"
pClaimDateRefile=""
pStatus="IN PROCESS">
<TRAIL>
<PROCESS pProcessStage="VALIDATION" pProcessDate="07-25-2012"/>
<PROCESS pProcessStage="EDITING" pProcessDate="07-25-2012"/>
<PROCESS pProcessStage="VALIDATION" pProcessDate="07-23-2012"/>
<PROCESS pProcessStage="EDITING (RECEIVING)" pProcessDate="07-23-2012"/>
<PROCESS pProcessStage="ENCODING" pProcessDate="07-23-2012"/>
<PROCESS pProcessStage="RECEIVING" pProcessDate="07-23-2012"/>
</TRAIL>
<RETURN>
<DEFECTS pDeficiency="LACKING FILES">
<REQUIREMENT pRequirement="BIRTH CERT"/>
<REQUIREMENT pRequirement="OTHER REQUIREMENTS"/>
</DEFECTS>
<DEFECTS pDeficiency="LACKING FILES">
<REQUIREMENT pRequirement="BIRTH CERT"/>
<REQUIREMENT pRequirement="OTHER REQUIREMENTS"/>
</DEFECTS>
</RETURN>
<DENIED>
<REASON pReason="asdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdf"/>
</DENIED>
<PAYMENT>
PTotalClaimAmountPaid="1000.00"
<PAYEE
pVoucherNo=""
pVoucherDate=""
pCheckNo=""
pCheckDate=""
pCheckAmount=""
pClaimAmount="600.00"
pClaimPayeeName=""/>
<PAYEE
pVoucherNo=""
pVoucherDate=""
pCheckNo=""
pCheckDate=""
pCheckAmount=""
pClaimAmount="400.00"
pClaimPayeeName=""/>
</PAYMENT>
</CLAIM>
</STATUS>
`;
