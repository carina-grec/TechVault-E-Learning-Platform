export function MascotBubble({ mascot, mood = 'idle', message }) {
  if (!mascot) return null
  const palette = {
    idle: '#ffffff',
    thinking: '#f7c746',
    success: '#5ed27a',
    pending: '#ff7ad9',
  }
  const emojiMap = {
    idle: '*',
    thinking: '?',
    success: '!',
    pending: '...',
  }
  const bubbleColor = palette[mood] ?? '#ffffff'
  const fallback = `${mascot.name ?? 'Mascot'} says hi!`
  return (
    <div className="mascot-bubble" style={{ borderColor: bubbleColor }}>
      <div className="mascot-avatar" style={{ background: bubbleColor }}>
        {emojiMap[mood] ?? '*'}
      </div>
      <div>
        <strong>{mascot.name}</strong>
        <p>{message ?? mascot.description ?? fallback}</p>
      </div>
    </div>
  )
}
