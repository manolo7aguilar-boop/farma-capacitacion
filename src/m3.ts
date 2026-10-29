import { mc, tf, mt, type Lesson } from './data';

/** Módulo 3 · Casos de mostrador (ids 201–209) */
export const m3Lessons: Lesson[] = [
  {
    id: 201, title: 'Atención al cliente y preguntas clave',
    tip: { title: 'Preguntar antes de recomendar', body: [
      'En mostrador, **escucha** y haz 3–5 preguntas útiles: **síntoma**, **desde cuándo**, **edad**, **embarazo**, **otros medicamentos** y si hay **alarma** (fiebre alta, sangrado, dificultad para respirar, dolor intenso).',
      'Habla claro, con respeto. No inventes dosis. Si no estás seguro: **refiere al médico**.',
      'Cierra con: qué llevar, cómo usarlo y cuándo volver o consultar.',
    ]},
    exercises: [
      mc('m3l1e1', 'complete', 'Antes de recomendar, pregunta edad, síntomas, otros medicamentos y ______.', ['embarazo / alarmas', 'solo el color', 'el signo zodiacal', 'nada'], 0, 'Embarazo y señales de alarma importan.'),
      tf('m3l1e2', '“Si el cliente tiene prisa, puedo vender sin preguntar.”', false, 'Unas preguntas rápidas evitan riesgos.'),
      mt('m3l1e3', 'Une la señal con la acción.', [['Dificultad para respirar', 'Urgencias / refiere al médico'], ['Dolor de cabeza leve ocasional', 'Orientación en mostrador'], ['Cliente inseguro del tratamiento', 'Refiere al médico']], 'Alarma vs. consejo habitual.'),
      mc('m3l1e4', 'case', 'Cliente: “Deme algo para el dolor.” Primera buena respuesta:', ['El más caro', '¿Desde cuándo? ¿Dónde duele? ¿Otros medicamentos o embarazo?', 'Sin preguntar, ibuprofeno'], 1, 'Preguntas primero.'),
      mc('m3l1e5', 'case', 'No conoces bien un producto que piden. ¿Qué haces?', ['Inventas la dosis', 'Revisas etiqueta/ficha o consultas y, si hace falta, refiere al médico', 'Dices que sí a todo'], 1, 'Honestidad y seguridad.'),
      mc('m3l1e6', 'choose', 'Cierre de la atención incluye:', ['Solo el precio', 'Cómo usarlo y cuándo consultar de nuevo', 'Nada'], 1, 'Uso + seguimiento.'),
      mc('m3l1e7', 'impulso', 'Tras orientar bien, un cierre útil es:', ['Resumir el consejo y preguntar si necesita algo más (impulso coherente)', 'Presionar hasta que compre tres cosas', 'Ignorar el saludo de despedida'], 0, 'Persuasión + servicio, no presión agresiva.'),
    ],
  },
  {
    id: 202, title: 'Impulso / venta sugerida (persuasión)',
    tip: { title: 'Persuadir con utilidad', body: [
      'El **impulso** ofrece algo que **completa** el cuidado: termómetro con antipirético, salina con salbutamol, preservativos con anticonceptivos, pastillero en crónicos.',
      'Persuade con **beneficio claro** (“así controla la fiebre en casa”), no con engaño. Prioriza **laboratorio aliado** y planes de **fidelización** cuando apliquen.',
      'Nunca impulsas algo riesgoso, sin receta cuando la requiere, o que duplique activos.',
    ]},
    exercises: [
      mc('m3l2e1', 'complete', 'Un buen impulso ______ el cuidado del cliente.', ['completa', 'sabotea', 'duplica riesgos', 'ignora'], 0, 'Complementa, no complica.'),
      tf('m3l2e2', '“Impulso = vender lo más caro aunque no sirva.”', false, 'Persuasión útil, no engaño.'),
      mt('m3l2e3', 'Une compra con impulso útil.', [['Paracetamol fiebre niño', 'Termómetro + suero'], ['Salbutamol', 'Salina / nebulizador'], ['Anticonceptivos', 'Preservativos + lubricantes']], 'Encaje real.'),
      mc('m3l2e4', 'case', 'Cliente lleva gel AINE por torcedura. Impulso persuasivo:', ['Venda elástica y frío, priorizando línea aliada', 'Otro AINE oral “para potenciar” sin preguntar', 'Antibiótico sin receta'], 0, 'RICE + aliado.'),
      mc('m3l2e5', 'case', 'Cliente rechaza el impulso. ¿Qué haces?', ['Insistes hasta molestar', 'Respetas, dejas la puerta abierta y cierras bien la venta principal', 'Cancelas la venta principal'], 1, 'Persuasión sin presión agresiva.'),
      mc('m3l2e6', 'choose', 'Al impulsar, priorizas:', ['Laboratorio aliado y utilidad', 'Lo que caduca mañana aunque no sirva', 'Cualquier cosa random'], 0, 'Aliado + utilidad.'),
      mc('m3l2e7', 'impulso', 'Crónico que recoge antihipertensivo. Impulso ético:', ['Pastillero + plan fidelización / canje, mismo mg', 'Cambiarle el miligramaje por tu cuenta', 'Ginseng sin preguntar'], 0, 'Adherencia y fidelización.'),
    ],
  },
  {
    id: 203, title: 'Laboratorios aliados',
    tip: { title: 'Priorizar la línea de la farmacia', body: [
      'Los **laboratorios aliados** son la línea que la farmacia impulsa: mismo cuidado, mejor margen y a menudo promos o canjes.',
      'Cuando haya **opción equivalente** (mismo activo y dosis), ofrece primero el aliado. Explica con claridad, sin desprestigiar otras marcas.',
      'Si el cliente trae marca pedida o el médico indicó una específica, respeta; ofrece aliado solo si es comparable y el cliente acepta.',
    ]},
    exercises: [
      mc('m3l3e1', 'complete', 'Si hay opción equivalente, prioriza el laboratorio ______.', ['aliado', 'más lejos', 'desconocido al azar', 'vencido'], 0, 'Línea de la farmacia.'),
      tf('m3l3e2', '“Aliado significa inventar que es mejor mintiendo.”', false, 'Se ofrece con honestidad cuando es equivalente.'),
      mt('m3l3e3', 'Une situación con acción.', [['Equivalente disponible', 'Ofrecer aliado'], ['Médico pidió marca exacta', 'Respetar indicación'], ['Cliente pide otra marca', 'Orientar y respetar elección']], 'Equilibrio comercial y ético.'),
      mc('m3l3e4', 'case', 'Cliente pide “el de siempre” y hay aliado igual en mg. Mejor enfoque:', ['Ofrecer aliado explicando equivalencia y beneficio/promo', 'Insultar la otra marca', 'No decir nada nunca'], 0, 'Persuasión clara.'),
      mc('m3l3e5', 'case', 'La receta trae marca específica. ¿Qué haces?', ['Cambias sin avisar', 'Respeta la marca; si hay duda de cambio, refiere al médico', 'Das otra dosis'], 1, 'Receta manda.'),
      mc('m3l3e6', 'choose', 'Hablar del aliado debe ser:', ['Claro y respetuoso', 'Engañoso', 'Agresivo'], 0, 'Confianza.'),
      mc('m3l3e7', 'impulso', 'Al ofrecer aliado, puedes sumar:', ['Promo o plan fidelización si aplica', 'Una mentira sobre la competencia', 'Doble dosis'], 0, 'Canjes y promos honestas.'),
    ],
  },
  {
    id: 204, title: 'Fidelización y canjes',
    tip: { title: 'Que vuelvan y cumplan el tratamiento', body: [
      'Planes **2x1, 3x1, canjes y puntos** ayudan al cliente crónico a no abandonar el tratamiento y a la farmacia a retener.',
      'Explícalos **en el momento de la entrega**, sobre todo en diabetes, presión, colesterol, asma, etc.',
      'Nunca uses el plan para justificar vender sin receta o cambiar miligramajes por tu cuenta.',
    ]},
    exercises: [
      mc('m3l4e1', 'complete', 'La fidelización ayuda a que el cliente ______ el tratamiento.', ['continúe', 'abandone', 'duplique sin control', 'regale'], 0, 'Adherencia.'),
      tf('m3l4e2', '“El 2x1 permite vender controlados sin receta.”', false, 'Nunca: receta y manual mandan.'),
      mt('m3l4e3', 'Une cliente con foco de fidelización.', [['Antihipertensivo mensual', 'Canje / 2x1 + pastillero'], ['Compra única de curita', 'Menos crítico fidelizar'], ['Insulina / antidiabético', 'Plan + mismo mg']], 'Crónicos primero.'),
      mc('m3l4e4', 'case', 'Cliente recoge estatina. Buen cierre:', ['Mencionar plan fidelización y próximo canje', 'Cambiarle el mg', 'Nada'], 0, 'Retención útil.'),
      mc('m3l4e5', 'case', 'Cliente no entiende el canje. ¿Qué haces?', ['Te burles', 'Lo explicas simple y por escrito si hace falta', 'Se lo niegas sin razón'], 1, 'Claridad.'),
      mc('m3l4e6', 'choose', 'Fidelización se ofrece:', ['Al entregar, con claridad', 'Solo si el cliente se enoja', 'Nunca en crónicos'], 0, 'En el momento clave.'),
      mc('m3l4e7', 'impulso', 'Con fidelización puedes sumar:', ['Pastillero o recordatorio de próxima compra', 'Un controlado sin receta', 'Otro fármaco de distinto mg “porque sí”'], 0, 'Adherencia.'),
    ],
  },
  {
    id: 205, title: 'Receta y controlados (cinto verde)',
    tip: { title: 'Nunca sin receta', body: [
      'Todo **medicamento controlado** va marcado con **cinto verde**. Debes seguir el **manual de venta de productos controlados**.',
      '**Nunca** se venden sin receta, bajo ninguna circunstancia (ni “solo esta vez”, ni “es cliente de confianza”).',
      'Antibióticos y muchos otros también exigen receta según normativa: si duda, no despaches y **refiere al médico**.',
    ]},
    exercises: [
      mc('m3l5e1', 'complete', 'Los controlados se identifican con cinto ______.', ['verde', 'rosa de adorno', 'invisible', 'amarillo de oferta'], 0, 'Cinto verde.'),
      tf('m3l5e2', '“Si el cliente es amigo, puedo vender clonazepam sin receta.”', false, 'Nunca sin receta.'),
      mt('m3l5e3', 'Une producto con regla.', [['Controlado cinto verde', 'Manual + receta'], ['Paracetamol OTC', 'Orientación de mostrador'], ['Antibiótico', 'Receta']], 'Reglas claras.'),
      mc('m3l5e4', 'case', 'Piden controlado “solo hoy” sin receta. ¿Qué haces?', ['Lo vendes', 'Explicas la norma, no despachas y refiere al médico', 'Lo anotas después'], 1, 'Cero excepciones.'),
      mc('m3l5e5', 'case', 'Receta ilegible de controlado. Mejor acción:', ['Adivinar', 'No despachar hasta aclarar / refiere al médico', 'Dar lo más parecido'], 1, 'Seguridad.'),
      mc('m3l5e6', 'choose', 'El manual de controlados:', ['Se sigue siempre', 'Es opcional', 'Solo fines de semana'], 0, 'Siempre.'),
      mc('m3l5e7', 'impulso', 'Al despachar controlado con receta válida:', ['Pastillero y adherencia; sin “extras” peligrosos', 'Alcohol “para relajar”', 'Dosis doble de regalo'], 0, 'Ético.'),
    ],
  },
  {
    id: 206, title: 'Señales de alarma → refiere al médico',
    tip: { title: 'Cuándo no es solo mostrador', body: [
      '**Refiere al médico / urgencias** ante: dificultad respiratoria, dolor de pecho, labios morados, sangrado, heces negras, fiebre alta persistente, hinchazón de cara, ideación de daño, dolor de pierna fuerte con anticonceptivos, etc.',
      'Puedes ofrecer medidas de soporte (suero, no suspender crónicos solos) **sin retrasar** la derivación.',
      'Tu rol: detectar, explicar con calma y **no minimizar**.',
    ]},
    exercises: [
      mc('m3l6e1', 'complete', 'Dificultad para respirar o labios morados → ______.', ['urgencias / médico ya', 'esperar una semana', 'solo un té', 'doble antihistamínico'], 0, 'Emergencia.'),
      tf('m3l6e2', '“Heces negras con dolor de estómago: omeprazol y a casa.”', false, 'Posible sangrado: refiere al médico.'),
      mt('m3l6e3', 'Une hallazgo con acción.', [['Ideación de hacerse daño', 'Ayuda inmediata'], ['Resfriado leve 1 día', 'Orientación OTC'], ['Dolor pecho', 'Urgencias']], 'Priorizar.'),
      mc('m3l6e4', 'case', 'Niño con pañal seco muchas horas y diarrea. ¿Qué haces?', ['Loperamida', 'Refiere al médico; ofrece sales mientras tanto', 'Nada'], 1, 'Deshidratación pediátrica.'),
      mc('m3l6e5', 'case', 'Cliente usa salbutamol muchas veces al día. ¿Qué haces?', ['Le vendes dos', 'Asma mal controlada: refiere al médico', 'Ignoras'], 1, 'Mal control.'),
      mc('m3l6e6', 'choose', 'Ante alarma, tu mensaje es:', ['Calma + derivar ya', 'Minimizar', 'Vender lo que sea'], 0, 'Derivar.'),
      mc('m3l6e7', 'impulso', 'Mientras derives una diarrea con alarma:', ['No des loperamida a ciegas; hidratación si aplica y médico', 'Antibiótico sin receta', 'Laxante'], 0, 'Soporte seguro.'),
    ],
  },
  {
    id: 207, title: 'Casos mixtos OTC',
    tip: { title: 'Dolor, gripe, estómago, alergia', body: [
      'Combina lo aprendido: preguntas → elección segura → impulso aliado → cuándo derivar.',
      'Evita duplicar paracetamol en antigripales. Spray nasal descongestionante: pocos días. Antihistamínicos sedantes: cuidado si maneja.',
      'Estómago: antiácido ocasional vs IBP; alarmas → médico.',
    ]},
    exercises: [
      mc('m3l7e1', 'case', 'Antigripal con paracetamol + quiere paracetamol suelto:', ['Se lo vendo', 'Explico duplicidad y dosis máxima', 'Doble todo'], 1, 'No duplicar.'),
      mc('m3l7e2', 'case', 'Alergia y maneja bus. Mejor:', ['Clorfenamina fuerte', 'Opción de menor sueño (ej. loratadina) y avisar', 'Nada'], 1, 'Menos sedación.'),
      mc('m3l7e3', 'case', 'Agruras ocasionales post comida:', ['Antiácido + hábitos; si persiste, médico', 'Antibiótico', 'IBP meses sin control'], 0, 'Ocasional vs crónico.'),
      tf('m3l7e4', '“Spray descongestionante nasal semanas seguidas está bien.”', false, 'Riesgo de rebote; pocos días.'),
      mt('m3l7e5', 'Une caso con impulso.', [['Fiebre niño', 'Termómetro + suero'], ['Resfriado', 'Vitamina C / pañuelos (aliado)'], ['Torcedura', 'Venda + frío']], 'Impulsos útiles.'),
      mc('m3l7e6', 'case', 'Tos + fiebre + dolor al tragar, pide antibiótico sin Rx:', ['Vender', 'Receta / refiere al médico', 'Doble mucolítico con AB'], 1, 'AB con receta.'),
      mc('m3l7e7', 'impulso', 'Resfriado leve con antigripal aliado. Impulso:', ['Vitamina C, pañuelos, suero; sin duplicar activos', 'Segundo antigripal distinto a la vez', 'Spray nasal 3 semanas'], 0, 'Complemento seguro.'),
    ],
  },
  {
    id: 208, title: 'Casos crónicos',
    tip: { title: 'Diabetes, presión, asma, colesterol', body: [
      'Crónicos: **receta o pedido del cliente**, **mismo miligramaje**, laboratorio **aliado**, **fidelización**.',
      'No suspender solos. Interacciones (ej. ginseng en hipertensión). Asma: técnica, salina/nebulizador, uso frecuente del rescate → médico.',
      'Suplementos no reemplazan metformina u otros tratamientos.',
    ]},
    exercises: [
      mc('m3l8e1', 'case', 'Pide su metformina “la de siempre”:', ['Mismo mg / aliado + fidelización', 'Subirle el mg', 'Cambiar por té'], 0, 'Misma dosis.'),
      mc('m3l8e2', 'case', 'Hipertenso quiere ginseng:', ['No recomendar; puede afectar presión; médico si insiste', 'Vendérselo feliz', 'Doble'], 0, 'Cuidado.'),
      mc('m3l8e3', 'case', 'Estatina + dolor muscular fuerte:', ['Seguir igual sin decir', 'Refiere al médico', 'Doble dosis'], 1, 'Alarma.'),
      tf('m3l8e4', '“El suplemento puede sustituir el antidiabético.”', false, 'No sustituye.'),
      mt('m3l8e5', 'Une crónico con impulso.', [['Antihipertensivo', 'Pastillero + canje'], ['Salbutamol', 'Salina / nebulizador'], ['Antidepresivo', 'Pastillero; controlados con manual']], 'Adherencia.'),
      mc('m3l8e6', 'case', 'Warfarina + quiere AINE fuerte por su cuenta:', ['Explicar riesgo de sangrado y refiere al médico', 'Ibuprofeno libre', 'AAS extra'], 0, 'Sangrado.'),
      mc('m3l8e7', 'impulso', 'Asmático con salbutamol:', ['Espaciador + salina/equipo nebulizar + fidelización', 'Segundo rescate para doblar', 'Jarabe AB sin Rx'], 0, 'Técnica y soporte.'),
    ],
  },
  {
    id: 209, title: 'Checkpoint Módulo 3',
    tip: { title: 'Checkpoint: Casos de mostrador', body: [
      '10 preguntas de atención, impulso con persuasión, aliados, fidelización, controlados y alarmas. **80% (8/10)** para la insignia **Casos**.',
    ]},
    exercises: [
      mc('m3cpe1', 'complete', 'Antes de recomendar, haz preguntas de seguridad como edad, embarazo y ______.', ['otros medicamentos / alarmas', 'solo el precio', 'el clima'], 0, 'Seguridad.'),
      tf('m3cpe2', '“Controlado con cinto verde se puede vender sin receta si hay 2x1.”', false, 'Nunca sin receta.'),
      mc('m3cpe3', 'case', 'Impulso con persuasión correcta:', ['Completar el cuidado con aliado útil', 'Engañar', 'Presión agresiva'], 0, 'Utilidad.'),
      mt('m3cpe4', 'Une.', [['Laboratorio aliado', 'Priorizar si es equivalente'], ['Cinto verde', 'Manual + receta']], 'Claves M3.'),
      mc('m3cpe5', 'case', 'Heces negras + dolor estómago:', ['Omeprazol y adiós', 'Refiere al médico', 'Ignorar'], 1, 'Alarma.'),
      mc('m3cpe6', 'case', 'Crónico mensual:', ['Fidelización + mismo mg', 'Cambiar mg por ocurrencia', 'Ginseng obligatorio'], 0, 'Adherencia.'),
      tf('m3cpe7', '“Si rechaza el impulso, hay que insistir hasta molestar.”', false, 'Respeto.'),
      mc('m3cpe8', 'choose', 'Salbutamol en mostrador, impulso frecuente:', ['Salina / nebulizador / espaciador', 'AB sin receta', 'Doble inhalador sin criterio'], 0, 'Soporte respiratorio.'),
      mc('m3cpe9', 'case', 'Receta de marca específica:', ['Respetar; no cambiar a ciegas', 'Cambiar siempre al aliado sin decir', 'Dar otra dosis'], 0, 'Indicación.'),
      mc('m3cpe10', 'case', 'Cliente habla de hacerse daño:', ['Ayuda inmediata / urgencias', 'Vitaminas y ya', 'Cambiar de tema'], 0, 'Riesgo vital.'),
    ],
  },
];
