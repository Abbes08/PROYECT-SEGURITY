module.exports = {

  // Lógica que valida si un teléfono está correcto...
  is_valid_phone: function (phone) {
      
      var isValid = false;
   
      var re = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/i;

   
      try {
          isValid = re.test(phone);
      } catch (e) {
          console.log(e);
      } 
      return isValid;
  },

  // Validar y sanitizar mensaje
  validateMessage: function(msg) {
      var obj = JSON.parse(msg);
      
      // Función para sanitizar mensajes y evitar inyecciones de script
      function escapeHTML(text) {
          return text.replace(/[&<>"']/g, function (match) {
              const escapeChars = {
                  '&': '&amp;',
                  '<': '&lt;',
                  '>': '&gt;',
                  '"': '&quot;',
                  "'": '&#39;',
              };
              return escapeChars[match];
          });
      }

      
      obj.mensaje = escapeHTML(obj.mensaje);

    
      if (this.is_valid_phone(obj.mensaje)) {
          console.log("Es un teléfono!");
          obj.mensaje = this.getEmbeddedCode(obj.mensaje);
      } 
      // Validar si es una URL
      else if (isValidURL(obj.mensaje)) {
          console.log("Es una URL!");
          let mediaType = detectMediaType(obj.mensaje);
          if (mediaType === 'image') {
              obj.mensaje = `<img src="${obj.mensaje}" width="200" />`;
          } else if (mediaType === 'video') {
              obj.mensaje = `<video width="300" controls><source src="${obj.mensaje}" type="video/mp4"></video>`;
          }
      } 
      // Si es un texto normal
      else {
          console.log("Es texto!");
      }

      return JSON.stringify(obj);
  }
};

// Función para validar URLs
function isValidURL(url) {
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocolo
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // dominio
  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // IP
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // puerto y ruta
  '(\\?[;&a-z\\d%_.~+=-]*)?'+ // cadena de consulta
  '(\\#[-a-z\\d_]*)?$','i'); // fragmento
  return !!pattern.test(url);
}

// Función para detectar si una URL es imagen o video
function detectMediaType(url) {
  if (url.match(/\.(jpeg|jpg|gif|png)$/i)) {
      return 'image';
  } else if (url.match(/\.(mp4|webm|ogg)$/i)) {
      return 'video';
  }
  return 'text';
}
