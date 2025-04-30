# Chicago Honda Dealership Map
This is a full-stack web project that displays Honda dealership locations in Chicago on a map. It features a backend powered by Node.js, Express, and MongoDB, and a frontend with an interactive map UI.
# Features
- Displays Honda dealerships on a map
- Backend API using Express.js and MongoDB Atlas
- Responsive and user-friendly UI
- Secure MongoDB connection via `.env`
# Tech Stack
**Frontend:**
- HTML, CSS, JavaScript
- Leaflet.js (for interactive maps)
**Backend:**
- Node.js
- Express.js
- MongoDB Atlas (Cloud DB)
- Mongoose
- dotenv
# Project Structure
chicago-map/ ├── backend/ │ ├── models/ │ ├── routes/ │ ├── server.js │ └── .env (not included in GitHub) ├── index.html ├── script.js ├── styles.css └── README.md
# Environment Variables

Create a `.env` file in the `backend/` directory:
MONGO_URI=your_mongo_connection_string
PORT=5000
@ .env is excluded from Git using .gitignore

# How to Run Locally
Clone the repo:
git clone https://github.com/kanishhkkaa/chicago-map.git
cd chicago-map/backend
Install dependencies:
npm install
Add your .env file with MongoDB URI.
Run the server:
node server.js# Chicago-Map2
Open index.html in your browser to see the map.
