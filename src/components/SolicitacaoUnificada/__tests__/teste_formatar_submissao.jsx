import { formatarSubmissao } from "../helper";

describe("Teste formatarSubmissão", () => {
  const solicitacaoKitLanche = {
    data: "02/08/2019",
    motivo: "a84e782a-2851-4e67-8d84-502529079f0a",
    descricao: "<p></p>\n",
    quantidade_max_alunos_por_escola: null,
    kit_lanche: ["9f86ecb8-bdba-4d70-9fb7-13844f563636"],
    lista_kit_lanche_igual: true,
    local: "Ibirapuera",
    escolas: [
      {
        checked: true,
        tempo_passeio: "4h",
        diretoria_regional: {
          uuid: "dae78a0b-b16d-4bbe-aa96-b91d906199bc"
        },
        quantidade_alunos: "22",
        nro_alunos: "33",
        kit_lanche: ["9f86ecb8-bdba-4d70-9fb7-13844f563636"],
        uuid: "73605a3b-7767-4ea6-845e-fef62f84dc1c"
      }
    ]
  };

  it("formata submissao com kit lanches iguais", () => {
    const resposta = {
      motivo: "a84e782a-2851-4e67-8d84-502529079f0a",
      local: "Ibirapuera",
      diretoria_regional: "dae78a0b-b16d-4bbe-aa96-b91d906199bc",
      lista_kit_lanche_igual: true,
      quantidade_max_alunos_por_escola: null,
      solicitacao_kit_lanche: {
        kits: ["9f86ecb8-bdba-4d70-9fb7-13844f563636"],
        data: "02/08/2019",
        descricao: "<p></p>\n",
        tempo_passeio: 0
      },
      escolas_quantidades: [
        {
          tempo_passeio: null,
          quantidade_alunos: "22",
          kits: [],
          escola: "73605a3b-7767-4ea6-845e-fef62f84dc1c"
        }
      ]
    };
    expect(formatarSubmissao(solicitacaoKitLanche)).toEqual(resposta);
  });

  it("formata submissao com kit lanches diferentes", () => {
    let solicitacaoKitLancheDiferente = solicitacaoKitLanche;
    solicitacaoKitLancheDiferente.lista_kit_lanche_igual = false;
    const resposta = {
      motivo: "a84e782a-2851-4e67-8d84-502529079f0a",
      local: "Ibirapuera",
      diretoria_regional: "dae78a0b-b16d-4bbe-aa96-b91d906199bc",
      lista_kit_lanche_igual: false,
      quantidade_max_alunos_por_escola: null,
      solicitacao_kit_lanche: {
        kits: [],
        data: "02/08/2019",
        descricao: "<p></p>\n",
        tempo_passeio: null
      },
      escolas_quantidades: [
        {
          tempo_passeio: 0,
          quantidade_alunos: "33",
          kits: ["9f86ecb8-bdba-4d70-9fb7-13844f563636"],
          escola: "73605a3b-7767-4ea6-845e-fef62f84dc1c"
        }
      ]
    };
    expect(formatarSubmissao(solicitacaoKitLancheDiferente)).toEqual(resposta);
  });
});
