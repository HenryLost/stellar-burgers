import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';

import { useSelector } from '../../services/store';
import { selectUser } from '../../services/slices/user-slice';

export const Profile: FC = () => {
  const user = useSelector(selectUser);

  const userName = user?.name ?? '';
  const userEmail = user?.email ?? '';

  const [formValue, setFormValue] = useState({
    name: userName,
    email: userEmail,
    password: ''
  });

  useEffect(() => {
    setFormValue({
      name: userName,
      email: userEmail,
      password: ''
    });
  }, [userName, userEmail]);

  const isFormChanged =
    formValue.name !== userName ||
    formValue.email !== userEmail ||
    formValue.password !== '';

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();

    setFormValue({
      name: userName,
      email: userEmail,
      password: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
