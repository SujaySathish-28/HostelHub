const LeaveRequestsTable = ({ requests = [] }) => {
  const pendingCount = requests.filter((request) => request.status === 'Pending').length;
  const approvedCount = requests.filter((request) => request.status === 'Approved').length;
  const rejectedCount = requests.filter((request) => request.status === 'Rejected').length;

  return (
    <article className="dashboard-article">
      <div className="article-header">
        <div className="article-title-section">
          <h2 className="article-title">Leave Requests</h2>
          <p className="article-subtitle">Track the current requests and approval status</p>
        </div>
        <span className="article-badge">{requests.length} pending</span>
      </div>

      <div className="table-summary-row">
        <span className="table-summary-pill">Pending {pendingCount}</span>
        <span className="table-summary-pill">Approved {approvedCount}</span>
        <span className="table-summary-pill">Rejected {rejectedCount}</span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 dark:bg-slate-950 dark:text-slate-400">
            <tr>
              <th className="px-4 py-3">Request ID</th>
              <th className="px-4 py-3">Student</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Duration</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {requests.map((request) => (
              <tr key={request.id} className="hover:bg-slate-50 dark:hover:bg-slate-950/50">
                <td className="px-4 py-4 font-semibold text-slate-800 dark:text-slate-200">{request.id}</td>
                <td className="px-4 py-4 text-slate-600 dark:text-slate-300">{request.student}</td>
                <td className="px-4 py-4 text-slate-600 dark:text-slate-300">{request.date}</td>
                <td className="px-4 py-4 text-slate-600 dark:text-slate-300">{request.duration}</td>
                <td className="px-4 py-4">
                  <span className={`request-status-pill ${
                    request.status === 'Approved' ? 'status-approved' : request.status === 'Rejected' ? 'status-rejected' : 'status-pending'
                  }`}>
                    {request.status}
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

export default LeaveRequestsTable;
