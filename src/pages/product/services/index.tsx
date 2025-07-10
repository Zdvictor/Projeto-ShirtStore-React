import { IRandomProductResult } from "../../../interfaces/products/otherProducts"
import { IProducts } from "../../../interfaces/products/products"
import { IReviews } from "../../../interfaces/reviews/reviews"

//API
import api from "../../../services/api"

export const fetchProducts = async (slug: string | undefined): Promise<IProducts> => {

    const response = await api.get(`/product/slug/${slug}`)

    return response.data

}

export const fetchReviews = async (slug: string | undefined): Promise<IReviews> => {

    const response = await api.get(`/review/slug/${slug}`)

    return response.data

}

export const fetchOtherProducts = async (): Promise<IRandomProductResult> => {
    const response = await api.get<IProducts[]>('/products'); // Agora está como array
    const {products, reviews} = await randomProduct(response.data); // Agora o response.data está correto
    console.log(products, reviews);
    
    // Retorna como objeto
    return { products, reviews };
  };


  export  const randomProduct = async (products: IProducts[]): Promise<IRandomProductResult> => {
    const maxNumber = products.length;
    const uniqueNumbers: number[] = [];
  
    // Gera 4 números únicos aleatórios
    while (uniqueNumbers.length < 4) {
      const randomNumber = Math.floor(Math.random() * maxNumber);
      if (!uniqueNumbers.includes(randomNumber)) {
        uniqueNumbers.push(randomNumber);
      }
    }
  
    // Obtém os produtos correspondentes aos índices sorteados
    const selectedProducts: IProducts[] = uniqueNumbers.map(index => products[index]);
  
    // Extrai os IDs dos produtos selecionados
    const allIds = selectedProducts.map(product => product.id);
  
    // Faz requisições simultâneas para pegar as reviews
    const reviewsResponses = await Promise.all(
      allIds.map(id => api.get<IReviews>(`/review/${id}`))
    );
  
    // Extrai as respostas das reviews
    const reviews: IReviews[] = reviewsResponses.map(response => response.data);
  
    // Agora produtos e reviews têm o mesmo índice
    return { products: selectedProducts, reviews };
  };