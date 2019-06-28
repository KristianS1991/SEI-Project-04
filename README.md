# final-project

For my final project, I created a fullstack app using MapBox that allows the user to plan out a trip anywhere in the UK. The user experience can be broken down as follows. After a user registers and log’s in, they are brought to their user profile, where they have the option to add a new trip, edit an existing trip, or delete an existing trip. If they decide to add a new trip, they are redirected to a page displaying a map of their current location. This page contains a form which allows you to add new locations to your trip. A pop up appears when you click the marker of a location, displaying the location name, and also giving you the option to remove the location. As each location is added or removed, the trip details and the directions (plotted on the map as a line) between locations are updated. A small table in the bottom right corner displays the total distance of the trip and the number of stops on the trip.

I built this app starting with the back-end, utilizing Python, Flask, and PostgreSQL coupled with an SQL database. Then I proceeded to build the front-end, using JavaScript and React. The app also implements the MapBox and British Postcodes API’s for data related to new locations and routes to the map.

I really enjoyed the entire development process of creating this app. From designing wireframes and then building their corresponding React components, to drawing entity-relationship models for each table and coding their models, controllers, and routes in Flask. 

# SEI Project Four, Full-Stack Application - CheckPoint

## Timeframe
1 Week

## Technologies Used
* React
* JavaScript (ES6)
* Python
* Flask
* SQL
* PostgreSQL
* HTML5
* CSS
* Bulma
* MapBox GL JS
* Webpack
* GitHub

## Installation
1. Clone or download the repository.
2. Run `yarn run:serve` within the repository folder in the terminal, to run the server.
3. In another tab, within the same repository folder, run `yarn run:client`, to run the client.

## Project Scope
For our final project, we were given a timeframe of one week to complete a full-stack application using React for the front-end and Flask (Python framework) for the back-end. To store our data, we were to use an SQL database and PostgreSQL as our relational database management system. This was our first project assigned where we were to implement a relational database. A relational database is simply a database that recognizes the relationships between stored groups of information. 

We were to pick a theme, and create a full-stack application that handles the storage of user data in an SQL database. A user would need to be able to register, login, and based on the theme of the app, create some type of data that would be stored and recognized by the database as being related to that user. For bundling and deployment purposes, we were required to use the module builder Webpack.

## Project Overview
I decided to create an application that allows a user to plan road trips in the UK. By implementing the Mapbox GL JS API, I built a site that lets the user create new trips or edit an existing trip. On the homepage, the user is prompted to register if they are not logged in. After registering, they are redirected to a login page. After logging in, the user is brought to the user's profile page. This page displays the user's existing trips, giving them the option to view, edit, or delete a trip. The user also has the option of creating a new trip. 

If the user decides to add a new trip, they are redirected to a page displaying a map of their current location. This page contains a form which allows you to add new locations to your trip. A pop up appears when you click the marker of a location, displaying the location name, and also giving you the option to remove the location. As each location is added or removed, the trip details and the directions (plotted on the map as a line) between locations are updated. A small table in the bottom right corner displays the total distance of the trip and the number of stops on the trip.

#### Website Navigation
![Football Data Centre]()

#### Entity-Relationship Model
Once a user registers, their data is stored in the SQL database. A user can then create multiple trips, each of which can have multiple locations. The trips are stored in the database as part of a one-to-many relationship, where each trip can have one user and each user can have many trips. Each trip is made up of different locations, which makes up another one-to-many relationship, where each location can have one trip and each trip can have many locations.

#### Key Takeaways
The main purpose of this project was to develop an introductory understanding of the React framework, as well as how to make AJAX requests to APIs and utilize the response. A big takeaway from this exercise was related to how data exists in React. We learned that in a React component, there are two main types of data: 'state' and 'props'. 'State' is data specific to that component, directly initialized within that component. 'Props' is data passed to a component by another component, usually a parent or sibling component.

#### AJAX Requests
Another important topic we learned about during this project was AJAX requests. In the context of our project, an AJAX 'GET' request was made to the football-data.org API in order to obtain a response, which we could manipulate and apply to our webpage. An ideal location to make an AJAX request, if the page is not expected to be updated by the user, is within the `componentDidMount()` function. We made our 'GET' requests using the `fetch()` method, providing the API URL and an object containing the type of request and the authorization header as parameters. The `fetch()` call returns a promise, in the form of a response object, which is then converted into JSON, before the data of interest is stored in state. To change state within a component (besides manually changing it in the `constructor()` function), one must use the `.setState()` method. Also, if an error occurs when making an AJAX request, the `.catch()` method catches the error and allows the developer to display it for development purposes, and in some cases, display this error to the user, ie. invalid password, etc.

#### Example GET Request from our Competitions Component
![Example GET Request]()

#### Styling
The styling for this application is made up of a combination of the Bulma framework, CSS, and the Animate.css library. Bulma is a framework for CSS, which is very useful for creating general page layouts, however, it is difficult to use this to apply specific styles to HTML elements. Therefore, I added classes and used these to overwrite some of the default Bulma styling in our `style.css` file.

## Process Breakdown
The process of creating this application can be broken down into a series of stages as follows:
#### Research Stage:
1. Brainstorming ideas for the application.
2. Researching open-source APIs relevant to our idea.
3. Requesting an access token for these APIs.
4. Testing AJAX requests to the APIs with Insomnia, to ensure sufficient data in the response.

#### Preliminary Design/Configuration Stages:
1. Drawing wireframes for each of the webpages.
2. Drawing a flowchart for the user experience.
3. Pseudocoding the functionality for each of the components.
4. Configure the module builder, Webpack, ie. installing dependencies, adding `app.js` and `index.html` etc.

#### Development & Testing Stages:
1. Setup a backbone `index.html` template, in which to render the components.
2. Build a router in the `app.js` file, containing the paths to each React component.
3. Develop, test, and refactor each component.
4. Style the application.

#### Deployment & Presentation Stages:
1. Deploy the application to Heroku.
2. Present our application to the class.

## Challenges
The biggest challenge of this project that we faced was related to time management. Given only two days to create our first React application, it was difficult to plan exactly how much content and functionality we had time to achieve. We decided rather than working separately and then merging our work into one app, we would pair code through the whole project. This way, we could ensure we agreed before adding new features and we could brainstorm about different approaches to solving problems.

## Future Add-ons
One extra feature we would have liked to add to this project is a search bar where the user can search for a specific football player. The search bar would have a dropdown of suggestions that the user could choose from. The user would then click on the player of interest and be redirected to a new page displaying that player's stats. Due to timing constraints, we did not get the opportunity to add this feature.
