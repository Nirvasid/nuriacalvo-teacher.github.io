/* ==========================================================================
   tema/tema.js · «Around the English-speaking world»
   Añade la capa decorativa del portal SIN tocar el contenido: horizonte con
   paralaje (Londres · Dublín · Nueva York · Toronto · Sídney), autobús de dos
   pisos, taxi amarillo, canguro, duende irlandés con su olla de oro y
   arcoíris, avioneta con pancarta, saludos flotantes, tréboles y hojas de
   arce, iconos de fondo, barra de progreso, música y efectos.
   Todo va envuelto en try/catch: si algo fallase, el portal sigue igual.
   ========================================================================== */
(function () {
  "use strict";
  try {
    var doc = document, root = doc.documentElement;
    var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
    var fine = window.matchMedia && matchMedia("(pointer: fine)").matches;
    var SND = window.Sonido || { sfx: function () {}, setMode: function () {}, setPrefs: function () {} };
    function el(tag, cls, html) { var e = doc.createElement(tag); if (cls) e.className = cls; if (html) e.innerHTML = html; return e; }
    function rnd(a, b) { return a + Math.random() * (b - a); }

    // ------------------------------------------------------------------ horizonte
    // Tres capas SVG (lejana, media y cercana) sobre un suelo común (y = 260).
    var FAR = '<svg viewBox="0 0 1600 260" preserveAspectRatio="xMidYMax slice" aria-hidden="true">' +
      // bloques de ciudad de fondo
      '<path class="f" d="M0 260V190h40v-30h36v50h30v-70h44v90h26v-40h30v40h40v-60h30v60h420v-50h28v-40h34v90h40v-110h36v110h30v-60h44v60h250v-70h30v-30h40v100h36v-60h30v60h210v-80h40v80h36v-50h40v50h24V260Z"/>' +
      // London Eye (gira)
      '<g transform="translate(300 140)"><g class="tm-eye"><circle class="s" r="84" stroke-width="5"/><circle class="s" r="76" stroke-width="1.5"/>' +
      '<path class="s" stroke-width="1.5" d="M-84 0H84M0-84V84M-59-59L59 59M-59 59L59-59M-78-32L78 32M-78 32L78-32M-32-78L32 78M-32 78L32-78"/>' +
      '<g class="f"><circle cx="0" cy="-84" r="5"/><circle cx="84" cy="0" r="5"/><circle cx="0" cy="84" r="5"/><circle cx="-84" cy="0" r="5"/><circle cx="59" cy="59" r="5"/><circle cx="-59" cy="-59" r="5"/><circle cx="59" cy="-59" r="5"/><circle cx="-59" cy="59" r="5"/></g></g>' +
      '<path class="s" stroke-width="6" d="M0 0L-38 120M0 0L38 120"/></g>' +
      // Sydney Harbour Bridge
      '<path class="s" stroke-width="9" d="M1262 250Q1405 120 1548 250"/><path class="s" stroke-width="3" d="M1262 250Q1405 150 1548 250"/>' +
      '<path class="f" d="M1236 212h338v7H1236zM1236 196h28v64h-28zM1546 196h28v64h-28z"/>' +
      '<path class="s" stroke-width="2" d="M1300 219V200M1340 219V172M1380 219V158M1420 219V156M1460 219V166M1500 219V186"/></svg>';

    var MID = '<svg viewBox="0 0 1600 260" preserveAspectRatio="xMidYMax slice" aria-hidden="true">' +
      // Big Ben + Parlamento
      '<path class="f" d="M140 260V120h-6V70h48v50h-6v140ZM134 70L158 18L182 70ZM156 18h4V0h-4Z"/>' +
      '<circle class="tm-clock" cx="158" cy="95" r="13"/>' +
      '<line class="tm-hand m" x1="158" y1="95" x2="158" y2="85" style="transform-origin:158px 95px"/>' +
      '<line class="tm-hand h" x1="158" y1="95" x2="165" y2="95" style="transform-origin:158px 95px"/>' +
      '<path class="f" d="M176 260V188h128v72ZM180 188l6-16 6 16M200 188l6-16 6 16M220 188l6-16 6 16M240 188l6-16 6 16M260 188l6-16 6 16M280 188l6-16 6 16"/>' +
      '<rect class="tm-window" x="196" y="205" width="8" height="12" style="animation-delay:-2s"/><rect class="tm-window" x="252" y="212" width="8" height="12" style="animation-delay:-5s"/>' +
      // Tower Bridge
      '<path class="f" d="M442 260V122h30v138ZM438 122l19-38 19 38ZM552 260V122h30v138ZM548 122l19-38 19 38ZM472 132h80v10h-80ZM384 204h256v9H384Z"/>' +
      '<path class="s" stroke-width="3" d="M384 204Q414 150 442 132M582 132Q610 150 640 204"/>' +
      // Empire State y Chrysler
      '<path class="f" d="M790 260V110h60v150ZM800 110V80h40v30ZM810 80V55h20v25ZM816 55V35h8v20ZM819 35V4h2v31Z"/>' +
      '<rect class="tm-window" x="804" y="140" width="6" height="9"/><rect class="tm-window" x="830" y="180" width="6" height="9" style="animation-delay:-3s"/>' +
      '<path class="f" d="M886 260V120h50v140ZM890 120Q911 64 932 120ZM898 104Q911 76 924 104ZM910 78h2V40h-2Z"/>' +
      // rascacielos
      '<path class="f" d="M700 260V120h58v140ZM950 260V96h44v164ZM1004 260V140h40v120ZM1170 260V150h40v110Z"/>' +
      '<rect class="tm-window" x="712" y="150" width="6" height="9" style="animation-delay:-1s"/><rect class="tm-window" x="962" y="130" width="6" height="9" style="animation-delay:-4s"/>' +
      // CN Tower (Toronto)
      '<path class="f" d="M1093 260L1097 92h6l4 168ZM1086 105a14 8 0 1 0 28 0a14 8 0 1 0-28 0ZM1094 70a6 4 0 1 0 12 0a6 4 0 1 0-12 0ZM1099 70V8h2v62Z"/>' +
      // Ópera de Sídney
      '<path class="f" d="M1318 238h178v12H1318ZM1330 240Q1356 150 1402 240ZM1372 240Q1404 124 1452 240ZM1424 240Q1452 168 1486 240Z"/></svg>';

    var NEAR = '<svg viewBox="0 0 1600 160" preserveAspectRatio="xMidYMax slice" aria-hidden="true">' +
      // colinas y árboles
      '<path class="f" d="M0 160V120Q120 96 240 118T480 112T720 124T960 110T1200 122T1440 108T1600 118V160Z"/>' +
      '<g class="f"><circle cx="60" cy="104" r="16"/><rect x="58" y="104" width="4" height="18"/><circle cx="96" cy="110" r="12"/><circle cx="410" cy="100" r="15"/><circle cx="436" cy="106" r="11"/>' +
      '<circle cx="1010" cy="98" r="14"/><circle cx="1036" cy="104" r="10"/><circle cx="1500" cy="96" r="15"/><circle cx="1528" cy="104" r="11"/></g>' +
      // cabina roja de Londres
      '<path class="f" d="M180 124V80h22v44ZM178 80q13-10 26 0Z"/>' +
      // Irlanda: torre redonda de Glendalough y cruz celta
      '<path class="f" d="M322 124V42h16v82ZM319 42l11-20 11 20ZM328 58h4v7h-4ZM328 84h4v7h-4Z"/>' +
      '<path class="f" d="M357 124V70h7v54ZM349 80h23v6h-23Z"/><circle class="s" cx="360.5" cy="83" r="8" stroke-width="3"/>' +
      // Ha'penny Bridge (Dublín) con sus farolas
      '<path class="s" stroke-width="4" d="M820 124Q890 84 960 124"/><path class="s" stroke-width="1.5" d="M826 121Q890 90 954 121M840 114v-6M860 106v-7M890 102v-8M920 106v-7M940 114v-6"/>' +
      '<g fill="#fbbf24" class="tm-lamp"><circle cx="860" cy="98" r="2.2"/><circle cx="890" cy="93" r="2.2"/><circle cx="920" cy="98" r="2.2"/></g>' +
      // Estatua de la Libertad
      '<path class="f" d="M630 124V96h40v28ZM622 124h56v6h-56ZM638 96L644 52h12l6 44ZM650 50m-6 0a6 6 0 1 0 12 0a6 6 0 1 0-12 0ZM654 56l8-32h4l-4 32ZM640 58l-6 12h6ZM642 44l-3-6 5 4M650 40v-7M658 44l3-6-5 4"/>' +
      '<ellipse class="tm-flame" cx="664" cy="17" rx="4" ry="7"/></svg>';

    // Canguro: silueta natural, con la cría asomando de la bolsa.
    var ROO = '<svg viewBox="0 0 84 62"><g class="tm-roo-body">' +
      '<path d="M2 57Q14 58 26 50Q32 46 34 42L40 46Q34 56 22 59Q10 61 2 59Z" fill="#b8693f"/>' +
      '<path d="M30 28Q34 18 46 17Q56 17 60 24Q63 30 60 38Q56 48 44 50Q34 50 30 42Q27 35 30 28Z" fill="#c97b4b"/>' +
      '<path d="M44 26Q52 24 56 30Q58 38 52 44Q46 46 44 40Z" fill="#e8b48a"/>' +
      '<circle cx="48" cy="37" r="3.6" fill="#c97b4b"/><path d="M46 34l1-4 2 3.4Z" fill="#c97b4b"/><circle cx="49" cy="36.5" r=".7" fill="#1e1b4b"/>' +
      '<path d="M54 22Q60 12 66 10Q72 9 76 13Q79 16 76 18L70 19Q66 22 62 28Z" fill="#c97b4b"/>' +
      '<path d="M63 11Q61 2 64 0Q67 3 66 10Z M67 10Q67 2 70 1Q72 5 69 11Z" fill="#b8693f"/><path d="M64 9Q63 4 64.5 2Q66 5 65.5 9Z" fill="#e8b48a"/>' +
      '<circle cx="70" cy="13" r="1.3" fill="#1e1b4b"/><circle cx="77" cy="16" r="1.1" fill="#3b2415"/>' +
      '<path class="tm-roo-arm" d="M58 32Q63 36 64 41" stroke="#b8693f" stroke-width="3" stroke-linecap="round" fill="none"/>' +
      '<g class="tm-roo-leg"><path d="M36 38Q46 40 46 50L44 54Q40 48 34 46Z" fill="#b8693f"/><path d="M40 53L62 55Q66 57 62 59L38 59Q36 56 40 53Z" fill="#9c5530"/></g>' +
      '</g></svg>';
    // Duende irlandés (leprechaun)
    var LEP = '<svg viewBox="0 0 44 64"><g class="tm-lep-body">' +
      '<rect x="12" y="4" width="20" height="13" rx="1.5" fill="#15803d"/><rect x="8" y="16" width="28" height="3.4" rx="1.7" fill="#166534"/>' +
      '<rect x="12" y="12" width="20" height="3.4" fill="#1e1b4b"/><rect x="19.5" y="11.4" width="5" height="4.6" fill="none" stroke="#fbbf24" stroke-width="1.2"/>' +
      '<path d="M30 6q3-3 5 0q-3 1-5 0Z M30 6q2 3 0 5q-1-3 0-5Z" fill="#4ade80"/>' +
      '<circle cx="22" cy="25" r="6.5" fill="#fcd9b6"/><circle cx="19.5" cy="24" r=".9" fill="#1e1b4b"/><circle cx="24.5" cy="24" r=".9" fill="#1e1b4b"/>' +
      '<circle cx="18" cy="26.5" r="1.4" fill="#fb7185" opacity=".6"/><circle cx="26" cy="26.5" r="1.4" fill="#fb7185" opacity=".6"/>' +
      '<path d="M14.5 25Q15 37 22 38Q29 37 29.5 25Q26 30 22 30Q18 30 14.5 25Z" fill="#f97316"/><path d="M19.5 29.5q2.5 1.6 5 0" stroke="#7c2d12" stroke-width=".8" fill="none"/>' +
      '<path d="M13 38Q22 35 31 38L33 50L11 50Z" fill="#16a34a"/><rect x="11.5" y="45" width="21" height="3" fill="#1e1b4b"/><rect x="19.5" y="44.2" width="5" height="4.6" fill="none" stroke="#fbbf24" stroke-width="1.2"/>' +
      '<path class="tm-lep-arm l" d="M14 40L6 32" stroke="#16a34a" stroke-width="3.4" stroke-linecap="round"/><path class="tm-lep-arm r" d="M30 40L38 32" stroke="#16a34a" stroke-width="3.4" stroke-linecap="round"/>' +
      '<g class="tm-lep-leg l"><rect x="15" y="50" width="4.4" height="8" fill="#1e1b4b"/><ellipse cx="15.5" cy="59.5" rx="5" ry="2.4" fill="#111827"/><rect x="13.6" y="58" width="3" height="2" fill="#fbbf24"/></g>' +
      '<g class="tm-lep-leg r"><rect x="24.6" y="50" width="4.4" height="8" fill="#1e1b4b"/><ellipse cx="28.5" cy="59.5" rx="5" ry="2.4" fill="#111827"/><rect x="27.4" y="58" width="3" height="2" fill="#fbbf24"/></g>' +
      '</g></svg>';
    // Olla de oro
    var POT = '<svg viewBox="0 0 44 36"><g fill="#fbbf24"><circle cx="12" cy="11" r="5"/><circle cx="20" cy="8" r="5"/><circle cx="28" cy="10" r="5"/><circle cx="34" cy="13" r="4"/><circle cx="16" cy="13" r="4"/></g>' +
      '<path d="M6 14h32q2 0 2 2t-2 2h-1q2 12-15 14Q5 30 7 18H6q-2 0-2-2t2-2Z" fill="#1f2937"/><path d="M9 20q13 4 26 0" stroke="#4b5563" stroke-width="1.4" fill="none"/>' +
      '<g class="tm-spark" fill="#fef3c7"><path d="M22 0l1 3 3 1-3 1-1 3-1-3-3-1 3-1Z"/><path d="M36 4l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7Z"/></g></svg>';

    function scene(hero) {
      var sc = el("div", "tm-scene no-print");
      sc.setAttribute("aria-hidden", "true");
      var sky = el("div", "tm-sky");
      var nStars = window.innerWidth < 700 ? 30 : 70;
      for (var i = 0; i < nStars; i++) {
        var s = el("i", "tm-star");
        s.style.left = rnd(0, 100) + "%"; s.style.top = rnd(0, 55) + "%";
        s.style.animationDelay = -rnd(0, 4) + "s";
        sky.appendChild(s);
      }
      [[12, 180, 70], [26, 130, 95], [40, 220, 120]].forEach(function (c) {
        var cl = el("i", "tm-cloud");
        cl.style.top = c[0] + "%"; cl.style.width = c[1] + "px";
        cl.style.animationDuration = c[2] + "s"; cl.style.animationDelay = -rnd(0, c[2]) + "s";
        sky.appendChild(cl);
      });
      sc.appendChild(sky);
      var far = el("div", "tm-layer tm-far", FAR); far.setAttribute("data-tm-speed", "0.06"); far.setAttribute("data-tm-depth", "8");
      var mid = el("div", "tm-layer tm-mid", MID); mid.setAttribute("data-tm-speed", "0.12"); mid.setAttribute("data-tm-depth", "16");
      var near = el("div", "tm-layer tm-near", NEAR); near.setAttribute("data-tm-speed", "0.2"); near.setAttribute("data-tm-depth", "26");
      sc.appendChild(far); sc.appendChild(mid); sc.appendChild(near);
      sc.appendChild(el("div", "tm-water"));
      if (!reduce) {
        sc.appendChild(el("div", "tm-mover tm-bus",
          '<svg viewBox="0 0 86 52"><rect x="2" y="4" width="80" height="40" rx="7" fill="#f43f5e"/><rect x="2" y="22" width="80" height="3" fill="#be123c"/>' +
          '<g fill="#e0e7ff" opacity=".85"><rect x="8" y="9" width="11" height="9" rx="2"/><rect x="23" y="9" width="11" height="9" rx="2"/><rect x="38" y="9" width="11" height="9" rx="2"/><rect x="53" y="9" width="11" height="9" rx="2"/><rect x="68" y="9" width="10" height="9" rx="2"/>' +
          '<rect x="8" y="28" width="11" height="9" rx="2"/><rect x="23" y="28" width="11" height="9" rx="2"/><rect x="38" y="28" width="11" height="9" rx="2"/><rect x="68" y="28" width="10" height="12" rx="2"/></g>' +
          '<circle cx="18" cy="45" r="6" fill="#1e1b4b"/><circle cx="66" cy="45" r="6" fill="#1e1b4b"/><circle cx="18" cy="45" r="2.4" fill="#a5b4fc"/><circle cx="66" cy="45" r="2.4" fill="#a5b4fc"/></svg>'));
        sc.appendChild(el("div", "tm-mover tm-taxi",
          '<svg viewBox="0 0 58 30"><path d="M4 18q0-6 6-6h6l6-8h16l7 8h5q4 0 4 5v7H4Z" fill="#f59e0b"/><rect x="22" y="1" width="12" height="4" rx="1" fill="#fcd34d"/>' +
          '<path d="M24 6h12l5 6H20Z" fill="#e0e7ff" opacity=".8"/><path d="M4 20h50" stroke="#1e1b4b" stroke-dasharray="3 3" stroke-width="1.5"/>' +
          '<circle cx="15" cy="25" r="4.5" fill="#1e1b4b"/><circle cx="45" cy="25" r="4.5" fill="#1e1b4b"/></svg>'));
        sc.appendChild(el("div", "tm-mover tm-roo", ROO));
        // Irlanda: arcoíris en el cielo y el duende cruzando la portada
        // con su olla de oro, a saltitos de jiga
        sc.appendChild(el("div", "tm-rainbow"));
        var irl = el("div", "tm-mover tm-irl");
        irl.appendChild(el("div", "tm-lep", LEP));
        irl.appendChild(el("div", "tm-pot", POT));
        sc.appendChild(irl);
        var plane = el("div", "tm-plane",
          '<svg viewBox="0 0 58 26"><path d="M4 13q0-4 6-4h30l10-8h4l-5 8q7 1 7 4t-7 4l5 8h-4l-10-8H10q-6 0-6-4Z" fill="#e0e7ff"/><path d="M22 9l-6-8h5l10 8ZM22 17l-6 8h5l10-8Z" fill="#a5b4fc"/><circle cx="14" cy="13" r="1.4" fill="#6366f1"/><circle cx="20" cy="13" r="1.4" fill="#6366f1"/></svg>' +
          '<span class="tm-rope"></span><span class="tm-banner">Hello! · Dia duit! · G\'day! · Howdy! · Hiya! · Welcome!</span>');
        sc.appendChild(plane);
      }
      hero.insertBefore(sc, hero.firstChild);
      return sc;
    }

    // ------------------------------------------------------------------ saludos flotantes
    var HELLOS = [
      ["Hello!", "UK"], ["Hiya!", "UK"], ["Cheers!", "UK"], ["Lovely!", "UK"], ["G'day, mate!", "Australia"], ["No worries!", "Australia"],
      ["Howdy!", "USA"], ["What's up?", "USA"], ["Awesome!", "USA"], ["How's it going?", "Canada"], ["Top of the morning!", "Ireland"], ["Dia duit!", "Ireland · Gaeilge"], ["Sláinte!", "Ireland"], ["What's the craic?", "Ireland"],
      ["Kia ora!", "New Zealand"], ["Nice to meet you!", "Everywhere"], ["Well done!", "Everywhere"], ["Keep going!", "Everywhere"]
    ];
    function hellos(sc) {
      if (reduce) return;
      function one() {
        if (document.hidden || !sc.isConnected) return;
        var r = sc.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) return;
        var h = HELLOS[Math.floor(Math.random() * HELLOS.length)];
        var b = el("span", "tm-hello");
        b.textContent = h[0];
        var small = el("small"); small.textContent = h[1]; b.appendChild(small);
        // En el cielo del horizonte, por debajo del texto: nunca tapa nada.
        var content = sc.parentNode.querySelector(".hero-grid");
        var minTop = content ? (content.offsetTop + content.offsetHeight + 12) : r.height * 0.7;
        var maxTop = r.height - 150;
        if (maxTop < minTop) maxTop = minTop;
        b.style.left = rnd(3, window.innerWidth < 700 ? 60 : 84) + "%";
        b.style.top = rnd(minTop, maxTop) + "px";
        sc.appendChild(b);
        setTimeout(function () { b.remove(); }, 7200);
      }
      setTimeout(one, 1200);
      setInterval(one, 3200);
    }

    // ------------------------------------------------------------------ fondo de la página
    var ICONS = [
      // Big Ben
      '<path d="M40 88V34h20v54M36 34h28M40 34l10-22 10 22M50 12V4"/><circle cx="50" cy="44" r="6"/><path d="M50 44v-3M50 44h3"/>',
      // cabina telefónica
      '<rect x="32" y="24" width="36" height="64" rx="3"/><path d="M28 24q22-18 44 0M38 34h24v26H38zM50 34v26M38 47h24"/>',
      // Estatua de la Libertad
      '<path d="M40 90h20M44 90l4-50h8l4 50M52 40a6 6 0 1 0 0-12a6 6 0 1 0 0 12M58 30l8-22M64 6q2-4 4 0q-2 4-4 0"/>',
      // Ópera de Sídney
      '<path d="M14 80h72M18 80q10-40 34 0M38 80q14-52 38 0M62 80q10-28 22 0"/>',
      // hoja de arce
      '<path d="M50 88V60M50 60l-8 6 2-10-12-2 8-8-8-10 12 2 4-12 4 8 4-8 4 12 12-2-8 10 8 8-12 2 2 10Z"/>',
      // taza de té
      '<path d="M24 46h44v14q0 20-22 20T24 60ZM68 50q12 0 10 10t-12 6M20 86h56M40 38q-4-6 0-12M50 38q-4-6 0-12"/>',
      // canguro (señal)
      '<path d="M50 6l40 44-40 44-40-44Z"/><path d="M58 34q4-4 6 0l-2 4q-2 8-8 10l4 10h-4l-4-6q-6 2-10 0l-6 6q-3 0 0-3l4-5q-2-6 4-10q6-4 16-6Z"/>',
      // trébol (Irlanda)
      '<path d="M50 50q-22-4-18-20t18 2q4-22 18-18t0 22q18-4 20 12t-20 4q4 14-4 18t-14-20ZM50 52q2 20 12 34"/>',
      // arpa celta (Irlanda)
      '<path d="M30 88L28 14q30 0 44 30T70 88ZM30 88h40M38 26v58M46 30v54M54 38v46M62 50v34"/>',
      // guitarra (country / folk)
      '<path d="M66 10l10 10M71 15L48 38M44 36q-18-4-22 10q-4 14 10 22t22-6q6-12-6-18"/><circle cx="36" cy="54" r="5"/>'
    ];
    var bgIcons = [];
    function background() {
      var bg = el("div", "tm-bg no-print");
      bg.setAttribute("aria-hidden", "true");
      var n = window.innerWidth < 700 ? 6 : 10;
      for (var i = 0; i < n; i++) {
        var ic = el("div", "tm-icon", '<svg viewBox="0 0 100 100">' + ICONS[i % ICONS.length] + "</svg>");
        var left = (i % 2 ? rnd(78, 94) : rnd(1, 12));
        ic.style.left = left + "%";
        var sz = rnd(70, 120); ic.style.width = ic.style.height = sz + "px";
        ic.style.transform = "rotate(" + rnd(-14, 14) + "deg)";
        bgIcons.push({ el: ic, y: i * 42 + rnd(0, 20), speed: rnd(0.15, 0.35), rot: rnd(-14, 14) });
        bg.appendChild(ic);
      }
      if (!reduce) {
        var LEAF = '<svg viewBox="0 0 24 24"><path fill="COLOR" d="M12 22v-5l-4 1 1-3-5-3 2-1-2-4 4 1 1-3 3 3v-6l2 3 2-3v6l3-3 1 3 4-1-2 4 2 1-5 3 1 3-4-1v5Z"/></svg>';
        var CLOVER = '<svg viewBox="0 0 24 24"><g fill="COLOR"><circle cx="12" cy="6.5" r="4.4"/><circle cx="6.8" cy="12.5" r="4.4"/><circle cx="17.2" cy="12.5" r="4.4"/><circle cx="12" cy="11.5" r="3"/></g><path d="M12 13q1 6 4 9" stroke="COLOR" stroke-width="1.8" fill="none" stroke-linecap="round"/></svg>';
        var GREENS = ["#22c55e", "#4ade80", "#16a34a", "#86efac"];
        var STAR = '<svg viewBox="0 0 24 24"><path fill="COLOR" d="M12 2l3 7h7l-5.5 4.5 2 7.5L12 16.5 5.5 21l2-7.5L2 9h7Z"/></svg>';
        var COLORS = ["#f472b6", "#fbbf24", "#818cf8", "#c084fc", "#fb7185"];
        var nl = window.innerWidth < 700 ? 10 : 18;
        for (var k = 0; k < nl; k++) {
          // la mitad son tréboles verdes; el resto, hojas de arce y estrellas
          var shape = k % 2 === 0 ? CLOVER.replace(/COLOR/g, GREENS[(k / 2) % GREENS.length]) : (k % 4 === 3 ? STAR : LEAF).replace("COLOR", COLORS[k % COLORS.length]);
          var lf = el("i", "tm-leaf" + (k % 2 === 0 ? " tm-clover" : ""), shape);
          lf.style.left = rnd(0, 100) + "%";
          lf.style.animationDuration = rnd(18, 34) + "s";
          lf.style.animationDelay = -rnd(0, 34) + "s";
          lf.style.setProperty("--dx", rnd(-60, 140) + "px");
          lf.style.setProperty("--rot", rnd(200, 620) + "deg");
          var z = rnd(12, 22); lf.style.width = lf.style.height = z + "px";
          bg.appendChild(lf);
        }
      }
      doc.body.insertBefore(bg, doc.body.firstChild);
    }

    // ------------------------------------------------------------------ paralaje
    var layers = [], mx = 0, tx = 0, bar;
    function frame() {
      var y = window.scrollY, vh = window.innerHeight;
      tx += (mx - tx) * 0.05;
      if (y < vh * 1.4) layers.forEach(function (l) {
        var sp = +l.getAttribute("data-tm-speed"), d = +l.getAttribute("data-tm-depth");
        l.style.transform = "translate3d(" + (-tx * d).toFixed(1) + "px," + (y * sp).toFixed(1) + "px,0)";
      });
      var span = vh + 260;
      bgIcons.forEach(function (ic) {
        var top = (((ic.y / 100) * span - y * ic.speed) % span + span) % span - 130;
        ic.el.style.transform = "translate3d(0," + top.toFixed(1) + "px,0) rotate(" + ic.rot.toFixed(1) + "deg)";
      });
      moverMundo(y, tx);
      var h = root.scrollHeight - vh;
      if (bar) bar.style.width = (h > 0 ? Math.min(100, y / h * 100) : 0) + "%";
      requestAnimationFrame(frame);
    }

    // ------------------------------------------------------------------ el mundo que pasa
    // Franja de paisaje fija al pie de la ventana, en tres capas que viajan a
    // distinta velocidad al bajar por la página, más un cielo con nubes.

    // --- capa lejana: montañas y colinas
    var W_FAR = '<svg viewBox="0 0 1500 300" aria-hidden="true">' +
      '<g opacity=".7"><path class="f" d="M0 300V208l64-72 46 52 38-34 70 86 58-48 86 74 72-62 104 84 78-70 96 82 74-56 86 68 72-44 156 92V300Z"/></g>' +
      '<path class="f" d="M0 300V254q76-34 156-14t166 8 150-28 164 24 152-16 166 22 146 10 160-16 140 12V300Z"/>' +
      '<g class="f" opacity=".8"><path d="M210 254l12-30 12 30zM232 254l10-24 10 24zM700 252l11-28 11 28zM1062 254l12-30 12 30z"/></g>' +
      '</svg>';

    // --- capa media: los monumentos del mundo angloparlante
    var W_MID = '<svg viewBox="0 0 1500 300" aria-hidden="true">' +
      // Stonehenge
      '<path class="f" d="M38 300v-54h17v54zM72 300v-54h17v54zM32 240h63v12H32zM112 300v-44h15v44zM142 300v-40h14v40zM106 250h56v11h-56z"/>' +
      // Big Ben y el Parlamento
      '<path class="f" d="M198 300V190h-6v-13h31v13h-6v110zM195 177l16-29 16 29zM209 148h4v-12h-4z"/>' +
      '<circle class="tm-clock" cx="211" cy="200" r="7"/>' +
      '<path class="f" d="M231 300v-60h74v60zM235 240l5-13 5 13M251 240l5-13 5 13M267 240l5-13 5 13M283 240l5-13 5 13"/>' +
      '<rect class="tm-wwin" x="242" y="256" width="6" height="10"/><rect class="tm-wwin" x="276" y="262" width="6" height="10" style="animation-delay:-3s"/>' +
      // Tower Bridge
      '<path class="f" d="M356 300V182h27v118zM352 182l17.5-29 17.5 29zM477 300V182h27v118zM473 182l17.5-29 17.5 29zM383 196h94v11h-94zM334 266h192v9H334z"/>' +
      '<path class="s" stroke-width="3.4" d="M334 266q22-46 52-60M474 206q30 14 52 60"/>' +
      '<path class="s" stroke-width="1.6" d="M348 258v-12M362 250v-14M396 244v-14M420 242v-12M444 242v-12M468 248v-14M500 256v-12"/>' +
      // Estatua de la Libertad
      '<path class="f" d="M566 300v-28h36v28zM571 272v-15h26v15zM577 257l6-54h10l6 54zM584 203a6.5 6.5 0 1 1 13 0a6.5 6.5 0 1 1-13 0ZM597 201l10-27h4l-8 27zM582 196l-2-8 4 5M590 193v-8M598 196l3-8-5 5"/>' +
      '<ellipse class="tm-flame" cx="609" cy="169" rx="3.6" ry="6.5"/>' +
      // Nueva York: Empire State y Chrysler
      '<path class="f" d="M646 300V182h44v118zM654 182v-22h28v22zM664 160v-17h8v17zM666 143v-27h4v27z"/>' +
      '<path class="f" d="M700 300V204h40v96zM704 204q20-48 40 0ZM714 188q10-26 20 0ZM722 168h4v-28h-4z"/>' +
      '<path class="f" d="M750 300V226h34v74zM790 300V244h28v56z"/>' +
      '<rect class="tm-wwin" x="658" y="206" width="6" height="9" style="animation-delay:-1s"/><rect class="tm-wwin" x="712" y="230" width="6" height="9" style="animation-delay:-4s"/><rect class="tm-wwin" x="760" y="250" width="6" height="9" style="animation-delay:-6s"/>' +
      // Torre CN de Toronto
      '<path class="f" d="M844 300l4-148h6l4 148zM838 162a13 7.5 0 1 0 26 0a13 7.5 0 1 0-26 0ZM846 132a5 3.5 0 1 0 10 0a5 3.5 0 1 0-10 0ZM850 132V92h2v40z"/>' +
      // Ópera de Sídney y el puente del puerto
      '<path class="f" d="M898 290h128v10H898ZM906 292q20-64 54 0ZM938 292q24-78 58 0ZM978 292q16-52 40 0Z"/>' +
      '<path class="s" stroke-width="7" d="M1046 292q52-74 104 0"/><path class="s" stroke-width="2.4" d="M1046 292q52-54 104 0"/>' +
      '<path class="f" d="M1038 282h120v6h-120zM1038 268h14v30h-14zM1144 268h14v30h-14z"/>' +
      '<path class="s" stroke-width="1.6" d="M1070 282v-16M1090 282v-24M1110 282v-24M1130 282v-16"/>' +
      // faro
      '<path class="f" d="M1176 300l6-68h10l6 68zM1178 232h18v-8h-18zM1180 224l4-13h6l4 13z"/>' +
      '<circle class="tm-lamp" cx="1187" cy="228" r="3" fill="#fbbf24"/>' +
      '</svg>';

    // --- capa cercana: el suelo, los árboles y el mobiliario de la calle
    var W_NEAR = '<svg viewBox="0 0 1500 300" aria-hidden="true">' +
      '<path class="g" d="M0 268q100-16 200-8t200 12 200-14 200 10 200-12 200 8 200-10 100 6V300H0Z"/>' +
      '<path class="r" d="M0 288h1500v12H0z"/>' +
      '<g class="r"><path d="M20 292h40v4H20zM100 292h40v4h-40zM180 292h40v4h-40zM260 292h40v4h-40zM340 292h40v4h-40zM420 292h40v4h-40zM500 292h40v4h-40zM580 292h40v4h-40zM660 292h40v4h-40zM740 292h40v4h-40zM820 292h40v4h-40zM900 292h40v4h-40zM980 292h40v4h-40zM1060 292h40v4h-40zM1140 292h40v4h-40zM1220 292h40v4h-40zM1300 292h40v4h-40zM1380 292h40v4h-40zM1460 292h40v4h-40z"/></g>' +
      // árboles
      '<g class="f"><circle cx="86" cy="246" r="20"/><circle cx="110" cy="254" r="14"/><path d="M92 256h7v26h-7z"/>' +
      '<circle cx="466" cy="244" r="18"/><circle cx="446" cy="252" r="13"/><path d="M462 254h7v28h-7z"/>' +
      '<circle cx="874" cy="246" r="19"/><circle cx="896" cy="254" r="13"/><path d="M878 256h7v26h-7z"/>' +
      '<path d="M646 282l-14-38h28zM648 258l-12-30h24zM652 244h6v38h-6z"/></g>' +
      // cabina telefónica roja
      '<path class="d" d="M146 282v-48h24v48zM144 234q13-10 28 0Z"/>' +
      '<path class="r" d="M150 240h7v14h-7zM159 240h7v14h-7zM150 258h7v14h-7zM159 258h7v14h-7z"/>' +
      // buzón de correos
      '<path class="d" d="M304 282v-32a9 9 0 0 1 18 0v32zM306 258h14v4h-14z"/>' +
      // parada de autobús
      '<path class="d" d="M716 282v-44h4v44zM706 232h24v14h-24z"/>' +
      // banco de parque
      '<path class="d" d="M1016 282v-14h3v14zM1044 282v-14h3v14zM1012 266h36v4h-36zM1012 258h36v3.4h-36z"/>' +
      // valla de madera
      '<g class="f"><path d="M540 282v-26h4v26zM556 282v-26h4v26zM572 282v-26h4v26zM588 282v-26h4v26zM604 282v-26h4v26zM536 262h76v4h-76zM536 272h76v4h-76z"/></g>' +
      // farolas con su luz
      '<g class="d"><path d="M396 282v-46h3.5v46zM392 234h12v4h-12zM1122 282v-46h3.5v46zM1118 234h12v4h-12z"/></g>' +
      '<g class="tm-lamp" fill="#fbbf24"><circle cx="398" cy="232" r="3"/><circle cx="1124" cy="232" r="3"/></g>' +
      // el tramo de campo abierto antes de que el paisaje vuelva a empezar
      '<g class="f"><circle cx="1248" cy="248" r="17"/><circle cx="1268" cy="256" r="12"/><path d="M1252 258h6v24h-6z"/>' +
      '<circle cx="1404" cy="250" r="15"/><circle cx="1386" cy="257" r="11"/><path d="M1400 259h6v23h-6z"/>' +
      '<path d="M1300 282q14-10 28 0zM1332 282q10-7 20 0zM1446 282q12-9 24 0z"/></g>' +
      '</svg>';

    // ------------------------------------------------------------------ personajes
    // Guardia real británico
    var GUARDIA = '<svg viewBox="0 0 40 78"><g class="tm-walk">' +
      '<g class="tm-leg l"><rect x="14.4" y="52" width="5" height="19" rx="1.4" fill="#111827"/><rect x="18.2" y="52" width="1.4" height="19" fill="#dc2626" opacity=".6"/><path d="M11.8 71h8.6v4.4h-8.6z" fill="#0b1120"/></g>' +
      '<g class="tm-leg r"><rect x="20.6" y="52" width="5" height="19" rx="1.4" fill="#1f2937"/><rect x="24.4" y="52" width="1.4" height="19" fill="#dc2626" opacity=".6"/><path d="M19.6 71h8.6v4.4h-8.6z" fill="#111827"/></g>' +
      '<path d="M12.5 30h15v24h-15z" fill="#dc2626"/><path d="M12.5 30h15v4h-15z" fill="#b91c1c"/><path d="M12.5 46.5h15v3.4h-15z" fill="#f8fafc"/>' +
      '<g fill="#fbbf24"><circle cx="20" cy="35" r="1"/><circle cx="20" cy="39.5" r="1"/><circle cx="20" cy="44" r="1"/></g>' +
      '<rect class="tm-arm2 l" x="8.8" y="31" width="4" height="17" rx="2" fill="#dc2626"/>' +
      '<rect class="tm-arm2 r" x="27.2" y="31" width="4" height="17" rx="2" fill="#dc2626"/>' +
      '<circle cx="20" cy="25.6" r="5.2" fill="#f1c9a5"/><circle cx="18.2" cy="25" r=".8" fill="#1e1b4b"/><circle cx="21.8" cy="25" r=".8" fill="#1e1b4b"/>' +
      '<path d="M13.6 23.6V13.4Q13.6 5 20 5t6.4 8.4v10.2z" fill="#111827"/><path d="M13.6 21.4h12.8v2.6H13.6z" fill="#000" opacity=".5"/>' +
      '<path d="M20 25.6v4.6" stroke="#e5e7eb" stroke-width=".9"/>' +
      '<path d="M30.4 21l-2.6 27" stroke="#52525b" stroke-width="2.4" stroke-linecap="round"/><path d="M30 26.5l3.6-1" stroke="#92400e" stroke-width="2" stroke-linecap="round"/>' +
      '</g></svg>';

    // Corgi
    var CORGI = '<svg viewBox="0 0 44 30"><g class="tm-bob">' +
      '<path class="tm-wag" d="M9 16q-6-3-7 1 4 3 7 1z" fill="#fef3c7"/>' +
      '<path d="M9 21q0-8 9-8h10q8 0 8 8v2q0 2-2 2H11q-2 0-2-2z" fill="#d97706"/>' +
      '<g class="tm-leg l"><path d="M14 23h4.4v5.4H14z" fill="#b45309"/></g>' +
      '<g class="tm-leg r"><path d="M27 23h4.4v5.4H27z" fill="#a1540a"/></g>' +
      '<path d="M13 18q8-4 17 0v7H13z" fill="#fef3c7"/>' +
      '<path d="M28.6 8.4l-1.4-7 6 3.6zM37.4 7l3.2-5.6 1.6 6.2z" fill="#d97706"/>' +
      '<ellipse cx="35" cy="13" rx="7" ry="6.4" fill="#d97706"/><path d="M31 15q4 3 8 0-1 4-4 4t-4-4z" fill="#fef3c7"/>' +
      '<circle cx="36.4" cy="11.4" r=".9" fill="#1f2937"/><ellipse cx="41" cy="14" rx="1.8" ry="1.4" fill="#1f2937"/>' +
      '</g></svg>';

    // Gaitero escocés
    var GAITERO = '<svg viewBox="0 0 50 78"><g class="tm-walk">' +
      '<g class="tm-leg l"><rect x="16" y="60" width="5" height="10" fill="#f8fafc"/><path d="M13.6 70h8.4v4.4h-8.4z" fill="#111827"/></g>' +
      '<g class="tm-leg r"><rect x="23" y="60" width="5" height="10" fill="#e2e8f0"/><path d="M21.4 70h8.4v4.4h-8.4z" fill="#0b1120"/></g>' +
      '<path d="M13.6 46h17v16h-17z" fill="#1d4ed8"/>' +
      '<g stroke="#dc2626" stroke-width="1.2" opacity=".85"><path d="M17 46v16M23 46v16M29 46v16M13.6 51h17M13.6 57h17"/></g>' +
      '<g stroke="#15803d" stroke-width=".8" opacity=".7"><path d="M20 46v16M26 46v16M13.6 48.4h17M13.6 54.4h17"/></g>' +
      '<path d="M14 29h16v18H14z" fill="#1f2937"/><path d="M14 29h16v3H14z" fill="#0b1120"/>' +
      '<rect class="tm-arm2 l" x="10.6" y="30" width="3.8" height="16" rx="1.9" fill="#1f2937"/>' +
      '<circle cx="22" cy="24" r="5.2" fill="#f1c9a5"/>' +
      '<path d="M16.8 25q1.4 7 5.2 7t5.2-7q-2.6 2.6-5.2 2.6T16.8 25z" fill="#ea580c"/>' +
      '<circle cx="20.2" cy="23.4" r=".8" fill="#1e1b4b"/><circle cx="23.8" cy="23.4" r=".8" fill="#1e1b4b"/>' +
      '<path d="M16 19.6h12v3.2H16zM16 19.6q6-5.6 12 0z" fill="#111827"/><circle cx="27.4" cy="18.4" r="2" fill="#dc2626"/>' +
      '<path d="M30 33q10-4 13 3t-7 9q-7 1-8-5z" fill="#166534"/>' +
      '<g stroke="#f8fafc" stroke-width=".9" opacity=".6"><path d="M32 34l10 6M36 31l6 12"/></g>' +
      '<g stroke="#d6d3d1" stroke-width="2.2" stroke-linecap="round"><path d="M34 33L30 9M38 33l-1-24M42 35l5-22"/></g>' +
      '<g fill="#111827"><circle cx="30" cy="8" r="1.6"/><circle cx="37" cy="8" r="1.6"/><circle cx="47.2" cy="12" r="1.6"/></g>' +
      '<rect class="tm-arm2 r" x="28.6" y="31" width="3.8" height="14" rx="1.9" fill="#1f2937"/>' +
      '</g></svg>';

    // Vaquero a caballo: el caballo trota y el jinete se mece en la silla
    var VAQUERO = '<svg viewBox="0 0 96 78"><g class="tm-walk">' +
      '<path d="M18 40q-9 4-11 18 7-3 11-11z" fill="#5b2d0b"/>' +
      '<g class="tm-pata b1"><path d="M24 50l-3 20h5.4l3.6-20z" fill="#8a5212"/><path d="M19.6 70h8v4.4h-8z" fill="#2f1b0a"/></g>' +
      '<g class="tm-pata d1"><path d="M62 48l-2 22h5.4l3-22z" fill="#8a5212"/><path d="M58.6 70h8v4.4h-8z" fill="#2f1b0a"/></g>' +
      '<path d="M20 42q3-14 22-14h24q11 0 14 9 3 9-3 13-6 4-21 4H30q-11 0-10-12z" fill="#a16207"/>' +
      '<g class="tm-pata b2"><path d="M32 50l-2 20h5.4l3-20z" fill="#b97e1c"/><path d="M28.6 70h8v4.4h-8z" fill="#3f2512"/></g>' +
      '<g class="tm-pata d2"><path d="M70 48l-1 22h5.4l2-22z" fill="#b97e1c"/><path d="M67.6 70h8v4.4h-8z" fill="#3f2512"/></g>' +
      '<path d="M66 32q6-13 13-21l9.4 4.4q-5.4 12-11.4 21z" fill="#a16207"/>' +
      '<path d="M78 14q7-6 13-2.6l2.6 9.4-4 7.2-12-5.4z" fill="#a16207"/>' +
      '<path d="M80 10l-1.4-7.4 5.4 5.4M88.6 8l3-6 1 7.4z" fill="#a16207"/>' +
      '<circle cx="86" cy="15" r="1.4" fill="#1f2937"/><path d="M89.4 22l4.6 2.2-1.2 3.2-5.4-2.2z" fill="#7c4a12"/>' +
      '<path d="M70 16q7.4-8.6 15-9.6-3.2 7.4-7.4 11.6zM64 30q4-10.6 8.6-15-1 9.6-4.4 16z" fill="#5b2d0b"/>' +
      '<path d="M36 32h18v5.4H36z" fill="#7c2d12"/><path d="M54 33L82 20" stroke="#7c2d12" stroke-width="1.4" fill="none"/>' +
      '<g class="tm-jinete">' +
      '<path d="M40 34h5.4v10H40z" fill="#1e3a8a"/><path d="M37.6 44h8.6v4.6h-8.6z" fill="#92400e"/>' +
      '<path d="M37 17h12.6v17H37z" fill="#60a5fa"/><path d="M37 17h4.2v17H37zM45.4 17h4.2v17h-4.2z" fill="#92400e"/>' +
      '<path d="M37 29.4h12.6v3.2H37z" fill="#78350f"/>' +
      '<circle cx="43.4" cy="12.4" r="4.6" fill="#e8b48a"/><circle cx="41.8" cy="11.8" r=".7" fill="#1e1b4b"/><circle cx="45" cy="11.8" r=".7" fill="#1e1b4b"/>' +
      '<path d="M38.6 15.6q4.8 3 9.6 0l-1 3.4h-7.6z" fill="#dc2626"/>' +
      '<path d="M33.4 7.4q11.4-5.4 22 0-4.4 3.4-11 3.4t-11-3.4z" fill="#a16207"/><path d="M39.4 7.4q0-8 5-8t5 8z" fill="#b45309"/><path d="M39.2 5.6h11.4v2.4H39.2z" fill="#78350f"/>' +
      '<rect class="tm-arm2 r" x="48.6" y="18" width="3.6" height="13" rx="1.8" fill="#60a5fa"/>' +
      '</g></g></svg>';
    // Policía montada del Canadá
    var MONTADA = '<svg viewBox="0 0 44 78"><g class="tm-walk">' +
      '<g class="tm-leg l"><rect x="15" y="52" width="5.4" height="12" fill="#1e293b"/><rect x="19.4" y="52" width="1.4" height="12" fill="#fbbf24" opacity=".8"/><path d="M14 64h7.4v10H14z" fill="#78350f"/></g>' +
      '<g class="tm-leg r"><rect x="22" y="52" width="5.4" height="12" fill="#334155"/><rect x="26.4" y="52" width="1.4" height="12" fill="#fbbf24" opacity=".8"/><path d="M21.4 64h7.4v10h-7.4z" fill="#92400e"/></g>' +
      '<path d="M14 32h16v21H14z" fill="#dc2626"/><path d="M14 46.6h16v3.6H14z" fill="#78350f"/>' +
      '<path d="M16.4 32l12 15" stroke="#a16207" stroke-width="3" fill="none"/>' +
      '<rect class="tm-arm2 l" x="10.6" y="33" width="3.8" height="16" rx="1.9" fill="#dc2626"/>' +
      '<rect class="tm-arm2 r" x="29.6" y="33" width="3.8" height="16" rx="1.9" fill="#dc2626"/>' +
      '<circle cx="22" cy="26" r="5.2" fill="#f1c9a5"/><circle cx="20.2" cy="25.4" r=".8" fill="#1e1b4b"/><circle cx="23.8" cy="25.4" r=".8" fill="#1e1b4b"/>' +
      '<path d="M9 21q13-5.4 26 0-5 3.6-13 3.6T9 21z" fill="#a16207"/><path d="M16.4 21q0-9 5.6-9t5.6 9z" fill="#b45309"/>' +
      '<path d="M18 13.4q4 3 8 0" stroke="#78350f" stroke-width="1.4" fill="none"/>' +
      '</g></svg>';

    // Surfista con su tabla
    var SURFISTA = '<svg viewBox="0 0 56 76"><g class="tm-walk">' +
      '<ellipse cx="44" cy="40" rx="7" ry="30" fill="#f8fafc"/><path d="M44 12v56" stroke="#f97316" stroke-width="3"/>' +
      '<g class="tm-leg l"><rect x="15" y="50" width="5.4" height="20" fill="#e8b48a"/><path d="M13.6 70h8v4h-8z" fill="#0f766e"/></g>' +
      '<g class="tm-leg r"><rect x="22" y="50" width="5.4" height="20" fill="#dba97c"/><path d="M21.4 70h8v4h-8z" fill="#115e59"/></g>' +
      '<path d="M14.4 42h15v10h-15z" fill="#14b8a6"/><path d="M14.4 42h15v3h-15z" fill="#0d9488"/>' +
      '<path d="M15 31h14v12H15z" fill="#e8b48a"/>' +
      '<rect class="tm-ola" x="29" y="30" width="3.8" height="15" rx="1.9" fill="#e8b48a"/>' +
      '<rect class="tm-arm2 l" x="11.2" y="31" width="3.8" height="14" rx="1.9" fill="#e8b48a"/>' +
      '<circle cx="22" cy="25" r="5.2" fill="#f1c9a5"/>' +
      '<path d="M16.8 24q0-6 5.2-6t5.2 6q-3-2.6-5.2-2.6T16.8 24z" fill="#fde047"/>' +
      '<path d="M17.4 24.4h9.2v2.4h-9.2z" fill="#1e293b"/>' +
      '</g></svg>';

    // Kiwi de Nueva Zelanda
    var KIWI = '<svg viewBox="0 0 54 32"><g class="tm-bob">' +
      '<ellipse cx="19" cy="18" rx="15" ry="11.6" fill="#92400e"/>' +
      '<g stroke="#78350f" stroke-width="1.2" opacity=".7"><path d="M8 14q6 2 12 0M8 20q8 2 16 0M12 25q6 1 12 0"/></g>' +
      '<path d="M30 11q6 1 8 6-4 3-9 2z" fill="#a16207"/>' +
      '<circle cx="33.6" cy="13.2" r="1.6" fill="#f8fafc"/><circle cx="34" cy="13.4" r="1" fill="#1f2937"/>' +
      '<path d="M37.6 16.4l16 3.4-16 2.6z" fill="#57534e"/>' +
      '<g stroke="#44403c" stroke-width="2" stroke-linecap="round">' +
      '<g class="tm-leg l"><path d="M14 28.4v3.4"/></g><g class="tm-leg r"><path d="M23 28.4v3.4"/></g></g>' +
      '</g></svg>';

    // Escocés de las Tierras Altas, con su tartán y su escudo redondo
    var CLAN = '<svg viewBox="0 0 50 78"><g class="tm-walk">' +
      '<g class="tm-leg l"><rect x="16" y="60" width="5" height="10" fill="#fef3c7"/><path d="M13.6 70h8.4v4.4h-8.4z" fill="#44403c"/></g>' +
      '<g class="tm-leg r"><rect x="23" y="60" width="5" height="10" fill="#fde68a"/><path d="M21.4 70h8.4v4.4h-8.4z" fill="#292524"/></g>' +
      '<path d="M13.6 46h17v16h-17z" fill="#166534"/>' +
      '<g stroke="#1e293b" stroke-width="1.2" opacity=".75"><path d="M18 46v16M24 46v16M29 46v16M13.6 51h17M13.6 57h17"/></g>' +
      '<g stroke="#fbbf24" stroke-width=".8" opacity=".8"><path d="M21 46v16M26.5 46v16M13.6 48.6h17M13.6 54.6h17"/></g>' +
      '<path d="M14.6 30h15v17h-15z" fill="#fef3c7"/>' +
      '<path d="M28 29L16.6 47l4 2.4L32 31z" fill="#166534"/>' +
      '<g stroke="#1e293b" stroke-width="1" opacity=".7"><path d="M29.6 31.6L18.4 49.4M24 29.6L13.6 46.6"/></g>' +
      '<rect class="tm-arm2 l" x="11" y="31" width="3.8" height="16" rx="1.9" fill="#fef3c7"/>' +
      '<rect class="tm-arm2 r" x="29.4" y="31" width="3.8" height="16" rx="1.9" fill="#fef3c7"/>' +
      '<circle cx="22" cy="24.6" r="5.2" fill="#f1c9a5"/>' +
      '<path d="M16.8 25.6q1.4 7.4 5.2 7.4t5.2-7.4q-2.6 2.8-5.2 2.8t-5.2-2.8z" fill="#dc2626"/>' +
      '<circle cx="20.2" cy="24" r=".8" fill="#1e1b4b"/><circle cx="23.8" cy="24" r=".8" fill="#1e1b4b"/>' +
      '<path d="M15.4 20.4h13.2v3.2H15.4zM15.4 20.4q6.6-6 13.2 0z" fill="#1e3a8a"/>' +
      '<circle cx="17.2" cy="19" r="1.8" fill="#f8fafc"/><path d="M28 19q4-7 6-8-1 6-4 9z" fill="#e2e8f0"/>' +
      '<g><circle cx="10" cy="42" r="7.4" fill="#92400e"/><circle cx="10" cy="42" r="4.6" fill="none" stroke="#fbbf24" stroke-width="1.2"/><circle cx="10" cy="42" r="1.6" fill="#fbbf24"/></g>' +
      '</g></svg>';

    // Jugador de béisbol
    var BEISBOL = '<svg viewBox="0 0 52 78"><g class="tm-walk">' +
      '<g class="tm-leg l"><rect x="15.4" y="50" width="5.4" height="12" fill="#f8fafc"/><rect x="15.4" y="62" width="5.4" height="8" fill="#1e3a8a"/><path d="M13.6 70h8.4v4.4h-8.4z" fill="#111827"/></g>' +
      '<g class="tm-leg r"><rect x="22.4" y="50" width="5.4" height="12" fill="#e2e8f0"/><rect x="22.4" y="62" width="5.4" height="8" fill="#1d4ed8"/><path d="M21.6 70h8.4v4.4h-8.4z" fill="#0b1120"/></g>' +
      '<path d="M14.4 31h16v20h-16z" fill="#f8fafc"/>' +
      '<g stroke="#1e3a8a" stroke-width=".9" opacity=".7"><path d="M17.6 31v20M21.4 31v20M25.2 31v20M29 31v20"/></g>' +
      '<path d="M14.4 46.6h16v3.2h-16z" fill="#1e3a8a"/>' +
      '<path d="M19.6 31q2.8 4 5.6 0" fill="none" stroke="#dc2626" stroke-width="1.4"/>' +
      '<rect class="tm-arm2 l" x="11" y="32" width="3.8" height="15" rx="1.9" fill="#f8fafc"/>' +
      '<rect class="tm-arm2 r" x="30.2" y="32" width="3.8" height="15" rx="1.9" fill="#f8fafc"/>' +
      '<circle cx="22.4" cy="25.4" r="5.2" fill="#e8b48a"/><circle cx="20.6" cy="24.8" r=".8" fill="#1e1b4b"/><circle cx="24.2" cy="24.8" r=".8" fill="#1e1b4b"/>' +
      '<path d="M16.6 22.6q5.8-7 11.6 0z" fill="#1e3a8a"/><path d="M27 22.6h8.4v2.8H27z" fill="#1d4ed8"/><circle cx="22.4" cy="16.6" r="1.4" fill="#dc2626"/>' +
      '<path d="M33.6 46L38 15" stroke="#b45309" stroke-width="3.2" stroke-linecap="round"/><path d="M38.2 17.4L39 11" stroke="#92400e" stroke-width="4.4" stroke-linecap="round"/>' +
      '</g></svg>';

    // Arce canadiense: la copa en tonos de otoño y alguna hoja cayendo
    var ARCE = '<svg viewBox="0 0 64 80">' +
      '<path d="M29 80V48h6v32z" fill="#78350f"/><path d="M32 60l-8-8M32 52l8-8" stroke="#78350f" stroke-width="3" stroke-linecap="round"/>' +
      '<circle cx="22" cy="34" r="15" fill="#b91c1c"/><circle cx="42" cy="32" r="15" fill="#dc2626"/>' +
      '<circle cx="32" cy="20" r="14" fill="#ea580c"/><circle cx="32" cy="38" r="15" fill="#c2410c"/>' +
      '<circle cx="46" cy="44" r="10" fill="#b91c1c"/><circle cx="18" cy="46" r="10" fill="#dc2626"/>' +
      '<circle cx="24" cy="24" r="8" fill="#f97316" opacity=".55"/><circle cx="40" cy="40" r="7" fill="#fb923c" opacity=".45"/>' +
      '<g fill="#ea580c">' +
      '<path class="tm-hoja" style="animation-delay:-1s" d="M12 52v-3l-2 .6.4-1.8-2.6-1.4 1-.6-1-2 2 .4.6-1.6 1.6 1.6v-3l1 1.6 1-1.6v3l1.6-1.6.6 1.6 2-.4-1 2 1 .6-2.6 1.4.4 1.8-2-.6v3z"/>' +
      '<path class="tm-hoja" style="animation-delay:-4.5s" d="M44 48v-3l-2 .6.4-1.8-2.6-1.4 1-.6-1-2 2 .4.6-1.6 1.6 1.6v-3l1 1.6 1-1.6v3l1.6-1.6.6 1.6 2-.4-1 2 1 .6-2.6 1.4.4 1.8-2-.6v3z" fill="#dc2626"/>' +
      '<path class="tm-hoja" style="animation-delay:-7s" d="M30 54v-3l-2 .6.4-1.8-2.6-1.4 1-.6-1-2 2 .4.6-1.6 1.6 1.6v-3l1 1.6 1-1.6v3l1.6-1.6.6 1.6 2-.4-1 2 1 .6-2.6 1.4.4 1.8-2-.6v3z" fill="#f97316"/>' +
      '</g></svg>';
    // Autobús de dos pisos y taxi amarillo para la franja
    var W_BUS = '<svg viewBox="0 0 86 52"><rect x="2" y="4" width="80" height="40" rx="7" fill="#f43f5e"/><rect x="2" y="22" width="80" height="3" fill="#be123c"/>' +
      '<g fill="#e0e7ff" opacity=".85"><rect x="8" y="9" width="11" height="9" rx="2"/><rect x="23" y="9" width="11" height="9" rx="2"/><rect x="38" y="9" width="11" height="9" rx="2"/><rect x="53" y="9" width="11" height="9" rx="2"/><rect x="68" y="9" width="10" height="9" rx="2"/>' +
      '<rect x="8" y="28" width="11" height="9" rx="2"/><rect x="23" y="28" width="11" height="9" rx="2"/><rect x="38" y="28" width="11" height="9" rx="2"/><rect x="68" y="28" width="10" height="12" rx="2"/></g>' +
      '<circle cx="18" cy="45" r="6" fill="#1e1b4b"/><circle cx="66" cy="45" r="6" fill="#1e1b4b"/><circle cx="18" cy="45" r="2.4" fill="#a5b4fc"/><circle cx="66" cy="45" r="2.4" fill="#a5b4fc"/></svg>';
    var W_TAXI = '<svg viewBox="0 0 58 30"><path d="M4 18q0-6 6-6h6l6-8h16l7 8h5q4 0 4 5v7H4Z" fill="#f59e0b"/><rect x="22" y="1" width="12" height="4" rx="1" fill="#fcd34d"/>' +
      '<path d="M24 6h12l5 6H20Z" fill="#e0e7ff" opacity=".8"/><path d="M4 20h50" stroke="#1e1b4b" stroke-dasharray="3 3" stroke-width="1.5"/>' +
      '<circle cx="15" cy="25" r="4.5" fill="#1e1b4b"/><circle cx="45" cy="25" r="4.5" fill="#1e1b4b"/></svg>';

    // Reparto: posición dentro de la baldosa (%), ancho en píxeles y si se
    // mantiene en móvil (los marcados "opt" se ocultan para no amontonarse).
    // "par" es el personaje con el que se saluda: se colocan de dos en dos y
    // mirándose, para que el saludo se entienda.
    var REPARTO = [
      { n: "guardia",   x: 3,  w: 26, html: GUARDIA,  paso: "desfile",  gesto: "firmes",    say: ["Hello!", "Good morning!"], par: 1 },
      { n: "corgi",     x: 9,  w: 30, html: CORGI,    paso: "menudo",   gesto: "ladra", b: 12, mira: "izq", say: ["Woof!", "Hello!"], par: 0 },
      { n: "gaitero",   x: 18, w: 32, html: GAITERO,  paso: "solemne",  gesto: "toca",      opt: true, say: ["Hullo!", "Och, aye!"], par: 3 },
      { n: "escocés",   x: 26, w: 32, html: CLAN,     paso: "solemne",  opt: true, mira: "izq", say: ["Hullo there!", "Grand day!"], par: 2 },
      { n: "duende",    x: 34, w: 50, html: '<div class="tm-lep">' + LEP + '</div><div class="tm-pot">' + POT + '</div>', lep: true, say: ["Top o' the mornin'!", "Dia duit!"] },
      { n: "vaquero",   x: 43, w: 58, html: VAQUERO,  paso: "trote",    gesto: "encabrita", say: ["Howdy!", "Howdy, partner!"], par: 6 },
      { n: "béisbol",   x: 53, w: 34, html: BEISBOL,  paso: "atlético", gesto: "batea",     opt: true, mira: "izq", say: ["Play ball!", "Hi there!"], par: 5 },
      { n: "montada",   x: 61, w: 28, html: MONTADA,  paso: "solemne",  opt: true, say: ["Hi there!", "How's it going?"] },
      { n: "arce",      x: 68, w: 40, html: ARCE,     b: 0, arbol: true },
      { n: "canguro",   x: 77, w: 46, html: ROO,      roo: true, say: ["G'day, mate!", "No worries!"], par: 10 },
      { n: "surfista",  x: 85, w: 36, html: SURFISTA, paso: "tranquilo", opt: true, mira: "izq", say: ["G'day!", "Awesome!"], par: 9 },
      { n: "kiwi",      x: 94, w: 30, html: KIWI,     paso: "menudo",   gesto: "otea", b: 12, say: ["Kia ora!"] }
    ];

    var worldEl = null, worldLayers = [], tileW = 1200;
    function mundo() {
      var w = el("div", "tm-world no-print");
      w.setAttribute("aria-hidden", "true");
      [["tm-w-far", .10, 4, W_FAR], ["tm-w-mid", .24, 9, W_MID], ["tm-w-near", .46, 16, W_NEAR]].forEach(function (c) {
        var l = el("div", "tm-wl " + c[0]);
        l.setAttribute("data-tw-speed", c[1]); l.setAttribute("data-tw-depth", c[2]);
        var tile = el("div", "tm-wtile", c[3]);
        if (c[0] === "tm-w-near") REPARTO.forEach(function (p, idx) {
          if (reduce && (p.lep || p.roo)) return;
          var ch = el("div", "tm-ch anda" + (p.opt ? " tm-ch-opt" : ""),
            '<span class="tm-flip"><span class="tm-fig">' + p.html + '</span></span>');
          ch.style.left = p.x + "%"; ch.style.width = p.w + "px";
          if (p.b != null) ch.style.bottom = p.b + "px";
          // el duende y su olla van colocados uno al lado del otro, como en la portada
          if (p.lep) ch.style.height = Math.round(p.w * 0.72) + "px";
          if (p.mira) ch.setAttribute("data-mira", p.mira);
          if (p.paso) ch.setAttribute("data-paso", p.paso);
          ch.setAttribute("data-i", idx);
          tile.appendChild(ch);
        });
        l.appendChild(tile);
        w.appendChild(l);
        worldLayers.push(l);
      });
      if (!reduce) {
        w.appendChild(el("div", "tm-wmover tm-wbus", W_BUS));
        w.appendChild(el("div", "tm-wmover tm-wtaxi", W_TAXI));
      }
      var bg = doc.querySelector(".tm-bg");
      if (bg && bg.parentNode) bg.parentNode.insertBefore(w, bg.nextSibling);
      else doc.body.insertBefore(w, doc.body.firstChild);
      worldEl = w;
      ajustarMundo();
    }
    // Tantas copias de la baldosa como hagan falta para cubrir la ventana.
    function ajustarMundo() {
      if (!worldEl) return;
      var h = worldEl.offsetHeight || 300;
      tileW = Math.round(h * 5);
      worldEl.style.setProperty("--tw-tile", tileW + "px");
      var n = Math.ceil(window.innerWidth / tileW) + 1;
      worldLayers.forEach(function (l) {
        while (l.children.length < n) {
          var copia = l.firstElementChild.cloneNode(true);
          // la copia no hereda el gesto ni la agenda del original
          Array.prototype.forEach.call(copia.querySelectorAll(".tm-ch"), function (ch) {
            ch.classList.remove("quieto", "saluda", "salta", "firmes", "ladra", "toca", "batea", "encabrita", "otea");
            ch.classList.add("anda");
            delete ch.dataset.vive; delete ch.dataset.ocupado;
            Array.prototype.forEach.call(ch.querySelectorAll(".tm-say"), function (b) { b.remove(); });
          });
          l.appendChild(copia);
        }
        while (l.children.length > n) l.removeChild(l.lastElementChild);
      });
      animarReparto();
    }
    // --- gestos, saludos entre vecinos y reacción al ratón
    var GESTOS = ["anda", "quieto", "saluda", "salta", "firmes", "ladra", "toca", "batea", "encabrita", "otea"];
    function estado(ch, s) {
      for (var i = 0; i < GESTOS.length; i++) ch.classList.remove(GESTOS[i]);
      ch.classList.add(s);
    }
    function frase(i) {
      var p = REPARTO[i], l = (p && p.say) || ["Hello!"];
      return l[Math.floor(Math.random() * l.length)];
    }
    function habla(ch, texto) {
      var b = el("span", "tm-say");
      b.textContent = texto;
      ch.appendChild(b);
      setTimeout(function () { b.remove(); }, 2500);
    }
    // No todos a la vez: como mucho dos conversaciones a la vista y un hueco
    // entre saludos espontáneos, para que la franja no parezca un gallinero.
    var ultSaludo = 0;
    function saludar(ch, conVecino, porElRaton) {
      if (reduce || ch.dataset.ocupado === "1") return;
      if (worldEl && worldEl.querySelectorAll(".tm-say").length >= 3) return;
      var ahora = Date.now();
      if (!porElRaton && ahora - ultSaludo < 2800) return;
      ultSaludo = ahora;
      var i = +ch.getAttribute("data-i"), p = REPARTO[i];
      ch.dataset.ocupado = "1";
      estado(ch, "saluda");
      habla(ch, frase(i));
      if (conVecino && p && p.par != null && ch.parentNode) {
        var otro = ch.parentNode.querySelector('.tm-ch[data-i="' + p.par + '"]');
        if (otro && otro.dataset.ocupado !== "1" && otro.offsetParent !== null) {
          otro.dataset.ocupado = "1";
          setTimeout(function () {
            estado(otro, "saluda");
            habla(otro, frase(p.par));
            setTimeout(function () { otro.dataset.ocupado = ""; estado(otro, "anda"); }, 2400);
          }, 640);
        }
      }
      setTimeout(function () { ch.dataset.ocupado = ""; estado(ch, "anda"); }, 2600);
    }
    // cada personaje lleva su propia agenda: anda, se para, pega un salto o
    // saluda al de al lado, a intervalos distintos para que no vayan a una
    function agenda(ch) {
      setTimeout(function paso() {
        if (!ch.isConnected) return;
        if (!doc.hidden && ch.dataset.ocupado !== "1" && ch.offsetParent !== null) {
          var propio = (REPARTO[+ch.getAttribute("data-i")] || {}).gesto;
          var r = Math.random();
          if (r < .20) saludar(ch, true);
          else if (r < .40 && propio) {
            estado(ch, propio);
            setTimeout(function () { if (ch.dataset.ocupado !== "1") estado(ch, "anda"); }, 2200);
          } else if (r < .58) {
            estado(ch, "quieto");
            setTimeout(function () { if (ch.dataset.ocupado !== "1") estado(ch, "anda"); }, 1800 + Math.random() * 3000);
          } else if (r < .70) {
            estado(ch, "salta");
            setTimeout(function () { if (ch.dataset.ocupado !== "1") estado(ch, "anda"); }, 1700);
          } else estado(ch, "anda");
        }
        setTimeout(paso, 3500 + Math.random() * 9000);
      }, 1500 + Math.random() * 9000);
    }
    function animarReparto() {
      if (reduce || !worldEl) return;
      Array.prototype.forEach.call(worldEl.querySelectorAll(".tm-ch"), function (ch) {
        if (ch.dataset.vive === "1") return;
        ch.dataset.vive = "1";
        var p = REPARTO[+ch.getAttribute("data-i")];
        if (p && p.arbol) return;   // el arce ya suelta sus hojas por su cuenta
        agenda(ch);
      });
    }
    var ultRaton = 0;
    function ratonSaluda(e) {
      if (reduce || !worldEl) return;
      var ahora = Date.now();
      if (ahora - ultRaton < 260) return;
      var caja = worldEl.getBoundingClientRect();
      if (e.clientY < caja.top - 30) return;
      ultRaton = ahora;
      var mejor = null, mejorD = 64;
      Array.prototype.forEach.call(worldEl.querySelectorAll(".tm-ch"), function (ch) {
        if (ch.dataset.ocupado === "1" || ch.offsetParent === null) return;
        var p = REPARTO[+ch.getAttribute("data-i")];
        if (p && p.arbol) return;
        var r = ch.getBoundingClientRect();
        if (!r.width) return;
        var d = Math.abs(r.left + r.width / 2 - e.clientX);
        if (d < mejorD) { mejorD = d; mejor = ch; }
      });
      if (!mejor) return;
      // se vuelve hacia el ratón y luego saluda
      var r2 = mejor.getBoundingClientRect(), antes = mejor.getAttribute("data-mira");
      mejor.setAttribute("data-mira", e.clientX < r2.left + r2.width / 2 ? "izq" : "der");
      saludar(mejor, false, true);
      setTimeout(function () {
        if (antes) mejor.setAttribute("data-mira", antes); else mejor.removeAttribute("data-mira");
      }, 2700);
    }

    var ultOpac = -1;
    function moverMundo(y, tx) {
      // en lo alto de la página manda la escena de la portada: el paisaje
      // aparece poco a poco en cuanto se empieza a bajar
      var k = y < 120 ? 0 : (y > 460 ? 1 : (y - 120) / 340);
      if (worldEl && Math.abs(k - ultOpac) > .02) {
        ultOpac = k;
        worldEl.style.opacity = k >= 1 ? "" : "calc(var(--tw-op) * " + k.toFixed(2) + ")";
      }
      for (var i = 0; i < worldLayers.length; i++) {
        var l = worldLayers[i];
        var sp = +l.getAttribute("data-tw-speed"), d = +l.getAttribute("data-tw-depth");
        var off = ((y * sp + tx * d) % tileW + tileW) % tileW;
        l.style.transform = "translate3d(" + (-off).toFixed(1) + "px,0,0)";
      }
    }

    // ------------------------------------------------------------------ el cielo
    var PAJAROS = '<svg viewBox="0 0 60 20"><path d="M2 10q5-7 10 0"/><path d="M14 10q5-7 10 0"/><path d="M22 5q5-7 10 0"/><path d="M36 11q5-7 10 0"/></svg>';
    var GLOBO = '<svg viewBox="0 0 40 58"><path d="M20 2q14 0 14 15 0 11-14 23Q6 28 6 17 6 2 20 2z" fill="#f472b6"/>' +
      '<path d="M20 2q5 0 5 15 0 11-5 23-5-12-5-23 0-15 5-15z" fill="#fbbf24" opacity=".85"/>' +
      '<path d="M14 40h12l-2 6H16z" fill="#92400e"/><path d="M15 40l2-4M25 40l-2-4" stroke="#78350f" stroke-width="1"/></svg>';
    function cielo() {
      var sk = el("div", "tm-weather no-print");
      sk.setAttribute("aria-hidden", "true");
      sk.appendChild(el("i", "tm-astro"));
      [[8, 190, 110], [17, 140, 86], [28, 230, 140], [38, 120, 96]].forEach(function (c) {
        var cl = el("i", "tm-wcloud");
        cl.style.top = c[0] + "%"; cl.style.width = c[1] + "px";
        cl.style.animationDuration = c[2] + "s"; cl.style.animationDelay = -rnd(0, c[2]) + "s";
        sk.appendChild(cl);
      });
      if (!reduce) {
        var p = el("div", "tm-bird", PAJAROS);
        p.style.top = "22%"; p.style.animationDelay = "-26s";
        sk.appendChild(p);
        var p2 = el("div", "tm-bird", PAJAROS);
        p2.style.top = "34%"; p2.style.width = "40px"; p2.style.animationDelay = "-58s";
        sk.appendChild(p2);
        sk.appendChild(el("div", "tm-globo", GLOBO));
      }
      var bg = doc.querySelector(".tm-bg");
      if (bg && bg.parentNode) bg.parentNode.insertBefore(sk, bg.nextSibling);
      else doc.body.insertBefore(sk, doc.body.firstChild);
    }

    // ------------------------------------------------------------------ música y efectos
    var KEY = "nc-portal-musica";
    var prefs = { music: true };
    try { prefs = Object.assign(prefs, JSON.parse(localStorage.getItem(KEY) || "{}")); } catch (e) { /* nada */ }
    function musicButton() {
      var actions = doc.querySelector(".header-actions");
      if (!actions) return;
      var b = el("button", "icon-btn tm-music");
      b.type = "button";
      b.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18V5l11-2v13" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><circle cx="6.5" cy="18" r="2.5" fill="currentColor"/><circle cx="17.5" cy="16" r="2.5" fill="currentColor"/><path class="tm-slash" d="M3 3l18 18" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>';
      function paint() {
        b.classList.toggle("tm-off", !prefs.music);
        b.title = prefs.music ? "Quitar la música de fondo" : "Poner música de fondo";
        b.setAttribute("aria-label", b.title);
        b.setAttribute("aria-pressed", prefs.music ? "true" : "false");
      }
      b.addEventListener("click", function () {
        prefs.music = !prefs.music;
        try { localStorage.setItem(KEY, JSON.stringify(prefs)); } catch (e) { /* nada */ }
        SND.setPrefs({ music: prefs.music, sfx: true, musicVol: 0.5 });
        paint();
      });
      paint();
      actions.insertBefore(b, actions.firstChild);
    }
    SND.setMode("menu");
    SND.setPrefs({ music: prefs.music, sfx: true, musicVol: 0.5 });

    // Sonidos: al abrir una app, al cambiar de tema y (suave) al pasar por las tarjetas.
    doc.addEventListener("click", function (e) {
      var t = e.target;
      if (!t || !t.closest) return;
      if (t.closest("#themeBtn")) { SND.sfx("tema"); return; }
      var a = t.closest("a[href]");
      if (a && a.target === "_blank" && a.closest(".card, .modal")) SND.sfx("abrir");
    }, true);
    var lastHover = 0;
    doc.addEventListener("mouseover", function (e) {
      if (!fine || !e.target || !e.target.closest) return;
      var c = e.target.closest(".card");
      if (!c || (e.relatedTarget && c.contains(e.relatedTarget))) return;
      var now = Date.now();
      if (now - lastHover > 700) { lastHover = now; SND.sfx("hover"); }
    });

    // ------------------------------------------------------------------ arranque
    function start() {
      var hero = doc.querySelector("section.hero");
      if (hero) {
        var sc = scene(hero);
        layers = Array.prototype.slice.call(sc.querySelectorAll("[data-tm-speed]"));
        hellos(sc);
      }
      background();
      cielo();
      mundo();
      window.addEventListener("resize", ajustarMundo, { passive: true });
      if (fine && !reduce) window.addEventListener("mousemove", ratonSaluda, { passive: true });
      bar = el("div", "tm-progress no-print"); bar.setAttribute("aria-hidden", "true");
      doc.body.appendChild(bar);
      musicButton();
      if (!reduce) {
        if (fine) window.addEventListener("mousemove", function (e) { mx = e.clientX / window.innerWidth - 0.5; }, { passive: true });
        requestAnimationFrame(frame);
      } else {
        window.addEventListener("scroll", function () {
          var h = root.scrollHeight - window.innerHeight;
          bar.style.width = (h > 0 ? window.scrollY / h * 100 : 0) + "%";
        }, { passive: true });
        bgIcons.forEach(function (ic) { ic.el.style.top = ic.y + "%"; });
      }
    }
    if (doc.readyState === "loading") doc.addEventListener("DOMContentLoaded", start); else start();
  } catch (err) {
    // La decoración nunca debe romper el portal.
    if (window.console) console.warn("tema decorativo desactivado:", err);
  }
})();
