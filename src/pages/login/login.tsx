import { FC, SyntheticEvent, useState } from 'react';

import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { loginUser, selectUserError } from '../../services/slices/user-slice';

export const Login: FC = () => {
  const dispatch = useDispatch();

  const error = useSelector(selectUserError);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    dispatch(
      loginUser({
        email,
        password
      })
    );
  };

  return (
    <LoginUI
      errorText={error ?? ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
