# CitiSafe: Opportunity Crime Mapper

CitiSafe is a production-grade urban planning and decision-support dashboard designed to predict, visualize, and mitigate opportunity crime risks. By combining interactive maps with a live LLM-powered backend, CitiSafe offers an AI-governed simulation experience that helps urban planners understand how environmental factors influence crime risk in real-time.

## Features

- 🗺️ **Interactive Opportunity Crime Maps**: Visualize crime risk across city environments (tuned with realistic city mappings) using `react-leaflet`.
- 🤖 **AI-Powered Risk Prediction**: Uses a Node.js Express backend integrated with the Google Gemini API (`@google/genai`) to infer risk levels and offer actionable insights.
- 🎛️ **Environmental Simulation**: Urban planners can adjust factors dynamically (such as street lighting, pedestrian flow, or patrol frequency) on the Simulation Screen to visualize predicted impacts on local opportunity crime rates.
- 📊 **High-Level Reporting & Dashboard**: Analyze aggregate crime trends, track risk factors, and view detailed analytical Reports in a sleek, responsive UI.
- ⚡ **Performant Architecture**: Built with React 19, TypeScript, and Vite, utilizing asynchronous and debounced state updates via `zustand` to ensure a snappy user experience.

## Tech Stack

### Frontend
- **Framework**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS, `clsx`, `tailwind-merge`
- **Maps**: Leaflet, `react-leaflet`
- **State Management**: Zustand
- **Routing**: React Router DOM
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js
- **Framework**: Express
- **AI SDK**: Google GenAI (`@google/genai`)
- **Other utilities**: CORS, `dotenv`

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- A [Google Gemini API Key](https://aistudio.google.com/app/apikey)

### Installation & Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/BruhGunned/CitiSafe.git
   cd CitiSafe
   ```

2. **Set up the Backend:**
   Navigate into the `server` directory and install the dependencies.
   ```bash
   cd server
   npm install
   ```
   Create a `.env` file inside the `server/` directory and add your API key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=3000
   ```
   Start the backend node server:
   ```bash
   npm start
   ```

3. **Set up the Frontend:**
   Open a new terminal window, navigate to the **root** directory of the project, and install dependencies.
   ```bash
   npm install
   ```
   Start the Vite frontend development server:
   ```bash
   npm run dev
   ```

4. **Access the Application:**
   Open your browser and navigate to `http://localhost:5173` (or the port specified by Vite).

## Project Structure

```text
CitiSafe/
├── server/                 # Express backend for LLM routing and inference
│   ├── index.js            # Main backend entry point
│   ├── package.json        # Backend dependencies
│   └── .env                # Environment variables (do not commit)
├── src/                    # Frontend React SPA
│   ├── components/         # Reusable UI elements (ProgressBar, SliderInput, etc.)
│   ├── core/               # Shared TS interfaces, utilities, and API models
│   ├── screens/            # Application views (Dashboard, Map, Reports, Simulation)
│   ├── store/              # Zustand global state slices
│   ├── App.tsx             # Root React component
│   └── index.css           # Tailwind injection and global CSS
├── postcss.config.js       # PostCSS config
├── tailwind.config.js      # Tailwind UI design tokens
└── package.json            # Frontend Vite config and project scripts
```

## Contributing
Contributions and feature requests to make our cities safer are highly encouraged. Please feel free to open an issue or submit a Pull Request!

## License
Provided under the MIT License.
