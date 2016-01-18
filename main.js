{
  init: function(elevators, floors) {
    // Handle elevators.
    _.each(elevators, function(elevator) {
      elevator.on("idle", function() {
        // TODO: Look for more passengers in the direction I'm traveling.
        var nextFloor = Math.floor(floors.length / 2);
        elevator.goToFloor(nextFloor);
      });
      elevator.on("floor_button_pressed", function(floorNum) {
        elevator.goToFloor(floorNum);
      });
      elevator.on("passing_floor", function(floorNum, direction) {
        // TODO: Set direction indicator.
        // TODO: Check if someone on this floor is heading my direction and add to queue.
        // TODO: Reorder queue according to direction I'm traveling.
        // Should we stop at this floor?
        // First, see if someone in the elevator wants to get off.
        var pressedFloors = elevator.getPressedFloors();
        if (pressedFloors.indexOf(floorNum) != 1) {
          elevator.goToFloor(floorNum, true);
        }
        // Now see if someone on the floor is going in our direction.
        var floor = floors[floorNum];
        if ((floor.buttonStates.up && direction == "up") || (floor.buttonStates.down && direction == "down")) {
          elevator.goToFloor(floorNum, true);
        }
      });
    });

    // Handle floors.
    _.each(floors, function(floor) {
      // TODO: Don't do anything here? Unless an elevator is idle.
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
  },
  update: function(dt, elevators, floors) {
    // We normally don't need to do anything here
  }
}
