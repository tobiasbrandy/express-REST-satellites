module.exports = async function(app, path, options = {}) {
  options.url = path;
  var new_req, new_res;
  if (options.original_req) {
    new_req = options.original_req;
    for (var i in options) {
      if (i == "original_req") continue;
      new_req[i] = options[i];
    }
  } else {
    new_req = createReq(path, options);
  }

  let code, data, headers;
  new_res = createRes((c, d, h) => {
    code = c, data = d, headers = h;
  });

  try {
    await app(new_req, new_res);
  } catch(e) {
    console.log(e);
  }

  return { code, data, headers }
};

function createReq(path, options) {
  if (!options) options = {};
  let req = {
    method: options.method    || "GET",
    host: options.host        || "",
    cookies: options.cookies  || {},
    query: options.query      || {},
    url: options.url          || path,
    headers: options.headers  || {},
    ...options
  };
  req.method = req.method.toUpperCase();
  return req;
}
function createRes(callback) {
  var res = {
    _removedHeader: {},
    _statusCode: 200,
    statusMessage: 'OK',
    get statusCode() {
      return this._statusCode
    },
    set statusCode(status) {
      this._statusCode = status
      this.status(status)
    }
  };

  var headers = {};
  var code = 200;
  res.set = res.header = (x, y) => {
    if (arguments.length === 2) {
      res.setHeader(x, y);
    } else {
      for (var key in x) {
        res.setHeader(key, x[key]);
      }
    }
    return res;
  }
  res.setHeader = (x, y) => {
    headers[x] = y;
    headers[x.toLowerCase()] = y;
    return res;
  };
  res.getHeader = (x) => headers[x];

  res.redirect = function(_code, url) {
    if (!isNumber(_code)) {
      code = 301;
      url = _code;
    } else {
      code = _code;
    }
    res.setHeader("Location", url);
    res.end();
  };
  res.status = res.sendStatus = function(number) {
    code = number;
    return res;
  };
  res.end = res.send = res.json = res.write = function(data) {
    if (callback) callback(code, data, headers);
  };
  return res;
}

// Lodash functions reimplemented
function isNumber(value) {
  return typeof value == 'number'
  || (value != null && typeof value == 'object' && Object.prototype.toString.call(value) == '[object Number]')
}
