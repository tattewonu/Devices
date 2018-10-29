let express = require('express'); //lets our app require the use of express
let app = express(); // start up / init express;
let server = require('http').Server(app) // start a server using our app.
let io = require('socket.io')(server)

let port = 3000; //set a port for access

app.use(express.static('public')) //have our app use the folder public to serve our static files.


//this is our database & storage, it needs a dummy user to get all set up at the beginning.
let users = []


io.on('connection',function(socket){
  //what should we do when someone connects?
  console.log(socket.id);

  //look for the incoming login message from the client side
  socket.on('login',function(loginData){
    let isLoginInDatabase = false; //set up a place to store if we have cound a user
    let haveVisitedBefore = false; //ser up a place to store if we are a user and we have visited with that user agent before.

    /**********************************************************/
    /*   Check if User is in 'Database' & add unique visits   */
    /**********************************************************/

    //loop through all of the users and check them one by one
    for (let user in users) {
      // console.log('user ' +users[user].username);
      // console.log('login '+loginData.username);

      //check to see if this username is already in our database.
      //see if our username is the same as any any in the tatabase
      if(users[user].username === loginData.username){
        console.log('this user exists');
        isLoginInDatabase = true; //if it is the same, then we've already been here, set our variable to true so that we dont create a new user later on.

        //check too see id this is a duplicate visits.
        //loop through our previous visits one by one.
        for (let i = 0; i < users[user].visits.length; i++) {
          // console.log(users[user].visits[i]);
          //compare all visits, if they have already made a visit with this useragent, dont log it.
          if(loginData.loginScreenType === users[user].visits[i]){
            console.log('matching visit, do not log.');
            haveVisitedBefore = true; // set the variable to visited so that we dont log the visit later.
          }
        }

        //if we still have not set the visit to true (a previous visit),  then lets go ahead a log this new visit for this user.
        if(haveVisitedBefore === false){
          console.log('unique visit, log it!');
          users[user].visits.push(loginData.loginScreenType) // add the visit to this user's visits list in the database.
        }

        break; //stop checking, because we found a matching user to ours. (notice that this is on the same indentation as the first if statement)
      }
    }

    /***************************************/
    /*      Add user to 'Database'         */
    /***************************************/

    //now that we are done looping through all of the users, we can check the status of everything. if the isLoginInDatabase is false, it means we never found that user, which must mean that it;s a new user, so go ahead and create a new user!
    if(isLoginInDatabase === false ){
        // setup a default new user with out login username and our first visit location.
        let newUser = {
          'username' : loginData.username, //usename form the form
          'visits': [loginData.loginScreenType] //useragent from the form
        }
        users.push(newUser) //add this user to the to users list
        // return;
      }


    // console.log(users); //log out all the users
    console.log(" ");
    console.log("_!_!_!_!_!_!_!_!_!_"); //so that we can see each unique login instance in the console.
    console.log(" ");
  })

  //check for the getUsers message, and if it's recieved send the users back to the client. This uses a callback function so that we dont have to have quite so many messages going on. basically the clinet asks for the users and we send them back on the same message when they are ready.
  socket.on('getUsers', (name, fn) => {
     fn(users);
  });

})

//the master game countdown
let gameTime = 5 * 60 * 60;  // 6 hours, * 60 minutes * 60 seconds = 6 hours in seconds.

//create a timer which does a function evey so often (in this case every 1000ms)
setInterval(function(){
  gameTime = gameTime - 1 //subtract one second from our gametime everytime the interval fires.
  if(gameTime <=0){ // if our gametime is less than or = 0 then the game is over, reset!
    console.log('Game Over');

    //reset the game time, reset the users array.
     gameTime = 5 * 60 * 60;  // reset the gametime to be: 6 hours, * 60 minutes * 60 seconds = 6 hours in seconds.
    users = [] //reset the users database to be empty, this overwrites all users and thier visits with emptyness!

  }

  io.emit('remainingGameTime', gameTime) // send the remaining gametime down to the clinet on each interval fire

}, 1000) //count down at 1 second



//start the server listening on the port that we've assigned.
server.listen(port, function(){

  console.log('server started on: ' + port );

} )
