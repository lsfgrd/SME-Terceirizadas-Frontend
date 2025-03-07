import { API_URL } from "../constants/config.constants";
import authService from "./auth";

const authToken = {
  Authorization: `JWT ${authService.getToken()}`,
  "Content-Type": "application/json"
};

export const getPeriods = user_uuid => {
  // TODO: pegar periodos escolares da escola ex: escolas/periodos
  const url = `${API_URL}/periodos-escolares/`;
  const OBJ_REQUEST = {
    headers: authToken,
    method: "GET"
  };
  return fetch(url, OBJ_REQUEST)
    .then(result => {
      return result.json();
    })
    .catch(error => {
      return error.json();
    });
};

export const getEscolas = () => {
  const url = `${API_URL}/escolas/`;
  const OBJ_REQUEST = {
    headers: authToken,
    method: "GET"
  };
  return fetch(url, OBJ_REQUEST)
    .then(result => {
      return result.json();
    })
    .catch(error => {
      return error.json();
    });
};

export const getEscolasSimples = () => {
  const url = `${API_URL}/escolas-simples/?limit=1034`;
  const OBJ_REQUEST = {
    headers: authToken,
    method: "GET"
  };
  return fetch(url, OBJ_REQUEST)
    .then(result => {
      return result.json();
    })
    .catch(error => {
      return error.json();
    });
};

export const getEscolasCombo = () => {
  const url = `${API_URL}/escolas-combo/?limit=1034`;
  const OBJ_REQUEST = {
    headers: authToken,
    method: "GET"
  };
  return fetch(url, OBJ_REQUEST)
    .then(result => {
      return result.json();
    })
    .catch(error => {
      return error.json();
    });
};

export const getTiposGestao = () => {
  const url = `${API_URL}/tipos-gestao/`;
  const OBJ_REQUEST = {
    headers: authToken,
    method: "GET"
  };
  return fetch(url, OBJ_REQUEST)
    .then(result => {
      return result.json();
    })
    .catch(error => {
      return error.json();
    });
};

export const getSubprefeituras = () => {
  const url = `${API_URL}/subprefeituras/`;
  const OBJ_REQUEST = {
    headers: authToken,
    method: "GET"
  };
  return fetch(url, OBJ_REQUEST)
    .then(result => {
      return result.json();
    })
    .catch(error => {
      return error.json();
    });
};

