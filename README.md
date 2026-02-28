# cicada-web
task list web-based
update number 1
front.html

feautures added:
. Email & Password Login ✅
    Removed username field
    Added proper validation
    Loading states on submit

2. Registration Modal ✅
    Full name, email, password, confirm password
    Terms and conditions checkbox
    Password strength hint
    Success modal after registration

3. Form Validation ✅
    Email format validation
    Password length check (min 6)
    Password match validation
    Required field validation
    Visual error indicators

4. Password Toggle ✅
    Eye icon to show/hide password
    Works on login and registration forms
    Icon changes to eye-slash when visible

5. Additional Features:
    Theme toggle (Light/Dark mode)
    Forgot password modal
    Success modal with animations
    Floating labels effect
    Loading states on buttons
    Proper error messages
    Smooth transitions

front.css

Key Additions:
1. Input Icons ✅
    .input-icon styles for positioning
    Color transitions on focus

2. Password Toggle ✅
    .password-toggle button styles
    Hover effects
    Proper positioning

3. Modal System ✅
    Full modal styling with backdrop
    Success modal with animations
    Small modal variant
    Dark theme support

4. Error States ✅
    .error class for inputs
    Shake animation
    Error message styling

5. Loading States ✅
    Loading spinner for buttons
    Disabled states
    Proper animations

6. Dark Theme ✅
    Complete dark mode for all new elements
    Proper contrast ratios

7. Responsive Design ✅
    Mobile-friendly modals
    Responsive form options
    Proper spacing on small screens

web.js

Key Improvements:
1. Integration with New Features
    Password toggle for all password fields
    Proper modal opening/closing with focus management
    ESC key to close modals
    Theme toggle with localStorage persistence
    Toast notifications system

2. Enhanced Validation
    Real-time error messages
    Proper field highlighting
    Loading states on buttons
    Form reset on close

3. Better UX
    Focus first input when modal opens
    Smooth animations
    Success/error notifications
    Remember me functionality

4. Dark Theme Support
    Theme toggle button updates
    Saves user preference
    All new elements support dark mode


web.html

Key Updates Made:
1. Fixed IDs and Classes
    Added missing id attributes for all columns in Kanban board
    Ensured all elements referenced in web.js exist
    Added proper container divs for drag and drop

2. Profile Section Completed
    Added all three tabs: About, Activity, Account Settings
    Added missing fields (Department, Location, Bio)
    Added password update fields in account tab

3. Sprint Section
    Added "New Sprint" button
    Fixed progress bar structure
    Added proper IDs for all sprint elements

4. Kanban Board
    Added container divs for each column
    Added proper data-status attributes
    Added task count spans with correct IDs

5. Modals
    Ensure all modals have proper structure
    Added small-modal class for delete modal
    Proper close buttons with icons

6. Navigation
    All nav items have correct data-section attributes
    Badges have proper IDs
    Logout button properly structured

