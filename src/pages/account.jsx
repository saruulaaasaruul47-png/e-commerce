import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import HeaderMenu from '../components/header/header'
import { getCart, getCurrentUser, logoutUser, updateUserProfile } from '../api/api'
import { AUTH_CHANGE_EVENT } from '../api/authservice'

const ACCENT = '#396539'

const icons = {
  profile: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.2" />
      <path d="M2 14c0-3.314 2.686-5 6-5s6 1.686 6 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  ),
  orders: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="3" width="12" height="11" rx="2" stroke="currentColor" strokeWidth="1.2" />
      <path d="M5 3V2.5A2.5 2.5 0 0110.5 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M5 7h6M5 10h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  ),
  address: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 1.5A4.5 4.5 0 0112.5 6c0 3-4.5 8.5-4.5 8.5S3.5 9 3.5 6A4.5 4.5 0 018 1.5z" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="8" cy="6" r="1.5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  ),
  security: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="3" y="7" width="10" height="7" rx="2" stroke="currentColor" strokeWidth="1.2" />
      <path d="M5 7V5a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  ),
  logout: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3M10 11l3-3-3-3M13 8H6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
}

const NAV = [
  { id: 'profile', label: 'Profile', icon: icons.profile },
  { id: 'orders', label: 'Orders', icon: icons.orders },
  { id: 'address', label: 'Address', icon: icons.address },
  { id: 'security', label: 'Security', icon: icons.security },
]

const emptyProfile = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  birthday: '',
}

const parsePrice = (price) => {
  const value = Number.parseFloat(String(price).replace(/[^0-9.]/g, ''))
  return Number.isNaN(value) ? 0 : value
}

const formatCurrency = (value) => {
  return `$${value.toFixed(2)}`
}

const getInitials = (fullName) => {
  if (!fullName) return 'NA'
  const parts = fullName.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
}

const getNameParts = (fullName) => {
  if (!fullName) return { firstName: '', lastName: '' }
  const parts = fullName.trim().split(/\s+/).filter(Boolean)
  return {
    firstName: parts[0] || '',
    lastName: parts.slice(1).join(' '),
  }
}

function Field({ label, type = 'text', value, placeholder, onChange }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs text-[#5e6b55]">{label}</label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className="h-10 w-full rounded-lg border border-[#d4dfce] bg-[#f9fcf7] px-3 text-[13px] text-[#1a2416] outline-none focus:border-[#396539]"
      />
    </div>
  )
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-xl bg-[#f3f8ef] p-4">
      <div className="mb-1 text-xs text-[#5e6b55]">{label}</div>
      <div className="text-2xl font-medium text-[#1a2416]">{value}</div>
    </div>
  )
}

function Badge({ type, children }) {
  const styles = {
    done: 'bg-[#EAF3DE] text-[#3B6D11]',
    pending: 'bg-[#FAEEDA] text-[#633806]',
  }

  return (
    <span className={`ml-2 inline-block rounded px-2 py-0.5 text-[11px] font-medium ${styles[type]}`}>
      {children}
    </span>
  )
}

function ProfileSection({ user, stats, form, onFieldChange, onSave, saving, saveStatus }) {
  const initials = getInitials(user?.name)

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Items in cart" value={stats.totalItems} />
        <StatCard label="Estimated total" value={formatCurrency(stats.totalSpent)} />
        <StatCard label="Unique products" value={stats.uniqueProducts} />
      </div>

      <div className="rounded-2xl border border-[#d7e2d1] bg-white p-4 shadow-sm sm:p-5">
        <div className="mb-5 flex flex-wrap items-center gap-4">
          <div
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-[22px] font-medium text-white"
            style={{ background: ACCENT }}
          >
            {initials}
          </div>

          <div className="min-w-0 flex-1">
            <div className="truncate text-[17px] font-medium text-[#1a2416]">{user?.name || 'User'}</div>
            <div className="truncate text-[13px] text-[#6a7861]">{user?.email || '-'}</div>
          </div>

          <button
            type="button"
            className="ml-auto rounded-lg border border-[#396539] px-3 py-1.5 text-xs text-[#396539]"
          >
            Edit image
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Field
            label="Last Name"
            value={form.lastName}
            placeholder="Your last name"
            onChange={(e) => onFieldChange('lastName', e.target.value)}
          />
          <Field
            label="First Name"
            value={form.firstName}
            placeholder="Your first name"
            onChange={(e) => onFieldChange('firstName', e.target.value)}
          />
          <Field
            label="Email"
            value={form.email}
            placeholder="you@example.com"
            onChange={(e) => onFieldChange('email', e.target.value)}
          />
          <Field
            label="Phone"
            value={form.phone}
            placeholder="+976 99112233"
            onChange={(e) => onFieldChange('phone', e.target.value)}
          />
          <div className="sm:col-span-2">
            <Field
              label="Birth Date"
              type="date"
              value={form.birthday}
              onChange={(e) => onFieldChange('birthday', e.target.value)}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="mt-4 rounded-lg bg-[#396539] px-5 py-2 text-[13px] font-medium text-white disabled:opacity-60"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>

        {saveStatus.text && (
          <p className={`mt-3 text-xs ${saveStatus.type === 'success' ? 'text-[#3B6D11]' : 'text-[#8B1A2B]'}`}>
            {saveStatus.text}
          </p>
        )}
      </div>
    </>
  )
}

function OrdersSection({ cartItems }) {
  return (
    <div className="rounded-2xl border border-[#d7e2d1] bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-2 text-[15px] font-medium text-[#1a2416]">Recent Cart Items</div>

      {cartItems.length === 0 && <div className="text-[13px] text-[#6a7861]">No items yet.</div>}

      {cartItems.map((item) => (
        <div
          key={item.id}
          className="flex flex-wrap items-center gap-3 border-b border-[#e8efe4] py-3 last:border-b-0"
        >
          <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-[#d7e2d1] bg-[#f0f5f0]">
            <img src={item.img} alt={item.title} className="h-full w-full object-cover" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="truncate text-[13px] font-medium text-[#1a2416]">
              {item.title}
              <Badge type="pending">In Cart</Badge>
            </div>
            <div className="mt-0.5 text-xs text-[#85937b]">Qty: {item.quantity || 1}</div>
          </div>

          <div className="ml-auto whitespace-nowrap text-[13px] font-medium text-[#1a2416]">
            {formatCurrency(parsePrice(item.price) * (item.quantity || 1))}
          </div>
        </div>
      ))}
    </div>
  )
}

function AddressSection({ user }) {
  return (
    <div className="rounded-2xl border border-[#d7e2d1] bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-3 text-[15px] font-medium text-[#1a2416]">Delivery Address</div>

      <div className="flex flex-col gap-1 rounded-xl border border-[#d7e2d1] p-4">
        <div className="text-[13px] font-medium text-[#1a2416]">{user?.name || 'User'}</div>
        <div className="text-xs leading-5 text-[#6a7861]">Set your full delivery address in profile settings.</div>
        <div className="mt-1 text-xs text-[#6a7861]">{user?.phone || 'Phone not set'}</div>
      </div>
    </div>
  )
}

function SecuritySection() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  return (
    <div className="rounded-2xl border border-[#d7e2d1] bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4 text-[15px] font-medium text-[#1a2416]">Password</div>

      <div className="flex max-w-[420px] flex-col gap-3">
        <Field
          label="Current Password"
          type="password"
          value={currentPassword}
          placeholder="Current password"
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <Field
          label="New Password"
          type="password"
          value={newPassword}
          placeholder="New password"
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <Field
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          placeholder="Confirm password"
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button type="button" className="mt-1 w-fit rounded-lg bg-[#396539] px-5 py-2 text-[13px] font-medium text-white">
          Save
        </button>
      </div>
    </div>
  )
}

export default function MyAccountPage() {
  const [active, setActive] = useState('profile')
  const [user, setUser] = useState(getCurrentUser())
  const [cartItems, setCartItems] = useState([])
  const [profileForm, setProfileForm] = useState(emptyProfile)
  const [saveStatus, setSaveStatus] = useState({ type: '', text: '' })
  const [saving, setSaving] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const syncUser = () => {
      setUser(getCurrentUser())
    }

    window.addEventListener('storage', syncUser)
    window.addEventListener('focus', syncUser)
    window.addEventListener(AUTH_CHANGE_EVENT, syncUser)
    return () => {
      window.removeEventListener('storage', syncUser)
      window.removeEventListener('focus', syncUser)
      window.removeEventListener(AUTH_CHANGE_EVENT, syncUser)
    }
  }, [])

  useEffect(() => {
    if (!user) {
      setProfileForm(emptyProfile)
      return
    }

    const { firstName, lastName } = getNameParts(user.name || '')
    setProfileForm({
      firstName,
      lastName,
      email: user.email || '',
      phone: user.phone || '',
      birthday: user.birthday || '',
    })
  }, [user?.id, user?.name, user?.email, user?.phone, user?.birthday])

  useEffect(() => {
    const fetchCart = async () => {
      if (!user?.id) {
        setCartItems([])
        return
      }

      const data = await getCart(user.id)
      setCartItems(data)
    }

    fetchCart()
  }, [user?.id])

  const stats = useMemo(() => {
    const totalItems = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0)
    const totalSpent = cartItems.reduce((sum, item) => sum + parsePrice(item.price) * (item.quantity || 1), 0)

    return {
      totalItems,
      totalSpent,
      uniqueProducts: cartItems.length,
    }
  }, [cartItems])

  const handleLogout = () => {
    logoutUser()
    setUser(null)
    navigate('/login')
  }

  const handleFieldChange = (key, value) => {
    setProfileForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSaveProfile = async () => {
    if (!user?.id) return

    const first = profileForm.firstName.trim()
    const last = profileForm.lastName.trim()
    const fullName = [first, last].filter(Boolean).join(' ').trim()
    const email = profileForm.email.trim()

    if (!email) {
      setSaveStatus({ type: 'error', text: 'Email required.' })
      return
    }

    setSaving(true)
    setSaveStatus({ type: '', text: '' })

    const result = await updateUserProfile(user.id, {
      name: fullName || user.name || '',
      email,
      phone: profileForm.phone.trim(),
      birthday: profileForm.birthday,
    })

    if (result?.status === 200) {
      setUser(result.data)
      setSaveStatus({ type: 'success', text: 'Profile saved successfully.' })
    } else {
      setSaveStatus({ type: 'error', text: 'Could not save profile.' })
    }

    setSaving(false)
  }

  const sections = {
    profile: (
      <ProfileSection
        user={user}
        stats={stats}
        form={profileForm}
        onFieldChange={handleFieldChange}
        onSave={handleSaveProfile}
        saving={saving}
        saveStatus={saveStatus}
      />
    ),
    orders: <OrdersSection cartItems={cartItems} />,
    address: <AddressSection user={user} />,
    security: <SecuritySection />,
  }

  const sidebarInitials = getInitials(user?.name)

  return (
    <div className="min-h-screen bg-[#f6faf3]">
      <HeaderMenu />
      <div className="h-16 w-full bg-white lg:h-[76px]"></div>

      {!user ? (
        <div className="mx-auto mt-8 w-full max-w-3xl px-4">
          <div className="rounded-2xl bg-white p-6 shadow-[0px_0px_16px_#0000001a] sm:p-8">
            <h1 className="text-2xl font-bold text-[#285923] sm:text-3xl">My Account</h1>
            <p className="mt-3 text-[#4a5c3f]">Please login first to view your account information.</p>
            <Link to="/login" className="mt-5 inline-block rounded-xl bg-[#285923] px-5 py-2 text-white">
              Go to Login
            </Link>
          </div>
        </div>
      ) : (
        <div className="mx-auto flex w-full max-w-[1300px] flex-col gap-5 px-4 py-6 md:px-6 lg:flex-row lg:gap-6">
          <aside className="w-full rounded-2xl border border-[#d7e2d1] bg-white p-3 shadow-sm lg:sticky lg:top-24 lg:w-[230px] lg:self-start">
            <div className="mb-3 flex items-center gap-3 px-2 py-2">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-medium text-white"
                style={{ background: ACCENT }}
              >
                {sidebarInitials}
              </div>
              <div className="min-w-0">
                <div className="truncate text-[13px] font-medium text-[#1a2416]">{user?.name || 'User'}</div>
                <div className="truncate text-[11px] text-[#85937b]">{user?.email || '-'}</div>
              </div>
            </div>

            <div className="mb-2 h-px bg-[#e8efe4]" />

            <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">
              {NAV.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActive(item.id)}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-left text-[13px] ${active === item.id ? 'bg-[#f3f8ef] font-medium text-[#1a2416]' : 'text-[#6a7861]'} `}
                >
                  <span className={`${active === item.id ? 'opacity-100' : 'opacity-70'}`}>{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>

            <div className="my-2 h-px bg-[#e8efe4]" />

            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-[13px] text-[#8b1a2b]"
            >
              {icons.logout} Logout
            </button>
          </aside>

          <div className="flex min-w-0 flex-1 flex-col gap-5">{sections[active]}</div>
        </div>
      )}
    </div>
  )
}
