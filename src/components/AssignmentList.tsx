import React from "react";
import { Button } from "@/components/ui/button";

interface Assignment {
  assignment_id: number;
  course_id: number;
  course_name: string;
  title: string;
  description: string;
  due_date: string;
  submitted: boolean;
}

interface AssignmentListProps {
  assignments: Assignment[];
  onAssignmentClick: (courseId: number) => void;
}

const AssignmentList: React.FC<AssignmentListProps> = ({
  assignments,
  onAssignmentClick,
}) => {
  return (
    <div className="w-full max-w-4xl space-y-6">
      {assignments.map((assignment) => {
        const formattedDueDate = new Date(
          assignment.due_date
        ).toLocaleDateString("tr-TR", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });

        return (
          <div
            key={assignment.assignment_id}
            className="w-full bg-gradient-to-r from-blue-900 to-gray-800 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold mb-2">{assignment.title}</h2>
                <p className="text-sm text-gray-400 mb-2">
                  {assignment.course_name}
                </p>
                <p className="text-sm text-gray-300">
                  {assignment.description}
                </p>
              </div>
              <p className="text-sm text-gray-400">{formattedDueDate}</p>
            </div>
            <div className="mt-4 flex justify-end items-center">
              {!assignment.submitted && (
                <Button
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all"
                  onClick={() => onAssignmentClick(assignment.assignment_id)}
                >
                  Ödev Detayları
                </Button>
              )}
              {assignment.submitted ? (
                <span className="ml-4 text-green-500 font-semibold flex items-center gap-2">
                  ✔ Teslim edildi
                </span>
              ) : (
                <span className="ml-4 text-red-500 font-semibold flex items-center gap-2">
                  ✖ Teslim edilmedi
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AssignmentList;
