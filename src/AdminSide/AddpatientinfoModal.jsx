import React from "react";
import { useNavigate } from "react-router-dom";
import PatientPersonalInfoModal from "../components/PatientPersonalInfoModal";

function AddpatientinfoModal() {
  const navigate = useNavigate();
  const handleClose = () => navigate(-1);
  const handleSaved = () => navigate("/admin/patient-records", { replace: true });
  return (
    <PatientPersonalInfoModal isOpen={true} onClose={handleClose} onSaved={handleSaved} />
  );
}

export default AddpatientinfoModal;


