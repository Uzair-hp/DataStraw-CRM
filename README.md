# Customer Support Ticketing CRM System

A fully functional, web-based customer support management system built for the DataStraw AI + Tech Intern Assessment. This system handles support tickets, customer data, and order information with real-time synchronization to Google Sheets.

## 🚀 Live Demo
**https://script.google.com/macros/s/AKfycbwlSJd3XlRt1dLH0oJXEf32adLwxnhEKiIfzlbxfHA5DMdwlCxCUP3j3mykmVXgB5xtJg/exec**

---

## ✨ Features

### 1. Ticket Management System
- **Create Tickets:** Dynamic modal form for capturing customer info, issue themes, and descriptions.
- **Unique ID Generation:** Automatic generation of unique ticket IDs (e.g., `TKT-123456789`) on the backend.
- **Real-time Sync:** All data is stored and retrieved instantly from Google Sheets.
- **Status Tracking:** Predefined states (Pending, In Progress, Waiting on Customer, Resolved) with color-coded UI indicators.

### 2. Advanced Features
- **Multi-Field Search:** Instant client-side search by Ticket ID, Customer Name, Email, Phone, or Order ID.
- **Smart Filtering:** Filter the ticket list by Status (Active/All/Specific) and Communication Channel.
- **Resolution Notes:** dedicated internal notes area for agents to track resolution steps and history.

### 3. Data Integration & Insights
- **Order Database Linking:** Automatically links tickets to an external `Orders` sheet via `OrderID`.
- **Insights Panel:** Displays real-time order data (Product, Amount, Shipping Status) when a ticket is selected.

### 4. Professional UI/UX
- **Three-Panel Interface:** Optimized layout for high-efficiency support workflows.
- **Responsive Design:** Built with Tailwind CSS for a modern, professional look across devices.
- **Feedback Systems:** Loading spinners, success notifications, and clear empty states.

---

## 🛠️ Technology Stack
- **Backend:** Google Apps Script (GAS)
- **Database:** Google Sheets (acting as a NoSQL-style relational database)
- **Frontend:** HTML5, CSS3 (Tailwind CSS), Vanilla JavaScript
- **Icons:** FontAwesome 6.4.0

---

## 🏗️ Architecture Overview

The system follows a classic **Client-Server architecture** tailored for the Google Workspace ecosystem:

1.  **Database Layer (Google Sheets):** Two primary tables (`Tickets` and `Orders`) store all persistent data.
2.  **Server Layer (Google Apps Script):** A central `Code.gs` handles `doGet` requests to serve the frontend and provides internal API endpoints for CRUD operations using `google.script.run`.
3.  **Client Layer (Browser):** A Single Page Application (SPA) built in `Index.html` that manages state, filtering, and asynchronous communication with the backend.

---

## 📊 Database Schema

### `Tickets` Sheet
| Column | Description |
| :--- | :--- |
| **TicketID** | Unique identifier (Primary Key) |
| **DateCreated** | ISO Timestamp of creation |
| **CustomerName**| Name of the customer |
| **Email** | Customer contact email |
| **OrderID** | Foreign Key linking to the Orders sheet |
| **Status** | Current state (Pending, Resolved, etc.) |
| **ResolutionNotes**| Internal agent notes and history |

### `Orders` Sheet
| Column | Description |
| :--- | :--- |
| **OrderID** | Unique identifier (Primary Key) |
| **OrderDate** | Date of purchase |
| **ProductName** | Item purchased |
| **Amount** | Total order value |
| **ShippingStatus** | current shipping state |

---

## ⚙️ Setup & Installation

### 1. Google Sheets Setup
1. Create a new Google Sheet named `CRM_Database`.
2. Create two tabs: `Tickets` and `Orders`.
3. Add the headers listed in the **Database Schema** section above to Row 1 of each tab.

### 2. Apps Script Deployment
1. In your Google Sheet, go to **Extensions > Apps Script**.
2. Copy the contents of `Code.gs` from this repository into the script editor.
3. Create a new HTML file in the editor named `Index` and copy the contents of `Index.html`.
4. Click **Deploy > New Deployment**.
5. Select **Web App**, set access to **Anyone**, and click **Deploy**.
6. Copy the provided Web App URL.

### 3. Local Environment
1. Clone this repository to your local machine.
2. Use the code for version control and local development before pasting into the GAS editor.

---

## 🧠 Technical Decisions & Challenges
- **Performance:** Implemented client-side filtering and searching to ensure the UI remains snappy even with thousands of tickets, reducing the number of costly `google.script.run` calls.
- **Scalability:** Used dynamic column index searching in the backend (`indexOf`) instead of hardcoding column letters (e.g., "A", "B"). This allows the database schema to be expanded in the future without breaking the code.
- **UX:** Opted for a "Three-Panel" layout inspired by professional CRM tools like Zendesk and Salesforce to maximize agent productivity.

---

## 📝 License
This project is part of a technical assessment. All rights reserved.
