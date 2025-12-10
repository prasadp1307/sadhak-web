# TODO: Add Payment Fields and Next Appointment to Patient Edit Form

## Steps to Complete:
- [x] Convert the page to a client component by adding 'use client' directive
- [x] Import necessary hooks: useState, useEffect
- [x] Add state for payment fields: consulting, medicine, procedure, extra, total, paid, balance
- [x] Add state for nextAppointmentDate
- [x] Replace single Payment field with multiple inputs in Medical Details section
- [x] Add Total field that auto-calculates sum of consulting + medicine + procedure + extra
- [x] Add Paid input and Balance display (Total - Paid)
- [x] Add Next Appointment Date field with buttons for +8 days, +15 days, +30 days from lastVisit, and manual date picker
- [x] Add useEffect to calculate total and balance whenever payment fields change
- [x] Add functions to handle date additions for next appointment
- [x] Test the form to ensure calculations and date options work correctly
- [x] Fix build issues with client components and static generation
