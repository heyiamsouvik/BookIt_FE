# Travel Booking Backend

This is the frontend service for the Travel Booking project. It provides User interface for authentication, destination listings, and booking functionality and validating promocode validation.

## Features

- User registration and login (JWT based)
- Add and fetch travel destinations
- Book trips (requires login)
- MongoDB database integration
- Environment-based configuration

---

## Tech Stack

- React + TypeScript
- Tailwind CSS

---

## Installation

### 1. Clone repo
```bash
git clone https://github.com/heyiamsouvik/BookIt_FE.git
cd BookIt_FE
```
### 2. Install dependencies
```bash
npm install
```
### 3. Environment Setup
```bash
Create a `.env` file in root:
```
 - VITE_REACT_APP_BACKEND_BASEURL=http://localhost:5000

- Make sure to replace the value with real credentials.

### 4. Start development server
```bash
npm run dev
```

### 5. Test the endpoint
```bash
http://localhost:5173/
```

## LIVE LINK:
- Deployed at render
```bash
https://bookit-fe.onrender.com/
```