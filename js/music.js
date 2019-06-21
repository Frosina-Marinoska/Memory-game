let searchButton = document.getElementById("search");
let inputField = document.getElementById("input");
let soundcloudElement = document.getElementById("soundcloud");

// Globalni promenlivi

let client_id = "9kBUwwrRTbFmi1IGN5qGBOoS4E57Oex7"; 
let user = "frosina-marinoska";
let user_id;




// Dodava widget vo browser so izbranata pesna.
 
function search() {
  let track = inputField.value;

  let track_url = "https://soundcloud.com/" + user + "/" + track;

  SC.oEmbed(track_url, { auto_play: true })
    .then(function(oEmbed) {
      soundcloudElement.innerHTML = oEmbed.html;
    });
}

// Inicijalizacija

SC.initialize({ client_id: client_id });

resolve(user, function(id) {
  tracks(id, function(tracks) {
    $("#input").autocomplete({
      source: tracks
    });
  });
});


//  Go razresuva user id spored imeto.

function resolve(user, callback) {
  SC.get("/resolve", { url: "https://soundcloud.com/" + user})
    .then(function(resp) { callback(resp.id); });
}

  // Gi lista site pesni od daden user id.
 
function tracks(id, callback) {
  SC.get("/tracks", { user_id: id, limit: 100})
    .then(function(resp) { callback(resp.map(value => value.permalink)) });  
}



