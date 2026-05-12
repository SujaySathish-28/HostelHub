const ChartSection = ({ data = {} }) => {
  const max = Math.max(...(data.series || [0]));

  const average = data.series?.reduce((sum, value) => sum + value, 0) / (data.series?.length || 1);
  const totalAdmissions = data.series?.reduce((sum, value) => sum + value, 0) || 0;

  return (
    <article className="dashboard-article chart-section-card">
      <div className="article-header">
        <div className="article-title-section">
          <h2 className="article-title">{data.title}</h2>
          <p className="article-subtitle">{data.subtitle}</p>
        </div>
        <span className="article-badge">{data.series?.length || 0} days</span>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.7fr_1fr]">
        <div className="space-y-5">
          <div className="dashboard-card-grid">
            <div className="mini-stat-card">
              <p className="mini-stat-label">Total admissions</p>
              <p className="mini-stat-value">{totalAdmissions}</p>
            </div>
            <div className="mini-stat-card">
              <p className="mini-stat-label">Average attendance</p>
              <p className="mini-stat-value">{Math.round(average)}%</p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {data.labels?.map((label, index) => (
              <div key={label} className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-center shadow-sm transition hover:border-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:hover:border-slate-600">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">{label}</p>
                <p className="mt-4 text-2xl font-semibold text-slate-900 dark:text-white">{data.series?.[index]}%</p>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-summary-card">
          <div className="chart-summary-title">Weekly performance</div>
          <div className="chart-summary-text">Admissions and attendance trends show healthy growth across the week. Keep an eye on the midweek peak and plan outreach before the weekend.</div>

          <div className="mt-6 space-y-4">
            {data.series?.map((value, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                  <span>{data.labels?.[index]}</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{value}%</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600"
                    style={{ width: `${(value / max) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
};

export default ChartSection;
