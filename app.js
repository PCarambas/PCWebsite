
// Express is a node js web application framework that provides broad features 
// for building web and mobile applications. It is used to build a single page, 
// multipage, and hybrid web application. It's a layer built on the top of the 
// Node js that helps manage servers and routes.
var express = require('express');

// Node.js has a built-in module called HTTP, which allows Node.js to transfer 
// data over the Hyper Text Transfer Protocol (HTTP).
// The Hypertext Transfer Protocol (HTTP) is the foundation of the World Wide Web, 
// and is used to load webpages using hypertext links. HTTP is an application layer 
// protocol designed to transfer information between networked devices and runs on 
// top of other layers of the network protocol stack
var http = require('http');

// The Path module provides a way of working with directories and file paths.
var path = require("path");

// Body-parser parses is an HTTP request body that usually 
// helps when you need to know more than just the URL being hit. Specifically 
// in the context of a POST, PATCH, or PUT HTTP request where the information 
// you want is contained in the body. Using body-parser allows you to access req.
var bodyParser = require('body-parser');

// Without Helmet, default headers returned by Express expose sensitive 
// information and make your Node. js app vulnerable to malicious actors. 
// In contrast, using Helmet in Node. js protects your application from 
// XSS attacks (pronounced cross scripting attacks), Content Security Policy vulnerabilities, and other security issues.
var helmet = require('helmet');

// Express Validator is a set of Express. js middleware that wraps validator. js , 
// a library that provides validator and sanitizer functions. Simply said, Express 
// Validator is an Express middleware library that you can incorporate in your apps 
// for server-side data validation.
const { check, validationResult } = require('express-validator');

// Create PostsgresSQL database Client connection object with credentials. 
const { Client } = require('pg')
const client = new Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "PCWebsite",
    database: "testdb"  

})

// Open connection to PostgreSQL database
client.connect()
.then(() => console.log("Connected to PostgreSQL Successfully!"))

// Initialize and kick start the server side back end stuff 
// that was imported / required up above.
var app = express();
var server = http.createServer(app);
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname,'./public')));
app.use(helmet());

// Redirect to index.html when http://localhost:3000/ is entered into a browser.
// We do this because we do not want to expose our site folder structure to the world.
app.get('/', function(req,res){
  res.sendFile(path.join(__dirname,'./public/index.html'));
});

// View All Students we currently have saved in our database. 
// post(/view) is the action this code is listening for when 
// our html page hits the submit button. Then does some action.
// req = request coming from our index.html page. not used here.
// res = response we will send back to our customer.
// rsMessage = is our response set Message we create to send back.
// .then is used to control flow of our program. Essentially waits for previous
// to finish executing and captures the results. Since node.js likes to
// do things in parallel and will execute everything all at once. 
// this helps us force node.js to do things sequentially. 
// .catch(e) is used to capture any errors into variable 'e' and print to console.log
app.post('/view', function(req,res){ 

  // Invoke our query select on our client - which represents our database connection we opened previously.
  client.query("Select * from Students;")
  
  // .then is used to control flow of our program. Essentially waits for previous
  // to finish executing and captures the results.
  .then(results => {

    // <h3> html tag is header type 3 that dictates text formatting (font, size, etc..) 
    // <pre> htmml tag is used to presever whitespaces, tabs, newlines. 
    // Preventing it from collapsing into a single whitespace.
    // Needed to preserve pretty JSON printing to HTML.
    rsMessage = '<h3><pre>'; 

    // JSON.stringify() is used to print a prettier and easier to read version of JSON.
    // JSON.stringify(value, replacer, space) The value to convert to a JSON string.
    // replacer Optional A function that alters the behavior of the stringification process,
    // or an array of strings and numbers that specifies properties of value to be 
    // included in the output. 
    // If replacer is an array, all elements in this array that are not strings or 
    // numbers (either primitives or wrapper objects)
    // , including Symbol values, are completely ignored. If replacer is anything 
    // other than a function or an array (e.g. null or not provided), all string-keyed
    // properties of the object are included in the resulting JSON string.
    // A string or number that's used to insert white space 
    // (including indentation, line break characters, etc.) 
    // into the output JSON string for readability purposes.
    // If this is a number, it indicates the number of space characters 
    // to be used as indentation, clamped to 10 
    // (that is, any number greater than 10 is treated as if it were 10).
    // Values less than 1 indicate that no space should be used.
    // If this is a string, the string (or the first 10 characters of the string,
    // if it's longer than that) is inserted before every nested object or array.
    // If space is anything other than a string or number
    // (can be either a primitive or a wrapper object) — for example, is null or not provided — no white space is used.
    // '            <br>' string has whitespace, tabs, and a breakline html tag.
    rsMessage = rsMessage + JSON.stringify(results.rows,null,'            <br>'); 

    // here we concatenate our rsMessages together and close the HTML tags.
    rsMessage = rsMessage + '</pre></h3>';

    // Creating our header of type 2 for our title message and concatenate with our previous rsMessages. 
    rsMessage = '<h2>List of all students:</h2>' + rsMessage; 

    // We create an html link with the <a> tag that contains an html input button that will take us back to our index.html page.
    rsMessage = rsMessage + '<br><br><a class="back" href="http://localhost:3000/"><input type="button" value="Back"/></a>';

    // once we completed creating our rsMessage we send it to our customer or user by invoking res.send();
    res.send(rsMessage)})

  // .catch(e) is used to capture any errors into variable 'e' and print to the terminal window.
  .catch(e => console.log(e))
});

// Insert New Student
// Does a lot of the same as above but now 
// we are checking and validating the input our customer or user entered into our form.
// post(/insert) is the action this code is listening for when 
// our html page hits the submit button. Then does some action.
app.post('/insert',[
    // trim() removes extra whitespaces at the beginning and end of what was entered.
    // escape() function computes a new string in which certain characters have been 
    // replaced by hexadecimal escape sequences such as html tags 
    check('first_name').isAlpha('en-US', {ignore: '\s\-'}).trim().escape(),
    check('last_name').isAlpha('en-US', {ignore: '\s\-'}).trim().escape(),
    check('email').isAlphanumeric('en-US', {ignore: '\-\.\_\@\~\+'}).isEmail().normalizeEmail().trim().escape(),
    check('phone_number').isMobilePhone('en-US', {errorMessage: 'Must provide a valid US phone number.'} ).trim().escape(),
    check('age').optional({checkFalsy: false}).isNumeric().trim().escape(),
    check('address').optional({checkFalsy: true}).isAlphanumeric('en-US', {ignore: '\&\-\#\,\:\;\'\/\()\ \.\_\+\~'}).trim().escape(),
    check('other_contact_details').optional({checkFalsy: true}).isAlphanumeric('en-US', {ignore: '\&\-\#\,\:\;\'\/\()\ \.\_\+\~'}).trim().escape()
  ], function(req,res){
    // capture our validationResult from the request - req received after checking and validating the inputs received.
    err = validationResult(req);

    // if our err - error object is not (!) empty that means the input failed 
    // our validation and we should not import the string into our db.
    if (!err.isEmpty()) {
      // create our error message to send back to our user. so they can fix and try again. 
      // rest of code is similar to previous explanations.
      rsMessage = "<h2>Please only use Alphabetic characters. Spaces ' ' and dashes '-' are allowed.<br>";
      rsMessage = rsMessage + "See error:<br>";
      rsMessage = rsMessage + '<pre>';
      rsMessage = rsMessage + JSON.stringify(err,null,'            <br>'); 
      rsMessage = rsMessage + '</pre></h2>';
      rsMessage = rsMessage + '<br><br><a class="back" href="http://localhost:3000/"><input type="button" value="Back"/></a>';
      res.send(rsMessage)
    }
    // if input check and validation passed muster and ketchup
    // proceed to creating our queryMessage string to pass to our client database connection object. 
    // here we are going to insert a new student into our database. 
    else {
      queryMessage = "INSERT INTO Students (first_name,last_name,email,phone_number, age, address, other_contact_details) VALUES ('"
      +req.body.first_name+"','"+req.body.last_name+"','"+req.body.email+"','"+req.body.phone_number+"',"+req.body.age+",'"+req.body.address+"','"+req.body.other_contact_details+"');";
      //console.log(queryMessage);
      client.query(queryMessage)
      //.then(() => console.log("New student has been added!"))
      // once query is executed succesfully we create our rsMessage to send back to our customer or user 
      // to let them know they have successfully inserted a new record.
      .then(() => {
        rsMessage = "New student has been added into the database with "
        + "<br>First Name: " + req.body.first_name 
        + "<br>Last Name: " + req.body.last_name 
        + "<br>Email: " + req.body.email 
        + "<br>Phone Number: " + req.body.phone_number 
        + "<br>Age: " + req.body.age 
        + "<br>Address: " + req.body.address
        + "<br>Other Contact Details: " + req.body.other_contact_details;
        rsMessage = rsMessage + '<br><br><a class="back" href="http://localhost:3000/"><input type="button" value="Back"/></a>';
        res.send(rsMessage);
      })
        // catch any err - errors and print out to our terminal window. 
        .catch(err => {
          console.log(queryMessage);
          console.log(err);
          rsMessage = "Please make sure the following required fields have something entered: ";
          rsMessage = rsMessage + '<br><br><a class="back" href="http://localhost:3000/"><input type="button" value="Back"/></a>';
          res.send(rsMessage);        
        });
        
      }
});

// View A Specific Student
// Does a lot of the same as above but now 
// we are checking and validating the input our customer or user entered into our form.
// post(/select) is the action this code is listening for when 
// our html page hits the submit button. Then does some action.
app.post('/select',[
    // Check and validate input is Alphabetic and allows whitespaces \s and dashes \-.
    // trim() removes extra whitespaces at the beginning and end of what was entered.
    // escape() function computes a new string in which certain characters have been 
    // replaced by hexadecimal escape sequences such as html tags 
    check('first_name').isAlpha('en-US', {ignore: '\s\-'}).trim().escape(),
    check('last_name').isAlpha('en-US', {ignore: '\s\-'}).trim().escape()
  ], function(req,res){ 

    // capture our validationResult from the request - req received after checking and validating the inputs received.
    err = validationResult(req);
    
    // if our err - error object is not (!) empty that means the input failed 
    // our validation and we should not import the string into our db.
    if (!err.isEmpty()) {
      rsMessage = "<h2>Please only use Alphabetic characters.<br>";
      rsMessage = rsMessage + "See error:<br>";
      rsMessage = rsMessage + '<pre>';
      rsMessage = rsMessage + JSON.stringify(err,null,'            <br>'); 
      rsMessage = rsMessage + '</pre></h2>';
      rsMessage = rsMessage + '<br><br><a class="back" href="http://localhost:3000/"><input type="button" value="Back"/></a>';
      res.send(rsMessage)
    }
    else {
      // if input check and validation passed muster and ketchup
      // proceed to creating our queryMessage string to pass to our client database connection object. 
      client.query("Select * from Students where upper(first_name) = upper('"+req.body.first_name+"') and upper(last_name) = upper('"+req.body.last_name+"');")
      .then(results => {
        rsMessage = '<h2>You selected the following student:<br>'; 
        rsMessage = rsMessage + '<pre>';
        rsMessage = rsMessage + JSON.stringify(results.rows,null,'            <br>');  
        rsMessage = rsMessage + '</pre></h2>'; 
        rsMessage = rsMessage + '<br><br><a class="back" href="http://localhost:3000/"><input type="button" value="Back"/></a>';
        res.send(rsMessage)
      })
      // catch any e - errors and print out to our terminal window.
      .catch(e => console.log(e))
    }
});


// Update A Specific Student
// Does a lot of the same as above but now 
// we are checking and validating the input our customer or user entered into our update form.
// post(/update) is the action this code is listening for when 
// our html page hits the submit button. Then does some action.
app.post('/update',[
    // Check and validate input is numeric and it is not optional but required. 
    // trim() removes extra whitespaces at the beginning and end of what was entered.
    // escape() function computes a new string in which certain characters have been 
    check('user_ID').isNumeric().trim().escape(),

    // The following fields are optional - .optional({checkFalsy: true})
    // Check and validate input is Alphabetic and allows whitespaces \s and dashes \-.
    // trim() removes extra whitespaces at the beginning and end of what was entered.
    // escape() function computes a new string in which certain characters have been 
    // replaced by hexadecimal escape sequences such as html tags 
    check('first_name').optional({checkFalsy: true}).isAlpha('en-US', {ignore: '\s\-'}).trim().escape(),
    check('last_name').optional({checkFalsy: true}).isAlpha('en-US', {ignore: '\s\-'}).trim().escape(),
    check('phone_number').optional({checkFalsy: true}).isMobilePhone('en-US', {errorMessage: 'Must provide a valid US phone number.'} ).trim().escape(),
    // For email we are allowing alphanumeric and the following characters inside single quotes but escaped \ : '- . _ @ ~ +'
    // Then checking if its a valid email format something@email.com and normalize it to email format if it can.
    // I.E. Normalize the email address by lowercasing the domain part of it... @SomeDomain.CoM to @somedomain.com
    check('email').optional({checkFalsy: true}).isAlphanumeric('en-US', {ignore: '\-\.\_\@\~\+'}).isEmail().normalizeEmail().trim().escape(), //<a>

    // Check and validate that age is numeric then trim and escape it which might be mostly unnecessary but who knows maybe it is. Hackers find ways. 
    check('age').optional({checkFalsy: true}).isNumeric().trim().escape(),

    check('address').optional({checkFalsy: true}).isAlphanumeric('en-US', {ignore: '\s\t\n\-\.\_\@\~\+\#\:\;\'\"\!\&\(\)\{\}\[\]\,'}).trim().escape(),

    // Check and validate that contact details is only using allowed characters and is alphaNumeric. 
    // allowed characters: spaces  tabs '	' newlines ' ' - . _ @ ~ + # : ; '  " ! & ( ) { } [ ] , qwertyuiopasdfghjklzxcvbnm1234567890QWERTYUIOPASDFGHJKLZXCVBNM
    check('other_contact_details').optional({checkFalsy: true}).isAlphanumeric('en-US', {ignore: '\s\t\n\-\.\_\@\~\+\#\:\;\'\"\!\&\(\)\{\}\[\]\,'}).trim().escape()
  ], function(req,res){ 
    
    // capture our validationResult from the request - req received after checking and validating the inputs received.
    err = validationResult(req);

    // if our err - error object is not (!) empty that means the input failed 
    // our validation and we should not import the string into our db.
    if (!err.isEmpty()) {
      rsMessage = "<h2>Please only use a numeric user_ID.<br>";
      rsMessage = rsMessage + "Please only use Alphabetic characters, Spaces ' ', and dashes '-' for first and last name.<br>";
      rsMessage = rsMessage + "Please only use Alphanumeric characters, and the following characters: '- . _ @ ~ +' for email.<br> Also, Please make sure email is similar to: someEmail@something.com<br>";
      rsMessage = rsMessage + "Please only use numeric characters for age.<br>";
      rsMessage = rsMessage + "Please only use Alphanumeric characters, and the following characters: 'spaces tabs newlines - . _ @ ~ + # : ; ' \" ! & ( ) { } [ ] ,' for contact details.<br>";
      // manually copy and paste into field the tabs and newlines to test.
      // spaces  tabs '	' newlines ' ' - . _ @ ~ + # : ; '  " ! & ( ) { } [ ] , qwertyuiopasdfghjklzxcvbnm1234567890
      rsMessage = rsMessage + "See error:<br>";
      rsMessage = rsMessage + '<pre>';
      rsMessage = rsMessage + JSON.stringify(err,null,'            <br>'); 
      rsMessage = rsMessage + '</pre></h2>';
      rsMessage = rsMessage + '<br><br><a class="back" href="http://localhost:3000/"><input type="button" value="Back"/></a>';
      res.send(rsMessage)
    }

    // if input check and validation passed muster and ketchup
    // proceed to creating our queryMessage string to pass to our client database connection object.
    else {
      if(req.body.user_ID > 0)
      {
        // Here we will create our update SQL Query message by using 
        // Multiple if statements to check if our fields are not empty
        // if not empty concatenate the field to be updated with the appropriate comma
        // nested if statement is used to determine if we need to add a comma to our
        // list fields to be updated. 
        // should follow the following template:
        // UPDATE table_name SET
        // column1 = value1,
        // column2 = value2,
        // etc ... 
        // continues as needed.        
        sqlQuery = "UPDATE Students SET";

        // if not empty concatenate the field to be updated with the appropriate comma
        if (req.body.first_name != '')
        {
          // does not need check if comma is needed since it is the first update field
          // which may or may not be included.
          // if included it might be the only one so no comma is needed. 
          sqlQuery = sqlQuery + " First_Name = '"+req.body.first_name+"'";      
        }
        // if not empty concatenate the field to be updated with the appropriate comma
        if (req.body.last_name != '') 
        {
          // check to see if there was a previous field being updated
          // if true add a comma at the end of the current sqlQuery
          if(sqlQuery.includes('First_Name = ')) {sqlQuery = sqlQuery + ",";}
          // then concatenate the new field we will include in the update.
          sqlQuery = sqlQuery + " last_name = '"+req.body.last_name+"'"; 
        } 
        // if not empty and email not equal to '@' - which happens from normalizing email on an empty field. 
        // concatenate the field to be updated with the appropriate comma
        if (req.body.email != '' && req.body.email != '@') 
        {
          // check to see if there was a previous field being updated
          // only one of them needs to return true to know we need a comma added.
          // if true add a comma at the end of the current sqlQuery
          if(sqlQuery.includes('First_Name = ')) {sqlQuery = sqlQuery + ",";}
          else if(sqlQuery.includes('last_name = ')) {sqlQuery = sqlQuery + ",";}
          else {} // do nothing. do not add a comma as this is the only field so far that will need to be updated.
          // then concatenate the new field we will include in the update.
          sqlQuery = sqlQuery + " email = '"+req.body.email+"'"; 
        } 
        if (req.body.phone_number != '') 
        {
          // check to see if there was a previous field being updated
          // only one of them needs to return true to know we need a comma added.
          // if true add a comma at the end of the current sqlQuery
          if(sqlQuery.includes('First_Name = ')) {sqlQuery = sqlQuery + ",";}
          else if(sqlQuery.includes('last_name = ')) {sqlQuery = sqlQuery + ",";}
          else if(sqlQuery.includes('email = ')) {sqlQuery = sqlQuery + ",";}
          else {} // do nothing. do not add a comma as this is the only field so far that will need to be updated.
          // then concatenate the new field we will include in the update.
          sqlQuery = sqlQuery + " phone_number = '"+req.body.phone_number+"'"; 
        } 

        // if not empty concatenate the field to be updated with the appropriate comma
        if (req.body.age != '') 
        {
          // check to see if there was a previous field being updated
          // only one of them needs to return true to know we need a comma added.
          // if true add a comma at the end of the current sqlQuery
          if(sqlQuery.includes('First_Name = ')) {sqlQuery = sqlQuery + ",";}
          else if(sqlQuery.includes('last_name = ')) {sqlQuery = sqlQuery + ",";}
          else if(sqlQuery.includes('email = ')) {sqlQuery = sqlQuery + ",";}
          else if(sqlQuery.includes('phone_number = ')) {sqlQuery = sqlQuery + ",";}
          else {} // do nothing. do not add a comma as this is the only field so far that will need to be updated.
          // check age is numeric and between 0 and 201.
          if (req.body.age >= 0 && req.body.age < 201) 
          {
            // then concatenate the new field we will include in the update.
            sqlQuery = sqlQuery + " age = "+req.body.age+""; 
          } else {sqlQuery = sqlQuery + " age = 0";} // else set the age to = 0 as default. 
        }
        // if not empty concatenate the field to be updated with the appropriate comma
        if (req.body.address != '')  
        {
          // check to see if there was a previous field being updated
          // only one of them needs to return true to know we need a comma added.
          // if true add a comma at the end of the current sqlQuery
          if(sqlQuery.includes('First_Name = ')) {sqlQuery = sqlQuery + ",";}
          else if(sqlQuery.includes('last_name = ')) {sqlQuery = sqlQuery + ",";}
          else if(sqlQuery.includes('email = ')) {sqlQuery = sqlQuery + ",";}
          else if(sqlQuery.includes('phone_number = ')) {sqlQuery = sqlQuery + ",";}
          else if(sqlQuery.includes('age = ')) {sqlQuery = sqlQuery + ",";}
          else if(sqlQuery.includes('address = ')) {sqlQuery = sqlQuery + ",";}
          else {}// do nothing. do not add a comma as this is the only field so far that will need to be updated.
          // then concatenate the new field we will include in the update.
          sqlQuery = sqlQuery + " address = '"+req.body.address+"'"; 
        } 
        // if not empty concatenate the field to be updated with the appropriate comma
        if (req.body.other_contact_details != '')  
        {
          // check to see if there was a previous field being updated
          // only one of them needs to return true to know we need a comma added.
          // if true add a comma at the end of the current sqlQuery
          if(sqlQuery.includes('First_Name = ')) {sqlQuery = sqlQuery + ",";}
          else if(sqlQuery.includes('last_name = ')) {sqlQuery = sqlQuery + ",";}
          else if(sqlQuery.includes('email = ')) {sqlQuery = sqlQuery + ",";}
          else if(sqlQuery.includes('phone_number = ')) {sqlQuery = sqlQuery + ",";}
          else if(sqlQuery.includes('age = ')) {sqlQuery = sqlQuery + ",";}
          else if(sqlQuery.includes('address = ')) {sqlQuery = sqlQuery + ",";}
          else {}// do nothing. do not add a comma as this is the only field so far that will need to be updated.
          // then concatenate the new field we will include in the update.
          sqlQuery = sqlQuery + " other_contact_details = '"+req.body.other_contact_details+"'"; 
        } 
        
        // if all fields are empty then create appropriate message to return to our customer or user.
        if 
        (
          req.body.first_name == '' &&
          req.body.last_name == '' &&
          req.body.email == '' &&
          req.body.phone_number == '' &&
          req.body.age == '' &&
          req.body.address == '' &&
          req.body.other_contact_details == ''
        ) 
        { // create message to our customer or user to let them know they did not include anything to update. 
          rsMessage = "<h2>Nothing was inputed to update...</h2>";
          rsMessage = rsMessage + '<br><br><a class="back" href="http://localhost:3000/"><input type="button" value="Back"/></a>';
          res.send(rsMessage);
        }
        else
          { // Set the where clause where user_id is equal to our unique user that we want to update. 
          sqlQuery = sqlQuery + " where user_ID = "+req.body.user_ID+";";
          
          // invoke our sql query statement on our client object which represents our database connection that we opened. 
          client.query(sqlQuery)

          // catch any errors from our attempted update and print them to the terminal window.
          .catch(e => console.log(e))
          
          // grab the student whom we updated.
          client.query("SELECT * FROM Students where user_ID = "+req.body.user_ID+";")

          // capture results and create our rsMessage to send to customer or user so they can visually validate the correct updates were made. 
          .then(results => {      
            rsMessage = '<h2>The following will be empty if an invalid ID was used... <br>The following student updated their records:<br>'; 
            rsMessage = rsMessage + '<pre>';
            rsMessage = rsMessage + JSON.stringify(results.rows,null,'            <br>');  
            rsMessage = rsMessage + '</pre></h2>';  
            rsMessage = rsMessage + '<br><br><a class="back" href="http://localhost:3000/"><input type="button" value="Back"/></a>';            
            res.send(rsMessage);
          })

          // capture any errors from our select query and print them to the terminal window.
          .catch(e => console.log(e))
          }
      }
      else // else if no valid id was provided create our rsMessage to return to our customer or user to let them know.
      {
        rsMessage = "<h2>A valid ID is needed to update a student record...</h2>";
        rsMessage = rsMessage + '<br><br><a class="back" href="http://localhost:3000/"><input type="button" value="Back"/></a>';
        res.send(rsMessage);
      }
    }
});

// Delete A Specific Student
// Does a lot of the same as above select but now we are deleting a record.
// we are checking and validating the input our customer or user entered into our form.
// post(/delete) is the action this code is listening for when 
// our html page hits the submit button. Then does some action.
app.post('/delete',[
    // check and validate our user_id is numeric then trim and escape which might be unnecessary but who knows hackers might find a way. 
    check('user_ID').isNumeric().trim().escape()
  ], function(req,res){ 
    // capture our validationResult from the request - req received after checking and validating the inputs received.
    err = validationResult(req);

    // if our err - error object is not (!) empty that means the input failed 
    // our validation and we should not import the string into our db.
    if (!err.isEmpty()) {
      rsMessage = "<h2>Please only use a numeric user_ID.<br>";
      rsMessage = rsMessage + "See error:<br>";
      rsMessage = rsMessage + '<pre>';
      rsMessage = rsMessage + JSON.stringify(err,null,'            <br>'); 
      rsMessage = rsMessage + '</pre></h2>';
      rsMessage = rsMessage + '<br><br><a class="back" href="http://localhost:3000/"><input type="button" value="Back"/></a>';
      res.send(rsMessage)
    }
    // if input check and validation passed muster and ketchup
    // proceed to creating our queryMessage string to pass to our client database connection object.
    else {
      // select the student record that will be deleted. To display before and after.
      client.query("Select * from Students where user_ID = "+req.body.user_ID+";")
      .then(results => {
        rsMessage = "<h2>The following student had their records deleted:<br>";
        rsMessage = rsMessage + '<pre>';
        rsMessage = rsMessage + JSON.stringify(results.rows,null,'            <br>');  
        rsMessage = rsMessage + '</pre>'; 
      })
      // catch any errors from our select attempt query and print out to the terminal window.
      .catch(e => console.log(e))

      // proceed to create and invoke our delete query for specific student by user_Id.
      client.query("DELETE FROM Students where user_ID = "+req.body.user_ID+";")
      // capture results if any and concatenate our rsMessage with previous one for select to display before and after. 
      .then(results => {
        rsMessage = rsMessage + "<br>Empty brackets [] means record has been deleted.";  
        rsMessage = rsMessage + '<pre>';
        rsMessage = rsMessage + JSON.stringify(results.rows,null,'            <br>');  
        rsMessage = rsMessage + '</pre></h2>'; 
        rsMessage = rsMessage + '<br><br><a class="back" href="http://localhost:3000/"><input type="button" value="Back"/></a>';
        res.send(rsMessage);
      })
      // catch any errors if any and print them to the terminal window. 
      .catch(e => console.log(e))
    }
});

// Closing the database connection we opened initially.
// post(/close) is the action this code is listening for when 
// our html page hits the submit button. Then does some action.
app.post('/close', function(req,res){
  // attemp to close and capture any errors if any.
  client.end((err) => {
    // if an error occurred prepare our rsMessage and send the response back to our cutomer or user. 
    if (err) {
      rsMessage = '<h2>There is some error in closing the database</h2><br>';
      rsMessage = rsMessage + '<br><br><a class="" href="javascript:close_window();"><input type="button" value="Close"/></a>';
      res.send(rsMessage);
      return console.error(err.message);
    }
    // if closing connection successful prepare our rsMessage and send the response back to our cutomer or user.
    console.log('Closing the database connection.');
    rsMessage = '<h2>Database connection successfully closed. You may safely close this tab / window now.</h2>';
    rsMessage = rsMessage + '<br><br><a class="back" href="http://localhost:3000/"><input type="button" value="Back"/></a>';
    res.send(rsMessage);
  });
});

// Kick off / start our website.
server.listen(3000, function(){
  // print to our terminal window that our website is up and running... better go catch it. 
  console.log("server is listening on port: 3000");
});

