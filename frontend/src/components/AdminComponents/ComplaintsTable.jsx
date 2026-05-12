const ComplaintsTable = ({ complaints = [] }) => {
  const openCount = complaints.filter((complaint) => complaint.status === 'Open').length;
  const resolvedCount = complaints.filter((complaint) => complaint.status === 'Resolved').length;

  return (
    <article className="dashboard-article">
      <div className="article-header">
        <div className="article-title-section">
          <h2 className="article-title">Recent Complaints</h2>
          <p className="article-subtitle">Monitor the newest complaints and their progress</p>
        </div>
        <span className="article-badge">{complaints.length} active</span>
      </div>

      <div className="table-summary-row">
        <span className="table-summary-pill">Open {openCount}</span>
        <span className="table-summary-pill">Resolved {resolvedCount}</span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 dark:bg-slate-950 dark:text-slate-400">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Student</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Room</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {complaints.map((complaint) => (
              <tr key={complaint.id} className="hover:bg-slate-50 dark:hover:bg-slate-950/50">
                <td className="px-4 py-4 font-semibold text-slate-800 dark:text-slate-200">{complaint.id}</td>
                <td className="px-4 py-4 text-slate-600 dark:text-slate-300">{complaint.student}</td>
                <td className="px-4 py-4 text-slate-600 dark:text-slate-300">{complaint.category}</td>
                <td className="px-4 py-4 text-slate-600 dark:text-slate-300">{complaint.room}</td>
                <td className="px-4 py-4">
                  <span className={`complaint-status-pill ${
                    complaint.status === 'Resolved' ? 'status-resolved' : complaint.status === 'Open' ? 'status-open' : 'status-assigned'
                  }`}>
                    {complaint.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
};

export default ComplaintsTable;
