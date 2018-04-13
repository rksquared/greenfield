# greenfield

#####READ ME#####
Tech Stack

React, React Router, Material UI, Express, MySQL
Uses Google Geocoding API (convert destination address to coordinates),
Google Places API (search places near destination address based on user criteria),
Google Maps Distance Matrix API (calculate location between destination and places)

Organization

helpers/google.js has helpers that make API requests to Google and return data to the main index file
helpers/dbHelpers.js has files that interact with the mySQL database
helpers/utils.js has a file that converts data that the React front-end sends to the server to the format that the server uses to make requests to Google. Files that facilitate communication between different parts of the app can go here.

Opportunities to improve the project

-Improve signup page and user auth
-Make a call to Google Maps API to map out search results
-Finish any remaining DB functionality to send back user's favorites to the server and React