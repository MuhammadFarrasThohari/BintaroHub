import { useParams } from 'react-router'

const ForumHighlights = () => {
  const { namatopik } = useParams()  // Get the topic name from the URL

  // Capitalize the first letter for better formatting (optional)
  const formatTopic = topic => {
    if (!topic) return 'Forum Highlights'
    return topic.charAt(0).toUpperCase() + topic.slice(1)
  }

  return (
    <main>
      <h1 className="uppercase">
        {formatTopic(namatopik)}
      </h1>

      {/* Render posts or content based on the selected topic */}
    </main>
  )
}

export default ForumHighlights
