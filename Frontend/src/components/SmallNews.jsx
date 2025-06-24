import { IoPinSharp } from "react-icons/io5";

const SmallNews = ({ image, location, title, description }) => {
  const truncatePerWord = (text, wordLimit = 10) => {
    const words = text.split(' ');
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(' ') + '...';
  }

  return (
    <div className='smallNews'>
      <img className="object-cover size-40 rounded-l-md" alt="hero" src={image} loading="lazy" />
      <div className='props'>
        <div className='kawasan'>
          <IoPinSharp />
          <p className='text-sm'>{location}</p>
        </div>
        <h4>{truncatePerWord(title, 3)}</h4>
        <p>{truncatePerWord(description, 7)}</p>
      </div>
    </div>
  );
}

export default SmallNews;
