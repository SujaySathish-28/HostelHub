const StudentsTable = ({ students = [] }) => {
  const totalStudents = students.length;
  const activeCount = students.filter((student) => student.status === 'Active').length;
  const needsReview = students.filter((student) => student.status !== 'Active').length;

  return (
    <article className="dashboard-article">
      <div className="article-header">
        <div className="article-title-section">
          <h2 className="article-title">Student Overview</h2>
          <p className="article-subtitle">Top students based on admissions and hostel status</p>
        </div>
        <span className="article-badge">{totalStudents} students</span>
      </div>

      <div className="table-summary-row">
        <span className="table-summary-pill">Total {totalStudents}</span>
        <span className="table-summary-pill">Active {activeCount}</span>
        <span className="table-summary-pill">Needs review {needsReview}</span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 dark:bg-slate-950 dark:text-slate-400">
            <tr>
              <th className="px-4 py-3">Student ID</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Year</th>
              <th className="px-4 py-3">Room</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {students.map((student) => (
              <tr key={student.id} className="hover:bg-slate-50 dark:hover:bg-slate-950/50">
                <td className="px-4 py-4 font-semibold text-slate-800 dark:text-slate-200">{student.id}</td>
                <td className="px-4 py-4 text-slate-600 dark:text-slate-300">{student.name}</td>
                <td className="px-4 py-4 text-slate-600 dark:text-slate-300">{student.year}</td>
                <td className="px-4 py-4 text-slate-600 dark:text-slate-300">{student.room}</td>
                <td className="px-4 py-4">
                  <span className={`student-status-pill ${
                    student.status === 'Active' ? 'status-active' : student.status === 'Pending Dues' ? 'status-warning' : 'status-alert'
                  }`}>
                    {student.status}
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

export default StudentsTable;
