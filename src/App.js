import React, {useState} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { SideBar } from './Components/SideBar';
import { Header } from './Components/Header';
import { AddTask } from './Components/AddTask';
import { Provider } from 'react-redux';
import store from './redux/store';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  const [isSidebarShrunk, setIsSidebarShrunk] = useState(false)

  function toggleSidebar(){
    setIsSidebarShrunk(!isSidebarShrunk)
  }
  return (
    <Router>
      <Provider store={store}>
        <div className='container'>
          <div className='row'>
            <Header
              isSidebarShrunk={isSidebarShrunk}
              toggleSidebar={toggleSidebar}
            />
          </div>
          <div className='row'>
            <div className={`sidebar ${isSidebarShrunk ? 'shrink col-4' : 'col-4 col-lg-1'}`}>
              <SideBar
                isSidebarShrunk={isSidebarShrunk}
                toggleSidebar={toggleSidebar}
              />
            </div>
            <div className= {isSidebarShrunk ? 'col-11' : 'col-11 col-width'}>
              <Routes>
                <Route path='/tracker' element={<AddTask/>}></Route>
              </Routes>
            </div>
          </div>
        </div> 
      </Provider>
    </Router>
  );
}

export default App;
