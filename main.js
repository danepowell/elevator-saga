{
  init: function(elevators, floors) {
    // Handle elevators.
    _.each(elevators, function(elevator) {
      elevator.on("idle", function() {
        var nextFloor = (elevator.currentFloor() + 1) % floors.length;
        elevator.goToFloor(nextFloor);
      });
      elevator.on("floor_button_pressed", function(floorNum) {
        elevator.goToFloor(floorNum);
      });
      elevator.on("passing_floor", function(floorNum, direction) {
        var queue = elevator.destinationQueue;
        // Need to do something with this queue...
        elevator.destinationQueue = queue;
        elevator.checkDestinationQueue();
      });
    });

    // Handle floors.
    _.each(floors, function(floor) {
      floor.on("up_button_pressed", function() {
        var elevatorIndex = Math.floor(Math.random() * elevators.length);
        elevators[elevatorIndex].goToFloor(floor.floorNum());
      })
      floor.on("down_button_pressed", function() {
        var elevatorIndex = Math.floor(Math.random() * elevators.length);
        elevators[elevatorIndex].goToFloor(floor.floorNum());
      })
    });
  },
  update: function(dt, elevators, floors) {
    // We normally don't need to do anything here
  }
}
