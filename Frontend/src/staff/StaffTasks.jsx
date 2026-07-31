import { useEffect, useState, useCallback } from 'react'
import StaffLayout from './StaffLayout.jsx'
import { fetchStaffTasks, completeStaffTask } from '../api.js'

export default function StaffTasks() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionLoading, setActionLoading] = useState(null)

  const loadTasks = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await fetchStaffTasks()
      setTasks(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message)
      setTasks([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadTasks()
  }, [loadTasks])

  const handleMarkComplete = async (id) => {
    setActionLoading(id)
    setError('')
    try {
      await completeStaffTask(id)
      loadTasks()
    } catch (err) {
      setError(err.message)
    } finally {
      setActionLoading(null)
    }
  }

  const statusClass = (s) => {
    if (s === 'COMPLETED') return 'bb-status bb-status--ok'
    return 'bb-status bb-status--warn'
  }

  const priorityClass = (p) => {
    if (p === 'HIGH') return 'bb-status bb-status--danger'
    if (p === 'LOW') return 'bb-status bb-status--ok'
    return 'bb-status bb-status--warn'
  }

  return (
    <StaffLayout>
      <div className="bb-main-content">
        <div className="bb-page-header">
          <div>
            <h1 className="bb-page-title">My Tasks</h1>
            <p className="bb-page-subtitle">
              View and manage tasks assigned to you
            </p>
          </div>
        </div>

        {error && (
          <div
            className="bb-card bb-card-body"
            style={{ borderColor: 'rgba(239, 68, 68, 0.35)', marginBottom: 14 }}
          >
            <div className="bb-strong" style={{ color: '#dc2626' }}>{error}</div>
          </div>
        )}

        <div className="bb-card bb-card--tight">
          <div className="bb-table-wrap">
            <table className="bb-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Priority</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} style={{ textAlign: 'center', padding: 30, color: '#64748b', fontWeight: 700 }}>Loading...</td></tr>
                ) : tasks.length === 0 ? (
                  <tr><td colSpan={6} style={{ textAlign: 'center', padding: 30, color: '#64748b', fontWeight: 700 }}>No tasks assigned to you</td></tr>
                ) : (
                  tasks.map((task) => (
                    <tr key={task.taskId}>
                      <td style={{ fontWeight: 900 }}>{task.title}</td>
                      <td style={{ maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {task.description || '—'}
                      </td>
                      <td><span className={priorityClass(task.priority)}>{task.priority}</span></td>
                      <td>{task.dueDate || '—'}</td>
                      <td>
                        <span className={statusClass(task.status)}>
                          {task.status === 'COMPLETED' ? '✅ Completed' : task.status}
                        </span>
                      </td>
                      <td>
                        {task.status === 'PENDING' ? (
                          <button
                            className="bb-link-btn"
                            onClick={() => handleMarkComplete(task.taskId)}
                            disabled={actionLoading === task.taskId}
                            style={{
                              background: actionLoading === task.taskId
                                ? 'rgba(16,185,129,0.2)'
                                : 'rgba(16,185,129,0.1)',
                              color: '#059669',
                              borderColor: 'rgba(16,185,129,0.3)'
                            }}
                          >
                            {actionLoading === task.taskId ? 'Processing...' : 'Mark as Completed'}
                          </button>
                        ) : (
                          <span className="bb-status bb-status--ok" style={{ fontSize: 12 }}>
                            Completed
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </StaffLayout>
  )
}

