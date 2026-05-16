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

