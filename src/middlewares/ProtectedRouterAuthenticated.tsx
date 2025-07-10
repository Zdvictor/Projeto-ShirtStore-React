import { FC, ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import Loading from "../components/loading";

const ProtectedRouterAuthenticated: FC<{ children: ReactNode }> = ({ children }) => {
  const { user, loading } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && !loading) {
      navigate("/login"); // Redireciona apenas quando `user` não está autenticado e não está carregando
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex w-full h-full items-center justify-center text-7xl mt-52 mb-96">
        <Loading />
      </div>
    );
  }

  if (!user) {
    return null; // Retorna nulo enquanto o redirecionamento é processado
  }

  return <>{children}</>;
};

export default ProtectedRouterAuthenticated;
