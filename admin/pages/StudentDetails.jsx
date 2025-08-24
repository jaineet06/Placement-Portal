import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useAdminContext } from "../src/context/AdminContext";

const StudentDetails = () => {
  const { id } = useParams();
  const { axios } = useAdminContext();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  return <div></div>;
};

export default StudentDetails;
