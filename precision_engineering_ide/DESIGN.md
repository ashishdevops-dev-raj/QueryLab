---
name: Precision Engineering IDE
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#434655'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#006c4a'
  on-secondary: '#ffffff'
  secondary-container: '#82f5c1'
  on-secondary-container: '#00714e'
  tertiary: '#824500'
  on-tertiary: '#ffffff'
  tertiary-container: '#a65900'
  on-tertiary-container: '#ffede1'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#85f8c4'
  secondary-fixed-dim: '#68dba9'
  on-secondary-fixed: '#002114'
  on-secondary-fixed-variant: '#005137'
  tertiary-fixed: '#ffdcc3'
  tertiary-fixed-dim: '#ffb77d'
  on-tertiary-fixed: '#2f1500'
  on-tertiary-fixed-variant: '#6e3900'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 1.75rem
    fontWeight: '600'
    lineHeight: 2.25rem
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 1.25rem
    fontWeight: '600'
    lineHeight: 1.75rem
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: '600'
    lineHeight: 1.5rem
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 0.9375rem
    fontWeight: '400'
    lineHeight: 1.5rem
  body-md:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: 1.375rem
  body-sm:
    fontFamily: Inter
    fontSize: 0.8125rem
    fontWeight: '400'
    lineHeight: 1.25rem
  code-lg:
    fontFamily: JetBrains Mono
    fontSize: 0.9375rem
    fontWeight: '400'
    lineHeight: 1.625rem
  code-md:
    fontFamily: JetBrains Mono
    fontSize: 0.8125rem
    fontWeight: '400'
    lineHeight: 1.375rem
  code-sm:
    fontFamily: JetBrains Mono
    fontSize: 0.75rem
    fontWeight: '400'
    lineHeight: 1.25rem
  label-md:
    fontFamily: Inter
    fontSize: 0.75rem
    fontWeight: '500'
    lineHeight: 1rem
    letterSpacing: 0.02em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 0.6875rem
    fontWeight: '500'
    lineHeight: 0.875rem
    letterSpacing: 0.04em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 0.75rem
  gutter-desktop: 1rem
  margin: 0.5rem
  margin-desktop: 0.75rem
  space-2xs: 0.125rem
  space-xs: 0.25rem
  space-sm: 0.375rem
  space-md: 0.5rem
  space-lg: 0.75rem
  space-xl: 1rem
  space-2xl: 1.5rem
---

## Brand & Style

This design system targets database engineers, backend architects, and data analysts who require a rigorous, high-density development workspace. The brand personality conveys mechanical precision, deterministic performance, and zero cognitive friction. The interface operates as an invisible, utilitarian vessel for complex query authoring, execution profiling, and schema exploration.

The design movement combines **Developer-First Minimalism** with **Tactile Structured Paneling**. Visual ornamentation is stripped in favor of high-contrast information scent, crisp geometric structure, and dense content presentation inspired by modern code editors. Surfaces mimic physical docking stations through subtle 1px divider lines, crisp contrast borders, and purposeful surface layering rather than theatrical shadows or gratuitous animations.

## Colors

The palette establishes an ergonomic, fatigue-reducing environment for continuous development sessions:

- **Canvas & Surfaces**: The base application canvas rests on slate neutral light (`#F8FAFC` to `#F1F5F9`). Active workspace panels, query editors, and inspector panes sit elevated on pure white (`#FFFFFF`) to delineate functional focus zones.
- **Structural Lines**: Subtle separation borders employ `#E2E8F0` for interior division lines and `#CBD5E1` for active window boundaries, splitters, and panel frames.
- **Primary Accent (`#2563EB`)**: Drives primary query execution triggers, interactive focus rings, cursor carets, and active tab indicator strips.
- **Semantic Status**: Emerald (`#059669`) signals successful execution, validated transactions, and live connection health. Crimson (`#DC2626`) handles syntax violations, connection dropouts, and rolled-back queries. Amber (`#D97706`) indicates index warnings, expensive operations, and dirty or uncommitted buffers.
- **Typographic Neutral Hierarchy**: Lead headings and schema labels utilize deep slate (`#0F172A`), primary code/text uses dense body slate (`#334155`), and structural metadata, row counts, and gutter indices use muted slate (`#64748B`).

## Typography

Typography governs system ergonomics:

- **Inter** orchestrates all layout navigation, dialogs, schema trees, and administrative panels, providing clean glyph distinction at sub-pixel rendering limits.
- **JetBrains Mono** governs the SQL code editor canvas, query results data grids, execution plan telemetry, execution timings, and terminal readouts. It provides tabular figures and distinct glyph geometries for `0`, `O`, `l`, `1`, ensuring data values and code strings are unmistakable.
- Compact vertical rhythms are prioritized: line-heights are locked tightly to standard IDE baseline grids, maintaining vertical density without clipping character descenders.

## Layout & Spacing

The workspace implements a **Docked Paneling Multi-Split System** spanning full viewport height and width:

- **Shell Architecture**: The screen uses 100vh locked-viewport containerization divided into a Collapsible Activity Rail (48px fixed), Sidebar Navigation / Schema Tree (variable 240px to 360px), Central Multi-Tab Editor Canvas (flexible 1fr), and Collapsible Results/Profiler Bottom Drawer (split horizontally with draggable resizers).
- **Density Philosophy**: Spacing follows a compact 4px base step (`0.25rem`). Component paddings favor horizontal density over vertical luxury to maximize visible code lines and result set rows per viewport.
- **Responsive Handling**:
  - **Desktop (>=1280px)**: Full multi-pane arrangement (schema explorer, query tabs, split-view query plans, data table).
  - **Tablet/Laptop (768px - 1279px)**: Schema tree transitions to drawer overlay or auto-collapsing sidebar; results grid drops secondary metadata columns behind horizontal scroll.
  - **Mobile (<768px)**: Read-only query execution summary view with stacked full-width editor and swipeable result cards; sidebars convert to modal sheets.

## Elevation & Depth

Visual hierarchy uses a **Tonal Layering & Crisp Stroke Boundary** model rather than deep spatial drop shadows:

- **Layer 0 (Canvas Base - `#F1F5F9`)**: Foundational canvas beneath panels and split gutters.
- **Layer 1 (Docked Surfaces - `#FFFFFF`)**: Active query editor, sidebar trees, data grids. Outlined with a strict 1px solid stroke of `#E2E8F0`.
- **Layer 2 (Floating Overlays & Context Menus - `#FFFFFF`)**: Autocomplete intellisense dropdowns, schema peek popovers, context menus. Styled with a 1px solid border of `#CBD5E1` and an ambient architectural shadow: `0 4px 12px -2px rgba(15, 23, 42, 0.08), 0 2px 4px -1px rgba(15, 23, 42, 0.04)`.
- **Layer 3 (Modal Dialogs & Command Palettes - `#FFFFFF`)**: Global command palette (Cmd+K) and connection settings dialogs centered over a slate backdrop blur (`rgba(15, 23, 42, 0.3)` with `backdrop-filter: blur(2px)`). Depth defined by `0 20px 25px -5px rgba(15, 23, 42, 0.12), 0 8px 10px -6px rgba(15, 23, 42, 0.06)`.
- **Active Focus Depth**: Panel focus is conveyed via an inner border tint or top-border 2px accent strip in `#2563EB` rather than elevation shifting.

## Shapes

The design system uses a strict **Soft (Level 1)** geometric standard (0.25rem / 4px base, max 6px to 8px on parent containers):

- **Micro-Controls (Buttons, Inputs, Badges, Tabs)**: Standardized to 4px to 6px (`rounded-sm` / `rounded-md`). Sharp enough to maintain modular grid alignment while softening sharp visual intersections.
- **Panels & Viewport Cards**: Outer workspace split frames utilize 6px to 8px corner radii when floating, or 0px when fully docked flush against window boundaries.
- **Code Indicators & Toolchips**: 4px radius with strict 1px borders, preserving tabular layout parity.

## Components

### Buttons & Action Bars
- **Primary Button (Execute/Run)**: Background `#2563EB`, text `#FFFFFF`, 6px radius, font Inter semi-bold 13px. Hover: `#1D4ED8`. Active: `#1E40AF`. Integrated keyboard shortcut badge (`Cmd+Enter`) in semi-transparent white container (`rgba(255,255,255,0.2)`).
- **Secondary Button**: Background `#FFFFFF`, border 1px solid `#CBD5E1`, text `#334155`. Hover: `#F8FAFC`, border `#94A3B8`.
- **Ghost/Icon Button**: Transparent background, text `#64748B`, hover background `#F1F5F9`, hover text `#0F172A`. Size 28x28px for editor toolbar utilities.

### Monaco-Style Editor Tabs
- **Tabs**: Contiguous tab bar on `#F8FAFC`. Inactive tabs: `#64748B` text, transparent background, right border 1px solid `#E2E8F0`. Active tab: `#FFFFFF` surface, `#0F172A` text, top accent bar 2px solid `#2563EB`, lateral borders 1px solid `#CBD5E1`.
- **Dirty State**: Small 6px solid amber circle (`#D97706`) replacing the close icon on unsaved buffer states.

### Data Grid (Query Results)
- **Header**: Height 28px, background `#F8FAFC`, text `#64748B`, uppercase 11px font JetBrains Mono with column type indicators (`INT`, `VARCHAR`, `TIMESTAMP`) in muted 10px text.
- **Cells**: JetBrains Mono 12px, text `#334155`, cell border 1px solid `#F1F5F9`. Alternating row stripe (even: `#FFFFFF`, odd: `#F8FAFC` at 40% opacity). Null values rendered in italic `#94A3B8`.
- **Selection**: Active row highlight `#EFF6FF`, focused cell ring 1px solid `#2563EB`.

### Editor Gutter & Syntax Tokens
- **Gutter**: Width 44px, text `#94A3B8` right-aligned, hover highlights active line number in `#0F172A`. Active breakpoint indicator: 8px red dot (`#DC2626`).
- **Syntax Highlighting**:
  - SQL Keywords (`SELECT`, `FROM`, `WHERE`): `#2563EB` bold.
  - Functions & Operators (`COUNT`, `AVG`, `COALESCE`): `#7C3AED`.
  - String Literals: `#059669`.
  - Numeric & Boolean Values: `#D97706`.
  - Comments: `#94A3B8` italic.

### Form Inputs & Autocomplete Intellisense
- **Text Inputs**: Height 30px, background `#FFFFFF`, border 1px solid `#CBD5E1`, padding 4px 8px, font Inter 13px. Focus: border `#2563EB`, box-shadow `0 0 0 1px #2563EB`.
- **Autocomplete Popup**: Background `#FFFFFF`, border 1px solid `#CBD5E1`, rounded 6px, item height 24px, JetBrains Mono 12px. Active item background `#EFF6FF` with text `#2563EB`. Type icon prefix (`tbl`, `col`, `fn`) styled as compact badges.

### Status Indicators & Badges
- **Status Badges**: Padding 2px 6px, radius 4px, font JetBrains Mono 11px. Success: background `#ECFDF5`, text `#059669`. Warning: background `#FFFBEB`, text `#D97706`. Error: background `#FEF2F2`, text `#DC2626`.
- **Connection Pill**: Green ping indicator dot with database host name and latency metric (`12ms`) in `#64748B`.