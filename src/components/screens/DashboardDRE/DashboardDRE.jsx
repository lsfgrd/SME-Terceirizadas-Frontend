import React, { Component } from "react";
import { Collapse } from "react-collapse";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Field, formValueSelector, reduxForm } from "redux-form";
import BaseButton, { ButtonStyle, ButtonType } from "../../Shareable/button";
import CardMatriculados from "../../Shareable/CardMatriculados";
import CardPendencia from "../../Shareable/CardPendencia/CardPendencia";
import CardStatusDeSolicitacao from "../../Shareable/CardStatusDeSolicitacao/CardStatusDeSolicitacao";
import { LabelAndCombo } from "../../Shareable/labelAndInput/labelAndInput";
import "../../Shareable/style.scss";
import TabelaHistoricoLotes from "../../Shareable/TabelaHistoricoLotes";
import "./style.scss";
import {
  getResumoPendenciasDREAlteracoesDeCardapio,
  getResumoPendenciasDREInclusaoDeAlimentacao,
  getResumoPendenciasDREInversaoDeDiaDeCardapio,
  getResumoPendenciasDREKitLanche,
  getResumoPendenciasDRESuspensaoDeAlimentacao,
  getResumoPendenciasDRESolicitacoesUnificadas
} from "../../../services/painelDRE.service";
import { meusDados as getMeusDados } from "../../../services/perfil.service";
import { dataAtual } from "../../../helpers/utilities";
import {
  DRE,
  ALTERACAO_CARDAPIO,
  INCLUSAO_ALIMENTACAO,
  INVERSAO_CARDAPIO,
  SOLICITACAO_KIT_LANCHE
} from "../../../configs/constants";
import { getResumoPendenciasDREPorLote } from "../../../services/painelDRE.service";
class DashboardDRE extends Component {
  constructor(props) {
    super(props);
    this.state = {
      autorizadasList: [],
      autorizadasListFiltered: [],
      pendentesList: [],
      pendentesListFiltered: [],
      collapsed: true,
      lotes: [
        {
          nome: "7A IP I IPIRANGA",
          tipo_de_gestao: "TERC TOTAL"
        },
        {
          nome: "7A IP II IPIRANGA",
          tipo_de_gestao: "TERC TOTAL"
        }
      ],
      resumoPendenciasDREAlteracoesDeCardapio: {},
      resumoPendenciasDREInclusoesDeAlimentacao: {},
      resumoPendenciasDREInversaoDeDiaDeCardapio: {},
      resumoPendenciasDREKitLanche: {},
      resumoPendenciasDRESuspensaoDeAlimentacao: {},
      resumoPendenciasDRESolicitacoesUnificadas: {},
      filtroPendencias: "sem_filtro",
      meusDados: [],
      loadingAutorizadas: true,
      loadingPendentes: true,
      loadingAlteracaoCardapio: true,
      loadingInclusoesAlimentacao: true,
      loadingInversoesCardapio: true,
      loadingKitLanche: true,
      loadingSuspensaoAlimentacao: true,
      loadingSolicitacoesUnificadas: true,
      //lotes: ["LOTE A (MOCK)", "LOTE B (MOCK)", "LOTE C (MOCK)"],
      visao: "tipo_solicitacao",
      resumoPorLote: []
    };
    this.alterarCollapse = this.alterarCollapse.bind(this);
    this.filterList = this.filterList.bind(this);
    this.changeFiltroPendencias = this.changeFiltroPendencias.bind(this);
    this.changeVisao = this.changeVisao.bind(this);
  }

  async carregaResumosPendencias(filtroPendencias) {
    this.setState({
      loadingAlteracaoCardapio: true,
      loadingInclusoesAlimentacao: true,
      loadingInversoesCardapio: true,
      loadingKitLanche: true,
      loadingSuspensaoAlimentacao: true,
      loadingSolicitacoesUnificadas: true,
      loadingResumoLotes: true
    });
    const minhaDRE = (await getMeusDados()).diretorias_regionais[0].uuid;
    const resumoPendenciasDREAlteracoesDeCardapio = await getResumoPendenciasDREAlteracoesDeCardapio(
      minhaDRE,
      filtroPendencias
    );
    const resumoPendenciasDREInclusoesDeAlimentacao = await getResumoPendenciasDREInclusaoDeAlimentacao(
      minhaDRE,
      filtroPendencias
    );
    const resumoPendenciasDREInversaoDeDiaDeCardapio = await getResumoPendenciasDREInversaoDeDiaDeCardapio(
      filtroPendencias
    );
    const resumoPendenciasDREKitLanche = await getResumoPendenciasDREKitLanche(
      filtroPendencias
    );
    const resumoPendenciasDRESuspensaoDeAlimentacao = await getResumoPendenciasDRESuspensaoDeAlimentacao(
      filtroPendencias
    );
    const resumoPendenciasDRESolicitacoesUnificadas = await getResumoPendenciasDRESolicitacoesUnificadas(
      filtroPendencias
    );

    let resumoPorLote = await getResumoPendenciasDREPorLote(
      minhaDRE,
      filtroPendencias
    );

    this.setState({
      resumoPendenciasDREAlteracoesDeCardapio,
      resumoPendenciasDREInclusoesDeAlimentacao,
      resumoPendenciasDREInversaoDeDiaDeCardapio,
      resumoPendenciasDREKitLanche,
      resumoPendenciasDRESuspensaoDeAlimentacao,
      resumoPendenciasDRESolicitacoesUnificadas,
      filtroPendencias,
      resumoPorLote,
      loadingAlteracaoCardapio: !resumoPendenciasDREAlteracoesDeCardapio,
      loadingInclusoesAlimentacao: !resumoPendenciasDREInclusoesDeAlimentacao,
      loadingInversoesCardapio: !resumoPendenciasDREInversaoDeDiaDeCardapio,
      loadingKitLanche: !resumoPendenciasDREKitLanche,
      loadingSuspensaoAlimentacao: !resumoPendenciasDRESuspensaoDeAlimentacao,
      loadingSolicitacoesUnificadas: !resumoPendenciasDRESolicitacoesUnificadas,
      loadingResumoLotes: false
    });
  }

  componentDidMount() {
    this.carregaResumosPendencias("sem_filtro");
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.autorizadasListFiltered.length !==
      this.props.autorizadasListFiltered.length
    )
      this.setState({
        autorizadasListFiltered: this.props.autorizadasListFiltered,
        autorizadasList: this.props.autorizadasList
      });

    if (
      prevProps.pendentesListFiltered.length !==
      this.props.pendentesListFiltered.length
    )
      this.setState({
        pendentesListFiltered: this.props.pendentesListFiltered,
        pendentesList: this.props.pendentesList
      });

    if (prevProps.loadingAutorizadas !== this.props.loadingAutorizadas) {
      this.setState({ loadingAutorizadas: this.props.loadingAutorizadas });
    }

    if (prevProps.loadingPendentes !== this.props.loadingPendentes) {
      this.setState({ loadingPendentes: this.props.loadingPendentes });
    }

    if (prevProps.lotesDRE !== this.props.lotesDRE) {
      this.setState({ lotesDRE: this.props.lotesDRE });
    }
  }

  filterList(event) {
    if (event === undefined) event = { target: { value: "" } };

    let autorizadasListFiltered = this.state.autorizadasList;
    autorizadasListFiltered = autorizadasListFiltered.filter(function(item) {
      const wordToFilter = event.target.value.toLowerCase();
      return item.text.toLowerCase().search(wordToFilter) !== -1;
    });

    let pendentesListFiltered = this.state.pendentesList;
    pendentesListFiltered = pendentesListFiltered.filter(function(item) {
      const wordToFilter = event.target.value.toLowerCase();
      return item.text.toLowerCase().search(wordToFilter) !== -1;
    });

    this.setState({ autorizadasListFiltered, pendentesListFiltered });
  }

  alterarCollapse() {
    this.setState({ collapsed: !this.state.collapsed });
  }

  changeFiltroPendencias(filtro) {
    this.carregaResumosPendencias(filtro);
  }

  changeVisao(visao) {
    this.setState({ visao });
  }

  render() {
    const {
      enrolled,
      handleSubmit,
      vision_by,
      canceladasList,
      recusadasList,
      filtro_por
    } = this.props;

    const {
      collapsed,
      lotesDRE,
      autorizadasListFiltered,
      pendentesListFiltered,
      resumoPendenciasDREAlteracoesDeCardapio,
      resumoPendenciasDREInclusoesDeAlimentacao,
      resumoPendenciasDREInversaoDeDiaDeCardapio,
      resumoPendenciasDRESuspensaoDeAlimentacao,
      resumoPendenciasDREKitLanche,
      resumoPendenciasDRESolicitacoesUnificadas,
      loadingAutorizadas,
      loadingPendentes,
      loadingAlteracaoCardapio,
      loadingInclusoesAlimentacao,
      loadingInversoesCardapio,
      loadingSuspensaoAlimentacao,
      loadingKitLanche,
      loadingSolicitacoesUnificadas,
      resumoPorLote,
      loadingResumoLotes
    } = this.state;

    return (
      <div>
        <form onSubmit={handleSubmit(this.props.handleSubmit)}>
          <Field component={"input"} type="hidden" name="uuid" />
          <CardMatriculados
            collapsed={collapsed}
            alterarCollapse={this.alterarCollapse}
            numeroAlunos={enrolled}
          >
            <Collapse isOpened={!collapsed}>
              <TabelaHistoricoLotes lotes={lotesDRE} />
            </Collapse>
          </CardMatriculados>
          <div className="card mt-3">
            <div className="card-body">
              <div className="card-title font-weight-bold title-color">
                Faça uma Solicitação Unificada
              </div>
              <p>Acesse o formulário para fazer uma Solicitação Unificada</p>
              <Link to="/dre/solicitacao-unificada">
                <BaseButton
                  label="Solicitação Unificada"
                  type={ButtonType.BUTTON}
                  style={ButtonStyle.OutlinePrimary}
                />
              </Link>
            </div>
          </div>
          <div className="card mt-3">
            <div className="card-body">
              <div className="card-title font-weight-bold dashboard-card-title">
                <span>
                  <i className="fas fa-thumbtack" />
                  Painel de Status de Solicitações
                  <i className="fas fa-pen" />
                </span>
                <span className="float-right">
                  <input
                    className="input-search"
                    placeholder="Pesquisar"
                    onChange={this.filterList}
                  />
                  <i className="fas fa-search" />
                </span>
              </div>
              <div>
                <p className="current-date">
                  Data: <span>{dataAtual()}</span>
                </p>
              </div>
              <div className="row">
                <div className="col-6">
                  <CardStatusDeSolicitacao
                    cardTitle={"Pendente Aprovação"}
                    cardType={"card-pending"}
                    solicitations={pendentesListFiltered}
                    icon={"fa-exclamation-triangle"}
                    href={`/${DRE}/solicitacoes-pendentes`}
                    loading={loadingPendentes}
                  />
                </div>
                <div className="col-6">
                  <CardStatusDeSolicitacao
                    cardTitle={"Autorizadas"}
                    cardType={"card-authorized"}
                    solicitations={autorizadasListFiltered}
                    icon={"fa-check"}
                    href={"/dre/solicitacoes-autorizadas"}
                    loading={loadingAutorizadas}
                  />
                </div>
              </div>
              <div className="row pt-3">
                {recusadasList.length > 0 && (
                  <div className="col-6">
                    <CardStatusDeSolicitacao
                      cardTitle={"Recusadas"}
                      cardType={"card-denied"}
                      solicitations={recusadasList}
                      icon={"fa-ban"}
                      href={"/dre/solicitacoes-recusadas"}
                    />
                  </div>
                )}

                {canceladasList.length > 0 && (
                  <div className="col-6">
                    <CardStatusDeSolicitacao
                      cardTitle={"Canceladas"}
                      cardType={"card-cancelled"}
                      solicitations={canceladasList}
                      icon={"fa-times-circle"}
                      href={"/dre/solicitacoes-canceladas"}
                    />
                  </div>
                )}
              </div>
              <p className="caption">Legenda</p>
              <div className="caption-choices">
                <span>
                  <i className="fas fa-check" />
                  Solicitação Autorizada
                </span>
                <span>
                  <i className="fas fa-exclamation-triangle" />
                  Solicitação Pendente Aprovação
                </span>
                <span>
                  <i className="fas fa-ban" />
                  Solicitação Recusada
                </span>
                <span>
                  <i className="fas fa-times-circle" />
                  Solicitação Cancelada
                </span>
              </div>
            </div>
          </div>
          <div className="card mt-3">
            <div className="card-body">
              <div className="card-title font-weight-bold dashboard-card-title">
                <div className="row">
                  <div className="col-3 mt-3">
                    <i className="fas fa-lock" />
                    Pendências
                  </div>
                  <div className="offset-3 col-3 text-right my-auto">
                    <LabelAndCombo
                      onChange={this.changeFiltroPendencias}
                      placeholder={"Filtro por"}
                      options={filtro_por}
                    />
                  </div>
                  <div className="col-3 text-right my-auto">
                    <LabelAndCombo
                      onChange={this.changeVisao}
                      placeholder={"Visão por"}
                      options={vision_by}
                    />
                  </div>
                </div>
              </div>
              {/* Visão por Tipo de Solicitação */}
              {this.state.visao === "tipo_solicitacao" && (
                <div>
                  <div className="pt-3" />
                  <div className="row">
                    <div className="col-6">
                      <Link to={`/${DRE}/${INCLUSAO_ALIMENTACAO}`}>
                        <CardPendencia
                          cardTitle={"Inclusão de Alimentação"}
                          totalOfOrders={
                            resumoPendenciasDREInclusoesDeAlimentacao.total
                          }
                          priorityOrders={
                            resumoPendenciasDREInclusoesDeAlimentacao.prioritario
                          }
                          onLimitOrders={
                            resumoPendenciasDREInclusoesDeAlimentacao.limite
                          }
                          regularOrders={
                            resumoPendenciasDREInclusoesDeAlimentacao.regular
                          }
                          loading={loadingInclusoesAlimentacao}
                        />
                      </Link>
                    </div>
                    <div className="col-6">
                      <Link to={`/${DRE}/${INVERSAO_CARDAPIO}`}>
                        <CardPendencia
                          cardTitle={"Inversão de Dia de Cardápio"}
                          totalOfOrders={
                            resumoPendenciasDREInversaoDeDiaDeCardapio.total
                          }
                          priorityOrders={
                            resumoPendenciasDREInversaoDeDiaDeCardapio.prioritario
                          }
                          onLimitOrders={
                            resumoPendenciasDREInversaoDeDiaDeCardapio.limite
                          }
                          regularOrders={
                            resumoPendenciasDREInversaoDeDiaDeCardapio.regular
                          }
                          loading={loadingInversoesCardapio}
                        />
                      </Link>
                    </div>
                  </div>
                  <div className="row pt-3">
                    <div className="col-6">
                      <Link to={`/${DRE}/${ALTERACAO_CARDAPIO}`}>
                        <CardPendencia
                          cardTitle={"Alteração de Cardápio"}
                          totalOfOrders={
                            resumoPendenciasDREAlteracoesDeCardapio.total
                          }
                          priorityOrders={
                            resumoPendenciasDREAlteracoesDeCardapio.prioritario
                          }
                          onLimitOrders={
                            resumoPendenciasDREAlteracoesDeCardapio.limite
                          }
                          regularOrders={
                            resumoPendenciasDREAlteracoesDeCardapio.regular
                          }
                          loading={loadingAlteracaoCardapio}
                        />
                      </Link>
                    </div>
                    <div className="col-6">
                      <Link to={`/${DRE}/${SOLICITACAO_KIT_LANCHE}`}>
                        <CardPendencia
                          cardTitle={"Kit Lanche"}
                          totalOfOrders={resumoPendenciasDREKitLanche.total}
                          priorityOrders={
                            resumoPendenciasDREKitLanche.prioritario
                          }
                          onLimitOrders={resumoPendenciasDREKitLanche.limite}
                          regularOrders={resumoPendenciasDREKitLanche.regular}
                          loading={loadingKitLanche}
                        />
                      </Link>
                    </div>
                  </div>
                  <div className="row pt-3">
                    <div className="col-6">
                      <CardPendencia
                        cardTitle={"Pedido Unificado"}
                        totalOfOrders={
                          resumoPendenciasDRESolicitacoesUnificadas.total
                        }
                        priorityOrders={
                          resumoPendenciasDRESolicitacoesUnificadas.prioritario
                        }
                        onLimitOrders={
                          resumoPendenciasDRESolicitacoesUnificadas.limite
                        }
                        regularOrders={
                          resumoPendenciasDRESolicitacoesUnificadas.regular
                        }
                        loading={loadingSolicitacoesUnificadas}
                      />
                    </div>
                    <div className="col-6">
                      <CardPendencia
                        priorityOrdersOnly={true}
                        cardTitle={"Suspensão de Refeição"}
                        totalOfOrders={
                          resumoPendenciasDRESuspensaoDeAlimentacao.total
                        }
                        priorityOrders={
                          resumoPendenciasDRESuspensaoDeAlimentacao.prioritario
                        }
                        onLimitOrders={
                          resumoPendenciasDRESuspensaoDeAlimentacao.limite
                        }
                        regularOrders={
                          resumoPendenciasDRESuspensaoDeAlimentacao.regular
                        }
                        loading={loadingSuspensaoAlimentacao}
                      />
                    </div>
                  </div>
                </div>
              )}
              {/* /Tipo de Solicitação */}

              {/* Visão por Lote */}
              {this.state.visao === "lote" && (
                <div className="row pt-3">
                  {this.state.lotesDRE.map(lote => {
                    return (
                      <div className="col-6">
                        <CardPendencia
                          cardTitle={lote.nome}
                          totalOfOrders={resumoPorLote[lote.nome]["TOTAL"]}
                          priorityOrders={
                            resumoPorLote[lote.nome]["PRIORITARIO"]
                          }
                          onLimitOrders={resumoPorLote[lote.nome]["LIMITE"]}
                          regularOrders={resumoPorLote[lote.nome]["REGULAR"]}
                          loading={loadingResumoLotes}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
              {/* /Lotes */}
            </div>
          </div>
        </form>
      </div>
    );
  }
}

const DashboardDREForm = reduxForm({
  form: "dashboardDRE",
  enableReinitialize: true
})(DashboardDRE);
const selector = formValueSelector("foodInclusion");
const mapStateToProps = state => {
  return {
    initialValues: state.foodInclusion.data,
    description_first_period: selector(state, "description_first_period"),
    description_second_period: selector(state, "description_second_period"),
    description_third_period: selector(state, "description_third_period"),
    description_fourth_period: selector(state, "description_fourth_period"),
    description_integrate: selector(state, "description_integrate")
  };
};

export default connect(mapStateToProps)(DashboardDREForm);
