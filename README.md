# HR Management Application

This project is a Single Page Application (SPA) built using TypeScript, HTML, and CSS, following the MVVM (Model–View–ViewModel) pattern.
The application consumes an existing REST API to manage employees, allowing users to list, create, edit, and delete employee records.

## Overview
This application was developed as a technical test to demonstrate proficiency in:
- TypeScript programming
- MVVM (Model-View-ViewModel) architecture
- Vanilla JavaScript (no frameworks like React or Angular)
- RESTful API integration
- UI/UX implementation based on provided mockups
- Form validation and error handling

## Features
- List employees
- Create new employees
- Edit existing employees
- Delete employees
- Client-side validation
- Basic error handling

## Architecture
The application follows the **MVVM pattern**:
- **Model**  
  Represents the domain entities (e.g., `Employee`).
- **View**  
  Implemented using HTML and CSS. Responsible only for displaying data and capturing user input.
- **ViewModel**  
  Contains the application logic, manages state, handles user interactions, and communicates with the service layer.

## 📝 Assumptions
1. **Date Fields**: Employment start/end dates are hidden and auto-populated 
   with current date since they weren't in the mockups
2. **SSN Format**: Enforces US SSN format (XXX-XX-XXXX) as shown in API examples
3. **User Context**: `LastUpdatedBy` is hardcoded as 'testUser' for demo purposes
4. **UUID Generation**: Client-side UUID generation for new employee IDs

## ✨ Additional Features Implemented
- ✅ **Responsive Design**: Media queries for 768px and 480px breakpoints
- ✅ **SSN Format Validation**: Enforces XXX-XX-XXXX format with descriptive errors
- ✅ **Success Modals**: Professional feedback for create/update/delete operations
- ✅ **Error Modals**: User-friendly error handling instead of browser alerts
- ✅ **Breadcrumb Navigation**: Shows context when editing (Employee > Name)

## API Integration
Communication with the backend is encapsulated in a dedicated service layer:
- `IEmployeeService` defines the contract for employee-related operations.
- `EmployeeService` implements the contract using the Fetch API.

**Endpoints**:
- `GET /Employees` - List all
- `GET /Employees(id)` - Get by ID
- `POST /Employees` - Create
- `PUT /Employees` - Update
- `DELETE /Employees(id)` - Delete

## Setup
1. Install dependencies:
```bash
npm install
```
2. Start the application:
```bash
npm start
```
The application will open automatically in your browser at http://localhost:3000

## Project Structure
```
EmployeeManagementApp/
├── src/              # TypeScript source files
├── public/           # HTML and CSS files
├── dist/             # Compiled JavaScript (generated)
└── bs-config.json    # Server configuration
```

## Available Scripts

- `npm start` - Compiles TypeScript and starts development server
- `npm run build` - Compiles TypeScript once


