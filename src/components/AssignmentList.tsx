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
    <div className="w-full max-w-4xl space-y-4">
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
            className="w-full bg-gray-800 text-white p-4 rounded-lg shadow-md"
          >
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">{assignment.title}</h2>
                <p className="text-sm text-gray-400">
                  {assignment.course_name}
                </p>
                <p className="text-sm mt-2">{assignment.description}</p>
              </div>
              <p className="text-sm">{formattedDueDate}</p>
            </div>
            <div className="mt-2 flex justify-end">
                {!assignment.submitted && (
                <Button
                  className="bg-blue-500 text-white p-2 rounded"
                  onClick={() => onAssignmentClick(assignment.assignment_id)}
                >
                  Ödev Detayları
                </Button>
                )}
                {assignment.submitted ? (
                <span className="ml-4 text-green-500 font-semibold">
                  ✔ Teslim edildi
                </span>
                ) : (
                <span className="ml-4 text-gray-500 font-semibold">
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
