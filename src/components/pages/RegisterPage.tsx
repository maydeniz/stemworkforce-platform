import React from 'react';
import AuthLayout from '@/components/auth/AuthLayout';
import RegisterWizard from '@/components/auth/RegisterWizard';

const RegisterPage: React.FC = () => {
  return (
    <AuthLayout>
      <RegisterWizard />
    </AuthLayout>
  );
};

export default RegisterPage;
