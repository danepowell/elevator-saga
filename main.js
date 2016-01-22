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
        queue = [];
        var pressedFloors = elevator.getPressedFloors();
        var currentFloor = elevator.currentFloor();

        // Fix initialization.
        if (elevator.goingUpIndicator() && elevator.goingDownIndicator()) {
          elevator.goingDownIndicator(false);
        }
        
        // Scan for prograde passengers heading prograde.
        _.each(floors, function(floor) {
          // Scan for disembarking passengers
          if (pressedFloors.indexOf(floor.floorNum()) > -1) {
            queue.push(floor.floorNum());
          }

          if (elevator.loadFactor() == 1) {
            elevator.destinationQueue = queue;
            elevator.checkDestinationQueue();
            return;
          }
          
          // Scan for embarking passengers.
          var goingUp = elevator.goingUpIndicator() && floor.floorNum() >= currentFloor && floor.buttonStates.up;
          var goingDown = elevator.goingDownIndicator() && floor.floorNum() <= currentFloor && floor.buttonStates.down;
          if (goingUp || goingDown) {
            queue.push(floor.floorNum());
          }
        });

        // Flip queue if going down.
        if (elevator.goingDownIndicator()) {
          queue.reverse();
        }

        // If no passengers, scan for prograde passengers heading retrograde.
        if (queue.length == 0) {
          _.each(floors, function(floor) {
            var goingUp = elevator.goingUpIndicator() && floor.floorNum() >= currentFloor && floor.buttonStates.down;
            var goingDown = elevator.goingDownIndicator() && floor.floorNum() <= currentFloor && floor.buttonStates.up;
            if (goingUp || goingDown) {
              queue.push(floor.floorNum());
            }
          });

          // Flip queue if going up.
          if (elevator.goingUpIndicator()) {
            queue.reverse();
          }

          // Check if we're arriving at a floor and reverse direction.
          if (queue.length > 0) {
            if (queue[0] == currentFloor) {
              flipIndicators();
            }
          }
        }

        // If still no passengers, look for retrograde passengers heading prograde.
        if (queue.length == 0) {
          _.each(floors, function(floor) {
            var goingUp = elevator.goingUpIndicator() && floor.floorNum() <= currentFloor && floor.buttonStates.up;
            var goingDown = elevator.goingDownIndicator() && floor.floorNum() >= currentFloor && floor.buttonStates.down;
            if (goingUp || goingDown) {
              queue.push(floor.floorNum());
            }
          });

          // Flip queue if going down.
          if (elevator.goingDownIndicator()) {
            queue.reverse();
          }

          flipIndicators();
        }

        if (queue.length == 0) {
          // Guess we are truly idle.
          elevator.goingUpIndicator(true);
          elevator.goingDownIndicator(false);
        }

        elevator.destinationQueue = queue;
        elevator.checkDestinationQueue();

        function flipIndicators() {
          if (elevator.goingUpIndicator()) {
            elevator.goingUpIndicator(false);
            elevator.goingDownIndicator(true);
          }
          else {
            elevator.goingUpIndicator(true);
            elevator.goingDownIndicator(false);
          }
        }
      });
    }
  },
  update: function(dt, elevators, floors) {
    // We normally don't need to do anything here
  }
}
