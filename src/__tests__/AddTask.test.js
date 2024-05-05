import { AddTask } from "../Components/AddTask";
import { renderWithProviders } from "../utils/test-utils";
import { fireEvent, screen } from "@testing-library/react";
import timekeeper from 'timekeeper';
import reducer, {addTodayTask} from '../redux/ClockifySlice'

beforeAll(() => {
  // Lock Time
  timekeeper.freeze(new Date('2024-05-01 10:00:00'));
});

afterAll(() => {
  // Unlock Time
  timekeeper.reset();
});
test("should render add task component", () => {
  renderWithProviders(
    <AddTask isSidebarShrunk={false}/>
  )
  expect(screen.getByTestId("start-time").value).toBe("10:00")
  expect(screen.getByTestId("end-time").value).toBe("10:00")
  expect(screen.getByTestId("task-duration").value).toBe("00:00:00")
  expect(screen.getByTestId("task-name").value).toBe("")
  expect(screen.getByTestId("start-date").innerHTML).toBe("2024-05-01")
  expect(screen.getByTestId("add-task")).toBeDefined
  expect(screen.getByTestId("add-project")).toBeDefined
});

describe("StartTime", () => {
  test("should update task duration on updating start time", () => {
    renderWithProviders(
        <AddTask isSidebarShrunk={false}/>
    )
    const startTime = screen.getByTestId("start-time")

    fireEvent.change(startTime, {target: { value: "08:00"}})
    fireEvent.blur(startTime)

    expect(screen.getByTestId("task-duration").value).toBe("02:00:00")
    expect(startTime.value).toBe("08:00")
  })

  test("should update date picker's time on updating start time", () => {
  
    const initialState = {totalTasks: {}}
    renderWithProviders(
      <AddTask isSidebarShrunk={false}/>,
      {preloadedState: initialState}
    )
    const startTime = screen.getByTestId("start-time")

    fireEvent.change(startTime, {target: { value: "09:00"}})
    fireEvent.blur(startTime)

    const startTimeValue = startTime.value
    const dateString = `2024-05-01 ${startTimeValue}`

    const expectedState = {
      totalTasks: {
        '2024-05-01': [
          {
            date: '2024-05-01',
            id: 0,
            text: 'task1',
            totalTime: '01:00:00',
            project: 'p1', 
            client: 'c1',
            startTime: new Date('2024-05-01 09:00'),
            endTime: new Date('2024-05-01 10:00')
          }
        ]
      }
    }

    expect(reducer(initialState, addTodayTask({ 
      date: '2024-05-01',
      id: 0,
      text: 'task1',
      totalTime: '01:00:00',
      project: 'p1', 
      client: 'c1',
      startTime: new Date(dateString),
      endTime: new Date('2024-05-01 10:00')
    }))).toEqual(expectedState)
    
  })


  test("should update end date on changing the start time to a value greater than end time", () =>{
     
  })

  test("should show up in hh:mm format even on setting the time in integer fomat", () => {

  })

  test("should show as hours value on entering a single number in start time", () => {

  })
})
