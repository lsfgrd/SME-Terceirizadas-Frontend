import React, { Component } from "react";
import { CardKit } from "./CardKit";
import { getKitLanches } from "../../../../services/solicitacaoDeKitLanche.service";
import "./style.scss";

export class OpcoesKits extends Component {
  constructor(props) {
    super(props);
    this.state = {
      kitsLanche: null,
      kitsChecked: []
    };
    this.onCardChange = this.onCardChange.bind(this);
  }

  componentDidMount() {
    getKitLanches().then(response => {
      this.setState({
        kitsLanche: response.results
      });
    });
  }

  onCardChange(uuid) {
    let kitsChecked = this.state.kitsChecked;
    if (!kitsChecked.includes(uuid)) {
      kitsChecked.push(uuid);
    } else {
      kitsChecked.splice(kitsChecked.indexOf(uuid), 1);
    }
    this.setState({ kitsChecked });
  }

  render() {
    const { kitsLanche, kitsChecked } = this.state;
    return (
      <div className="kits-options mt-3">
        <p className="label">Selecione a opção desejada</p>
        <div className="row">
          {kitsLanche &&
            kitsLanche.map(kitLanche => {
              return (
                <div className="col-lg-4 col-md-12">
                  <CardKit
                    onCardChange={this.onCardChange}
                    kitLanche={kitLanche}
                    checked={kitsChecked.includes(kitLanche.uuid)}
                  />
                </div>
              );
            })}
        </div>
      </div>
    );
  }
}

export default OpcoesKits;
