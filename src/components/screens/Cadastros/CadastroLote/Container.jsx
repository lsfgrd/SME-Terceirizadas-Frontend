import React, { Component } from "react";
import { meusDados } from "../../../../services/perfil.service";
import {
  getEscolasCombo,
  getTiposGestao,
  getSubprefeituras
} from "../../../../services/escola.service";
import { getDiretoriaregionalCombo } from "../../../../services/diretoriaRegional.service";
import { agregarDefault } from "../../../../helpers/utilities";
import { formatarEscolasParaMultiselect } from "./helper";
import { formatarParaMultiselect } from "../../../../helpers/utilities";
import CadastroLote from ".";

class Container extends Component {
  constructor(props) {
    super(props);
    this.state = {
      meusDados: null,
      lotes: [],
      diretoriasRegionais: [],
      escolas: [],
      tiposGestao: [],
      subprefeituras: []
    };
  }

  componentDidMount() {
    meusDados().then(response => {
      this.setState({
        meusDados: response
      });
    });

    getDiretoriaregionalCombo().then(response => {
      this.setState({
        diretoriasRegionais: agregarDefault(response.data.results)
      });
    });

    getEscolasCombo().then(response => {
      this.setState({
        escolas: formatarEscolasParaMultiselect(response.results)
      });
    });

    getTiposGestao().then(response => {
      this.setState({
        tiposGestao: agregarDefault(response.results)
      });
    });

    getSubprefeituras().then(response => {
      this.setState({
        subprefeituras: formatarParaMultiselect(response.results)
      });
    });
  }

  render() {
    return <CadastroLote {...this.state} />;
  }
}

export default Container;
