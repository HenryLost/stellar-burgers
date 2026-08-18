import { FC, SyntheticEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RegisterUI } from '@ui-pages';

import { useDispatch, useSelector } from '../../services/store';
import {
  registerUser,
  selectUserError
} from '../../services/slices/user-slice';

export const Register: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const error = useSelector(selectUserError);

  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    const result = await dispatch(
      registerUser({
        name: userName,
        email,
        password
      })
    );

    if (registerUser.fulfilled.match(result)) {
      navigate('/');
    }
  };

  return (
    <RegisterUI
      errorText={error ?? ''}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
