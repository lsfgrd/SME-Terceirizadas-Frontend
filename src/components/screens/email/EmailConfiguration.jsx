import React, { Component } from "react";
import { Field, reduxForm } from "redux-form";
import { email, required } from "../../../helpers/fieldValidators";
import {
  getEmailConfiguration,
  setEmailConfiguration,
  testEmailConfiguration
} from "../../../services/email";
import BaseButton, { ButtonStyle, ButtonType } from "../../Shareable/button";
import { toastError, toastSuccess } from "../../Shareable/dialogs";
import {
  LabelAndCombo,
  LabelAndInput
} from "../../Shareable/labelAndInput/labelAndInput";
import IsVisible from "../../Shareable/layout";
import { generateOptions, SECURITY_OPTIONS } from "./helper";
import { ModalCancelarConfigEmail } from "../../Shareable/ModalCancelarConfigEmail";
import "./style.scss";

class EmailConfiguration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showTest: false,
      response: {
        error: "",
        default: ""
      },
      showModal: false
    };
    this.showModal = this.showModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  showModal() {
    this.setState({ showModal: true });
  }

  closeModal(e) {
    this.setState({ showModal: false });
  }

  onSubmit(values) {
    switch (values.security) {
      case SECURITY_OPTIONS.TLS:
        values.use_tls = true;
        values.use_ssl = false;
        break;
      case SECURITY_OPTIONS.SSL:
        values.use_tls = false;
        values.use_ssl = true;
        break;
      default:
        break;
    }
    const resp = setEmailConfiguration(values);
    resp
      .then(() => {
        toastSuccess(
          "Salvo com sucesso! Por favor, teste para ver se deu tudo certo."
        );
      })
      .catch(() => {
        toastError("Ops! Algo deu errado...");
      });
  }

  onTestConfiguration(toEmail) {
    const prom = testEmailConfiguration(toEmail);
    prom.then(resp => {
      this.setState({ response: resp });
      this.emailAlert();
    });
  }

  emailAlert() {
    const error = this.state.response.error;
    const detail = this.state.response.detail;
    if (error) {
      toastError(error);
    } else {
      toastSuccess(detail);
    }
  }

  componentDidMount() {
    const conf = getEmailConfiguration();
    conf
      .then(resp => {
        this.props.reset();
        this.props.change("username", resp.username);
        this.props.change("from_email", resp.from_email);
        this.props.change("host", resp.host);
        this.props.change("port", resp.port);
        this.props.change("password", resp.password);
        if (resp.use_tls) {
          this.props.change("security", SECURITY_OPTIONS.TLS);
        }
        if (resp.use_ssl) {
          this.props.change("security", SECURITY_OPTIONS.SSL);
        }
        this.setState({ showTest: true });
      })
      .catch(resp => {
        console.log("error", resp);
        this.setState({ showTest: false });
      });
  }

  render() {
    const { showModal } = this.state;
    const { handleSubmit, pristine, submitting } = this.props;
    return (
      <div className="mt-3">
        <ModalCancelarConfigEmail
          showModal={showModal}
          closeModal={this.closeModal}
          closeOnly={this.closeOnly}
        />
        <form>
          <div className="border rounded p-3 card">
            <div className="form-group row">
              <Field
                component={LabelAndInput}
                label="Usuário"
                type="e-mail"
                name="username"
                validate={email}
                placeholder="contato@sme.prefeitura.sp.gov.br"
                cols="6 6 6 6"
              />
              <Field
                component={LabelAndInput}
                label="Senha"
                type="password"
                name="password"
                validate={required}
                cols="6 6 6 6"
              />
            </div>
          </div>
          <div className="border rounded p-3 mt-3 card">
            <div className="form-group row">
              <Field
                component={LabelAndInput}
                cols="6 6 6 6"
                label="Remetente padrão"
                name="from_email"
                validate={email}
                placeholder="contato@sme.prefeitura.sp.gov.br"
              />
            </div>
            <div className="form-group row">
              <Field
                component={LabelAndInput}
                cols="6 6 6 6"
                label="Servidor SMTP"
                validate={required}
                placeholder="smtp.sme.prefeitura.sp.gov.br"
                name="host"
              />
              <Field
                component={LabelAndCombo}
                cols="2 2 2 2"
                options={generateOptions(["", "587", "465", "25"])}
                label="Porta"
                name="port"
              />
              <Field
                component={LabelAndCombo}
                cols="2 2 2 2"
                options={generateOptions([
                  "",
                  SECURITY_OPTIONS.SSL,
                  SECURITY_OPTIONS.TLS
                ])}
                label="Segurança"
                name="security"
              />
            </div>
            <IsVisible isVisible={this.state.showTest}>
              <div className="form-group row">
                <Field
                  component={LabelAndInput}
                  name="testEmail"
                  cols="3 3 3 3"
                  label="Insira um email pessoal para testar"
                  validate={email}
                  placeholder="seu-email@sme.com"
                />
              </div>
            </IsVisible>

            <div className="form-group button-botton-card">
              <BaseButton
                label="Cancelar"
                type={ButtonType.BUTTON}
                className="mr-2"
                style={ButtonStyle.OutlinePrimary}
                onClick={this.showModal}
              />
              <BaseButton
                label="Testar"
                type={ButtonType.SUBMIT}
                disabled={pristine || submitting}
                style={ButtonStyle.OutlinePrimary}
                onClick={handleSubmit(values =>
                  this.onTestConfiguration(values.testEmail)
                )}
              />
              <BaseButton
                label="Salvar"
                type={ButtonType.SUBMIT}
                className="ml-2"
                onClick={handleSubmit(values =>
                  this.onSubmit({
                    ...values
                  })
                )}
                style={ButtonStyle.Primary}
              />
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default (EmailConfiguration = reduxForm({
  form: "emailConfiguration",
  destroyOnUnmount: false
})(EmailConfiguration));
