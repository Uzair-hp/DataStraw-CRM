const SPREADSHEET = 
SpreadsheetApp.getActiveSpreadsheet();

function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('Index')
     .setTitle('CRM Support Dashboard')
.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

//Read the Database and format it to JSON
function getTickets(){
  const sheet = SPREADSHEET.getSheetByName('Tickets');
  if (!sheet) return "Error: 'Tickets' sheet not found.";
  
  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();

  if (lastRow < 2 || lastCol < 1){
    return JSON.stringify([]);
  }
  const data = sheet.getRange(1,1, lastRow, lastCol).getValues();

  const headers = data[0];
  const rows = data.slice(1);

//Conversion to Array to Array of Obj
  const tickets = [] 
  rows.forEach(row =>{
    let ticket = {};
    headers.forEach((header, index)=> {

      if (header && header.toString().trim() !== "")
      {
ticket[header] = row[index];
      }
      
    });
    tickets.push(ticket);
  });
  return JSON.stringify(tickets);
}

//Creating a ticket
function createTicket(ticketData){
  // Backend Validation
  if (!ticketData.customerName || !ticketData.email || !ticketData.description) {
    return JSON.stringify({success: false, error: "Missing required fields (Name, Email, or Description)"});
  }

  // Basic email regex validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(ticketData.email)) {
    return JSON.stringify({success: false, error: "Invalid email format"});
  }

  const sheet = SPREADSHEET.getSheetByName('Tickets');

  const ticketId= "TKT-"+ Math.floor(Math.random() * 1000000000);
  const dateCreated = new Date().toISOString();

  const rowData = [
    ticketId,
    dateCreated,
    ticketData.customerName,
    ticketData.email,
    ticketData.phone || '',
    ticketData.orderId || '',
    ticketData.issueTheme || '',
    ticketData.channel || 'Email',
    'Pending',
    ticketData.priority || 'Medium',
    ticketData.assignedTo || 'Unassigned',
    ticketData.description,
    '' 
  ];

  sheet.appendRow(rowData);
  return JSON.stringify({success:true, id:ticketId});
}

/**
 * UPDATE: Changes the status of an existing ticket.
 * @param {string} ticketId - The ID of the ticket to update.
 * @param {string} newStatus - The new status string.
 */
function updateTicketStatus(ticketId, newStatus) {
  // Backend Validation
  if (!ticketId || !newStatus) {
    return JSON.stringify({error: "Ticket ID and Status are required"});
  }

  const sheet = SPREADSHEET.getSheetByName('Tickets');

  if (!sheet) {
    return JSON.stringify({
      error: "Sheet not found"
    });
  }

  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();

  if (lastRow < 2) {

    return JSON.stringify({
      error: "No data to update"
    });

  }

  // Find required columns
  const headers = sheet
    .getRange(1, 1, 1, lastCol)
    .getValues()[0];

  const idColIndex =
    headers.indexOf('TicketID') + 1;

  const statusColIndex =
    headers.indexOf('Status') + 1;

  if (idColIndex === 0 || statusColIndex === 0) {

    return JSON.stringify({
      error: "Could not find required columns"
    });

  }

  // Get all Ticket IDs
  const idData = sheet
    .getRange(2, idColIndex, lastRow - 1, 1)
    .getValues();

  // Search ticket
  for (let i = 0; i < idData.length; i++) {

    if (idData[i][0] === ticketId) {

      const actualRowNumber = i + 2;

      // Update status
      sheet
        .getRange(actualRowNumber, statusColIndex)
        .setValue(newStatus);

      return JSON.stringify({
        success: true,
        message: "Status updated"
      });

    }

  }

  return JSON.stringify({
    error: "Ticket not found"
  });

}
function getOrderDetails(orderId) {

  // Check Order ID
  if (!orderId || orderId.trim() === "") {

    return JSON.stringify({
      error: "No Order ID provided"
    });

  }

  const sheet =
    SPREADSHEET.getSheetByName('Orders');

  if (!sheet) {

    return JSON.stringify({
      error: "Orders sheet not found"
    });

  }

  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();

  if (lastRow < 2) {

    return JSON.stringify({
      error: "No orders found"
    });

  }

  // Get all order data
  const data = sheet
    .getRange(1, 1, lastRow, lastCol)
    .getValues();

  const headers = data[0];

  const orderIdIndex =
    headers.indexOf('OrderID');

  if (orderIdIndex === -1) {

    return JSON.stringify({
      error: "OrderID column not found"
    });

  }

  // Find matching order
  for (let i = 1; i < data.length; i++) {

    if (data[i][orderIdIndex] == orderId) {

      let order = {};

      headers.forEach((header, index) => {

        if (header) {
          order[header] = data[i][index];
        }

      });

      return JSON.stringify({
        success: true,
        data: order
      });

    }

  }

  return JSON.stringify({
    error: "Order not found"
  });

}
//Update : Save resolution notes to an exisiting ticket
function updateTicketNotes(ticketId, notes) {

    const sheet =
        SPREADSHEET.getSheetByName('Tickets');

    if (!sheet) {

        return JSON.stringify({
            error: "Sheet not found"
        });

    }

    const lastRow = sheet.getLastRow();
    const lastCol = sheet.getLastColumn();

    if (lastRow < 2) {

        return JSON.stringify({
            error: "No data to update"
        });

    }

    const headers =
        sheet.getRange(1, 1, 1, lastCol)
        .getValues()[0];

    const idColIndex =
        headers.indexOf('TicketID') + 1;

    const notesColIndex =
        headers.indexOf('ResolutionNotes') + 1;

    if (idColIndex === 0 || notesColIndex === 0) {

        return JSON.stringify({
            error: "Could not find required columns"
        });

    }

    const idData =
        sheet.getRange(2, idColIndex, lastRow - 1, 1)
        .getValues();

    for (let i = 0; i < idData.length; i++) {

        if (idData[i][0] === ticketId) {

            const actualRowNumber = i + 2;

            sheet
                .getRange(actualRowNumber, notesColIndex)
                .setValue(notes);

            return JSON.stringify({
                success: true,
                message: "Notes saved"
            });

        }

    }

    return JSON.stringify({
        error: "Ticket not found"
    });

}

/**
 * Generate 1,000 sample tickets and orders
 * Run this once from Apps Script
 */
function generateLinkedData() {

  const ticketSheet = SPREADSHEET.getSheetByName('Tickets');
  const orderSheet = SPREADSHEET.getSheetByName('Orders');

  if (!ticketSheet || !orderSheet) {
    Logger.log("Tickets or Orders sheet not found");
    return;
  }

  const themes = [
    "Billing",
    "Delivery",
    "Product Defect",
    "General Inquiry"
  ];

  const products = [
    "Premium Headphones",
    "Wireless Mouse",
    "Mechanical Keyboard",
    "USB-C Hub",
    "Monitor Stand"
  ];

  const shipStatuses = [
    "Shipped",
    "Processing",
    "Delivered",
    "In Transit"
  ];

  const statuses = [
    "Pending",
    "In Progress",
    "Waiting on Customer",
    "Resolved"
  ];

  const channels = [
    "Email",
    "WhatsApp",
    "Phone Call"
  ];

  const customers = [
    "Amit Sharma",
    "Priya Patel",
    "Rahul Verma",
    "Sneha Gupta",
    "Vikram Singh",
    "Anjali Rao"
  ];

  const ticketRows = [];
  const orderRows = [];

  const now = new Date();

  for (let i = 0; i < 1000; i++) {

    const orderId = "ORD-" + (5000 + i);
    const ticketId = "TKT-" + (100000000 + i);

    const date = new Date(
      now.getTime() - Math.random() * 10 * 24 * 60 * 60 * 1000
    ).toISOString();

    const customer =
      customers[Math.floor(Math.random() * customers.length)];

    const theme =
      themes[Math.floor(Math.random() * themes.length)];

    const status =
      statuses[Math.floor(Math.random() * statuses.length)];

    const channel =
      channels[Math.floor(Math.random() * channels.length)];

    ticketRows.push([
      ticketId,
      date,
      customer + " " + (i + 1),
      "user" + i + "@example.com",
      "98765" + (10000 + i),
      orderId,
      theme,
      channel,
      status,
      "Medium",
      "Unassigned",
      "Scalability test ticket.",
      status === "Resolved"
        ? "Resolved automatically for testing."
        : ""
    ]);

    orderRows.push([
      orderId,
      date,
      products[Math.floor(Math.random() * products.length)],
      "$" + (Math.random() * 150 + 50).toFixed(2),
      shipStatuses[Math.floor(Math.random() * shipStatuses.length)]
    ]);
  }

  // Insert tickets
  ticketSheet
    .getRange(
      ticketSheet.getLastRow() + 1,
      1,
      ticketRows.length,
      ticketRows[0].length
    )
    .setValues(ticketRows);

  // Insert orders
  orderSheet
    .getRange(
      orderSheet.getLastRow() + 1,
      1,
      orderRows.length,
      orderRows[0].length
    )
    .setValues(orderRows);

  Logger.log("1,000 linked records generated successfully");
}