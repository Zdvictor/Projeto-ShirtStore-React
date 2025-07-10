import axios from "axios";
const apiKey: string = import.meta.env.VITE_API_KEY;
  export const getCoordinates = async (cep: string) => {
    try {
      const url = `https://api.opencagedata.com/geocode/v1/json?q=${cep}&key=${apiKey}&countrycode=BR`;
      const response = await axios.get(url);
  
      if (response.data.results.length === 0) {
        throw new Error("Nenhuma coordenada encontrada para o CEP fornecido.");
      }
  
      const { lat, lng } = response.data.results[0].geometry;
  
  
      return { lat, lng };
    } catch (error) {
      console.error("Erro ao obter coordenadas:", error);
      throw error;
    }
  };