import React from 'react';
import NavRegister from '../../components/Register/NavRegister';
import { useTranslation } from 'react-i18next';
import Main from '../../components/Register/Main';

const Register = () => {
    return (
        <div>
            <NavRegister />
            <Main />
        </div>
    );
};

export default Register;