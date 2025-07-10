import { BrowserRouter as Router } from "react-router-dom";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import RouterApp from "./routes";

import Header from "./components/header";
import Footer from "./components/footer";
import { ScrollToTop } from "./components/scroll/ScrollToTop";

// REACT-ICONS
import { FaWhatsapp } from "react-icons/fa";

// PROVIDER
import { Provider } from "react-redux";

// STORE
import store from "./redux/store";

// REDUX
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./redux/store";
import { fetchAllProducts, fetchBestOffersProducts, fetchLendaryJerseysProducts,  } from "./redux/reducers/productsReducer";
import { checkedLogin } from "./redux/reducers/authReducer";


// QUERY
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// TOASTIFY
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { handleListCart } from "./redux/reducers/cartReducer";
import BottomNavbar from "./components/navbar";
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 1000 * 60 * 5,
    },
  },
});

const AppContent: React.FC = () => {

  const {user, loading} = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    
    const fetchAllProduct = async () => {

      try {

        await Promise.all([

          dispatch(fetchAllProducts()),
          dispatch(fetchBestOffersProducts()),
          dispatch(fetchLendaryJerseysProducts())

        ])

        

      }catch(err) {

        console.log(err)
      }

    }

    fetchAllProduct()

  },[dispatch])

  useEffect(() => {
    const verifyLogin = async () => {
      try {
        await dispatch(checkedLogin())

      } catch (error: unknown) {

        console.log(error)
        toast.error("Erro ao verificar login");

      }

    };

    verifyLogin();
  }, [dispatch]);

  useEffect(() => {
    
    const fetchDataCart = async () => {

      if(user) {

        await dispatch(handleListCart(user.id))

      }
    }

    fetchDataCart()

  }, [user, dispatch])

  useEffect(() => {

    setTimeout(() => {

      if (user && !user?.hasValidated && !loading) {
        toast.warning(
          "Por favor, valide seu e-mail para garantir a continuidade da sua conta. Caso contrário, ela poderá ser excluída.",
          { autoClose: 5000 }
        );
      }

    }, 3500)
    
  }, [user, loading]); 



  const { pathname } = useLocation();

  return (
    <>
      {pathname !== "/register" &&
        pathname !== "/login" &&
        pathname !== "/forgot-password" &&
        pathname !== "/validate" && 
        <Header />}
        {/*pathname !== "/profile" && */}

      <RouterApp />

      <FaWhatsapp
        onClick={() =>
          window.open(
            `https://api.whatsapp.com/send?phone=5515991105703&text=${encodeURIComponent(
              "Olá, gostaria de saber mais sobre as camisas"
            )}`
          )
        }
        title="Whatsapp"
        className="fixed bottom-0 right-0 cursor-pointer sm:bottom-10 sm:right-20"
        color="#25D366"
        size={50}
      />

      {pathname !== "/register" &&
        pathname !== "/login" &&
        pathname !== "/forgot-password" &&
        pathname !== "/validate" && <Footer />}
        <BottomNavbar />
    </>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <ToastContainer autoClose={3000} />
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <ScrollToTop />
          <AppContent />
        </QueryClientProvider>
      </Provider>
    </Router>
  );
};

export default App;
