import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [userId, setUserId] = useState(null);
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const fetchQuestion = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/forgot-password', { emailOrUsername });
      setSecurityQuestion(res.data.security_question);
      setUserId(res.data.user_id);
      setStep(2);
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  const resetPassword = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/reset-password', {
        user_id: userId,
        security_answer: securityAnswer,
        new_password: newPassword,
      });
      alert(res.data.message);
      setStep(1);
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  return (
    <div>
      {step === 1 && (
        <div>
          <input placeholder="Username or Email" onChange={(e) => setEmailOrUsername(e.target.value)} />
          <button onClick={fetchQuestion}>Submit</button>
        </div>
      )}
      {step === 2 && (
        <div>
          <p>{securityQuestion}</p>
          <input placeholder="Your Answer" onChange={(e) => setSecurityAnswer(e.target.value)} />
          <input placeholder="New Password" type="password" onChange={(e) => setNewPassword(e.target.value)} />
          <button onClick={resetPassword}>Reset Password</button>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
