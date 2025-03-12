# AkkorHotel-Frontend

The AkkorHotel frontend is a web application developed with React and Vite that connects to the AkkorHotel backend API. This application allows users to search, book, and manage hotel stays around the world.

## Project Overview

AkkorHotel-Frontend provides an intuitive user interface to interact with the backend functionality. It includes the following features:
- **User Management**: Registration, login, email confirmation
- **Hotel Exploration**: Search and filter available hotels
- **Bookings**: Creation and management of reservations
- **Administration**: Admin interface for application management

This project was developed using React with Vite as the build framework.

## Features

### 1. **Authentication and Account Management**:
- User login
- New user registration
- Email sending and confirmation
- User profile management

### 2. **Hotel Exploration**:
- Display of hotel listings
- Advanced filtering options
- Detailed view of specific hotel information

### 3. **Booking System**:
- Hotel reservation interface
- Management of existing bookings

### 4. **Administration**:
- Complete administration panel
- Management of users, hotels, and reservations
- Application monitoring and control

## Technologies Used

- **Frontend**: React.js, Vite
- **Routing**: React Router
- **UI/UX**: Tailwind CSS
- **Testing**: React Testing Library
- **API**: Connection to AkkorHotel backend API via Fetch API

## Quick Start

To start using AkkorHotel-Frontend, follow the steps below:

### Prerequisites

- Node.js 21
- npm (typically included with Node.js)
- The AkkorHotel backend API must be running (see the backend README)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/MathisDulieu/AkkorHotel-Front
cd AkkorHotel-Front
```

2. Install dependencies:
```bash
npm install
```

3. Start the application in development mode:
```bash
npm run dev
```

4. Access the application in your browser:
```
http://localhost:5173/
```

## Tests

To run automated tests:

```bash
npm run test
```

## Configuration

To run this project locally, you need to set up the environment variables:

1. In the `.env` file, uncomment the local URL to use the local API:

   ```bash
   VITE_API_BASE_URL=http://localhost:8080
   ```
   
2. In the same environment file, don't forget to comment out the following variable:

    ```bash
   VITE_API_BASE_URL=https://akkorhotel-api.up.railway.app
   ```
    