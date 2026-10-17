/*
 * Contenido de las guías de estudio por cargo.
 * Fuente: perfiles, matrices y actas de las comisiones publicados en Paraguay Concursa
 * de cada convocatoria, relevados el 17/10/2026.
 * Los textos marcados como "sugerencia" no son oficiales.
 */
window.APP_CONTENIDO = (function () {
  'use strict';

  var ACTUALIZADO = '17/10/2026';

  var FECHAS = {
    CPI: {
      nombre: 'Concurso Público de Ingreso (CPI): cargos permanentes',
      reunion: 'Lunes 19/10/2026 a las 10:00, en vivo por YouTube (canal @andeonline).',
      postulacion: 'Del martes 20/10/2026 a las 08:00 al lunes 26/10/2026 a las 15:00, solo en días hábiles de 08:00 a 15:00.',
      limite: '2026-10-26T15:00:00-03:00'
    },
    CPIEP: {
      nombre: 'Concurso Público de Ingreso de Empleados Públicos (CPIEP): contratos',
      reunion: 'Martes 20/10/2026 a las 10:00, en vivo por YouTube (canal @andeonline).',
      postulacion: 'Del miércoles 21/10/2026 a las 08:00 al martes 27/10/2026 a las 15:00, solo en días hábiles de 08:00 a 15:00.',
      limite: '2026-10-27T15:00:00-03:00'
    }
  };

  var CONTACTO = {
    unidad: 'Sección Selección del Personal de la ANDE',
    correo: 'andeseleccion2026@gmail.com',
    telefonos: '(021) 217 2880, 217 2559, 217 2765 y 217 2865',
    horario: 'lunes a viernes de 08:00 a 15:00'
  };

  var POSTULAR_URL = 'https://postulaciones.ande.gov.py/';
  var PORTAL_URL = 'https://paraguayconcursa.mef.gov.py/';

  /* ---------- Requisitos reutilizados ---------- */
  var R = {
    bach: 'Educación Media concluida (título de bachiller).',
    cap240: 'Al menos 240 horas acumuladas de capacitación en electricidad, electromecánica y seguridad industrial, con certificados que indiquen la carga horaria.',
    medico: 'Certificado médico emitido en los últimos 3 meses que indique aptitud para trabajo en altura, esfuerzo físico moderado y exposición a la intemperie, con nombre y CI del postulante y nombre y registro del médico.',
    residencia: 'Vivir en el departamento donde está el cargo y demostrarlo con un Certificado de Vida y Residencia original y vigente.',
    sobreOper: 'Que tu formación no supere la pedida: las bases excluyen a quien esté sobrecalificado. Con título de técnico superior o universitario, consultá antes de postular.',
    sobreTS: 'Que tu formación no supere la pedida: un título universitario te excluye por sobrecalificación.',
    expTec: '6 meses de experiencia específica en tareas relacionadas al puesto, demostrada con documentos.',
    expPro: '2 años de experiencia específica en tareas relacionadas al puesto, demostrada con documentos.'
  };

  var COND_CPIEP = 'Lunes a viernes de 07:00 a 15:00. Contrato por el ejercicio fiscal; se renueva según la disponibilidad presupuestaria y la evaluación de desempeño.';

  /* ---------- Cargos para postulantes externos ---------- */
  function profesional(titulo, extra) {
    var p = {
      tipo: 'CPIEP', conv: 'ANDE-CPIEP-74-2026', area: 'Profesional',
      nivel: 'Profesional Junior. Rango salarial Gs. 5.798.096 a 6.377.906.',
      tema: 'pro', preguntas: ['pro'], plan: 'pro', matriz: 'pro',
      resumen: 'Título universitario en ' + titulo + ' y 2 años de experiencia específica.',
      req: ['Título universitario en ' + titulo + '.', R.expPro, R.residencia],
      formacion: 'Título universitario según el perfil (excluyente): 10.',
      funciones: null,
      condiciones: COND_CPIEP,
      nota: 'En los cargos profesionales solo se excluye a quien tenga formación inferior a la pedida: un posgrado no te deja afuera.'
    };
    if (extra) { for (var k in extra) { if (Object.prototype.hasOwnProperty.call(extra, k)) { p[k] = extra[k]; } } }
    return p;
  }

  var PUESTOS = {
    'Operador de Estaciones y Subestaciones IV': {
      tipo: 'CPI', conv: 'ANDE-CPI-08-2026', area: 'Operacional',
      nivel: 'Plano Operacional Técnico.',
      tema: 'cpi_pot', preguntas: ['cpi', 'pot'], plan: 'cpi', matriz: 'cpi', medico: true,
      resumen: 'Bachiller y 240 horas de capacitación en electricidad, electromecánica y seguridad industrial.',
      req: [R.bach, R.cap240, R.medico, R.residencia, R.sobreOper],
      formacion: 'Bachiller técnico en electricidad, electromecánica, electrotecnia o electrónica: 15 · bachiller: 12.',
      prueba: 'Prueba teórico-práctica sobre el temario.',
      capDoc: 'Certificados de capacitación con carga horaria (obligatorios: mínimo 240 horas en total).',
      funciones: [
        'Operar estaciones y subestaciones de 500, 220, 66 y 23 kV, con la regulación y el despacho de carga de alta y muy alta tensión.',
        'Hacer inspecciones diarias para detectar fallas y coordinar el mantenimiento necesario.',
        'Ejecutar maniobras en los equipos con los sistemas de supervisión y control.',
        'Habilitar trabajos de mantenimiento con los centros de control de transmisión y verificar los equipos liberados.',
        'Operar los sistemas de emergencia, como generadores y compensadores estáticos.',
        'Registrar y monitorear tensión, corriente y otros parámetros con equipos de medición.',
        'Conducir vehículos de la ANDE para tareas operativas y de mantenimiento.'
      ],
      condiciones: 'Lunes a viernes, 8 horas diarias en turnos rotativos. La ANDE puede asignarte o trasladarte a cualquiera de las estaciones del departamento.'
    },
    'Electromecánico IV': {
      tipo: 'CPI', conv: 'ANDE-CPI-05-2026', area: 'Operacional',
      nivel: 'Plano Operacional Técnico.',
      tema: 'cpi_pot', preguntas: ['cpi', 'pot'], plan: 'cpi', matriz: 'cpi', medico: true,
      resumen: 'Bachiller y 240 horas de capacitación en electricidad, electromecánica y seguridad industrial.',
      req: [R.bach, R.cap240, R.medico, R.residencia, R.sobreOper],
      formacion: 'Bachiller técnico en electricidad, electromecánica, electrotecnia o electrónica: 15 · bachiller: 12.',
      prueba: 'Prueba teórico-práctica sobre el temario.',
      capDoc: 'Certificados de capacitación con carga horaria (obligatorios: mínimo 240 horas en total).',
      funciones: [
        'Mantenimiento preventivo y correctivo de equipos de generación, transmisión y distribución: generadores, transformadores, seccionadores, reconectadores y equipos de medición.',
        'Mantenimiento programado de transformadores de potencia, reactores, subestaciones móviles y equipos de maniobra.',
        'Mantenimiento de servicios auxiliares, paneles de control, comunicaciones, protecciones y sistemas de corriente alterna y continua.',
        'Montaje de equipos pesados, cambio de aisladores en líneas y extracción de muestras de aceite aislante.',
        'Gestión de materiales y repuestos, y fiscalización de la fabricación de equipos.',
        'Colaborar en la construcción y el mantenimiento de líneas de transmisión y distribución.',
        'Conducir vehículos livianos y pesados.'
      ],
      condiciones: 'Lunes a viernes, 8 horas en turnos rotativos según el cronograma de la unidad. Pide buena condición física: trabajos en altura, caminatas en terreno variado y clima adverso.'
    },
    'Electricista de Distribución IV': {
      tipo: 'CPI', conv: 'ANDE-CPI-06-2026', area: 'Operacional',
      nivel: 'Plano Operacional Técnico.',
      tema: 'cpi_elec', preguntas: ['cpi', 'dist'], plan: 'cpi', matriz: 'cpi', medico: true,
      resumen: 'Bachiller y 240 horas de capacitación en electricidad, electromecánica y seguridad industrial.',
      req: [R.bach, R.cap240, R.medico, R.residencia, R.sobreOper],
      formacion: 'Bachiller técnico en electricidad, electromecánica o electrotecnia: 15 · bachiller: 12.',
      prueba: 'Prueba teórico-práctica. El temario incluye habilidades prácticas en el patio de maniobras de la ANDE.',
      capDoc: 'Certificados de capacitación con carga horaria (obligatorios: mínimo 240 horas en total).',
      funciones: [
        'Construcción y mantenimiento de líneas de distribución aéreas y subterráneas.',
        'Instalación y supervisión de equipos de distribución.',
        'Monitoreo, control y operación de la red de distribución para evitar interrupciones.',
        'Supervisión de proyectos de distribución y de las obras civiles asociadas.',
        'Instalación, mantenimiento y fiscalización del alumbrado público.',
        'Cumplimiento estricto de las normas de seguridad.',
        'Conducir vehículos de la ANDE livianos, pesados o especiales.'
      ],
      condiciones: 'Lunes a viernes, 8 horas en turnos rotativos según el cronograma de la unidad.'
    },
    'Lector Distribuidor II': {
      tipo: 'CPI', conv: 'ANDE-CPI-07-2026', area: 'Operacional',
      nivel: 'Plano Operacional Técnico.',
      tema: 'cpi_lector', preguntas: ['cpi', 'dist'], plan: 'cpi', matriz: 'cpi', medico: true,
      resumen: 'Bachiller y curso de electricidad doméstica básica de 100 horas.',
      req: [R.bach, 'Curso de electricidad doméstica básica de al menos 100 horas, con certificado que indique la carga horaria.', R.medico, R.residencia, R.sobreOper],
      formacion: 'Título de bachiller: 15.',
      prueba: 'Prueba teórico-práctica sobre el temario.',
      capDoc: 'Certificado del curso de electricidad doméstica básica (obligatorio: mínimo 100 horas) y otros cursos con carga horaria.',
      funciones: [
        'Leer medidores de energía y potencia, en forma manual o con colectores electrónicos.',
        'Mantener actualizados los datos de clientes y suministros: medidor, dirección e itinerarios.',
        'Detectar e informar anormalidades: conexiones directas, fraudes o robos de energía.',
        'Hacer el censo de medidores.',
        'Distribuir las facturas a los clientes.'
      ],
      condiciones: 'Sin horario fijo: se trabaja por plazos de entrega de los libros de lectura según el cronograma, en distintas zonas y ciudades del área asignada.'
    },
    'Despachante de Carga Junior': {
      tipo: 'CPI', conv: 'ANDE-CPI-05-2026', area: 'Técnico',
      nivel: 'Plano Técnico Junior.',
      tema: 'cpi_pot', preguntas: ['cpi', 'pot'], plan: 'cpi', matriz: 'cpi', medico: false,
      resumen: 'Título de técnico superior. No exige experiencia.',
      req: ['Título de técnico superior.', R.residencia, R.sobreTS],
      formacion: 'Técnico superior en electricidad, electromecánica, electrónica o mecatrónica: 15 · técnico superior en otra área: 10.',
      prueba: 'Prueba teórico-práctica sobre el temario.',
      capDoc: 'Certificados de capacitación con carga horaria (opcionales, suman puntos).',
      funciones: [
        'Analizar las configuraciones del Sistema Interconectado Nacional y la operación eléctrica en tiempo real.',
        'Mantenimiento de estaciones, subestaciones, líneas de transmisión y sistemas de control y protección.',
        'Ensayos y mediciones de equipos, termografía y análisis de aceite aislante.',
        'Calcular costos de equipos, mantenimiento y energía, y armar escenarios para cubrir la demanda horaria.',
        'Controlar los sistemas de protección según los parámetros establecidos.',
        'Tareas administrativas y conducción de vehículos de la ANDE.'
      ],
      condiciones: 'Lunes a viernes, 8 horas en turnos rotativos según el cronograma de la unidad. No pide certificado médico.'
    },
    'Técnico Junior': {
      tipo: 'CPIEP', conv: 'ANDE-CPIEP-74-2026', area: 'Técnico',
      nivel: 'Técnico Junior. Rango salarial Gs. 2.899.049 a 4.348.572.',
      tema: 'tec', preguntas: ['tec'], plan: 'tec', matriz: 'tec',
      resumen: 'Técnico superior en electricidad, electrónica, mecatrónica o procesos industriales y 6 meses de experiencia específica.',
      req: ['Título de técnico superior en electricidad, electrónica, mecatrónica o procesos industriales.', R.expTec, R.residencia, R.sobreTS],
      formacion: 'Técnico superior concluido (excluyente): 10.',
      funciones: [
        'Tareas técnicas de gabinete.',
        'Seguimiento y verificación de datos de obras del Sistema Eléctrico Nacional.',
        'Estudios y programación del mantenimiento de equipos de generación, transmisión y distribución.',
        'Acompañar el comisionamiento de equipos e instalaciones nuevas.',
        'Recopilar y actualizar datos técnicos de equipos e instalaciones.',
        'Elaborar esquemas eléctricos y cartografía georreferenciada (GIS/SIG).',
        'Informes técnicos de operación, suministro e interconexión. Conducir vehículos de la ANDE.'
      ],
      condiciones: COND_CPIEP,
      nota: 'La electromecánica no figura entre los títulos aceptados. Si es tu título, consultá a la comisión antes de postular.'
    },
    'Ingeniero Electricista Junior': profesional('Ingeniería en Electricidad o Ingeniería Eléctrica', {
      area: 'Ingeniería',
      funciones: [
        'Estudios, proyectos, mantenimiento, operación, fiscalización y comisionamiento de instalaciones de generación, transmisión y distribución.',
        'Estudios del sistema de potencia: flujo de carga, cortocircuito, estabilidad, coordinación de protecciones y calidad de energía.',
        'Mantenimiento y fiscalización de equipos de potencia: transformadores, interruptores, seccionadores, bancos de capacitores y grupos generadores.',
        'Especificaciones técnicas, planos, esquemas unifilares y memorias de cálculo.',
        'Ensayos de equipos: aislamiento, relación de transformación, resistencia de contactos y puesta a tierra.'
      ]
    }),
    'Ingeniero Electromecánico Junior': profesional('Ingeniería Electromecánica', { area: 'Ingeniería' }),
    'Ingeniero Electrónico/Mecatrónica Junior': profesional('Ingeniería Electrónica o Ingeniería Mecatrónica', { area: 'Ingeniería' }),
    'Ingeniero Civil Junior': profesional('Ingeniería Civil', { area: 'Ingeniería' }),
    'Ingeniero Químico Junior': profesional('Ingeniería Química o Ingeniería de Procesos Químicos', { area: 'Ingeniería' }),
    'Profesional Ambiental Junior': profesional('Ingeniería Ambiental, Ingeniería Geográfica y Ambiental o Ingeniería Geográfica Ambiental'),
    'Profesional Económico Contable Junior': profesional('Ciencias Económicas o Ciencias Contables'),
    'Asistente Social Junior': profesional('Trabajo Social o Servicio Social')
  };

  /* ---------- Temarios oficiales ---------- */
  var B = {
    fundamentos: { t: 'Fundamentos de electricidad', items: [
      'Conceptos de tensión, corriente, resistencia, potencia y energía eléctrica.',
      'Unidades eléctricas: volt (V), ampere (A), ohm (Ω), watt (W), kilowatt (kW) y kilowatt-hora (kWh).',
      'Corriente continua (CC) y corriente alterna (CA): conceptos y diferencias.',
      'Circuitos eléctricos en serie y en paralelo.',
      'Sistemas monofásicos y trifásicos: conceptos básicos.',
      'Frecuencia eléctrica: concepto y unidad de medida.'
    ] },
    leyes: { t: 'Leyes y cálculos eléctricos básicos', items: [
      'Ley de Ohm: relación entre tensión, corriente y resistencia.',
      'Potencia eléctrica y sus unidades de medida.',
      'Energía eléctrica y cálculo básico del consumo.',
      'Leyes de Kirchhoff: conceptos fundamentales.',
      'Potencia activa, reactiva y aparente: conceptos y diferencias.',
      'Factor de potencia: concepto e importancia.',
      'Resolución de cálculos eléctricos básicos aplicados a situaciones prácticas.'
    ] },
    seguridad: { t: 'Seguridad eléctrica', items: [
      'Riesgo eléctrico y principales peligros asociados a la electricidad.',
      'Contacto eléctrico directo e indirecto.',
      'Medidas básicas de prevención y protección frente al riesgo eléctrico.',
      'Equipos de Protección Personal (EPP) utilizados en trabajos eléctricos.',
      'Distancias de seguridad conforme a las normas y procedimientos aplicables de la ANDE.',
      'Cinco reglas de oro: desconexión efectiva; prevención de cualquier posible realimentación; verificación de ausencia de tensión; puesta a tierra y en cortocircuito; señalización y delimitación de la zona de trabajo.',
      'Precauciones generales para trabajos en instalaciones eléctricas.'
    ] },
    mediciones: { t: 'Mediciones eléctricas', items: [
      'Magnitudes eléctricas fundamentales.',
      'Instrumentos básicos de medición eléctrica.',
      'Multímetro, voltímetro, amperímetro, óhmetro y pinza amperimétrica: funciones básicas.',
      'Medición de tensión, corriente y resistencia.',
      'Diferencias entre las formas de medición de tensión, corriente y resistencia.',
      'Conexión correcta de los instrumentos de medición.',
      'Selección adecuada del instrumento y de la escala de medición.',
      'Interpretación básica de valores medidos.',
      'Precauciones de seguridad durante las mediciones eléctricas.'
    ] },
    potencia: { t: 'Sistemas eléctricos de potencia', items: [
      'Concepto general de sistema eléctrico de potencia.',
      'Etapas del suministro de energía eléctrica: generación, transmisión, distribución y utilización.',
      'Función básica de estaciones y subestaciones eléctricas.',
      'Concepto de niveles de tensión.',
      'Equipos principales de transformación, maniobra y protección.',
      'Transformadores, interruptores, seccionadores y equipos de protección: funciones básicas.'
    ] },
    distribucion: { t: 'Distribución de energía eléctrica', items: [
      'Conceptos básicos de distribución de energía eléctrica.',
      'Función de las redes de distribución dentro del sistema eléctrico.',
      'Componentes principales de un sistema de distribución.',
      'Redes de Media Tensión (MT) y Baja Tensión (BT).',
      'Niveles de tensión utilizados en distribución.',
      'Transformadores y puestos de distribución: conceptos y funciones básicas.',
      'Conductores, postes y componentes básicos de las redes de distribución.',
      'Equipos básicos de transformación, maniobra y protección utilizados en distribución.',
      'Conceptos generales sobre acometidas y suministro de energía eléctrica.'
    ] },
    comercial: { t: 'Comercialización y suministro de energía eléctrica', items: [
      'Conceptos de cliente, usuario y suministro de energía eléctrica.',
      'Tensión de abastecimiento.',
      'Potencia instalada: concepto básico.',
      'Consumo de energía eléctrica y su medición en kilowatt-hora (kWh).',
      'Demanda y demanda máxima.',
      'Período de consumo y ciclo de facturación.',
      'Horarios de punta y fuera de punta de carga.',
      'Grupos de consumo y categorías tarifarias, a nivel general.',
      'Conceptos básicos relacionados con la facturación de energía eléctrica.',
      'Medidores de energía eléctrica: conceptos generales.',
      'Lectura e interpretación básica de los principales datos contenidos en una factura de energía eléctrica.'
    ] },
    habilidades: { t: 'Prueba de habilidades', items: [
      'Habilidades prácticas relacionadas con las funciones del cargo, a desarrollarse en el patio de maniobras y entrenamiento de la ANDE.'
    ] },
    otrasCPI: { t: 'Además del temario', items: [
      'Prueba de guaraní escrito (5 puntos).',
      'Test psicométrico (10 puntos) y entrevista (5 puntos) sobre las competencias del perfil.'
    ] }
  };

  var ALCANCE_CPI = 'Puede incluir preguntas conceptuales, identificación de equipos y magnitudes, interpretación de situaciones prácticas y cálculos básicos con tensión, corriente, resistencia, potencia y energía. Para los temas propios de la ANDE vale la documentación institucional vigente.';
  var ALCANCE_CPIEP = 'Se evalúan contenidos básicos, porque las personas seleccionadas reciben capacitación posterior.';

  var TEMAS = {
    cpi_pot: { alcance: ALCANCE_CPI, bloques: [B.fundamentos, B.leyes, B.seguridad, B.mediciones, B.potencia, B.distribucion, B.comercial, B.otrasCPI] },
    cpi_elec: { alcance: ALCANCE_CPI, bloques: [B.fundamentos, B.leyes, B.seguridad, B.mediciones, B.distribucion, B.comercial, B.habilidades, B.otrasCPI] },
    cpi_lector: { alcance: ALCANCE_CPI, bloques: [B.fundamentos, B.leyes, B.seguridad, B.mediciones, B.distribucion, B.comercial, B.otrasCPI] },
    tec: { alcance: ALCANCE_CPIEP, bloques: [
      { t: 'Electricidad básica', items: [
        { sub: 'Magnitudes eléctricas', items: ['Tensión, corriente, resistencia, potencia y energía, con sus unidades (V, A, Ω, W, kWh).', 'Ley de Ohm (V = I × R) y potencia eléctrica (P = V × I).'] },
        { sub: 'Circuitos eléctricos', items: ['Circuitos en serie, en paralelo y mixtos.', 'Corriente continua y corriente alterna. Sistemas monofásico y trifásico.'] },
        { sub: 'Instrumentos de medición', items: ['Multímetro y pinza amperimétrica.', 'Medición de tensión, corriente, resistencia y continuidad.'] }
      ] },
      { t: 'Sistema Eléctrico Nacional', items: [
        { sub: 'Estructura del sistema', items: ['Etapas: generación, transmisión y distribución.', 'Sistema Interconectado Nacional (SIN). Niveles de tensión: alta, media y baja tensión.'] },
        { sub: 'Instalaciones y equipos principales', items: ['Centrales de generación, líneas de transmisión y subestaciones.', 'Transformadores de potencia y de distribución, interruptores, seccionadores, pararrayos y transformadores de medida.'] },
        { sub: 'Red de distribución', items: ['Componentes de la red aérea: postes, conductores, aisladores y crucetas.', 'Acometida, conexión domiciliaria y medidor de energía.'] }
      ] },
      { t: 'Mantenimiento y puesta en servicio', items: [
        { sub: 'Tipos de mantenimiento', items: ['Mantenimiento correctivo, preventivo y predictivo.', 'Ventajas y aplicación de cada tipo.'] },
        { sub: 'Planificación del mantenimiento', items: ['Plan y programa de mantenimiento: frecuencias, recursos y cronograma.', 'Registro y actualización de datos técnicos de equipos (fichas técnicas e historial).'] },
        { sub: 'Puesta en servicio', items: ['Concepto de comisionamiento de nuevos equipos e instalaciones.', 'Inspecciones, pruebas básicas y registro de resultados.'] }
      ] },
      { t: 'Esquemas eléctricos y sistemas de información geográfica', items: [
        { sub: 'Esquemas eléctricos', items: ['Simbología eléctrica básica.', 'Lectura de diagramas unifilares sencillos.'] },
        { sub: 'Sistemas de información geográfica (SIG/GIS)', items: ['Conceptos básicos: capas, datos vectoriales y atributos.', 'Coordenadas, sistemas de referencia y georreferenciación.'] }
      ] },
      { t: 'Seguridad en el trabajo', items: [
        { sub: 'Riesgo eléctrico', items: ['Efectos de la corriente en el cuerpo humano. Contacto directo e indirecto.', 'Las cinco reglas de oro para trabajar sin tensión.'] },
        { sub: 'Prevención', items: ['Equipos de protección personal y herramientas aisladas.', 'Señalización de la zona de trabajo, puesta a tierra y primeros auxilios básicos.'] }
      ] },
      { t: 'Herramientas informáticas', items: [
        'El acta la nombra como temática, pero no detalla contenidos. El perfil pide manejo de herramientas ofimáticas.'
      ] },
      { t: 'Además del temario', items: ['Prueba de guaraní escrito (5 puntos).'] }
    ] },
    pro: { alcance: ALCANCE_CPIEP, bloques: [
      { t: 'Estadística básica', items: [
        { sub: 'Conceptos básicos', items: ['Población, muestra y unidad de análisis.', 'Tipos de variables: cualitativas y cuantitativas (discretas y continuas).'] },
        { sub: 'Organización y presentación de datos', items: ['Tablas de frecuencias: absoluta, relativa, acumulada y porcentual.', 'Gráficos básicos: barras, sectores, líneas e histograma. Lectura e interpretación.'] },
        { sub: 'Medidas de tendencia central', items: ['Media aritmética, media ponderada, mediana y moda.', 'Cuándo usar cada una (efecto de valores extremos).'] },
        { sub: 'Medidas de dispersión y de posición', items: ['Rango, varianza y desviación estándar.', 'Coeficiente de variación.', 'Cuartiles y percentiles.'] },
        { sub: 'Porcentajes y probabilidad elemental', items: ['Porcentajes, variación porcentual y tasas.', 'Probabilidad clásica (casos favorables / casos posibles).'] }
      ] },
      { t: 'Excel básico', items: [
        { sub: 'Entorno de trabajo', items: ['Libro, hoja, celda, fila, columna y rango.', 'Abrir, guardar e imprimir un libro.'] },
        { sub: 'Ingreso y formato de datos', items: ['Ingreso de texto, números y fechas.', 'Formato de celdas: número, moneda, porcentaje, alineación y bordes.'] },
        { sub: 'Fórmulas básicas', items: ['Operadores aritméticos (+, -, *, /) y orden de cálculo.', 'Copiar fórmulas. Referencias relativas y absolutas ($).'] },
        { sub: 'Funciones básicas', items: ['SUMA, PROMEDIO, MAX, MIN y CONTAR.', 'Función SI.'] },
        { sub: 'Organización de datos', items: ['Ordenar datos.', 'Filtrar datos (autofiltro).'] },
        { sub: 'Gráficos', items: ['Gráficos de columnas, barras, líneas y circular.', 'Título, leyenda y etiquetas de datos.'] }
      ] },
      { t: 'Además del temario', items: [
        'Prueba sobre la legislación de la institución y la normativa de la Función Pública (5 puntos). El acta no indica bibliografía.',
        'Prueba de guaraní escrito (5 puntos).'
      ] }
    ] }
  };

  /* ---------- Bibliografía oficial ---------- */
  var L = {
    bt: { t: 'ANDE. Reglamento para Instalaciones Eléctricas de Baja Tensión.', url: 'https://www.ande.gov.py/documentos/Reglamentos_de_la_ande/Reglamento%20de%20Baja%20Tension%20ANDE.pdf' },
    mt: { t: 'ANDE. Reglamento de Ejecución de Instalaciones Eléctricas de Media Tensión.', url: 'https://www.ande.gov.py/documentos/Reglamentos_de_la_ande/Reglamento%20MT%20de%20la%20ANDE.pdf' }
  };
  var BIB = {
    cpi: [
      { t: 'Ling, Moebs y Sanny. Física universitaria, volumen 2 (OpenStax, gratuito). Capítulos 9, 10 y 15.', url: 'https://openstax.org/details/books/f%C3%ADsica-universitaria-volumen-2' },
      L.bt,
      L.mt,
      { t: 'ANDE. Informaciones útiles: Instrucciones Técnicas de Distribución, lectura de medidores y cálculo del consumo.', url: 'https://www.ande.gov.py/informaciones_utiles.php' },
      { t: 'ANDE. Tarifas vigentes y Pliego de Tarifas.', url: 'https://www.ande.gov.py/tarifas_vigentes.php' }
    ],
    tec: [
      { t: 'Kuphaldt. Circuitos Eléctricos I: corriente continua (LibreTexts). Capítulos 1, 2, 3 (seguridad eléctrica), 5 y 8.', url: 'https://espanol.libretexts.org/Bookshelves/Vocacional/Tecnologia_Electronica/Libro%3A_Circuitos_Electricos_I_-_Corriente_continua_(Kuphaldt)' },
      { t: 'Kuphaldt. Circuitos Eléctricos II: corriente alterna (LibreTexts). Capítulos 1, 7, 10 (transformadores) y 14 (líneas de transmisión).', url: 'https://espanol.libretexts.org/Bookshelves/Vocacional/Tecnologia_Electronica/Libro%3A_Circuitos_electricos_II_-_Corriente_alterna_(Kuphaldt)' },
      L.bt,
      L.mt,
      { t: 'Muñoz Abella. Mantenimiento Industrial (Universidad Carlos III de Madrid).', url: 'https://ocw.uc3m.es/pluginfile.php/993/mod_page/content/18/mantenimiento.pdf' },
      { t: 'QGIS. Una introducción fácil a GIS (documentación oficial).', url: 'https://docs.qgis.org/latest/es/docs/gentle_gis_introduction/index.html' },
      { t: 'INSST. Guía técnica para la evaluación y prevención del riesgo eléctrico.', url: 'https://www.insst.es/documents/94886/789467/Gu%C3%ADa+t%C3%A9cnica+para+la+evaluaci%C3%B3n+y+prevenci%C3%B3n+de+los+riesgos+relacionados+con+la+protecci%C3%B3n+frente+al+riesgo+el%C3%A9ctrico.pdf' }
    ],
    pro: [
      { t: 'Illowsky y Dean. Introducción a la estadística (OpenStax). Capítulos 1 a 3.', url: 'https://openstax.org/details/books/introducci%C3%B3n-estad%C3%ADstica' },
      { t: 'Holmes, Illowsky y Dean. Introducción a la estadística empresarial (OpenStax). Capítulos 1 a 3.', url: 'https://openstax.org/books/introducci%C3%B3n-estad%C3%ADstica-empresarial/pages/1-introduccion' },
      { t: 'Khan Academy. Estadística y probabilidad: ejercicios de práctica.', url: 'https://es.khanacademy.org/math/estadistica-y-probabilidad-pe-pre-u' },
      { t: 'Microsoft. Ayuda y formación de Excel.', url: 'https://support.microsoft.com/es-es/excel/' },
      { t: 'Microsoft. Funciones de Excel por categoría.', url: 'https://support.microsoft.com/es-es/office/funciones-de-excel-por-categor%C3%ADa-5f91f4e9-7b42-46d2-9bd1-63f26a86c0eb' },
      { t: 'Heisserer. Fundamentos de Computación para Estudiantes Técnicos (LibreTexts). Capítulos 14 y 15.', url: 'https://espanol.libretexts.org/Bookshelves/Vocacional/Vocacional/Aplicaciones_informaticas_y_tecnologia_de_la_informacion/Aplicaciones_informaticas/Fundamentos_de_Computacion_para_Estudiantes_Tecnicos_(Heisserer)' }
    ]
  };

  /* ---------- Sugerencias (no oficiales) ---------- */
  var GUARANI = 'Guaraní escrito: practicá lectura, vocabulario básico y traducción de frases cortas. Vale 5 puntos.';
  var SUGERENCIAS = {
    cpi: [
      GUARANI,
      'Conseguí una factura real de la ANDE y practicá leerla con el pliego de tarifas.',
      'Para el test psicométrico y la entrevista, repasá las competencias del perfil: diagnóstico de problemas, mantenimiento, seguridad y comunicación técnica.'
    ],
    tec: [
      GUARANI,
      'Herramientas informáticas: como el acta no detalla contenidos, repasá planilla de cálculo y procesador de textos a nivel básico.',
      'Para practicar GIS, instalá QGIS (es gratuito) y seguí la introducción oficial.',
      'El perfil también menciona la normativa de la Función Pública y la misión y visión de la ANDE.'
    ],
    pro: [
      GUARANI,
      'Función pública (5 puntos): repasá la Ley N.º 1626/2000 «De la Función Pública» y la Carta Orgánica de la ANDE (Ley N.º 966/1964).',
      'Practicá Excel con un archivo propio. Con la configuración regional en español, las fórmulas usan punto y coma (;) como separador.'
    ]
  };

  /* ---------- Preguntas de práctica (elaboración propia) ---------- */
  var REGLAS_ORO = '1) Desconexión efectiva de todas las fuentes. 2) Prevenir cualquier realimentación (bloqueo y señalización de los equipos de corte). 3) Verificar la ausencia de tensión. 4) Puesta a tierra y en cortocircuito. 5) Señalizar y delimitar la zona de trabajo.';
  var PREGUNTAS = {
    cpi: [
      { q: 'Una plancha de 1.100 W se conecta a 220 V. ¿Qué corriente consume?', a: 'I = P / V = 1.100 / 220 = 5 A.' },
      { q: 'Si esa plancha se usa 2 horas por día durante 30 días, ¿cuánta energía consume?', a: 'E = 1,1 kW × 60 h = 66 kWh.' },
      { q: 'Dos resistencias de 10 Ω y 40 Ω se conectan en serie a 100 V. ¿Qué corriente circula? ¿Cuál sería la resistencia equivalente si estuvieran en paralelo?', a: 'En serie, R = 50 Ω e I = 100 / 50 = 2 A. En paralelo, R = (10 × 40) / (10 + 40) = 8 Ω.' },
      { q: 'Una carga absorbe 10 kVA con factor de potencia 0,8. ¿Cuánto valen la potencia activa y la reactiva?', a: 'P = 10 × 0,8 = 8 kW. Q = raíz cuadrada de (10² - 8²) = 6 kvar.' },
      { q: 'A un nodo llegan corrientes de 5 A y 3 A, y sale una de 6 A. ¿Cuánto vale la otra corriente que sale?', a: 'Por la ley de corrientes de Kirchhoff, lo que entra es igual a lo que sale: 5 + 3 = 6 + I, entonces I = 2 A.' },
      { q: '¿Cómo se conectan el amperímetro, el voltímetro y el óhmetro?', a: 'El amperímetro en serie con la carga, el voltímetro en paralelo y el óhmetro con el circuito sin tensión.' },
      { q: '¿Cuáles son las cinco reglas de oro, en orden?', a: REGLAS_ORO },
      { q: '¿Qué diferencia hay entre contacto directo e indirecto?', a: 'Directo: con partes activas que normalmente tienen tensión. Indirecto: con masas o carcasas que quedaron con tensión por una falla de aislamiento.' },
      { q: '¿Cuál es la frecuencia de la red en Paraguay y qué tensiones se usan en baja tensión?', a: '50 Hz. En baja tensión, 220 V entre fase y neutro y 380 V entre fases.' },
      { q: '¿Qué es la demanda máxima?', a: 'La mayor potencia media registrada en un intervalo de medición dentro del período de facturación. Se expresa en kW.' }
    ],
    pot: [
      { q: '¿Qué diferencia hay entre un interruptor y un seccionador?', a: 'El interruptor puede abrir el circuito con carga e interrumpir corrientes de falla. El seccionador da un corte visible y se maniobra sin carga.' },
      { q: '¿Para qué sirve una subestación?', a: 'Para cambiar el nivel de tensión, hacer maniobras y proteger el sistema. Vincula la transmisión con la distribución.' }
    ],
    dist: [
      { q: '¿Qué es la acometida?', a: 'El tramo de conductores que une la red de distribución con la instalación del usuario, donde se ubica el medidor.' },
      { q: 'En una factura de energía, ¿cómo se obtiene el consumo del período?', a: 'Restando la lectura anterior del medidor a la lectura actual; el resultado está en kWh. Si el medidor tiene una constante o multiplicador, la diferencia se multiplica por ese valor.' }
    ],
    tec: [
      { q: 'Una resistencia de 22 Ω se conecta a 220 V. ¿Qué corriente circula y qué potencia disipa?', a: 'I = V / R = 220 / 22 = 10 A. P = V × I = 220 × 10 = 2.200 W.' },
      { q: '¿Qué diferencia hay entre mantenimiento preventivo y predictivo?', a: 'El preventivo se hace según un calendario o las horas de uso, antes de que haya falla. El predictivo se decide según el estado medido del equipo, por ejemplo con termografía, análisis de aceite o vibraciones.' },
      { q: '¿Qué es el comisionamiento?', a: 'El conjunto de inspecciones y pruebas que verifican que un equipo o una instalación nueva funciona según su diseño antes de ponerla en servicio.' },
      { q: '¿Qué representa un diagrama unifilar?', a: 'Un sistema trifásico dibujado con una sola línea, con sus equipos principales (transformadores, interruptores, seccionadores y barras) y la forma en que se conectan.' },
      { q: 'En un SIG, ¿cuáles son los tres tipos de datos vectoriales? Da un ejemplo de cada uno en una red eléctrica.', a: 'Puntos (postes, transformadores), líneas (tramos de red) y polígonos (zonas de servicio). Cada elemento tiene su tabla de atributos.' },
      { q: '¿Para qué sirven los transformadores de medida?', a: 'Reducen la tensión (transformador de tensión) o la corriente (transformador de corriente) a valores que pueden manejar los medidores y los relés de protección.' },
      { q: '¿Por qué los interruptores diferenciales que protegen a las personas actúan con 30 mA?', a: 'Porque una corriente de ese orden que atraviesa el cuerpo ya puede provocar asfixia o fibrilación ventricular; el diferencial corta antes de que ocurra.' },
      { q: '¿Cuáles son las cinco reglas de oro para trabajar sin tensión?', a: REGLAS_ORO }
    ],
    pro: [
      { q: 'Para los datos 4, 6, 6, 8 y 26, calculá la media, la mediana y la moda. ¿Cuál representa mejor al grupo?', a: 'Media = 50 / 5 = 10. Mediana = 6. Moda = 6. Representa mejor la mediana, porque el 26 es un valor extremo que sube la media.' },
      { q: '¿Cuál es el rango de esos mismos datos?', a: '26 - 4 = 22.' },
      { q: 'Para los datos 2, 4, 6 y 8, calculá la varianza y la desviación estándar.', a: 'Media = 5. Suma de los cuadrados de las desviaciones: 9 + 1 + 1 + 9 = 20. Poblacional: varianza 20 / 4 = 5 y desviación 2,24. Muestral: varianza 20 / 3 = 6,67 y desviación 2,58.' },
      { q: 'Si la media es 50 y la desviación estándar es 5, ¿cuál es el coeficiente de variación?', a: 'CV = 5 / 50 × 100 = 10 %.' },
      { q: 'Un valor pasa de 80 a 100. ¿Cuál es la variación porcentual?', a: '(100 - 80) / 80 × 100 = 25 %.' },
      { q: '¿Cuál es la probabilidad de sacar un número par al tirar un dado?', a: '3 casos favorables / 6 casos posibles = 0,5, es decir, 50 %.' },
      { q: 'En B1 está la fórmula =A1*$C$1. Si la copiás a B2, ¿cómo queda?', a: '=A2*$C$1. La referencia relativa cambia y la absoluta queda fija.' },
      { q: 'Escribí una fórmula que muestre «Aprobado» si A1 es 60 o más, y «Reprobado» en otro caso.', a: '=SI(A1>=60;"Aprobado";"Reprobado"). Con la configuración regional en español el separador es punto y coma.' },
      { q: '¿Qué resultado da la fórmula =2+3*4?', a: '14, porque la multiplicación se calcula antes que la suma.' },
      { q: 'Una persona saca 8 en un examen que pesa 2 y 5 en otro que pesa 1. ¿Cuál es su promedio ponderado?', a: '(8 × 2 + 5 × 1) / (2 + 1) = 21 / 3 = 7.' }
    ]
  };

  /* ---------- Plan de estudio sugerido ---------- */
  var PLAN_INTRO = 'La fecha del examen todavía no se publicó. Este plan reparte el temario en cuatro semanas; ajustalo cuando salga el cronograma.';
  var PLAN = {
    cpi: [
      'Semana 1: fundamentos y cálculos. Resolvé ejercicios de ley de Ohm, potencia y consumo en kWh hasta hacerlos sin dudar.',
      'Semana 2: seguridad eléctrica y mediciones. Memorizá las cinco reglas de oro en orden y cómo se conecta cada instrumento.',
      'Semana 3: el resto del temario de tu cargo. Leé una factura real de la ANDE junto con el pliego de tarifas.',
      'Última semana: preguntas de práctica, guaraní escrito y preparación para el test psicométrico y la entrevista.'
    ],
    tec: [
      'Semana 1: electricidad básica y Sistema Eléctrico Nacional, con los libros de Kuphaldt.',
      'Semana 2: mantenimiento, puesta en servicio y lectura de diagramas unifilares.',
      'Semana 3: GIS (instalá QGIS y seguí la introducción oficial) y seguridad en el trabajo.',
      'Última semana: herramientas informáticas, preguntas de práctica y guaraní escrito.'
    ],
    pro: [
      'Semana 1: estadística, capítulos 1 a 3 de OpenStax: variables, tablas de frecuencia, gráficos y medidas de tendencia central.',
      'Semana 2: dispersión, cuartiles, percentiles, porcentajes y probabilidad, con ejercicios de Khan Academy.',
      'Semana 3: Excel con un archivo propio: referencias con $, SUMA, PROMEDIO, MAX, MIN, CONTAR, SI, filtros y gráficos.',
      'Última semana: función pública y normativa de la ANDE, guaraní escrito y preguntas de práctica.'
    ]
  };

  /* ---------- Matrices de evaluación ---------- */
  var CAP_CPI = 'Por curso, según su carga horaria: 40 h o más: 5 · 20 a 39 h: 4 · 13 a 19 h: 3 · 5 a 12 h: 2 · 1 a 4 h: 1 · sin carga horaria: 1. Máximo 10.';
  var CAP_CPIEP = 'Por curso, según su carga horaria: 40 h o más: 6 · 20 a 39 h: 5 · 13 a 19 h: 4 · 5 a 12 h: 3 · 1 a 4 h: 2 · sin carga horaria: 1. Máximo 10.';
  var GUARANI_FILA = ['Guaraní escrito', '5', 'Ley N.º 4251/2010 de Lenguas.'];
  function matriz(tipo, p) {
    if (tipo === 'cpi') {
      return [
        ['Experiencia específica', '15', '3 meses o más: 15 · 2 meses: 10 · menos de 2 meses: 5 · sin experiencia: 0. No es excluyente.'],
        ['Experiencia general', '10', '2 años: 10 · 1 año y 7 meses a 1 año y 11 meses: 8 · 1 año a 1 año y 6 meses: 6 · 7 a 11 meses: 4 · hasta 6 meses: 2.'],
        ['Formación académica', '15', p.formacion],
        ['Capacitación', '10', CAP_CPI],
        ['Prueba de conocimientos', '30', p.prueba],
        GUARANI_FILA,
        ['Test psicométrico', '10', 'Sobre las competencias del perfil.'],
        ['Entrevista', '5', 'A cargo de la Comisión de Selección.']
      ];
    }
    if (tipo === 'tec') {
      return [
        ['Experiencia específica', '30', 'Excluyente. 6 meses: 10 · 7 a 12 meses: 20 · 13 meses o más: 30.'],
        ['Experiencia general', '20', '1 año o más: 20 · 8 a 11 meses: 16 · 4 a 7 meses: 12 · hasta 3 meses: 8.'],
        ['Formación académica', '10', p.formacion],
        ['Capacitación', '10', CAP_CPIEP],
        ['Prueba de conocimientos', '25', 'Sobre los temas del perfil (ver temario).'],
        GUARANI_FILA
      ];
    }
    return [
      ['Experiencia específica', '30', 'Excluyente. 2 años: 10 · 2 años y 1 mes a 2 años y 6 meses: 20 · 2 años y 7 meses o más: 30.'],
      ['Experiencia general', '20', '3 años o más: 20 · 2 años a 2 años y 11 meses: 16 · 1 año a 1 año y 11 meses: 12 · hasta 11 meses: 8.'],
      ['Formación académica', '10', p.formacion],
      ['Capacitación', '10', CAP_CPIEP],
      ['Estadística básica', '10', 'Ver temario.'],
      ['Planilla electrónica (Excel)', '10', 'Ver temario.'],
      ['Legislación y función pública', '5', 'Normativa de la institución y de la Función Pública.'],
      GUARANI_FILA
    ];
  }
  var MATRIZ_NOTAS = [
    'Se aprueba con el 60 % del puntaje total y se selecciona por orden de méritos.',
    'La experiencia específica que supera lo pedido suma como experiencia general.',
    'Desempate: 1) prueba de conocimientos; 2) experiencia específica; 3) puntaje de capacitación; 4) años de experiencia; 5) horas de capacitación.'
  ];

  /* ---------- Documentos para la carpeta digital ---------- */
  var DOC_FORM = 'Formulario de postulación completo en postulaciones.ande.gov.py. El sistema genera tu currículum en PDF: revisalo campo por campo.';
  var DOC_ZIP = 'Todos los archivos en PDF, comprimidos en un único ZIP o RAR.';
  var DOC_CODIGO = 'Guardá el código de postulación que llega por correo al tocar FINALIZAR. Si no aparece, revisá la carpeta de spam.';
  function documentos(p) {
    if (p.tipo === 'CPI') {
      var d = [
        DOC_FORM,
        'Título según el perfil, escaneado de ambos lados.',
        'Certificado de Estudios de Bachiller, de ambos lados.',
        'Certificado de Vida y Residencia original y vigente.',
        p.capDoc,
        'Constancias de experiencia (opcionales, suman puntos): certificados laborales, aportes a IPS, contratos, facturas o pasantías.'
      ];
      if (p.medico) { d.push('Certificado médico de los últimos 3 meses, con las aptitudes que pide el perfil.'); }
      d.push(DOC_ZIP, DOC_CODIGO);
      return d;
    }
    return [
      DOC_FORM,
      'Título exigido por el perfil, de ambos lados.',
      'Documentos que acrediten la experiencia (obligatorios): certificados laborales, aportes a IPS, contratos, facturas o pasantías, con fecha de inicio y de fin.',
      'Certificado de Vida y Residencia original y vigente.',
      'Constancias de capacitación con carga horaria (opcionales, suman puntos).',
      DOC_ZIP,
      DOC_CODIGO
    ];
  }

  var AVISO = 'Resumen no oficial elaborado con los perfiles, matrices y actas publicados en Paraguay Concursa al ' + ACTUALIZADO + '. Ante cualquier diferencia valen los documentos oficiales.';

  return {
    ACTUALIZADO: ACTUALIZADO, FECHAS: FECHAS, CONTACTO: CONTACTO, POSTULAR_URL: POSTULAR_URL, PORTAL_URL: PORTAL_URL,
    PUESTOS: PUESTOS, TEMAS: TEMAS, BIB: BIB, SUGERENCIAS: SUGERENCIAS, PREGUNTAS: PREGUNTAS,
    PLAN_INTRO: PLAN_INTRO, PLAN: PLAN, matriz: matriz, MATRIZ_NOTAS: MATRIZ_NOTAS, documentos: documentos, AVISO: AVISO
  };
})();
