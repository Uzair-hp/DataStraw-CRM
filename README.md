# Customer Support Ticketing CRM System

A professional, fully functional, web-based customer support management system built for the DataStraw AI + Tech Intern Assessment. This system leverages Google Workspace as a serverless infrastructure, using Google Sheets as a relational database and Google Apps Script as the backend API.

## 🚀 Live Demo
**https://script.google.com/macros/s/AKfycbxu3v5wVOEreu0F1to6Y11K6mxuhGtGVvC8Qdp3ba7QzbY_fCExMlVrdiH9q07xVXvSug/exec**

---

## ✨ Key Features

### 1. Ticket Management System (Core)
- **Automated CRUD:** Full Create, Read, and Update operations synced in real-time with Google Sheets.
- **Unique ID Generation:** Automatic generation of structured ticket IDs (e.g., `TKT-123456789`).
- **Status Tracking:** Predefined workflow states (Pending, In Progress, Resolved) with color-coded UI indicators.

### 2. Advanced "Excellent" Features
- **Dashboard Analytics:** Real-time metrics bar showing Total, Pending, In-Progress, and Resolved ticket counts for instant oversight.
- **CSV Export:** One-click functionality to export the current ticket list to a professional CSV format for external reporting.
- **Multi-Field Search:** Instant client-side search by Ticket ID, Customer Name, Email, Phone, or Order ID.
- **Smart Filtering:** Dynamic filters for Status (Active/All/Specific) and Communication Channels (Email, WhatsApp, Call).
- **Resolution Tracking:** Dedicated internal notes system for agents to track escalation history and audit trails.

### 3. Data Integration & Insights
- **Relational Data Linking:** Automatically links tickets to an external `Orders` database via `OrderID`.
- **Insights Engine:** Displays real-time order context (Product, Amount, Shipping Status) when a ticket is selected.

---

## 🛠️ Technology Stack
- **Backend:** Google Apps Script (GAS)
- **Database:** Google Sheets (Relational Architecture)
- **Frontend:** HTML5, CSS3 (Tailwind CSS via CDN), Vanilla JavaScript
- **Icons:** FontAwesome 6.4.0

---

## 🏗️ Architecture Overview

The system follows a classic **Single-Page Application (SPA)** architecture:

1.  **Database Layer (Google Sheets):** Uses two primary sheets (`Tickets` and `Orders`) acting as relational tables.
2.  **Server Layer (Google Apps Script):** A central `Code.gs` serves the frontend and provides internal API endpoints for data operations, including robust input validation.
3.  **Client Layer (Browser):** A high-performance SPA that manages state, performs near-zero latency client-side filtering, and handles asynchronous communication.

---

## 📊 Database Schema

### `Tickets` Sheet
| Column | Description |
| :--- | :--- |
| **TicketID** | Unique Primary Key |
| **DateCreated** | ISO Creation Timestamp |
| **CustomerName**| Full name of the customer |
| **Email** | Contact email (Validated on backend) |
| **OrderID** | Foreign Key linking to Orders |
| **Status** | Current workflow state |
| **ResolutionNotes**| Internal audit and notes |

### `Orders` Sheet
| Column | Description |
| :--- | :--- |
| **OrderID** | Unique Primary Key |
| **OrderDate** | Date of transaction |
| **ProductName** | Item description |
| **Amount** | Total order value |
| **ShippingStatus** | Current delivery state |

---

## 🧠 Technical Decisions & Challenges
- **Scalability:** Successfully tested and optimized for **1,000+ perfectly synced records**, ensuring the UI remains snappy and the backend fetches stay within execution limits.
- **Performance:** Implemented client-side filtering to minimize costly server calls and provide an instantaneous user experience.
- **Data Integrity:** Built a dynamic column indexing system in the backend (`indexOf`). This makes the code **schema-agnostic**, allowing the spreadsheet to be modified without breaking the application logic.
- **Robust Security:** Implemented mandatory field validation and email format verification on the server-side to prevent malformed data entry.

---

## ⚙️ Setup & Installation
1.  **Spreadsheet:** Create a Google Sheet with `Tickets` and `Orders` tabs (use headers from the Schema section).
2.  **Script Editor:** Go to `Extensions > Apps Script` and paste `Code.gs` and `Index.html`.
3.  **Deploy:** Click `Deploy > New Deployment`, select `Web App`, set access to `Anyone`, and copy your URL.

---

## 📝 License
Part of a technical intern assessment. All rights reserved.
