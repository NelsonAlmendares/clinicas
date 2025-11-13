var request = require('request');

// Configuración del request para obtener el token
var options = {
  method: 'POST',
  url: 'https://g0575431ea754e6-clinicas.adb.us-ashburn-1.oraclecloudapps.com/ords/admin/oauth/token',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': 'Basic a1pSZVpyUmdpQ2dDbDNBTTc4Nll4QS4uOmN3YmpaNTRRUVNVV0ZRcTFzOFp1Z1EuLg=='
  },
  form: {
    'grant_type': 'client_credentials'
  }
};

// Solicitud para obtener el token
request(options, function (error, response) {
  if (error) throw new Error(error);

  // Parseamos la respuesta JSON
  var data = JSON.parse(response.body);

  // Guardamos el token en una variable
  var token = data.access_token;

  console.log(token);

  /*
    var apiOptions = {
        method: 'GET',
        url: 'https://g0575431ea754e6-clinicas.adb.us-ashburn-1.oraclecloudapps.com/ords/admin/api/pacientes', // Ejemplo
        headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
        }
    };

    request(apiOptions, function (err, res) {
        if (err) throw new Error(err);
        console.log(res.body.Authorization);
    });
  */
});
