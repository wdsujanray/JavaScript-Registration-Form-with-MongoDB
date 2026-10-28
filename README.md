# DOM Registration

A registration and login website built with HTML, CSS, JavaScript, Express, and MongoDB. Users can register or log in, view their profile and registration details on a separate page, download a profile QR code, and log out.

## Features

- Registration and login with server-side validation
- Password hashing with bcryptjs
- MongoDB storage through Mongoose
- Profile page with account details and QR code
- QR code download
- Rate limiting on registration and login endpoints

## Requirements

- Node.js 18 or later
- npm
- MongoDB running locally or a MongoDB connection URI

## Setup

1. Clone or download this repository.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the project root and set your MongoDB connection string:

   ```env
   MONGODB_URI=mongodb://127.0.0.1:27017/dom_registration
   PORT=3000
   ```

   For MongoDB Atlas, use your Atlas connection URI instead. Keep credentials private and never upload `.env` to GitHub.

4. Start the server:

   ```bash
   npm start
   ```

5. Open [http://localhost:3000](http://localhost:3000).

For development with automatic server restarts:

```bash
npm run dev
```

## GitHub Pages

The GitHub Actions workflow deploys the static frontend from `public/` whenever changes are pushed to `main`. Enable GitHub Pages in the repository settings and select **GitHub Actions** as the build and deployment source. The site should then be available at:

<https://wdsujanray.github.io/JavaScript-Registration-Form-with-MongoDB/>

GitHub Pages does not run the Express server or connect to MongoDB. The pages can be displayed there, but registration and login need the backend deployed separately to work.

## Application flow

- `/` displays the registration page.
- `/login.html` displays the login page.
- After successful registration or login, the browser opens `/profile.html`.
- The profile page displays the account ID, name, email, phone, message, registration date, and QR code.
- Log out clears the profile data for the current browser tab and returns to the login page.

The login flow is currently stateless: profile data is held in `sessionStorage` for the current tab. The password is not stored in the browser or returned by the API.

## MongoDB

The application connects using `MONGODB_URI`. The Mongoose `User` model stores records in the `dom_registration` collection. The schema contains:

- `name`
- `email`
- `phone`
- `passwordHash`
- `message`
- Mongoose timestamps (`createdAt` and `updatedAt`)

## API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/register` | Validate and create a user |
| `POST` | `/api/login` | Verify user credentials |

## Upload to GitHub

Create an empty repository on GitHub, then run these commands from the project folder. Replace the URL with your repository's URL:

```bash
git init
git add .
git commit -m "Add DOM registration app"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

Confirm `.env` is ignored before pushing. Do not upload database credentials, passwords, or other secrets.
