import { FC, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';

import { useDispatch, useSelector } from '../../services/store';
import { selectIngredients } from '../../services/slices/ingredients-slice';
import { selectFeedOrders } from '../../services/slices/feed-slice';
import { selectProfileOrders } from '../../services/slices/profile-orders-slice';

import {
  getOrderByNumber,
  selectOrderByNumber,
  selectOrderByNumberRequest
} from '../../services/slices/order-slice';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const dispatch = useDispatch();

  const ingredients = useSelector(selectIngredients);
  const feedOrders = useSelector(selectFeedOrders);
  const profileOrders = useSelector(selectProfileOrders);

  const requestedOrder = useSelector(selectOrderByNumber);
  const isOrderLoading = useSelector(selectOrderByNumberRequest);

  const orderNumber = Number(number);

  const orderFromLists = [...feedOrders, ...profileOrders].find(
    (order) => order.number === orderNumber
  );

  const orderData =
    orderFromLists ??
    (requestedOrder?.number === orderNumber ? requestedOrder : undefined);

  useEffect(() => {
    if (Number.isFinite(orderNumber) && !orderData && !isOrderLoading) {
      dispatch(getOrderByNumber(orderNumber));
    }
  }, [dispatch, orderData, orderNumber, isOrderLoading]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) {
      return null;
    }

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);

          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count += 1;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
