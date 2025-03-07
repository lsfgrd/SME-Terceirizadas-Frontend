import React, { Component } from "react";
import HTTP_STATUS from "http-status-codes";
import { toastError, toastSuccess } from "../../../Shareable/dialogs";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { loadLote } from "../../../../reducers/lote.reducer";
import { Link, Redirect } from "react-router-dom";
import { Field, formValueSelector, reduxForm } from "redux-form";
import StatefulMultiSelect from "@khanacademy/react-multi-select";
import { ModalCadastroLote } from "./components/ModalCadastroLote";
import {
  LabelAndCombo,
  LabelAndInput
} from "../../../Shareable/labelAndInput/labelAndInput";
import BaseButton, { ButtonStyle, ButtonType } from "../../../Shareable/button";
import {
  getLote,
  criarLote,
  atualizarLote,
  excluirLote
} from "../../../../services/lote.service";
import { renderizarLabelEscola, renderizarLabelSubprefeitura } from "./helper";
import { extrairUUIDs } from "../../../../helpers/utilities";
import { required } from "../../../../helpers/fieldValidators";
import "../style.scss";

class CadastroLote extends Component {
  constructor(props) {
    super(props);
    this.state = {
      diretoria_regional: null,
      tipo_gestao: null,
      subprefeiturasSelecionadas: [],
      subprefeiturasSelecionadasNomes: [],
      escolasSelecionadasNomes: [],
      escolasSelecionadas: [],
      loading: true,
      uuid: null,
      redirect: false
    };
    this.exibirModal = this.exibirModal.bind(this);
    this.fecharModal = this.fecharModal.bind(this);
    this.excluirLote = this.excluirLote.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidUpdate() {
    const { loading, loteCarregado } = this.state;
    const {
      meusDados,
      lotes,
      diretoriasRegionais,
      escolas,
      tiposGestao,
      subprefeituras
    } = this.props;
    if (
      lotes !== [] &&
      diretoriasRegionais !== [] &&
      escolas !== [] &&
      tiposGestao !== [] &&
      subprefeituras !== [] &&
      meusDados !== null &&
      loading
    ) {
      this.setState({
        loading: false
      });
    }
    const urlParams = new URLSearchParams(window.location.search);
    const uuid = urlParams.get("uuid");
    if (uuid && !loading && !loteCarregado) {
      getLote(uuid).then(response => {
        if (response.status !== HTTP_STATUS.NOT_FOUND) {
          this.props.reset("loteForm");
          let subprefeiturasSelecionadasNomes = [];
          response.data.subprefeituras.forEach(subprefeitura => {
            subprefeiturasSelecionadasNomes.push(subprefeitura.nome);
          });
          let escolasSelecionadasNomes = [];
          response.data.escolas.forEach(escola => {
            escolasSelecionadasNomes.push(
              `${escola.codigo_eol} - ${escola.nome}`
            );
          });
          this.setState({
            diretoria_regional: response.data.diretoria_regional.nome,
            tipo_gestao: response.data.tipo_gestao.nome,
            subprefeiturasSelecionadas: extrairUUIDs(
              response.data.subprefeituras
            ),
            subprefeiturasSelecionadasNomes,
            escolasSelecionadasNomes,
            escolasSelecionadas: extrairUUIDs(response.data.escolas),
            loteCarregado: true,
            uuid
          });
          this.props.loadLote(response.data);
        } else {
          toastError("Lote não encontrado");
          this.setState({ loteCarregado: true });
        }
      });
    }
  }

  setRedirect() {
    this.setState({
      redirect: true
    });
  }

  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to="/configuracoes/cadastros/lotes-cadastrados" />;
    }
  };

  exibirModal() {
    this.setState({ exibirModal: true });
  }

  fecharModal(e) {
    this.setState({ exibirModal: false });
  }

  excluirLote() {
    if (window.confirm("Tem certeza que deseja excluir o lote?")) {
      excluirLote(this.state.uuid).then(
        res => {
          if (res.status === HTTP_STATUS.NO_CONTENT) {
            toastSuccess("Lote excluído com sucesso");
            this.setRedirect();
            this.resetForm();
          } else {
            toastError("Houve um erro ao excluir o lote");
          }
        },
        function(error) {
          toastError("Houve um erro ao excluir o lote");
        }
      );
    }
  }

  onDiretoriaRegionalSelected(value) {
    let diretoriasRegionais = this.props.diretoriasRegionais;
    const indice = diretoriasRegionais.findIndex(
      diretoria_regional => diretoria_regional.uuid === value
    );
    this.setState({ diretoria_regional: diretoriasRegionais[indice].nome });
  }

  onSubprefeiturasSelected(values) {
    let subprefeituras = this.props.subprefeituras;
    let subprefeiturasSelecionadasNomes = [];
    values.forEach(value => {
      const indice = subprefeituras.findIndex(
        subprefeitura => subprefeitura.value === value
      );
      subprefeiturasSelecionadasNomes.push(subprefeituras[indice].label);
    });
    this.setState({
      subprefeiturasSelecionadas: values,
      subprefeiturasSelecionadasNomes
    });
  }

  onTipoGestaoSelected(value) {
    let tiposGestao = this.props.tiposGestao;
    const indice = tiposGestao.findIndex(
      tipo_gestao => tipo_gestao.uuid === value
    );
    this.setState({ tipo_gestao: tiposGestao[indice].nome });
  }

  onEscolasSelected(values) {
    const escolas = this.props.escolas;
    let escolasSelecionadasNomes = [];
    values.forEach(value => {
      const indice = escolas.findIndex(escola => escola.value === value);
      escolasSelecionadasNomes.push(escolas[indice].label);
    });
    this.setState({ escolasSelecionadas: values, escolasSelecionadasNomes });
  }

  resetForm(event) {
    ["nome", "iniciais", "diretoria_regional", "tipo_gestao"].forEach(
      element => {
        this.props.change(element, "");
      }
    );
    this.setState({
      subprefeiturasSelecionadas: [],
      subprefeiturasSelecionadasNomes: [],
      escolasSelecionadas: [],
      escolasSelecionadasNomes: []
    });
  }

  onSubmit(values) {
    values.escolas = this.state.escolasSelecionadas;
    values.subprefeituras = this.state.subprefeiturasSelecionadas;
    values.diretoria_regional = this.props.diretoria_regional;
    values.tipo_gestao = this.props.tipo_gestao;
    if (!this.state.uuid) {
      criarLote(JSON.stringify(values)).then(
        res => {
          if (res.status === HTTP_STATUS.CREATED) {
            toastSuccess("Lote salvo com sucesso");
            this.setRedirect();
            this.resetForm();
          } else {
            toastError("Houve um erro ao salvar o lote");
          }
        },
        function(error) {
          toastError("Houve um erro ao salvar o lote");
        }
      );
      this.fecharModal();
    } else {
      atualizarLote(JSON.stringify(values), this.state.uuid).then(
        res => {
          if (res.status === HTTP_STATUS.OK) {
            toastSuccess("Lote atualizado com sucesso");
            this.setRedirect();
            this.resetForm();
          } else {
            toastError("Houve um erro ao atualizar o lote");
          }
        },
        function(error) {
          toastError("Houve um erro ao atualizar o lote");
        }
      );
      this.fecharModal();
    }
  }

  render() {
    const {
      handleSubmit,
      diretoriasRegionais,
      escolas,
      tiposGestao,
      subprefeituras,
      nome,
      iniciais
    } = this.props;
    const {
      escolasSelecionadas,
      subprefeiturasSelecionadas,
      escolasSelecionadasNomes,
      subprefeiturasSelecionadasNomes,
      exibirModal,
      diretoria_regional,
      tipo_gestao,
      uuid
    } = this.state;
    return (
      <div className="cadastro pt-3">
        {this.renderRedirect()}
        <ModalCadastroLote
          closeModal={this.fecharModal}
          showModal={exibirModal}
          diretoria_regional={diretoria_regional}
          subprefeituras={subprefeiturasSelecionadasNomes}
          nome={nome}
          atualizando={uuid !== null}
          iniciais={iniciais}
          tipo_gestao={tipo_gestao}
          escolasSelecionadas={escolasSelecionadasNomes}
          onSubmit={this.onSubmit}
        />
        <form onSubmit={handleSubmit}>
          <div className="card">
            <div className="card-body">
              <div className="row">
                <div className="col-12">
                  <label className="font-weight-bold">Dados do Lote</label>
                </div>
              </div>
              <div className="row pt-3">
                <div className="col-12">
                  <Link to="/configuracoes/cadastros/lotes-cadastrados">
                    <BaseButton
                      label="Consulta de lotes cadastrados"
                      style={ButtonStyle.OutlinePrimary}
                    />
                  </Link>
                </div>
              </div>
              <div className="row pt-3">
                <div className="col-8">
                  <label className="label">
                    <span>* </span>DRE
                  </label>
                  <Field
                    component={LabelAndCombo}
                    name="diretoria_regional"
                    onChange={value => this.onDiretoriaRegionalSelected(value)}
                    options={diretoriasRegionais}
                    validate={required}
                  />
                </div>
              </div>
              <div className="row pt-3">
                <div className="col-8">
                  <label className="label">Subprefeitura</label>
                  {subprefeituras.length ? (
                    <Field
                      component={StatefulMultiSelect}
                      name="subprefeituras"
                      selected={subprefeiturasSelecionadas}
                      options={subprefeituras}
                      valueRenderer={(selected, options) =>
                        renderizarLabelSubprefeitura(selected, options)
                      }
                      onSelectedChanged={value =>
                        this.onSubprefeiturasSelected(value)
                      }
                      overrideStrings={{
                        search: "Busca",
                        selectSomeItems: "Selecione",
                        allItemsAreSelected:
                          "Todos os itens estão selecionados",
                        selectAll: "Todos"
                      }}
                    />
                  ) : (
                    <div className="col-12">Carregando subprefeituras..</div>
                  )}
                </div>
              </div>
              <div className="row pt-3">
                <div className="col-4">
                  <label className="label">
                    <span>* </span>Nome do Lote (Iniciais da DRE)
                  </label>
                  <Field
                    component={LabelAndInput}
                    className="form-control"
                    name="iniciais"
                    validate={required}
                  />
                </div>
                <div className="col-4">
                  <label className="label">
                    <span>* </span>Nº do Lote
                  </label>
                  <Field
                    component={LabelAndInput}
                    className="form-control"
                    name="nome"
                    validate={required}
                  />
                </div>
                <div className="col-4">
                  <label className="label">
                    <span>* </span>Tipo de Gestão
                  </label>
                  <Field
                    component={LabelAndCombo}
                    name="tipo_gestao"
                    onChange={value => this.onTipoGestaoSelected(value)}
                    options={tiposGestao}
                  />
                </div>
              </div>
              <div className="row pt-3">
                <div className="col-12">
                  <label className="label">Unidades Específicas do Lote</label>
                  {escolas.length ? (
                    <Field
                      component={StatefulMultiSelect}
                      name="escolas"
                      selected={escolasSelecionadas}
                      options={escolas}
                      valueRenderer={(selected, options) =>
                        renderizarLabelEscola(selected, options)
                      }
                      onSelectedChanged={value => this.onEscolasSelected(value)}
                      overrideStrings={{
                        search: "Busca",
                        selectSomeItems: "Selecione",
                        allItemsAreSelected:
                          "Todos os itens estão selecionados",
                        selectAll: "Todos"
                      }}
                    />
                  ) : (
                    <div className="col-12">Carregando escolas..</div>
                  )}
                </div>
              </div>
              {escolasSelecionadasNomes.length > 0 && (
                <div className="row pt-3">
                  <div className="col-12">
                    <label className="label-selected-unities">
                      Unidades Específicas do Lote Selecionadas
                    </label>
                    {escolasSelecionadasNomes.map((escola, indice) => {
                      return (
                        <div className="value-selected-unities" key={indice}>
                          {escola}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              <div style={{ marginTop: "100px" }} className="row float-right">
                <div className="col-12">
                  {!uuid && (
                    <BaseButton
                      label="Cancelar"
                      onClick={event => this.resetForm(event)}
                      style={ButtonStyle.OutlinePrimary}
                      noBorder
                    />
                  )}
                  {uuid && (
                    <BaseButton
                      label="Excluir"
                      onClick={this.excluirLote}
                      style={ButtonStyle.OutlinePrimary}
                    />
                  )}
                  <BaseButton
                    label={"Salvar"}
                    onClick={this.exibirModal}
                    className="ml-3"
                    type={ButtonType.BUTTON}
                    style={ButtonStyle.Primary}
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

const loteForm = reduxForm({
  form: "loteForm",
  enableReinitialize: true
})(CadastroLote);
const selector = formValueSelector("loteForm");
const mapStateToProps = state => {
  return {
    initialValues: state.loteForm.data,
    diretoria_regional: selector(state, "diretoria_regional"),
    nome: selector(state, "nome"),
    iniciais: selector(state, "iniciais"),
    tipo_gestao: selector(state, "tipo_gestao")
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      loadLote
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(loteForm);
