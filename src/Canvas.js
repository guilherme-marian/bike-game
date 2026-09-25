import React, { useEffect, useRef } from 'react';
import kaplay from 'kaplay';

import imgMoto from './assets/mark-o.png';
import imgObstaculo from './assets/ghosty-o.png';
import imgItemBom from './assets/apple-o.png';
import imgCharacter from './assets/Character.png'

function Game() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const k = kaplay({
      global: false,
      canvas: canvasRef.current,
      width: 800,
      height: 600,
      background: [135, 206, 235], 
      align: "center",
    });

    k.loadSprite("moto", imgMoto); 
    k.loadSprite("obstaculo", imgObstaculo);
    k.loadSprite("item_bom", imgItemBom);

    k.loadSprite("personagem", imgCharacter, {
      sliceX: 2
    })

    const FAIXAS_Y = [330, 410, 490];

    let reais = 0

    let pontos = 0;
    let vidas = 3;
    let faseAtual = 1;

    let vidasMaximas = 3; 
    let bonusVelocidade = 0;

    let velocidadeAtual = 250 + bonusVelocidade; 
    let distanciaPercorrida = 0; 

    const VEL_MINIMA = 150;
    const VEL_MAXIMA = 550;

    const missoes = [
      {
        id: 1,
        texto: "Missão 1: Percorra 3 km (3000m) de moto",
        recompensaTexto: "Recompensa: R$100",
        meta: 3000,
        tipo: "distancia",
        valorRecompensa: 100,
        aceita: false,
        concluida: false,
        recompensada: false
      },
      {
        id: 2,
        texto: "Missão 2: Percorra 10 km (10000m) de moto",
        recompensaTexto: "Recompensa: R$500",
        meta: 10000,
        tipo: "distancia",
        valorRecompensa: 500,
        aceita: false,
        concluida: false,
        recompensada: false
      },
    ]

    k.scene("menu", () => {
      k.add([
        k.text("Mobilidade Segura:\nMoto Aventura", { size: 36, align: "center" }),
        k.pos(k.width() / 2, 180),
        k.anchor("center"),
        k.color(0, 0, 0)
      ]);

      const missionbtn = k.add([
        k.rect(260, 50, {radius: 10}),
        k.pos(k.width() / 2 - 130, 230),
        k.color(0, 150, 0),
        k.area(),
      ])

      missionbtn.add([
        k.pos(k.width() / 2, 325),
        k.anchor("center"),
        k.color(0, 150, 0),
      ])

      missionbtn.onHover(() => {
        missionbtn.color = [0, 200, 0];
        k.setCursor("pointer");
      })

      missionbtn.onHoverEnd(() => {
        missionbtn.color = k.rgb(0, 100, 200); 
        k.setCursor("default");
      });

      missionbtn.onClick(() => {
        k.go("mission")
      });

      const upgradebtn = k.add([
        k.rect(260,50, {radius: 10}),
        k.pos(k.width() / 2 - 130, 300),
        k.color(0, 150, 0),
        k.area(),
      ]);

      upgradebtn.add([
        k.text("Oficina", {size: 10}),
        k.pos(k.width() / 2, 325),
        k.anchor("center"),
        k.color(255, 255, 255)
      ]);

      upgradebtn.onHover(() => {
        upgradebtn.color = [0, 200, 0];
        k.setCursor("pointer");
      });

      upgradebtn.onHoverEnd(() => {
        upgradebtn.color = k.rgb(0, 100, 200); 
        k.setCursor("default");
      });

      upgradebtn.onClick(() => {
        k.go("upgrades")
      });

      k.add([
        k.text("Pressione ESPAÇO para Jogar", { size: 20 }),
        k.pos(k.width() / 2, 380),
        k.anchor("center"),
        k.color(50, 50, 50)
      ]);

      k.onKeyPress("space", () => {
        pontos = 0;
        vidas = vidasMaximas;
        faseAtual = 1;
        velocidadeAtual = 250 + bonusVelocidade;
        k.go("game");
      });
    });

    k.scene("game", () => {
      let faixaAtual = 1; 

      k.add([
        k.rect(k.width(), 240),
        k.pos(0, 330),
        k.color(100, 100, 100),
      ]);

      k.add([k.rect(k.width(), 4), k.pos(0, 410), k.color(255, 255, 255)]);
      k.add([k.rect(k.width(), 4), k.pos(0, 490), k.color(255, 255, 255)]);

      const jogador = k.add([
        k.sprite("moto"),
        k.pos(120, FAIXAS_Y[faixaAtual]),
        k.anchor("center"),
        k.area(),
        "player",
      ]);

      const uiPontos = k.add([k.text(`Pontos: ${pontos}`, { size: 20 }), k.pos(20, 20), k.color(0,0,0)]);
      const uiVidas = k.add([k.text(`Vidas: ${vidas}`, { size: 20 }), k.pos(20, 50), k.color(0,0,0)]);
      const uiFase = k.add([k.text(`Fase: ${faseAtual}`, { size: 20 }), k.pos(k.width() - 120, 20), k.color(200, 150, 0)]);
      const uiVelocidade = k.add([k.text(`Velocidade: ${velocidadeAtual / 10} km/h`, { size: 16 }), k.pos(20, 90), k.color(0, 0, 150)]);

      k.onKeyPress("up", () => {
        if (faixaAtual > 0) {
          faixaAtual--;
          jogador.pos.y = FAIXAS_Y[faixaAtual];
        }
      });

      k.onKeyPress("down", () => {
        if (faixaAtual < 2) {
          faixaAtual++;
          jogador.pos.y = FAIXAS_Y[faixaAtual];
        }
      });

      k.onKeyDown("right", () => {
        if (velocidadeAtual < (VEL_MAXIMA + bonusVelocidade)) {
          velocidadeAtual += 4;
          uiVelocidade.text = `Velocidade: ${Math.floor(velocidadeAtual / 10)} km/h`;
        }
      });

      k.onKeyDown("left", () => {
        if (velocidadeAtual > VEL_MINIMA) {
          velocidadeAtual -= 4;
          uiVelocidade.text = `Velocidade: ${Math.floor(velocidadeAtual / 10)} km/h`;
        }
      });

      k.onUpdate(() => {
    // Se a moto estiver se movendo, calcula a distância percorrida
    // k.dt() é o tempo que passou desde o último frame (garante precisão)
    if (velocidadeAtual > 0) {
      // Ajuste a divisão conforme achar melhor para o ritmo do seu jogo
      distanciaPercorrida += (velocidadeAtual * k.dt() / 5) ; 
    }

    // Procura se a Missão 1 está ativa para atualizar o progresso dela
    const missao1 = missoes.find(m => m.id === 1);
    if (missao1 && missao1.aceita && !missao1.concluida) {
      if (distanciaPercorrida >= missao1.meta) {
        missao1.concluida = true;
        
        // Alerta visual rápido na tela avisando que completou
        const alertaMissao = k.add([
          k.text("MISSÃO CONCLUÍDA!\nVisite a aba de missões para resgatar.", { size: 16, align: "center" }),
          k.pos(k.width() / 2, 80),
          k.anchor("center"),
          k.color(255, 215, 0)
        ]);
        k.wait(3, () => k.destroy(alertaMissao));
      }
    }
  });

  // OPCIONAL: Adicione um texto na UI do jogo para o jogador ver a distância
  const uiDistancia = k.add([
    k.text(`Distância: 0.0 km`, { size: 16 }),
    k.pos(20, 120),
    k.color(0, 0, 0)
  ]);

  k.add([
    k.text(`Carteira: R$ ${reais}`, { size: 16 }), 
    k.pos(20, 150), // Posicionado logo abaixo do contador de distância
    k.color(0, 150, 0) // Cor verde para lembrar dinheiro
  ]);

  k.onUpdate(() => {
    uiDistancia.text = `Distância: ${(distanciaPercorrida / 1000).toFixed(2)} km`;
  });

      function spawnElemento() {
        const faixaOcupada = k.choose([0, 1, 2]); // Define qual das 3 pistas terá o pedestre
        const tipo = k.choose(["obstaculo", "item_bom", "faixa_pedestre"]);
        const velocidadeAtual = faseAtual === 1 ? 250 : 380;

        if (tipo === "faixa_pedestre") {
          const faixaContainer = k.add([
            k.pos(k.width(), 330),
            k.move(k.LEFT, velocidadeAtual),
            "objeto_cenario",
            { passou: false } 
          ]);

          for (let i = 0; i < 240; i += 30) {
            faixaContainer.add([
              k.rect(40, 15),
              k.pos(0, i),
              k.color(255, 255, 255),
              k.opacity(0.8)
            ]);
          }

          k.add([
            k.sprite("obstaculo"), 
            k.pos(k.width(), FAIXAS_Y[faixaOcupada]),
            k.anchor("center"),
            k.area(),
            k.move(k.LEFT, velocidadeAtual),
            "perigo",
            { 
              mensagem: faseAtual === 1 
                ? "Atenção! Você quase atropelou um pedestre atravessando! (-1 Vida)" 
                : "Motos elétricas devem dar preferência total ao pedestre! (-1 Vida)",
            }
          ]);

          faixaContainer.onUpdate(() => {

            if (!faixaContainer.passou && faixaContainer.pos.x <= 120) {
              faixaContainer.passou = true;

              if (faixaAtual !== faixaOcupada) {
                pontos += 15; 
                uiPontos.text = `Pontos: ${pontos}`;

                const avisoSucesso = k.add([
                  k.text("Excelente! Você escolheu a pista livre e respeitou o pedestre! (+15 pts)", { size: 14, align: "center" }),
                  k.pos(k.width() / 2, 120),
                  k.anchor("center"),
                  k.color(0, 255, 0)
                ]);
                k.wait(1.5, () => k.destroy(avisoSucesso));

                if (pontos === 100 && faseAtual === 1) {
                  faseAtual = 2;
                  uiFase.text = `Fase: ${faseAtual}`;
                  const transicao = k.add([
                    k.text("FASE 2\nUso Consciente da Moto Elétrica!", { size: 24, align: "center" }), 
                    k.pos(k.width() / 2, k.height() / 2), 
                    k.anchor("center"),
                    k.color(0, 0, 255)
                  ]);
                  k.wait(3, () => k.destroy(transicao));
                } else if (pontos >= 80 && faseAtual === 2) {
                  k.go("fim", true);
                }
              }
            }

            if (faixaContainer.pos.x < -100) {
              k.destroy(faixaContainer);
            }
          });

        } else if (tipo === "obstaculo") {
          k.add([
            k.sprite("obstaculo"),
            k.pos(k.width(), FAIXAS_Y[faixaOcupada]),
            k.anchor("center"),
            k.area(),
            k.move(k.LEFT, velocidadeAtual),
            "perigo",
            { 
              mensagem: faseAtual === 1 
                ? "Você avançou o sinal vermelho perto da escola! (-1 Vida)" 
                : "Andar de moto elétrica sem capacete é perigoso! (-1 Vida)"
            }
          ]);
        } else {
          k.add([
            k.sprite("item_bom"),
            k.pos(k.width(), FAIXAS_Y[faixaOcupada]),
            k.anchor("center"),
            k.area(),
            k.move(k.LEFT, velocidadeAtual),
            "seguro",
            {
              mensagem: faseAtual === 1
                ? "Boa! Reduziu a velocidade perto da escola. (+10 pts)"
                : "Excelente! Respeitou o limite de velocidade da via. (+10 pts)"
            }
          ]);
        }

        k.onUpdate("perigo", (o) => { if (o.pos.x < -60) k.destroy(o); });
        k.onUpdate("seguro", (o) => { if (o.pos.x < -60) k.destroy(o); });

        k.wait(k.rand(1.8, 3.2), spawnElemento);
      }

      spawnElemento();

      jogador.onCollide("perigo", (obstaculo) => {
        k.destroy(obstaculo);
        vidas--;
        k.addKaboom(jogador.pos.x, jogador.pos.y);
        uiVidas.text = `Vidas: ${vidas}`;
        
        velocidadeAtual = VEL_MINIMA;
        uiVelocidade.text = `Velocidade: ${velocidadeAtual} km/h`;

        const aviso = k.add([
          k.text(obstaculo.mensagem, { size: 16, align: "center" }), 
          k.pos(k.width() / 2, 120), 
          k.anchor("center"),
          k.color(255, 0, 0)
        ]);
        k.wait(2.5, () => k.destroy(aviso));

        if (vidas <= 0) {
          k.go("fim", false);
        }
      });

      jogador.onCollide("seguro", (item) => {
        k.destroy(item);
        pontos += 10;
        uiPontos.text = `Points: ${pontos}`;

        const aviso = k.add([
          k.text(item.mensagem, { size: 16, align: "center" }), 
          k.pos(k.width() / 2, 120), 
          k.anchor("center"),
          k.color(0, 150, 0)
        ]);
        k.wait(2, () => k.destroy(aviso));

        if (pontos === 100 && faseAtual === 1) {
          faseAtual = 2;
          uiFase.text = `Fase: ${faseAtual}`;
          const transicao = k.add([
            k.text("FASE 2\nUso Consciente da Moto Elétrica!", { size: 24, align: "center" }), 
            k.pos(k.width() / 2, k.height() / 2), 
            k.anchor("center"),
            k.color(0, 0, 255)
          ]);
          k.wait(3, () => k.destroy(transicao));
        } else if (pontos >= 8000000 && faseAtual === 3) {
          k.go("fim", true);
        }
      });


    });

    k.scene("fim", (vitoria) => {
      k.add([
        k.text(vitoria ? "Parabéns!\nVocê é um motorista consciente!" : "Fim de Jogo!\nMais responsabilidade no trânsito.", { size: 28, align: "center" }),
        k.pos(k.width() / 2, 200),
        k.anchor("center"),
        k.color(vitoria ? [0, 150, 0] : [255, 0, 0])
      ]);

      k.add([
        k.text(`Pontuação Final: ${pontos}`, { size: 22 }),
        k.pos(k.width() / 2, 340),
        k.anchor("center"),
        k.color(0, 0, 0)
      ]);

      k.add([
        k.text("Pressione ESPAÇO para retornar ao Menu", { size: 16 }),
        k.pos(k.width() / 2, 460),
        k.anchor("center"),
        k.color(50, 50, 50)
      ]);

      k.onKeyPress("space", () => {
        distanciaPercorrida = 0;
        k.go("menu");
      });
    });


    k.scene("mission", () => {
      k.add([
        k.text("Central de Missões", { size: 36 }),
        k.pos(k.width() / 2, 60),
        k.anchor("center"),
        k.color(0, 0, 0)
      ]);

      const m1 = missoes.find(m => m.id === 1);

      // Exibe o texto da missão e o saldo atual de Reais do jogador no topo
      k.add([
        k.text(`Seu Saldo: R$ ${reais}`, { size: 18 }),
        k.pos(100, 140),
        k.color(0, 120, 0)
      ]);

      k.add([
        k.text(`${m1.texto}\n${m1.recompensaTexto}`, { size: 16, lineSpacing: 8 }),
        k.pos(100, 200),
        k.color(50, 50, 50)
      ]);

      const progressoAtual = m1.concluida ? 3000 : Math.min(distanciaPercorrida, m1.meta);
      k.add([
        k.text(`Progresso: ${(progressoAtual / 1000).toFixed(2)} / ${(m1.meta / 1000).toFixed(0)} km`, { size: 14 }),
        k.pos(100, 260),
        k.color(100, 100, 100)
      ]);

      let textoBotao = "Aceitar Missão";
      if (m1.aceita) textoBotao = "Em Andamento...";
      if (m1.concluida) textoBotao = "Resgatar Recompensa";
      if (m1.recompensada) textoBotao = "Concluída ✔";

      // O BOTÃO DE AÇÃO DA MISSÃO
      criarBotao(textoBotao, k.vec2(k.width() / 2 + 180, 240), () => {
        
        // CASO 1: Aceitar a missão
        if (!m1.aceita) {
          m1.aceita = true;
          k.go("mission"); // Recarrega a cena para atualizar o texto do botão para "Em Andamento..."
        } 
        
        // CASO 2: Resgatar o dinheiro de verdade!
        else if (m1.concluida && !m1.recompensada) {
          m1.recompensada = true;
          
          // Adiciona o valor da recompensa direto na carteira global do jogador
          reais += m1.valorRecompensa; 
          
          k.add([
            k.text(`+ R$ ${m1.valorRecompensa} adicionados à sua carteira!`, { size: 16 }),
            k.pos(k.width() / 2, 160),
            k.anchor("center"),
            k.color(0, 180, 0)
          ]);
          
          // Recarrega a tela após 2 segundos para atualizar o saldo visual de Reais lá no topo
          k.wait(2, () => k.go("mission"));
        }
      });

      k.add([
        k.text("Pressione ESPAÇO para retornar às pistas", { size: 16 }),
        k.pos(k.width() / 2, 500),
        k.anchor("center"),
        k.color(120, 120, 120)
      ]);

      k.onKeyPress("space", () => {
        k.go("game");
      });
    });

        k.scene("upgrades", () => {
      k.add([
        k.text("Oficina de Upgrades", { size: 36 }),
        k.pos(k.width() / 2, 80),
        k.anchor("center"),
        k.color(0, 0, 0)
      ]);

      const uiSaldo = k.add([
        k.text(`Seus Pontos: ${pontos}`, { size: 20 }),
        k.pos(k.width() / 2, 140),
        k.anchor("center"),
        k.color(0, 150, 0)
      ]);

      const uiVidaTxt = k.add([
        k.text(`Vida Máxima Atual: ${vidasMaximas}`, { size: 16 }),
        k.pos(150, 240),
        k.color(50, 50, 50)
      ]);

      criarBotao("+1 Vida Máxima (Custa 100 pts)", k.vec2(k.width() / 2 + 150, 250), () => {
        if (pontos >= 100) {
          pontos -= 100;
          vidasMaximas += 1;

          uiSaldo.text = `Seus Pontos: ${pontos}`;
          uiVidaTxt.text = `Vida Máxima Atual: ${vidasMaximas}`;
        } else {
          const erro = k.add([k.text("Pontos insuficientes!", { size: 14 }), k.pos(k.width()/2, 200), k.anchor("center"), k.color(255,0,0)]);
          k.wait(1, () => k.destroy(erro));
        }
      });

      const uiMotorTxt = k.add([
        k.text(`Bônus de Motor: +${bonusVelocidade / 10} km/h`, { size: 16 }),
        k.pos(150, 340),
        k.color(50, 50, 50)
      ]);

      criarBotao("Motor Turbo (Custa 40 pts)", k.vec2(k.width() / 2 + 150, 350), () => {
        if (pontos >= 40) {
          pontos -= 40;
          bonusVelocidade += 50; 
          uiSaldo.text = `Seus Pontos: ${pontos}`;
          uiMotorTxt.text = `Bônus de Motor: +${bonusVelocidade / 10} km/h`;
        } else {
          const erro = k.add([k.text("Pontos insuficientes!", { size: 14 }), k.pos(k.width()/2, 200), k.anchor("center"), k.color(255,0,0)]);
          k.wait(1, () => k.destroy(erro));
        }
      });

      k.add([
        k.text("Pressione ESPAÇO para retornar ao Menu", { size: 16 }),
        k.pos(k.width() / 2, 500),
        k.anchor("center"),
        k.color(50, 50, 50)
      ]);

      k.onKeyPress("space", () => {
        k.go("menu");
      });
    });

    function criarBotao(txt, posicao, acao) {
      const btn = k.add([
        k.rect(280, 50, { radius: 8 }), 
        k.pos(posicao),
        k.anchor("center"),
        k.color(0, 100, 200), 
        k.area(), 
        "botao_interativo"
      ]);

      btn.add([
        k.text(txt, { size: 16 }),
        k.anchor("center"),
        k.color(255, 255, 255)
      ]);

      btn.onHover(() => {
        btn.color = k.rgb(0, 130, 255); 
        k.setCursor("pointer"); 
      });

      btn.onHoverEnd(() => {
        btn.color = k.rgb(0, 100, 200); 
        k.setCursor("default");
      });

      btn.onClick(acao);
      return btn;
    }

    k.go("menu");

    return () => {
      k.quit();
    };
  }, []);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#222' }}>
      <canvas ref={canvasRef} style={{ border: '4px solid #fff', borderRadius: '8px' }} />
    </div>
  );
}

export default Game;