# Parent Dashboard Navigation - Visual Mockups

## Desktop Layout (1280px+)

### Full Width View

```
┌────────────────────────────────────────────────────────────────────────┐
│ STEMWORKFORCE                                              [👤 Smith ▼] │
├────────────────────────────────────────────────────────────────────────┤
│ ROW 1: Primary Navigation                                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Overview  │  Messages 3●  │  Calendar 5●  │  Progress  │  Resources  │
│                                                           │  Settings   │
│                                                                          │
├────────────────────────────────────────────────────────────────────────┤
│ ROW 2: Secondary Navigation                                            │
├─────────────────────────────────────────────────────────────────────────┤
│ ✨ AI Insights  📡 Live Feed  🎉 Celebrations  💼 Portfolio             │
│                                                                          │
│ 📝 Academic Progress  ❤️ Health Records  🎓 Conferences ●  💳 Payments ●│
│                                                                          │
├────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│                      DASHBOARD CONTENT AREA                            │
│                         Main Page Content                              │
│                                                                          │
└────────────────────────────────────────────────────────────────────────┘
```

### Row 1 Detail (Active Item)

```
┌─────────────────────────────────────────────────────────────────┐
│ Overview │ Messages 3● │ Calendar 5● │ Progress │ Resources │ S │
│          │             │             │          │           │ e │
│          │             │             │          │           │ t │
└─────────────────────────────────────────────────────────────────┘

         Each item is:
         - 44px minimum height (touch-friendly)
         - ~150-200px width (roughly equal)
         - Has left/right border (visual separator)
         - Hover: bg-gray-100 transition

         Active item (Calendar):
         - Bottom border-bottom-4 border-yellow-400
         - bg-yellow-50
```

### Badges in Detail

#### Row 1 Numeric Badge
```
┌──────────────────────────────┐
│ Messages                  3● │
│          ▲──────────────────┘│
│          └─ min-width: 20px   │
│             height: 20px      │
│             padding: 0 6px    │
│             bg-red-500        │
│             text-white        │
│             font-size: 11px   │
│             font-weight: 700  │
└──────────────────────────────┘
```

#### Row 2 Dot Indicator
```
┌───────────────────────────────────┐
│ Conferences ●                     │
│            ▲───────────────────┐  │
│            └─ width: 8px       │  │
│               height: 8px       │  │
│               bg-orange-500     │  │
│               border-radius: 50%  │
└───────────────────────────────────┘
```

---

## Tablet Layout (768px - 1023px)

### Wrapped Navigation

```
┌────────────────────────────────────────────┐
│ STEMWORKFORCE                  [👤 Smith ▼]│
├────────────────────────────────────────────┤
│ ROW 1 (Wraps to 2 lines)                   │
├────────────────────────────────────────────┤
│ Overview │ Messages 3● │ Calendar 5● │ Prog│
│ Resources │ Settings                        │
├────────────────────────────────────────────┤
│ ROW 2 (Horizontal scroll)                  │
├────────────────────────────────────────────┤
│ ✨ AI Insights  📡 Live Feed  🎉 Celebrate│
│ 💼 Portfolio  📝 Acad. Progress  ❤️ Health│
│ 🎓 Conferences ●  💳 Payments ●            │
└────────────────────────────────────────────┘

Note: Row 2 items may scroll horizontally
      to prevent column stacking
```

---

## Mobile Layout (<768px)

### Standard Mobile View

```
┌────────────────────────────┐
│ SW STEMWORKFORCE      ☰  [👤]│
├────────────────────────────┤
│ ROW 1: Always Visible      │
├────────────────────────────┤
│ Overview │ Messages 3● │   │
│ Calendar 5●             │
├────────────────────────────┤
│ ROW 2: Collapsible         │
├────────────────────────────┤
│ More Features      [▼]     │
├────────────────────────────┤
│                            │
│   MAIN CONTENT AREA        │
│                            │
└────────────────────────────┘
```

### Mobile - Row 2 Expanded

```
┌────────────────────────────┐
│ More Features      [▲]     │ ← Expanded state
├────────────────────────────┤
│                            │
│ Learning & Development     │
│  ✨ AI Insights            │
│  📡 Live Feed              │
│  🎉 Celebrations           │
│  💼 Portfolio              │
│                            │
│ Administrative             │
│  📝 Academic Progress      │
│  ❤️ Health Records         │
│  🎓 Conferences ●          │
│  💳 Payments ●             │
│                            │
├────────────────────────────┤
│   MAIN CONTENT AREA        │
│                            │
└────────────────────────────┘
```

---

## Color & Typography Reference

### Primary Navigation (Row 1)

```
┌─────────────────────────────────┐
│ Normal State:                   │
│ • Background: white (#FFFFFF)   │
│ • Text color: #1F2937 (gray-900)│
│ • Font: 16px, semibold (600)    │
│ • Padding: 12px 16px            │
│ • Border-right: 1px #E5E7EB     │
│                                 │
│ Hover State:                    │
│ • Background: #F9FAFB (gray-100)│
│ • Text color: #1F2937           │
│ • Transition: 200ms ease        │
│                                 │
│ Active State:                   │
│ • Background: #FFFBEB (yellow-50)│
│ • Border-bottom: 4px #FBBF24    │
│ • Text color: #1F2937           │
│                                 │
│ Focus State:                    │
│ • Outline: 2px solid #3B82F6    │
│ • Outline-offset: 2px           │
└─────────────────────────────────┘
```

### Secondary Navigation (Row 2)

```
┌─────────────────────────────────┐
│ Normal State:                   │
│ • Background: #F9FAFB (gray-50) │
│ • Text color: #4B5563 (gray-700)│
│ • Font: 14px, medium (500)      │
│ • Padding: 10px 12px            │
│ • Border-top: 1px #E5E7EB       │
│                                 │
│ Hover State:                    │
│ • Background: #F3F4F6 (gray-100)│
│ • Text color: #4B5563           │
│ • Transition: 200ms ease        │
│                                 │
│ Active State:                   │
│ • Background: #F3F4F6           │
│ • Text color: #4B5563           │
│ • No special indicator          │
│                                 │
│ Focus State:                    │
│ • Outline: 2px solid #3B82F6    │
│ • Outline-offset: 2px           │
└─────────────────────────────────┘
```

---

## Badge Styling Reference

### Primary Nav Badge (Red - Attention)

```
┌──────────────────────────────────┐
│ Background: #EF4444 (red-500)    │
│ Text: white (#FFFFFF)            │
│ Min-width: 20px                  │
│ Height: 20px                     │
│ Border-radius: 9999px (pill)     │
│ Font-size: 11px                  │
│ Font-weight: 700 (bold)          │
│ Padding: 0 6px                   │
│                                  │
│ Contrast: 4.48:1 (WCAG AAA)     │
│                                  │
│ Example: Messages 3●             │
│          ┌──┐                    │
│          │3●│                    │
│          └──┘                    │
└──────────────────────────────────┘
```

### Secondary Nav Badge (Dot - Orange)

```
┌──────────────────────────────────┐
│ Background: #F97316 (orange-500) │
│ Width: 8px                       │
│ Height: 8px                      │
│ Border-radius: 50% (circle)      │
│ Margin-left: 4px                 │
│                                  │
│ Contrast: 5.7:1 (WCAG AAA)      │
│                                  │
│ Example: Conferences ●           │
│          ─────────────●          │
│          (subtle indicator)      │
└──────────────────────────────────┘
```

---

## Responsive Breakpoints

### Breakpoint 1: Tablet (1024px)

```
Display: grid-cols-6 for Row 1
Items wrap to 2 lines:
  Line 1: Overview | Messages | Calendar | Progress
  Line 2: Resources | Settings

Row 2 remains single line with horizontal scroll
```

### Breakpoint 2: Small Tablet (768px)

```
Display: flex wrap for Row 1
Items: 3 visible (Overview, Messages, Calendar)
         + "More" button for rest

Row 2: Hidden by default
       Expandable via "More" button
```

### Breakpoint 3: Mobile (480px)

```
Display: flex wrap
Items: Smaller touch targets (40px min instead of 44px)
       Text size: 12px

Navigation becomes more compact but remains usable
```

---

## Interaction States

### Keyboard Navigation Flow

```
1. User presses [Tab]
   ↓
2. Focus enters nav (Overview gets focus)
   ▭─────────────────────────────────▭
   │ Overview (FOCUSED)              │
   │ ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓ │
   │ ┃ Outline: 2px blue            ┃ │
   │ ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ │
   ▰─────────────────────────────────▰

3. User presses [Tab] again
   ↓
4. Focus moves to Messages
   │ Messages 3● (FOCUSED)           │
   │ ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓ │
   │ ┃ Outline: 2px blue            ┃ │
   │ ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ │

5. User presses [Enter] or [Space]
   ↓
6. Navigate to /parent/messages
```

### Mobile Expand/Collapse

```
Initial State:
┌──────────────────────────┐
│ More Features    [▼]     │ ← Button
└──────────────────────────┘

After Click:
┌──────────────────────────┐
│ More Features    [▲]     │ ← Rotated chevron
├──────────────────────────┤
│ ✨ AI Insights           │ ← Slide-down animation
│ 📡 Live Feed             │    (max-height: 0 → 500px)
│ 🎉 Celebrations          │
│ 💼 Portfolio             │
│                          │
│ 📝 Academic Progress     │
│ ❤️ Health Records        │
│ 🎓 Conferences ●         │
│ 💳 Payments ●            │
└──────────────────────────┘
```

---

## Accessibility Indicators

### Focus Indicator

```
┌─────────────────────────────────┐
│ Standard Focus Style:           │
│                                 │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│ ┃ [Messages 3●]              ┃  │
│ ┃ Outline: 2px solid #3B82F6 ┃  │
│ ┃ Outline-offset: 2px         ┃  │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                 │
│ Contrast: 3:1 (blue on white)  │
│ WCAG AA: PASS ✓                │
└─────────────────────────────────┘
```

### Screen Reader Announcements

```
User navigates to Messages using keyboard:
  ↓
Screen Reader announces:
  "Messages, link, 3 unread, navigation, main"

  Breakdown:
  - "Messages" = item label
  - "link" = element type
  - "3 unread" = badge aria-label
  - "navigation" = nav role
  - "main" = page region

(All in one announcement, not split across pauses)
```

---

## Component States Library

### NavItem - All States

```
┌──────────────────────────────────────────────┐
│ 1. Default State                             │
│    Overview                                  │
│    • bg-white                                │
│    • text-gray-900                           │
│    • border-right: 1px gray-200              │
│                                              │
│ 2. Hover State                               │
│    Overview                                  │
│    • bg-gray-100 (slight highlight)          │
│    • text-gray-900                           │
│    • cursor: pointer                         │
│                                              │
│ 3. Active State (Current Page)               │
│    Calendar                                  │
│    • bg-yellow-50 (subtle highlight)         │
│    • text-gray-900                           │
│    • border-bottom: 4px yellow-400           │
│    • aria-current="page"                     │
│                                              │
│ 4. Focus State (Keyboard)                    │
│    Messages 3●                               │
│    • outline: 2px solid blue-500             │
│    • outline-offset: 2px                     │
│    • (combined with above states as needed)  │
│                                              │
│ 5. Disabled State (Rare)                     │
│    Progress                                  │
│    • opacity: 0.5                            │
│    • cursor: not-allowed                     │
│    • aria-disabled="true"                    │
└──────────────────────────────────────────────┘
```

---

## Badge Animation

### Appear Animation (New Badge)

```
0% Opacity:     Scale: 0.8
    · · ·

50% Opacity:    Scale: 1.1
    ◌ ◌ ◌

100% Opacity:   Scale: 1.0
    ● ● ●

Duration: 200ms ease-out
Trigger: Component mount or badge value changes
```

### Badge Update Animation

```
Current:        New Badge:
Messages 3●  →  Messages 4●

Old badge fades out + scales down
New badge fades in + scales up
Cross-fade effect
Duration: 150ms
```

---

## Mobile Touch Targets

### 44px Minimum Touch Target (WCAG AAA)

```
┌────────────────────────────────┐
│                                │
│        44px minimum            │
│        (both width & height)   │
│                                │
│     ┌──────────────────┐      │
│     │   Touch Target   │      │
│     │   (Button/Link)  │      │
│     └──────────────────┘      │
│                                │
│        Distance between:       │
│        • 8px gap minimum       │
│        • Prevents mis-taps     │
│                                │
└────────────────────────────────┘
```

---

## Zoom & High Contrast Modes

### At 200% Zoom Level

```
Normal:                 200% Zoom:
┌──────────────┐       ┌──────────────┐
│ Overview │ │        │ Overview │   │
│ Messages │ │        │ Messages   │  │
│ Calendar │ │        │ Calendar   │  │
└──────────┘         │ Progress   │  │
                      │ Resources  │  │
                      │ Settings   │  │
                      └──────────────┘

Items wrap to single column
But remain fully usable
No horizontal scrolling needed
```

### Windows High Contrast Mode

```
Background: Black
Foreground: White
Focus: Yellow outline

┌─────────────────────────────────┐
│ Overview │ Messages ● │         │ ← White text
│                                  │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │ ← Yellow outline
│ ┃ Calendar 5●                 ┃  │    (4px for high contrast)
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                  │
│ ✨ AI Insights                   │ ← White text
│ 📡 Live Feed                     │
└─────────────────────────────────┘
```

---

## Icon Guidelines

### Recommended Icons (Unicode Emoji)

| Item | Icon | Alternative |
|------|------|-------------|
| Overview | 📊 | 🏠 |
| Messages | 💬 | ✉️ |
| Calendar | 📅 | 🗓️ |
| Progress | 📈 | 📊 |
| Resources | 📚 | 📖 |
| Settings | ⚙️ | 🔧 |
| AI Insights | ✨ | 🤖 |
| Live Feed | 📡 | 🔄 |
| Celebrations | 🎉 | 🏆 |
| Portfolio | 💼 | 📂 |
| Academic Progress | 📝 | 📋 |
| Health Records | ❤️ | 🏥 |
| Conferences | 🎓 | 📞 |
| Payments | 💳 | 💰 |

### Icon Sizing

```
Row 1 (Primary):
• Icon size: 20px
• Margin-right: 8px
• Color: inherit (gray-900)

Row 2 (Secondary):
• Icon size: 16px
• Margin-right: 6px
• Color: inherit (gray-700)
```

---

## Animation Specifications

### Standard Navigation Transitions

```
Property: background-color, color
Duration: 200ms
Timing: ease
Delay: 0ms

Example:
background-color: white → gray-100 (on hover)
Smooth transition over 200ms
```

### Mobile Expand/Collapse

```
Property: max-height, opacity
Duration: 300ms
Timing: ease-in-out
Direction: vertical slide-down

Closed:  max-height: 0, opacity: 0
Opening: max-height: 500px, opacity: 1
Delay: 50ms (stagger items)
```

### Badge Appearance

```
Property: opacity, scale
Duration: 150ms
Timing: ease-out

From: opacity 0, scale 0.8
To:   opacity 1, scale 1.0
```

---

## Print Styles (if applicable)

```css
@media print {
  nav.parent-navigation {
    display: none; /* Hide navigation when printing */
  }
}
```

---

## Dark Mode Support (Optional)

```
If implementing dark mode:

Row 1:
• Background: #1F2937 (gray-900)
• Text: #F9FAFB (white)
• Border: #374151 (gray-700)
• Hover: #374151 (darker gray)

Row 2:
• Background: #111827 (gray-950)
• Text: #E5E7EB (gray-200)
• Border: #374151 (gray-700)
• Hover: #374151 (darker gray)

Badge (same in both modes):
• Background: #EF4444 (red-500)
• Text: white
```

