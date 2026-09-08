import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/formatters';
import {
  Users,
  UserPlus,
  Phone,
  MapPin,
  Edit2,
  Trash2,
  X,
  UserCheck,
} from 'lucide-react';
import AdminPinModal from '../AdminPinModal';

const MemberList = () => {
  const {
    members,
    addMember,
    updateMember,
    deleteMember,
    chandaList,
    isAdminUnlocked,
  } = useApp();

  const [showMemberModal, setShowMemberModal] = useState(false);
  const [editMemberData, setEditMemberData] = useState(null);

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const [showPinModal, setShowPinModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  const openAddMemberModal = () => {
    setName('');
    setPhone('');
    setAddress('');
    setEditMemberData(null);
    setShowMemberModal(true);
  };

  const openEditMemberModal = (mem) => {
    setName(mem.name);
    setPhone(mem.phone || '');
    setAddress(mem.address || '');
    setEditMemberData(mem);
    setShowMemberModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editMemberData) {
      updateMember(editMemberData.id, {
        name,
        phone,
        address,
      });
    } else {
      addMember({
        name,
        phone,
        address,
      });
    }

    setShowMemberModal(false);
  };

  const handleProtectedAction = (actionFn) => {
    if (!isAdminUnlocked) {
      setPendingAction({ fn: actionFn });
      setShowPinModal(true);
    } else {
      actionFn();
    }
  };

  // Calculate Total Contribution for each member
  const getMemberTotalContribution = (memberName) => {
    return chandaList
      .filter((c) => c.donorName.trim().toLowerCase() === memberName.trim().toLowerCase())
      .reduce((sum, c) => sum + Number(c.amount || 0), 0);
  };

  return (
    <div className="members-container">
      <div className="members-toolbar">
        <div className="members-title-wrap">
          <Users size={22} className="icon-gold" />
          <h2>ग्राम समिति सदस्य सूची ({members.length})</h2>
        </div>

        <button
          className="btn-primary"
          onClick={() => handleProtectedAction(openAddMemberModal)}
        >
          <UserPlus size={16} />
          <span>+ नया सदस्य जोड़ें</span>
        </button>
      </div>

      <div className="members-grid">
        {members.map((mem) => {
          const totalContribution = getMemberTotalContribution(mem.name);

          return (
            <div key={mem.id} className="member-card">
              <div className="member-card-header">
                <div className="avatar-circle">
                  <UserCheck size={24} />
                </div>
                <div>
                  <h3 className="member-name">{mem.name}</h3>
                  <span className="badge badge-member">
                    समिति सदस्य
                  </span>
                </div>
              </div>

              <div className="member-body">
                {mem.phone && (
                  <div className="member-info-row">
                    <Phone size={14} className="text-gold" />
                    <a href={`tel:${mem.phone}`} className="phone-link">
                      {mem.phone}
                    </a>
                  </div>
                )}
                {mem.address && (
                  <div className="member-info-row text-sub">
                    <MapPin size={14} />
                    <span>{mem.address}</span>
                  </div>
                )}

                <div className="member-contribution-box">
                  <span className="contrib-label">कुल दर्ज चंदा अंशदान:</span>
                  <span className="contrib-val text-green font-bold">
                    {formatCurrency(totalContribution)}
                  </span>
                </div>
              </div>

              {isAdminUnlocked && (
                <div className="member-card-footer">
                  <button
                    className="btn-action-icon"
                    onClick={() => openEditMemberModal(mem)}
                    title="बदलें"
                  >
                    <Edit2 size={16} /> बदलें
                  </button>
                  <button
                    className="btn-action-icon text-red"
                    onClick={() => {
                      if (
                        window.confirm(
                          `क्या आप '${mem.name}' को समिति सदस्य सूची से हटाना चाहते हैं?`
                        )
                      ) {
                        deleteMember(mem.id);
                      }
                    }}
                    title="हटाएं"
                  >
                    <Trash2 size={16} /> हटाएं
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Member Form Modal */}
      {showMemberModal && (
        <div className="modal-backdrop" onClick={() => setShowMemberModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-wrap">
                <UserPlus size={20} className="icon-gold" />
                <h2>{editMemberData ? 'सदस्य विवरण बदलें' : 'नया समिति सदस्य जोड़ें'}</h2>
              </div>
              <button
                className="btn-close"
                onClick={() => setShowMemberModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-body">
              <div className="form-group">
                <label>सदस्य का नाम *</label>
                <input
                  type="text"
                  placeholder="उदा. रामप्रसाद पटेल"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>मोबाइल नंबर</label>
                  <input
                    type="tel"
                    placeholder="9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>पता / मोहल्ला</label>
                  <input
                    type="text"
                    placeholder="उदा. मेन रोड, वार्ड 1"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowMemberModal(false)}
                >
                  रद्द करें
                </button>
                <button type="submit" className="btn-primary">
                  {editMemberData ? 'अपडेट करें' : 'सदस्य दर्ज करें'} 💾
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showPinModal && (
        <AdminPinModal
          onClose={() => setShowPinModal(false)}
          onSuccess={() => {
            if (pendingAction?.fn) pendingAction.fn();
            setPendingAction(null);
          }}
        />
      )}
    </div>
  );
};

export default MemberList;
