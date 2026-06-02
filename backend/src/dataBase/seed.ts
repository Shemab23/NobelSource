import { db } from "./db";
import * as schema from "./schema";
import bcrypt from "bcrypt";



async function main() {
  console.log("---- SEEDING STARTs ----");

  // =====================================================
  // CLEAN (correct order = FK safe)
  // =====================================================
  await db.delete(schema.audit_logs);
  await db.delete(schema.disputes);
  await db.delete(schema.logistics);
  await db.delete(schema.messages);
  await db.delete(schema.items);
  await db.delete(schema.posts);
  await db.delete(schema.room_members);
  await db.delete(schema.rooms);
  await db.delete(schema.sessions);
  await db.delete(schema.users);
  await db.delete(schema.entities);

  const IDs = schema.IDs;

  const hash = await bcrypt.hash("pass12345", 10);

  // ids
const adminId = `${IDs.user}ADMIN001`;
const farmerId = `${IDs.user}FARM001`;
const farmer2Id = `${IDs.user}FARM002`;
const farmer3Id = `${IDs.user}FARM003`;
const buyerId = `${IDs.user}BUY001`;
const buyer2Id = `${IDs.user}BUY002`;
const arb1Id = `${IDs.user}ARB001`;
const arb2Id = `${IDs.user}ARB002`;
const arb3Id = `${IDs.user}ARB003`;

const agroRoomId = `${IDs.room}AGRO001`;
const logisticsRoomId = `${IDs.room}LOGI001`;
const exportRoomId = `${IDs.room}EXPI001`;
const wholesaleRoomId = `${IDs.room}WHOL001`;
const arbitrationRoomId = `${IDs.room}ARBI001`;

// entity
const EntityData: schema.EntityInsert[] = [
  { id: adminId, type: "user" },
  { id: farmerId, type: "user" },
  { id: farmer2Id, type: "user" },
  { id: farmer3Id, type: "user" },
  { id: buyerId, type: "user" },
  { id: buyer2Id, type: "user" },
  { id: arb1Id, type: "user" },
  { id: arb2Id, type: "user" },
  { id: arb3Id, type: "user" },
  { id: agroRoomId, type: "room" },
  { id: logisticsRoomId, type: "room" },
  { id: exportRoomId, type: "room" },
  { id: wholesaleRoomId, type: "room" },
  { id: arbitrationRoomId, type: "room" }
];
await db.insert(schema.entities).values(EntityData);

//  user

const usersData: schema.UserInsert[] = [
  {
    id: adminId,
    email: "admin@nobelsource.io",
    password: hash,
    registration_number: "ADM-001",
    role: "admin",
    metadata: {
      profile: {
        name: "Director_System Admin^Primary authority for the NobelSource network. Responsible for overseeing the core protocol infrastructure, managing global user permissions, and ensuring the absolute integrity of the decentralized ledger and smart contract deployments.",
        image: "https://images.unsplash.com/photo-1502685104226-ee32379fefbe",
        country: "TRNC",
        currency: "USD",
        website: "www.nobelsource.io"
      },
      rating: 100,
      permissions: [{ right: "all", status: "authorised", by: "system", document: "core" }]
    }
  },
  {
    id: farmerId,
    email: "farmer@cyprusfarm.co",
    password: hash,
    registration_number: "FRM-001",
    role: "user",
    metadata: {
      profile: {
        name: "Producer_Ali Demir^A veteran agriculturalist based in Güzelyurt with over 20 years of experience in citrus cultivation. Specializes in export-grade organic farming and sustainable irrigation techniques, providing high-quality raw materials to the Mediterranean supply chain.",
        image: "https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        phone: "+905xxxxxxx",
        country: "TRNC",
        currency: "USD",
        website: "www.cyprusfarm.co"
      },
      rating: 87,
      permissions: [{ right: "sell", status: "authorised", by: adminId, document: "kyc" }]
    }
  },
  {
    id: farmer2Id,
    email: "mehmet@olivepress.cy",
    password: hash,
    registration_number: "FRM-002",
    role: "user",
    metadata: {
      profile: {
        name: "Producer_Mehmet Yilmaz^Renowned master of the Kyrenia mountains, producing cold-pressed extra virgin olive oil. Dedicated to preserving ancient harvesting methods while integrating modern traceability for premium export markets.",
        image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=718&auto=format&fit=crop",
        phone: "+905yyyyyyy",
        country: "TRNC",
        currency: "USD",
        website: "www.olivepress.cy"
      },
      rating: 94,
      permissions: [{ right: "sell", status: "authorised", by: adminId, document: "kyc" }]
    }
  },
  {
    id: farmer3Id,
    email: "ayse@potato.cy",
    password: hash,
    registration_number: "FRM-003",
    role: "user",
    metadata: {
      profile: {
        name: "Producer_Ayse Kaya^An innovative greenhouse manager focusing on red-soil potato production. Utilizes advanced hydroponic monitoring to ensure consistency and yield stability for high-volume wholesale buyers.",
        image: "https://images.unsplash.com/photo-1609161307645-3ad8d7cafb55?q=80&w=1170&auto=format&fit=crop",
        phone: "+905zzzzzzz",
        country: "TRNC",
        currency: "USD",
        website: "www.potato.cy"
      },
      rating: 91,
      permissions: [{ right: "sell", status: "authorised", by: adminId, document: "kyc" }]
    }
  },
  {
    id: buyerId,
    email: "buyer@medtrade.com",
    password: hash,
    registration_number: "BUY-001",
    role: "user",
    metadata: {
      profile: {
        name: "Wholesaler_Mediterranean Trade Ltd^A leading procurement firm focused on sourcing premium agricultural products for European retailers. We facilitate large-scale bulk acquisitions and maintain rigorous quality standards across our diverse portfolio of international trade partners.",
        image: "https://images.unsplash.com/photo-1556740749-887f6717d7e4",
        country: "Turkey",
        currency: "USD",
        website: "www.medtrade.com"
      },
      rating: 80
    }
  },
  {
    id: buyer2Id,
    email: "contact@euroretail.eu",
    password: hash,
    registration_number: "BUY-002",
    role: "user",
    metadata: {
      profile: {
        name: "Wholesaler_Euro Retail Group^International supply chain giant specializing in sustainable produce distribution. Committed to fair-trade practices and establishing long-term, high-capacity contracts with regional producers.",
        image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d",
        country: "EU",
        currency: "EUR",
        website: "www.euroretail.eu"
      },
      rating: 89
    }
  },
  {
    id: arb1Id,
    email: "legal@chamber.cy",
    password: hash,
    registration_number: "ARB-001",
    role: "arbitrator",
    metadata: {
      profile: {
        name: "Arbitrator_Chamber of Commerce^Senior legal mediator specializing in TRNC commercial and maritime law. Provides binding resolutions for cross-border trade disputes and logistics SLA failures.",
        image: "https://images.unsplash.com/photo-1589829545856-d11f58231365",
        country: "TRNC",
        currency: "USD"
      },
      rating: 100
    }
  },
  {
    id: arb2Id,
    email: "expert@agri-legal.com",
    password: hash,
    registration_number: "ARB-002",
    role: "arbitrator",
    metadata: {
      profile: {
        name: "Arbitrator_Dr. Hakan Agriculture^Technical expert in phytosanitary standards and produce quality control. Appointed for disputes regarding cargo spoilage or grade classification discrepancies.",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
        country: "TRNC",
        currency: "USD"
      },
      rating: 98
    }
  },
  {
    id: arb3Id,
    email: "finance@arbitration.com",
    password: hash,
    registration_number: "ARB-003",
    role: "arbitrator",
    metadata: {
      profile: {
        name: "Arbitrator_Settlement Specialist^Specialist in financial reconciliation and escrow release protocols. Handles cases involving payment defaults and breach of contract penalties.",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2",
        country: "Turkey",
        currency: "USD"
      },
      rating: 95
    }
  }
];

await db.insert(schema.users).values(usersData);

//room

const roomsData: schema.RoomInsert[] = [
  {
  id: agroRoomId,
  name: "TRNC Agro Market",
  metadata: {
    description: "Primary agricultural trade corridor for regional producers and wholesalers.",
    tags: ["agriculture", "export", "bulk-trade"],
    // Unified member story: Explicitly defining the roles of the active participants
    members_rules: [
      { actor: "Farmer Ali Demir (FARM001)", role: "Lead Producer / Seller", isAdmin: false },
      { actor: "Farmer Mehmet Yilmaz (FARM002)", role: "Specialized Producer / Seller", isAdmin: false },
      { actor: "Mediterranean Trade Ltd (BUY001)", role: "Lead Wholesaler / Buyer", isAdmin: false }
    ],
    goals: { monthly_target: 3000000, currency: "USD" }
  },
  contract: {
    version: 1,
    introduction: "This protocol establishes the binding commercial relationship between our verified producers and procurement partners. By executing this contract, FARM001, FARM002, and BUY001 agree to the governance of the assigned Arbitration Jurisdiction for all dispute resolutions.",
    sections: {
      shipment_rules: "### Handling & Quality\n- **Incoterms**: EXW (Ex Works) Güzelyurt/Kyrenia hubs.\n- **Inspection**: Mandatory digital inspection report uploaded by BUY001 within 6 hours of receipt.\n- **Standards**: Must meet export-grade classification to qualify for escrow release.",
      payment_terms: "### Settlement\n- **Escrow**: 100% of funds locked upon order verification in the NobelSource ledger.\n- **Confidentiality**: FARM001, FARM002, and BUY001 must not disclose proprietary harvest margins, volume pricing, or private wallet addresses in this public trade channel.",
      penalties: "### Default & Breach\n- **Late Delivery**: 0.5% reduction in total value per day for any delivery past the agreed SLA.\n- **Cancellation**: 20% restocking fee applied if cancellation occurs after the shipment is dispatched by the producer.",
      dispute_resolution: "### Arbitration Trigger\n- Triggers automatically if the quality report provided by BUY001 deviates >20% from the manifest provided by FARM001/FARM002, or if delivery confirmation is withheld >12 hours."
    },
    metadata: {
      provider_id: "FARM_LEAD_POOL",
      receiver_id: "BUY001_DISTRO",
      jurisdiction: arb2Id // Dr. Hakan Agriculture acts as the final authority
    },
    signed: [] // To be updated as FARM001, FARM002, and BUY001 connect
  },
  permissions: ["post", "trade"]
},
  {
  id: logisticsRoomId,
  name: "Logistics Coordination Hub",
  metadata: {
    description: "Advisory hub for cold-chain infrastructure, route optimization, and supply chain integrity protocols.",
    tags: ["advisory", "supply-chain", "cold-chain-standards"],
    // The members represent the governing body and the bulk client receiving advisory support
    members_rules: [
      { actor: "Director_System Admin (ADMIN001)", role: "Platform Oversight / Compliance Auditor", isAdmin: true },
      { actor: "Euro Retail Group (BUY002)", role: "Bulk Client / Logistics Consultant", isAdmin: false }
    ],
    goals: { monthly_target: 50000, currency: "USD" }
  },
  contract: {
    version: 1,
    introduction: "This protocol serves as the advisory framework for cold-chain management and supply chain transparency. ADMIN001 and BUY002 collaborate here to establish the technical standards for all regional logistics providers.",
    sections: {
      shipment_rules: "### Advisory Protocol\n- **Temperature Standards**: Standardize 2-5°C requirements for all incoming cargo.\n- **Telemetry Standards**: Define the 15-minute ping interval for all authorized logistics partners.\n- **Confidentiality**: All proprietary route optimization algorithms and partner-specific delivery nodes shared in this room are strictly confidential.",
      payment_terms: "### Billing & Retainer\n- Advisory fees and consulting billings processed on a Net-15 basis following the submission of quarterly supply chain audit reports.",
      penalties: "### Advisory Liability\n- **Data Integrity**: Failure to provide accurate logistical guidance resulting in systemic cargo spoilage renders the advisory party liable for review and corrective action costs.\n- **Confidentiality Breach**: Unauthorised sharing of advisory documentation results in immediate termination of partnership status.",
      dispute_resolution: "### Resolution\n- Conflicts regarding advisory standards or supply chain policy are resolved via the chamber's mediation protocols."
    },
    metadata: {
      provider_id: "PLATFORM_ADMIN_POOL",
      receiver_id: "RETAIL_ADVISORY_POOL",
      jurisdiction: arb1Id
    },
    signed: []
  },
  permissions: ["logistics"]
},
  {
  id: exportRoomId,
  name: "EU Export Hub",
  metadata: {
    description: "High-compliance syndicate for international trade and EU market entry.",
    tags: ["export", "compliance", "EU-standard", "syndicate"],
    // Unified membership story: Defining the syndicate participants
    members_rules: [
      { actor: "Producer Ayse Kaya (FARM003)", role: "Greenhouse Export Lead", isAdmin: false },
      { actor: "Producer Ali Demir (FARM001)", role: "Citrus Export Specialist", isAdmin: false },
      { actor: "Mediterranean Trade Ltd (BUY001)", role: "Lead International Buyer", isAdmin: false }
    ],
    goals: { monthly_target: 5000000, currency: "EUR" }
  },
  contract: {
    version: 1,
    introduction: "This syndicate agreement governs the coordinated export of premium agricultural commodities to the European Union. FARM003, FARM001, and BUY001 hereby agree to strict adherence to EU phytosanitary protocols under the jurisdiction of the designated Arbitration Chamber.",
    sections: {
      shipment_rules: "### Export Standards\n- **Documents**: Phytosanitary certificates must be validated by the syndicate before dispatch.\n- **Confidentiality**: Syndicate pricing models, supplier harvest coordinates, and internal logistics margins must remain encrypted; these are strictly prohibited from being posted in public audit logs.",
      payment_terms: "### Settlement\n- **Escrow**: Funds released only upon verified digital upload of EU Customs Clearance documentation.\n- **Verification**: BUY001 must confirm receipt of compliance documents within 24 hours of arrival.",
      penalties: "### Regulatory Breach\n- **Liability**: Fines incurred from customs authorities due to inaccurate documentation are the sole responsibility of the party (FARM003 or FARM001) that generated the specific batch manifest.\n- **Syndicate Penalty**: Repeated documentation failures result in suspension of export privileges for the violating party.",
      dispute_resolution: "### Escalation\n- Any challenge from EU customs agents triggers an automatic dispute audit by the Arbitration Chamber (Arb1). Syndicate members must surrender all non-confidential logs for immediate review."
    },
    metadata: {
      provider_id: "SYNDICATE_POOL_EXPORT",
      receiver_id: "INTL_BUYER_EU",
      jurisdiction: arb1Id
    },
    signed: [] // Syndicate signatures required to initiate first bulk export
  },
  permissions: ["trade"]
},
  {
  id: wholesaleRoomId,
  name: "Wholesale Collective",
  metadata: {
    description: "Bulk acquisition hub for high-volume traders and industrial manufacturing.",
    tags: ["wholesale", "bulk", "industrial"],
    // Unified membership story: Defining the bulk procurement ecosystem
    members_rules: [
      { actor: "Master Producer Mehmet Yilmaz (FARM002)", role: "Bulk Commodity Supplier", isAdmin: false },
      { actor: "Mediterranean Trade Ltd (BUY001)", role: "Procurement Lead", isAdmin: false },
      { actor: "Euro Retail Group (BUY002)", role: "Industrial Wholesaler", isAdmin: false }
    ],
    goals: { monthly_target: 2000000, currency: "USD" }
  },
  contract: {
    version: 1,
    introduction: "This collective agreement establishes the terms for high-volume commodity procurement. FARM002, BUY001, and BUY002 hereby commit to the financial protocols defined herein, under the binding arbitration of the assigned settlement specialist.",
    sections: {
      shipment_rules: "### Bulk Handling\n- **Volume**: Minimum order quantities apply to all trade blocks. \n- **Confidentiality**: Private banking information, external wire transfer records, and personal account identifiers must never be posted in this trade channel; all settlements must be verified via the platform escrow system.",
      payment_terms: "### Finance\n- **Escrow**: A 50% initial escrow lock is mandatory upon contract signing, with the remaining 50% released immediately upon confirmed port arrival and quality certification.",
      penalties: "### Default\n- **Order Variance**: A 20% penalty fee is applied to the offending party if confirmed order volumes are adjusted post-contract signing without mutual consent.",
      dispute_resolution: "### Arbitration\n- **Trigger**: Arbitration by Arb3 is triggered automatically if any payment shortfall exceeds $1,000 or if verified volume variance exceeds 5% of the total order value."
    },
    metadata: {
      provider_id: "FARM_POOL_MEHMET",
      receiver_id: "BUYER_COLLECTIVE_POOL",
      jurisdiction: arb3Id
    },
    signed: [] // All members must sign to activate the collective escrow mandate
  },
  permissions: ["trade"]
},
  {
  id: arbitrationRoomId,
  name: "Arbitration Forum",
  metadata: {
    description: "The supreme resolution chamber for platform-wide legal disputes and governance audits.",
    tags: ["legal", "audit", "governance", "judicial"],
    // Unified membership story: Defining the judicial panel
    members_rules: [
      { actor: "Platform Administrator (ADMIN001)", role: "Chief Governance Officer", isAdmin: true },
      { actor: "Arbitrator Arb1 (ARB001)", role: "Lead Jurist / Chamber President", isAdmin: false },
      { actor: "Arbitrator Arb2 (ARB002)", role: "Agro-Standards Specialist", isAdmin: false },
      { actor: "Arbitrator Arb3 (ARB003)", role: "Financial Settlement Expert", isAdmin: false }
    ],
    goals: { monthly_target: 0, currency: "USD" }
  },
  contract: {
    version: 1,
    introduction: "This forum serves as the final binding resolution body for all NobelSource protocol members. All proceedings, deliberations, and final rulings are recorded and implemented directly via the platform ledger.",
    sections: {
      shipment_rules: "### Procedural Protocol\n- **Confidentiality**: All case evidence, chat logs, and financial disclosures submitted are classified as Highly Confidential. Arbitrators and the Admin are strictly bound by non-disclosure agreements regarding specific case identities.",
      payment_terms: "### Arbitration Fees\n- **Assessment**: A non-refundable fee equivalent to 1% of the disputed amount is levied upon case initiation. \n- **Settlement**: These fees are automatically deducted from the losing party’s escrow balance upon final ruling.",
      penalties: "### Enforcement\n- **Binding Nature**: Compliance with forum rulings is mandatory. Non-compliance, or any attempt to circumvent the resolution, results in an immediate total account lock and permanent expulsion from the protocol.",
      dispute_resolution: "### Governance\n- **Finality**: The presiding arbitrator's decision is final, non-negotiable, and enforced via the smart contract layer."
    },
    metadata: {
      provider_id: "GOVERNANCE_ADMIN_POOL",
      receiver_id: "PLATFORM_USER_BASE",
      jurisdiction: arb1Id // Arb1 acts as the presiding judge for the forum itself
    },
    signed: [] // The judicial panel must sign to confirm the Forum's updated bylaws
  },
  permissions: ["trade", "post"]
}
];

await db.insert(schema.rooms).values(roomsData);

// room members
const roomMembers: schema.RoomMemberInsert[] = [
  // --- TRNC Agro Market: Producers & Wholesalers ---
  { room_id: agroRoomId, user_id: farmerId },
  { room_id: agroRoomId, user_id: farmer2Id },
  { room_id: agroRoomId, user_id: buyerId },

  // --- Logistics Coordination Hub: Fleet & Operations ---
  { room_id: logisticsRoomId, user_id: buyer2Id },
  { room_id: logisticsRoomId, user_id: adminId },

  // --- EU Export Hub: Compliance & International Trade ---
  { room_id: exportRoomId, user_id: farmer3Id },
  { room_id: exportRoomId, user_id: buyerId },
  { room_id: exportRoomId, user_id: farmerId },

  // --- Wholesale Collective: Bulk Procurement ---
  { room_id: wholesaleRoomId, user_id: farmer2Id },
  { room_id: wholesaleRoomId, user_id: buyerId },
  { room_id: wholesaleRoomId, user_id: buyer2Id },

  // --- Arbitration Forum: Ad-hoc Case Management ---
  { room_id: arbitrationRoomId, user_id: adminId },
  { room_id: arbitrationRoomId, user_id: arb1Id },
  { room_id: arbitrationRoomId, user_id: arb2Id },
  { room_id: arbitrationRoomId, user_id: arb3Id }
]
await db.insert(schema.room_members).values(roomMembers);

// post

const postsData: schema.PostInsert[] = [
  // --- Agro Room (Market Offers & Local Needs) ---
  { id: `${IDs.post}001`, entity_id: agroRoomId, content: { title: "Premium Cyprus Potatoes - 20 Tons", body: "Red-soil potatoes, washed and export-ready from Güzelyurt.", description: "Direct from farm. Grade A, sizes 45mm+. Packed in 25kg mesh bags.", media: ["https://images.unsplash.com/photo-1609161307645-3ad8d7cafb55?q=80&w=1174&auto=format&fit=crop"], price_cents: 2000, unit: "kg", currency: "USD", location: "Güzelyurt Farm Hub#https://goo.gl", type: "OFFER", category: "Agriculture" }, status: "active" },
  { id: `${IDs.post}002`, entity_id: agroRoomId, content: { title: "Bulk Cement Supply Needed", body: "Looking for 500 bags of Portland Cement.", description: "Urgent requirement for ongoing construction project. Delivery to site preferred.", media: ["https://plus.unsplash.com/premium_photo-1673567870929-d0f8ccc91139?q=80&w=687"], price_cents: 1500, unit: "item", currency: "USD", location: "Nicosia Construction#https://maps.app.goo.gl/C5152nBbYQY9L8QYA", type: "WANT", category: "Construction" }, status: "active" },
  { id: `${IDs.post}004`, entity_id: agroRoomId, content: { title: "Organic Olive Oil - 500L", body: "First cold press from Kyrenia mountains.", description: "Acidity < 0.8%. Harvested Nov 2025. 5L tins.", media: ["https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=718"], price_cents: 3000, unit: "unit", currency: "EUR", location: "Kyrenia Olive Press#https://goo.gl", type: "OFFER", category: "Agriculture" }, status: "active" },
  { id: `${IDs.post}006`, entity_id: agroRoomId, content: { title: "Export Quality Lemons - 5 Tons", body: "Freshly picked Meyer lemons.", description: "Bright yellow, thin-skinned. Sorted by size. Ready for palletizing.", media: ["https://plus.unsplash.com/premium_photo-1675011575199-816513af8373?q=80&w=687"], price_cents: 1800, unit: "kg", currency: "USD", location: "Morphou Packing#https://goo.gl", type: "OFFER", category: "Agriculture" }, status: "active" },
  { id: `${IDs.post}008`, entity_id: agroRoomId, content: { title: "Market Intelligence: Q2 Trends", body: "Agricultural export price trends.", description: "Detailed analysis of price fluctuations in the local market.", media: [], price_cents: 0, unit: "item", currency: "USD", location: "Nobel Hub#https://maps.app.goo.gl/C5152nBbYQY9L8QYA", type: "INFO", category: "Information" }, status: "active" },

  // --- Logistics Room (Support & Infrastructure) ---
  { id: `${IDs.post}003`, entity_id: logisticsRoomId, content: { title: "Cold Storage Logistics Advisory", body: "Consultation on reefer fleet routing.", description: "We offer professional logistics route optimization for chilled transport.", media: ["https://images.unsplash.com/photo-1605705658744-45f0fe8f9663?q=80&w=687"], price_cents: 2000, unit: "hour", currency: "EUR", location: "Famagusta Port#https://maps.app.goo.gl/urRw4iMroQxJ4YDE6", type: "OFFER", category: "Logistics" }, status: "active" },
  { id: `${IDs.post}009`, entity_id: logisticsRoomId, content: { title: "Warehouse Forklift Rental", body: "Reliable equipment for loading.", description: "3-ton Toyota forklift. Daily/Weekly rates.", media: ["https://images.unsplash.com/photo-1684695749267-233af13276d0?q=80&w=1170"], price_cents: 70000, unit: "day", currency: "EUR", location: "Ercan Logistics#https://maps.app.goo.gl/urRw4iMroQxJ4YDE6", type: "OFFER", category: "Logistics" }, status: "active" },
  { id: `${IDs.post}011`, entity_id: logisticsRoomId, content: { title: "Route Safety Protocol 2026", body: "New cold-chain safety guidelines.", description: "Updated thermal seal requirements for all transport partners.", media: [], price_cents: 0, unit: "item", currency: "USD", location: "Admin Office#https://goo.gl", type: "INFO", category: "Logistics" }, status: "active" },
  { id: `${IDs.post}012`, entity_id: logisticsRoomId, content: { title: "GPS Tracking Support", body: "Need tech for cold-chain sensors.", description: "Looking for sensor kits that ping every 15 minutes.", media: [], price_cents: 500, unit: "item", currency: "USD", location: "Logistics Hub#https://goo.gl", type: "WANT", category: "Logistics" }, status: "active" },
  { id: `${IDs.post}013`, entity_id: logisticsRoomId, content: { title: "Customs Clearance Filing", body: "Expert help for paperwork.", description: "Fast-track filing for perishables at the port.", media: [], price_cents: 12000, unit: "item", currency: "EUR", location: "Famagusta Port#https://maps.app.goo.gl/urRw4iMroQxJ4YDE6", type: "OFFER", category: "Logistics" }, status: "active" },

  // --- Export Hub (Compliance & Syndicate) ---
  { id: `${IDs.post}014`, entity_id: exportRoomId, content: { title: "Syndicate Phytosanitary Docs", body: "Batch 001 compliance packet ready.", description: "All docs signed for EU export. Ready for inspection.", media: [], price_cents: 0, unit: "item", currency: "EUR", location: "Export Hub#https://goo.gl", type: "INFO", category: "Agriculture" }, status: "active" },
  { id: `${IDs.post}015`, entity_id: exportRoomId, content: { title: "EU Market Demand: High", body: "Wholesaler looking for citrus.", description: "Need 50 tons of export-grade citrus for Milan.", media: ["https://plus.unsplash.com/premium_photo-1675011575199-816513af8373?q=80&w=687"], price_cents: 2200, unit: "ton", currency: "EUR", location: "Milan#https://goo.gl", type: "WANT", category: "Agriculture" }, status: "active" },
  { id: `${IDs.post}016`, entity_id: exportRoomId, content: { title: "Standardization Meeting", body: "Syncing export grades.", description: "Reviewing Grade A standards for citrus.", media: [], price_cents: 0, unit: "hour", currency: "EUR", location: "Export Hub#https://goo.gl", type: "INFO", category: "Agriculture" }, status: "active" },
  { id: `${IDs.post}017`, entity_id: exportRoomId, content: { title: "Packaging Materials (Export)", body: "Mesh bags needed for 20t order.", description: "High-quality, ventilated mesh bags for citrus exports.", media: [], price_cents: 5, unit: "item", currency: "USD", location: "Export Hub#https://goo.gl", type: "WANT", category: "Agriculture" }, status: "active" },
  { id: `${IDs.post}018`, entity_id: exportRoomId, content: { title: "Insurance for Perishables", body: "Cargo insurance brokerage.", description: "Comprehensive coverage for long-haul export journeys.", media: [], price_cents: 50000, unit: "item", currency: "EUR", location: "Global Insure#https://goo.gl", type: "OFFER", category: "Logistics" }, status: "active" },

  // --- Wholesale Collective (Bulk Flow) ---
  { id: `${IDs.post}007`, entity_id: wholesaleRoomId, content: { title: "Steel Rebar - Grade 60", body: "50 tons of 12mm/16mm rebar.", description: "High tensile strength. Ready for industrial projects.", media: ["https://images.unsplash.com/photo-1763771420746-c75fefab51b5"], price_cents: 176000, unit: "ton", currency: "USD", location: "Famagusta Industrial Zone#https://maps.app.goo.gl/urRw4iMroQxJ4YDE6", type: "OFFER", category: "Construction" }, status: "active" },
  { id: `${IDs.post}010`, entity_id: wholesaleRoomId, content: { title: "Recycled Plastic Pellets (HDPE)", body: "Steady supply for container production.", description: "2 tons/month. Clean and color-sorted.", media: ["https://cpimg.tistatic.com/09132095/b/4/Reprocessed-HDPE-Granules.jpg"], price_cents: 1000, unit: "kg", currency: "USD", location: "Nicosia Industrial#https://maps.app.goo.gl/C5152nBbYQY9L8QYA", type: "WANT", category: "Manufacturing" }, status: "active" },
  { id: `${IDs.post}019`, entity_id: wholesaleRoomId, content: { title: "Bulk Fertilizer", body: "100 tons NPK 15-15-15.", description: "Industrial batch for spring planting.", media: [], price_cents: 80000, unit: "ton", currency: "USD", location: "Morphou Farm Hub#https://goo.gl", type: "OFFER", category: "Agriculture" }, status: "active" },
  { id: `${IDs.post}005`, entity_id: wholesaleRoomId, content: { title: "Solar Installation Labor", body: "Need expert team for 10kW grid-tie.", description: "Hardware provided, need labor/certification.", media: [], price_cents: 15000, unit: "hour", currency: "USD", location: "Kyrenia Heights#https://maps.app.goo.gl/C5152nBbYQY9L8QYA", type: "WANT", category: "Energy" }, status: "active" },
  { id: `${IDs.post}020`, entity_id: wholesaleRoomId, content: { title: "Industrial Storage Racking", body: "Used racking units.", description: "Heavy-duty warehouse racking for container storage.", media: [], price_cents: 20000, unit: "item", currency: "USD", location: "Nicosia Industrial#https://goo.gl", type: "OFFER", category: "Manufacturing" }, status: "active" }
];

await db.insert(schema.posts).values(postsData);

// items

const itemsData: schema.ItemInsert[] = [
  // --- Agro Room: Supply Flow ---
  {
    id: `${IDs.item}001`,
    room_id: agroRoomId,
    amount_cents: 2500000, // $25,000.00
    analytics: {
      product_name: "Bulk Organic Tomatoes",
      status: "active",
      instore: 50,
      participants: { seller_id: farmerId, buyer_id: buyerId },
      weekly_status: [
        { week_ending: "2026-05-08", total_sales: 12, expense: 500, demand_score: 9 },
        { week_ending: "2026-05-15", total_sales: 18, expense: 600, demand_score: 9 }
      ]
    }
  },
  // --- Logistics Room: Advisory & Transport ---
  {
    id: `${IDs.item}002`,
    room_id: logisticsRoomId,
    amount_cents: 120000, // $1,200.00
    analytics: {
      product_name: "Refrigerated Transport Service",
      status: "negotiating",
      instore: 1,
      participants: { seller_id: farmerId, buyer_id: buyerId, logistics_id: adminId }
    }
  },
  // --- Wholesale Room: Industrial Contracts ---
  {
    id: `${IDs.item}003`,
    room_id: wholesaleRoomId,
    amount_cents: 17500000, // $175,000.00 (Bulk Rebar Contract)
    analytics: {
      product_name: "Industrial Grade Rebar",
      status: "active",
      instore: 500,
      participants: { seller_id: farmer2Id, buyer_id: buyer2Id },
      weekly_status: [
        { week_ending: "2026-05-15", total_sales: 50, expense: 2000, demand_score: 10 }
      ]
    }
  },
  // --- Export Room: Phytosanitary Compliance ---
  {
    id: `${IDs.item}004`,
    room_id: exportRoomId,
    amount_cents: 5000000, // $50,000.00 (EU Export Citrus)
    analytics: {
      product_name: "Export-Grade Citrus Batch",
      status: "completed",
      instore: 20,
      participants: { seller_id: farmer3Id, buyer_id: buyerId }
    }
  },
  // Add this missing item
  {
    id: `${IDs.item}005`,
    room_id: logisticsRoomId,
    amount_cents: 50000,
    analytics: { product_name: "Warehouse Restock Supplies", status: "active", instore: 100, participants: { seller_id: adminId, buyer_id: buyer2Id } }
  }
];

await db.insert(schema.items).values(itemsData);


// messages
const messageData: schema.MessageInsert[] = [
  // --- Post Comment to Room Migration (User to User) ---
  {
    id: `${IDs.message}001`,
    from_id: buyerId, // Interested party
    room_id: null,    // Direct message regarding a Post
    participants: [buyerId, farmerId],
    body: "[05-22-2026 08:15](0) I saw your post regarding the 20 tons of potatoes. The quality looks excellent. ^\n[05-22-2026 08:20](1) Glad you reached out! It is harvest-fresh. ^\n[05-22-2026 08:22](0) Can we create a private workspace to hash out the logistics? ^\n[05-22-2026 08:25](1) Absolutely, I will generate the room link now.",
    flag: "proposal"
  },
  // --- Active Workspace Conversation (Agro Room) ---
  {
    id: `${IDs.message}002`,
    from_id: farmerId,
    room_id: agroRoomId,
    participants: [farmerId, buyerId],
    body: "[05-22-2026 08:30](0) Workspace created. Please upload your preferred delivery schedule here. ^\n[05-22-2026 08:35](1) Uploading now. Also, for the payment, shall we lock 50% in escrow as per protocol? ^\n[05-22-2026 08:40](0) Correct. 50% lock confirms the order. I have flagged the item as 'negotiating' until funds are verified.",
    flag: "chat"
  },
  // --- Administrative Oversight & System Report ---
  {
    id: `${IDs.message}003`,
    from_id: buyer2Id, // User reporting an issue
    room_id: null,
    participants: [buyer2Id, adminId],
    body: "[05-22-2026 08:05](0) Admin, I am encountering a UI glitch when attempting to finalize the Escrow lock for the Wholesale steel order. ^\n[05-22-2026 08:10](1) Thank you for the report. Our dev team is investigating the cache latency. Please clear your browser data and try again in 5 minutes.",
    flag: "system"
  },
  // --- System/Admin Announcements ---
  {
    id: `${IDs.message}004`,
    from_id: adminId,
    room_id: wholesaleRoomId,
    participants: [adminId, farmer2Id, buyer2Id],
    body: "[05-22-2026 08:40](0) System Notice: Maintenance completed. All escrow functions are restored. We apologize for the temporary trade interruption.",
    flag: "system"
  },
  // --- Dispute Resolution/Mediation ---
  {
    id: `${IDs.message}005`,
    from_id: farmer2Id,
    room_id: wholesaleRoomId,
    participants: [farmer2Id, buyer2Id, arb3Id],
    body: "[05-22-2026 08:45](0) Regarding the 5% volume variance, I suggest a 100 USD credit to balance the books. ^\n[05-22-2026 08:50](1) That seems fair. I would rather settle this between us than trigger the full penalty. ^\n[05-22-2026 08:55](2) As the Arbitrator, I acknowledge this resolution. If both parties agree, please formalize the price adjustment.",
    flag: "dispute"
  }
];
await db.insert(schema.messages).values(messageData);

// logistics
const logisticData: schema.LogisticsInsert[] = [
  // 1. Successful Transaction (Verified Proof)
  {
    id: `${IDs.logistics}001`,
    room_id: agroRoomId,
    item_id: `${IDs.item}001`,
    from_id: farmerId,
    to_id: buyerId,
    transport_metadata: { type: "company", name: "FastTrans", phone: "+905123", plate_number: "TRNC-100", schedule: { pattern: "weekly", start_date: "2026-05-04", time_window: "08:00-10:00", recurring_day: 1 } },
    payment: { amount_cents: 100000, currency: "USD", proof: "https://www.rd.usda.gov/sites/default/files/pdf-sample_0.pdf", proof_status: "verified", confirmed_by: [farmerId, buyerId], account_number: "ACC-8899", method_of_payment: "Paypal" },
    status: "delivered"
  },
  // 2. In-Transit (Pending Verification)
  {
    id: `${IDs.logistics}002`,
    room_id: agroRoomId,
    item_id: `${IDs.item}001`,
    from_id: farmerId,
    to_id: buyerId,
    transport_metadata: { type: "sole", name: "Ali Driver", phone: "+905999", plate_number: "TRNC-200", schedule: { pattern: "one-time", start_date: "2026-05-22", time_window: "14:00-16:00" } },
    payment: { amount_cents: 80000, currency: "USD", proof_status: "pending", account_number: "ACC-1122", method_of_payment: "IsBank" },
    status: "in_transit"
  },
  // 3. Wholesale Contract (Escrow Pending)
  {
    id: `${IDs.logistics}003`,
    room_id: wholesaleRoomId,
    item_id: `${IDs.item}003`,
    from_id: farmer2Id,
    to_id: buyer2Id,
    transport_metadata: { type: "company", name: "HeavyHaul", phone: "+905888", plate_number: "TRNC-999", schedule: { pattern: "one-time", start_date: "2026-05-30", time_window: "09:00-18:00" } },
    payment: { amount_cents: 500000, currency: "EUR", account_number: "ESCROW-001", method_of_payment: "BankEscrow" },
    status: "pending"
  },
  // 4. Logistics Hub Restock
  {
    id: `${IDs.logistics}004`,
    room_id: logisticsRoomId,
    item_id: `${IDs.item}005`,
    from_id: adminId,
    to_id: buyer2Id,
    transport_metadata: { type: "company", name: "LogiCorp", phone: "+905777", plate_number: "TRNC-777", schedule: { pattern: "monthly", start_date: "2026-05-01", time_window: "10:00-12:00" } },
    payment: { amount_cents: 50000, currency: "USD", proof: "https://www.company-receipts.com/logi-004.pdf", proof_status: "verified", confirmed_by: [adminId], account_number: "ACC-5544", method_of_payment: "Transfer" },
    status: "collected"
  },
  // 5. Export Hub High Priority
  {
    id: `${IDs.logistics}005`,
    room_id: exportRoomId,
    item_id: `${IDs.item}004`,
    from_id: farmer3Id,
    to_id: buyerId,
    transport_metadata: { type: "company", name: "EU-Link", phone: "+905666", plate_number: "EU-555", schedule: { pattern: "one-time", start_date: "2026-05-22", time_window: "06:00-20:00" } },
    payment: { amount_cents: 200000, currency: "EUR", proof_status: "pending", account_number: "ACC-9988", method_of_payment: "Wise" },
    status: "in_transit"
  },
  // 6. Dispute Scenario
  {
    id: `${IDs.logistics}006`,
    room_id: wholesaleRoomId,
    item_id: `${IDs.item}002`,
    from_id: farmer2Id,
    to_id: buyer2Id,
    transport_metadata: { type: "company", name: "FastTrans", phone: "+905123", plate_number: "TRNC-100", schedule: { pattern: "one-time", start_date: "2026-05-15", time_window: "10:00-12:00" } },
    payment: { amount_cents: 12000, currency: "USD", proof: "https://www.dispute-evidence.com/log-006.pdf", proof_status: "rejected", account_number: "ACC-0000", method_of_payment: "Bank" },
    status: "disputed"
  },
  // 7. Site Forklift Transport
  {
    id: `${IDs.logistics}007`,
    room_id: logisticsRoomId,
    item_id: `${IDs.item}004`,
    from_id: adminId,
    to_id: buyer2Id,
    transport_metadata: { type: "sole", name: "Mehmet Logistics", phone: "+905444", plate_number: "TRNC-444", schedule: { pattern: "one-time", start_date: "2026-05-25", time_window: "08:00-12:00" } },
    payment: { amount_cents: 15000, currency: "USD", account_number: "ACC-7766", method_of_payment: "Cash" },
    status: "pending"
  }
];
await db.insert(schema.logistics).values(logisticData);

const disputeData: schema.DisputeInsert[] = [
  // 1. The Active Stalemate: Awaiting an Arbitrator
  {
    id: `${IDs.dispute}001`,
    room_id: wholesaleRoomId,
    logistics_id: `${IDs.logistics}006`, // The canceled wholesale delivery
    opened_by: buyer2Id,
    status: "open",
    resolved: false
  },
  // 2. The Internal Harmony: Resolved by parties, formalizing now
  {
    id: `${IDs.dispute}002`,
    room_id: agroRoomId,
    logistics_id: `${IDs.logistics}002`,
    opened_by: farmerId,
    arbitrator_id: arb3Id,
    resolution: "Parties agreed to a 100 USD credit for minor weight variance. Dispute settled internally via credit memo.",
    claim:"he wronged me , my money, please return it!",
    status: "resolved",
    resolved: true,
    resolved_at: new Date("2026-05-22T09:00:00Z")
  },
  // 3. The Administrative Oversight: System issue flagged
  {
    id: `${IDs.dispute}003`,
    room_id: logisticsRoomId,
    logistics_id: `${IDs.logistics}007`,
    opened_by: buyer2Id,
    arbitrator_id: adminId,
    resolution: "Forklift transport delay identified as a technical scheduling glitch. Priority re-assigned to next available shift.",
    claim:"he wronged me , my money, please return it!",
    status: "resolved",
    resolved: true,
    resolved_at: new Date("2026-05-22T09:30:00Z")
  }
];
await db.insert(schema.disputes).values(disputeData);

// sessions
const sessionsData: schema.SessionInsert[] = [
  {
    token: `${IDs.session}001`,
    entity_id: farmerId,
    expires_at: new Date(Date.now() + 86400000)
  },
  {
    token: `${IDs.session}002`,
    entity_id: buyerId,
    expires_at: new Date(Date.now() + 86400000)
  }
];
await db.insert(schema.sessions).values(sessionsData);

// audit logs
const auditLogsData: schema.AuditLogInsert[] = [
  // 1. Farmer initiates the offer
  {
    id: `${IDs.audit}001`,
    entity_id: farmerId,
    action: "CREATE",
    detail: ` target: "post": id[${IDs.post}001]: item "potatoes" }`,
    flag: "info"
  },
  // 2. Buyer signs the contract for the agroRoom
  {
    id: `${IDs.audit}002`,
    entity_id: buyerId,
    action: "ROOM",
    detail: ` [contract Signed]room agroRoomId: contract_type "escrow_secured" `,
    flag: "info"
  },
  // 4. Buyer triggers a critical dispute regarding damaged goods
  {
    id: `${IDs.audit}004`,
    entity_id: buyerId,
    action: "ROOM",
    detail:  `[Dispute Triggered]room agroRoomId: contract_type "escrow_secured" `,
    flag: "critical"
  },
  // 5. Arbitrator (arb3Id) intervenes to resolve
  {
    id: `${IDs.audit}005`,
    entity_id: arb3Id,
    action: "ROOM",
    detail:  `[contract Signed]room agroRoomId: contract_type "escrow_secured" `,
    flag: "info"
  },
  // 6. Final verification by admin
  {
    id: `${IDs.audit}006`,
    entity_id: adminId,
    action: "SOLO",
    detail: `SYStem sent message`,
    flag: "info"
  }
];
await db.insert(schema.audit_logs).values(auditLogsData);


  console.log("---- SEEDING END (Successful) ----");
  process.exit(0);
}

main().catch((err) => {

  console.log("---- SEEDING STOP(error) ----");
  console.log(err);
  process.exit(1);
});
