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

```

