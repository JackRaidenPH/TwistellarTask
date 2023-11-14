# Twistellar Test Task: Advanced table and PDF Visualforce page
The task involves creating an advanced table for viewing cases linked to the current user, and a Visualforce PDF page, with a table showing last week cases grouped by their respective AccountId.\
\
The case is considered being related to the current user either if the case's owner is the current user, or if the current user is a member of a queue, which the case belongs to.

## Showcase
Table layout:\
![Table layout](https://github.com/JackRaidenPH/TwistellarTask/assets/41832859/d15fed4c-95af-4d00-b603-aa2573e0fbd0)\
\
The table's visibility is set to be seen only by users with "Service Agent" profile:\
![Visibility filter](https://github.com/JackRaidenPH/TwistellarTask/assets/41832859/d8cfc555-2fe4-4f73-b08f-c191ad86f8e3)\
\
Home page with the table:\
![Home Page](https://github.com/JackRaidenPH/TwistellarTask/assets/41832859/3b35b2a5-e2ae-43fe-8081-676da911beac)\
\
"Case Number" column is clickable and redirect to the case record:\
![Clickable column](https://github.com/JackRaidenPH/TwistellarTask/assets/41832859/61f4e6ff-00d0-4564-a06e-b1cd98da0e9e)\
\
"Case Status" column is editale via a droplist. The values of the droplist are fetched from the field's allowed values:\
![Editable column](https://github.com/JackRaidenPH/TwistellarTask/assets/41832859/e5d732e2-ddd8-41b7-b803-e24f5ffa6300)\
\
Saving changes leads to a spinner indicating contents loading. If saving was successfull - a success notification appears, in the case of an error - an error notification appears:\
![Notification](https://github.com/JackRaidenPH/TwistellarTask/assets/41832859/6f927348-db83-4df7-b6c3-7d660e4758b2)
![Spinner](https://github.com/JackRaidenPH/TwistellarTask/assets/41832859/dd73fcb1-0225-4550-8712-e8be38d6a266)\
\
Refresh button at the top-right corner of the table also leads to a spinner animation:\
![Refresh](https://github.com/JackRaidenPH/TwistellarTask/assets/41832859/73904445-d736-48ce-810e-43a1f09c078d)\
\
Last Week Cases PDF renders a PDF page consisting of all the last week cases ordered by their respective AccountId:
![PDF](https://github.com/JackRaidenPH/TwistellarTask/assets/41832859/260bff71-3a77-4f6e-927d-61958ca47807)
