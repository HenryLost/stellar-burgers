import { FC, useEffect } from 'react';

import { Preloader } from '@ui';
import { ProfileOrdersUI } from '@ui-pages';

import { useDispatch, useSelector } from '../../services/store';
import {
  fetchProfileOrders,
  selectProfileOrders,
  selectProfileOrdersError,
  selectProfileOrdersLoading
} from '../../services/slices/profile-orders-slice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();

  const orders = useSelector(selectProfileOrders);
  const isLoading = useSelector(selectProfileOrdersLoading);
  const error = useSelector(selectProfileOrdersError);

  useEffect(() => {
    dispatch(fetchProfileOrders());
  }, [dispatch]);

  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
    return <p className='text text_type_main-medium'>{error}</p>;
  }

  return <ProfileOrdersUI orders={orders} />;
};
