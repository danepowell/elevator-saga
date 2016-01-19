{
  init: function(elevators, floors) {
    // Handle elevators.
    _.each(elevators, function(elevator) {
      elevator.on("stopped_at_floor", function(floorNum) {
        sortQueue(elevator);
      });
      elevator.on("floor_button_pressed", function(floorNum) {
        elevator.goToFloor(floorNum);
        sortQueue(elevator);
      });
      elevator.on("passing_floor", function(floorNum, direction) {
        sortQueue(elevator);
      });
    });

    // Handle floors.
    _.each(floors, function(floor) {
      floor.on("up_button_pressed", function() {
        _.each(elevators, function(elevator) {
          elevator.goToFloor(floor.floorNum());
        });
      })
      floor.on("down_button_pressed", function() {
        _.each(elevators, function(elevator) {
          elevator.goToFloor(floor.floorNum());
        });
      })
    });

    function sortQueue(elevator) {
      // TODO: Rebuild this queue in a completely different way - go through
      // each floor and see if it's requested and in the correct direction.
      var floorNum = elevator.currentFloor();
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
    }

    function sortNumber(a,b) {
      return a - b;
    }

  },
  update: function(dt, elevators, floors) {
    // We normally don't need to do anything here
  }
}
