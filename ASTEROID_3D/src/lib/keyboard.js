

window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);

var spaceAllowed = true;
function FullScreen() {
    if (THREEx.FullScreen.activated()) {
        THREEx.FullScreen.cancel();
    } else {
        THREEx.FullScreen.request();
    }
  }

  function Help(){
     if (document.getElementById("helpgame").style.visibility === "hidden") {
            document.getElementById("helpgame").style.visibility = "visible";
    } else if (document.getElementById("helpgame").style.visibility === "visible") {
            document.getElementById("helpgame").style.visibility = "hidden";
    } else { 
            } 
    }

    function ScreenShoot(){

    var dataUrl = renderer.domElement.toDataURL("image/jpeg");
                        var iframe = "<iframe width='100%' height='100%' src='" + dataUrl + "'></iframe>";
                        var x = window.open();
                        x.document.write(iframe);
                        x.document.close();
    }


function toggleSound() {
  soundOn = !soundOn;
}

function togglePause() {
  isPaused = !isPaused;
}

var Key = {
  _pressed: {},

  LEFT: 37,
  RIGHT: 39,
  SPACE: 32,
  ENTER: 13,
  M: 77,
  P: 80,
  F: 70,
  H: 72,
  P: 80,
  I: 73,
  K: 75,
  S: 83,
  
  isDown: function(keyCode) {
    return this._pressed[keyCode];
  },
  
  onKeydown: function(event) {
    if (inPlay) {
      this._pressed[event.keyCode] = true;
      if (event.keyCode == Key.SPACE) {
        if (spaceAllowed && !isPaused) {
          shipFiring();
          spaceAllowed = false;
        }
      }
    }
  },
  
  onKeyup: function(event) {
    if (event.keyCode == Key.SPACE && inPlay && !isPaused) {
      spaceAllowed = true;
    } else if (event.keyCode == Key.ENTER && !inPlay && isLoaded) {
      startGame();
    } else if (event.keyCode == Key.M) {
      toggleSound();
    } else if (event.keyCode == Key.P) {
      togglePause(); 
    }
    else if(event.keyCode == Key.H){
       Help();
    }
    else if(event.keyCode == Key.F){

      FullScreen();
    }
     else if(event.keyCode == Key.K){

      killAll();
      updateScore();
    }
    else if(event.keyCode == Key.I){

      DelayInvincible();
      var inv = document.getElementById(" Activation");
      inv.textContent = "INVICIBLE MODE !";
    }
    else if(event.keyCode == Key.S){
      ScreenShoot()
    }
    delete this._pressed[event.keyCode];
  }




};
