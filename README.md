# AI Country App

## Project Overview
The AI Country App is a web application that provides detailed information about countries around the world. Users can search for countries, view their details, and learn more about their geography, population, and other key statistics. Additionally, the app includes an AI Chat feature that allows users to ask questions and get information about any country interactively.

## Setup Instructions
1. Clone the repository:
  ```bash
  git clone https://github.com/yourusername/AI-country-app.git
  ```
2. Navigate to the project directory:
  ```bash
  cd AI-country-app
  ```
3. Install dependencies:
  ```bash
  npm install
  ```
4. Start the development server:
  ```bash
  npm run dev
  ```

## Available Features
- Search for countries by name
- View detailed information about each country
- Responsive design for mobile and desktop
- AI Chat feature for interactive queries

## Technical Decisions and Architecture

### Frontend
- **React:** Used for building a dynamic and responsive user interface.
- **Axios:** For making HTTP requests to APIs.
- **Apollo Client:** For managing GraphQL queries and mutations.
- **React-Markdown:** For rendering markdown content.
- **Tailwind CSS & Material UI:** For modern and responsive design.

### Backend
- **Express.js:** For handling server-side logic and routing.

### AI Integration
- **OpenAI:** Implemented routing to handle AI Chat feature requests.

## Future Improvements
- Add user authentication and profiles
- Implement caching for API responses to improve performance
- Add support for multiple languages
- Add animations for enhanced user experience
