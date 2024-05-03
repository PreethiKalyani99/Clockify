import { AddTask } from "../Components/AddTask";
import { renderWithProviders } from "../utils/test-utils";
import { screen } from "@testing-library/react";

test('should render add task component', () => {
  renderWithProviders(
    <AddTask isSidebarShrunk={false}/>
  )
  expect(screen.getByTestId("start-time").value).toMatch(/\d\d:\d\d/)
});
