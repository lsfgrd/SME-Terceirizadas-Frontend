import React from "react";
import Breadcrumb from "../../../components/Shareable/Breadcrumb";
import Page from "../../../components/Shareable/Page/Page";
import Container from "../../../components/SuspensaoDeAlimentacao/Terceirizada/PainelPedidos/Container";
import { HOME } from "../constants";
import { TERCEIRIZADA, SUSPENSAO_ALIMENTACAO } from "../../../configs/RoutesConfig";

const atual = {
  href: `/${TERCEIRIZADA}/${SUSPENSAO_ALIMENTACAO}`,
  titulo: "Suspensão de Alimentação"
};

export default () => (
  <Page>
    <Breadcrumb home={HOME} atual={atual} />
    <Container />
  </Page>
);
