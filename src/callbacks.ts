import { Direction, Elevator, Floor } from 'lib'
import type { Queue } from 'queue'
import { assertNotStopped } from 'utils'

export const registerIdleBehavior = (queue: Queue, elevators: Elevator[]) => {
  for (let [idx, elevator] of elevators.entries()) {
    elevator.on('idle', () => {
      console.log(`[elevator:${idx}] idle. checking queue`)
      const [floors, direction] = queue.pop(elevator.currentFloor())

      if (floors.length) {
        console.log(
          `[elevator:${idx}] queueing ${floors.length} floors. Going ${direction}.`,
        )
      } else {
        console.log(`[elevator:${idx}] Queue empty. Stopping.`)
        // TODO: register with queue??
      }

      assertNotStopped(direction)
      if (direction === Direction.up) {
        elevator.goingDownIndicator(true)
      } else {
        elevator.goingDownIndicator(true)
      }

      for (let floor of floors) {
        elevator.goToFloor(floor)
      }
    })

    elevator.on('floor_button_pressed', floor => {
      if (!elevator.destinationQueue.includes(floor)) {
        // TODO: probably sort the queue here?
        console.log(`[elevator:${idx}] Adding floor ${floor} to end of queue`)
        elevator.destinationQueue.push(floor)
        elevator.checkDestinationQueue()
      }
    })
  }
}

export const registerButtonPresses = (queue: Queue, floors: Floor[]) => {
  for (let floor of floors) {
    floor.on('down_button_pressed', () => queue.push(Direction.down, floor))
    floor.on('up_button_pressed', () => queue.push(Direction.up, floor))
  }
}
