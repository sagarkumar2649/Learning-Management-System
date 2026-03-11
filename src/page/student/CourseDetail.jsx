import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import Loading from './../../components/student/Loading';
import { assets } from '../../assets/assets';

function CourseDetail() {
  const {id}=useParams();
  const [CourseData,setCourseData]=useState(null);

  const {allCourses,calculateRating}=useContext(AppContext);

  const fetchCourseData= async()=>{
    const findCourse = allCourses.find(course=> course._id===id);
    setCourseData(findCourse);
  };

  useEffect(()=>{
    fetchCourseData();
  },[allCourses,id]);

  return CourseData ? (
    <>
    <div className='flex md:flex-row flex-col-reverse gap-10 relative items-start justify-between md:px-36 px-8 md:pt-30 pt-20 text-left'>

        <div className='absolute top-0 left-0 w-full h-section-height -z-1 bg-gradient-to-b from-cyan-100/70'></div>

        {/* left column */}
       <div className='max-w-xl z-10 text-gray-500'>
      <h1 className='md:text-course-details-heading-large text-course-details-heading-small font-semibold text-gray-800'>{CourseData.courseTitle}</h1>
      <p className='pt-4 md:text-base text-sm'
      dangerouslySetInnerHTML={{__html:CourseData.courseDescription.slice(0,200)}}></p>

      {/* reviews and ratings */}
       <div className="flex items-center space-x-2 pt-3 pb-1 text-sm">
                  <p>{calculateRating(CourseData)}</p>
                  <div className="flex">
                    {[...Array(5)].map((_,i)=>(<img key={i} src={i<Math.floor(calculateRating(CourseData)) ? assets.star : assets.star_blank} alt="" className="w-3.5 h-3.5"/>) )}
                  </div>
                  <p className="text-blue-600">({CourseData.courseRatings.length}  {CourseData.courseRatings.length > 1 ?'ratings' : 'rating'})</p>

                  <p>{CourseData.enrolledStudents.length} {CourseData.enrolledStudents.length > 1 ?'students': 'student'} </p>
              </div>
            
       </div>

        {/* right column */}
        <div>

        </div>
    </div>
    </>
  ):<Loading/>
}

export default CourseDetail
