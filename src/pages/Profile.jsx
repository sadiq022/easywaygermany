import { useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { supabase } from '../supabase'
import { useAuth } from '../context/AuthContext'
import SEOHead from '../components/SEOHead'

export default function Profile() {
  const { user, profile, setProfile } = useAuth()
  const [name, setName] = useState(profile?.name || '')
  const [savingName, setSavingName] = useState(false)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [savingPassword, setSavingPassword] = useState(false)
  const [showPw, setShowPw] = useState(false)

  async function handleSaveName(e) {
    e.preventDefault()
    if (!name.trim()) { toast.error('Name cannot be empty.'); return }
    setSavingName(true)
    const { error } = await supabase
      .from('profiles')
      .update({ name: name.trim() })
      .eq('id', user.id)
    if (error) {
      toast.error('Failed to update name.')
    } else {
      setProfile(p => ({ ...p, name: name.trim() }))
      toast.success('Name updated!')
    }
    setSavingName(false)
  }

  async function handleChangePassword(e) {
    e.preventDefault()
    if (newPassword.length < 6) { toast.error('Password must be at least 6 characters.'); return }
    if (newPassword !== confirmPassword) { toast.error('Passwords do not match.'); return }
    setSavingPassword(true)
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) {
      toast.error('Failed to update password: ' + error.message)
    } else {
      toast.success('Password updated!')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    }
    setSavingPassword(false)
  }

  return (
    <>
      <SEOHead title="My Profile" />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-8">
            <Link to="/dashboard" className="text-gray-500 hover:text-primary flex items-center gap-1 text-sm">
              <span className="material-icons-round text-base">arrow_back</span>
              Back to Dashboard
            </Link>
          </div>

          <h1 className="font-serif text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

          {/* Account info */}
          <div className="bg-white rounded-2xl shadow-card p-6 mb-6">
            <h2 className="font-semibold text-gray-900 mb-1">Account Info</h2>
            <p className="text-sm text-gray-500 mb-5">Your email address cannot be changed.</p>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-5">
              <span className="material-icons-round text-gray-400">mail</span>
              <span className="text-sm text-gray-700">{user?.email}</span>
            </div>
            <form onSubmit={handleSaveName} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors"
                  placeholder="Your full name"
                />
              </div>
              <button
                type="submit"
                disabled={savingName}
                className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary-dark transition-colors disabled:opacity-60">
                {savingName ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <span className="material-icons-round text-base">save</span>}
                Save Name
              </button>
            </form>
          </div>

          {/* Change password */}
          <div className="bg-white rounded-2xl shadow-card p-6">
            <h2 className="font-semibold text-gray-900 mb-1">Change Password</h2>
            <p className="text-sm text-gray-500 mb-5">Choose a strong password with at least 6 characters.</p>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors pr-11"
                    placeholder="New password"
                  />
                  <button type="button" onClick={() => setShowPw(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700">
                    <span className="material-icons-round text-base">{showPw ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <input
                  type={showPw ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors"
                  placeholder="Confirm new password"
                />
              </div>
              <button
                type="submit"
                disabled={savingPassword}
                className="flex items-center gap-2 bg-gray-900 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-700 transition-colors disabled:opacity-60">
                {savingPassword ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <span className="material-icons-round text-base">lock</span>}
                Update Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
