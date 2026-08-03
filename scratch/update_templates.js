const fs = require('fs');

const path = 'src/assets/index.js';
let content = fs.readFileSync(path, 'utf8');

const targetContent = `    {
      id: "ampliacion",
      nombre: "🏠 Ampliación Habitación",
      desc: "Ampliación con estructura, cubierta, terminaciones. [Plantilla original]",
      items:[
        {desc:"Radier hormigón H-20",cant:12,unidad:"m²",_cid:"10"},
        {desc:"Muro albañilería reforzada c/bloques",cant:24,unidad:"m²",_cid:"12"},
        {desc:"Techumbre cerchas pino + zinc 0.35",cant:20,unidad:"m²",_cid:"40"},
        {desc:"Cielo volcanita s/correas pino",cant:20,unidad:"m²",_cid:"48"},
        {desc:"Tabique Metalcon 89mm + lana mineral + 1 placa yeso",cant:12,unidad:"m²",_cid:"22"},
        {desc:"Estuco exterior",cant:24,unidad:"m²",_cid:"17"},
        {desc:"Estuco interior",cant:36,unidad:"m²",_cid:"18"},
        {desc:"Piso flotante laminado AC4",cant:20,unidad:"m²",_cid:"62"},
        {desc:"Puerta interior 90x210cm machihembrada",cant:1,unidad:"unidad",_cid:"70"},
        {desc:"Pintura muros interiores (2 manos + sellador)",cant:36,unidad:"m²",_cid:"1"},
        {desc:"Punto de luz (foco LED empotrado)",cant:3,unidad:"unidad",_cid:"80"},
        {desc:"Punto eléctrico toma corriente triple",cant:3,unidad:"unidad",_cid:"81"},
      ]
    },
    {
      id: "radier",
      nombre: "🏗️ Radier + Pavimento",
      desc: "Radier de hormigón con terminación cerámica o piso flotante. [Plantilla original]",
      items:[
        {desc:"Excavación manual fundaciones",cant:3,unidad:"m³",_cid:"130"},
        {desc:"Nivelación y compactación terreno (máquina)",cant:20,unidad:"m²",_cid:"213"},
        {desc:"Revalses (moldaje contorno radier)",cant:20,unidad:"ml",_cid:"210"},
        {desc:"Impermeabilización bajo radier (polietileno)",cant:20,unidad:"m²",_cid:"212"},
        {desc:"Enfierradura malla electrosoldada colocada",cant:20,unidad:"m²",_cid:"211"},
        {desc:"Radier hormigón H-20",cant:20,unidad:"m²",_cid:"10"},
        {desc:"Cerámico piso 45x45cm",cant:20,unidad:"m²",_cid:"60"},
      ]
    },
    {
      id: "electrico",
      nombre: "⚡ Instalación Eléctrica",
      desc: "Instalación eléctrica básica domiciliaria. [Plantilla original]",
      items:[
        {desc:"Punto de luz (foco LED empotrado)",cant:10,unidad:"unidad",_cid:"80"},
        {desc:"Punto eléctrico toma corriente triple",cant:8,unidad:"unidad",_cid:"81"},
        {desc:"Punto eléctrico 220V (lavadora/horno)",cant:2,unidad:"unidad",_cid:"82"},
        {desc:"Tablero eléctrico 12 circuitos (inst.)",cant:1,unidad:"unidad",_cid:"83"},
        {desc:"Cableado principal 4mm² (ml)",cant:20,unidad:"ml",_cid:"223"},
      ]
    },
    {
      id: "cierre",
      nombre: "🚧 Cierre Perimetral",
      desc: "Reja perimetral metálica con fundaciones. [Plantilla original]",
      items:[
        {desc:"Reja metálica tubo cuadrado 40x40mm",cant:20,unidad:"m²",_cid:"120"},
        {desc:"Fundación corrida H-20",cant:0.8,unidad:"m³",_cid:"14"},
        {desc:"Pilares tubulares HEB 100 (inst.)",cant:6,unidad:"unidad",_cid:"123"},
        {desc:"Puerta metálica 1 hoja 1x2m",cant:1,unidad:"unidad",_cid:"129"},
        {desc:"Pintura anticorrosiva + esmalte reja",cant:20,unidad:"m²",_cid:"5"},
      ]
    },
    {
      id: "quincho",
      nombre: "🥩 Quincho / Área Exterior",
      desc: "Quincho con terraza y pavimento exterior. [Plantilla original]",
      items:[
        {desc:"Quincho estructura madera (fabricación+inst.)",cant:16,unidad:"m²",_cid:"196"},
        {desc:"Cubierta zinc quincho/pérgola",cant:18,unidad:"m²",_cid:"198"},
        {desc:"Deck madera tratada exterior",cant:20,unidad:"m²",_cid:"200"},
        {desc:"Pavimento adoquín jardín c/base",cant:30,unidad:"m²",_cid:"203"},
        {desc:"Iluminación exterior (por punto)",cant:4,unidad:"unidad",_cid:"209"},
      ]
    },
    {
      id: "piscina",
      nombre: "🏊 Piscina Básica",
      desc: "Piscina rectangular con sistema de filtración. [Plantilla original]",
      items:[
        {desc:"Excavación piscina (maquinaria)",cant:40,unidad:"m³",_cid:"187"},
        {desc:"Estructura hormigón armado piscina H-25",cant:8,unidad:"m³",_cid:"188"},
        {desc:"Impermeabilización piscina (membrana)",cant:60,unidad:"m²",_cid:"189"},
        {desc:"Revestimiento gresite/cerámico piscina",cant:50,unidad:"m²",_cid:"190"},
        {desc:"Sistema filtración + bomba (inst.)",cant:1,unidad:"unidad",_cid:"191"},
        {desc:"Escalera acero inoxidable piscina",cant:1,unidad:"unidad",_cid:"193"},
        {desc:"Vereda perimetral piscina hormigón",cant:20,unidad:"m²",_cid:"194"},
        {desc:"Iluminación subacuática LED (por punto)",cant:2,unidad:"unidad",_cid:"192"},
      ]
    }`;

const replacementContent = `    {
      id: "ampliacion",
      nombre: "🏠 Ampliación Habitación",
      desc: "Ampliación con estructura, cubierta, terminaciones. [Plantilla rápida]",
      esModerna: true,
      esRapida: true,
      capitulos: [
        {
          codigo: "CAP1",
          nombre: "Partidas Incluidas",
          orden: 1,
          partidasDirectas: [
            { catalogId: 10, cantidadSugerida: 12, obligatoria: false },
            { catalogId: 12, cantidadSugerida: 24, obligatoria: false },
            { catalogId: 40, cantidadSugerida: 20, obligatoria: false },
            { catalogId: 48, cantidadSugerida: 20, obligatoria: false },
            { catalogId: 22, cantidadSugerida: 12, obligatoria: false },
            { catalogId: 17, cantidadSugerida: 24, obligatoria: false },
            { catalogId: 18, cantidadSugerida: 36, obligatoria: false },
            { catalogId: 62, cantidadSugerida: 20, obligatoria: false },
            { catalogId: 70, cantidadSugerida: 1, obligatoria: false },
            { catalogId: 1, cantidadSugerida: 36, obligatoria: false },
            { catalogId: 80, cantidadSugerida: 3, obligatoria: false },
            { catalogId: 81, cantidadSugerida: 3, obligatoria: false }
          ],
          soluciones: []
        }
      ]
    },
    {
      id: "radier",
      nombre: "🏗️ Radier + Pavimento",
      desc: "Radier de hormigón con terminación cerámica o piso flotante. [Plantilla rápida]",
      esModerna: true,
      esRapida: true,
      capitulos: [
        {
          codigo: "CAP1",
          nombre: "Partidas Incluidas",
          orden: 1,
          partidasDirectas: [
            { catalogId: 130, cantidadSugerida: 3, obligatoria: false },
            { catalogId: 213, cantidadSugerida: 20, obligatoria: false },
            { catalogId: 210, cantidadSugerida: 20, obligatoria: false },
            { catalogId: 212, cantidadSugerida: 20, obligatoria: false },
            { catalogId: 211, cantidadSugerida: 20, obligatoria: false },
            { catalogId: 10, cantidadSugerida: 20, obligatoria: false },
            { catalogId: 60, cantidadSugerida: 20, obligatoria: false }
          ],
          soluciones: []
        }
      ]
    },
    {
      id: "electrico",
      nombre: "⚡ Instalación Eléctrica",
      desc: "Instalación eléctrica básica domiciliaria. [Plantilla rápida]",
      esModerna: true,
      esRapida: true,
      capitulos: [
        {
          codigo: "CAP1",
          nombre: "Partidas Incluidas",
          orden: 1,
          partidasDirectas: [
            { catalogId: 80, cantidadSugerida: 10, obligatoria: false },
            { catalogId: 81, cantidadSugerida: 8, obligatoria: false },
            { catalogId: 82, cantidadSugerida: 2, obligatoria: false },
            { catalogId: 83, cantidadSugerida: 1, obligatoria: false },
            { catalogId: 223, cantidadSugerida: 20, obligatoria: false }
          ],
          soluciones: []
        }
      ]
    },
    {
      id: "cierre",
      nombre: "🚧 Cierre Perimetral",
      desc: "Reja perimetral metálica con fundaciones. [Plantilla rápida]",
      esModerna: true,
      esRapida: true,
      capitulos: [
        {
          codigo: "CAP1",
          nombre: "Partidas Incluidas",
          orden: 1,
          partidasDirectas: [
            { catalogId: 120, cantidadSugerida: 20, obligatoria: false },
            { catalogId: 14, cantidadSugerida: 0.8, obligatoria: false },
            { catalogId: 123, cantidadSugerida: 6, obligatoria: false },
            { catalogId: 129, cantidadSugerida: 1, obligatoria: false },
            { catalogId: 5, cantidadSugerida: 20, obligatoria: false }
          ],
          soluciones: []
        }
      ]
    },
    {
      id: "quincho",
      nombre: "🥩 Quincho / Área Exterior",
      desc: "Quincho con terraza y pavimento exterior. [Plantilla rápida]",
      esModerna: true,
      esRapida: true,
      capitulos: [
        {
          codigo: "CAP1",
          nombre: "Partidas Incluidas",
          orden: 1,
          partidasDirectas: [
            { catalogId: 196, cantidadSugerida: 16, obligatoria: false },
            { catalogId: 198, cantidadSugerida: 18, obligatoria: false },
            { catalogId: 200, cantidadSugerida: 20, obligatoria: false },
            { catalogId: 203, cantidadSugerida: 30, obligatoria: false },
            { catalogId: 209, cantidadSugerida: 4, obligatoria: false }
          ],
          soluciones: []
        }
      ]
    },
    {
      id: "piscina",
      nombre: "🏊 Piscina Básica",
      desc: "Piscina rectangular con sistema de filtración. [Plantilla rápida]",
      esModerna: true,
      esRapida: true,
      capitulos: [
        {
          codigo: "CAP1",
          nombre: "Partidas Incluidas",
          orden: 1,
          partidasDirectas: [
            { catalogId: 187, cantidadSugerida: 40, obligatoria: false },
            { catalogId: 188, cantidadSugerida: 8, obligatoria: false },
            { catalogId: 189, cantidadSugerida: 60, obligatoria: false },
            { catalogId: 190, cantidadSugerida: 50, obligatoria: false },
            { catalogId: 191, cantidadSugerida: 1, obligatoria: false },
            { catalogId: 193, cantidadSugerida: 1, obligatoria: false },
            { catalogId: 194, cantidadSugerida: 20, obligatoria: false },
            { catalogId: 192, cantidadSugerida: 2, obligatoria: false }
          ],
          soluciones: []
        }
      ]
    }`;

content = content.replace(targetContent, replacementContent);
fs.writeFileSync(path, content, 'utf8');
console.log('Templates refactored successfully.');
