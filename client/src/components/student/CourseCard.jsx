import { useContext } from 'react'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'
import { Link } from 'react-router-dom'

const CourseCard = ({course}) => {
  const {currency, calculateRating} = useContext(AppContext)
  const courseRatings = course.courseRatings || []
  return (
    <Link to={'/course/' + course._id} onClick={()=>scrollTo(0,0)} 
    className='border border-gray-500/30 overflow-hidden rounded-lg bg-white shadow-sm transition hover:shadow-md'>
      <img className='w-full aspect-video object-cover bg-gray-100' src={course.courseThumbnail} alt="courseThumbnail" />
      <div className='p-3 text-left'>
        <h3 className='text-base font-semibold line-clamp-2 min-h-12'>{course.courseTitle}</h3>
        {/* <p className='text-gray-500'>{course.educator.name}</p> */}
        
        <div className='flex items-center space-x-2'>
          <p>{calculateRating(course)}</p>
          <div className='flex'>
            {[...Array(5)].map((_,i)=>(
              <img className='w-3.5 h-3.5' key={i} src={i<Math.floor(calculateRating(course)) ? assets.star : assets.star_blank} alt='star' />
            ))}
          </div>
          <p className='text-gray-500'>{courseRatings.length}</p>
        </div>
        <p className='text-base font-semibold text-gray-800'>{currency} {(course.coursePrice - course.discount * course.coursePrice / 100).toFixed(2)}</p>
      </div>
    </Link>
  )
}

export default CourseCard
