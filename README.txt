Accessibility Escape Room 2026

What is in this package
index.html
The main offline game file.

data.js
This is the easiest file for editing rooms, questions, answers, hints, explanations, and audio filenames.

script.js
Game logic for timer, answer checking, room progression, hint display, explanation display, and room audio autoplay attempts.

styles.css
Visual styling for the game.

README.txt
This file.

ANSWER_GUIDE.txt
Plain language answer guide with all current accepted answer keywords.

images folder
Contains the jpg visuals for each room and the congratulations screen.

How to open the game
1. Extract the zip file.
2. Open index.html in a browser.
3. Keep every file and the images folder together in the same extracted package.

Where to edit questions and answers
Open data.js.

There are two main arrays.
1. ESCAPE_ROOMS
2. ESCAPE_QUESTIONS

Each question object includes:
id
room
question
acceptedKeywords
hint
explanation

How accepted answers work
The game checks whether the typed answer contains at least one phrase from acceptedKeywords.
That means you can make answer checking flexible by listing several possible keyword phrases.
Example:
acceptedKeywords: ["alt text", "alternative text", "text alternative"]

If you want answers to be even easier to match, add more likely phrases to acceptedKeywords.
If you want them stricter, remove extra phrases.

How the room audio works
Each room object in ESCAPE_ROOMS has an audio value.
Current setup:
room1.mp3
room2.mp3
room3.mp3
room4.mp3
room5.mp3
room6.mp3

The congratulations screen is set to:
congrats.mp3

To add your own audio:
1. Put the mp3 files in the main extracted folder beside index.html.
2. Keep the same names, or edit the names in data.js.
3. Refresh the browser.

Important audio note
Modern browsers sometimes block autoplay until the user interacts with the page.
The code is already set up to try autoplay when each room loads.
After the user has started interacting, autoplay behavior is usually more reliable.

Timer behavior
Each room uses a 2 minute timer.
The timer starts only when the user presses Get me out of here.
If time runs out, that room resets.

How to swap room visuals
The current image files are:
images/room1_basement_dungeon.jpg
images/room2_rec_room.jpg
images/room3_stair_door.jpg
images/room4_stairs_top_door.jpg
images/room5_foyer_door.jpg
images/room6_front_door.jpg
images/congratulations_oasis.jpg

If you replace an image, keep the same file name, or update the matching image value in ESCAPE_ROOMS in data.js.

Accessibility notes
The game includes:
Clear room headings
Visible timer
Keyboard usable controls
Hint and explanation buttons
Live feedback messaging
Large room visuals with alt text

If you want to add, remove, or reorder rooms
Edit ESCAPE_ROOMS in data.js.
Then make sure the room number on each question in ESCAPE_QUESTIONS matches the room where you want that question to appear.
