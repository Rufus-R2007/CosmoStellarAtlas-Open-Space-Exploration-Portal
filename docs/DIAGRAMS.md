# System Design Diagrams & UML Models
## CosmoStellarAtlas — Open Space Exploration Portal
**Author:** Rufus Samuel R  
**Institution:** Karunya Institute of Technology and Sciences  

---

## 1. Use Case Model
```mermaid
flowchart LR
    User["Explorer / Faculty User"]
    
    subgraph CosmoStellarAtlas["CosmoStellarAtlas Platform"]
        UC1["Inspect Observatory Dashboard"]
        UC2["Browse Planetary Telemetry"]
        UC3["Scrub Cosmic Timeline Years"]
        UC4["Search via Command Palette (Ctrl+K)"]
        UC5["View Flight Heritage Missions"]
        UC6["Review Analytical Activity Charts"]
        UC7["Toggle System Preferences & Visual FX"]
        UC8["Inspect Data Provenance & Offline Disclosures"]
    end
    
    User --> UC1
    User --> UC2
    User --> UC3
    User --> UC4
    User --> UC5
    User --> UC6
    User --> UC7
    User --> UC8
```

---

## 2. Component Diagram
```mermaid
graph TD
    subgraph UI_Shell["UI & Layout Shell"]
        AppLayout["AppLayout"]
        Navbar["Navbar HUD"]
        Sidebar["Sidebar Navigation Array"]
        Footer["Footer & Attribution"]
        Starfield["Starfield Canvas"]
        Palette["Command Palette"]
    end

    subgraph Feature_Views["Observatory Views"]
        Hero["HeroSection (Celestial Centerpiece)"]
        Stats["StatsSection (4 Metric Cards)"]
        PlanetFeat["FeaturedPlanetSection"]
        MissionFeat["MissionSpotlightSection"]
        TimelinePrev["TimelinePreviewSection"]
        ChartFeat["MissionActivityChartSection"]
        ModulesGrid["DiscoveryModulesSection"]
    end

    subgraph State_Layer["State Management"]
        AppStore["useAppStore (Zustand)"]
        LocalStorage[("Browser LocalStorage")]
    end

    subgraph Service_Layer["Service Abstraction"]
        ProviderInterface["<<interface>> SpaceDataProvider"]
        MockProvider["MockSpaceDataProvider"]
    end

    subgraph Data_Layer["Local Datasets"]
        PlanetsDB[("planetsData")]
        MissionsDB[("missionsData")]
        RoversDB[("roversData")]
        AsteroidsDB[("asteroidsData")]
        LaunchesDB[("launchesData")]
    end

    AppLayout --> Navbar
    AppLayout --> Sidebar
    AppLayout --> Footer
    AppLayout --> Feature_Views

    Feature_Views --> AppStore
    Feature_Views --> ProviderInterface
    AppStore <--> LocalStorage

    ProviderInterface <|.. MockProvider
    MockProvider --> Data_Layer
```

---

## 3. Activity Diagram: Dashboard Initialization & Year Scrubbing
```mermaid
flowchart TD
    Start(["User Opens CosmoStellarAtlas"]) --> InitApp["Initialize App Shell & HashRouter"]
    InitApp --> LoadPreferences["Load FX & Units from LocalStorage"]
    LoadPreferences --> MountObservatory["Mount Observatory Dashboard View"]
    MountObservatory --> TriggerService["Call spaceService.getObservatoryStats() + getPlanets() + getMissions()"]
    TriggerService --> CheckError{"Simulated Error Active?"}
    
    CheckError -- Yes --> RenderError["Display Safe ErrorState UI with Retry Button"]
    RenderError --> AwaitRetry["User clicks 'Re-establish Uplink'"] --> TriggerService
    
    CheckError -- No --> ComputeMetrics["Compute Stats & Filter Apollo 11 Spotlight"]
    ComputeMetrics --> RenderDashboard["Render Hero, Stats, Planet, Timeline, and Chart"]
    
    RenderDashboard --> UserAction{"User Selects Timeline Year"}
    UserAction -- Year 1977 Selected --> UpdateStore["useAppStore.setSelectedYear(1977)"]
    UpdateStore --> FilterMissions["Filter Missions Launched in 1977 (Voyager 1 & 2)"]
    FilterMissions --> UpdateTimelineUI["Highlight 1977 Node & Display Voyager Details"]
```

---

## 4. Sequence Diagram: Data Fetching & Local Provider Flow
```mermaid
sequenceDiagram
    autonumber
    actor User as User / Browser
    participant View as ObservatoryPage
    participant Store as useAppStore
    participant Service as MockSpaceDataProvider
    participant Data as Local In-Memory Datasets

    User->>View: Navigate to '/'
    View->>Service: getObservatoryStats()
    View->>Service: getPlanets()
    View->>Service: getMissions()
    View->>Service: getBriefings()
    
    Service->>Service: simulateNetwork(delayMs)
    Service->>Data: Query planetsData & missionsData
    Data-->>Service: Return typed arrays
    Service->>Service: Compute aggregates (totalPlanets, sols, NEO counts)
    Service-->>View: Resolve [stats, planets, missions, briefings]
    View->>User: Render Polished Dashboard Interface
    
    User->>View: Click Year '1969' Node
    View->>Store: setSelectedYear(1969)
    Store-->>View: State updated (selectedYear: 1969)
    View->>View: Filter missions where launchYear == 1969
    View->>User: Display Apollo 11 Expedition Card
```

---

## 5. Entity Relationship Diagram (ERD)
```mermaid
erDiagram
    PLANET ||--o{ MISSION : "associated with"
    MISSION ||--|{ MISSION_MILESTONE : "contains"
    ROVER ||--|{ ROVER_IMAGE : "captures"
    PLANET {
        string id PK
        string name
        string codeName
        int orderFromSun
        string type
        float diameterKm
        float distanceFromSunAU
        float surfaceTempMeanC
        float gravityEarthRel
        int moonsCount
        string source
    }
    MISSION {
        string id PK
        string name
        string agency
        int launchYear
        string launchDate
        string status
        string destinationPlanetId FK
        string destinationName
        string missionType
        string description
        string source
    }
    MISSION_MILESTONE {
        string id PK
        string missionId FK
        int year
        string date
        string title
        string description
        string significance
    }
    ROVER {
        string id PK
        string name
        string agency
        string landingDate
        string landingSite
        string status
        int totalSols
        float distanceTraveledKm
        int sampleCount
        string source
    }
    ROVER_IMAGE {
        string id PK
        int sol
        string cameraName
        string cameraFullName
        string earthDate
        string caption
    }
    ASTEROID {
        string id PK
        string name
        string designation
        float estimatedDiameterMeters
        boolean isPotentiallyHazardous
        string closeApproachDate
        float missDistanceKm
        float relativeVelocityKmS
        string orbitClass
        float simulatedRiskIndex
        string source
    }

---

## 6. Use Case Model: Phase 2 Planet Explorer & Comparison Lab
```mermaid
flowchart LR
    User["Explorer / Astronomer"]

    subgraph PlanetExplorer["Planet Explorer Module (/planets)"]
        UC_View3D["Inspect 3D Planetary World (WebGL)"]
        UC_2DFallback["Switch to Accessible 2D Canvas Fallback"]
        UC_Controls["Manipulate Drag Rotation & Zoom Controls"]
        UC_NavMode["Toggle Explore vs Solar Schematic Mode"]
        UC_Weight["Calculate Interactive Relative Earth Weight"]
        UC_Compare["Compare Two Worlds Side-by-Side"]
        UC_Insights["Generate Deterministic Comparative Insights"]
        UC_Scale["Analyze Solar System Logarithmic Scales"]
        UC_Missions["Review Historical Planetary Missions"]
        UC_Epoch["Filter Missions via Cosmic Time Machine Epoch"]
        UC_Passport["Traverse via Discovery Passport Highlight"]
    end

    User --> UC_View3D
    User --> UC_2DFallback
    User --> UC_Controls
    User --> UC_NavMode
    User --> UC_Weight
    User --> UC_Compare
    User --> UC_Insights
    User --> UC_Scale
    User --> UC_Missions
    User --> UC_Epoch
    User --> UC_Passport
```

---

## 7. Sequence Diagram: Planet Selection & Rendering Pipeline
```mermaid
sequenceDiagram
    autonumber
    actor User as User / Explorer
    participant Nav as SolarSystemNavigator
    participant Page as PlanetsPage
    participant Three as PlanetCanvas3D
    participant TexGen as PlanetTextureGenerator
    participant Info as PlanetInfoCenter
    participant Comp as PlanetaryComparisonLab
    participant Insights as PlanetaryInsightsEngine

    User->>Nav: Click "Mars"
    Nav->>Page: handleSelectPlanet("mars")
    Page->>Page: setSearchParams({ id: "mars" })
    
    par Render 3D World
        Page->>Three: Update planet prop (mars)
        Three->>TexGen: generatePlanetTexture(mars, quality)
        TexGen-->>Three: Return HTMLCanvasElement texture
        Three->>Three: THREE.CanvasTexture & apply axialTilt (25.19°)
        Three->>User: Animate 3D Mars with surface features
    and Update Telemetry
        Page->>Info: Render physical stats & landmarks
        Info->>User: Display Mars ephemeris & weight calculator
    and Sync Comparison
        Page->>Comp: Set initialPlanetA = "mars"
        Comp->>Insights: generateComparisonInsights(mars, planetB)
        Insights-->>Comp: Return deterministic comparative findings
        Comp->>User: Render side-by-side scale circles & insights
    end
```

---

## 8. Activity Diagram: Planetary Comparison & Insights Synthesis
```mermaid
flowchart TD
    Start(["User Opens Planetary Comparison Lab"]) --> SelectA["Select Target Planet A"]
    SelectA --> SelectB["Select Target Planet B"]
    SelectB --> CheckSame{"Are Planet A and Planet B identical?"}
    
    CheckSame -- Yes --> ShowNotice["Display 'Identical Celestial Target Selected' Banner"]
    ShowNotice --> GuideUser["Prompt User to Select Distinct Comparison World"]
    
    CheckSame -- No --> MathEngine["Execute computePlanetComparison(A, B)"]
    MathEngine --> CalcRatios["Calculate Diameter, Mass, Gravity, and Orbit Ratios"]
    CalcRatios --> InsightEngine["Execute PlanetaryInsightsEngine.generateComparisonInsights(A, B)"]
    
    InsightEngine --> EvalDim["Evaluate Dimensional Delta (Diameter / Volume)"]
    InsightEngine --> EvalGrav["Evaluate Surface Gravity & Escape Delta"]
    InsightEngine --> EvalOrb["Evaluate Solar Orbit & Heliocentric Distance"]
    InsightEngine --> EvalAtm["Evaluate Atmospheric Barometric & Compositional Disparity"]
    
    EvalDim & EvalGrav & EvalOrb & EvalAtm --> Synthesize["Collate Structured Insight Findings"]
    Synthesize --> RenderView["Render Side-by-Side Scale Circles, Metric Bars, and Insight Cards"]
```

---


## 9. Use Case Model: Phase 3 Cosmic Time Machine & Mission Control
```mermaid
flowchart LR
    User["Explorer / Flight Historian"]

    subgraph TimeMachine["Cosmic Time Machine (/timeline)"]
        UC_Scrub["Scrub Continuous Historical Timeline (1957–Present)"]
        UC_Decade["Jump Between Epoch Decades (1950s–2020s)"]
        UC_PlayAdvance["Auto-Advance Timeline Playback"]
        UC_EpochReview["Inspect Contemporaneous Spaceflight Telemetry"]
        UC_Capsules["Explore Curated Cosmic Time Capsules"]
    end

    subgraph MissionControl["Mission Control Archive (/missions)"]
        UC_Search["Search Missions by Name, Agency, or Goal"]
        UC_Filters["Filter by Agency, Destination, Type, or Decade"]
        UC_EpochSync["Toggle Synchronized Temporal Epoch Filter"]
        UC_Sort["Sort by Date, Duration, or Alphabetical"]
        UC_Analytics["Analyze Historical Distribution Charts"]
        UC_Insights["Inspect Deterministic Historical Insights"]
    end

    subgraph MissionDossier["Mission Dossier & Replay (/missions/:id)"]
        UC_Specs["Examine Spacecraft Hardware & Payload Specs"]
        UC_Story["Read 5-Chapter Mission Narrative"]
        UC_Milestones["Review Chronological Milestones Timeline"]
        UC_Replay["Execute Interactive Canvas Mission Replay"]
        UC_Speed["Adjust Replay Speed (0.5x, 1x, 2x)"]
    end

    User --> UC_Scrub
    User --> UC_Decade
    User --> UC_PlayAdvance
    User --> UC_EpochReview
    User --> UC_Capsules

    User --> UC_Search
    User --> UC_Filters
    User --> UC_EpochSync
    User --> UC_Sort
    User --> UC_Analytics
    User --> UC_Insights

    User --> UC_Specs
    User --> UC_Story
    User --> UC_Milestones
    User --> UC_Replay
    User --> UC_Speed
```

---

## 10. Activity Diagram: Cosmic Time Machine Scrubbing & Cross-Module Filtering
```mermaid
flowchart TD
    Start(["User Opens Cosmic Time Machine"]) --> LoadState["Read selectedYear from useAppStore"]
    LoadState --> RenderScrubber["Render TimelineScrubber with Landmark Markers"]
    RenderScrubber --> RenderOverview["Render EpochOverviewPanel for selectedYear"]
    RenderOverview --> RenderCapsules["Render TimeCapsuleCarousel Highlights"]

    RenderScrubber --> UserInput{"User Action"}
    UserInput -- "Drag Scrubber Slider" --> UpdateLocalYear["Update Scrubber Value"]
    UserInput -- "Click Decade Jump Pill" --> SetDecadeYear["Set selectedYear to Decade Base (e.g. 1970)"]
    UserInput -- "Click Milestone Step" --> StepMilestoneYear["Set selectedYear to Target Milestone Year"]
    UserInput -- "Toggle Play / Pause" --> AutoLoop["Increment Year on 1200ms Interval"]

    UpdateLocalYear --> SyncStore["Call useAppStore.setSelectedYear(year)"]
    SetDecadeYear --> SyncStore
    StepMilestoneYear --> SyncStore
    AutoLoop --> SyncStore

    SyncStore --> RefreshOverview["EpochOverviewPanel Recalculates Operating Missions & Milestones"]
    RefreshOverview --> CrossModuleNav{"User Clicks 'Open in Mission Control'"}
    CrossModuleNav -- Yes --> NavMissions["Navigate to /missions with Epoch Filter Active"]
    NavMissions --> FilterMissions["Missions Grid Constrained to Selected Historical Epoch"]
```

---

## 11. State Machine Diagram: Mission Replay Engine Lifecycle
```mermaid
stateDiagram-v2
    [*] --> Idle: Mount MissionReplayEngine

    state Idle {
        [*] --> Milestone0: Set milestone index = 0
        Milestone0 --> ReadyForPlayback: Parse tactical scene parameters
    }

    Idle --> Playing: User clicks Play
    Playing --> Paused: User clicks Pause
    Paused --> Playing: User clicks Resume

    state Playing {
        [*] --> RenderTacticalScene: Draw scene on 2D Canvas
        RenderTacticalScene --> AnimateTrajectory: Advance particles & telemetry
        AnimateTrajectory --> CheckInterval: Milestone duration elapsed?
        CheckInterval --> StepNext: Yes - Increment milestone index
        StepNext --> RenderTacticalScene: Has next milestone
        StepNext --> Finished: Reached final milestone
    }

    Playing --> Playing: User changes Speed (0.5x, 1x, 2x)
    Playing --> MilestoneSelected: User drags scrubber or clicks milestone tick
    Paused --> MilestoneSelected: User drags scrubber or clicks milestone tick

    state MilestoneSelected {
        [*] --> UpdateIndex: Set milestone index
        UpdateIndex --> RenderNewScene: Re-render tactical canvas
    }

    MilestoneSelected --> Paused: If was paused
    MilestoneSelected --> Playing: If was playing

    Finished --> Paused: Mark playback finished
    Paused --> Idle: User clicks Restart (Replay from 0)
    Playing --> Idle: User clicks Restart (Replay from 0)

    Idle --> [*]: Unmount / Close Modal
    Paused --> [*]: Unmount / Close Modal
```

---

## 12. Sequence Diagram: Mission Archive Navigation & Replay Launch
```mermaid
sequenceDiagram
    autonumber
    actor User as User / Flight Director
    participant MPage as MissionsPage
    participant MStore as useAppStore
    participant MCard as MissionCard
    participant DPage as MissionDetailPage
    participant Story as MissionStoryteller
    participant Replay as MissionReplayEngine

    User->>MPage: Open /missions
    MPage->>MStore: Read selectedYear & filters
    MPage->>MPage: Filter 20 missions across criteria
    MPage->>User: Display Filtered Mission Dossier Cards

    alt Launch Replay Direct from Card
        User->>MCard: Click "Launch Replay"
        MCard->>MPage: onSelectForReplay(mission)
        MPage->>Replay: Open Replay Modal(mission)
        Replay->>User: Play Animated Tactical Milestones
    else Navigate to Detail Dossier
        User->>MCard: Click "Mission Dossier"
        MPage->>DPage: Navigate to /missions/:missionId
        DPage->>DPage: Resolve mission by ID from MockSpaceDataProvider
        DPage->>Story: Render 5-Chapter Narrative Sections
        DPage->>User: Display Full Technical Identity & Milestones
        User->>DPage: Click "Replay Flight Trajectory"
        DPage->>Replay: Mount MissionReplayEngine(mission)
        Replay->>User: Interactive Tactical Canvas Simulation
    end
```

---

## 13. Component Diagram: Mission Control & Time Machine Subsystems
```mermaid
graph TD
    subgraph Routes["Application Routes"]
        R_Timeline["/timeline (TimelinePage)"]
        R_Missions["/missions (MissionsPage)"]
        R_Detail["/missions/:missionId (MissionDetailPage)"]
    end

    subgraph TimeMachine_Components["Time Machine Subsystem"]
        Scrubber["TimelineScrubber"]
        EpochPanel["EpochOverviewPanel"]
        CapsulesCarousel["TimeCapsuleCarousel"]
        CapsuleCard["TimeCapsuleCard"]
    end

    subgraph MissionControl_Components["Mission Control Subsystem"]
        MStats["Archive Summary Header"]
        MFilters["MissionFilters"]
        MAnalytics["MissionAnalyticsSection (Recharts)"]
        InsightsEngine["HistoricalInsightsEngine"]
        MGrid["MissionCard Array"]
    end

    subgraph Dossier_Components["Dossier & Replay Subsystem"]
        DossierHeader["Identity & Flight Heritage Header"]
        SpecsPanel["Spacecraft Technical Specs"]
        Storyteller["MissionStoryteller (5 Chapters)"]
        MilestonesList["Chronological Milestones Timeline"]
        ReplayEngine["MissionReplayEngine (Canvas)"]
    end

    subgraph Store_Service["Global Store & Services"]
        AppStore["useAppStore (Zustand)"]
        Provider["SpaceDataProvider (MockSpaceDataProvider)"]
        Datasets["missionsData & timeCapsulesData"]
    end

    R_Timeline --> Scrubber
    R_Timeline --> EpochPanel
    R_Timeline --> CapsulesCarousel
    CapsulesCarousel --> CapsuleCard

    R_Missions --> MStats
    R_Missions --> MFilters
    R_Missions --> MAnalytics
    MAnalytics --> InsightsEngine
    R_Missions --> MGrid
    R_Missions --> ReplayEngine

    R_Detail --> DossierHeader
    R_Detail --> SpecsPanel
    R_Detail --> Storyteller
    R_Detail --> MilestonesList
    R_Detail --> ReplayEngine

    Scrubber <--> AppStore
    EpochPanel --> Provider
    CapsulesCarousel --> Datasets
    MFilters <--> AppStore
    MGrid --> Provider
    DPage --> Provider
    Provider --> Datasets
```

---

## 14. Enriched Entity Relationship Diagram (ERD): Phase 3 Data Model
```mermaid
erDiagram
    PLANET ||--o{ MISSION : "associated with"
    MISSION ||--|{ MISSION_MILESTONE : "chronological sequence"
    MISSION ||--o| SPACECRAFT_DETAILS : "hardware specs"
    MISSION ||--o| MISSION_STORYLINE : "5-chapter narrative"
    TIME_CAPSULE }o--|| MISSION : "optional link to"

    MISSION {
        string id PK
        string name
        string agency
        int launchYear
        string launchDate
        string status
        string destinationPlanetId FK
        string destinationName
        string missionType
        string description
        string outcome
        string primaryObjective
        string source
    }

    MISSION_MILESTONE {
        string id PK
        string missionId FK
        int year
        string date
        string title
        string description
        string significance
        string replaySceneType
        string eventType
        int chronologicalOrder
        string sourceReference
    }

    SPACECRAFT_DETAILS {
        string dryMassKg
        string launchMassKg
        string powerSource
        string instrumentsList
        string trajectoryType
    }

    MISSION_STORYLINE {
        string theChallenge
        string theMission
        string theJourney
        string theDiscovery
        string theLegacy
    }

    TIME_CAPSULE {
        string id PK
        int year
        string title
        string category
        string description
        string significance
        string relatedMissionId FK
        string sourceReference
    }
```
