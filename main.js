{
  init: function(elevators, floors) {
    // Handle elevators.
    _.each(elevators, function(elevator) {
      elevator.on("idle", function() {
        var nextFloor = Math.floor(floors.length / 2);
        elevator.goToFloor(nextFloor);
      });
      elevator.on("floor_button_pressed", function(floorNum) {
        elevator.goToFloor(floorNum);
      });
      elevator.on("passing_floor", function(floorNum, direction) {
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
