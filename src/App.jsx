import React from 'react'
import { Routes, Route, useMatch } from "react-router-dom";
import Home from './page/student/Home'
import CourseList from './page/student/CourseList'
import CourseDetail from './page/student/CourseDetail'
import MyEnrollments from './page/student/MyEnrollments'
import Player from './page/student/Player'
import Loading from './components/student/Loading'
import Educator from './page/educator/Educator'
import Dashboard from './page/educator/Dashboard';
import AddCourse from './page/educator/AddCourse';
import MyCourses from './page/educator/MyCourses';
import StudentsEnrolled from './page/educator/StudentsEnrolled';
import Navbar from './components/student/Navbar';


const App = () => {
  const isEducatorRoute = useMatch('/educator/*')
  return (
    <div className='text-default min-h-screen bg-white'>
      {!isEducatorRoute && <Navbar/>}
      
      <Routes>
        
        <Route path='/' element={<Home/>}/>
        <Route path='/course-list' element={<CourseList/>}/>
        <Route path='/course-list/:input' element={<CourseList/>}/>

        <Route path='/course/:id' element={<CourseDetail/>}/>
        <Route path='/my-enrollments' element={<MyEnrollments/>}/>
        <Route path='/player/:courseId' element={<Player />}/>
        <Route path='/loading/:path' element={<Loading />}/>

        <Route path='/educator' element={<Educator/>}>
           <Route path='educator' element={<Dashboard/>}/>
           <Route path='add-course' element={<AddCourse/>}/>
           <Route path='my-courses' element={<MyCourses/>}/>
          <Route path='student-enrolled' element={<StudentsEnrolled/>}/>

        </Route>
      </Routes>
    </div>
  )
}

export default App
