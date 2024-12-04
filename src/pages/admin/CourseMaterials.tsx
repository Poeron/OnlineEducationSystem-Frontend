// AdminCourseMaterials.tsx

import React, { useEffect, useState } from "react";
import { get, patch, post, remove } from "@/services/ApiHelper";

import AdminHeader from "@/components/AdminHeader";
import DataTable from "@/components/DataTable";
import FormModal from "@/components/FormModal";

type CourseMaterial = {
  material_id: number;
  course_id: number;
  title: string;
  content_type: string;
  content_url: string;
  created_at: string;
};

const AdminCourseMaterials: React.FC = () => {
  const [materials, setMaterials] = useState<CourseMaterial[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] =
    useState<CourseMaterial | null>(null);

  const fetchMaterials = async () => {
    try {
      const data = await get("/CourseMaterials");
      setMaterials(data);
    } catch (error) {
      console.error("Error fetching materials: ", error);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const handleCreateMaterial = async (
    newMaterial: Omit<CourseMaterial, "material_id" | "created_at">
  ) => {
    try {
      await post("/CourseMaterials", newMaterial);
      await fetchMaterials();
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Error creating material: ", error);
    }
  };

  const handleUpdateMaterial = async (updatedMaterial: CourseMaterial) => {
    try {
      await patch(`/CourseMaterials`, updatedMaterial);
      await fetchMaterials();
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating material: ", error);
    }
  };

  const handleDeleteMaterial = async (materialId: number) => {
    try {
      await remove(`/CourseMaterials/${materialId}`);
      await fetchMaterials();
    } catch (error) {
      console.error("Error deleting material: ", error);
    }
  };

  return (
    <div className="admin-course-materials">
      <AdminHeader
        title="Course Materials Management"
        onCreate={() => setIsCreateModalOpen(true)}
      />
      <DataTable
        data={materials}
        columns={[
          { header: "ID", key: "material_id" },
          { header: "Course ID", key: "course_id" },
          { header: "Title", key: "title" },
          { header: "Content Type", key: "content_type" },
          { header: "Content URL", key: "content_url" },
          { header: "Created At", key: "created_at" },
        ]}
        idKey="material_id"
        onEdit={(material) => {
          setSelectedMaterial(material);
          setIsEditModalOpen(true);
        }}
        onDelete={handleDeleteMaterial}
      />
      {isCreateModalOpen && (
        <FormModal
          title="Create Material"
          fields={[
            { label: "Course ID", key: "course_id", type: "number" },
            { label: "Title", key: "title", type: "text" },
            { label: "Content Type", key: "content_type", type: "text" },
            { label: "Content URL", key: "content_url", type: "text" },
          ]}
          initialValues={{
            course_id: 0,
            title: "",
            content_type: "",
            content_url: "",
          }}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={(values) =>
            handleCreateMaterial(
              values as Omit<CourseMaterial, "material_id" | "created_at">
            )
          }
        />
      )}
      {isEditModalOpen && selectedMaterial && (
        <FormModal
          title="Edit Material"
          fields={[
            { label: "Course ID", key: "course_id", type: "number" },
            { label: "Title", key: "title", type: "text" },
            { label: "Content Type", key: "content_type", type: "text" },
            { label: "Content URL", key: "content_url", type: "text" },
          ]}
          initialValues={selectedMaterial}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={(values) => handleUpdateMaterial(values as CourseMaterial)}
        />
      )}
    </div>
  );
};

export default AdminCourseMaterials;
