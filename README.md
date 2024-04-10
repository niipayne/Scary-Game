<h1> Really Really  Scary Game like Seriously</h1>
<h4>Final project for COMP 4303. We decided to make a scary game, it was written in javascript using the three.js module.
</h4>
--------------------------------------------------------

To run:
- Install three.js and vite modules by typing "npm install three" and "npm install vite" respectively.
- Type "npx vite" then the letter "o" and enter or open the link that is provided when the command is run.
- Upon opening the game wait a while for everything to load in or you can open the console check the progress, for reference look at the image provided below.
- ![image](https://github.com/niipayne/4303-Term-Project/assets/112982746/23663c28-d811-4eb0-838b-0d2f7828a8ef)
- 

How to Play:
- Move: WASD<br />
- Look: MOUSE<br />
- Flashlight: HOLD LEFT CLICK

<h3>TOPICS</h3>
<h4>Complex Movement Algorithms</h4>
- The game incorporates Path Following and Collision Avoidance. The Path following algorithm is under the file named "GameMap.js" and the Maynard uses this to locate the player on the map, that call is made in "main.js" on line 105.
<h4>Pathfinding</h4>
- For the pathfinding algorithm we decided to go with the A* algorithm. This can be found in "GameMap.js".
<h4>Decision Making</h4>
- We used a state machine for the decision making of both the player and the maynard they can be found in the files called "CameraState.js" and "EnemyState.js" respectively.
<h4>Procedural Content Generation</h4>
- We used Depth-First Backtracking Maze Generation for the creation of the maze that you have to navigate. Can be found in the file called "MazeGenerator.js".
<h4>Additional Topics</h4>
- For additional topics we implemented seek and arrive which can both be found in the "Scary.js". To place the batteries randomly on the map we used Halton sequence generator which can be found in the "Pseudorandom.js" file and is used in the "Graph.js" on line 28.


<h3>About</h3>
You play in first person view equipped with only a flashlight and have to navigate a maze to reach the goal. All whilst being chased by a T-posing Maynard that knows your exact location at all times.
Your flashlight has a very short battery life so there are batteries littered across the map that refill the bar slightly and also point to in the direction of the goal. Additionally, there is a warning 
system that lets you know how close the Maynard is to you. The only way to deter it is to shine the flashlight in its direction and stopping it from advancing and with a 20 percent chance of teleporting away.
Aim of the game is to reach the goal before you are caught ending the game. You are highly incentized to not get caught. :stuck_out_tongue_winking_eye:
