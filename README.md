<a id='readme-top'></a>

<h1 align='center'>
  Moovi - Server
</h1>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href='#about'>About</a>
      <ul>
        <li>
          <a href='#built-with'>Built With</a>
        </li>
      </ul>
    </li>
    <li>
      <a href='#setup'>Getting Set-up</a>
      <ul>
        <li>
          <a href='#prereq'>Prequisites</a>
        </li>
        <li>
          <a href='#install'>Installation</a>
        </li>
      </ul>
    </li>
    <li>
      <a href='#endpoints'>Endpoints</a>
    </li>
    <li>
      <a href='#takeaway'>Takeaway</a>
    </li>
  </ol>
</details>

# About
<a id='about'></a>
The server for Moovi, which you can find <a href='https://github.com/stevkim/movie-project' target='_blank'>here.</a>
<p>The server handles the logic for user account (CRUD operations) and data persistence with Mongodb.</p>

## Built With
<a id='built-with'></a>

![Node](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/json%20web%20tokens-323330?style=for-the-badge&logo=json-web-tokens&logoColor=pink)

# Getting Set-up
<a id='setup'></a>

## Prerequisites
<a id='prereq'></a>
![NPM](https://img.shields.io/badge/NPM-%23000000.svg?style=for-the-badge&logo=npm&logoColor=white)

```
npm install npm@latest -g
```
## Installation
<a id='install'></a>

1. Clone the repo
```
git clone https://github.com/stevkim/movie-app-backend
```
2. Install NPM packages
```
npm install
```
3. Create a `.env` in root folder and add environment variables
```
URI=(mongodb uri --- ex. mongodb://localhost:27017, is the most common for local environments)
PORT=(choose port to run it on, defaulted to 3300)
ACCESS_TOKEN_SECRET=(a string that is used to create and verify JWT tokens)
REFRESH_TOKEN_SECRET=(a string that is used to create and verify JWT tokens)
```
4. Run the application
```
npm start
```

# Endpoints

<details>
  <summary> GET / </summary>
  <div>Test endpoint, expect a string repsonse of 'Success'</div>
</details>

<details>
  <summary>POST /login</summary>
  <div>On success, expect data of the user and JWT token is set to cookies</div>
  <div>On failure, status code of 400 and a json response with message of why</div>
</details>


<details>
  <summary>POST /logout</summary>
  <div>Logs out the user, and clears the token in cookies</div>
</details>

<details>
  <summary>GET /token</summary>
  <div>For sessioon persistence, verifies if a refresh token exsists and will issue a new access token if it does</div>
</details>

<details>
  <summary>POST /signup</summary>
  <div>
    <p>
      Expected request body:
    </p>
      
      ```
        {
          username,
          firstName,
          lastName,
          password,
          email,
          dob,
          phoneNumber
        }
      ```
  </div>
</details>

<details>
  <summary>POST /account/info</summary>
  <div>
   Used to get account information - Must provide a valid user _id in the req body, as well as a valid accessToken in headers
  </div>
</details>

<details>
  <summary>PUT /account/update</summary>
  <p> Used to update account information - Must provide a valid user _id in the req body, as well as a valid accessToken in headers</p>
  <div>
    <p>
      Expected request body:
    </p>
    
    ```
      {
        username,
        updateField,
        newField
        password
      }
    ```
  </div>
</details>

<details>
  <summary>PUT /account/preferences</summary>
  <p>Used to update account preferences - Must provide a valid user _id in the req body, as well as a valid accessToken in headers</p>
  <div>
    <p>
      Expected request body:
    </p>
    
    ```
      {
        username,
        type,
        list
      }
    ```
  </div>
</details>

<details>
  <summary>PUT /account/user-movies</summary>
  <p>Used to update account tracked movies/shows - Must provide a valid user _id in the req body, as well as a valid accessToken in headers</p>
  <div>
    <p>
      Expected request body:
    </p>
    
    ```
      {
        username,
        list
      }
    ```
  </div>
</details>

<details>
  <summary>POST /account/delete</summary>
  <div>
     Used to delete account - Must provide a valid accessToken in headers.
  </div>
</details>

# Takeaway
<a id='takeaway'></a>
The importance of RESTful conventions - after learning and coming back to this project, the first thing i notice is that all the endpoints are sort of mushed into get/post/put with no real separation of concerns.
If i'd do this project again, GET requests would soley be replied for the endpoints that give client-side information. PUT would be for when modifying a document in the db. POST would only be used when adding information, DELETE would be used instead to delete as well.
