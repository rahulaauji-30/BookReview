
---

# Book Review Website

This is a Book Review Website developed using Node.js, Express, EJS, Axios, PostgreSQL, and various other technologies. It allows users to read book reviews, view post statistics, like specific reviews, and submit their own reviews, which will be sent for approval to the admin. The admin has privileges to log in, manage reviews by adding, deleting, or updating them.

## Features

- **User Interface:**
  - Users can browse through various book reviews.
  - Viewers can see the number of views for each review.
  - Like functionality for users to appreciate specific reviews.
  - Users can submit their own reviews.

- **Admin Panel:**
  - Admin can log in securely.
  - Admin has the ability to approve, delete, or update reviews.
  - Manage user reviews through an intuitive dashboard.

## Technologies Used

- Node.js
- Express.js
- EJS (Embedded JavaScript templates)
- Axios
- PostgreSQL
- Body-parser

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/book-review-website.git
   cd book-review-website
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up PostgreSQL database**

   - Create a PostgreSQL database.
   - Update the database configurations in `config/database.js` with your credentials.

4. **Run the application**

   ```bash
   npm start
   ```

   The application will run on `http://localhost:3000` by default.

## Usage

- Access the website using a web browser at `http://localhost:3000`.
- Explore various book reviews, view counts, and like reviews.
- Users can submit their reviews, which will be sent for admin approval.
- Admin can log in to the admin panel and manage reviews.


## Contributing

Contributions are welcome! If you'd like to contribute to this project, please follow the guidelines in `CONTRIBUTING.md`.


## Authors

-  <rahulaauji71@gmail.com>

## Acknowledgments

Special thanks to [Node.js](https://nodejs.org/), [Express.js](https://expressjs.com/), and all other dependencies used in this project.

---
