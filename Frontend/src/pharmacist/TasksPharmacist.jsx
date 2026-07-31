import { useEffect, useState, useCallback } from 'react'
import PharmacistLayout from './PharmacistLayout.jsx'
import {
  fetchPharmacistTasks,
  createPharmacistTask,
  updatePharmacistTask,
  deletePharmacistTask,
  fetchStaffUsersPharmacist,
} from '../api.js'

const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH']
const STATUSES = ['', 'PENDING', 'COMPLETED']

function TaskModal({ open, onClose, onSave, staffUsers, editTask }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [assignedToId, setAssignedToId] = useState('')
  const [priority, setPriority] = useState('MEDIUM')
  const [dueDate, setDueDate] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (editTask) {
      setTitle(editTask.title || '')
      setDescription(editTask.description || '')
      setAssignedToId(editTask.assignedToId?.toString() || '')
      setPriority(editTask.priority || 'MEDIUM')
      setDueDate(editTask.dueDate || '')
    } else {
      setTitle('')
      setDescription('')
      setAssignedToId('')
      setPriority('MEDIUM')
      setDueDate('')
    }
    setError('')
  }, [editTask, open])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim()) {
      setError('Task title is required')
      return
    }
    if (!assignedToId) {
      setError('Please assign a staff member')
      return
    }

    setSaving(true)
    setError('')
    try {
      const payload = {
        title: title.trim(),
        description: description.trim() || null,
        assignedToId: parseInt(assignedToId, 10),
        priority,
        dueDate: dueDate || null,
      }
      if (editTask) {
        await updatePharmacistTask(editTask.taskId, payload)
      } else {
        await createPharmacistTask(payload)
      }
      onSave()
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (!open) return null

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(2, 6, 23, 0.5)', backdropFilter: 'blur(2px)'
    }}>
      <div style={{
        background: '#fff', borderRadius: 16, width: 480, maxWidth: '90vw',
        boxShadow: '0 25px 50px rgba(2,6,23,0.25)', padding: 0
      }}>
        <div style={{ padding: '20px 24px 0' }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 1000 }}>
            {editTask ? 'Edit Task' : 'Create New Task'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '16px 24px 24px' }}>
          {error && (
            <div style={{
              padding: '10px 14px', background: 'rgba(239,68,68,0.1)',
              color: '#dc2626', borderRadius: 10, marginBottom: 14,
              fontSize: 13, fontWeight: 700
            }}>{error}</div>
          )}

          <div style={{ marginBottom: 14 }}>
            <label style={{ fontWeight: 900, fontSize: 13, display: 'block', marginBottom: 4 }}>
              Task Title <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <input
              type="text" value={title}
              onChange={e => setTitle(e.target.value)}
              style={{
                width: '100%', padding: '10px 12px', borderRadius: 10,
                border: '1px solid rgba(148,163,184,0.3)', fontSize: 13,
                outline: 'none', boxSizing: 'border-box'
              }}
              placeholder="Enter task title"
            />
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={{ fontWeight: 900, fontSize: 13, display: 'block', marginBottom: 4 }}>
              Description
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              style={{
                width: '100%', padding: '10px 12px', borderRadius: 10,
                border: '1px solid rgba(148,163,184,0.3)', fontSize: 13,
                outline: 'none', resize: 'vertical', boxSizing: 'border-box',
                fontFamily: 'inherit'
              }}
              placeholder="Enter description (optional)"
            />
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={{ fontWeight: 900, fontSize: 13, display: 'block', marginBottom: 4 }}>
              Assign Staff <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <select
              value={assignedToId}
              onChange={e => setAssignedToId(e.target.value)}
              style={{
                width: '100%', padding: '10px 12px', borderRadius: 10,
                border: '1px solid rgba(148,163,184,0.3)', fontSize: 13,
                outline: 'none', boxSizing: 'border-box', background: '#fff'
              }}
            >
              <option value="">Select staff member</option>
              {staffUsers.map(u => (
                <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: 14, display: 'flex', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontWeight: 900, fontSize: 13, display: 'block', marginBottom: 4 }}>
                Priority
              </label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value)}
                style={{
                  width: '100%', padding: '10px 12px', borderRadius: 10,
                  border: '1px solid rgba(148,163,184,0.3)', fontSize: 13,
                  outline: 'none', boxSizing: 'border-box', background: '#fff'
                }}
              >
                {PRIORITIES.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div style={{ flex: 1 }}>
              <label style={{ fontWeight: 900, fontSize: 13, display: 'block', marginBottom: 4 }}>
                Due Date
              </label>
              <input
                type="date" value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                style={{
                  width: '100%', padding: '10px 12px', borderRadius: 10,
                  border: '1px solid rgba(148,163,184,0.3)', fontSize: 13,
                  outline: 'none', boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 18px', borderRadius: 12, border: '1px solid rgba(148,163,184,0.3)',
                background: '#fff', fontWeight: 900, fontSize: 13, cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit" disabled={saving}
              style={{
                padding: '10px 18px', borderRadius: 12, border: 0,
                background: 'linear-gradient(180deg, #10b981, #059669)',
                color: '#fff', fontWeight: 900, fontSize: 13, cursor: 'pointer',
                opacity: saving ? 0.6 : 1
              }}
            >
              {saving ? 'Saving...' : editTask ? 'Update Task' : 'Assign Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function TasksPharmacist() {
  const [tasks, setTasks] = useState([])
  const [staffUsers, setStaffUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editTask, setEditTask] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const loadTasks = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await fetchPharmacistTasks()
      setTasks(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message)
      setTasks([])
    } finally {
      setLoading(false)
    }
  }, [])

  const loadStaff = useCallback(async () => {
    try {
      const data = await fetchStaffUsersPharmacist()
      setStaffUsers(Array.isArray(data) ? data : [])
    } catch (_) {}
  }, [])

  useEffect(() => {
    loadTasks()
  }, [loadTasks])

  useEffect(() => {
    loadStaff()
  }, [loadStaff])

  const handleDelete = async (id) => {
    try {
      await deletePharmacistTask(id)
      setDeleteConfirm(null)
      loadTasks()
    } catch (err) {
      setError(err.message)
    }
  }

  const openCreate = () => {
    setEditTask(null)
    setShowModal(true)
  }

  const openEdit = (task) => {
    if (task.status === 'COMPLETED') {
      setError('Cannot edit a completed task')
      return
    }
    setEditTask(task)
    setShowModal(true)
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
    <PharmacistLayout>
      <div className="bb-main-content">
        <div className="bb-page-header">
          <div>
            <h1 className="bb-page-title">Tasks</h1>
            <p className="bb-page-subtitle">
              Create and manage tasks assigned to staff members
            </p>
          </div>
          <div className="bb-page-actions">
            <button
              className="bb-btn bb-btn--primary"
              type="button"
              onClick={openCreate}
            >
              <span className="bb-btn-icon">+</span>
              <span>Create Task</span>
            </button>
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
                  <th>Assigned Staff</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Due Date</th>
                  <th>Created By</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={7} style={{ textAlign: 'center', padding: 30, color: '#64748b', fontWeight: 700 }}>Loading...</td></tr>
                ) : tasks.length === 0 ? (
                  <tr><td colSpan={7} style={{ textAlign: 'center', padding: 30, color: '#64748b', fontWeight: 700 }}>No tasks found</td></tr>
                ) : (
                  tasks.map((task) => (
                    <tr key={task.taskId}>
                      <td style={{ fontWeight: 900 }}>{task.title}</td>
                      <td>{task.assignedToName}</td>
                      <td><span className={priorityClass(task.priority)}>{task.priority}</span></td>
                      <td><span className={statusClass(task.status)}>{task.status}</span></td>
                      <td>{task.dueDate || '—'}</td>
                      <td>{task.createdByName}</td>
                      <td>
                        <div className="bb-table-actions">
                          <button
                            className="bb-link-btn"
                            onClick={() => openEdit(task)}
                            disabled={task.status === 'COMPLETED'}
                            title={task.status === 'COMPLETED' ? 'Cannot edit completed task' : 'Edit task'}
                          >
                            Edit
                          </button>
                          <button
                            className="bb-link-btn bb-link-btn--danger"
                            onClick={() => setDeleteConfirm(task.taskId)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <TaskModal
        open={showModal}
        onClose={() => { setShowModal(false); setEditTask(null) }}
        onSave={loadTasks}
        staffUsers={staffUsers}
        editTask={editTask}
      />

      {deleteConfirm && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(2, 6, 23, 0.5)', backdropFilter: 'blur(2px)'
        }}>
          <div style={{
            background: '#fff', borderRadius: 16, width: 380, maxWidth: '90vw',
            boxShadow: '0 25px 50px rgba(2,6,23,0.25)', padding: '24px'
          }}>
            <h3 style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 1000 }}>Confirm Delete</h3>
            <p style={{ margin: 0, color: '#64748b', fontSize: 13, fontWeight: 600 }}>
              Are you sure you want to delete this task? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
              <button
                onClick={() => setDeleteConfirm(null)}
                style={{
                  padding: '10px 18px', borderRadius: 12, border: '1px solid rgba(148,163,184,0.3)',
                  background: '#fff', fontWeight: 900, fontSize: 13, cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                style={{
                  padding: '10px 18px', borderRadius: 12, border: 0,
                  background: '#dc2626', color: '#fff', fontWeight: 900, fontSize: 13, cursor: 'pointer'
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </PharmacistLayout>
  )
}

