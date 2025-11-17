function SectionCard({ title, description, children }) {
  return (
    <div className="section-card">
      <h2>{title}</h2>
      {description && <p style={{ marginTop: 0, color: '#475569', fontSize: '0.9rem' }}>{description}</p>}
      {children}
    </div>
  );
}

export default SectionCard;
