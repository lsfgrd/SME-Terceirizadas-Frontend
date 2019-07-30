import PropTypes from "prop-types";
import React, { Component } from "react";
import Button, { ButtonStyle } from "../Shareable/button";
import If from "../Shareable/layout";
import { solicitarKitsLanche } from "../../services/tourRequest.service";
import { toastSuccess, toastError } from "../Shareable/dialogs";

import {convertTempoPasseio} from './helper';

export class TourRequestItemList extends Component {
  constructor(props) {
    super(props);
    this.state = { checkedObjects: [] };
    this.onCheckChange = this.onCheckChange.bind(this);
  }

  styleTitle = {
    color: "#353535",
    fontFamily: "Roboto",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "18px",
    lineLeight: "21px"
  };

  static propTypes = {
    tourRequestList: PropTypes.arrayOf(
      PropTypes.shape({
        obs: PropTypes.string,
        status: PropTypes.string.isRequired,
        salvo_em: PropTypes.string.isRequired,
        id: PropTypes.number,
        tempo_passeio: PropTypes.string.isRequired,
        kit_lanche: PropTypes.array.isRequired,
        nro_alunos: PropTypes.string.isRequired
      })
    )
  };

  onCheckChange(event, object) {
    let { checkedObjects } = this.state;
    if (event.target.checked) {
      checkedObjects.push(object);
      this.setState({ checkedObjects });
    } else {
      checkedObjects = checkedObjects.filter(obj => {
        return obj.id !== object.id;
      });
      this.setState({ checkedObjects });
    }
  }

  OnDeleteButtonClicked(id) {
    // faz o pai apagar o elemento
    // atualiza o estado do componente e limpa o form do pai
    this.props.OnDeleteButtonClicked(id);
    let { checkedObjects } = this.state;
    checkedObjects = checkedObjects.filter(obj => {
      return obj.id !== id;
    });
    this.setState({ checkedObjects });
    this.props.resetForm();
  }

  onEnviarSolicitacoesBtClicked(event) {
    const listIds = [];
    this.state.checkedObjects.forEach(obj => {
      listIds.push(obj.id);
    });

    if (listIds.length > 0) {
      solicitarKitsLanche(listIds).then(resp => {
        this.props.refreshComponent();
        if (resp.success) {
          toastSuccess(resp.success);
        } else {
          toastError(resp.error);
        }
      });
    }
  }

  render() {
    const { tourRequestList } = this.props;
    const allDaysInfo = tourRequestList.map(tourRequest => {
      const {
        status,
        salvo_em,
        id,
        tempo_passeio,
        nro_alunos,
        local_passeio,
        evento_data
      } = tourRequest;
      let backgroundColor = status === "SALVO" ? "#82B7E8" : "#DADADA";
      return (
        <div className="card border rounded mt-3 p-3" key={id}>
          <div className="mt-2">
            <label style={this.styleTitle} className="bold ml-3">
              Solicitação de Kit Lanche/Passeio{" "}
              {`${convertTempoPasseio(tempo_passeio)}`}
            </label>
            <span
              className="ml-3 p-1 border rounded"
              style={{ background: backgroundColor }}
            >
              salvo
            </span>
            <div className="float-right">
              <input
                className="float-right mt-2 mr-3"
                type="checkbox"
                name={id}
                id={id}
                onClick={event => this.onCheckChange(event, tourRequest)}
              />
            </div>
            <div className="ml-3">
              <div>
                <label>
                  Data do evento: <b>{evento_data}</b> Local do passeio:{" "}
                  <b>{local_passeio}</b>
                </label>
                <div className="icon-draft-card float-right">
                  Salvo em: {salvo_em}
                  <span onClick={p => this.OnDeleteButtonClicked(id)}>
                    <i className="fas fa-trash" />
                  </span>
                  <span
                    onClick={p => this.props.OnEditButtonClicked(tourRequest)}
                  >
                    <i className="fas fa-edit" />
                  </span>
                </div>
              </div>
              <label>
                Nº de Alunos participantes: <b>{nro_alunos}</b>
              </label>
            </div>
          </div>
        </div>
      );
    });
    return (
      <div>
        {allDaysInfo}
        <If isVisible={this.props.tourRequestList.length >= 1}>
          <div className="float-right mt-2">
            <Button
              style={ButtonStyle.Primary}
              label="Enviar solicitações"
              disabled={this.state.checkedObjects.length === 0}
              onClick={event => this.onEnviarSolicitacoesBtClicked(event)}
            />
          </div>
        </If>
      </div>
    );
  }
}
