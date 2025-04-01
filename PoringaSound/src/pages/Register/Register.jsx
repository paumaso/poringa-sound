import React from 'react';
import { useTranslation } from 'react-i18next';
import SingUpNav from '../../components/SingUp/SingUpNav';
import SingUp from '../../components/SingUp/SingUp';

const Register = () => {
    return (
        <div>
            <SingUpNav />
            <SingUp />
        </div>
    );
};

export default Register;