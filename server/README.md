# App

This is the backend for Proffy. An app that connects people who want to teach with people who want to take lessons.

## FRs (Functional Requirements)

- [x] The system shall allow users to register new accounts
- [x] The system shall allow users to authenticate
- [] The system shall allow to create subjects
- [] The system shall allow students to filter teachers by subject*, day and time (nearby 10km)
- [] The system shall allow users to reset their password
- [] The system shall allow teachers to indicate the days of the week and time ranges they're available to schedule classes
- [] The system shall allow students to connect with teachers (nearby 10km)
- [] The system shall show the dates a teacher is available
- [] The system shall allow a student to schedule a class with a teacher indicating the day and time range
- [] The system shall show the details of a teacher
- [] The system shall allow the logged in user to get his profile
- [] The system shall allow a logged in teacher to get the details of his schedule
- [] The system shall allow a user to get his lessons history
- [] The system shall allow a user to get the count of his lessons

## BRs (Business Rules)

- [x] The user should not be able to register with an existing email
- [] Only admins should be able to create subjects
- [] The system should not allow to create a subject with an existent name
- [] The system should not allow to schedule a class that begins in less than 30 mins
- [] The student should not be able to schedule a class beginning in less than 30 mins after a class he has already scheduled
- [] The system should not allow to schedule a class when a teacher has already a class scheduled for that time

## NFRs (Non-Functional Requirements)

- [x] The password should be encrypted
- [] The user should be authenticated by a JWT
- [] All listings should have 10 itens per page
- [] The code to reset password should be sent by email
- [] The data should be persisted in a postgres database
