import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';

import '../../index.css';
import styles from './app.module.css';

import {
  AppHeader,
  IngredientDetails,
  Modal,
  OrderInfo,
  ProtectedRoute
} from '@components';

import { Preloader } from '@ui';

import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import type { Location } from 'react-router-dom';

import { useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';

import {
  fetchIngredients,
  selectIngredients,
  selectIngredientsError,
  selectIsIngredientsLoading
} from '../../services/slices/ingredients-slice';

import { authChecked, getUser } from '../../services/slices/user-slice';

type TLocationState = {
  background?: Location;
};

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const background = (location.state as TLocationState | null)?.background;

  const ingredients = useSelector(selectIngredients);
  const isIngredientsLoading = useSelector(selectIsIngredientsLoading);
  const error = useSelector(selectIngredientsError);

  useEffect(() => {
    dispatch(fetchIngredients());

    if (localStorage.getItem('refreshToken')) {
      dispatch(getUser());
    } else {
      dispatch(authChecked());
    }
  }, [dispatch]);

  const closeModal = () => {
    navigate(-1);
  };

  const constructorPage = isIngredientsLoading ? (
    <Preloader />
  ) : error ? (
    <div className={`${styles.error} text text_type_main-medium pt-4`}>
      {error}
    </div>
  ) : ingredients.length > 0 ? (
    <ConstructorPage />
  ) : (
    <div className={`${styles.title} text text_type_main-medium pt-4`}>
      Нет ингредиентов
    </div>
  );

  return (
    <div className={styles.app}>
      <AppHeader />

      {/* Основные страницы */}
      <Routes location={background || location}>
        <Route path='/' element={constructorPage} />

        <Route path='/feed' element={<Feed />} />
        <Route path='/feed/:number' element={<OrderInfo />} />

        <Route path='/ingredients/:id' element={<IngredientDetails />} />

        <Route
          path='/login'
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />

        <Route
          path='/register'
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />

        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />

        <Route
          path='/reset-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />

        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />

        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <OrderInfo />
            </ProtectedRoute>
          }
        />

        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {/* Модальные окна поверх фоновой страницы */}
      {background && (
        <Routes>
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={closeModal}>
                <IngredientDetails />
              </Modal>
            }
          />

          <Route
            path='/feed/:number'
            element={
              <Modal title='Информация о заказе' onClose={closeModal}>
                <OrderInfo />
              </Modal>
            }
          />

          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute>
                <Modal title='Информация о заказе' onClose={closeModal}>
                  <OrderInfo />
                </Modal>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
