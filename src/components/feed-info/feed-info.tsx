import { FC } from 'react';

import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';

import { useSelector } from '../../services/store';
import { selectFeed, selectFeedOrders } from '../../services/slices/feed-slice';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((order) => order.status === status)
    .slice(0, 10)
    .map((order) => order.number);

export const FeedInfo: FC = () => {
  const orders = useSelector(selectFeedOrders);
  const feed = useSelector(selectFeed);

  const readyOrders = getOrders(orders, 'done');
  const pendingOrders = getOrders(orders, 'pending');

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};
