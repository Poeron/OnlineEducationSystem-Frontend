import "@/assets/css/Modal.css";

import { useState } from "react";

type FormField = {
  label: string;
  key: string;
  type: "text" | "number";
};

type FormModalProps<T> = {
  title: string;
  fields: FormField[];
  initialValues: T;
  onClose: () => void;
  onSubmit: (values: T) => void;
};

const FormModal = <T extends {}>({
  title,
  fields,
  initialValues,
  onClose,
  onSubmit,
}: FormModalProps<T>) => {
  const [values, setValues] = useState<T>(initialValues);

  const handleChange = (key: string, value: string | number) => {
    setValues((prevValues) => ({ ...prevValues, [key]: value }));
  };

  const handleSubmit = () => {
    onSubmit(values);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{title}</h2>
        <div className="modal-content">
          {fields.map((field) => (
            <label key={field.key}>
              {field.label}:
              <input
                type={field.type}
                value={(values as any)[field.key]}
                onChange={(e) =>
                  handleChange(
                    field.key,
                    field.type === "number"
                      ? Number(e.target.value)
                      : e.target.value
                  )
                }
              />
            </label>
          ))}
        </div>
        <div className="modal-actions">
          <button onClick={handleSubmit}>Submit</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default FormModal;
