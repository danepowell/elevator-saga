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
        var floorWeights = [];
        var pressedFloors = elevator.getPressedFloors();
        var currentFloor = elevator.currentFloor();
        elevator.destinationQueue = [];
        _.each(floors, function(floor) {
          var pressedWeight = 0;
          if (pressedFloors.indexOf(floor.floorNum()) > -1) {
            pressedWeight = 1;
          }

          var loadWeight = 1 - ((1 - pressedWeight) * elevator.loadFactor());

          var calledWeight = 0;
          if (floor.buttonStates.up || floor.buttonStates.down) {
            calledWeight = 1;
          }

          var distanceWeight = 1 - (Math.abs(currentFloor - floor.floorNum()) / floors.length);

          var floorWeight = (pressedWeight + calledWeight + distanceWeight) * loadWeight;
          floorWeights.push(floorWeight);
        });

        var bestFloor = floorWeights.indexOf(Math.max.apply(Math, floorWeights));

        if (bestFloor > -1) {
          elevator.destinationQueue.push(bestFloor);
          elevator.checkDestinationQueue();
        }
      });
    }
  },
  update: function(dt, elevators, floors) {
    // We normally don't need to do anything here
  }
}
