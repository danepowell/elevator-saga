{
  init: function(elevators, floors) {
    // Handle elevators.
    _.each(elevators, function(elevator) {
      elevator.on("stopped_at_floor", function(floorNum) {
        sortQueue();
      });
      elevator.on("floor_button_pressed", function(floorNum) {
        sortQueue();
      });
      elevator.on("passing_floor", function(floorNum, direction) {
        sortQueue();
      });
    });

    // Handle floors.
    _.each(floors, function(floor) {
      floor.on("up_button_pressed", function() {
        sortQueue();
      })
      floor.on("down_button_pressed", function() {
        sortQueue();
      })
    });

    function sortQueue() {
      _.each(elevators, function(elevator) {
        // If no direction set, just go to the floor.
        // Go through each floor and see if it's requested and in the correct direction.
        /**         var floorNum = elevator.currentFloor();
         if (elevator.goingUpIndicator()) {
         var prograde = elevator.destinationQueue.filter(function(x) {return x >= floorNum;});
         var retrograde = elevator.destinationQueue.filter(function(x) {return x < floorNum;});
         prograde.sort(sortNumber);
         retrograde.sort(sortNumber);
         retrograde.reverse();
         if (prograde.length == 0) {
         elevator.goingUpIndicator(false);
         elevator.goingDownIndicator(true);
         }
         }
      else {
        var prograde = elevator.destinationQueue.filter(function(x) {return x <= floorNum;});
        var retrograde = elevator.destinationQueue.filter(function(x) {return x > floorNum;});
        prograde.sort(sortNumber);
        prograde.reverse();
        retrograde.sort(sortNumber);
        if (prograde.length == 0) {
          elevator.goingUpIndicator(true);
          elevator.goingDownIndicator(false);
        }
      }
      elevator.destinationQueue = prograde.concat(retrograde);
      elevator.checkDestinationQueue();
        **/
      }
            }

    function sortNumber(a,b) {
      return a - b;
    }

  },
  update: function(dt, elevators, floors) {
    // We normally don't need to do anything here
  }
}
