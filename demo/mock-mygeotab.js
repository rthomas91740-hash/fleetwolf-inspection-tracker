// Local preview only: a fake MyGeotab API with made-up inspections. Never shipped to MyGeotab.
(function () {
  'use strict';
  var DAY = 86400000, now = Date.now(), seed = 7;
  function rand() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }
  function pick(a) { return a[Math.floor(rand() * a.length)]; }
  var devices = [], trailers = [], users = [];
  for (var i = 1; i <= 14; i++) devices.push({ id: 'd' + i, name: 'Truck ' + String(i).padStart(2, '0') });
  for (i = 1; i <= 5; i++) trailers.push({ id: 't' + i, name: 'Trailer ' + String(i).padStart(2, '0') });
  [['Casey', 'North'], ['Jordan', 'South'], ['Sam', 'Rivera'], ['Alex', 'Kim'], ['Taylor', 'Reed']].forEach(function (n, j) { users.push({ id: 'u' + j, name: 'driver' + j + '@demo.invalid', firstName: n[0], lastName: n[1] }); });
  var defects = [['Air Brake System', 'Brakes'], ['Leaking air', 'Brakes (Service)'], ['Horn', 'Cab'], ['Windshield Wiper/Washer', 'Cab'], ['Tire tread low', 'Tires'], ['Headlight out', 'Lights'], ['Turn signal', 'Lights'], ['Mirror cracked', 'Cab'], ['Coupling device', 'Coupling'], ['Oil leak', 'Engine']];
  var logs = [];
  for (var back = 0; back < 400; back++) {
    var day = new Date(now - back * DAY); day.setHours(6, 0, 0, 0);
    var wd = day.getDay(); if (wd === 0 || (wd === 6 && rand() < 0.7)) continue;
    devices.concat(trailers).forEach(function (a, k) {
      if (rand() < 0.15) return;
      var isTrailer = a.id[0] === 't';
      ['PreTrip', 'PostTrip'].concat(rand() < 0.05 ? ['InTrip'] : []).forEach(function (type, n) {
        if (type === 'PostTrip' && rand() < 0.3) return;
        var beta = back < 100 && (k % 3 === 0 || rand() < back / -200 + 0.5);
        var t = day.getTime() + n * 9 * 3600000 + Math.floor(rand() * 3600000);
        var defs = [];
        if (rand() < 0.12) {
          var count = rand() < 0.2 ? 2 : 1;
          for (var c = 0; c < count; c++) {
            var d = pick(defects), r = rand(), ageDays = back;
            var st = ageDays < 4 && r < 0.6 ? 'NotRepaired' : r < 0.1 ? 'NotRepaired' : r < 0.85 ? 'Repaired' : 'NotNecessary';
            defs.push({ id: 'x' + logs.length + c, defect: { id: 'g' + d[0], name: d[0] }, part: { id: 'p' + d[1], name: d[1] }, repairStatus: st, repairDateTime: st === 'NotRepaired' ? undefined : new Date(t + (1 + rand() * 3) * DAY).toISOString(), defectRemarks: [{ remark: pick(['Found on walkaround', 'Driver noticed', 'Needs shop', '']) }] });
          }
        }
        var log = { id: 'L' + logs.length, dateTime: new Date(t).toISOString(), driver: { id: pick(users).id }, logType: type, defectList: beta ? { id: 'b2', name: 'Beta: Standard Truck Checklist' } : { id: 'b1', name: 'Default Vehicle Defects List' }, isSafeToOperate: !defs.some(function (x) { return x.defect.name === 'Air Brake System'; }), certifyDate: defs.length && rand() < 0.8 ? new Date(t + DAY).toISOString() : undefined, dVIRDefects: defs, driverRemark: '' };
        if (isTrailer) { log.trailer = { id: a.id }; log.device = { id: 'NoDeviceId' }; } else log.device = { id: a.id };
        logs.push(log);
      });
    });
  }
  window.FwDemoApi = {
    getSession: function (cb) { cb({ database: 'demo', userName: 'demo@demo.invalid' }); },
    call: function (method, p, ok) {
      setTimeout(function () {
        if (p.typeName === 'Device') return ok(devices);
        if (p.typeName === 'Trailer') return ok(trailers);
        if (p.typeName === 'User') return ok(users);
        if (p.typeName === 'DVIRLog') {
          var f = Date.parse(p.search.fromDate), to = Date.parse(p.search.toDate);
          return ok(logs.filter(function (l) { var t = Date.parse(l.dateTime); return t >= f && t < to; }).slice(0, p.resultsLimit));
        }
        ok([]);
      }, 20);
    }
  };
})();
