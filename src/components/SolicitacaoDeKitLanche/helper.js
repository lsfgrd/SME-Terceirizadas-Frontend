import { retornaTempoPasseio } from "../Shareable/KitLanche/helper";

export const montaObjetoRequisicao = values => {
  let kit_lanche_avulso = {
    solicitacao_kit_lanche: {
      kits: values.kit_lanche,
      descricao: values.observacao,
      data: values.evento_data,
      tempo_passeio: retornaTempoPasseio(values.tempo_passeio)
    },
    escola: values.escola,
    local: values.local,
    quantidade_alunos: values.quantidade_alunos
  };
  return kit_lanche_avulso;
};
