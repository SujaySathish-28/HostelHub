const StatsCard = ({ title, value, subtitle, icon, accent = 'from-sky-500 to-blue-600' }) => {
  // Map accent to icon color class
  const getIconClass = (accent) => {
    if (accent.includes('sky')) return 'icon-sky';
    if (accent.includes('amber')) return 'icon-amber';
    if (accent.includes('emerald')) return 'icon-emerald';
    if (accent.includes('violet')) return 'icon-violet';
    if (accent.includes('rose')) return 'icon-rose';
    if (accent.includes('indigo')) return 'icon-indigo';
    return 'icon-sky';
  };

  const iconClass = getIconClass(accent);

  return (
    <article className="stat-card">
      <div className="stat-card-header">
        <div className="stat-card-content">
          <p className="stat-card-title">{title}</p>
          <p className="stat-card-value">{value}</p>
        </div>
        <span className={`stat-card-icon ${iconClass}`}>
          <span className="text-lg">{icon}</span>
        </span>
      </div>
      <p className="stat-card-description">{subtitle}</p>
    </article>
  );
};

export default StatsCard;
