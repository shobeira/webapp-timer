# ⏱️ Time Keeper - Web Timer App

**[Live Demo](https://timer.shobeira.com)**

A modern, web-based timer application designed for tracking meeting durations and work sessions. Features a clean, professional dark theme with orange and green accent colours.

## Features

- **Start/Pause/Resume Timer** - Full control over timing with clear state management
- **Time Elapsed Display** - Real-time tracking of elapsed time
- **Time Remaining Display** - Countdown to meeting end
- **Configurable Duration** - Set custom meeting durations (1-480 minutes)
- **Progress Tracking** - Visual progress bar with percentage display
- **Quick Adjustments** - Add 5 minutes to duration on the fly
- **Colour-Coded Warnings** - Visual indicators when time is running low
- **Browser Notifications** - Desktop alerts when meeting time is reached
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- **Persistent Timer** - Maintains accurate timing even when browser tab is inactive

## Colour Palette

- **Primary Orange:** `#FF6F00` - Main action colour (Start/Pause/Resume, Elapsed time)
- **Secondary Green:** `#8EC07C` - Success actions (Add 5 Min button, Progress bar)
- **Accent Grey:** `#5C6370` - Neutral elements
- **Background:** `#282C34` - Dark theme base
- **Reset Red:** `#D32F2F` - Material Design Red for destructive action

## Installation

1. Clone the repository:
```bash
   git clone https://github.com/yourusername/timekeeper.git
   cd timekeeper
```

2. Open `index.html` in your web browser, or serve via a local web server:
```bash
   python3 -m http.server 8000
   # Then navigate to http://localhost:8000
```

## Usage

1. **Set Duration:** Enter desired meeting duration in minutes (default: 50 minutes)
2. **Start Timer:** Click "Start Timer" to begin countdown
3. **Pause/Resume:** Click "Pause Timer" to pause, then "Resume Timer" to continue
4. **Add Time:** Click "Add 5 Min" to extend the meeting duration
5. **Reset:** Click "Reset" to clear the timer and start fresh

## Browser Notification Setup

For desktop notifications when time is up:

1. Click "Start Timer" for the first time
2. Browser will prompt for notification permission
3. Click "Allow" to enable notifications

## Project Structure
```
timekeeper/
├── index.html          # Main HTML structure
├── style.css           # Styling and theme
├── app.js             # Timer logic and functionality
└── README.md          # This file
```

## Technologies

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with gradients, animations, and responsive design
- **JavaScript (ES6+)** - Timer logic, DOM manipulation, and browser notifications
- **Web Notifications API** - Desktop alerts

## Browser Compatibility

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+
- Opera 74+

## Keyboard Shortcuts

- **Enter** (in duration input) - Set new duration

## Development

The timer uses `setInterval` with 100ms updates for smooth display while maintaining accuracy by calculating elapsed time based on `Date.now()` timestamps rather than accumulating intervals.

## License

MIT License - Feel free to use and modify for personal or commercial projects.

## Author

**Shobeir Asayesh**  
[customisedversion.com.au](https://customisedversion.com.au)

## Acknowledgements

- Colour palette inspired by Material Design, Gruvbox, and One Dark themes
- Built for focused work sessions and productive meetings
