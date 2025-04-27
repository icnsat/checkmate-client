import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // if (!isAuthenticated) {
  //   // Если не авторизован - отправляем на страницу логина
  //   return <Navigate to="/" replace />;
  // }

  if (!allowedRoles.includes(user.role)) {
    // Если роль не разрешена - можно отправить на главную или показать 403 страницу
    return <Navigate to="/" replace />;
  }

  // Иначе отдаем дочерние элементы
  return children;
};

export default ProtectedRoute;
