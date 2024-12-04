// AdminQuestionOptions.tsx

import React, { useEffect, useState } from "react";
import { get, patch, post, remove } from "@/services/ApiHelper";

import AdminHeader from "@/components/AdminHeader";
import DataTable from "@/components/DataTable";
import FormModal from "@/components/FormModal";

type QuestionOption = {
  option_id: number;
  question_id: number;
  option_text: string;
  is_correct: boolean;
  created_at: string;
};

const AdminQuestionOptions: React.FC = () => {
  const [options, setOptions] = useState<QuestionOption[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<QuestionOption | null>(
    null
  );

  const fetchOptions = async () => {
    try {
      const data = await get("/QuestionOptions");
      setOptions(data);
    } catch (error) {
      console.error("Error fetching options: ", error);
    }
  };

  useEffect(() => {
    fetchOptions();
  }, []);

  const handleCreateOption = async (
    newOption: Omit<QuestionOption, "option_id">
  ) => {
    try {
      await post("/QuestionOptions", newOption);
      await fetchOptions();
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Error creating option: ", error);
    }
  };

  const handleUpdateOption = async (updatedOption: QuestionOption) => {
    try {
      await patch(`/QuestionOptions`, updatedOption);
      await fetchOptions();
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating option: ", error);
    }
  };

  const handleDeleteOption = async (optionId: number) => {
    try {
      await remove(`/QuestionOptions/${optionId}`);
      await fetchOptions();
    } catch (error) {
      console.error("Error deleting option: ", error);
    }
  };

  return (
    <div className="admin-question-options">
      <AdminHeader
        title="Question Options Management"
        onCreate={() => setIsCreateModalOpen(true)}
      />
      <DataTable
        data={options}
        columns={[
          { header: "ID", key: "option_id" },
          { header: "Question ID", key: "question_id" },
          { header: "Option Text", key: "option_text" },
          { header: "Is Correct", key: "is_correct" },
          { header: "Created At", key: "created_at" },
        ]}
        idKey="option_id"
        onEdit={(option) => {
          setSelectedOption(option);
          setIsEditModalOpen(true);
        }}
        onDelete={handleDeleteOption}
      />
      {isCreateModalOpen && (
        <FormModal
          title="Create Option"
          fields={[
            { label: "Question ID", key: "question_id", type: "number" },
            { label: "Option Text", key: "option_text", type: "text" },
            { label: "Is Correct", key: "is_correct", type: "text" },
          ]}
          initialValues={{
            question_id: 0,
            option_text: "",
            is_correct: "false",
          }}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={(values) =>
            handleCreateOption({
              ...values,
              is_correct: values.is_correct === "true",
            } as Omit<QuestionOption, "option_id">)
          }
        />
      )}
      {isEditModalOpen && selectedOption && (
        <FormModal
          title="Edit Option"
          fields={[
            { label: "Question ID", key: "question_id", type: "number" },
            { label: "Option Text", key: "option_text", type: "text" },
            { label: "Is Correct", key: "is_correct", type: "text" },
          ]}
          initialValues={{
            ...selectedOption,
            is_correct: selectedOption.is_correct ? "true" : "false",
          }}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={(values) =>
            handleUpdateOption({
              ...values,
              is_correct: values.is_correct === "true",
            } as QuestionOption)
          }
        />
      )}
    </div>
  );
};

export default AdminQuestionOptions;
