import express from 'express';

import { buscarPorAno, validaErros, calcularReajuste, anoId } from './servicos/servicos.js';
import historicoInflacao from './dados/dados.js';

const app = express();


app.get('/historicoIPCA/calculo', (req, res) => {
  const valor = parseFloat(req.query.valor);
  const dataInicialMes = parseInt(req.query.mesInicial);
  const dataInicialAno = parseInt(req.query.anoInicial);
  const dataFinalMes = parseInt(req.query.mesFinal);
  const dataFinalAno = parseInt(req.query.anoFinal);
  

  if (validaErros(valor, dataInicialMes, dataInicialAno, dataFinalMes, dataFinalAno))    
  {
    res.status(400).send({erro: "Parâmetros inválidos"});
  }
  const resultado = calcularReajuste(valor, dataInicialMes, dataInicialAno, dataFinalMes, dataFinalAno);
  res.json({resultado: resultado});
}); 


app.get('/historicoIPCA', (req, res) => {
  const ano = req.query.ano;
  const quantidadeColecao = historicoInflacao.length - 1;
  
  if (ano) {
    if (ano < historicoInflacao[0].ano || ano > historicoInflacao[quantidadeColecao].ano) {
      res.status(404).send({erro: "Nenhum histórico encotrado para o ano especificado"});
    } else {
      const resultado = buscarPorAno(ano);
      res.json({resultado: resultado});
    }
  
  } else {
    const resultado = historicoInflacao;
    res.json({resultado: resultado});
  }
});

app.get('/historicoIPCA/:idAno', (req, res) => {
  const idAno = parseInt(req.params.idAno);

  if (isNaN(idAno)) {
    res.status(404).json({erro: 'ID inválido'});
    return;
  }

  const buscaId = anoId(idAno);
  if (buscaId) {
    res.json(buscaId);
  } else {
    res.status(404).send({erro: "Elemento não encontrado"});
  }
  
});


app.listen(8080, () => {
  console.log('Servidor iniciado na porta 8080');
});