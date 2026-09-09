# The Aviary

The Aviary is a small, browser-based field guide and care game for parrot lovers. Learn about different species, explore practical care basics, and look after four virtual birds before their needs get too low.

## 🏛️ System Architecture & Principles
- to be inserted

## 🌐 Infrastructure & Deployment
- to be inserted
## 📊 Observability & Monitoring
- to be inserted
### Core Design Standards
- to be inserted

## Features

- Responsive single-page layout for desktop and mobile screens
- Interactive field guide with six parrot species
- Flip cards with size, lifespan, noise, talking ability, and temperament details
- Expandable care guide covering diet, enrichment, social time, and health signs
- Rotating fun-facts carousel
- Aviary simulation with four virtual birds
- Feed, water, spend time with, and forage for each bird
- Live stat decay, care feedback, molting events, screaming warnings, activity log, and toast notifications
- Keyboard-accessible navigation, cards, accordions, and game controls

## Project Structure

```text
project/
|-- index.html   Page structure and content sections
|-- style.css    Layout, responsive styles, colors, and animations
|-- script.js    Field guide, accordion, carousel, and game logic
|-- README.md    Project documentation
```


### Environment Setup
Create a `.env` file in the root directory (do **NOT** commit this file):

```env
# Database Configuration
DB_SERVER=your-azure-sql-server.database.windows.net
DB_NAME=TheAviaryDB
DB_USER=your_db_user
DB_PASSWORD=your_secure_password

# API & Server Setup
PORT=5000
NODE_ENV=development

# Observability
NEXT_PUBLIC_GA_TRACKING_ID=G-XXXXXXXXXX
```

## Local Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/[your-username]/The-Aviary.git
   cd The-Aviary
   ```

2. Install dependencies:
   ```bash
   npm install # or yarn install / pip install -r requirements.txt
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```
## Getting Started


This project has no build step or external JavaScript dependencies.

### Run locally

1. Open the project folder in VS Code.
2. Open `index.html` in a browser.

For a smoother development experience, use a local static server such as the VS Code Live Server extension. The page can also be hosted on any static hosting service that serves HTML, CSS, and JavaScript files.

## How To Play

1. Scroll to **The Aviary** section.
2. Watch each bird's hunger, hydration, enrichment, bond, and health stats.
3. Use **Feed**, **Water**, and **Spend time** to care for the birds.
4. Open the **Forage box** to find hidden seeds before the timer runs out.
5. Keep an eye on the activity log. Stats decay over time, and neglected birds can start screaming.

## Customization

- Edit `SPECIES_DATA` in `script.js` to add or change field-guide species.
- Edit `CARE_DATA` to update the care accordion content.
- Edit `FACTS_DATA` to add or replace facts.
- Edit `BIRDS` to change the birds in the simulation.
- Adjust `DECAY` and `TICK_MS` in `script.js` to change the game's difficulty.
- Update the design tokens at the top of `style.css` to change the colors, fonts, spacing, and corner radius.

## Notes

- The project currently stores all game state in memory, so refreshing the page resets the aviary.
- The Vet visit button is intentionally disabled and marked as a future feature in the JavaScript.
- Bird-care information is for general education and is not a substitute for advice from an avian veterinarian.

## 🛡️ Security & Quality Assurance

- [x] Zero secrets stored in source code.
- [x] Continuous monitoring established via UptimeRobot.
- [x] Structured error handling to prevent sensitive stack trace leaks in production.


## License

No license has been added to this project yet. 
