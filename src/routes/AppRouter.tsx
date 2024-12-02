import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Home from "../pages/Home";
import ProtectedRoute from "../routes/ProtectedRoute";
import Signup from "@/pages/Signup";
import MyCourses from "@/pages/UserCourses";
import CourseDetails from "@/pages/CourseDetails";
import Materials from "@/pages/Materials";
import AssignmentDetails from "@/pages/AssignmentDetails";
import Forum from "@/pages/Forum";
import Quiz from "@/pages/Quiz";
import AllCourses from "@/pages/AllCourses";
import CourseRegistration from "@/pages/CourseRegistration";
import AllAssignments from "@/pages/Assignments";
import InstructorHome from "@/pages/Forum";
import InstructorCourses from "@/pages/Forum";
import InstructorCourseDetails from "@/pages/Forum";
import InstructorMaterials from "@/pages/Forum";
import InstructorAssignments from "@/pages/Forum";
import InstructorForum from "@/pages/Forum";
import InstructorQuiz from "@/pages/Forum";
import AdminHome from "@/pages/admin/Home";
import Welcome from "@/pages/Welcome";

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Student Routes */}
        <Route
          path="/student/*"
          element={
            <ProtectedRoute role={"student"}>
              <Routes>
                <Route path="home" element={<Home />} />
                <Route path="mycourses" element={<MyCourses />} />
                <Route path="assignments" element={<AllAssignments />} />
                <Route
                  path="assignments/:assignmentId"
                  element={<AssignmentDetails />}
                />
                <Route path="courses/:courseId" element={<CourseDetails />} />
                <Route
                  path="courses/:courseId/materials"
                  element={<Materials />}
                />
                <Route
                  path="courses/:courseId/assignments"
                  element={<AllAssignments />}
                />
                <Route path="courses/:courseId/quiz" element={<Quiz />} />
                <Route path="courses/:courseId/forum" element={<Forum />} />
                <Route path="allcourses" element={<AllCourses />} />
                <Route
                  path="courses/:courseId/register"
                  element={<CourseRegistration />}
                />
              </Routes>
            </ProtectedRoute>
          }
        />

        {/* Instructor Routes */}
        <Route
          path="/instructor/*"
          element={
            <ProtectedRoute role="instructor">
              <Routes>
                <Route path="home" element={<InstructorHome />} />
                <Route path="courses" element={<InstructorCourses />} />
                <Route
                  path="courses/:courseId"
                  element={<InstructorCourseDetails />}
                />
                <Route
                  path="courses/:courseId/materials"
                  element={<InstructorMaterials />}
                />
                <Route
                  path="courses/:courseId/assignments"
                  element={<InstructorAssignments />}
                />
                <Route
                  path="courses/:courseId/quiz"
                  element={<InstructorQuiz />}
                />
                <Route
                  path="courses/:courseId/forum"
                  element={<InstructorForum />}
                />
              </Routes>
            </ProtectedRoute>
          }
        />

        {/* Admin Route */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute role="admin">
              <Routes>
                <Route path="home" element={<AdminHome />} />
              </Routes>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRouter;
