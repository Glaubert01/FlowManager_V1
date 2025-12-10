// Este arquivo é mockado e não faz chamadas HTTP reais.
// Ele apenas simula a estrutura de um cliente Axios.
const api = {
  get: async (url: string, config?: any) => {
    console.log(`MOCK API: GET ${url}`, config);
    return { data: [] }; // Retorna dados vazios por padrão
  },
  post: async (url: string, data?: any, config?: any) => {
    console.log(`MOCK API: POST ${url}`, data, config);
    return { data: {} }; // Retorna objeto vazio por padrão
  },
  patch: async (url: string, data?: any, config?: any) => {
    console.log(`MOCK API: PATCH ${url}`, data, config);
    return { data: {} }; // Retorna objeto vazio por padrão
  },
};

export default api;
