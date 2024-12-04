// AdminCertificates.tsx

import React, { useEffect, useState } from "react";
import { get, patch, post, remove } from "@/services/ApiHelper";

import AdminHeader from "@/components/AdminHeader";
import DataTable from "@/components/DataTable";
import FormModal from "@/components/FormModal";

type Certificate = {
  certificate_id: number;
  course_id: number;
  student_id: number;
  issued_date: string;
};

const AdminCertificates: React.FC = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] =
    useState<Certificate | null>(null);

  const fetchCertificates = async () => {
    try {
      const data = await get("/Certificates");
      setCertificates(data);
    } catch (error) {
      console.error("Error fetching certificates: ", error);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const handleCreateCertificate = async (
    newCertificate: Omit<Certificate, "certificate_id" | "issued_date">
  ) => {
    try {
      await post("/Certificates", newCertificate);
      await fetchCertificates();
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Error creating certificate: ", error);
    }
  };

  const handleUpdateCertificate = async (updatedCertificate: Certificate) => {
    try {
      await patch(`/Certificates`, updatedCertificate);
      await fetchCertificates();
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating certificate: ", error);
    }
  };

  const handleDeleteCertificate = async (certificateId: number) => {
    try {
      await remove(`/Certificates/${certificateId}`);
      await fetchCertificates();
    } catch (error) {
      console.error("Error deleting certificate: ", error);
    }
  };

  return (
    <div className="admin-certificates">
      <AdminHeader
        title="Certificates Management"
        onCreate={() => setIsCreateModalOpen(true)}
      />
      <DataTable
        data={certificates}
        columns={[
          { header: "ID", key: "certificate_id" },
          { header: "Course ID", key: "course_id" },
          { header: "Student ID", key: "student_id" },
          { header: "Issued Date", key: "issued_date" },
        ]}
        idKey="certificate_id"
        onEdit={(certificate) => {
          setSelectedCertificate(certificate);
          setIsEditModalOpen(true);
        }}
        onDelete={handleDeleteCertificate}
      />
      {isCreateModalOpen && (
        <FormModal
          title="Create Certificate"
          fields={[
            { label: "Course ID", key: "course_id", type: "number" },
            { label: "Student ID", key: "student_id", type: "number" },
          ]}
          initialValues={{ course_id: 0, student_id: 0 }}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={(values) =>
            handleCreateCertificate(
              values as Omit<Certificate, "certificate_id" | "issued_date">
            )
          }
        />
      )}
      {isEditModalOpen && selectedCertificate && (
        <FormModal
          title="Edit Certificate"
          fields={[
            { label: "Course ID", key: "course_id", type: "number" },
            { label: "Student ID", key: "student_id", type: "number" },
          ]}
          initialValues={selectedCertificate}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={(values) => handleUpdateCertificate(values as Certificate)}
        />
      )}
    </div>
  );
};

export default AdminCertificates;
