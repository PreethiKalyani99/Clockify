import React, {useState} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { SideBar } from './Components/SideBar';
import { Header } from './Components/Header';
import { AddTask } from './Components/AddTask';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';

function App() {
  const {isModalOpen} = useSelector(state => state.clockify)
  const [isSidebarShrunk, setIsSidebarShrunk] = useState(false)

  function toggleSidebar(){
    setIsSidebarShrunk(!isSidebarShrunk)
  }
  return (
    <Router>
        <div className='container'>
          <div className={isModalOpen ? 'row header' : 'row header zIndex'}>
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
            <div className= {isSidebarShrunk ? 'col-11 width-expand' : 'col-11 col-width'}>
              <Routes>
                <Route path='/tracker' element={<AddTask
                    isSidebarShrunk={isSidebarShrunk}
                />}></Route>
              </Routes>
            </div>
          </div>
        </div> 
    </Router>
  );
}

export default App;
