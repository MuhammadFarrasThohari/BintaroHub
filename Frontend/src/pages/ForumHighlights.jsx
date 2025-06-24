import { useParams } from 'react-router'
import { IoPinSharp, IoLocationOutline } from "react-icons/io5";
import { CiLocationOn } from "react-icons/ci"

import SmallNews from '../components/SmallNews';

// images-logo
import rwbimg from '../assets/dummyImg/911RWB.jpg' 
import BHLogo from '../assets/Logo/BHub-Logo.png'

const ForumHighlights = () => {
  const { namatopik } = useParams()  // Get the topic name from the URL

  // Capitalize the first letter for better formatting (optional)
  const formatTopic = topic => {
    if (!topic) return 'Highlighted forums';
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
    <main className=' mx-16 '>
      <h1 className="uppercase ">
        {formatTopic(namatopik)}
      </h1>

      {/* Render posts or content based on the selected topic */}
      <section className='grid grid-cols-5 gap-2 my-6'>
        <article class='col-span-3 min-h-80'>
          <figure>
            <img class='object-cover w-full h-72 rounded-t-md' src={rwbimg} alt='hero' />
            </figure>
          <div class='p-6 bg-forumBox rounded-b-md flex flex-col gap-2'>
            <header class='flex items-center justify-between'>
              <div class='flex items-center space-x-1'>
                <img class='object-contain size-4 ' src={BHLogo} alt='BintaroHub Logo' />
                <h2 class='text-sm font-lsRegular'>
                  Berita Lokal
                  <span class='text-allBlue'>—Lalu Lintas</span>
                </h2>
                <address class='flex items-center space-x-1 ml-4'>
                  <IoLocationOutline class='text-subhead text-base' />
                  <p class='font-lsRegular text-sm'>Sektor 7</p>
                </address>
              </div>
              <time class='text-sm font-lsLight' datetime='2025-06-23T17:54:58-07:00'>4hrs ago</time >
            </header>
            <div>
              <h2 class='text-2xl font-lsRegular'>
                The longest word in any of the major English...
              </h2>
              <p>
                {truncatePerWord(
                  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent commodo cursus magna, vel scelerisque nisl consectetur et.',
                  10
                )}
              </p>
            </div>
          </div>
        </article>

        <div className=' col-span-2 flex-col flex gap-2'>
          <article className=' bg-allWhite p-4 rounded-md shadow-md'>
            <p> TEst</p>  
          </article>
          
          {/* <SmallNews 
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
          /> */}
          
          
        </div>
        
      </section>
     
    </main>
  )
}

export default ForumHighlights
