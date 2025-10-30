# App

This is the backend for Proffy. An app that connects people who want to teach with people who want to take lessons.

## FRs (Functional Requirements)

- [x] The system shall allow users to register new accounts
- [x] The system shall allow users to authenticate
- [x] The system shall allow to create subjects
- [] The system shall allow users to reset their password
- [x] The system shall allow teachers to indicate their subject
- [x] The system shall allow teachers to indicate the days of the week and time ranges they're available to schedule classes
- [x] The system shall allow search teachers by subject
- [x] The system shall allow fetch nearby teachers (10km)
- [x] The system shall allow a student to schedule a class with a teacher indicating the day and time range
- [x] The system shall allow to get the schedule of a teacher
- [x] The system shall allow to list the lessons of a teacher for the period of one week
- [x] The system shall allow to list the lessons of a student for the period of one week
- [x] The system shall allow the logged in user to get his profile
<!-- - [] The system shall allow a teacher or student to get the details of a lesson the're part of -->
- [x] The system shall allow a teacher to get their lessons history
- [x] The system shall allow a teacher to update their schedule
- [x] The system shall allow a teacher to get the count of their lessons

## BRs (Business Rules)

- [x] The user should not be able to register with an existing email
- [] Only admins should be able to create subjects
- [x] The system should not allow to create a subject with an existing name
- [x] The system should not allow a teacher to have more than one subject
- [x] The student should not be able to schedule a lesson beginning in less than 30 mins after a class he has already scheduled
- [x] The system should not allow a student to schedule a lesson when a teacher has already a lesson scheduled for that time
- [x] Lessons can only be scheduled between 7AM and 6PM
- [x] A lesson must be scheduled for at least 30min
- [x] A teacher should have only one schedule range per day
- [x] The system should not allow to schedule a lesson for a past date

## NFRs (Non-Functional Requirements)

- [x] The password should be encrypted
- [] The user should be authenticated by a JWT
- [] All listings should have 10 itens per page
- [] The code to reset password should be sent by email
- [x] The data should be persisted in a postgres database
