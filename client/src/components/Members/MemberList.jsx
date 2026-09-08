import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/formatters';
import {
  Users,
  UserPlus,
  Phone,
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

  const [showPinModal, setShowPinModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  const openAddMemberModal = () => {
    setName('');
    setPhone('');
    setEditMemberData(null);
    setShowMemberModal(true);
  };

  const openEditMemberModal = (mem) => {
    setName(mem.name);
    setPhone(mem.phone || '');
    setEditMemberData(mem);
    setShowMemberModal(true);
  };

  const handleDeleteMember = (mem) => {
    handleProtectedAction(() => {
      if (
        window.confirm(
          `क्या आप निश्चित रूप से '${mem.name}' को समिति सदस्य सूची से हटाना चाहते हैं?`
        )
      ) {
        deleteMember(mem.id);
      }
    });
  };

  const handleEditMemberClick = (mem) => {
    handleProtectedAction(() => {
      openEditMemberModal(mem);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editMemberData) {
      updateMember(editMemberData.id, {
        name,
        phone,
      });
    } else {
      addMember({
        name,
        phone,
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
                {mem.phone ? (
                  <div className="member-info-row">
                    <Phone size={14} className="text-gold" />
                    <a href={`tel:${mem.phone}`} className="phone-link font-semibold">
                      {mem.phone}
                    </a>
                  </div>
                ) : (
                  <div className="member-info-row text-sub">
                    <span>मोबाइल नं.: दर्ज नहीं</span>
                  </div>
                )}

                <div className="member-contribution-box">
                  <span className="contrib-label">कुल दर्ज चंदा अंशदान:</span>
                  <span className="contrib-val text-green font-bold">
                    {formatCurrency(totalContribution)}
                  </span>
                </div>
              </div>

              <div className="member-card-footer">
                <button
                  className="btn-action-icon"
                  onClick={() => handleEditMemberClick(mem)}
                  title="सदस्य विवरण बदलें"
                >
                  <Edit2 size={16} /> बदलें
                </button>
                <button
                  className="btn-action-icon text-red"
                  onClick={() => handleDeleteMember(mem)}
                  title="सदस्य सूची से हटाएं"
                >
                  <Trash2 size={16} /> सदस्य हटाएं
                </button>
              </div>
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

              <div className="form-group">
                <label>मोबाइल नंबर *</label>
                <input
                  type="tel"
                  placeholder="उदा. 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
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
