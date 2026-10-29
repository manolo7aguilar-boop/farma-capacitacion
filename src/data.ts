export type Exercise =
  | { id: string; kind: 'complete' | 'case' | 'choose' | 'order' | 'impulso'; label: string; prompt: string; options: string[]; answer: number; feedback: string }
  | { id: string; kind: 'tf'; label: string; prompt: string; answer: boolean; feedback: string }
  | { id: string; kind: 'match'; label: string; prompt: string; pairs: [string, string][]; feedback: string };

type MK = 'complete' | 'case' | 'choose' | 'order' | 'impulso';
const labels: Record<MK, string> = { complete: 'Completa la frase', case: 'Caso de mostrador', choose: 'Elige el mejor consejo', order: 'Ordena la idea', impulso: 'Impulso de venta' };
export function mc(id: string, kind: MK, prompt: string, options: string[], answer: number, feedback: string): Exercise { return { id, kind, label: labels[kind], prompt, options, answer, feedback }; }
export function tf(id: string, prompt: string, answer: boolean, feedback: string): Exercise { return { id, kind: 'tf', label: 'Verdadero o falso', prompt, answer, feedback }; }
export function mt(id: string, prompt: string, pairs: [string, string][], feedback: string): Exercise { return { id, kind: 'match', label: 'Empareja', prompt, pairs, feedback }; }

export interface Lesson { id: number; title: string; tip?: { title: string; body: string[] }; exercises?: Exercise[] }

export const lessons: Lesson[] = [
  {
    id: 1, title: '¿Qué es la farmacología?',
    tip: {
      title: 'Farmacología en una frase',
      body: [
        'La **farmacología** es la ciencia que estudia los **efectos de los medicamentos en el organismo**.',
        '**Farmacodinámica:** qué hace el medicamento *al* cuerpo.',
        '**Farmacocinética:** qué hace el cuerpo *al* medicamento (absorción, distribución, metabolismo, excreción).',
      ],
    },
    exercises: [
      { id: 'l1e1', kind: 'complete', label: 'Completa la frase', prompt: 'La farmacología estudia los efectos de los ______ en el organismo.', options: ['vitaminas', 'medicamentos/fármacos', 'enfermedades', 'precios'], answer: 1, feedback: 'Exacto: el centro son los medicamentos y su efecto.' },
      { id: 'l1e2', kind: 'tf', label: 'Verdadero o falso', prompt: 'Farmacocinética = qué hace el medicamento al cuerpo.', answer: false, feedback: 'Eso es farmacodinámica. Farmacocinética es qué hace el cuerpo al fármaco.' },
      { id: 'l1e3', kind: 'match', label: 'Empareja', prompt: 'Une cada rama con lo que estudia.', pairs: [['Farmacodinámica', 'Efecto del fármaco en el cuerpo'], ['Farmacocinética', 'Absorción, metabolismo, excreción']], feedback: 'Con eso ya puedes explicar “qué hace” vs “cómo circula”.' },
      { id: 'l1e4', kind: 'case', label: 'Caso de mostrador', prompt: 'Cliente: “¿Este jarabe tarda mucho en hacer efecto?” ¿Qué rama explica cuánto tarda en absorberse?', options: ['Toxicología', 'Farmacocinética', 'Solo marketing', 'Farmacodinámica'], answer: 1, feedback: 'La absorción es farmacocinética; el efecto en síntomas es más farmacodinámica.' },
      { id: 'l1e5', kind: 'choose', label: 'Elige el mejor consejo', prompt: 'Para asesorar bien, ¿qué conviene dominar primero?', options: ['Solo el precio', 'Para qué sirve y cómo actúa el medicamento', 'Memorizar marcas sin saber el activo', 'Inventar dosis'], answer: 1, feedback: 'Esa es la base de la farmacología aplicada a ventas.' },
      { id: 'l1e6', kind: 'order', label: 'Ordena la idea', prompt: '¿Cuál es el orden correcto para asesorar?', options: ['Consejo al cliente → Qué es el medicamento → Cómo actúa', 'Qué es el medicamento → Cómo actúa / se absorbe → Consejo claro al cliente', 'Cómo actúa → Consejo al cliente → Qué es el medicamento'], answer: 1, feedback: 'Primero entender, luego recomendar.' },
    ],
  },
  {
    id: 2, title: 'Ramas científicas útiles',
    tip: { title: 'Cada rama responde una pregunta', body: [
      'Además de farmacodinámica y farmacocinética, en mostrador ayudan:',
      '**Farmacología clínica:** uso seguro y eficaz en personas (dosis, interacciones, para quién sí/no).',
      '**Toxicología:** efectos dañinos, sobredosis, qué hacer ante riesgo.',
      'Idea clave: cada rama responde una pregunta distinta cuando el cliente habla.'] },
    exercises: [
      mt('l2e1', 'Une cada rama con su enfoque.', [['Farmacodinámica', 'Qué hace el fármaco al cuerpo'], ['Farmacocinética', 'Absorción / metabolismo'], ['Farmacología clínica', 'Uso seguro en el paciente'], ['Toxicología', 'Daño / sobredosis']], 'Ya tienes el mapa de las cuatro ramas.'),
      tf('l2e2', '“La toxicología solo sirve en hospital, no en farmacia.”', false, 'En mostrador también detectas riesgos y refieres al médico a tiempo.'),
      mc('l2e3', 'complete', 'La farmacología clínica se centra en el uso ______ y eficaz del medicamento.', ['rápido', 'seguro', 'barato', 'opcional'], 1, 'Uso seguro y eficaz: esa es la clave.'),
      mc('l2e4', 'case', 'Cliente: “Tomé el doble de pastillas para el dolor.” ¿Qué rama priorizas?', ['Farmacocinética', 'Toxicología (y referir al médico / seguir protocolo)', 'Ninguna, no pasa nada', 'Marketing'], 1, 'Posible sobredosis: toxicología y referir al médico a tiempo.'),
      mc('l2e5', 'choose', 'Cliente toma 3 medicamentos y pregunta si puede sumar un antigripal. ¿Qué rama guía tu revisión?', ['Toxicología', 'Farmacología clínica (interacciones / idoneidad)', 'Farmacodinámica', 'Ninguna'], 1, 'Interacciones y si es adecuado para esa persona: farmacología clínica.'),
      mc('l2e6', 'order', '¿Cuál es el orden correcto?', ['Aconsejar → Entender la pregunta → Elegir rama', 'Entender la pregunta del cliente → Elegir qué rama aplica → Aconsejar o referir al médico', 'Elegir rama → Aconsejar → Entender la pregunta'], 1, 'Primero escuchar, luego analizar, después aconsejar o referir al médico.'),
    ],
  },
  {
    id: 3, title: '¿Qué es un medicamento?',
    tip: { title: 'Definición práctica', body: [
      'Un **medicamento** es una sustancia (o combinación) usada para **tratar, prevenir, aliviar o diagnosticar** una enfermedad o síntoma.',
      'No todo lo que se vende en farmacia es medicamento: hay dispositivos, cosméticos y suplementos. El consejo cambia según qué sea.'] },
    exercises: [
      mc('l3e1', 'complete', 'Un medicamento sirve para tratar, prevenir, aliviar o ______.', ['decorar', 'diagnosticar', 'perfumar', 'vender'], 1, 'Tratar, prevenir, aliviar o diagnosticar.'),
      mc('l3e2', 'choose', '¿Cuál de estos SÍ es un medicamento?', ['Crema hidratante sin indicación terapéutica', 'Paracetamol tabletas', 'Prueba de embarazo'], 1, 'Paracetamol sí. La crema hidratante es cosmético y la prueba de embarazo es un dispositivo de diagnóstico.'),
      tf('l3e3', '“Si es ‘natural’, no cuenta como medicamento.”', false, 'Muchos productos naturales tienen efectos o son medicamentos; hay que asesorar con cuidado.'),
      mc('l3e4', 'case', 'Cliente: “Esto es hierba, ¿puedo dárselo al niño sin problema?” Mejor respuesta:', ['“Sí, lo natural no hace daño.”', 'Preguntar para qué lo usa, revisar si es medicamento/suplemento y sus riesgos; no asumir que es inocuo', '“No sé, pruébelo.”'], 1, 'Nunca asumir que es inocuo, menos en niños.'),
      mc('l3e5', 'choose', 'Para asesorar bien, lo primero es…', ['Ofrecer lo más caro', 'Identificar si es medicamento y para qué indicación', 'Recomendar la marca más conocida'], 1, 'Saber qué es y para qué sirve va primero.'),
      mt('l3e6', 'Une cada propósito con su significado.', [['Tratar', 'Quitar o controlar una enfermedad'], ['Prevenir', 'Evitar que aparezca'], ['Aliviar', 'Reducir la molestia'], ['Diagnosticar', 'Ayudar a detectar']], 'Los cuatro usos de un medicamento.'),
    ],
  },
  {
    id: 4, title: 'Composición',
    tip: { title: 'Activo y excipientes', body: [
      '**Principio activo:** la sustancia que produce el efecto terapéutico.',
      '**Excipientes:** el resto (relleno, sabor, color, conservantes) que ayuda a fabricar, conservar o administrar.',
      'En mostrador importan por alergias, intolerancias y por qué dos marcas “iguales” se sienten distintas.'] },
    exercises: [
      mt('l4e1', 'Une cada componente con su función.', [['Principio activo', 'Produce el efecto'], ['Excipientes', 'Ayudan a formular / administrar']], 'Activo = efecto; excipientes = soporte.'),
      mc('l4e2', 'complete', 'El efecto del medicamento lo da principalmente el ______.', ['color', 'principio activo', 'empaque', 'sabor'], 1, 'El principio activo es el responsable del efecto.'),
      tf('l4e3', '“Los excipientes nunca importan en el consejo.”', false, 'Pueden causar alergias o molestias; hay que leer el empaque.'),
      mc('l4e4', 'case', 'Cliente alérgico a un colorante pregunta por un jarabe. ¿Qué haces?', ['Lo vendes igual', 'Revisas los excipientes y buscas una alternativa sin ese componente', 'Le dices que no existe alergia a colorantes'], 1, 'Revisar excipientes protege al cliente.'),
      mc('l4e5', 'choose', 'Cliente: “¿El genérico es lo mismo?” Mejor base para responder:', ['“Es totalmente distinto.”', 'Mismo principio activo (comparar dosis y forma); los excipientes pueden variar', '“Solo cambia el precio, todo es idéntico.”'], 1, 'Mismo activo y dosis; excipientes pueden diferir.'),
      mc('l4e6', 'order', '¿Cuál es el orden correcto?', ['Identificar principio activo → Revisar dosis/forma → Revisar alertas de excipientes', 'Revisar excipientes → Vender → Revisar activo', 'Revisar precio → Activo → Forma'], 0, 'Activo, dosis/forma, y luego alertas.'),
    ],
  },
  {
    id: 5, title: 'Cómo se llaman',
    tip: { title: 'Un medicamento, varios nombres', body: [
      '**Nombre genérico / DCI:** el del principio activo (ej. paracetamol). DCI = Denominación Común Internacional.',
      '**Nombre comercial:** la marca del laboratorio.',
      'En mostrador: leer el activo evita confusiones entre marcas.'] },
    exercises: [
      mt('l5e1', 'Une cada tipo de nombre.', [['Genérico / DCI', 'Principio activo'], ['Comercial', 'Marca del laboratorio']], 'Genérico = activo; comercial = marca.'),
      mc('l5e2', 'complete', 'Para comparar dos cajas, lo más confiable es mirar el ______.', ['color de la caja', 'principio activo (genérico/DCI)', 'precio', 'logo'], 1, 'El activo te dice qué es realmente.'),
      tf('l5e3', '“El nombre comercial y el genérico siempre son la misma palabra.”', false, 'La marca puede ser cualquier nombre; el activo es el que manda.'),
      mc('l5e4', 'case', 'Cliente: “¿Me da el de siempre?” y señala otra marca. ¿Qué verificas primero?', ['Que la caja sea del mismo color', 'Que el principio activo y la dosis/forma coincidan', 'Que sea más barato'], 1, 'Mismo activo, dosis y forma.'),
      mc('l5e5', 'choose', '¿Para qué sirve saber la DCI en mostrador?', ['Para identificar el activo aunque cambie la marca', 'Para cobrar más', 'No sirve'], 0, 'La DCI es igual en todo el mundo.'),
      mc('l5e6', 'case', 'Blíster: “Dolofast · Paracetamol 500 mg”. ¿Cuál es el principio activo?', ['Dolofast', 'Paracetamol', '500 mg'], 1, 'Paracetamol = activo · Dolofast = comercial · 500 mg = dosis.'),
    ],
  },
  {
    id: 6, title: 'Formas y vías',
    tip: { title: 'Cómo viene y por dónde entra', body: [
      '**Forma farmacéutica:** cómo viene el medicamento (tableta, jarabe, crema, gotas, inyectable…).',
      '**Vía de administración:** por dónde entra al cuerpo (oral, tópica, nasal, oftálmica, intramuscular…).',
      'La forma debe coincidir con la vía y con lo que el cliente puede usar (niños, dificultad para tragar, zona de la piel).'] },
    exercises: [
      mt('l6e1', 'Une forma con vía.', [['Tableta / cápsula', 'Oral'], ['Crema / ungüento', 'Tópica'], ['Gotas oftálmicas', 'Oftálmica']], 'Forma y vía siempre van juntas.'),
      mc('l6e2', 'complete', 'La vía indica ______ entra el medicamento al organismo.', ['cuándo', 'por dónde', 'cuánto cuesta', 'quién'], 1, 'La vía es el camino de entrada.'),
      tf('l6e3', '“Una crema siempre se traga.”', false, 'La crema es de uso tópico, sobre la piel.'),
      mc('l6e4', 'case', 'Niño que no traga pastillas. Mejor orientación:', ['Partir la pastilla siempre', 'Buscar forma líquida u otra adecuada (según producto e indicación)', 'Darle una crema'], 1, 'Elegir una forma que el niño pueda usar bien.'),
      mc('l6e5', 'choose', 'Cliente con erupción en la piel pide “pastillas fuertes”. Primero:', ['Venderle las pastillas más fuertes', 'Entender el problema y ver si conviene vía tópica u otra', 'Decirle que no hay nada'], 1, 'No empujar una forma incorrecta.'),
      mc('l6e6', 'order', '¿Cuál es el orden correcto del consejo?', ['Explicar uso → Elegir forma → Confirmar necesidad', 'Confirmar para qué lo necesita → Elegir forma/vía → Explicar cómo usarlo', 'Elegir forma → Cobrar → Confirmar necesidad'], 1, 'Necesidad, forma/vía, instrucciones.'),
    ],
  },
  {
    id: 7, title: 'Etiquetado',
    tip: { title: 'Leer la etiqueta rápido', body: [
      'La etiqueta te dice: **nombre**, **principio activo**, **dosis**, **indicación**, **advertencias**, **caducidad**, **lote** y laboratorio.',
      'Nunca recomiendes un producto sin revisar **caducidad** y advertencias clave.'] },
    exercises: [
      mt('l7e1', 'Une cada dato con su significado.', [['Caducidad', 'Hasta cuándo usar'], ['Lote', 'Trazabilidad / retiro'], ['Advertencias', 'Riesgos y precauciones'], ['Dosis', 'Cuánto y cada cuánto']], 'Ya sabes leer lo esencial.'),
      mc('l7e2', 'complete', 'Antes de entregar, revisa al menos la ______ y las advertencias.', ['caducidad', 'marca', 'tipografía', 'caja'], 0, 'Caducidad y advertencias, siempre.'),
      tf('l7e3', '“Si el cliente tiene prisa, no hace falta mirar la fecha.”', false, 'La fecha se revisa siempre.'),
      mc('l7e4', 'case', 'Encuentras un producto vencido en el anaquel. ¿Qué haces?', ['Venderlo con descuento', 'No venderlo, retirarlo y ofrecer una alternativa vigente', 'Dejarlo ahí'], 1, 'Vencido = fuera del anaquel.'),
      mc('l7e5', 'choose', 'El cliente no entiende el prospecto. Mejor práctica:', ['Decirle que lo lea en casa', 'Explicar en simple indicación, dosis y 1–2 advertencias clave', 'Leerle todo el prospecto'], 1, 'Claro y breve.'),
      mc('l7e6', 'case', 'Etiqueta: “Ibuprofeno 400 mg · No usar en embarazo sin indicación · CAD 03/2027 · Lote A12”. ¿Cuál es la caducidad?', ['400 mg', 'A12', '03/2027', 'Embarazo'], 2, 'Dosis 400 mg · advertencia embarazo · CAD 03/2027 · lote A12.'),
    ],
  },
  {
    id: 8, title: 'Disponibilidad y biodisponibilidad',
    tip: { title: '¿Cuánto llega a hacer efecto?', body: [
      '**Disponibilidad:** que el fármaco esté “disponible” para actuar donde debe.',
      '**Biodisponibilidad:** qué fracción del medicamento llega a la circulación y puede hacer efecto.',
      'Por eso a veces importa la **forma**, si va **con o sin comida**, o por qué un inyectable no es igual a una pastilla.'] },
    exercises: [
      mc('l8e1', 'complete', 'La biodisponibilidad habla de cuánto del fármaco ______ para hacer efecto.', ['se vende', 'llega / queda disponible', 'cuesta', 'pesa'], 1, 'Cuánto llega realmente a actuar.'),
      tf('l8e2', '“La misma dosis oral e inyectable siempre se comportan igual.”', false, 'La vía cambia cuánto llega.'),
      mt('l8e3', 'Une cada factor con su efecto.', [['Con comida / ayuno', 'Puede cambiar la absorción'], ['Forma farmacéutica', 'Puede cambiar qué tanto llega'], ['Vía intravenosa', 'Biodisponibilidad alta']], 'Varios factores cambian cuánto llega.'),
      mc('l8e4', 'case', 'Etiqueta: “tomar con el estómago vacío”. El cliente lo toma con un desayuno fuerte. Riesgo:', ['Ninguno', 'Puede cambiar la absorción / el efecto esperado', 'Se vuelve tóxico siempre'], 1, 'Cambia la absorción y el efecto.'),
      mc('l8e5', 'choose', '¿Para qué le sirve esto a un vendedor?', ['Para explicar por qué “cómo se toma” importa tanto como “qué se toma”', 'Para vender más inyectables', 'No le sirve'], 0, 'Las indicaciones de toma importan.'),
      mc('l8e6', 'order', '¿Cuál es el orden correcto?', ['Leer indicaciones de toma → Explicar con/sin comida si aplica → Confirmar que entendió', 'Confirmar → Leer → Explicar', 'Explicar → Cobrar → Leer'], 0, 'Leer, explicar, confirmar.'),
    ],
  },
];

export const checkpoint: Lesson = {
  id: 9, title: 'Checkpoint Módulo 1',
  tip: { title: 'Checkpoint: Fundamentos', body: ['10 preguntas de todo el Módulo 1. Necesitas **80% (8/10)** para ganar la insignia **Fundamentos** y desbloquear el Módulo 2 · Familias.'] },
  exercises: [
    mc('cpe1', 'complete', 'La farmacología estudia los efectos de los ______ en el organismo.', ['precios', 'medicamentos/fármacos', 'vitaminas'], 1, 'Medicamentos y sus efectos.'),
    tf('cpe2', '“Farmacocinética = qué hace el medicamento al cuerpo.”', false, 'Eso es farmacodinámica.'),
    mt('cpe3', 'Une cada rama.', [['Toxicología', 'Sobredosis / daño'], ['Farmacología clínica', 'Uso seguro en la persona']], 'Bien.'),
    mc('cpe4', 'case', 'Cliente tomó el doble de analgésico. Priorizas…', ['Farmacocinética', 'Toxicología / protocolo y referir al médico', 'Nada'], 1, 'Toxicología y referir al médico.'),
    mc('cpe5', 'choose', 'Un medicamento sirve para tratar, prevenir, aliviar o…', ['diagnosticar', 'decorar', 'vender'], 0, 'Diagnosticar.'),
    tf('cpe6', '“Natural = siempre inocuo.”', false, 'No asumir que es inocuo.'),
    mc('cpe7', 'complete', 'El efecto lo da sobre todo el ______.', ['excipiente', 'principio activo', 'color'], 1, 'El principio activo.'),
    mc('cpe8', 'case', 'Para comparar dos marcas, miras primero…', ['El precio', 'Principio activo + dosis/forma', 'El color'], 1, 'Activo, dosis y forma.'),
    mt('cpe9', 'Une forma con vía.', [['Crema', 'Tópica'], ['Jarabe', 'Oral']], 'Correcto.'),
    mc('cpe10', 'case', 'Producto vencido en el anaquel:', ['Venderlo con descuento', 'No vender, retirar y ofrecer uno vigente', 'Ignorarlo'], 1, 'Fuera del anaquel.'),
  ],
};
export const allLessons = [...lessons, checkpoint];

export const m1Base: Lesson[] = [{
  id: 101, title: 'Analgésicos y antipiréticos',
  tip: { title: 'Dolor y fiebre en mostrador', body: [
    '**Analgésicos** alivian el dolor; **antipiréticos** bajan la fiebre. Activos comunes: **paracetamol**, **ibuprofeno** (antiinflamatorio) y la noción de **ácido acetilsalicílico (AAS / aspirina)**.',
    'Vienen en tabletas, jarabes, gotas pediátricas, supositorios y efervescentes: elige según edad y preferencia.',
    '**Advertencias:** respetar dosis máxima diaria; paracetamol en exceso daña el **hígado**; ibuprofeno y AAS pueden irritar el **estómago**. Pregunta siempre **edad, otros medicamentos y embarazo**.',
    '**Refiere al médico** si: dolor muy intenso o súbito, fiebre alta o de más de 3 días, embarazo, niños pequeños, o señales de alarma.'] },
  exercises: [
    mc('m1l1e1', 'complete', 'El paracetamol se usa principalmente para el dolor y la ______.', ['tos', 'fiebre', 'alergia', 'acidez'], 1, 'Analgésico y antipirético: dolor y fiebre.'),
    tf('m1l1e2', '“El ibuprofeno no tiene ningún riesgo para el estómago.”', false, 'Ibuprofeno y AAS pueden irritar el estómago; conviene tomarlos con comida y preguntar antecedentes.'),
    mt('m1l1e3', 'Une cada activo con su cuidado clave.', [['Paracetamol', 'Exceso daña el hígado'], ['Ibuprofeno', 'Puede irritar el estómago'], ['AAS (aspirina)', 'Cuidado en niños y con sangrado']], 'Cada activo tiene su alerta principal.'),
    mc('m1l1e4', 'case', 'Cliente: “Deme algo para el dolor de cabeza.” ¿Qué preguntas antes de recomendar?', ['Ninguna, le doy el más vendido', 'Edad, otros medicamentos, embarazo y si el dolor es inusual o muy intenso', 'Solo si quiere marca o genérico'], 1, 'Unas pocas preguntas evitan riesgos y te dicen si hay que referir al médico.'),
    mc('m1l1e5', 'case', 'Cliente: “Me tomé dos pastillas de paracetamol de más porque no se me quitaba.” ¿Qué haces?', ['Le digo que tome otra más', 'Pregunto cuánto y cuándo tomó; explico dosis máxima; si excedió o hay síntomas, lo refiero al médico', 'Le vendo ibuprofeno para combinar sin preguntar'], 1, 'Doble dosis = revisar cantidad, explicar límite y referir al médico si hace falta.'),
    mc('m1l1e6', 'choose', 'Cliente embarazada pide ibuprofeno para un dolor fuerte. Mejor consejo:', ['Venderle ibuprofeno', 'No recomendar por tu cuenta; referir a su médico', 'Recomendar aspirina'], 1, 'En embarazo, refiere al médico: no es decisión de mostrador.'),
    mc('m1l1e7', 'case', 'Cliente: “¿El genérico de paracetamol es igual al de marca?” Mejor respuesta:', ['“No, el genérico no funciona.”', 'Mismo principio activo y dosis (ej. 500 mg); cambia la marca y quizá excipientes', '“Sí, todo es idéntico, hasta el sabor.”'], 1, 'Compara activo, dosis y forma.'),
    mc('m1l1e8', 'impulso', 'Cliente lleva paracetamol para la fiebre de su hijo. ¿Qué impulso le sirve de verdad?', ['Un termómetro y sales de rehidratación oral para vigilar la fiebre y mantenerlo hidratado, priorizando el laboratorio aliado cuando haya opción equivalente', 'Una segunda caja de ibuprofeno para alternar sin preguntar', 'Un jarabe con antibiótico “por si acaso”'], 0, 'Termómetro + hidratación completan el cuidado; si la fiebre sigue alta, refiere al médico. Prioriza los laboratorios aliados de la farmacia. Si hay promo del laboratorio o plan de fidelización (canjes tipo 2x1, 3x1), ofrécelo.'),
  ],
}, {
  id: 102, title: 'Antiinflamatorios (AINE)',
  tip: { title: 'AINE: dolor + inflamación', body: [
    'Los **AINE** (antiinflamatorios no esteroideos) bajan **inflamación, dolor y fiebre**. Ejemplos: **ibuprofeno**, **naproxeno**, **diclofenaco**.',
    'Formas: **orales** (tabletas, cápsulas) para efecto general, y **tópicas** (gel, crema) para dolor localizado como golpes o torceduras, con menos efecto en el estómago.',
    '**Advertencias:** pueden irritar o lastimar el **estómago** (tomar con comida); **no combinar dos AINE**; cuidado en embarazo, problemas de riñón, presión alta, úlcera o si toma anticoagulantes.',
    '**Refiere al médico** si hay dolor muy intenso, hinchazón grande tras un golpe fuerte, sangrado digestivo o embarazo.'] },
  exercises: [
    mc('m1l2e1', 'complete', 'AINE significa antiinflamatorio no ______.', ['esteroideo', 'natural', 'genérico', 'oral'], 0, 'Antiinflamatorio No Esteroideo.'),
    tf('m1l2e2', '“Tomar ibuprofeno y naproxeno juntos da más efecto sin riesgo.”', false, 'Dos AINE juntos suman riesgo (estómago, riñón) sin mucho beneficio extra.'),
    mt('m1l2e3', 'Une cada forma con su uso.', [['Gel / crema AINE', 'Dolor localizado (torcedura, golpe)'], ['Tableta AINE', 'Efecto general en el cuerpo']], 'Tópico para lo local, oral para lo general.'),
    mc('m1l2e4', 'case', 'Cliente con torcedura leve de tobillo y estómago delicado pregunta: “¿Gel o pastillas?”', ['Pastillas siempre, son más fuertes', 'Sugerir gel AINE en la zona; menos efecto en el estómago', 'Nada sirve'], 1, 'Para dolor local y estómago sensible, el gel es buena opción.'),
    mc('m1l2e5', 'case', 'Cliente ya toma diclofenaco y quiere añadir ibuprofeno “para que funcione más”. ¿Qué haces?', ['Se lo vendo', 'Explico que no se combinan dos AINE; reviso dosis y, si el dolor no cede, lo refiero al médico', 'Le recomiendo tomar el doble de diclofenaco'], 1, 'No sumar AINE; si no alcanza, toca evaluar con médico.'),
    mc('m1l2e6', 'case', 'Cliente con gastritis pide “algo fuerte para el dolor de espalda”. Mejor orientación:', ['Ibuprofeno en ayunas', 'Preguntar más, considerar opción tópica o alternativa y referir al médico si es necesario; si toma AINE oral, con comida y vigilancia', 'Naproxeno doble dosis'], 1, 'Estómago sensible = cuidado con AINE orales.'),
    mc('m1l2e7', 'choose', '¿Qué preguntar antes de recomendar un AINE oral?', ['Solo el presupuesto', 'Estómago (úlcera/gastritis), embarazo, riñón/presión, otros medicamentos', 'Marca favorita'], 1, 'Esas preguntas evitan los riesgos principales.'),
    mc('m1l2e8', 'impulso', 'Cliente lleva gel AINE por una torcedura leve de tobillo. ¿Qué impulso le sirve?', ['Venda elástica y compresa fría/gel frío para reposo, hielo y compresión, priorizando el laboratorio aliado cuando haya opción equivalente', 'Tabletas de ibuprofeno para tomar a doble dosis junto al gel', 'Un segundo gel AINE distinto para combinar'], 0, 'Venda + frío ayudan a la recuperación; si no mejora o la hinchazón es grande, refiere al médico. Prioriza los laboratorios aliados de la farmacia. Si hay promo del laboratorio o plan de fidelización (canjes tipo 2x1, 3x1), ofrécelo.'),
  ],
}];
export const m1Families: string[] = [];
