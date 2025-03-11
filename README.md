
## Getting Started

First, run the development server:

```bash
npm run install
# or
yarn i
```
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

# Application Features and Installation Guide

## Features

### 1.1 Smart Dynamic Forms

- **Dynamic Form Structure**: The application fetches the form structure from an API, ensuring that the form is never hardcoded. This makes it flexible and adaptable to changes in the backend.
  
- **Conditional Fields**: Fields in the form appear or disappear based on the user's previous input, offering a personalized experience. For example, selecting a certain option might dynamically show additional fields.

- **Nested Sections**: The form includes fields with nested sections, such as **Address** or **Vehicle Details**, which are grouped logically for better user experience and organization.

- **Dynamic API-driven Options**: Some fields (e.g., dropdowns) fetch their options dynamically from an API, like displaying states based on the selected country.

- **Form Validation**: The form is validated before submission to ensure that all required fields are filled out correctly, preventing errors and incomplete submissions.

### 1.2 Customizable List View

- **View Submitted Applications**: Users can view submitted applications in a table format.

- **Dynamic Column Selection**: Users have the ability to dynamically select which columns to display in the table. This allows for a highly customizable and user-friendly list view.

- **Sorting**: Columns in the table are sortable, allowing users to sort the data by clicking on column headers.

- **Searching**: Users can search the data in the table. The list dynamically filters based on the selected columns and search term.

- **Pagination**: The table supports pagination, which breaks down large datasets into manageable pages, improving performance and user experience.

---

## Installation Instructions

To get started with the project, you need to set up the dependencies. You can do this by using either **npm** or **yarn**. Follow the instructions below based on your package manager preference.

### 1. Clone the Repository

First, clone the repository to your local machine:

```bash
git clone https://github.com/mohammadrezahayati/task.git
cd <project_directory>
