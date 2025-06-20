import React, { useState, useEffect } from "react";

interface ModalFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => void;
  title: string;
  entityId: string; // ID of the client or payroll being edited
  fetchEntityData: (id: string) => Promise<any>; // Function to fetch data dynamically
}

const ModalForm: React.FC<ModalFormProps> = ({ isOpen, onClose, onSubmit, title, entityId, fetchEntityData }) => {
  const [formData, setFormData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchEntityData(entityId);
        setFormData(data);
      } catch (error) {
        console.error("Error fetching entity data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isOpen, entityId, fetchEntityData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>{title}</h2>
          <button onClick={onClose} className="modal-close-btn">×</button>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <form onSubmit={handleSubmit} className="modal-body space-y-4">
            {/* Dynamically render fields */}
            {formData &&
              Object.keys(formData).map((key) => (
                <div key={key}>
                  <label htmlFor={key} className="block text-sm font-medium capitalize">
                    {key.replace(/_/g, " ")} {/* Format key names */}
                  </label>
                  <input
                    type="text"
                    id={key}
                    name={key}
                    value={formData[key] || ""}
                    onChange={handleChange}
                    className="input"
                  />
                </div>
              ))}
            <div className="modal-footer">
              <button type="submit" className="btn btn-primary">Save</button>
              <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ModalForm;
