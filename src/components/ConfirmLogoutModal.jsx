import React from "react";

function ConfirmLogoutModal({
  isOpen,
  title = "Confirm Logout",
  message = "Are you sure you want to log out?",
  confirmText = "Logout",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;

  const backdropStyle = {
    position: "fixed",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  };

  const modalStyle = {
    background: "#fff",
    borderRadius: 8,
    width: "100%",
    maxWidth: 420,
    boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
    overflow: "hidden",
  };

  const headerStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 16px",
    borderBottom: "1px solid #e5e7eb",
    fontWeight: 600,
    background: "#caa22a",
    color: "#2b2b2b",
  };

  const bodyStyle = { padding: "16px", fontSize: 14, color: "#111827" };

  const actionsStyle = {
    display: "flex",
    justifyContent: "flex-end",
    gap: 8,
    padding: "12px 16px",
    borderTop: "1px solid #e5e7eb",
  };

  const btnBase = {
    borderRadius: 6,
    padding: "8px 12px",
    fontSize: 14,
    cursor: "pointer",
    border: "1px solid transparent",
  };

  const cancelBtn = {
    ...btnBase,
    background: "#f9fafb",
    borderColor: "#e5e7eb",
    color: "#111827",
  };

  const confirmBtn = {
    ...btnBase,
    background: "#dc2626",
    color: "#fff",
    borderColor: "#b91c1c",
  };

  return (
    <div style={backdropStyle} role="dialog" aria-modal="true">
      <div style={modalStyle}>
        <div style={headerStyle}>
          <div>{title}</div>
          <button
            aria-label="Close"
            onClick={onCancel}
            style={{ background: "transparent", border: "none", fontSize: 22, cursor: "pointer", color: "#2b2b2b" }}
          >
            ×
          </button>
        </div>
        <div style={bodyStyle}>{message}</div>
        <div style={actionsStyle}>
          <button type="button" onClick={onCancel} style={cancelBtn}>
            {cancelText}
          </button>
          <button type="button" onClick={onConfirm} style={confirmBtn}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmLogoutModal;