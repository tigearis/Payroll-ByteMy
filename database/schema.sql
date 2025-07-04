PGDMP      -    	            }            neondb    15.13    16.9 (Homebrew) A    �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    16386    neondb    DATABASE     n   CREATE DATABASE neondb WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'C.UTF-8';
    DROP DATABASE neondb;
                neondb_owner    false            �           0    0    DATABASE neondb    ACL     0   GRANT ALL ON DATABASE neondb TO neon_superuser;
                   neondb_owner    false    3477                        2615    32773 	   neon_auth    SCHEMA        CREATE SCHEMA neon_auth;
    DROP SCHEMA neon_auth;
                neondb_owner    false                        2615    81920 
   payroll_db    SCHEMA        CREATE SCHEMA payroll_db;
    DROP SCHEMA payroll_db;
                neondb_owner    false            W           1247    81932    payroll_cycle_type    TYPE     �   CREATE TYPE payroll_db.payroll_cycle_type AS ENUM (
    'weekly',
    'fortnightly',
    'bi_monthly',
    'monthly',
    'quarterly'
);
 )   DROP TYPE payroll_db.payroll_cycle_type;
    
   payroll_db          neondb_owner    false    6            Z           1247    81944    payroll_date_type    TYPE     �   CREATE TYPE payroll_db.payroll_date_type AS ENUM (
    'fixed_date',
    'eom',
    'som',
    'week_a',
    'week_b',
    'dow'
);
 (   DROP TYPE payroll_db.payroll_date_type;
    
   payroll_db          neondb_owner    false    6            T           1247    81922 	   user_role    TYPE     i   CREATE TYPE payroll_db.user_role AS ENUM (
    'admin',
    'manager',
    'consultant',
    'viewer'
);
     DROP TYPE payroll_db.user_role;
    
   payroll_db          neondb_owner    false    6            �            1259    32774 
   users_sync    TABLE     E  CREATE TABLE neon_auth.users_sync (
    raw_json jsonb NOT NULL,
    id text GENERATED ALWAYS AS ((raw_json ->> 'id'::text)) STORED NOT NULL,
    name text GENERATED ALWAYS AS ((raw_json ->> 'display_name'::text)) STORED,
    email text GENERATED ALWAYS AS ((raw_json ->> 'primary_email'::text)) STORED,
    created_at timestamp with time zone GENERATED ALWAYS AS (to_timestamp((trunc((((raw_json ->> 'signed_up_at_millis'::text))::bigint)::double precision) / (1000)::double precision))) STORED,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone
);
 !   DROP TABLE neon_auth.users_sync;
    	   neon_auth         heap    neondb_owner    false    5            �            1259    82031    adjustment_rules    TABLE     `  CREATE TABLE payroll_db.adjustment_rules (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    cycle_id uuid NOT NULL,
    date_type_id uuid NOT NULL,
    rule_description text NOT NULL,
    rule_code text NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
 (   DROP TABLE payroll_db.adjustment_rules;
    
   payroll_db         heap    neondb_owner    false    6            �            1259    82118    client_external_systems    TABLE     Q  CREATE TABLE payroll_db.client_external_systems (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    client_id uuid NOT NULL,
    system_id uuid NOT NULL,
    system_client_id character varying(255),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
 /   DROP TABLE payroll_db.client_external_systems;
    
   payroll_db         heap    neondb_owner    false    6            �            1259    81970    clients    TABLE     �  CREATE TABLE payroll_db.clients (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255) NOT NULL,
    contact_person character varying(255),
    contact_email character varying(255),
    contact_phone character varying(50),
    active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
    DROP TABLE payroll_db.clients;
    
   payroll_db         heap    neondb_owner    false    6            �            1259    82108    external_systems    TABLE     [  CREATE TABLE payroll_db.external_systems (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255) NOT NULL,
    url text NOT NULL,
    description text,
    icon character varying(255),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
 (   DROP TABLE payroll_db.external_systems;
    
   payroll_db         heap    neondb_owner    false    6            �            1259    82021    holidays    TABLE     �  CREATE TABLE payroll_db.holidays (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    date date NOT NULL,
    name character varying(255) NOT NULL,
    recurring boolean DEFAULT false,
    region character varying(100) DEFAULT 'national'::character varying,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
     DROP TABLE payroll_db.holidays;
    
   payroll_db         heap    neondb_owner    false    6            �            1259    81997    payroll_cycles    TABLE     (  CREATE TABLE payroll_db.payroll_cycles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name payroll_db.payroll_cycle_type NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
 &   DROP TABLE payroll_db.payroll_cycles;
    
   payroll_db         heap    neondb_owner    false    855    6            �            1259    82009    payroll_date_types    TABLE     +  CREATE TABLE payroll_db.payroll_date_types (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name payroll_db.payroll_date_type NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
 *   DROP TABLE payroll_db.payroll_date_types;
    
   payroll_db         heap    neondb_owner    false    6    858            �            1259    82093    payroll_dates    TABLE     {  CREATE TABLE payroll_db.payroll_dates (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    payroll_id uuid NOT NULL,
    original_eft_date date NOT NULL,
    adjusted_eft_date date NOT NULL,
    processing_date date NOT NULL,
    notes text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
 %   DROP TABLE payroll_db.payroll_dates;
    
   payroll_db         heap    neondb_owner    false    6            �            1259    82053    payrolls    TABLE     �  CREATE TABLE payroll_db.payrolls (
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
     DROP TABLE payroll_db.payrolls;
    
   payroll_db         heap    neondb_owner    false    6            �            1259    81981    staff    TABLE     �  CREATE TABLE payroll_db.staff (
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
    DROP TABLE payroll_db.staff;
    
   payroll_db         heap    neondb_owner    false    6            �            1259    81957    users    TABLE     �  CREATE TABLE payroll_db.users (
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
    DROP TABLE payroll_db.users;
    
   payroll_db         heap    neondb_owner    false    852    852    6            �           0    0    COLUMN users.is_active    COMMENT     \   COMMENT ON COLUMN payroll_db.users.is_active IS 'Whether the user is active in the system';
       
   payroll_db          neondb_owner    false    216            �           0    0    COLUMN users.deactivated_at    COMMENT     \   COMMENT ON COLUMN payroll_db.users.deactivated_at IS 'Timestamp when user was deactivated';
       
   payroll_db          neondb_owner    false    216            �           0    0    COLUMN users.deactivated_by    COMMENT     f   COMMENT ON COLUMN payroll_db.users.deactivated_by IS 'ID of the user who performed the deactivation';
       
   payroll_db          neondb_owner    false    216            �           2606    32784    users_sync users_sync_pkey 
   CONSTRAINT     [   ALTER TABLE ONLY neon_auth.users_sync
    ADD CONSTRAINT users_sync_pkey PRIMARY KEY (id);
 G   ALTER TABLE ONLY neon_auth.users_sync DROP CONSTRAINT users_sync_pkey;
    	   neon_auth            neondb_owner    false    215            �           2606    82042 ;   adjustment_rules adjustment_rules_cycle_id_date_type_id_key 
   CONSTRAINT     �   ALTER TABLE ONLY payroll_db.adjustment_rules
    ADD CONSTRAINT adjustment_rules_cycle_id_date_type_id_key UNIQUE (cycle_id, date_type_id);
 i   ALTER TABLE ONLY payroll_db.adjustment_rules DROP CONSTRAINT adjustment_rules_cycle_id_date_type_id_key;
    
   payroll_db            neondb_owner    false    222    222            �           2606    82040 &   adjustment_rules adjustment_rules_pkey 
   CONSTRAINT     h   ALTER TABLE ONLY payroll_db.adjustment_rules
    ADD CONSTRAINT adjustment_rules_pkey PRIMARY KEY (id);
 T   ALTER TABLE ONLY payroll_db.adjustment_rules DROP CONSTRAINT adjustment_rules_pkey;
    
   payroll_db            neondb_owner    false    222            �           2606    82127 G   client_external_systems client_external_systems_client_id_system_id_key 
   CONSTRAINT     �   ALTER TABLE ONLY payroll_db.client_external_systems
    ADD CONSTRAINT client_external_systems_client_id_system_id_key UNIQUE (client_id, system_id);
 u   ALTER TABLE ONLY payroll_db.client_external_systems DROP CONSTRAINT client_external_systems_client_id_system_id_key;
    
   payroll_db            neondb_owner    false    226    226            �           2606    82125 4   client_external_systems client_external_systems_pkey 
   CONSTRAINT     v   ALTER TABLE ONLY payroll_db.client_external_systems
    ADD CONSTRAINT client_external_systems_pkey PRIMARY KEY (id);
 b   ALTER TABLE ONLY payroll_db.client_external_systems DROP CONSTRAINT client_external_systems_pkey;
    
   payroll_db            neondb_owner    false    226            �           2606    81980    clients clients_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY payroll_db.clients
    ADD CONSTRAINT clients_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY payroll_db.clients DROP CONSTRAINT clients_pkey;
    
   payroll_db            neondb_owner    false    217            �           2606    82117 &   external_systems external_systems_pkey 
   CONSTRAINT     h   ALTER TABLE ONLY payroll_db.external_systems
    ADD CONSTRAINT external_systems_pkey PRIMARY KEY (id);
 T   ALTER TABLE ONLY payroll_db.external_systems DROP CONSTRAINT external_systems_pkey;
    
   payroll_db            neondb_owner    false    225            �           2606    82030    holidays holidays_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY payroll_db.holidays
    ADD CONSTRAINT holidays_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY payroll_db.holidays DROP CONSTRAINT holidays_pkey;
    
   payroll_db            neondb_owner    false    221            �           2606    82008 &   payroll_cycles payroll_cycles_name_key 
   CONSTRAINT     e   ALTER TABLE ONLY payroll_db.payroll_cycles
    ADD CONSTRAINT payroll_cycles_name_key UNIQUE (name);
 T   ALTER TABLE ONLY payroll_db.payroll_cycles DROP CONSTRAINT payroll_cycles_name_key;
    
   payroll_db            neondb_owner    false    219            �           2606    82006 "   payroll_cycles payroll_cycles_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY payroll_db.payroll_cycles
    ADD CONSTRAINT payroll_cycles_pkey PRIMARY KEY (id);
 P   ALTER TABLE ONLY payroll_db.payroll_cycles DROP CONSTRAINT payroll_cycles_pkey;
    
   payroll_db            neondb_owner    false    219            �           2606    82020 .   payroll_date_types payroll_date_types_name_key 
   CONSTRAINT     m   ALTER TABLE ONLY payroll_db.payroll_date_types
    ADD CONSTRAINT payroll_date_types_name_key UNIQUE (name);
 \   ALTER TABLE ONLY payroll_db.payroll_date_types DROP CONSTRAINT payroll_date_types_name_key;
    
   payroll_db            neondb_owner    false    220            �           2606    82018 *   payroll_date_types payroll_date_types_pkey 
   CONSTRAINT     l   ALTER TABLE ONLY payroll_db.payroll_date_types
    ADD CONSTRAINT payroll_date_types_pkey PRIMARY KEY (id);
 X   ALTER TABLE ONLY payroll_db.payroll_date_types DROP CONSTRAINT payroll_date_types_pkey;
    
   payroll_db            neondb_owner    false    220            �           2606    82102     payroll_dates payroll_dates_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY payroll_db.payroll_dates
    ADD CONSTRAINT payroll_dates_pkey PRIMARY KEY (id);
 N   ALTER TABLE ONLY payroll_db.payroll_dates DROP CONSTRAINT payroll_dates_pkey;
    
   payroll_db            neondb_owner    false    224            �           2606    82062    payrolls payrolls_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY payroll_db.payrolls
    ADD CONSTRAINT payrolls_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY payroll_db.payrolls DROP CONSTRAINT payrolls_pkey;
    
   payroll_db            neondb_owner    false    223            �           2606    81991    staff staff_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY payroll_db.staff
    ADD CONSTRAINT staff_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY payroll_db.staff DROP CONSTRAINT staff_pkey;
    
   payroll_db            neondb_owner    false    218            �           2606    81969    users users_email_key 
   CONSTRAINT     U   ALTER TABLE ONLY payroll_db.users
    ADD CONSTRAINT users_email_key UNIQUE (email);
 C   ALTER TABLE ONLY payroll_db.users DROP CONSTRAINT users_email_key;
    
   payroll_db            neondb_owner    false    216            �           2606    81967    users users_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY payroll_db.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY payroll_db.users DROP CONSTRAINT users_pkey;
    
   payroll_db            neondb_owner    false    216            �           1259    32785    users_sync_deleted_at_idx    INDEX     Y   CREATE INDEX users_sync_deleted_at_idx ON neon_auth.users_sync USING btree (deleted_at);
 0   DROP INDEX neon_auth.users_sync_deleted_at_idx;
    	   neon_auth            neondb_owner    false    215            �           1259    82144    idx_holidays_date    INDEX     J   CREATE INDEX idx_holidays_date ON payroll_db.holidays USING btree (date);
 )   DROP INDEX payroll_db.idx_holidays_date;
    
   payroll_db            neondb_owner    false    221            �           1259    82139    idx_payroll_dates_date_range    INDEX     g   CREATE INDEX idx_payroll_dates_date_range ON payroll_db.payroll_dates USING btree (adjusted_eft_date);
 4   DROP INDEX payroll_db.idx_payroll_dates_date_range;
    
   payroll_db            neondb_owner    false    224            �           1259    82138    idx_payroll_dates_payroll_id    INDEX     `   CREATE INDEX idx_payroll_dates_payroll_id ON payroll_db.payroll_dates USING btree (payroll_id);
 4   DROP INDEX payroll_db.idx_payroll_dates_payroll_id;
    
   payroll_db            neondb_owner    false    224            �           1259    82140    idx_payroll_dates_processing    INDEX     e   CREATE INDEX idx_payroll_dates_processing ON payroll_db.payroll_dates USING btree (processing_date);
 4   DROP INDEX payroll_db.idx_payroll_dates_processing;
    
   payroll_db            neondb_owner    false    224            �           1259    82141    idx_payrolls_client_id    INDEX     T   CREATE INDEX idx_payrolls_client_id ON payroll_db.payrolls USING btree (client_id);
 .   DROP INDEX payroll_db.idx_payrolls_client_id;
    
   payroll_db            neondb_owner    false    223            �           1259    82142    idx_payrolls_consultant    INDEX     a   CREATE INDEX idx_payrolls_consultant ON payroll_db.payrolls USING btree (primary_consultant_id);
 /   DROP INDEX payroll_db.idx_payrolls_consultant;
    
   payroll_db            neondb_owner    false    223            �           1259    82143    idx_payrolls_manager    INDEX     S   CREATE INDEX idx_payrolls_manager ON payroll_db.payrolls USING btree (manager_id);
 ,   DROP INDEX payroll_db.idx_payrolls_manager;
    
   payroll_db            neondb_owner    false    223            �           1259    90114    idx_users_deactivated_at    INDEX     {   CREATE INDEX idx_users_deactivated_at ON payroll_db.users USING btree (deactivated_at) WHERE (deactivated_at IS NOT NULL);
 0   DROP INDEX payroll_db.idx_users_deactivated_at;
    
   payroll_db            neondb_owner    false    216    216            �           1259    90113    idx_users_is_active    INDEX     N   CREATE INDEX idx_users_is_active ON payroll_db.users USING btree (is_active);
 +   DROP INDEX payroll_db.idx_users_is_active;
    
   payroll_db            neondb_owner    false    216            �           2606    82043 /   adjustment_rules adjustment_rules_cycle_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY payroll_db.adjustment_rules
    ADD CONSTRAINT adjustment_rules_cycle_id_fkey FOREIGN KEY (cycle_id) REFERENCES payroll_db.payroll_cycles(id) ON DELETE CASCADE;
 ]   ALTER TABLE ONLY payroll_db.adjustment_rules DROP CONSTRAINT adjustment_rules_cycle_id_fkey;
    
   payroll_db          neondb_owner    false    219    222    3289            �           2606    82048 3   adjustment_rules adjustment_rules_date_type_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY payroll_db.adjustment_rules
    ADD CONSTRAINT adjustment_rules_date_type_id_fkey FOREIGN KEY (date_type_id) REFERENCES payroll_db.payroll_date_types(id) ON DELETE CASCADE;
 a   ALTER TABLE ONLY payroll_db.adjustment_rules DROP CONSTRAINT adjustment_rules_date_type_id_fkey;
    
   payroll_db          neondb_owner    false    220    3293    222                        2606    82128 >   client_external_systems client_external_systems_client_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY payroll_db.client_external_systems
    ADD CONSTRAINT client_external_systems_client_id_fkey FOREIGN KEY (client_id) REFERENCES payroll_db.clients(id) ON DELETE CASCADE;
 l   ALTER TABLE ONLY payroll_db.client_external_systems DROP CONSTRAINT client_external_systems_client_id_fkey;
    
   payroll_db          neondb_owner    false    226    3283    217                       2606    82133 >   client_external_systems client_external_systems_system_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY payroll_db.client_external_systems
    ADD CONSTRAINT client_external_systems_system_id_fkey FOREIGN KEY (system_id) REFERENCES payroll_db.external_systems(id) ON DELETE CASCADE;
 l   ALTER TABLE ONLY payroll_db.client_external_systems DROP CONSTRAINT client_external_systems_system_id_fkey;
    
   payroll_db          neondb_owner    false    3312    226    225            �           2606    82103 +   payroll_dates payroll_dates_payroll_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY payroll_db.payroll_dates
    ADD CONSTRAINT payroll_dates_payroll_id_fkey FOREIGN KEY (payroll_id) REFERENCES payroll_db.payrolls(id) ON DELETE CASCADE;
 Y   ALTER TABLE ONLY payroll_db.payroll_dates DROP CONSTRAINT payroll_dates_payroll_id_fkey;
    
   payroll_db          neondb_owner    false    3305    223    224            �           2606    82083 +   payrolls payrolls_backup_consultant_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY payroll_db.payrolls
    ADD CONSTRAINT payrolls_backup_consultant_id_fkey FOREIGN KEY (backup_consultant_id) REFERENCES payroll_db.staff(id) ON DELETE SET NULL;
 Y   ALTER TABLE ONLY payroll_db.payrolls DROP CONSTRAINT payrolls_backup_consultant_id_fkey;
    
   payroll_db          neondb_owner    false    218    223    3285            �           2606    82063     payrolls payrolls_client_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY payroll_db.payrolls
    ADD CONSTRAINT payrolls_client_id_fkey FOREIGN KEY (client_id) REFERENCES payroll_db.clients(id) ON DELETE CASCADE;
 N   ALTER TABLE ONLY payroll_db.payrolls DROP CONSTRAINT payrolls_client_id_fkey;
    
   payroll_db          neondb_owner    false    223    3283    217            �           2606    82068    payrolls payrolls_cycle_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY payroll_db.payrolls
    ADD CONSTRAINT payrolls_cycle_id_fkey FOREIGN KEY (cycle_id) REFERENCES payroll_db.payroll_cycles(id) ON DELETE RESTRICT;
 M   ALTER TABLE ONLY payroll_db.payrolls DROP CONSTRAINT payrolls_cycle_id_fkey;
    
   payroll_db          neondb_owner    false    223    219    3289            �           2606    82073 #   payrolls payrolls_date_type_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY payroll_db.payrolls
    ADD CONSTRAINT payrolls_date_type_id_fkey FOREIGN KEY (date_type_id) REFERENCES payroll_db.payroll_date_types(id) ON DELETE RESTRICT;
 Q   ALTER TABLE ONLY payroll_db.payrolls DROP CONSTRAINT payrolls_date_type_id_fkey;
    
   payroll_db          neondb_owner    false    220    223    3293            �           2606    82088 !   payrolls payrolls_manager_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY payroll_db.payrolls
    ADD CONSTRAINT payrolls_manager_id_fkey FOREIGN KEY (manager_id) REFERENCES payroll_db.staff(id) ON DELETE SET NULL;
 O   ALTER TABLE ONLY payroll_db.payrolls DROP CONSTRAINT payrolls_manager_id_fkey;
    
   payroll_db          neondb_owner    false    223    3285    218            �           2606    98305 (   payrolls payrolls_parent_payroll_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY payroll_db.payrolls
    ADD CONSTRAINT payrolls_parent_payroll_id_fkey FOREIGN KEY (parent_payroll_id) REFERENCES payroll_db.payrolls(id);
 V   ALTER TABLE ONLY payroll_db.payrolls DROP CONSTRAINT payrolls_parent_payroll_id_fkey;
    
   payroll_db          neondb_owner    false    3305    223    223            �           2606    82078 ,   payrolls payrolls_primary_consultant_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY payroll_db.payrolls
    ADD CONSTRAINT payrolls_primary_consultant_id_fkey FOREIGN KEY (primary_consultant_id) REFERENCES payroll_db.staff(id) ON DELETE SET NULL;
 Z   ALTER TABLE ONLY payroll_db.payrolls DROP CONSTRAINT payrolls_primary_consultant_id_fkey;
    
   payroll_db          neondb_owner    false    223    3285    218            �           2606    81992    staff staff_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY payroll_db.staff
    ADD CONSTRAINT staff_user_id_fkey FOREIGN KEY (user_id) REFERENCES payroll_db.users(id) ON DELETE SET NULL;
 F   ALTER TABLE ONLY payroll_db.staff DROP CONSTRAINT staff_user_id_fkey;
    
   payroll_db          neondb_owner    false    218    216    3281           