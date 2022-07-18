# Thoughts:

* Tried my best on this in the time limit! Hope you enjoy!
* Per the email, app is responsive from mobile to ultrawide and incorporates the unsplash API and listed features.
* Uses a JSON file for persistance. This file is created and updated using a loggedInUser id. In this fake scenario, everything is stored inside that, but in a real app, there would be some function call like "getLoggedInUser()' that uses a cookie and returns everything about the user.
* Can view your own liked items via the button, but if there were multiple users stored, could view by /?viewUserLikes={some_id} since it's programmed keeping that in mind. Only 2 users in JSON file, 1 is yourself and 2 is the one to test with (/?viewUserLikes=2). You cannot change other's likes.
* Can refresh and keep existing search query/viewing liked posts
* Tried to keep a11y in mind as much as I could while working quickly.
* Some small touches in, like scrolling the new photos into view when clicking "grab more", top to page with logo click. Search also focuses on page load for quick searching.
* Not much in terms of error handling in yet outside of logging, would likely want to implement some sort of toast notification and maybe a retry button.

#### Definitely not perfect by any means! I definitely feel like I could've done a lot more given more time, especially in a real project.

# How to run:

### Create an .env file with VITE_UNSPLASH_ACCESS that is set to what I sent in the email along with this git link

### `npm i` to install and then `npm run dev` to start the server

