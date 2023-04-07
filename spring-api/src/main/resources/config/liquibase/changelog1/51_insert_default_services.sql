-- relocation

INSERT INTO public.service( id, service_name, service_cost, status, service_type, allow_multiple_lot, excess_hectare_cost, excess_corner_cost, created_by, last_modified_by, deleted, last_step )
VALUES ('c2afa406-444e-4627-a4b2-ab11da8063a1','Relocation', 6000, true,'Main Services', true, 2000, 1000,'admin','admin', false, 'RELEASE_SKETCH_PLAN');

INSERT INTO public.service_step VALUES ('5c0b616a-ba2d-4203-8b5e-f9b409c564da','TRANSMIT_LDC_AND_CAD_MAP', 'c2afa406-444e-4627-a4b2-ab11da8063a1', 1);
INSERT INTO public.service_step VALUES ('1198510f-8788-4190-acdf-25900fa90fc4','TRANSMIT_SKETCH_PLAN', 'c2afa406-444e-4627-a4b2-ab11da8063a1', 2);
INSERT INTO public.service_step VALUES ('1334d50e-9744-4fb1-a591-30abda695a88','APPROVE_SKETCH_PLAN', 'c2afa406-444e-4627-a4b2-ab11da8063a1', 3);
INSERT INTO public.service_step VALUES ('46e3eceb-6216-4d03-9c6a-2ffdf2953fbc','VERIFY_SKETCH_PLAN', 'c2afa406-444e-4627-a4b2-ab11da8063a1', 4);
INSERT INTO public.service_step VALUES ('d8f72465-8233-4ae0-87bc-4ebeeeb9adf4','RELEASE_SKETCH_PLAN', 'c2afa406-444e-4627-a4b2-ab11da8063a1',5 );

-- subdivision titled




INSERT INTO public.service( id, service_name, service_cost, status, service_type, allow_multiple_lot, excess_hectare_cost, excess_corner_cost, created_by, last_modified_by, deleted, last_step  )
VALUES ('7d8148aa-4292-4e58-be55-6c7aecf74bcf','Subdivision (Titled)', 6000, true,'Main Services', false, 3000, 1000,'admin','admin', false , 'RELEASE_APPROVED_PLAN');

INSERT INTO public.service_step VALUES ('7ffcb226-a2b7-4804-b8f3-9b9ceb267c31','TRANSMIT_LDC_AND_CAD_MAP', '7d8148aa-4292-4e58-be55-6c7aecf74bcf',1 );
INSERT INTO public.service_step VALUES ('56777515-7d12-42ce-a6ac-ea12a4c776b8','TRANSMIT_SKETCH_PLAN', '7d8148aa-4292-4e58-be55-6c7aecf74bcf',2 );
INSERT INTO public.service_step VALUES ('17a9cd67-f27c-4b7e-81a2-1e45c26c9c82','APPROVE_SKETCH_PLAN', '7d8148aa-4292-4e58-be55-6c7aecf74bcf',3 );
INSERT INTO public.service_step VALUES ('63403502-ae4d-4cbb-8cab-79d2d9a602f0','VERIFY_SKETCH_PLAN', '7d8148aa-4292-4e58-be55-6c7aecf74bcf',4 );
INSERT INTO public.service_step VALUES ('e06271a6-27ca-41e9-a8ce-7a304640e89c','RELEASE_SKETCH_PLAN', '7d8148aa-4292-4e58-be55-6c7aecf74bcf',5 );
INSERT INTO public.service_step VALUES ('68cde4cc-b38e-4bc2-a82e-5e30a6ab018c','TRANSMIT_BL_PLAN', '7d8148aa-4292-4e58-be55-6c7aecf74bcf',6 );
INSERT INTO public.service_step VALUES ('7e6fdd0e-09f1-41fa-a220-4ed14f2b4477','APPROVE_BL_PLAN', '7d8148aa-4292-4e58-be55-6c7aecf74bcf',7 );
INSERT INTO public.service_step VALUES ('e10fd623-0427-4bc8-aa21-83a757cdc0ad','VERIFY_BL_PLAN', '7d8148aa-4292-4e58-be55-6c7aecf74bcf',8 );
INSERT INTO public.service_step VALUES ('bce0467e-1c87-4710-80ea-e8983c3044e7','DENR_REGION_UPDATES', '7d8148aa-4292-4e58-be55-6c7aecf74bcf',9 );
INSERT INTO public.service_step VALUES ('660cf729-ff6e-4861-ae35-7668e11c0d14','SIGN_APPROVED_PLAN', '7d8148aa-4292-4e58-be55-6c7aecf74bcf',10 );
INSERT INTO public.service_step VALUES ('93db595d-c736-4cde-8f58-e80991db4fda','VERIFY_SIGNED_APPROVED_PLAN', '7d8148aa-4292-4e58-be55-6c7aecf74bcf',11);
INSERT INTO public.service_step VALUES ('162c4618-f738-4a2f-874e-ab1d2a248f28','RELEASE_APPROVED_PLAN', '7d8148aa-4292-4e58-be55-6c7aecf74bcf',12);




-- Subdivision untitled


INSERT INTO public.service( id, service_name, service_cost, status, service_type, allow_multiple_lot, excess_hectare_cost, excess_corner_cost, created_by, last_modified_by, deleted, last_step  )
VALUES ('9eadd08f-e9fa-4fc7-881f-a920f348fb95','Subdivision (Untitled)', 6000, true,'Main Services', true, 3000, 1000,'admin','admin', false, 'RELEASE_APPROVED_PLAN');

INSERT INTO public.service_step VALUES ('a6d3da9a-e9d2-445b-a136-2707d844d9f8','TRANSMIT_LDC_AND_CAD_MAP', '9eadd08f-e9fa-4fc7-881f-a920f348fb95',1 );
INSERT INTO public.service_step VALUES ('bc599745-42bd-40f6-8e0e-f60ed479b729','TRANSMIT_SKETCH_PLAN', '9eadd08f-e9fa-4fc7-881f-a920f348fb95',2 );
INSERT INTO public.service_step VALUES ('e53adcbb-681a-4173-9d4d-c61bac6c69f1','APPROVE_SKETCH_PLAN', '9eadd08f-e9fa-4fc7-881f-a920f348fb95',3 );
INSERT INTO public.service_step VALUES ('9d08a17f-e6ba-4849-afd4-95f8cce10484','VERIFY_SKETCH_PLAN', '9eadd08f-e9fa-4fc7-881f-a920f348fb95',4 );
INSERT INTO public.service_step VALUES ('dcbcd411-9c34-4ab6-a23a-9e81f66c81d8','RELEASE_SKETCH_PLAN', '9eadd08f-e9fa-4fc7-881f-a920f348fb95',5 );
INSERT INTO public.service_step VALUES ('12307934-34da-4b0c-b013-ab343c575d27','TRANSMIT_BL_PLAN', '9eadd08f-e9fa-4fc7-881f-a920f348fb95',6 );
INSERT INTO public.service_step VALUES ('cdb03a61-e69f-4ee3-b5ce-f0ca8cfa0d0f','APPROVE_BL_PLAN', '9eadd08f-e9fa-4fc7-881f-a920f348fb95',7 );
INSERT INTO public.service_step VALUES ('2d521d7f-e979-4d23-a430-70da07d2dd41','VERIFY_BL_PLAN', '9eadd08f-e9fa-4fc7-881f-a920f348fb95',8 );
INSERT INTO public.service_step VALUES ('6cf140b7-8e71-4ef4-8b69-e8bf45888374','SURVEY_AUTHORITY_REQUIREMENTS', '9eadd08f-e9fa-4fc7-881f-a920f348fb95',9 );
INSERT INTO public.service_step VALUES ('af3e87f6-45ee-4f06-ac29-dd788466b62c','SURVEY_AUTHORITY_UPDATES', '9eadd08f-e9fa-4fc7-881f-a920f348fb95',10 );
INSERT INTO public.service_step VALUES ('0dc6a1a2-f20a-4fda-9aa8-20e82c4f557b','DENR_REGION_UPDATES', '9eadd08f-e9fa-4fc7-881f-a920f348fb95',11 );
INSERT INTO public.service_step VALUES ('995f2a07-5324-412f-85e5-122ff445da7b','SIGN_APPROVED_PLAN', '9eadd08f-e9fa-4fc7-881f-a920f348fb95',12 );
INSERT INTO public.service_step VALUES ('59a454d0-8e16-456f-a70e-7811dfa7522c','VERIFY_SIGNED_APPROVED_PLAN', '9eadd08f-e9fa-4fc7-881f-a920f348fb95',13);
INSERT INTO public.service_step VALUES ('a668dc12-ef53-4a85-94c0-3642bb8e21d7','RELEASE_APPROVED_PLAN', '9eadd08f-e9fa-4fc7-881f-a920f348fb95',14);



-- consolidation titled


INSERT INTO public.service( id, service_name, service_cost, status, service_type, allow_multiple_lot, excess_hectare_cost, excess_corner_cost, created_by, last_modified_by, deleted, last_step  )
VALUES ('00cc2d11-3baa-409a-822e-c02c62c8369d','Consolidation (Titled)', 6000, true,'Main Services', true, 3000, 1000,'admin','admin', false, 'RELEASE_APPROVED_PLAN');

INSERT INTO public.service_step VALUES ('e2a9659c-e71c-43ca-aa50-21cf3458c9d8','TRANSMIT_LDC_AND_CAD_MAP', '00cc2d11-3baa-409a-822e-c02c62c8369d',1 );
INSERT INTO public.service_step VALUES ('5933de78-1cda-4732-adf7-9485a37174c2','TRANSMIT_SKETCH_PLAN', '00cc2d11-3baa-409a-822e-c02c62c8369d',2 );
INSERT INTO public.service_step VALUES ('00c5f82d-89c3-4d70-9296-149e09b1eaba','APPROVE_SKETCH_PLAN', '00cc2d11-3baa-409a-822e-c02c62c8369d',3 );
INSERT INTO public.service_step VALUES ('1376eb52-d3ef-4931-8a89-4cdc53ff993a','VERIFY_SKETCH_PLAN', '00cc2d11-3baa-409a-822e-c02c62c8369d',4 );
INSERT INTO public.service_step VALUES ('472f4544-b7fc-476e-a6e9-915ac2499a60','RELEASE_SKETCH_PLAN', '00cc2d11-3baa-409a-822e-c02c62c8369d',5 );
INSERT INTO public.service_step VALUES ('d3a1aadf-f6f2-4ac8-bfdb-0c441575b58d','TRANSMIT_BL_PLAN', '00cc2d11-3baa-409a-822e-c02c62c8369d',6 );
INSERT INTO public.service_step VALUES ('8e1d0de2-6f9a-4c2e-8c1d-b2d475c2170f','APPROVE_BL_PLAN', '00cc2d11-3baa-409a-822e-c02c62c8369d',7 );
INSERT INTO public.service_step VALUES ('d459dbc7-0e3f-415e-827e-7ef99caea3a4','VERIFY_BL_PLAN', '00cc2d11-3baa-409a-822e-c02c62c8369d',8 );
INSERT INTO public.service_step VALUES ('faae6df4-1ff1-4b04-965a-9d0f5f8ddf03','DENR_REGION_UPDATES', '00cc2d11-3baa-409a-822e-c02c62c8369d',9 );
INSERT INTO public.service_step VALUES ('4918c4c3-2782-4054-82b7-7d5df76d6017','SIGN_APPROVED_PLAN', '00cc2d11-3baa-409a-822e-c02c62c8369d',10 );
INSERT INTO public.service_step VALUES ('008a015a-659c-41ac-a49f-ef2f156d294f','VERIFY_SIGNED_APPROVED_PLAN', '00cc2d11-3baa-409a-822e-c02c62c8369d',11);
INSERT INTO public.service_step VALUES ('a160edab-23c1-4746-a8c6-218b7fb26caf','RELEASE_APPROVED_PLAN', '00cc2d11-3baa-409a-822e-c02c62c8369d',12);




-- consolidation untitled


INSERT INTO public.service( id, service_name, service_cost, status, service_type, allow_multiple_lot, excess_hectare_cost, excess_corner_cost, created_by, last_modified_by, deleted, last_step  )
VALUES ('af83a579-4f77-496c-b8b8-5a0d5f9d56d5','Consolidation (Untitled)', 6000, true,'Main Services', true, 3000, 1000,'admin','admin', false, 'RELEASE_APPROVED_PLAN');

INSERT INTO public.service_step VALUES ('e0db5ece-c9cc-4fbd-acf1-ea82ac0703a1','TRANSMIT_LDC_AND_CAD_MAP', 'af83a579-4f77-496c-b8b8-5a0d5f9d56d5',1 );
INSERT INTO public.service_step VALUES ('10f2ebf0-8cdc-406f-811e-7fbff40da9ec','TRANSMIT_SKETCH_PLAN', 'af83a579-4f77-496c-b8b8-5a0d5f9d56d5',2 );
INSERT INTO public.service_step VALUES ('d00d7521-108a-436c-8646-f217f26d24e6','APPROVE_SKETCH_PLAN', 'af83a579-4f77-496c-b8b8-5a0d5f9d56d5',3 );
INSERT INTO public.service_step VALUES ('c805b018-3afb-4a79-9414-9400905109ca','VERIFY_SKETCH_PLAN', 'af83a579-4f77-496c-b8b8-5a0d5f9d56d5',4 );
INSERT INTO public.service_step VALUES ('9f9b0853-fc44-418e-8826-41506316c96c','RELEASE_SKETCH_PLAN', 'af83a579-4f77-496c-b8b8-5a0d5f9d56d5',5 );
INSERT INTO public.service_step VALUES ('5d70cbb3-dc46-40f4-96ae-b2f7b60dcc1b','TRANSMIT_BL_PLAN', 'af83a579-4f77-496c-b8b8-5a0d5f9d56d5',6 );
INSERT INTO public.service_step VALUES ('c38b9ba1-486d-4cb9-9922-5e9d79c67498','APPROVE_BL_PLAN', 'af83a579-4f77-496c-b8b8-5a0d5f9d56d5',7 );
INSERT INTO public.service_step VALUES ('35712fed-864c-4dd6-b64e-0943757f701d','VERIFY_BL_PLAN', 'af83a579-4f77-496c-b8b8-5a0d5f9d56d5',8 );
INSERT INTO public.service_step VALUES ('e889252e-1f58-4dc8-82b3-0adf701041ef','SURVEY_AUTHORITY_REQUIREMENTS', 'af83a579-4f77-496c-b8b8-5a0d5f9d56d5',9 );
INSERT INTO public.service_step VALUES ('a9482dbf-6891-4f8e-995c-0b76a20ecdec','SURVEY_AUTHORITY_UPDATES', 'af83a579-4f77-496c-b8b8-5a0d5f9d56d5',10 );
INSERT INTO public.service_step VALUES ('6d31eb43-c28b-4166-8a58-69ccb28fd290','DENR_REGION_UPDATES', 'af83a579-4f77-496c-b8b8-5a0d5f9d56d5',11 );
INSERT INTO public.service_step VALUES ('75e9af66-f745-4e65-baf8-e752c48021ad','SIGN_APPROVED_PLAN', 'af83a579-4f77-496c-b8b8-5a0d5f9d56d5',12 );
INSERT INTO public.service_step VALUES ('16f8fd09-618c-495e-a85c-52465f01892a','VERIFY_SIGNED_APPROVED_PLAN', 'af83a579-4f77-496c-b8b8-5a0d5f9d56d5',13);
INSERT INTO public.service_step VALUES ('0e832196-1570-470f-abbb-a15ea750c94a','RELEASE_APPROVED_PLAN', 'af83a579-4f77-496c-b8b8-5a0d5f9d56d5',14);



-- INSERT INTO public.service( id, service_name, service_cost, status, service_type, allow_multiple_lot, excess_hectare_cost, excess_corner_cost, created_by, last_modified_by, deleted )
-- VALUES ('id','Relocation', 6000, true,'Main Services', allowmultiple, 2000, 1000,'admin','admin', false);

-- INSERT INTO public.service_step VALUES ('id','STEP', 'serviceid',5 );

--default roles for system user
insert into public.t_user_authority VALUES(1,'ROLE_ADD_NEW_TRANSACTION');
insert into public.t_user_authority VALUES(1,'ROLE_APPROVE_BL_PLAN');
insert into public.t_user_authority VALUES(1,'ROLE_APPROVE_DENR_PLAN');
insert into public.t_user_authority VALUES(1,'ROLE_APPROVE_LOT_TRANSACTION');
insert into public.t_user_authority VALUES(1,'ROLE_APPROVE_SKETCH_PLAN');
insert into public.t_user_authority VALUES(1,'ROLE_DENR_REGION_UPDATES');
insert into public.t_user_authority VALUES(1,'ROLE_MANAGE_ADDRESSES');
insert into public.t_user_authority VALUES(1,'ROLE_MANAGE_AGENTS');
insert into public.t_user_authority VALUES(1,'ROLE_MANAGE_BILLING');
insert into public.t_user_authority VALUES(1,'ROLE_MANAGE_EMPLOYEES');
insert into public.t_user_authority VALUES(1,'ROLE_MANAGE_LOT_MASTER_LIST');
insert into public.t_user_authority VALUES(1,'ROLE_MANAGE_LOT_TRANSACTION_INFORMATION');
insert into public.t_user_authority VALUES(1,'ROLE_MANAGE_LOTS_UNDER_JURISDICTION');
insert into public.t_user_authority VALUES(1,'ROLE_MANAGE_MISC_FEES');
insert into public.t_user_authority VALUES(1,'ROLE_MANAGE_OFFICES');
insert into public.t_user_authority VALUES(1,'ROLE_MANAGE_PENDING_LOT_TRANSACTION');
insert into public.t_user_authority VALUES(1,'ROLE_MANAGE_POSITIONS');
insert into public.t_user_authority VALUES(1,'ROLE_MANAGE_SERVICES');
insert into public.t_user_authority VALUES(1,'ROLE_MANAGE_SURVEY_TEAM');
insert into public.t_user_authority VALUES(1,'ROLE_MANAGE_USER_ACTIVITIES');
insert into public.t_user_authority VALUES(1,'ROLE_RELEASE_APPROVED_PLAN');
insert into public.t_user_authority VALUES(1,'ROLE_RELEASE_SKETCH_PLAN');
insert into public.t_user_authority VALUES(1,'ROLE_SIGN_APPROVED_PLAN');
insert into public.t_user_authority VALUES(1,'ROLE_SURVEY_AUTHORITY_REQUIREMENTS');
insert into public.t_user_authority VALUES(1,'ROLE_SURVEY_AUTHORITY_UPDATES');
insert into public.t_user_authority VALUES(1,'ROLE_TRANSMIT_BL_PLAN');
insert into public.t_user_authority VALUES(1,'ROLE_TRANSMIT_DENR_SKETCH_PLAN');
insert into public.t_user_authority VALUES(1,'ROLE_TRANSMIT_LDC_AND_CAD_MAP');
insert into public.t_user_authority VALUES(1,'ROLE_TRANSMIT_SKETCH_PLAN');
insert into public.t_user_authority VALUES(1,'ROLE_VERIFY_BL_PLAN');
insert into public.t_user_authority VALUES(1,'ROLE_VERIFY_SIGNED_APPROVED_PLAN');
insert into public.t_user_authority VALUES(1,'ROLE_VERIFY_SKETCH_PLAN');
insert into public.t_user_authority VALUES(1,'ROLE_MANAGE_SURVEYED_LOT_MAP');
insert into public.t_user_authority VALUES(1,'ROLE_MANAGE_SURVEY_SCHED');

--default roles for admin user

insert into public.t_user_authority VALUES(2,'ROLE_ADD_NEW_TRANSACTION');
insert into public.t_user_authority VALUES(2,'ROLE_APPROVE_BL_PLAN');
insert into public.t_user_authority VALUES(2,'ROLE_APPROVE_DENR_PLAN');
insert into public.t_user_authority VALUES(2,'ROLE_APPROVE_LOT_TRANSACTION');
insert into public.t_user_authority VALUES(2,'ROLE_APPROVE_SKETCH_PLAN');
insert into public.t_user_authority VALUES(2,'ROLE_DENR_REGION_UPDATES');
insert into public.t_user_authority VALUES(2,'ROLE_MANAGE_ADDRESSES');
insert into public.t_user_authority VALUES(2,'ROLE_MANAGE_AGENTS');
insert into public.t_user_authority VALUES(2,'ROLE_MANAGE_BILLING');
insert into public.t_user_authority VALUES(2,'ROLE_MANAGE_EMPLOYEES');
insert into public.t_user_authority VALUES(2,'ROLE_MANAGE_LOT_MASTER_LIST');
insert into public.t_user_authority VALUES(2,'ROLE_MANAGE_LOT_TRANSACTION_INFORMATION');
insert into public.t_user_authority VALUES(2,'ROLE_MANAGE_LOTS_UNDER_JURISDICTION');
insert into public.t_user_authority VALUES(2,'ROLE_MANAGE_MISC_FEES');
insert into public.t_user_authority VALUES(2,'ROLE_MANAGE_OFFICES');
insert into public.t_user_authority VALUES(2,'ROLE_MANAGE_PENDING_LOT_TRANSACTION');
insert into public.t_user_authority VALUES(2,'ROLE_MANAGE_POSITIONS');
insert into public.t_user_authority VALUES(2,'ROLE_MANAGE_SERVICES');
insert into public.t_user_authority VALUES(2,'ROLE_MANAGE_SURVEY_TEAM');
insert into public.t_user_authority VALUES(2,'ROLE_MANAGE_USER_ACTIVITIES');
insert into public.t_user_authority VALUES(2,'ROLE_RELEASE_APPROVED_PLAN');
insert into public.t_user_authority VALUES(2,'ROLE_RELEASE_SKETCH_PLAN');
insert into public.t_user_authority VALUES(2,'ROLE_SIGN_APPROVED_PLAN');
insert into public.t_user_authority VALUES(2,'ROLE_SURVEY_AUTHORITY_REQUIREMENTS');
insert into public.t_user_authority VALUES(2,'ROLE_SURVEY_AUTHORITY_UPDATES');
insert into public.t_user_authority VALUES(2,'ROLE_TRANSMIT_BL_PLAN');
insert into public.t_user_authority VALUES(2,'ROLE_TRANSMIT_DENR_SKETCH_PLAN');
insert into public.t_user_authority VALUES(2,'ROLE_TRANSMIT_LDC_AND_CAD_MAP');
insert into public.t_user_authority VALUES(2,'ROLE_TRANSMIT_SKETCH_PLAN');
insert into public.t_user_authority VALUES(2,'ROLE_VERIFY_BL_PLAN');
insert into public.t_user_authority VALUES(2,'ROLE_VERIFY_SIGNED_APPROVED_PLAN');
insert into public.t_user_authority VALUES(2,'ROLE_VERIFY_SKETCH_PLAN');
insert into public.t_user_authority VALUES(2,'ROLE_MANAGE_SURVEYED_LOT_MAP');
insert into public.t_user_authority VALUES(2,'ROLE_MANAGE_SURVEY_SCHED');


DELETE FROM hrm.employees;
INSERT INTO hrm.employees (id, emp_no, title_initials, first_name, middle_name, last_name, name_suffix, gender, dob, email_address, employee_tel_no, employee_cel_no, nationality, civil_status, blood_type, street, country, province, municipality, barangay, zipcode, emergency_contact_name, emergency_contact_address, emergency_contact_relationship, emergency_contact_no, employee_type, philhealth_no, sss_no, tin_no, pag_ibig_id, monthly_basic_salary, is_active, "position", office, "user", created_by, created_date, last_modified_by, last_modified_date, deleted) VALUES('4a37c743-6caf-424b-9545-1078f476a7f6', '000001', '', 'JOHN MICHAEL', 'CENTINO', 'HINACAY', NULL, 'MALE', '1995-08-04', 'hinacay.johnmichael@gmail.com', '', '09359415827', 'FILIPINO', 'SINGLE', 'O+', '', 'PHILIPPINES', 'b7bddf2e-65ae-4f0a-99ce-85c34698a878', '5faac161-6210-458c-88f3-9dda15f26b97', '3b47cf22-8e22-4ec9-afbc-61179a6a27a7', '6336', NULL, NULL, NULL, NULL, 'REGULAR', NULL, NULL, NULL, NULL, NULL, true, '6d1fae41-b454-4a19-b4ee-a33eaafd5be5', '85d0838f-0da1-4930-bfae-e02e7b697e9c', 2, 'system', '2021-08-28 20:59:11.539', 'system', '2021-08-28 20:59:11.539', false);



Insert into public.t_permission values ('PERMISSION_TO_UPDATE_LOT_TRANSACTION_INFORMATION', 'Permission to update lot transaction information, lot area information, and claimants');
Insert into public.t_permission values ('PERMISSION_TO_MANAGE_SURVEY_SCHEDULE', 'Permission to add, update, and remove survey schedule');
Insert into public.t_permission values ('PERMISSION_TO_EDIT_FILE', 'Permission to rename and change file types of uploaded files');
Insert into public.t_permission values ('PERMISSION_TO_DELETE_FILE', 'Permission to delete uploaded files');
Insert into public.t_permission values ('PERMISSION_TO_MANAGE_BILLING_ITEMS', 'Permission to add, update, and remove billing items');
Insert into public.t_permission values ('PERMISSION_TO_VOID_PAYMENTS', 'Permission to void payments');
Insert into public.t_permission values ('PERMISSION_TO_MANAGE_BILLING_DEDUCTIONS', 'Permission to add, update, and remove billing deduction deductions');
Insert into public.t_permission values ('PERMISSION_TO_LOCK_BILLING', 'Permission to lock billing folios');
Insert into public.t_permission values ('PERMISSION_TO_CLOSE_BILLING', 'Permission to close billing folios');
Insert into public.t_permission values ('PERMISSION_TO_ASSIGN_USER_AUTHORITIES', 'Permission to add and remove user authorities');
Insert into public.t_permission values ('PERMISSION_TO_ASSIGN_USER_PERMISSIONS', 'Permission to add and remove user permissions');
Insert into public.t_permission values ('PERMISSION_TO_ADD_AND_UPDATE_SURVEY_SCHED', 'Permission to add and update survey schedules');



insert into public.t_user_permission VALUES(1,'PERMISSION_TO_UPDATE_LOT_TRANSACTION_INFORMATION');
insert into public.t_user_permission VALUES(1,'PERMISSION_TO_MANAGE_SURVEY_SCHEDULE');
insert into public.t_user_permission VALUES(1,'PERMISSION_TO_EDIT_FILE');
insert into public.t_user_permission VALUES(1,'PERMISSION_TO_DELETE_FILE');
insert into public.t_user_permission VALUES(1,'PERMISSION_TO_MANAGE_BILLING_ITEMS');
insert into public.t_user_permission VALUES(1,'PERMISSION_TO_VOID_PAYMENTS');
insert into public.t_user_permission VALUES(1,'PERMISSION_TO_MANAGE_BILLING_DEDUCTIONS');
insert into public.t_user_permission VALUES(1,'PERMISSION_TO_LOCK_BILLING');
insert into public.t_user_permission VALUES(1,'PERMISSION_TO_CLOSE_BILLING');
insert into public.t_user_permission VALUES(1,'PERMISSION_TO_ASSIGN_USER_AUTHORITIES');
insert into public.t_user_permission VALUES(1,'PERMISSION_TO_ASSIGN_USER_PERMISSIONS');
insert into public.t_user_permission VALUES(1,'PERMISSION_TO_ADD_AND_UPDATE_SURVEY_SCHED');


insert into public.t_user_permission VALUES(2,'PERMISSION_TO_UPDATE_LOT_TRANSACTION_INFORMATION');
insert into public.t_user_permission VALUES(2,'PERMISSION_TO_MANAGE_SURVEY_SCHEDULE');
insert into public.t_user_permission VALUES(2,'PERMISSION_TO_EDIT_FILE');
insert into public.t_user_permission VALUES(2,'PERMISSION_TO_DELETE_FILE');
insert into public.t_user_permission VALUES(2,'PERMISSION_TO_MANAGE_BILLING_ITEMS');
insert into public.t_user_permission VALUES(2,'PERMISSION_TO_VOID_PAYMENTS');
insert into public.t_user_permission VALUES(2,'PERMISSION_TO_MANAGE_BILLING_DEDUCTIONS');
insert into public.t_user_permission VALUES(2,'PERMISSION_TO_LOCK_BILLING');
insert into public.t_user_permission VALUES(2,'PERMISSION_TO_CLOSE_BILLING');
insert into public.t_user_permission VALUES(2,'PERMISSION_TO_ASSIGN_USER_AUTHORITIES');
insert into public.t_user_permission VALUES(2,'PERMISSION_TO_ASSIGN_USER_PERMISSIONS');
insert into public.t_user_permission VALUES(2,'PERMISSION_TO_ADD_AND_UPDATE_SURVEY_SCHED');



