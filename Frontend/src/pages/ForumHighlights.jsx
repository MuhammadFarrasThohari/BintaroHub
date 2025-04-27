import { useParams } from 'react-router'
import { IoPinSharp } from "react-icons/io5";

import SmallNews from '../components/SmallNews';
import rwbimg from '../assets/dummyImg/911RWB.jpg' 

const ForumHighlights = () => {
  const { namatopik } = useParams()  // Get the topic name from the URL

  // Capitalize the first letter for better formatting (optional)
  const formatTopic = topic => {
    if (!topic) return 'Forum Highlights'
    return topic.charAt(0).toUpperCase() + topic.slice(1)
  }

  const truncatePerChar = (text, length = 100) => {
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
  }

  const truncatePerWord = (text, wordLimit = 10) => {
    const words = text.split(' ');
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(' ') + '...';
  }


  return (
    <main className=' mx-16 my-4'>
      <h1 className="uppercase ">
        {formatTopic(namatopik)}
      </h1>

      {/* Render posts or content based on the selected topic */}
      <section className='grid grid-cols-5 gap-2 my-6'>
        <div className=' bg-allBlue col-span-3 min-h-96'>
          <h1> Huge one</h1>
        </div>

        <div className=' col-span-2 flex-col flex gap-2'>
          
          <SmallNews 
            image={rwbimg} 
            location="Sektor 1, Bintaro" 
            title="The longest word in any of the major English..." 
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent commodo cursus magna, vel scelerisque nisl consectetur et."
          />
          <SmallNews 
            image={rwbimg} 
            location="Sektor 1, Bintaro" 
            title="The longest word in any of the major English..." 
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent commodo cursus magna, vel scelerisque nisl consectetur et."
          />
          <SmallNews 
            image={rwbimg} 
            location="Sektor 1, Bintaro" 
            title="The longest word in any of the major English..." 
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent commodo cursus magna, vel scelerisque nisl consectetur et."
          />
          
          
        </div>
        
      </section>
    </main>
  )
}

export default ForumHighlights
