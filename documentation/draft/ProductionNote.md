# Nobel Source Hub - Product Indentity
**Table of Content**
- [Nobel Source Hub - Product Indentity](#nobel-source-hub---product-indentity)
  - [Strategic \& Legal Framework](#strategic--legal-framework)
    - [The core problem:supply chain fragmentation](#the-core-problemsupply-chain-fragmentation)
    - [The solution: Integrated Digital Infrastructure](#the-solution-integrated-digital-infrastructure)
    - [Position statement](#position-statement)
    - [Legal stance \& Operational AUthority](#legal-stance--operational-authority)
      - [Responsibility matrix](#responsibility-matrix)
      - [Adminitrative stand](#adminitrative-stand)
    - [Minimum viable Product(MVP) scope \[Graduation Project Boundaries\]](#minimum-viable-productmvp-scope-graduation-project-boundaries)
    - [Trust model \& suspension Policy](#trust-model--suspension-policy)
      - [Trust Architecture](#trust-architecture)
      - [Administrative Mitigation(Suspension clause)](#administrative-mitigationsuspension-clause)
    - [Example Mandate](#example-mandate)
    - [Standardized Naming Conversions](#standardized-naming-conversions)
    - [Activity flows](#activity-flows)
    - [Data architecture: Entity definitions](#data-architecture-entity-definitions)
    - [possible minimal index](#possible-minimal-index)
    - [Refined Database Seed Data](#refined-database-seed-data)
    - [wireframe](#wireframe)
      - [splash screen](#splash-screen)
      - [onboard (registration process)](#onboard-registration-process)
      - [public feed](#public-feed)
      - [chamber mode](#chamber-mode)
  - [UI design](#ui-design)
    - [reason behind](#reason-behind)
    - [palette preparation](#palette-preparation)
## Strategic & Legal Framework
### The core problem:supply chain fragmentation
the current regional trade ecosystem in Africa is hindered by structural inefficiencies that Nobel Source aims to solve:
- Logistical monopoly: intermediaries manipulate market prices,creating volatility that depletes supplier profits.
- Capital Risk Imbalance: suppliers bear 100% of theproduct and climate risks while possessing 0% influence over final sale prices.
- Settlement inefficiency: Delayed payments and defaults have become normalized due to "loose", unstructured agreements.
- Information Asymmetry:A lack of direct communication chanels leads to frequent supply/demand mismatches.
### The solution: Integrated Digital Infrastructure
Nobel source provides a structured environment to move trade from informal to formal:
- Collaborative environment: Transitions users from one-of transactions to planned, long-term partnerships.
- contract-backed logistic: Implements procedural penalities for contract defiance to discourage payment and delivery defaults.
- mutual benefit logic: All parties agree on operational terms upfront, binding all subsequent activities to that specific contract.
- Record risk mitigation: Immutable logging of every activity ensures a single source of truth for future reference.
### Position statement
Nobel Source is a regional infrastructure solution designed to eliminate reliance on opaque intermediaries.It Structures direct , transparent and contract-backed collaboration between suppliers and buyers.
### Legal stance & Operational AUthority
Nobel Source operates as a Sovereign Technical Infrastructure Guarantor.
>**Note**: The platform provides the technical "rails" for trade, it does not provide judicial or legal enforcement services.
#### Responsibility matrix
|Accountable for|Not acountable for|
|--|--|
|ensuring technical operational control within the platform|guaranteeing legal enforceability in external courts|
|maintaining high_integrity system logs and audit trails|setting or regulating market prices|
|verification status of submitted corporate documents|handling or processing financial payments|
|Restricting record modification aftr confirmation|Authenticating legal documnets beyond procedural review|
#### Adminitrative stand
All platform penalities(suspensions/restrictions) are Administrative Actions designed to protect the system's integrity, not Judicial Rulings.
### Minimum viable Product(MVP) scope [Graduation Project Boundaries]
To ensure technical delivery within the project timeline, the scope is strictly defined:
**In scope**
- Full_stack Hub:developmen of web frontend, Rest API backend and postgresql database.
- Identity System: user registration with legal document submission/claimed identity.
- Design&UX:complete UI/UX design for the platform hub.
- Verification: integration testing(postman) and final documentation report.
**out of scope**
- financilas: payment gateway integration and handling them
- optimization: high-load stress testing or performance fine-tuning
- Security: Full-scale penetration testing.
- DevOps:Dockerization,CI/CD pipelines, or mbile-specific builds.
- Testing:Extensive unit testing or E2E automation.
### Trust model & suspension Policy
#### Trust Architecture
1. Identity verification:A 2-step process involving document submission and format validation of operational rights.
2. Audit Integrity: A reliable, complete log of every operational activity.
#### Administrative Mitigation(Suspension clause)
**purpose**:To prevent threats to platform stability and user safety through temporary or permanet restrictions.

**Grounds for administrative Action**:
- Submission of falsified,misleading,or unverfiable documents
- Repeated breach of platform_mandated contractual procedures
- Abuse of communication systems(harassment,spam) or attempt to manipulate logs
- Activities inconsistent with the platform's declared scope.

**Administrative Measures**
- warning notice
- temporary feature restriction
- temporary account suspension
- permanent account termination

**procedure**
- Notification:The concerned user is alerted to the specific reason for action
- Clarification:A 48-hour window is provided for the user to submit a reponse.
- Finality:An administrative decision is made and permanetly recorded in the system logs.
### Example Mandate
Status:✅ACTIVE(LEGALLY Binding within Nobel Source Hub)<br>
Mandate Reference:`NS-MND-1002-ALPHA`|version:1.0

1. Parties involved
This agreement is executed within the collaboration chamber between the following verified entities:
- the supplier:Unity Milling Co.(Sector: Processing)
- the Buyer:Source Retail(Sector: Retail)
-------
2. commercial Terms(The Core Deal)
The parties hereby agree to the exchange of goods based on the following verified parameters:

|variable|specification|
|------|-----|
|Commodity	|Grade 1 Fortified Maize Flour|
|Quantity	|1,000 kg (Subject to a ±2% weight tolerance)|
|Unit Pricing	|50.00 KES per kg|
|Total Valuation	|50,000.00 KES|
|Delivery Term	|FOB (Free On Board)|
|Collection Point	|Unity Milling Warehouse, Zone B|
|Target Date	|February 25, 2026|

-----
3. Operational Articles<br>
**Article 1. Scope of Infracture**<br>
Both parties acknowledge that Nobel Source Hub serves as the Sovereign Technical Infrastructure Guarantor.All performance metrics,including timestamps and GPS logs,constitute the primary evidence of contract fulfilment.<br>
**Article 2. Quality Assurance**<br>
The supplier warrants that the moisture content of the flour shall not exceed 13.5%.All goods must be dispatched in the biodegradable packaging specified Room 600.<br>
4. Administrative penalities
Failure to adhere to the terms above triggers the following platform mitigations:
- Operational Delay: A deduction of 0.5% of total value per 24-hour delay.
- Integrity Breach:Failure to provide real-time GPS logs during transit will result in an "Integrity warning" badge being applied to the defaulting party's profile.
------
5. by clicking "Execute Mandate" the parties confirm they have reviewed the parameters and agree to be bound by the platform's administrative oversight.
- ✍️ Signed by supplier:Unity Milling Co.(`profile_id: 20`)
  - *Timestamp:Feb 15,2026, 10:00:00z*
- ✍️ Signed by buyer:Noble Source Retail(`profile_id: 30`)
  - *Timestamp:Feb 15,2026, 14:30:00z*
------
### Standardized Naming Conversions
| term | formal(database) | breif(ui) |
| --- | --- | --- |
| ----| -workspace-| --- |
| the ecosystem | collaboration_chamber | chamber |
| project container | engagement_room | room |
| contract | mandate | contract |
| execution of contract | execute_mandate | sign |
| work schedule | Operational_plan | plan |
| meeting Records | session_record | record |
| internal workspance link | session_room | session |
|----|-market discovery-|---|
|public post|commercial_notice|post|
|product listing|supply_notice/demand_notice|listing|
|feed| marketplace_feed|explore|
| partner ask | engagement_proposal | request |
| public interaction | public_interaction | react |
|entity page|entity_profile|profile|
|----|-trust & logistics-|----|
|legal entity|legal_entity|company|
|logistics provider|logistics_operator|transporter|
|verification state|verification_status|verified|
|security action|administrative_restriction|restrict|
|delivery trancking|delivery_schedulschedule|
|payment status| settlement_status|paid|

### Activity flows
These flows define the state transitions of the system.Each arrow represents a trigger that shits the user from one state to the next.
1. registration & Trust onboradring<br>
**Flow**: register-> document submission -> compliance revie(Admin) -> account activation<br>
**Logic gate**: the user remains in a "limited" state until the compliance_review shits the verification_status to "verified".
2. Discovery & Interaction(public layer)<br>
**Flow**: login-> explore feed->browse commercial notices-> open notice detail-> view profile-> send engagement request(proposal).<br>
**logic gate**: communication here is restricted to a singl einitial inquiry to prevent spam before a formal partnership exists.
3. Formation(transition layer)<br>
**Flow**: Enter collaboration chamber -> open initiation panel -> select verified company-> submit engagement proposal -> partner approval ->  room creation.<br>
**logic gate**: A room is only generated upon a successful "approval of a proposal.<br>
4. operational execution(private layer)<br>
**Flow(inside room)**: execute mandate -> review operational plan -> schedule deliveries -> record shipments ->log delivery order.<br>
**logic gate**: The "sign"(execute_mandate) action locks the mandate version providing the baseline for the operational_plan.
5. profile management
**Flow**:Enter profile console ->update identity/legal terms -> save-> logout.

**NB**:
- if one person signs and other person request change in the contract_content, and it is updatedl signatories array is wiped empty and signature goes back to pending with no one signed yet.
- transporter upon scanning they enter name and phone number before the key is accepted as is_used.
- using global state context, so user in the room ,can also still see the notification in the top bar from the public mode.publicmode{tabs=[explore,profile,notification]};chambermode{tabs=[rooms,proposal,settings]}
### Data architecture: Entity definitions
the database is structured into functional clusters to ensure high integrity and clear separation between public discovery and privater execution.
1. IDENTITY & ACCESS
```
Table user {
  id int [pk, increment]
  email varchar [unique, not null]
  password_hash text [not null]
  role enum('user','admin') [not null]
  status enum('active','restricted','suspended') [default: 'active']
}

Table profile {
  id int [pk, increment]
  user_id int [unique, ref: < user.id]
  legal_name varchar [not null]
  image_url text
  registration_number int
  country varchar
  sector text
  location json {log, lat} // changed
  verification_status enum('pending','verified','rejected') [default: 'pending']
  onboarding_step int [default: 1]
  permissions jsonb // feature unlocked for them
  slogan text
}

Table document {
  id int [pk, increment]
  profile_id int [ref: < profile.id]
  document_type text
  file_path text
  status enum('processing','verified','rejected')
}
```
2. MARKET DISCOVERY
```
Table notice {
  id int [pk, increment]
  profile_id int [ref: < profile.id]
  type enum('supply','demand')
  title varchar
  description text
  tags text
  image_urls jsonb
  status enum('active','closed') [default: 'active']

  indexes { (status,type)}
}

Table interaction {
  id int [pk, increment]
  notice_id int [ref: < notice.id]
  user_from_id int [ref: < profile.id]
  type enum('like','comment')
  content text
  Indexes { (notice_id, user_from_id, type) [unique] }
}
```

3. COMMUNICATION
```
Table communicate {
  id int [pk, increment]
  sender_id int [ref: < profile.id]
  target_id int [ref: < profile.id]
  type enum('proposal','notification')
  message jsonb
  is_read boolean [default: false]
  status enum('open','limited','blocked')

  Indexes { (target_id,is_read)}
}
```
4. COLLABORATION
```
Table room {
  id int [pk, increment]
  title varchar
  description text
  origin_notice_id int [ref: < notice.id]
  origin_proposal_id int [ref: < communicate.id]
}

Table room_member {
  id int [pk, increment]
  room_id int [ref: < room.id]
  profile_id int [ref: < profile.id]
  task_role varchar

  Indexes { (room_id, profile_id) [unique] }
}

Table engagement {
  id int [pk, increment]
  room_id int [ref: < room.id]
  title text
  status enum('active','completed','terminated')
  estimated_value decimal // Logic: Business reporting
  currency varchar(3) [default: 'USD']
  is_frozen boolean [default: false]

  Indexes {(room_id,status)}
}
```
5. LOGISTICS
```
Table shipment {
  id int [pk, increment]
  engagement_id int [ref: < engagement.id]
  sender_member_id int [ref: < room_member.id] // Logic: Chain of custody
  receiver_member_id int [ref: < room_member.id]
  transporter_info jsonb
  package_manifest jsonb
  status enum('pending','canceled','in transit','delivered')
  frozen_at timestamp

  Indexes { status }
}

Table shipment_access {
  id int [pk, increment]
  shipment_id int [ref: < shipment.id]
  key_token text
  is_used boolean [default: false]
  expires_at timestamp
  type enum('collected','delivered')
}
```
6.  AUDIT & UTILS
```
Table audit_log {
  id int [pk, increment]
  reference_table varchar
  reference_id int
  actor_profile_id int [ref: < profile.id]
  changes jsonb
  created_at timestamp [default: `now()`]

  Indexes { (reference_table, reference_id) }
}

Table admin_action {
  id int [pk, increment]
  target_user_id int [ref: < user.id]
  admin_id int [ref: < user.id]
  action_type enum('warning','restriction','suspension','termination')
  reason text
  expires_at timestamp
}

```
### possible minimal index
```
user: email -> fast login
profile: user_id ->essential to load the user's ability the soon they login
notice: status,type -> high frequency search for public feed
engagement: status -> quick filter active rooms vs completed history
engagement_participant: profile_id -> quickly know which room i belong to
shipment: status,scheduled_date -> quickly show transporter what is pending for today
notification: user_id, is_read -> show the "unread" count badge in the ui without lag
```
### Refined Database Seed Data
**Identity & Public Market**
|user|profile|commercial Notice|
|----|-----|------|
|farmer|sunrise farms|supply:grade a white maize|
|miller|unity milling Co.|demand:bulk maize grain|
|me(retail)|source Retail|demand: branded flour Packiaging|
|supplier|EcoPack Solutions|supply:recycled Bio-packaging|

**Scenario A: The Ecosystem(room 500)**
Title: Maize porridge Production Line
Objective: Track the movement from Farm -> Mill -> shelf

|engagement|status|participants|operational context|
|-----|----|-----|------|
|raw maize delivery|`completed`|farmer s /miller b|historic log of the successful grain transfer|
|flour shipment|`active`|miller s /retailer b |frozen state:current shipment is on the raod|

**Scenario B: Direct Sourcing(room 600)**
Title: Direct Packaging supply
Objective: Private room for retail brand materials.

**Detailed JSON seeding Script**
```
{
  "users": [
    { "id": "USER_1", "email": "farmer@sunrise.com", "password_harsh": "hash_789_ext", "role": "user", "status": "active" },
    { "id": "USER_2", "email": "miller@unity.com", "password_harsh": "hash_456_ext", "role": "user", "status": "active" },
    { "id": "USER_3", "email": "me@nobel.com", "password_harsh": "hash_123_ext", "role": "user", "status": "active" },
    { "id": "USER_4", "email": "supplier@ecopack.com", "password_harsh": "hash_000_ext", "role": "user", "status": "active" },
    { "id": "USER_5", "email": "admin@nobel.com", "password_harsh": "hash_admin_ext", "role": "admin", "status": "active" }
  ],
  "profiles": [
    { "id": "PROFILE_10", "user_id": "USER_1", "legal_name": "Sunrise Farms Ltd", "registration_number": 10001, "sector": "Agriculture", "country": "Kenya", "verification_status": "verified", "onboarding_step": 4, "slogan": "Quality Grain for Africa" },
    { "id": "PROFILE_20", "user_id": "USER_2", "legal_name": "Unity Milling Co", "registration_number": 20002, "sector": "Processing", "country": "Kenya", "verification_status": "verified", "onboarding_step": 4, "slogan": "Finest Fortified Flour" },
    { "id": "PROFILE_30", "user_id": "USER_3", "legal_name": "Source Retail Group", "registration_number": 30003, "sector": "Retail", "country": "Rwanda", "verification_status": "verified", "onboarding_step": 4, "slogan": "Sourced with Integrity" },
    { "id": "PROFILE_40", "user_id": "USER_4", "legal_name": "EcoPack Solutions", "registration_number": 40004, "sector": "Manufacturing", "country": "Uganda", "verification_status": "verified", "onboarding_step": 4, "slogan": "Sustainable Packaging" },
    { "id": "PROFILE_50", "user_id": "USER_5", "legal_name": "System Auditor", "registration_number": 0, "sector": "Tech", "country": "Global", "verification_status": "verified", "onboarding_step": 4 }
  ],
  "admin_actions": [
    { "id": "ADMIN_1", "target_user_id": "PROFILE_10", "admin_id": "PROFILE_50", "action_type": "warning", "reason": "Minor delay in documentation upload during onboarding." }
  ],
  "documents": [
    { "id": "DOCUMENT__1", "profile_id": "PROFILE_10", "document_type": "KRA_Tax_Compliance", "status": "verified" },
    { "id": "DOCUMENT__2", "profile_id": "PROFILE_20", "document_type": "Food_Safety_Certificate", "status": "verified" }
  ],
  "notices": [
    { "id": "NOTICE__100", "profile_id": "PROFILE_10", "type": "supply", "title": "Bulk White Maize", "description": "Grade A white maize, 500 tons available. Moisture content < 13%.", "tags": ["grain", "bulk", "maize"], "images": ["maize_thumb.jpg"], "status": "active" },
    { "id": "NOTICE__101", "profile_id": "PROFILE_30", "type": "demand", "title": "Seeking Flour", "description": "Looking for monthly supply of 10 tons of fortified maize flour.", "tags": ["flour", "retail", "monthly"], "images": [], "status": "active" }
  ],
  "interactions": [
    { "id": "INTERACT_1", "notice_id": "NOTICE__100", "from_id": "PROFILE_20", "type": "comment", "content": "Interested. Can you deliver to Nakuru?" },
    { "id": "INTERACT_2", "notice_id": "NOTICE__100", "from_id": "PROFILE_30", "type": "like", "content": "Save for later" }
  ],
  "communications": [
    {
      "id": "COMMUN_1",
      "sender_id": "PROFILE_20",
      "target_id": "PROFILE_10",
      "type": "proposal",
      "message": [
        { "from": "PROFILE_20", "time": "2026-03-01T10:00:00Z", "content": "I would like to offer 50 KES per KG." },
        { "from": "PROFILE_10", "time": "2026-03-01T10:05:00Z", "content": "We can do 52 KES if you handle transport." }
      ],
      "is_read": true,
      "status": "open"
    }
  ],
  "rooms": [
    { "id": "ROOM__500", "title": "Supply Chain A-102", "description": "Negotiation and Logistics for Q1 Flour Pipeline." }
  ],
  "room_members": [
    { "id": "R.MEMBER_1", "room_id": "ROOM__500", "profile_id": "PROFILE_10", "task_role": "Primary Supplier" },
    { "id": "R.MEMBER_2", "room_id": "ROOM__500", "profile_id": "PROFILE_20", "task_role": "Processor" },
    { "id": "R.MEMBER_3", "room_id": "ROOM__500", "profile_id": "PROFILE_30", "task_role": "Retail Buyer" }
  ],
  "engagements": [
    { "id": "ENGAGE_1", "room_id": "ROOM__500", "title": "Maize Supply Mandate #01", "status": "active", "estimated_value": "25000.00", "currency": "USD", "is_frozen": true }
  ],
  "shipments": [
    {
      "id": "SHIP_1",
      "engagement_id": "ENGAGE_1",
      "sender_id": "R.MEMBER_1",
      "receiver_id": "R.MEMBER_2",
      "transporter_info": { "name": "Swift Logistics", "phone": "+254711223344", "adress": { "lat": -1.286, "lng": 36.817 } },
      "package_info": { "name": "Bulk Maize Grade 1", "quantity": 100, "unit": "metric tons", "certified": true },
      "status": "in transit",
      "frozen_at": "2026-03-02T14:30:00Z"
    }
  ],
  "shipment_access": [
    { "shipment_id": "SHIP_1", "key_token": "TOKEN_COLLECT_99", "is_used": true, "expires_at": "2026-03-05T00:00:00Z", "type": "collected" },
    { "shipment_id": "SHIP_1", "key_token": "TOKEN_DELIVER_88", "is_used": false, "expires_at": "2026-03-10T00:00:00Z", "type": "delivered" }
  ],
  "audit_logs": [
    {
      "id": "AUDIT_1",
      "reference_table": "engagement",
      "reference_id": "ENGAGE_1",
      "actor_profile_id": "PROFILE_50",
      "changes": { "reason": "Contract Execution", "before": "Draft", "after": "Active (Frozen)" }
    },
    {
      "id": "AUDIT_2",
      "reference_table": "shipment",
      "reference_id": "SHIP_1",
      "actor_profile_id": "PROFILE_20",
      "changes": { "reason": "Logistics Update", "before": "Pending", "after": "In Transit" }
    }
  ]
}
```
### wireframe
Here are description of screen after screen and reason of my deccisions.
#### splash screen
- logo and name around 500px top marging from the center
- slogan in the center:
  - Nobel mind.direct trade
  - unlocking safe and fair trade era
  - bridging the gap in african trade
- call to action buttons
  - login with google
  - login & register
- bg: africa continent, with a sunsetat the center
#### onboard (registration process)
1. Account creation
  - top with 4 bars only first to change color on complission the section
  - below tabs: create you account
  - in the center a login square card [email,password,confirm password] ! mandatory
  - bg: dots valley with waves
  - bottom right: save & continue
2. profile setup
  - top with 4 bars, second also change color on complission this section
  - below tabs: profile setup
  - center a wide card
    - account identity[name ,logo,bio_slogan,country,sector,size,location]
    - reachability[platform, link]
    - legal terms[registered, intent(buy,sell),registration_number,operational_bounds{local,international}]
    - tags[interest ]
  - bg: dots valley with waves v2
  - bottom right: save & continue
3. document submission
  - top with 4 bars, third also change color on complission this section
  - below tabs: seal of integrity
  - left part (3, 3:1) // for all intent, and required document submition(id/passport; business opperation;intent permission) & issuer,when ,expires
  - right part (1, 3:1) Requirements// for every document to submit, the description of what format and size limitation to submit.
  - bg: dots valley with waves v3
  - bottom right: save & continue
4. confirm submission
  - top with 4 bars, last bar also change color on complission this section // the registration path stuck here until account is activated
  - centered test: application submission complete -> account activated !
  - center a wide card
    - Application sent on top a tick
    - your credentials
  - bg: dots valley with waves v2
  - bottom right: save & continue
#### public feed
1. Notice detail
  - top bar: details(active), other posts issuer profile and name ,communication link; at the right + beneath[cta: message,connect] , location
  - tags: deal active , international , open for seasonal plan
  - title in large font_size bold
  -  images of the products + details[description,price, transporter(provided!!)]
2. Other posts
  - profile, name , connections
  - post cards
    - image name price dealstatus, flags
3. marketPlace feed
  - logo Nobel Source mode switcher[public, chamber]   notification profile
  - filter(tags,sector,country,price range,location,local||international,deal_on||off,likes) search bar // you set the filter and can apply the search as well
  - 2 parts
    - left: post card// company logo, name, supply||demand, heading, advert statement, price, location , deal_status, image, aside comments{normal,comment || proposal},likes
    - right:
      - mini search bar at the top,
      - profile name , sector , connections ,cta connect
4. profile view
   2 sides
  - left:
    - profile image
    - name
    - verified badge
    - sector,location , permission awarded from documents submited
  - post management
    - filters(date[month,year], sector); asc||dec
    - search bard
    - list tab # number ;add a post
    - post card like in the feed + delete button + hide
    - cta[edit]
    - !for the buttons message, like, you see the content in there nothing else.
  - products management
    - list of products{image(s),name}, available tag
    - at top right, add product, delete product.
#### chamber mode
1.  default view
  - always on any selected room in top right conner:
    - Mandate: active
    - version
    - preview
    - request on the mandate(to forward the concesus oriented changes) only if the request is fully compromised the mandate changes, no one person change allowed.
  - always a left bar for rooms, collapsable
    - rooms    create a room//you search in you connections
    - list profile[from the name], nameof groupe ,number of participants
  - proposal:
    - profile, name, title, message
    - cta[approve+create a room,reject,waive"waiting list"] // by default the room take the title of the proposal
  - waived list
    - list proposal waived
2.  in room
  - inspect
    - on_time delivery (date planed, time it arrived), avg communication(how long spent in activity transition, count of requests),on_time payment(day arrived shipment, day receipt is uploaded),how long old the room is
    - supply || demand : amount vs time
    - products imvolded in the room:
      - in a week, % of product are exchanged[like 20% maize supply,10% ,chairs demand]....
  - plan tab
    - callendar + dates with activities on
    - aside the list of activities, for the calendar date in view, in order of date, each activity is {completed,pending,adjusted} , people reposible for that activity
    - adjustment request,approved: the agree and disagrees number, note{reason for every one is action}//it is not messaging, for any change you change the text you had and adjust the agre disagree."unless all agree or disagree" it is canceled.
  - shipment
    - 2 sides
      - activity list where am involved: date title amount, from to, time
      - tracking view// ready,collection,in transit,collected,receipt uploaded.   add a log[collected"generate qr"and after scan and save transporter contacts, time]
  - meeting
    - list of the minutes search: profile who posted the meeting link, name, title, who attended
    - new meeting it remain usaved uless you upload the minute and selecte who attended, cancels itself with in 24 hr without saving.
  - chat
    - way to text and other to text //all saved in a one long json: message who and time.
  - logs
    - not to record everything i will deside what to push as changes happened, like new actitiy created, delivery #23 arrived... this like that.Title of what happened by who when

## UI design
### reason behind
1. **Sovereign Cobalt(#1E3A8A)**
**message**: structural integrity & institutional trust.
<br>why:represent the rail of African trade-solid,unmovingand professional

2. **public exchange**:"The morning sky"
**The message**:Opportunity & transparency.
- palette shiftlightnes(+15%), introduce teal accents
- Optimism.Discovery should feel accessible and open

3. **Collaboration chamber**:"The industrial vault"
**The message**:Authority & Immutable Execution
- palette shift drop lightnes(~ 33%) and compress saturation
- from light paper to industrial slate , tells the brain "serious work is happening now"

4. **Alert logic**:"Industrial amber"
**the message**:value protection
- amber for caution,signify frozen state not an error
### palette preparation
1. global constants
- primary
  - color: hsl(224, 64%, 33%) #1e3a8a
  - use: logo,verified dadge
- success
  - color: hsl(120, 64%, 33%)
  - use: completed delivery, approved proposals
- warning
  - color: hsl(38, 64%, 33%)
  - use: frozen state and cautionary logs
- Danger
  - color: hsl(0, 64%, 33%)
  - rejected documents,terminated contracts
- Text(active)
  - color: hsl(224, 15%, 10%)
  - use:primary headings and contract body text
- Text(muted)
  - color: hsl(224, 15%, 35%)
  - use: secondary info(timestamps,"posted by")
2. Mode-specific mapping
2.1 Public Exchange("the morning sky")
*Focus:accessibility and vibrancy*
- primary Action
  - color: hsl(224, 76%, 49%)
  - use: send proposal,connect cta
- secondary
  - color: hsl(190, 73%, 40%)
  - use: marketplace filters,"supply" listing tags
- neutral-Bg
  - color: hsl(224, 8%, 80%)
  - use: main feed background
2.2 collaboration chamber("the industrial vault")
*Focus:focus and operational weight*
- primary Action
  - color: hsl(224, 64%, 33%)
  - use: execute mandate,confirm shipment
- secondary
  - color: hsl(85, 64%, 33%)
  - use: frozen,border around  the room, active tracking indicators
- neutral-Bg
  - color: hsl(225, 15%, 90%)
  - use: inner room
- ! borders:
  - color : hsl(225, 15%, 10%)
  - use: box in chamber
- ! tint:
  - color : hsl(224, 64%, 40%)
  - use: selected room
- !! shades:
  - color : hsl(224, 64%, 23%)
  - use: pressed button
