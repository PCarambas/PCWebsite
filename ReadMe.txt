Ensure you have the following pre-installed on your local machine:
Node.js
Visual Studio Code 
PostgreSQL
Cypress

Node.js is a platform for building fast and scalable server applications using JavaScript. 
Node.js is the runtime and npm is the Package Manager for Node.js modules.
Visual Studio Code has support for the JavaScript and TypeScript languages out-of-the-box 
as well as Node.js debugging. However, to run a Node.js application, you will need to 
install the Node.js runtime on your machine.

To get started in this walkthrough, install Node.js for your platform. 
The Node Package Manager is included in the Node.js distribution. 
You'll need to open a new terminal (command prompt) for the node and npm command-line 
tools to be on your PATH.

To test that you have Node.js installed correctly on your computer, open a new terminal 
and type node --version and you should see the current Node.js version installed.

Download links and brief instructions provided below:

Node.js - Download Link at https://nodejs.org/en/download
Then run the installer Graphical User Interface and hit next 
and make the appropriate selections for your system.

Visual Studio Code - Download Link at https://code.visualstudio.com/download
Then run the installer and follow the installers default recommendations or 
make the appropriate selections for your system. 

PostgreSQL - Download Link for windows - https://www.enterprisedb.com/downloads/postgres-postgresql-downloads
Install instructions for Graphical Installer: https://www.2ndquadrant.com/en/blog/pginstaller-install-postgresql/
Make sure to use the following values during install:
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "PCWebsite",
    database: "testdb"  

Cypress - Download Link for windows - https://docs.cypress.io/guides/getting-started/installing-cypress
and follow the websites installation guide and make the appropriate selections for your system. 

Finally, download PCWebsite project files from github as zip.
unzip into your desired workspace environment. 
Open folder in visual studio code.
Open app.js
Open new terminal window
Enter the following to kick off the server and website requests:
node app.js

when you see the following: 
'Server Listening on port:3000' 
displayed in the terminal window. That means success.

Now that the server is up and running, open a browser and enter http://localhost:3000 
in Chrome or Firefox to start using the application.

Once the Student Management Application is running, open new terminal window and enter
the following command to start Cypress:
npx cypress open

Select E2E Testing
Select your preferred browser
Choose the Start E2E Testing button
Select the test you wish to run

////////////////////////////////////////////////////////////////////////////////////////////////////////////

TroubleShooting Steps:
if terminal window says a message like error at require('express') then
execute the following: 
    npm init // you only need to call this once before all your npm install calls
    npm install express --save   
to install the ‘express’ module

execute the following for similar errors: 
npm install body-parser --save   //to install ‘body-parser’ module

npm install helmet --save //to install ‘helmet’ module.

npm install express-validator --save //to install 'express-validator' module.

If you encounter an error with PostgreSQL you will see error at require('pg') 
you may need to run the following from the terminal window in visual studio code: 
npm install pg --save