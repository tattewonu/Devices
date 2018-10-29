let socket = io.connect();


socket.on('connect', function(){
  console.log('we connected to the server as:');
  console.log(socket.id);

})

$('.login').click(function(){

  let username = $('.usernameLogin').val() //get the username value from the form
  if(username.length != 0){ //check to see if the name is empty, if its not equal to 0, then do tihe stuff in the {}

    //pack up the data from the form and the useragent from our browser
    let loginData = {
      'username': username,
      'loginScreenType': navigator.userAgent
    }

    console.log(loginData);

      socket.emit('login', loginData) // send the login info to the server for it to handle there...


      console.log('successful Login') //maybe you want ot make this visual?

      document.getElementById("demo").innerHTML = "Successful Login";

    }else{
      console.error('there was a problem Logging in')

  document.getElementById("demo2").innerHTML = "Oops... there was a problem logging in.";
    }


}); //close login


//when we see the incoming game time message act accordingly.
socket.on('remainingGameTime', function(gameTime){
  //display the time, see the hhmmss function at the bottom for how the text is getting styled.
  $('.time').html('<p>' + hhmmss(gameTime)  + '</p>')

})


//update the users periodically with an interval loop, every second should be enough.
setInterval(function(){
  //send out the get users message and wait for the callback to come in with the user list
  socket.emit('getUsers', 'usrs', function(userList){
    console.log(userList); //what did we get back from the server?

    $('.highscores').html('') // clear the highscores list (we'll rebuild it below)



    //loop through each user one by one and add them to the highscore list (you'll likely want to do some ordering here, but I'll let you try to figure that one out :) )


    // userList.push(
    //   {'username':"james",
    // 'visits': '23,4,4,3,2,3'}
    // )
    //
    // userList.push(
    //   {'username':"reggie",
    // 'visits': '23,4,4,3,2'}
    // )
    // userList.push(
    //   {'username':"janus",
    // 'visits': '23,4,4'}
    // )
    //
    // userList.push(
    //   {'username':"james",
    // 'visits': '23,4,4,3,2,3'}
    // )
    //
    // userList.push(
    //   {'username':"reggie",
    // 'visits': '23,4,4,3,2'}
    // )
    // userList.push(
    //   {'username':"janus",
    // 'visits': '23,4,4'}
    // )
    //
    //
    // userList.push(
    //   {'username':"jamdswes",
    // 'visits': '23,4,4,2,3'}
    // )
    //
    // userList.push(
    //   {'username':"regwwgie",
    // 'visits': '23,4,4,2'}
    // )
    // userList.push(
    //   {'username':"janasdasus",
    // 'visits': '23,4,4,6,6,6,6,6,6'}
    // )


    //sort the array in reverse numeric order
    userList.sort(function (a, b) {
        return b.visits.length - a.visits.length;
    });

    //cut it down to X amouint of values
    let slicedUsers = userList.slice(0,5);



    //render it/
    for(let eachUser in slicedUsers){
      $('.highscores').append( //add the username / score and concat it into a p tag
      '<p>' +
      userList[eachUser].username
      + ' | ' +
      userList[eachUser].visits.length //the length is the total number of visits, since we only store unique ones, then, this should be the score.
      + '</p>'
    );




//     var array = [];
//
//     for (var key in eachUser) {
//         array.push(eachUser[key]);
//
//     }
//
// //     items.sort(function (a, b) {
// //   return a.value - b.value;
// // });
//
//     array.sort(function(a, b){
//         return a.userList[eachUser].visits.length - b.userList[eachUser].visits.length;
//     });
//
//     for (var i = 0; i < array.length; i++) {
//         array[i].rank = i + 1;
//     }
//
//




    }
  })

},1000) //how often to update the user / highscore list








//convert seconds to hours minutes and seconds, walk through the math logically thinking about the relationship of hours minutes and seconds and i'm sure it'll make sense
function hhmmss (secs) {
  var minutes = Math.floor(secs / 60)
  secs = secs % 60
  var hours = Math.floor(minutes / 60)
  minutes = minutes % 60

  if (hours >= 1) {
    return hours + 'h ' + minutes + 'm ' + secs + 's'
  } else if (hours < 1 && minutes >= 1) {
    return minutes + 'm ' + secs + 's'
  } else if (hours < 1 && minutes < 1) {
    return secs + 's'
  }
}

$(document).ready(function(){
    $("button").click(function(){
        $(".welcome").remove();
    });
});
