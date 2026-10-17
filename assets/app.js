/* Lógica de la página. Sin dependencias, salvo pdfmake (se carga al pedir un PDF). */
(function () {
  'use strict';

  var DATA = window.APP_DATA || [];
  var C = window.APP_CONTENIDO;

  function $(id) { return document.getElementById(id); }

  if (!C || !DATA.length) {
    var err = $('load-error');
    if (err) { err.hidden = false; }
    return;
  }

  /* ---------- Utilidades ---------- */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function miles(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }
  function gs(n) { return n == null ? 'Según PCC' : 'Gs. ' + miles(n); }
  function plural(n, uno, varios) { return n + ' ' + (n === 1 ? uno : varios); }
  function depLabel(d) {
    if (d === 'Capital') { return 'Asunción'; }
    if (d === 'Capital / Central') { return 'Asunción o Central'; }
    return d;
  }
  function zonaOk(postDep, userDep) {
    if (postDep === userDep) { return true; }
    return postDep === 'Capital / Central' && (userDep === 'Capital' || userDep === 'Central');
  }
  function diaMes(s) { return String(s).slice(0, 5); }
  function hora(s) { return String(s).slice(11, 16); }
  function vinculo(tipo) { return tipo === 'CPI' ? 'Permanente' : tipo === 'CPIEP' ? 'Contrato' : 'Interno'; }
  function chip(tipo) {
    var cls = tipo === 'CPI' ? 'perm' : tipo === 'CPIEP' ? 'cont' : 'int';
    return '<span class="chip ' + cls + '">' + vinculo(tipo) + '</span>';
  }
  function host(url) {
    var m = /^https?:\/\/([^/]+)/.exec(url);
    return m ? m[1].replace(/^www\./, '') : url;
  }
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* sin almacenamiento */ } }
  };
  function avisosHorario(d) {
    var out = [];
    if (hora(d.ini) !== '08:00') { out.push('El portal muestra el inicio a las ' + hora(d.ini) + ' del ' + diaMes(d.ini) + '.'); }
    if (hora(d.fin) !== '15:00') { out.push('El portal muestra el cierre a las ' + hora(d.fin) + ', pero el acta fija la recepción hasta las 15:00. No esperes al último momento.'); }
    return out;
  }

  var ORDEN = Object.keys(C.PUESTOS);
  var EXTERNOS = DATA.filter(function (d) { return d.tipo !== 'CIA' && C.PUESTOS[d.puesto]; });
  function ordenPuesto(a, b) {
    return ORDEN.indexOf(a.puesto) - ORDEN.indexOf(b.puesto) || depLabel(a.depto).localeCompare(depLabel(b.depto), 'es');
  }
  function sumaVac(rows) { return rows.reduce(function (s, d) { return s + d.vac; }, 0); }
  function porId(id) { for (var i = 0; i < DATA.length; i++) { if (DATA[i].id === id) { return DATA[i]; } } return null; }
  function sedesDe(puesto) { return EXTERNOS.filter(function (d) { return d.puesto === puesto; }).sort(ordenPuesto); }

  var DEPTOS = [];
  EXTERNOS.forEach(function (d) {
    if (d.depto !== 'Capital / Central' && DEPTOS.indexOf(d.depto) === -1) { DEPTOS.push(d.depto); }
  });
  DEPTOS.sort(function (a, b) { return depLabel(a).localeCompare(depLabel(b), 'es'); });
  function opcionesDepto(sel) {
    return DEPTOS.map(function (d) {
      return '<option value="' + esc(d) + '"' + (d === sel ? ' selected' : '') + '>' + esc(depLabel(d)) + '</option>';
    }).join('');
  }

  /* ---------- Cifras del encabezado ---------- */
  (function () {
    var perm = sumaVac(DATA.filter(function (d) { return d.tipo === 'CPI'; }));
    var cont = sumaVac(DATA.filter(function (d) { return d.tipo === 'CPIEP'; }));
    if ($('st-perm')) { $('st-perm').textContent = perm; }
    if ($('st-cont')) { $('st-cont').textContent = cont; }
    if ($('st-cargos')) { $('st-cargos').textContent = ORDEN.length; }
    if ($('st-total')) { $('st-total').textContent = DATA.length; }
  })();

  /* ---------- Cuenta regresiva ---------- */
  (function () {
    var els = document.querySelectorAll('.countdown[data-deadline]');
    for (var i = 0; i < els.length; i++) {
      var ms = new Date(els[i].getAttribute('data-deadline')).getTime() - Date.now();
      if (isNaN(ms)) { continue; }
      if (ms <= 0) { els[i].textContent = 'cerrado'; continue; }
      var d = Math.floor(ms / 86400000);
      var h = Math.floor((ms % 86400000) / 3600000);
      els[i].textContent = d > 0 ? 'faltan ' + d + ' d ' + h + ' h' : 'faltan ' + h + ' h';
    }
  })();

  /* ---------- Vacancias por departamento ---------- */
  var PRINCIPALES = ['Operador de Estaciones y Subestaciones IV', 'Electromecánico IV', 'Despachante de Carga Junior', 'Técnico Junior',
    'Ingeniero Electricista Junior', 'Ingeniero Electromecánico Junior', 'Ingeniero Electrónico/Mecatrónica Junior'];
  var depSel = $('dep-select');
  var depInicial = store.get('guia26-depto', 'Alto Paraná');
  if (DEPTOS.indexOf(depInicial) === -1) { depInicial = 'Alto Paraná'; }

  function tarjeta(d) {
    var p = C.PUESTOS[d.puesto];
    var avisos = avisosHorario(d);
    return '<article class="post">' +
      '<div class="row1"><h3>' + esc(d.puesto) + '</h3><div class="vac">' + d.vac + '<small>' + (d.vac === 1 ? 'vacancia' : 'vacancias') + '</small></div></div>' +
      '<div>' + chip(d.tipo) + ' <span class="chip">' + esc(p.area) + '</span></div>' +
      '<dl>' +
      '<dt>Salario</dt><dd class="num">' + esc(gs(d.sal)) + '</dd>' +
      '<dt>Sede</dt><dd>' + esc(d.sede) + (d.depto === 'Capital / Central' ? ' (residencia en Asunción o Central)' : '') + '</dd>' +
      '<dt>Requisito</dt><dd>' + esc(p.resumen) + '</dd>' +
      '<dt>Postulación</dt><dd class="num">' + esc(diaMes(d.ini)) + ' al ' + esc(diaMes(d.fin)) + ', hasta las 15:00' + (avisos.length ? ' <span class="muted">(' + esc(avisos.join(' ')) + ')</span>' : '') + '</dd>' +
      '<dt>Código</dt><dd class="mono">' + esc(d.code) + '</dd>' +
      '</dl>' +
      '<div class="links"><button type="button" class="btn small primary" data-guia="' + esc(d.id) + '">Guía de estudio en PDF</button>' +
      '<a href="' + esc(d.perfil) + '" target="_blank" rel="noopener">Perfil oficial</a>' +
      '<a href="' + esc(d.proceso) + '" target="_blank" rel="noopener">Actas</a></div>' +
      '</article>';
  }

  function renderDepto() {
    var dep = depSel.value;
    store.set('guia26-depto', dep);
    var rows = EXTERNOS.filter(function (d) { return zonaOk(d.depto, dep); }).sort(ordenPuesto);
    var vac = sumaVac(rows);
    $('dep-title').textContent = depLabel(dep) + ': ' + plural(vac, 'vacancia', 'vacancias') + ' en ' + plural(rows.length, 'publicación', 'publicaciones');
    $('dep-grid').innerHTML = rows.length ? rows.map(tarjeta).join('') : '<p class="muted">No hay vacancias externas en este departamento.</p>';
    var faltan = PRINCIPALES.filter(function (pu) { return !rows.some(function (d) { return d.puesto === pu; }); });
    var box = $('dep-missing');
    if (!faltan.length) { box.hidden = true; return; }
    box.hidden = false;
    box.innerHTML = '<b>Sin vacancias en ' + esc(depLabel(dep)) + ':</b> ' + faltan.map(function (pu) {
      var donde = [];
      sedesDe(pu).forEach(function (d) { var l = depLabel(d.depto); if (donde.indexOf(l) === -1) { donde.push(l); } });
      return esc(pu) + ' <span class="muted">(hay en ' + esc(donde.join(', ')) + ')</span>';
    }).join('; ') + '.';
  }
  depSel.innerHTML = opcionesDepto(depInicial);
  depSel.addEventListener('change', renderDepto);
  renderDepto();

  /* ---------- ¿A qué cargos podés postular? ---------- */
  var REGLAS = {
    'Operador de Estaciones y Subestaciones IV': { niv: ['bach', 'bachtec'], horas: 240 },
    'Electromecánico IV': { niv: ['bach', 'bachtec'], horas: 240 },
    'Electricista de Distribución IV': { niv: ['bach', 'bachtec'], horas: 240 },
    'Lector Distribuidor II': { niv: ['bach', 'bachtec'], horas: 100, nota: 'Las 100 horas tienen que ser de un curso de electricidad doméstica básica.' },
    'Despachante de Carga Junior': { niv: ['ts_elec', 'ts_em', 'ts_otro'] },
    'Técnico Junior': { niv: ['ts_elec'], meses: 6, dudoso: ['ts_em'] },
    'Ingeniero Electricista Junior': { niv: ['ing_elec'], meses: 24 },
    'Ingeniero Electromecánico Junior': { niv: ['ing_em'], meses: 24 },
    'Ingeniero Electrónico/Mecatrónica Junior': { niv: ['ing_etr'], meses: 24 },
    'Ingeniero Civil Junior': { niv: ['ing_civil'], meses: 24 },
    'Ingeniero Químico Junior': { niv: ['ing_quim'], meses: 24 },
    'Profesional Ambiental Junior': { niv: ['ing_amb'], meses: 24 },
    'Profesional Económico Contable Junior': { niv: ['cs_eco'], meses: 24 },
    'Asistente Social Junior': { niv: ['trab_social'], meses: 24 }
  };
  var fDep = $('f-depto');
  fDep.innerHTML = opcionesDepto(depInicial);

  function evaluar() {
    var niv = $('f-nivel').value;
    var dep = fDep.value;
    var meses = Math.max(0, parseInt($('f-meses').value, 10) || 0);
    var horas = Math.max(0, parseInt($('f-horas').value, 10) || 0);
    var res = [];
    ORDEN.forEach(function (pu) {
      var r = REGLAS[pu];
      if (!r) { return; }
      var dudoso = (r.dudoso || []).indexOf(niv) !== -1;
      if (r.niv.indexOf(niv) === -1 && !dudoso) { return; }
      var todas = sedesDe(pu);
      var aqui = todas.filter(function (d) { return zonaOk(d.depto, dep); });
      var faltas = [];
      if (r.horas && horas < r.horas) { faltas.push('te faltan ' + (r.horas - horas) + ' horas de capacitación (mínimo ' + r.horas + ', excluyente)'); }
      if (r.meses && meses < r.meses) { faltas.push('te faltan ' + (r.meses - meses) + ' meses de experiencia específica (mínimo ' + r.meses + ', excluyente)'); }
      if (dudoso) { faltas.push('tu título no figura en la lista del perfil; consultá a la comisión antes de postular'); }
      if (aqui.length) {
        res.push({
          estado: faltas.length ? 'falta' : 'ok', puesto: pu, vac: sumaVac(aqui), sal: aqui[0].sal, id: aqui[0].id,
          why: (faltas.length ? 'Cumplís el título, pero ' + faltas.join(' y ') + '. ' : '') + (r.nota ? r.nota + ' ' : '') +
            aqui.map(function (d) { return d.sede + ' (' + d.vac + ')'; }).join('; ')
        });
      } else {
        var donde = [];
        todas.forEach(function (d) { var l = depLabel(d.depto); if (donde.indexOf(l) === -1) { donde.push(l); } });
        res.push({ estado: 'otra', puesto: pu, vac: 0, sal: todas[0].sal, id: todas[0].id, why: 'Tu formación encaja, pero no hay vacancias en ' + depLabel(dep) + '. Hay en: ' + donde.join(', ') + '.' });
      }
    });
    var peso = { ok: 0, falta: 1, otra: 2 };
    res.sort(function (a, b) { return peso[a.estado] - peso[b.estado] || b.vac - a.vac; });
    var out = $('elig-out');
    if (!res.length) {
      out.innerHTML = '<p>Ningún cargo de este concurso acepta esa formación. Revisá el listado completo más abajo.</p>';
      return;
    }
    var nOk = sumaVac(res.filter(function (r) { return r.estado === 'ok'; }));
    var hayFalta = res.some(function (r) { return r.estado === 'falta'; });
    var etiqueta = { ok: 'Cumplís', falta: 'Te falta', otra: 'Otra zona' };
    var titulo = nOk ? 'Podés postular a ' + plural(nOk, 'vacancia', 'vacancias') + ' en ' + depLabel(dep) + '.'
      : hayFalta ? 'Con estos datos todavía no cumplís todos los requisitos de las vacancias de ' + depLabel(dep) + '.'
        : 'No hay vacancias para tu formación en ' + depLabel(dep) + '.';
    out.innerHTML = '<p><b>' + esc(titulo) + '</b></p>' +
      res.map(function (r) {
        return '<div class="res ' + r.estado + '">' +
          '<span class="st">' + etiqueta[r.estado] + '</span>' +
          '<span class="nm">' + esc(r.puesto) + '</span>' +
          '<span class="v">' + (r.vac ? plural(r.vac, 'vac.', 'vac.') + ' · ' : '') + esc(gs(r.sal)) + '</span>' +
          '<span class="why">' + esc(r.why) + '</span>' +
          '<span class="act"><button type="button" class="linklike" data-guia="' + esc(r.id) + '">Ver la guía de estudio</button></span>' +
          '</div>';
      }).join('') +
      ((dep === 'Capital' || dep === 'Central') ? '<p class="example-note">Algunos cargos de Asunción aceptan residentes de Asunción o de Central, según el acta de cada uno.</p>' : '');
  }
  ['f-nivel', 'f-depto', 'f-meses', 'f-horas'].forEach(function (id) {
    $(id).addEventListener('input', evaluar);
    $(id).addEventListener('change', evaluar);
  });
  $('elig').addEventListener('submit', function (e) { e.preventDefault(); });
  evaluar();

  /* ---------- Modelo de la guía por cargo ---------- */
  function claveTema(p) { return p.tema.indexOf('cpi') === 0 ? 'cpi' : p.tema; }

  function modeloGuia(id) {
    var sede = porId(id);
    var p = C.PUESTOS[sede.puesto];
    var f = C.FECHAS[p.tipo];
    var otras = [];
    sedesDe(sede.puesto).forEach(function (d) {
      if (d.id === sede.id) { return; }
      var l = depLabel(d.depto);
      for (var i = 0; i < otras.length; i++) { if (otras[i].l === l) { otras[i].vac += d.vac; return; } }
      otras.push({ l: l, vac: d.vac });
    });
    var tk = claveTema(p);
    var preguntas = [];
    p.preguntas.forEach(function (k) { preguntas = preguntas.concat(C.PREGUNTAS[k]); });
    var datos = [
      ['Cargo', [{ t: sede.puesto }]],
      ['Sede', [{ t: depLabel(sede.depto) + '. ' + sede.sede }]],
      ['Vacancias en esta sede', [{ t: String(sede.vac) }]],
      ['Salario mensual', [{ t: gs(sede.sal) }]],
      ['Vinculación', [{ t: p.tipo === 'CPI' ? 'Permanente: nombramiento en la carrera del servicio civil.' : 'Contrato temporal.' }]],
      ['Nivel', [{ t: p.nivel }]],
      ['Convocatoria', [{ t: p.conv + ' · código ' + sede.code }]],
      ['Reunión informativa', [{ t: f.reunion }]],
      ['Postulación', [{ t: f.postulacion }]],
      ['Dónde postular', [{ t: 'postulaciones.ande.gov.py', url: C.POSTULAR_URL }, { t: ', con tu Identidad Electrónica.' }]],
      ['Bases oficiales', [{ t: 'Perfil y matriz', url: sede.perfil }, { t: ' · ' }, { t: 'Actas del proceso', url: sede.proceso }]],
      ['Horario y condiciones', [{ t: p.condiciones }]],
      ['Consultas', [{ t: C.CONTACTO.unidad + ': ' + C.CONTACTO.correo + ' · ' + C.CONTACTO.telefonos + ' · ' + C.CONTACTO.horario + '.' }]]
    ];
    var secciones = [
      { titulo: 'Datos del cargo', items: [{ tipo: 'kv', filas: datos }]
        .concat(avisosHorario(sede).map(function (a) { return { tipo: 'nota', texto: a }; }))
        .concat(sede.depto === 'Capital / Central' ? [{ tipo: 'p', texto: 'Según el acta, pueden postular quienes viven en Asunción o en el departamento Central.' }] : [])
        .concat(otras.length ? [{ tipo: 'p', texto: 'Otras sedes de este cargo, con sus vacancias: ' + otras.map(function (o) { return o.l + ' (' + o.vac + ')'; }).join(', ') + '. Cada sede exige vivir en su departamento.' }] : []) },
      { titulo: 'Qué hace', items: p.funciones ? [{ tipo: 'lista', items: p.funciones }] : [{ tipo: 'p', texto: 'Las funciones dependen de la dependencia de cada sede y están detalladas en el perfil oficial (ver Bases oficiales).' }] },
      { titulo: 'Requisitos excluyentes', items: [{ tipo: 'check', items: p.req }].concat(p.nota ? [{ tipo: 'nota', texto: p.nota }] : []) },
      { titulo: 'Cómo se puntúa', items: [{ tipo: 'tabla', filas: C.matriz(p.matriz, p) }, { tipo: 'lista', items: C.MATRIZ_NOTAS }] },
      { titulo: 'Documentos para la carpeta digital', items: [{ tipo: 'check', items: C.documentos(p) }] },
      { titulo: 'Temario oficial', items: [{ tipo: 'temario', bloques: C.TEMAS[p.tema].bloques }, { tipo: 'p', texto: 'Alcance de la prueba: ' + C.TEMAS[p.tema].alcance }] },
      { titulo: 'Bibliografía oficial', items: [{ tipo: 'enlaces', items: C.BIB[tk] }, { tipo: 'sub', texto: 'Sugerencias (no oficiales)' }, { tipo: 'lista', items: C.SUGERENCIAS[tk] }] },
      { titulo: 'Plan de estudio sugerido', items: [{ tipo: 'p', texto: C.PLAN_INTRO }, { tipo: 'lista', items: C.PLAN[p.plan] }] },
      { titulo: 'Preguntas de práctica', items: [{ tipo: 'p', texto: 'Elaboración propia para practicar; no son preguntas oficiales del examen.' }, { tipo: 'qa', items: preguntas }] }
    ];
    return { sede: sede, p: p, secciones: secciones, generado: new Date() };
  }

  /* ---------- Vista previa en la página ---------- */
  function runsHtml(runs) {
    return runs.map(function (r) {
      return r.url ? '<a href="' + esc(r.url) + '" target="_blank" rel="noopener">' + esc(r.t) + '</a>' : esc(r.t);
    }).join('');
  }
  function itemHtml(it) {
    switch (it.tipo) {
      case 'kv':
        return '<div class="d-table"><table><tbody>' + it.filas.map(function (f) {
          return '<tr><th scope="row">' + esc(f[0]) + '</th><td>' + runsHtml(f[1]) + '</td></tr>';
        }).join('') + '</tbody></table></div>';
      case 'p': return '<p>' + esc(it.texto) + '</p>';
      case 'sub': return '<div class="d-h3">' + esc(it.texto) + '</div>';
      case 'nota': return '<div class="d-note">' + esc(it.texto) + '</div>';
      case 'lista': return it.items.map(function (s) { return '<div class="d-li">' + esc(s) + '</div>'; }).join('');
      case 'check': return it.items.map(function (s) { return '<div class="d-chk">' + esc(s) + '</div>'; }).join('');
      case 'enlaces': return it.items.map(function (l) {
        return '<div class="d-li"><a href="' + esc(l.url) + '" target="_blank" rel="noopener">' + esc(l.t) + '</a> <span class="muted">(' + esc(host(l.url)) + ')</span></div>';
      }).join('');
      case 'tabla':
        return '<div class="d-table"><table class="score"><thead><tr><th>Factor</th><th class="r">Puntos</th><th>Cómo se obtiene</th></tr></thead><tbody>' +
          it.filas.map(function (f) { return '<tr><td>' + esc(f[0]) + '</td><td class="r">' + esc(f[1]) + '</td><td>' + esc(f[2]) + '</td></tr>'; }).join('') +
          '<tr><td><b>Total</b></td><td class="r"><b>' + it.filas.reduce(function (s, f) { return s + Number(f[1]); }, 0) + '</b></td><td></td></tr></tbody></table></div>';
      case 'temario':
        return it.bloques.map(function (b) {
          return '<div class="d-h3">' + esc(b.t) + '</div>' + b.items.map(function (x) {
            if (typeof x === 'string') { return '<div class="d-chk">' + esc(x) + '</div>'; }
            return '<div class="d-sub">' + esc(x.sub) + '</div>' + x.items.map(function (s) { return '<div class="d-chk ind">' + esc(s) + '</div>'; }).join('');
          }).join('');
        }).join('');
      case 'qa':
        return it.items.map(function (q, i) {
          return '<details class="d-qa"><summary>' + (i + 1) + '. ' + esc(q.q) + '</summary><p>' + esc(q.a) + '</p></details>';
        }).join('');
      default: return '';
    }
  }
  function previewHtml(m) {
    return '<div class="eyebrow">Guía de estudio · Concurso Externo ANDE 2026</div>' +
      '<div class="d-title">' + esc(m.sede.puesto) + '</div>' +
      '<div class="d-meta">' + esc(depLabel(m.sede.depto) + ' · ' + plural(m.sede.vac, 'vacancia', 'vacancias') + ' · ' + gs(m.sede.sal) + ' · ' + vinculo(m.p.tipo)) + '</div>' +
      m.secciones.map(function (s, i) {
        return '<div class="d-h2">' + (i + 1) + '. ' + esc(s.titulo) + '</div>' + s.items.map(itemHtml).join('');
      }).join('') +
      '<p class="d-foot">' + esc(C.AVISO) + '</p>';
  }

  /* ---------- PDF (pdfmake) ---------- */
  var PDF_FUENTES = [
    ['https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.10/pdfmake.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.10/vfs_fonts.js'],
    ['https://cdn.jsdelivr.net/npm/pdfmake@0.2.10/build/pdfmake.min.js', 'https://cdn.jsdelivr.net/npm/pdfmake@0.2.10/build/vfs_fonts.js']
  ];
  function cargarScript(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = src;
      s.async = false;
      s.onload = function () { resolve(); };
      s.onerror = function () { s.remove(); reject(new Error('No se pudo cargar ' + src)); };
      document.head.appendChild(s);
    });
  }
  function pdfListo() { return !!(window.pdfMake && typeof window.pdfMake.createPdf === 'function' && window.pdfMake.vfs && window.pdfMake.vfs['Roboto-Regular.ttf']); }
  var cargaPdf = null;
  function cargarPdfMake() {
    if (pdfListo()) { return Promise.resolve(); }
    if (cargaPdf) { return cargaPdf; }
    cargaPdf = (function intentar(i) {
      if (i >= PDF_FUENTES.length) { return Promise.reject(new Error('sin_pdfmake')); }
      return cargarScript(PDF_FUENTES[i][0])
        .then(function () { return cargarScript(PDF_FUENTES[i][1]); })
        .then(function () { if (!pdfListo()) { throw new Error('pdfmake incompleto'); } })
        .catch(function () { return intentar(i + 1); });
    })(0);
    cargaPdf.catch(function () { cargaPdf = null; });
    return cargaPdf;
  }

  var COL = { ink: '#16212D', muted: '#566372', line: '#D6DDE3', accent: '#A85A06', accentSoft: '#FBEEDD', cable: '#1D5796', ok: '#1D7246', zebra: '#F4F6F8', band: '#F2F4F5' };
  var ANCHO = 499; // A4 (595 pt) menos márgenes de 48 pt
  function pdfTxt(s) {
    return String(s).replace(/≥/g, '>=').replace(/≤/g, '<=').replace(/−/g, '-').replace(/→/g, '->').replace(/[​-‍﻿]/g, '');
  }
  function pdfRuns(runs) {
    return runs.map(function (r) {
      return r.url ? { text: pdfTxt(r.t), link: r.url, color: COL.cable, decoration: 'underline' } : { text: pdfTxt(r.t) };
    });
  }
  function pdfCaja(indent) {
    return { width: 10 + (indent || 0), canvas: [{ type: 'rect', x: indent || 0, y: 2.2, w: 7.6, h: 7.6, r: 1.2, lineWidth: 0.8, lineColor: COL.muted }] };
  }
  /* Cada ítem va en un bloque irrompible para que la casilla o la viñeta no quede separada de su texto. */
  function pdfCheck(s, indent) {
    return { stack: [{ columns: [pdfCaja(indent), { width: '*', text: pdfTxt(s) }], columnGap: 6 }], unbreakable: true, margin: [0, 0, 0, 3.5] };
  }
  function pdfBullet(content) {
    return { stack: [{ columns: [{ width: 10, text: '•', color: COL.muted }, { width: '*', text: content }], columnGap: 4 }], unbreakable: true, margin: [0, 0, 0, 3.5] };
  }
  function pdfNota(texto) {
    return {
      table: { widths: ['*'], body: [[{ text: pdfTxt(texto), fontSize: 9 }]] },
      layout: {
        fillColor: function () { return COL.accentSoft; },
        hLineWidth: function () { return 0; },
        vLineWidth: function (i) { return i === 0 ? 3 : 0; },
        vLineColor: function () { return COL.accent; },
        paddingLeft: function () { return 10; }, paddingRight: function () { return 10; },
        paddingTop: function () { return 6; }, paddingBottom: function () { return 6; }
      },
      margin: [0, 4, 0, 8]
    };
  }
  var LAYOUT_KV = {
    hLineWidth: function (i, node) { return i === 0 || i === node.table.body.length ? 0 : 0.5; },
    vLineWidth: function () { return 0; },
    hLineColor: function () { return COL.line; },
    paddingLeft: function (i) { return i === 0 ? 0 : 8; }, paddingRight: function () { return 4; },
    paddingTop: function () { return 4; }, paddingBottom: function () { return 4; }
  };
  var LAYOUT_TABLA = {
    fillColor: function (row) { return row === 0 ? COL.ink : (row % 2 === 0 ? COL.zebra : null); },
    hLineWidth: function (i, node) { return i === 0 || i === 1 || i === node.table.body.length ? 0 : 0.5; },
    vLineWidth: function () { return 0; },
    hLineColor: function () { return COL.line; },
    paddingLeft: function () { return 6; }, paddingRight: function () { return 6; },
    paddingTop: function () { return 4; }, paddingBottom: function () { return 4; }
  };
  function pdfItem(it) {
    switch (it.tipo) {
      case 'kv':
        return {
          table: { widths: [118, '*'], dontBreakRows: true, body: it.filas.map(function (f) { return [{ text: pdfTxt(f[0]), style: 'kvLabel' }, { text: pdfRuns(f[1]) }]; }) },
          layout: LAYOUT_KV, margin: [0, 0, 0, 8]
        };
      case 'p': return { text: pdfTxt(it.texto), margin: [0, 2, 0, 6] };
      case 'sub': return { text: pdfTxt(it.texto), style: 'h2', margin: [0, 8, 0, 4] };
      case 'nota': return pdfNota(it.texto);
      case 'lista': return { stack: it.items.map(function (s) { return pdfBullet(pdfTxt(s)); }), margin: [0, 0, 0, 6] };
      case 'check': return { stack: it.items.map(function (s) { return pdfCheck(s); }), margin: [0, 0, 0, 6] };
      case 'enlaces':
        return {
          stack: it.items.map(function (l) {
            return pdfBullet([{ text: pdfTxt(l.t), link: l.url, color: COL.cable, decoration: 'underline' }, { text: '  ' + host(l.url), color: COL.muted, fontSize: 8 }]);
          }), margin: [0, 0, 0, 6]
        };
      case 'tabla': {
        var body = [[{ text: 'Factor', style: 'th' }, { text: 'Puntos', style: 'th', alignment: 'right' }, { text: 'Cómo se obtiene', style: 'th' }]];
        it.filas.forEach(function (f) { body.push([{ text: pdfTxt(f[0]), bold: true }, { text: f[1], alignment: 'right' }, { text: pdfTxt(f[2]), fontSize: 8.5 }]); });
        body.push([{ text: 'Total', bold: true }, { text: String(it.filas.reduce(function (s, f) { return s + Number(f[1]); }, 0)), bold: true, alignment: 'right' }, '']);
        return { table: { headerRows: 1, dontBreakRows: true, widths: [112, 36, '*'], body: body }, layout: LAYOUT_TABLA, margin: [0, 2, 0, 8] };
      }
      case 'temario': {
        var out = [];
        it.bloques.forEach(function (b, i) {
          var nodos = b.items.map(function (x) {
            if (typeof x === 'string') { return pdfCheck(x); }
            // Subtema y sus ítems juntos (son 2 o 3 líneas), para que el rótulo no quede solo al pie de una página.
            return {
              stack: [{ text: pdfTxt(x.sub), style: 'subLabel', margin: [0, 2, 0, 2] }].concat(x.items.map(function (s) { return pdfCheck(s, 8); })),
              unbreakable: true
            };
          });
          // El título del bloque viaja junto con su primer ítem.
          out.push({ stack: [{ text: (i + 1) + '. ' + pdfTxt(b.t), style: 'h2', margin: [0, i ? 8 : 2, 0, 4] }, nodos[0]], unbreakable: true });
          for (var k = 1; k < nodos.length; k++) { out.push(nodos[k]); }
        });
        return { stack: out, margin: [0, 0, 0, 6] };
      }
      case 'qa':
        return {
          stack: it.items.map(function (q, i) {
            return {
              stack: [
                { text: [{ text: (i + 1) + '. ', color: COL.accent, bold: true }, { text: pdfTxt(q.q), bold: true }] },
                { text: [{ text: 'Respuesta: ', color: COL.ok, bold: true }, { text: pdfTxt(q.a) }], margin: [0, 2, 0, 0] }
              ],
              unbreakable: true, margin: [0, 0, 0, 8]
            };
          })
        };
      default: return { text: '' };
    }
  }
  function pdfDoc(m) {
    var s = m.sede;
    var fecha = m.generado;
    var hoy = ('0' + fecha.getDate()).slice(-2) + '/' + ('0' + (fecha.getMonth() + 1)).slice(-2) + '/' + fecha.getFullYear();
    var resumen = [
      ['Vinculación', m.p.tipo === 'CPI' ? 'Permanente' : 'Contrato'],
      ['Salario mensual', gs(s.sal)],
      ['Vacancias en la sede', String(s.vac)],
      ['Postulación', diaMes(s.ini) + ' al ' + diaMes(s.fin) + ', 15:00']
    ];
    var content = [
      { text: 'GUÍA DE ESTUDIO · CONCURSO EXTERNO ANDE 2026', style: 'eyebrow' },
      { text: pdfTxt(s.puesto), style: 'title' },
      { text: pdfTxt(depLabel(s.depto) + ' · ' + s.sede), style: 'subtitle' },
      {
        table: {
          widths: ['*', '*', '*', '*'],
          body: [resumen.map(function (r) {
            return { stack: [{ text: r[0].toUpperCase(), style: 'bandLabel' }, { text: pdfTxt(r[1]), style: 'bandValue' }] };
          })]
        },
        layout: {
          fillColor: function () { return COL.band; },
          hLineWidth: function () { return 0; },
          vLineWidth: function (i, node) { return i === 0 || i === node.table.widths.length ? 0 : 1; },
          vLineColor: function () { return '#FFFFFF'; },
          paddingLeft: function () { return 9; }, paddingRight: function () { return 9; },
          paddingTop: function () { return 7; }, paddingBottom: function () { return 7; }
        },
        margin: [0, 10, 0, 4]
      },
      { text: 'Generada el ' + hoy + '. ' + pdfTxt(C.AVISO), style: 'small', margin: [0, 0, 0, 4] }
    ];
    m.secciones.forEach(function (sec, i) {
      content.push({
        stack: [
          { text: (i + 1) + '. ' + pdfTxt(sec.titulo), style: 'h1' },
          { canvas: [{ type: 'line', x1: 0, y1: 0, x2: ANCHO, y2: 0, lineWidth: 1.2, lineColor: COL.accent }], margin: [0, 3, 0, 8] }
        ],
        headlineLevel: 1, margin: [0, 14, 0, 0]
      });
      sec.items.forEach(function (it) { content.push(pdfItem(it)); });
    });

    return {
      pageSize: 'A4',
      pageMargins: [48, 58, 48, 54],
      info: { title: 'Guía de estudio: ' + s.puesto + ' (' + depLabel(s.depto) + ')', author: 'Guía no oficial del Concurso Externo ANDE 2026', subject: 'Concurso Externo ANDE 2026', keywords: 'ANDE, concurso, guía de estudio, ' + s.code },
      defaultStyle: { font: 'Roboto', fontSize: 9.5, lineHeight: 1.25, color: COL.ink },
      styles: {
        eyebrow: { fontSize: 8, bold: true, color: COL.accent, characterSpacing: 0.8 },
        title: { fontSize: 22, bold: true, margin: [0, 4, 0, 2], lineHeight: 1.05 },
        subtitle: { fontSize: 10.5, color: COL.muted },
        h1: { fontSize: 13.5, bold: true },
        h2: { fontSize: 10.5, bold: true, color: COL.cable },
        subLabel: { fontSize: 9, bold: true, color: COL.muted },
        kvLabel: { fontSize: 8.5, bold: true, color: COL.muted },
        th: { fontSize: 8, bold: true, color: '#FFFFFF' },
        bandLabel: { fontSize: 6.5, bold: true, color: COL.muted, characterSpacing: 0.5 },
        bandValue: { fontSize: 10, bold: true, margin: [0, 2, 0, 0] },
        small: { fontSize: 7.5, color: COL.muted }
      },
      header: function (pagina) {
        if (pagina === 1) { return null; }
        return {
          margin: [48, 22, 48, 0],
          columns: [
            { text: 'Concurso Externo ANDE 2026 · Guía de estudio', style: 'small' },
            { text: pdfTxt(s.puesto + ' · ' + depLabel(s.depto)), style: 'small', alignment: 'right' }
          ]
        };
      },
      footer: function (pagina, total) {
        return {
          margin: [48, 18, 48, 0],
          columns: [
            { text: 'Resumen no oficial. Valen los documentos de Paraguay Concursa.', style: 'small' },
            { text: 'Página ' + pagina + ' de ' + total, style: 'small', alignment: 'right', width: 80 }
          ]
        };
      },
      pageBreakBefore: function (nodo, siguientes) {
        // Un título de sección que empieza en el último 20 % de la página pasa a la siguiente.
        if (nodo.headlineLevel !== 1) { return false; }
        var r = nodo.startPosition && nodo.startPosition.verticalRatio;
        return siguientes.length === 0 || r > 0.8;
      },
      content: content
    };
  }
  function nombreArchivo(s) {
    var base = 'Guia ANDE 2026 - ' + s.puesto + ' - ' + depLabel(s.depto);
    return base.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[\/\\:*?"<>|]+/g, '-').replace(/\s+/g, ' ').trim() + '.pdf';
  }

  /* ---------- Controles de la guía ---------- */
  var gPuesto = $('g-puesto');
  var gSede = $('g-sede');
  var gBtn = $('g-pdf');
  var gStatus = $('g-status');
  var gDoc = $('g-doc');

  gPuesto.innerHTML = [['CPI', 'Cargos permanentes (CPI)'], ['CPIEP', 'Contratos (CPIEP)']].map(function (g) {
    return '<optgroup label="' + g[1] + '">' + ORDEN.filter(function (pu) { return C.PUESTOS[pu].tipo === g[0]; })
      .map(function (pu) { return '<option value="' + esc(pu) + '">' + esc(pu) + '</option>'; }).join('') + '</optgroup>';
  }).join('');

  function llenarSedes(puesto, idPreferido) {
    var sedes = sedesDe(puesto);
    gSede.innerHTML = sedes.map(function (d) {
      return '<option value="' + esc(d.id) + '">' + esc(depLabel(d.depto) + ' · ' + plural(d.vac, 'vacancia', 'vacancias') + ' · ' + d.code) + '</option>';
    }).join('');
    var elegido = null;
    if (idPreferido && sedes.some(function (d) { return d.id === idPreferido; })) { elegido = idPreferido; }
    if (!elegido) {
      var dep = depSel.value;
      for (var i = 0; i < sedes.length; i++) { if (zonaOk(sedes[i].depto, dep)) { elegido = sedes[i].id; break; } }
    }
    gSede.value = elegido || (sedes[0] && sedes[0].id);
  }
  function renderGuia() {
    var m = modeloGuia(gSede.value);
    gDoc.innerHTML = previewHtml(m);
    gStatus.textContent = '';
    store.set('guia26-guia', gSede.value);
  }
  function abrirGuia(id) {
    var d = porId(id);
    if (!d || !C.PUESTOS[d.puesto]) { return; }
    gPuesto.value = d.puesto;
    llenarSedes(d.puesto, id);
    renderGuia();
    var sec = $('guia');
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    sec.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  }
  gPuesto.addEventListener('change', function () { llenarSedes(gPuesto.value); renderGuia(); });
  gSede.addEventListener('change', renderGuia);

  var guardada = porId(store.get('guia26-guia', ''));
  if (guardada && C.PUESTOS[guardada.puesto]) {
    gPuesto.value = guardada.puesto;
    llenarSedes(guardada.puesto, guardada.id);
  } else {
    gPuesto.value = ORDEN[0];
    llenarSedes(ORDEN[0]);
  }
  renderGuia();

  function precargar() { cargarPdfMake().catch(function () { /* se informa al pedir el PDF */ }); }
  ['pointerenter', 'focus', 'touchstart'].forEach(function (ev) { gBtn.addEventListener(ev, precargar, { once: true, passive: true }); });

  gBtn.addEventListener('click', function () {
    var id = gSede.value;
    gBtn.disabled = true;
    gStatus.textContent = 'Preparando el PDF…';
    cargarPdfMake().then(function () {
      var m = modeloGuia(id);
      var nombre = nombreArchivo(m.sede);
      window.pdfMake.createPdf(pdfDoc(m)).download(nombre, function () {
        gStatus.textContent = 'Listo: se descargó «' + nombre + '».';
        gBtn.disabled = false;
      });
    }).catch(function (e) {
      gStatus.textContent = e && e.message === 'sin_pdfmake'
        ? 'No se pudo cargar el generador de PDF. Revisá tu conexión a internet y probá de nuevo.'
        : 'No se pudo generar el PDF. Recargá la página y probá de nuevo.';
      gBtn.disabled = false;
    });
  });

  /* Botones "Guía de estudio" en tarjetas, resultados y tabla */
  document.addEventListener('click', function (e) {
    var t = e.target.closest ? e.target.closest('[data-guia]') : null;
    if (t) { e.preventDefault(); abrirGuia(t.getAttribute('data-guia')); }
  });

  /* ---------- Lista general de documentos ---------- */
  (function () {
    var DOCS = [
      ['Identidad Electrónica activa', 'Se crea en paraguay.gov.py con tu cédula y una contraseña. Consultas al 151.'],
      ['Título que exige el perfil, escaneado de ambos lados', 'Bachiller, técnico superior o universitario, según el cargo.'],
      ['Certificado de Estudios de Bachiller, de ambos lados', 'Lo piden los cargos permanentes (CPI).'],
      ['Certificado de Vida y Residencia original y vigente', 'Del departamento al que postulás.'],
      ['Certificados de capacitación con carga horaria', '240 h para Operador, Electromecánico y Electricista; curso de 100 h para Lector.'],
      ['Constancias de experiencia', 'Certificado laboral, aportes a IPS, contratos, facturas o pasantías. Obligatorias en Técnico Junior y en los cargos profesionales.'],
      ['Certificado médico de los últimos 3 meses', 'Apto para altura, esfuerzo físico e intemperie. Lo piden Operador, Electromecánico, Electricista y Lector.'],
      ['Todo en PDF, dentro de un único archivo ZIP o RAR', 'Revisá que cada archivo se lea bien antes de subirlo.'],
      ['Currículum generado por el sistema, revisado campo por campo', 'Fechas y cargas horarias iguales a las de tus documentos.'],
      ['Código de postulación guardado', 'Llega al correo al tocar FINALIZAR. Revisá la carpeta de spam.']
    ];
    var marcados = store.get('guia26-docs', {});
    var ul = $('checklist');
    ul.innerHTML = DOCS.map(function (d, i) {
      return '<li><label for="doc-' + i + '"><input type="checkbox" id="doc-' + i + '"' + (marcados[i] ? ' checked' : '') + '>' +
        '<span><span class="main">' + esc(d[0]) + '</span><span class="sub">' + esc(d[1]) + '</span></span></label></li>';
    }).join('');
    ul.addEventListener('change', function (e) {
      if (!e.target.id || e.target.id.indexOf('doc-') !== 0) { return; }
      var s = store.get('guia26-docs', {});
      s[e.target.id.slice(4)] = e.target.checked;
      store.set('guia26-docs', s);
    });
  })();

  /* ---------- Listado completo ---------- */
  (function () {
    var tDep = $('t-depto');
    var todos = [];
    DATA.forEach(function (d) { if (todos.indexOf(d.depto) === -1) { todos.push(d.depto); } });
    todos.sort(function (a, b) { return depLabel(a).localeCompare(depLabel(b), 'es'); });
    tDep.innerHTML = '<option value="">Todos</option>' + todos.map(function (d) { return '<option value="' + esc(d) + '">' + esc(depLabel(d)) + '</option>'; }).join('');
    var ids = ['t-depto', 't-area', 't-vinc', 't-q'];
    var filtros = store.get('guia26-filtros', null);
    if (filtros) {
      ids.forEach(function (id) {
        if (typeof filtros[id] !== 'string') { return; }
        var el = $(id);
        el.value = filtros[id];
        if (el.tagName === 'SELECT' && el.value !== filtros[id]) { el.value = ''; }
      });
    }
    var AREA = { 'Operacional': 0, 'Técnico': 1, 'Ingeniería': 2, 'Profesional': 3, 'Interno': 4 };
    function area(d) { return d.tipo === 'CIA' ? 'Interno' : C.PUESTOS[d.puesto].area; }
    function render() {
      var dep = tDep.value, ar = $('t-area').value, vi = $('t-vinc').value;
      var q = $('t-q').value.trim().toLowerCase();
      var guardar = {};
      ids.forEach(function (id) { guardar[id] = $(id).value; });
      store.set('guia26-filtros', guardar);
      var rows = DATA.filter(function (d) {
        return (!dep || d.depto === dep) && (!ar || area(d) === ar) && (!vi || d.tipo === vi) &&
          (!q || [d.puesto, d.sede, d.code, depLabel(d.depto)].join(' ').toLowerCase().indexOf(q) !== -1);
      }).sort(function (a, b) {
        return AREA[area(a)] - AREA[area(b)] || a.puesto.localeCompare(b.puesto, 'es') || depLabel(a.depto).localeCompare(depLabel(b.depto), 'es');
      });
      $('t-count').textContent = plural(rows.length, 'publicación', 'publicaciones') + ' · ' + plural(sumaVac(rows), 'vacancia', 'vacancias');
      $('t-body').innerHTML = rows.length ? rows.map(function (d) {
        return '<tr' + (d.depto === depSel.value ? ' class="is-hl"' : '') + '>' +
          '<td><b>' + esc(d.puesto) + '</b><br><span class="mono muted">' + esc(d.code) + '</span></td>' +
          '<td>' + esc(depLabel(d.depto)) + '<br><span class="muted">' + esc(d.sede) + '</span></td>' +
          '<td class="r num">' + d.vac + '</td>' +
          '<td class="r num">' + esc(d.sal == null ? 'Según PCC' : miles(d.sal)) + '</td>' +
          '<td>' + chip(d.tipo) + '</td>' +
          '<td class="num">' + esc(diaMes(d.ini)) + ' al ' + esc(diaMes(d.fin)) + '</td>' +
          '<td><a href="' + esc(d.perfil) + '" target="_blank" rel="noopener">Perfil</a><br>' +
          '<a href="' + esc(d.proceso) + '" target="_blank" rel="noopener">Actas</a>' +
          (d.tipo !== 'CIA' ? '<br><button type="button" class="linklike" data-guia="' + esc(d.id) + '">Guía</button>' : '') + '</td></tr>';
      }).join('') : '<tr><td colspan="7" class="muted">Ninguna publicación coincide con los filtros.</td></tr>';
    }
    ids.forEach(function (id) { $(id).addEventListener('input', render); $(id).addEventListener('change', render); });
    depSel.addEventListener('change', render);
    render();
  })();

  /* ---------- Copiar correo ---------- */
  (function () {
    var btn = $('copy-mail');
    if (!btn) { return; }
    function seleccionar() {
      var r = document.createRange();
      r.selectNodeContents($('mail'));
      var s = window.getSelection();
      s.removeAllRanges();
      s.addRange(r);
    }
    btn.addEventListener('click', function () {
      var t = $('mail').textContent;
      var ok = function () { btn.textContent = 'Copiado'; setTimeout(function () { btn.textContent = 'Copiar'; }, 1500); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(t).then(ok, seleccionar);
      } else { seleccionar(); }
    });
  })();

  /* Expuesto solo para pruebas automáticas */
  window.__APP_TEST__ = { modeloGuia: modeloGuia, pdfDoc: pdfDoc, cargarPdfMake: cargarPdfMake, nombreArchivo: nombreArchivo, EXTERNOS: EXTERNOS };
})();
