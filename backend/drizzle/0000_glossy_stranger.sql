CREATE TYPE "public"."admin_action_type" AS ENUM('warning', 'restriction', 'suspension');--> statement-breakpoint
CREATE TYPE "public"."audit_tables" AS ENUM('user', 'admin_action', 'profile', 'document', 'notice', 'interaction', 'communicate', 'room', 'room_member', 'engagement', 'shipment', 'shipment_access');--> statement-breakpoint
CREATE TYPE "public"."communicate_status" AS ENUM('open', 'limited', 'blocked');--> statement-breakpoint
CREATE TYPE "public"."communicate_type" AS ENUM('proposal', 'notification');--> statement-breakpoint
CREATE TYPE "public"."document_status" AS ENUM('processing', 'verified', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."engagement_currency" AS ENUM('USD', 'EUR', 'RWF', 'TL');--> statement-breakpoint
CREATE TYPE "public"."engagement_status" AS ENUM('active', 'completed', 'terminated');--> statement-breakpoint
CREATE TYPE "public"."interaction_type" AS ENUM('like', 'comment');--> statement-breakpoint
CREATE TYPE "public"."notice_status" AS ENUM('active', 'closed');--> statement-breakpoint
CREATE TYPE "public"."notice_type" AS ENUM('supply', 'demand');--> statement-breakpoint
CREATE TYPE "public"."profile_status" AS ENUM('pending', 'verified', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."shipment_access_type" AS ENUM('collected', 'delivered');--> statement-breakpoint
CREATE TYPE "public"."shipment_status" AS ENUM('pending', 'canceled', 'in transit', 'delivered');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TYPE "public"."user_status" AS ENUM('active', 'restricted', 'suspended');--> statement-breakpoint
CREATE TABLE "admin_action" (
	"id" varchar(15) PRIMARY KEY NOT NULL,
	"target_user_id" varchar(15) NOT NULL,
	"admin_id" varchar(15) NOT NULL,
	"action_type" "admin_action_type",
	"reason" text,
	CONSTRAINT "admin_action_unq" UNIQUE("admin_id","target_user_id")
);
--> statement-breakpoint
CREATE TABLE "audit_log" (
	"id" varchar(15) PRIMARY KEY NOT NULL,
	"reference_table" "audit_tables" NOT NULL,
	"reference_id" varchar(15) NOT NULL,
	"actor_profile_id" varchar(15) NOT NULL,
	"changes" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "communicate" (
	"id" varchar(15) PRIMARY KEY NOT NULL,
	"sender_id" varchar(15) NOT NULL,
	"target_id" varchar(15) NOT NULL,
	"type" "communicate_type" NOT NULL,
	"message" jsonb NOT NULL,
	"is_read" boolean DEFAULT false NOT NULL,
	"status" "communicate_status" DEFAULT 'open' NOT NULL,
	CONSTRAINT "communicate_unique" UNIQUE("sender_id","target_id","type")
);
--> statement-breakpoint
CREATE TABLE "document" (
	"id" varchar(15) PRIMARY KEY NOT NULL,
	"profile_id" varchar(15) NOT NULL,
	"document_type" text,
	"status" "document_status" DEFAULT 'processing' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "engagement" (
	"id" varchar(15) PRIMARY KEY NOT NULL,
	"room_id" varchar(15) NOT NULL,
	"title" text NOT NULL,
	"status" "engagement_status" NOT NULL,
	"estimated_value" numeric(10, 2) NOT NULL,
	"currency" "engagement_currency" NOT NULL,
	"is_frozen" boolean DEFAULT false NOT NULL,
	CONSTRAINT "engagement_unq" UNIQUE("room_id","title")
);
--> statement-breakpoint
CREATE TABLE "interaction" (
	"id" varchar(15) PRIMARY KEY NOT NULL,
	"notice_id" varchar(15) NOT NULL,
	"from_id" varchar(15) NOT NULL,
	"type" "interaction_type" NOT NULL,
	"content" text NOT NULL,
	CONSTRAINT "interact_unq" UNIQUE("from_id","notice_id","type")
);
--> statement-breakpoint
CREATE TABLE "notice" (
	"id" varchar(15) PRIMARY KEY NOT NULL,
	"profile_id" varchar(15) NOT NULL,
	"type" "notice_type" NOT NULL,
	"title" varchar(20) NOT NULL,
	"description" text NOT NULL,
	"tags" jsonb NOT NULL,
	"images" jsonb NOT NULL,
	"notice_status" "notice_status" DEFAULT 'active' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profile" (
	"id" varchar(15) PRIMARY KEY NOT NULL,
	"user_id" varchar(15) NOT NULL,
	"legal_name" text NOT NULL,
	"image_url" text,
	"registration_number" integer NOT NULL,
	"country" varchar(20),
	"sector" varchar(20),
	"location" jsonb,
	"verification_status" "profile_status" DEFAULT 'pending' NOT NULL,
	"onboarding_step" integer DEFAULT 1 NOT NULL,
	"permission" jsonb,
	"slogan" text,
	CONSTRAINT "profile_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "room" (
	"id" varchar(15) PRIMARY KEY NOT NULL,
	"title" varchar(20) NOT NULL,
	"description" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "room_member" (
	"id" varchar(15) PRIMARY KEY NOT NULL,
	"room_id" varchar(15) NOT NULL,
	"profile_id" varchar(15) NOT NULL,
	"task_role" varchar(20) NOT NULL,
	CONSTRAINT "room_member_uniq" UNIQUE("room_id","profile_id")
);
--> statement-breakpoint
CREATE TABLE "shipment" (
	"id" varchar(15) PRIMARY KEY NOT NULL,
	"engagement_id" varchar(15) NOT NULL,
	"sender_id" varchar(15) NOT NULL,
	"reciever_id" varchar(15) NOT NULL,
	"transport_info" jsonb NOT NULL,
	"package_info" jsonb NOT NULL,
	"status" "shipment_status" NOT NULL,
	"frozen_at" timestamp NOT NULL,
	CONSTRAINT "shipment_unq" UNIQUE("engagement_id","sender_id","reciever_id")
);
--> statement-breakpoint
CREATE TABLE "shipment_access" (
	"shipment_id" varchar(15),
	"key_token" text NOT NULL,
	"is_used" boolean DEFAULT false NOT NULL,
	"expires_at" timestamp NOT NULL,
	"type" "shipment_access_type" NOT NULL,
	CONSTRAINT "shipment_access_pk" PRIMARY KEY("shipment_id","type")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar(15) PRIMARY KEY NOT NULL,
	"email" varchar(50) NOT NULL,
	"password_harsh" text NOT NULL,
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"status" "user_status" DEFAULT 'restricted' NOT NULL,
	CONSTRAINT "email_unq" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "admin_action" ADD CONSTRAINT "admin_action_fk" FOREIGN KEY ("admin_id") REFERENCES "public"."profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admin_action" ADD CONSTRAINT "target_user_fk" FOREIGN KEY ("target_user_id") REFERENCES "public"."profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_log" ADD CONSTRAINT "actor_profile_fk" FOREIGN KEY ("actor_profile_id") REFERENCES "public"."profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "communicate" ADD CONSTRAINT "communicate_sender_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "communicate" ADD CONSTRAINT "communicate_target_fk" FOREIGN KEY ("target_id") REFERENCES "public"."profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document" ADD CONSTRAINT "profile_document_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "engagement" ADD CONSTRAINT "room_engagement_fk" FOREIGN KEY ("room_id") REFERENCES "public"."room"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interaction" ADD CONSTRAINT "user_from_fk" FOREIGN KEY ("from_id") REFERENCES "public"."profile"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interaction" ADD CONSTRAINT "notice_fk" FOREIGN KEY ("notice_id") REFERENCES "public"."notice"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notice" ADD CONSTRAINT "profile_notice_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile" ADD CONSTRAINT "user_profile_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "room_member" ADD CONSTRAINT "room_fk" FOREIGN KEY ("room_id") REFERENCES "public"."room"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "room_member" ADD CONSTRAINT "profile_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shipment" ADD CONSTRAINT "shipment_engagement_fk" FOREIGN KEY ("engagement_id") REFERENCES "public"."engagement"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shipment" ADD CONSTRAINT "shipment_sender_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."room_member"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shipment" ADD CONSTRAINT "shipment_receiver_fk" FOREIGN KEY ("reciever_id") REFERENCES "public"."room_member"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shipment_access" ADD CONSTRAINT "shipment_access_fk" FOREIGN KEY ("shipment_id") REFERENCES "public"."shipment"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "profile_user_idx" ON "profile" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "email_idx" ON "users" USING btree ("email");