--
-- PostgreSQL database dump
--

-- Dumped from database version 15.13
-- Dumped by pg_dump version 15.12 (Homebrew)

-- Started on 2025-06-02 10:59:10 AEST

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 5 (class 2615 OID 32773)
-- Name: neon_auth; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA neon_auth;


--
-- TOC entry 6 (class 2615 OID 81920)
-- Name: payroll_db; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA payroll_db;


--
-- TOC entry 855 (class 1247 OID 81932)
-- Name: payroll_cycle_type; Type: TYPE; Schema: payroll_db; Owner: -
--

CREATE TYPE payroll_db.payroll_cycle_type AS ENUM (
    'weekly',
    'fortnightly',
    'bi_monthly',
    'monthly',
    'quarterly'
);


--
-- TOC entry 858 (class 1247 OID 81944)
-- Name: payroll_date_type; Type: TYPE; Schema: payroll_db; Owner: -
--

CREATE TYPE payroll_db.payroll_date_type AS ENUM (
    'fixed_date',
    'eom',
    'som',
    'week_a',
    'week_b',
    'dow'
);


--
-- TOC entry 852 (class 1247 OID 81922)
-- Name: user_role; Type: TYPE; Schema: payroll_db; Owner: -
--

CREATE TYPE payroll_db.user_role AS ENUM (
    'admin',
    'manager',
    'consultant',
    'viewer'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 215 (class 1259 OID 32774)
-- Name: users_sync; Type: TABLE; Schema: neon_auth; Owner: -
--

CREATE TABLE neon_auth.users_sync (
    raw_json jsonb NOT NULL,
    id text GENERATED ALWAYS AS ((raw_json ->> 'id'::text)) STORED NOT NULL,
    name text GENERATED ALWAYS AS ((raw_json ->> 'display_name'::text)) STORED,
    email text GENERATED ALWAYS AS ((raw_json ->> 'primary_email'::text)) STORED,
    created_at timestamp with time zone GENERATED ALWAYS AS (to_timestamp((trunc((((raw_json ->> 'signed_up_at_millis'::text))::bigint)::double precision) / (1000)::double precision))) STORED,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone
);


--
-- TOC entry 222 (class 1259 OID 82031)
-- Name: adjustment_rules; Type: TABLE; Schema: payroll_db; Owner: -
--

CREATE TABLE payroll_db.adjustment_rules (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    cycle_id uuid NOT NULL,
    date_type_id uuid NOT NULL,
    rule_description text NOT NULL,
    rule_code text NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- TOC entry 226 (class 1259 OID 82118)
-- Name: client_external_systems; Type: TABLE; Schema: payroll_db; Owner: -
--

CREATE TABLE payroll_db.client_external_systems (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    client_id uuid NOT NULL,
    system_id uuid NOT NULL,
    system_client_id character varying(255),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- TOC entry 217 (class 1259 OID 81970)
-- Name: clients; Type: TABLE; Schema: payroll_db; Owner: -
--

CREATE TABLE payroll_db.clients (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255) NOT NULL,
    contact_person character varying(255),
    contact_email character varying(255),
    contact_phone character varying(50),
    active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- TOC entry 225 (class 1259 OID 82108)
-- Name: external_systems; Type: TABLE; Schema: payroll_db; Owner: -
--

CREATE TABLE payroll_db.external_systems (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255) NOT NULL,
    url text NOT NULL,
    description text,
    icon character varying(255),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- TOC entry 221 (class 1259 OID 82021)
-- Name: holidays; Type: TABLE; Schema: payroll_db; Owner: -
--

CREATE TABLE payroll_db.holidays (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    date date NOT NULL,
    name character varying(255) NOT NULL,
    recurring boolean DEFAULT false,
    region character varying(100) DEFAULT 'national'::character varying,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- TOC entry 219 (class 1259 OID 81997)
-- Name: payroll_cycles; Type: TABLE; Schema: payroll_db; Owner: -
--

CREATE TABLE payroll_db.payroll_cycles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name payroll_db.payroll_cycle_type NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- TOC entry 220 (class 1259 OID 82009)
-- Name: payroll_date_types; Type: TABLE; Schema: payroll_db; Owner: -
--

CREATE TABLE payroll_db.payroll_date_types (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name payroll_db.payroll_date_type NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- TOC entry 224 (class 1259 OID 82093)
-- Name: payroll_dates; Type: TABLE; Schema: payroll_db; Owner: -
--

CREATE TABLE payroll_db.payroll_dates (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    payroll_id uuid NOT NULL,
    original_eft_date date NOT NULL,
    adjusted_eft_date date NOT NULL,
    processing_date date NOT NULL,
    notes text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- TOC entry 223 (class 1259 OID 82053)
-- Name: payrolls; Type: TABLE; Schema: payroll_db; Owner: -
--

CREATE TABLE payroll_db.payrolls (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    client_id uuid NOT NULL,
    name character varying(255) NOT NULL,
    cycle_id uuid NOT NULL,
    date_type_id uuid NOT NULL,
    date_value integer,
    primary_consultant_id uuid,
    backup_consultant_id uuid,
    manager_id uuid,
    processing_days_before_eft integer DEFAULT 2 NOT NULL,
    active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    version_number integer DEFAULT 1,
    parent_payroll_id uuid,
    go_live_date date,
    superseded_date date,
    version_reason text,
    created_by_user_id uuid
);


--
-- TOC entry 218 (class 1259 OID 81981)
-- Name: staff; Type: TABLE; Schema: payroll_db; Owner: -
--

CREATE TABLE payroll_db.staff (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    phone character varying(50),
    "position" character varying(100),
    active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- TOC entry 216 (class 1259 OID 81957)
-- Name: users; Type: TABLE; Schema: payroll_db; Owner: -
--

CREATE TABLE payroll_db.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    role payroll_db.user_role DEFAULT 'viewer'::payroll_db.user_role NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    is_active boolean DEFAULT true NOT NULL,
    deactivated_at timestamp with time zone,
    deactivated_by text
);


--
-- TOC entry 3477 (class 0 OID 0)
-- Dependencies: 216
-- Name: COLUMN users.is_active; Type: COMMENT; Schema: payroll_db; Owner: -
--

COMMENT ON COLUMN payroll_db.users.is_active IS 'Whether the user is active in the system';


--
-- TOC entry 3478 (class 0 OID 0)
-- Dependencies: 216
-- Name: COLUMN users.deactivated_at; Type: COMMENT; Schema: payroll_db; Owner: -
--

COMMENT ON COLUMN payroll_db.users.deactivated_at IS 'Timestamp when user was deactivated';


--
-- TOC entry 3479 (class 0 OID 0)
-- Dependencies: 216
-- Name: COLUMN users.deactivated_by; Type: COMMENT; Schema: payroll_db; Owner: -
--

COMMENT ON COLUMN payroll_db.users.deactivated_by IS 'ID of the user who performed the deactivation';


--
-- TOC entry 3275 (class 2606 OID 32784)
-- Name: users_sync users_sync_pkey; Type: CONSTRAINT; Schema: neon_auth; Owner: -
--

ALTER TABLE ONLY neon_auth.users_sync
    ADD CONSTRAINT users_sync_pkey PRIMARY KEY (id);


--
-- TOC entry 3298 (class 2606 OID 82042)
-- Name: adjustment_rules adjustment_rules_cycle_id_date_type_id_key; Type: CONSTRAINT; Schema: payroll_db; Owner: -
--

ALTER TABLE ONLY payroll_db.adjustment_rules
    ADD CONSTRAINT adjustment_rules_cycle_id_date_type_id_key UNIQUE (cycle_id, date_type_id);


--
-- TOC entry 3300 (class 2606 OID 82040)
-- Name: adjustment_rules adjustment_rules_pkey; Type: CONSTRAINT; Schema: payroll_db; Owner: -
--

ALTER TABLE ONLY payroll_db.adjustment_rules
    ADD CONSTRAINT adjustment_rules_pkey PRIMARY KEY (id);


--
-- TOC entry 3314 (class 2606 OID 82127)
-- Name: client_external_systems client_external_systems_client_id_system_id_key; Type: CONSTRAINT; Schema: payroll_db; Owner: -
--

ALTER TABLE ONLY payroll_db.client_external_systems
    ADD CONSTRAINT client_external_systems_client_id_system_id_key UNIQUE (client_id, system_id);


--
-- TOC entry 3316 (class 2606 OID 82125)
-- Name: client_external_systems client_external_systems_pkey; Type: CONSTRAINT; Schema: payroll_db; Owner: -
--

ALTER TABLE ONLY payroll_db.client_external_systems
    ADD CONSTRAINT client_external_systems_pkey PRIMARY KEY (id);


--
-- TOC entry 3283 (class 2606 OID 81980)
-- Name: clients clients_pkey; Type: CONSTRAINT; Schema: payroll_db; Owner: -
--

ALTER TABLE ONLY payroll_db.clients
    ADD CONSTRAINT clients_pkey PRIMARY KEY (id);


--
-- TOC entry 3312 (class 2606 OID 82117)
-- Name: external_systems external_systems_pkey; Type: CONSTRAINT; Schema: payroll_db; Owner: -
--

ALTER TABLE ONLY payroll_db.external_systems
    ADD CONSTRAINT external_systems_pkey PRIMARY KEY (id);


--
-- TOC entry 3295 (class 2606 OID 82030)
-- Name: holidays holidays_pkey; Type: CONSTRAINT; Schema: payroll_db; Owner: -
--

ALTER TABLE ONLY payroll_db.holidays
    ADD CONSTRAINT holidays_pkey PRIMARY KEY (id);


--
-- TOC entry 3287 (class 2606 OID 82008)
-- Name: payroll_cycles payroll_cycles_name_key; Type: CONSTRAINT; Schema: payroll_db; Owner: -
--

ALTER TABLE ONLY payroll_db.payroll_cycles
    ADD CONSTRAINT payroll_cycles_name_key UNIQUE (name);


--
-- TOC entry 3289 (class 2606 OID 82006)
-- Name: payroll_cycles payroll_cycles_pkey; Type: CONSTRAINT; Schema: payroll_db; Owner: -
--

ALTER TABLE ONLY payroll_db.payroll_cycles
    ADD CONSTRAINT payroll_cycles_pkey PRIMARY KEY (id);


--
-- TOC entry 3291 (class 2606 OID 82020)
-- Name: payroll_date_types payroll_date_types_name_key; Type: CONSTRAINT; Schema: payroll_db; Owner: -
--

ALTER TABLE ONLY payroll_db.payroll_date_types
    ADD CONSTRAINT payroll_date_types_name_key UNIQUE (name);


--
-- TOC entry 3293 (class 2606 OID 82018)
-- Name: payroll_date_types payroll_date_types_pkey; Type: CONSTRAINT; Schema: payroll_db; Owner: -
--

ALTER TABLE ONLY payroll_db.payroll_date_types
    ADD CONSTRAINT payroll_date_types_pkey PRIMARY KEY (id);


--
-- TOC entry 3310 (class 2606 OID 82102)
-- Name: payroll_dates payroll_dates_pkey; Type: CONSTRAINT; Schema: payroll_db; Owner: -
--

ALTER TABLE ONLY payroll_db.payroll_dates
    ADD CONSTRAINT payroll_dates_pkey PRIMARY KEY (id);


--
-- TOC entry 3305 (class 2606 OID 82062)
-- Name: payrolls payrolls_pkey; Type: CONSTRAINT; Schema: payroll_db; Owner: -
--

ALTER TABLE ONLY payroll_db.payrolls
    ADD CONSTRAINT payrolls_pkey PRIMARY KEY (id);


--
-- TOC entry 3285 (class 2606 OID 81991)
-- Name: staff staff_pkey; Type: CONSTRAINT; Schema: payroll_db; Owner: -
--

ALTER TABLE ONLY payroll_db.staff
    ADD CONSTRAINT staff_pkey PRIMARY KEY (id);


--
-- TOC entry 3279 (class 2606 OID 81969)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: payroll_db; Owner: -
--

ALTER TABLE ONLY payroll_db.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 3281 (class 2606 OID 81967)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: payroll_db; Owner: -
--

ALTER TABLE ONLY payroll_db.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 3273 (class 1259 OID 32785)
-- Name: users_sync_deleted_at_idx; Type: INDEX; Schema: neon_auth; Owner: -
--

CREATE INDEX users_sync_deleted_at_idx ON neon_auth.users_sync USING btree (deleted_at);


--
-- TOC entry 3296 (class 1259 OID 82144)
-- Name: idx_holidays_date; Type: INDEX; Schema: payroll_db; Owner: -
--

CREATE INDEX idx_holidays_date ON payroll_db.holidays USING btree (date);


--
-- TOC entry 3306 (class 1259 OID 82139)
-- Name: idx_payroll_dates_date_range; Type: INDEX; Schema: payroll_db; Owner: -
--

CREATE INDEX idx_payroll_dates_date_range ON payroll_db.payroll_dates USING btree (adjusted_eft_date);


--
-- TOC entry 3307 (class 1259 OID 82138)
-- Name: idx_payroll_dates_payroll_id; Type: INDEX; Schema: payroll_db; Owner: -
--

CREATE INDEX idx_payroll_dates_payroll_id ON payroll_db.payroll_dates USING btree (payroll_id);


--
-- TOC entry 3308 (class 1259 OID 82140)
-- Name: idx_payroll_dates_processing; Type: INDEX; Schema: payroll_db; Owner: -
--

CREATE INDEX idx_payroll_dates_processing ON payroll_db.payroll_dates USING btree (processing_date);


--
-- TOC entry 3301 (class 1259 OID 82141)
-- Name: idx_payrolls_client_id; Type: INDEX; Schema: payroll_db; Owner: -
--

CREATE INDEX idx_payrolls_client_id ON payroll_db.payrolls USING btree (client_id);


--
-- TOC entry 3302 (class 1259 OID 82142)
-- Name: idx_payrolls_consultant; Type: INDEX; Schema: payroll_db; Owner: -
--

CREATE INDEX idx_payrolls_consultant ON payroll_db.payrolls USING btree (primary_consultant_id);


--
-- TOC entry 3303 (class 1259 OID 82143)
-- Name: idx_payrolls_manager; Type: INDEX; Schema: payroll_db; Owner: -
--

CREATE INDEX idx_payrolls_manager ON payroll_db.payrolls USING btree (manager_id);


--
-- TOC entry 3276 (class 1259 OID 90114)
-- Name: idx_users_deactivated_at; Type: INDEX; Schema: payroll_db; Owner: -
--

CREATE INDEX idx_users_deactivated_at ON payroll_db.users USING btree (deactivated_at) WHERE (deactivated_at IS NOT NULL);


--
-- TOC entry 3277 (class 1259 OID 90113)
-- Name: idx_users_is_active; Type: INDEX; Schema: payroll_db; Owner: -
--

CREATE INDEX idx_users_is_active ON payroll_db.users USING btree (is_active);


--
-- TOC entry 3318 (class 2606 OID 82043)
-- Name: adjustment_rules adjustment_rules_cycle_id_fkey; Type: FK CONSTRAINT; Schema: payroll_db; Owner: -
--

ALTER TABLE ONLY payroll_db.adjustment_rules
    ADD CONSTRAINT adjustment_rules_cycle_id_fkey FOREIGN KEY (cycle_id) REFERENCES payroll_db.payroll_cycles(id) ON DELETE CASCADE;


--
-- TOC entry 3319 (class 2606 OID 82048)
-- Name: adjustment_rules adjustment_rules_date_type_id_fkey; Type: FK CONSTRAINT; Schema: payroll_db; Owner: -
--

ALTER TABLE ONLY payroll_db.adjustment_rules
    ADD CONSTRAINT adjustment_rules_date_type_id_fkey FOREIGN KEY (date_type_id) REFERENCES payroll_db.payroll_date_types(id) ON DELETE CASCADE;


--
-- TOC entry 3328 (class 2606 OID 82128)
-- Name: client_external_systems client_external_systems_client_id_fkey; Type: FK CONSTRAINT; Schema: payroll_db; Owner: -
--

ALTER TABLE ONLY payroll_db.client_external_systems
    ADD CONSTRAINT client_external_systems_client_id_fkey FOREIGN KEY (client_id) REFERENCES payroll_db.clients(id) ON DELETE CASCADE;


--
-- TOC entry 3329 (class 2606 OID 82133)
-- Name: client_external_systems client_external_systems_system_id_fkey; Type: FK CONSTRAINT; Schema: payroll_db; Owner: -
--

ALTER TABLE ONLY payroll_db.client_external_systems
    ADD CONSTRAINT client_external_systems_system_id_fkey FOREIGN KEY (system_id) REFERENCES payroll_db.external_systems(id) ON DELETE CASCADE;


--
-- TOC entry 3327 (class 2606 OID 82103)
-- Name: payroll_dates payroll_dates_payroll_id_fkey; Type: FK CONSTRAINT; Schema: payroll_db; Owner: -
--

ALTER TABLE ONLY payroll_db.payroll_dates
    ADD CONSTRAINT payroll_dates_payroll_id_fkey FOREIGN KEY (payroll_id) REFERENCES payroll_db.payrolls(id) ON DELETE CASCADE;


--
-- TOC entry 3320 (class 2606 OID 82083)
-- Name: payrolls payrolls_backup_consultant_id_fkey; Type: FK CONSTRAINT; Schema: payroll_db; Owner: -
--

ALTER TABLE ONLY payroll_db.payrolls
    ADD CONSTRAINT payrolls_backup_consultant_id_fkey FOREIGN KEY (backup_consultant_id) REFERENCES payroll_db.staff(id) ON DELETE SET NULL;


--
-- TOC entry 3321 (class 2606 OID 82063)
-- Name: payrolls payrolls_client_id_fkey; Type: FK CONSTRAINT; Schema: payroll_db; Owner: -
--

ALTER TABLE ONLY payroll_db.payrolls
    ADD CONSTRAINT payrolls_client_id_fkey FOREIGN KEY (client_id) REFERENCES payroll_db.clients(id) ON DELETE CASCADE;


--
-- TOC entry 3322 (class 2606 OID 82068)
-- Name: payrolls payrolls_cycle_id_fkey; Type: FK CONSTRAINT; Schema: payroll_db; Owner: -
--

ALTER TABLE ONLY payroll_db.payrolls
    ADD CONSTRAINT payrolls_cycle_id_fkey FOREIGN KEY (cycle_id) REFERENCES payroll_db.payroll_cycles(id) ON DELETE RESTRICT;


--
-- TOC entry 3323 (class 2606 OID 82073)
-- Name: payrolls payrolls_date_type_id_fkey; Type: FK CONSTRAINT; Schema: payroll_db; Owner: -
--

ALTER TABLE ONLY payroll_db.payrolls
    ADD CONSTRAINT payrolls_date_type_id_fkey FOREIGN KEY (date_type_id) REFERENCES payroll_db.payroll_date_types(id) ON DELETE RESTRICT;


--
-- TOC entry 3324 (class 2606 OID 82088)
-- Name: payrolls payrolls_manager_id_fkey; Type: FK CONSTRAINT; Schema: payroll_db; Owner: -
--

ALTER TABLE ONLY payroll_db.payrolls
    ADD CONSTRAINT payrolls_manager_id_fkey FOREIGN KEY (manager_id) REFERENCES payroll_db.staff(id) ON DELETE SET NULL;


--
-- TOC entry 3325 (class 2606 OID 98305)
-- Name: payrolls payrolls_parent_payroll_id_fkey; Type: FK CONSTRAINT; Schema: payroll_db; Owner: -
--

ALTER TABLE ONLY payroll_db.payrolls
    ADD CONSTRAINT payrolls_parent_payroll_id_fkey FOREIGN KEY (parent_payroll_id) REFERENCES payroll_db.payrolls(id);


--
-- TOC entry 3326 (class 2606 OID 82078)
-- Name: payrolls payrolls_primary_consultant_id_fkey; Type: FK CONSTRAINT; Schema: payroll_db; Owner: -
--

ALTER TABLE ONLY payroll_db.payrolls
    ADD CONSTRAINT payrolls_primary_consultant_id_fkey FOREIGN KEY (primary_consultant_id) REFERENCES payroll_db.staff(id) ON DELETE SET NULL;


--
-- TOC entry 3317 (class 2606 OID 81992)
-- Name: staff staff_user_id_fkey; Type: FK CONSTRAINT; Schema: payroll_db; Owner: -
--

ALTER TABLE ONLY payroll_db.staff
    ADD CONSTRAINT staff_user_id_fkey FOREIGN KEY (user_id) REFERENCES payroll_db.users(id) ON DELETE SET NULL;


-- Completed on 2025-06-02 10:59:11 AEST

--
-- PostgreSQL database dump complete
--

